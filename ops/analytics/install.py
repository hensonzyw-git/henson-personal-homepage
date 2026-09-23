#!/usr/bin/env python3
"""Install staged analytics after release approval. Run as root on ECS."""
import grp
import json
import os
from pathlib import Path
import pwd
import re
import shutil
import subprocess
import sys
from datetime import datetime

# Validate before mutating the server; only a hash travels over SSH stdin.
try:
    credentials = json.load(sys.stdin)
    username, password_hash = credentials['username'], credentials['passwordHash']
    if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_.-]{0,31}', username):
        raise ValueError()
    if not re.fullmatch(r'\$6\$[A-Za-z0-9./]{1,16}\$[A-Za-z0-9./]{86}', password_hash):
        raise ValueError()
    if 'password' in credentials:
        raise ValueError()
except (ValueError, KeyError, TypeError):
    raise SystemExit('Invalid hash-only credential configuration; rerun analytics:configure.')

stage = Path(sys.argv[1]).resolve()
sites = [Path('/etc/nginx/sites-available/zhuyawei.com'),
         Path('/etc/nginx/sites-enabled/zhuyawei.com')]
# This host uses a copied enabled file, not a symlink. Update both independently.
sources = {site: site.read_text() for site in sites}
marker = '    include /etc/nginx/snippets/homepage-analytics.conf;'
anchor = '    root /var/www/zhuyawei.com/current;'
if any(source.count(anchor) != 1 for source in sources.values()):
    raise SystemExit('Unexpected vhost shape; inspect configuration before installing.')
if not (stage / 'pages.json').is_file():
    raise SystemExit('Missing built route manifest.')
try:
    pwd.getpwnam('homepage-analytics')
except KeyError:
    subprocess.run(['useradd', '--system', '--user-group', '--no-create-home', '--shell', '/usr/sbin/nologin', 'homepage-analytics'], check=True)
uid = pwd.getpwnam('homepage-analytics').pw_uid
www = grp.getgrnam('www-data').gr_gid
analytics_group = grp.getgrnam('homepage-analytics').gr_gid
for target in ('/opt/homepage-analytics', '/var/lib/homepage-analytics/dashboard', '/var/log/homepage-analytics', '/etc/nginx/snippets'):
    Path(target).mkdir(parents=True, exist_ok=True)
os.chown('/var/lib/homepage-analytics/dashboard', uid, www)
os.chmod('/var/lib/homepage-analytics/dashboard', 0o750)
os.chown('/var/log/homepage-analytics', 0, analytics_group)
os.chmod('/var/log/homepage-analytics', 0o750)
log = Path('/var/log/homepage-analytics/events.log')
log.touch(exist_ok=True)
os.chown(log, pwd.getpwnam('www-data').pw_uid, analytics_group)
os.chmod(log, 0o640)

# Keep a bounded operator-visible backup before replacing configuration/code.
backup = Path('/var/backups/homepage-analytics') / datetime.now().strftime('%Y%m%d-%H%M%S')
backup.mkdir(parents=True, mode=0o700)
for site in sites:
    shutil.copy2(site, backup / (site.parent.name + '-zhuyawei.com'))
files = {
    stage / 'ops/aggregate.py': Path('/opt/homepage-analytics/aggregate.py'),
    stage / 'pages.json': Path('/opt/homepage-analytics/pages.json'),
    stage / 'ops/nginx-http.conf': Path('/etc/nginx/conf.d/homepage-analytics.conf'),
    stage / 'ops/nginx-server.conf': Path('/etc/nginx/snippets/homepage-analytics.conf'),
    stage / 'ops/homepage-analytics.service': Path('/etc/systemd/system/homepage-analytics.service'),
    stage / 'ops/homepage-analytics.timer': Path('/etc/systemd/system/homepage-analytics.timer'),
    stage / 'ops/logrotate.conf': Path('/etc/logrotate.d/homepage-analytics'),
}
for name in ('index.html', 'dashboard.js', 'dashboard.css', 'site.css'):
    files[stage / 'dashboard' / name] = Path('/var/lib/homepage-analytics/dashboard') / name
old = {str(target): target.read_bytes() if target.exists() else None for target in files.values()}
(backup / 'previous-files.json').write_text(json.dumps({k: v.decode() if v is not None else None for k, v in old.items()}))
password_file = Path('/etc/nginx/homepage-analytics.htpasswd')
old_password = password_file.read_bytes() if password_file.exists() else None
timer_was_active = subprocess.run(['systemctl', 'is-active', '--quiet', 'homepage-analytics.timer']).returncode == 0
try:
    # Reconfiguration takes effect only during this explicitly authorized deployment.
    temporary_password = password_file.with_suffix('.tmp')
    descriptor = os.open(temporary_password, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    try:
        with os.fdopen(descriptor, 'w') as handle:
            handle.write(username + ':' + password_hash + '\n')
        os.chown(temporary_password, 0, www)
        os.chmod(temporary_password, 0o640)
        temporary_password.replace(password_file)
    finally:
        temporary_password.unlink(missing_ok=True)
    for origin, target in files.items():
        shutil.copyfile(origin, target)
        os.chmod(target, 0o644)
    for site, source in sources.items():
        if marker in source:
            continue
        candidate = source.replace(anchor, marker + '\n' + anchor)
        # Existing deploy verifier requires UTF-8 on llms.txt; preserve any configured charset.
        if 'charset utf-8;' not in candidate:
            candidate = candidate.replace(marker, marker + '\n    charset utf-8;')
        site.write_text(candidate)
    subprocess.run(['nginx', '-t'], check=True)
    subprocess.run(['systemctl', 'daemon-reload'], check=True)
    subprocess.run(['systemctl', 'start', 'homepage-analytics.service'], check=True)
    subprocess.run(['systemctl', 'enable', '--now', 'homepage-analytics.timer'], check=True)
    subprocess.run(['systemctl', 'reload', 'nginx'], check=True)
except Exception:
    if old_password is None:
        password_file.unlink(missing_ok=True)
    else:
        password_file.write_bytes(old_password)
    if not timer_was_active:
        subprocess.run(['systemctl', 'disable', '--now', 'homepage-analytics.timer'])
    for site, source in sources.items():
        site.write_text(source)
    for target, contents in old.items():
        path = Path(target)
        if contents is None:
            path.unlink(missing_ok=True)
        else:
            path.write_bytes(contents)
    subprocess.run(['systemctl', 'daemon-reload'])
    subprocess.run(['nginx', '-t'], check=True)
    subprocess.run(['systemctl', 'reload', 'nginx'], check=True)
    raise
print('Analytics installed; configuration backup:', backup)
