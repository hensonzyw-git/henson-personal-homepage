"""Run on ECS with a disposable stage; starts Nginx on loopback only."""
import base64
import json
import os
from pathlib import Path
import subprocess
import sys
import time
import urllib.request
import urllib.error
import uuid

stage = Path(sys.argv[1]).resolve()
password = str(uuid.uuid4())
hashed = subprocess.run(['openssl', 'passwd', '-6', '-stdin'], input=password + '\n', text=True, capture_output=True, check=True).stdout.strip()
(stage / 'htpasswd').write_text('test:' + hashed + '\n')
(stage / 'dashboard/data.json').write_text('{"private":true}')
locations = (stage / 'ops/nginx-server.conf').read_text().replace('/var/lib/homepage-analytics/dashboard/', str(stage / 'dashboard') + '/').replace('/etc/nginx/homepage-analytics.htpasswd', str(stage / 'htpasswd')).replace('/var/log/homepage-analytics/events.log', str(stage / 'events.log'))
config = f'''pid {stage}/nginx.pid;
error_log {stage}/error.log;
events {{ worker_connections 128; }}
http {{
    include /etc/nginx/mime.types;
    access_log off;
    include {stage}/ops/nginx-http.conf;
    server {{
        listen 127.0.0.1:18888;
        server_name localhost;
        {locations}
        location / {{ return 404; }}
    }}
}}
'''
(stage / 'nginx.conf').write_text(config)
command = ['nginx', '-p', str(stage), '-c', str(stage / 'nginx.conf')]
subprocess.run(command + ['-t'], check=True)
subprocess.run(command, check=True)

def request(path, headers=None, method='GET'):
    req = urllib.request.Request('http://127.0.0.1:18888' + path, headers=headers or {}, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, response.read(), response.headers
    except urllib.error.HTTPError as response:
        return response.code, response.read(), response.headers

try:
    time.sleep(.3)
    for path in ('/analytics/', '/analytics/data.json', '/analytics/dashboard.js', '/analytics/dashboard.css', '/analytics/site.css', '/analytics//data.json', '/analytics/%64ata.json'):
        status, body, headers = request(path)
        assert status == 401, (path, status)
        assert b'"private":true' not in body
        assert headers['Cache-Control'] == 'no-store'
    bad = {'Authorization': 'Basic ' + base64.b64encode(b'test:wrong').decode()}
    assert request('/analytics/data.json', bad)[0] == 401
    valid = {'Authorization': 'Basic ' + base64.b64encode(('test:' + password).encode()).decode()}
    for path in ('/analytics/', '/analytics/data.json', '/analytics/dashboard.js', '/analytics/dashboard.css', '/analytics/site.css'):
        status, body, headers = request(path, valid)
        assert status == 200, (path, status, body)
        assert headers['X-Robots-Tag'] == 'noindex, nofollow, noarchive'
    for path in ('/data.json', '/events.log', '/htpasswd'):
        assert request(path)[0] == 404
    event = '/_events?e=pageview&p=%2F&v=11111111-1111-4111-a111-111111111111&r=google.com&t='
    headers = {'Referer': 'https://zhuyawei.com/', 'X-Homepage-Event': '1', 'User-Agent': 'Mozilla/5.0 Safari/605.1.15'}
    assert request(event)[0] == 403
    assert request(event, headers, 'POST')[0] == 405
    assert request(event + '&extra=' + 'x' * 2050, headers)[0] == 414
    assert request(event, headers)[0] == 200
    statuses = [request(event, headers)[0] for _ in range(60)]
    assert 429 in statuses, statuses
    time.sleep(.2)
    rows = [json.loads(line) for line in (stage / 'events.log').read_text().splitlines()]
    assert rows and all(r['status'] == '200' for r in rows)
    subprocess.run(['python3', str(stage / 'ops/aggregate.py'), '--logs', str(stage), '--pages', str(stage / 'pages.json'), '--output', str(stage / 'result.json')], check=True)
    result = json.loads((stage / 'result.json').read_text())
    assert result['windows']['1']['pv'] == 1, result['windows']['1']
    print('PASS: dashboard/assets/data require valid password, unknown paths stay private, collector validation and rate limit work, real Nginx logs aggregate to one deduplicated view.')
finally:
    subprocess.run(command + ['-s', 'quit'], check=True)
