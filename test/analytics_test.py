import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from datetime import datetime, timedelta

spec = importlib.util.spec_from_file_location('aggregate', Path(__file__).parents[1] / 'ops/analytics/aggregate.py')
a = importlib.util.module_from_spec(spec)
spec.loader.exec_module(a)


class AnalyticsTest(unittest.TestCase):
    def setUp(self):
        self.now = datetime(2026, 9, 23, 12, tzinfo=a.ZONE)
        self.pages = {'/': '首页', '/blog/example': '文章', '/en/blog/example': 'Article'}
        self.base = dict(time=(self.now - timedelta(minutes=2)).isoformat(), status='200',
                         method='GET', origin='https://zhuyawei.com/', marker='1',
                         ip='192.0.2.1', ua='Mozilla/5.0 Safari/605.1.15',
                         event='pageview', page='%2Fblog%2Fexample',
                         view='11111111-1111-4111-a111-111111111111', ref='google.com', target='')

    def row(self, **changes):
        return a.normalized({**self.base, **changes}, self.pages, self.now)

    def test_rejects_forged_unknown_and_private_fields(self):
        for changes in [dict(status='429'), dict(method='POST'), dict(marker='0'), dict(origin='https://evil.test/'),
                        dict(page='/analytics'), dict(page='/blog/example?email=secret'), dict(view='bad'),
                        dict(ip='bad'), dict(event='unknown'), dict(event='contact_click', target='secret@example.com'),
                        dict(event='repo_click', target='/x/y?token=secret'), dict(ua='Googlebot'),
                        dict(event='read_50', page='/')]:
            try:
                self.assertIsNone(self.row(**changes), changes)
            except ValueError:
                self.assertEqual(changes, dict(ip='bad'))
        self.assertEqual(self.row(ref='https%3A%2F%2Fprivate.test%2Fsecret')['ref'], '直接 / 未知')

    def test_dedup_join_and_server_side_read_threshold(self):
        pv = self.row()
        ready = (datetime.fromisoformat(self.base['time']) + timedelta(seconds=65)).isoformat()
        half = self.row(event='read_50', time=ready)
        done = self.row(event='read_90', time=ready)
        orphan = self.row(event='contact_click', target='email', view='22222222-1111-4111-a111-111111111111')
        premature = self.row(event='read_90', time=self.base['time'], view='33333333-1111-4111-a111-111111111111')
        second = self.row(view=premature['view'])
        report = a.summarize([done, pv, pv, half, half, orphan, premature, second], self.pages, self.now)['windows']['7']
        self.assertEqual((report['pv'], report['uv'], report['article_pv'], report['contact']), (2, 1, 2, 0))
        self.assertEqual((report['pages'][0]['read_50'], report['pages'][0]['read_90']), (1, 1))

    def test_period_unique_is_not_sum_of_daily_unique_and_shanghai_boundary(self):
        older = self.row(time='2026-09-22T15:59:00+00:00', view='22222222-1111-4111-a111-111111111111')
        today = self.row(time='2026-09-22T16:01:00+00:00')
        report = a.summarize([older, today], self.pages, self.now)['windows']
        self.assertEqual(report['1']['pv'], 1)
        self.assertEqual(report['7']['pv'], 2)
        self.assertEqual(report['7']['uv'], 1)
        self.assertEqual(sum(r['uv'] for r in report['7']['daily']), 2)

    def test_rotation_malformed_lines_and_no_identifiers_in_output(self):
        import gzip
        with tempfile.TemporaryDirectory() as directory:
            Path(directory, 'events.log').write_text(json.dumps(self.base) + '\n{"partial":')
            with gzip.open(Path(directory, 'events.log.1.gz'), 'wt') as handle:
                handle.write(json.dumps(self.base) + '\n')
            Path(directory, 'events.log.private').write_text(json.dumps({**self.base, 'view': '22222222-1111-4111-a111-111111111111'}))
            result = a.generate(directory, self.pages, self.now)
            self.assertEqual(result['windows']['7']['pv'], 1)
            output = json.dumps(result)
            for value in (self.base['ip'], self.base['ua'], self.base['view']):
                self.assertNotIn(value, output)

    def test_empty_is_honest(self):
        result = a.summarize([], self.pages, self.now)
        self.assertIsNone(result['first_event'])
        self.assertEqual(result['windows']['90']['uv'], 0)
        self.assertEqual(len(result['windows']['90']['daily']), 90)


class CredentialInputTest(unittest.TestCase):
    def interactive(self, destination, mismatch=False):
        import errno
        import os
        import pty
        import secrets
        import select
        import subprocess
        import sys
        import termios
        import time
        username = 'owner_' + secrets.token_hex(4)
        password = secrets.token_hex(4)
        responses = [username, password, password + ('x' if mismatch else '')]
        code = "import runpy; from pathlib import Path; m=runpy.run_path('scripts/configure-analytics.py'); raise SystemExit(m['main'](Path(" + repr(str(destination)) + ")))"
        master, slave = pty.openpty()
        process = subprocess.Popen([sys.executable, '-c', code], stdin=slave, stdout=slave, stderr=slave, start_new_session=True)
        output = b''
        sent = 0
        deadline = time.monotonic() + 10
        try:
            while time.monotonic() < deadline:
                if select.select([master], [], [], .1)[0]:
                    try:
                        chunk = os.read(master, 65536)
                    except OSError as error:
                        if error.errno == errno.EIO:
                            break
                        raise
                    output += chunk
                    if sent < 3 and output.count(b': ') > sent:
                        self.assertFalse(termios.tcgetattr(slave)[3] & termios.ECHO, 'Terminal echo must be disabled before input')
                        os.write(master, (responses[sent] + '\n').encode())
                        sent += 1
                if process.poll() is not None:
                    break
            self.assertIsNotNone(process.poll(), 'Hidden prompt timed out')
            for secret in responses:
                self.assertTrue(secret.encode() not in output, 'Credential input appeared in terminal output')
            return process.returncode, username, password
        finally:
            if process.poll() is None:
                process.kill()
            process.wait()
            os.close(master)
            os.close(slave)

    def test_real_terminal_no_echo_custom_account_hash_only_and_permissions(self):
        import subprocess
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory, 'credentials.json')
            status, username, password = self.interactive(destination)
            self.assertEqual(status, 0)
            config = json.loads(destination.read_text())
            self.assertTrue(config['username'] == username)
            self.assertTrue('password' not in config and password not in destination.read_text())
            self.assertEqual(destination.stat().st_mode & 0o777, 0o600)
            salt = config['passwordHash'].split('$')[2]
            verified = subprocess.run(['openssl', 'passwd', '-6', '-salt', salt, '-stdin'], input=(password + '\n').encode(), capture_output=True, check=True)
            self.assertTrue(verified.stdout.decode().strip() == config['passwordHash'], 'Stored hash must match manually entered password')

    def test_mismatch_preserves_previous_configuration(self):
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory, 'credentials.json')
            destination.write_text('{"previous":true}')
            status, _, _ = self.interactive(destination, mismatch=True)
            self.assertEqual(status, 1)
            self.assertEqual(destination.read_text(), '{"previous":true}')

    def test_noninteractive_input_refused(self):
        import subprocess
        import sys
        result = subprocess.run([sys.executable, 'scripts/configure-analytics.py'], input='never-use-piped-input\n', text=True, capture_output=True)
        self.assertEqual(result.returncode, 1)
        self.assertTrue('never-use-piped-input' not in result.stdout + result.stderr)


if __name__ == '__main__':
    unittest.main()
