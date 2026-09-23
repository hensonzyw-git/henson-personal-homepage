"""Loopback-only empty-state dashboard preview; never reads production logs."""
import http.server
import importlib.util
import json
from pathlib import Path
from datetime import datetime
ROOT=Path.cwd()
spec=importlib.util.spec_from_file_location('aggregate',ROOT/'ops/analytics/aggregate.py');a=importlib.util.module_from_spec(spec);spec.loader.exec_module(a)
class Preview(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        path=self.path.split('?')[0]
        if path=='/analytics/data.json':
            data=a.summarize([],json.loads((ROOT/'.analytics-build/pages.json').read_text()),datetime.now(a.ZONE))
            content=json.dumps(data).encode();mime='application/json'
        elif path.startswith('/analytics/'):
            name=path.removeprefix('/analytics/') or 'index.html'
            if name not in ('index.html','dashboard.js','dashboard.css','site.css'):
                self.send_error(404);return
            file=ROOT/'.analytics-build/dashboard'/name
            content=file.read_bytes();mime='text/css' if name.endswith('.css') else 'text/javascript' if name.endswith('.js') else 'text/html; charset=utf-8'
        else:
            self.send_error(404);return
        self.send_response(200);self.send_header('Content-Type',mime);self.end_headers();self.wfile.write(content)
    def log_message(self,*args): pass
print('Private analytics preview: http://127.0.0.1:4388/analytics/ (empty local data)', flush=True)
http.server.HTTPServer(('127.0.0.1',4388),Preview).serve_forever()
