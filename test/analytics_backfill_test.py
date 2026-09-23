import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from datetime import datetime
import gzip

spec = importlib.util.spec_from_file_location('backfill', Path(__file__).parents[1] / 'ops/analytics/backfill.py')
b = importlib.util.module_from_spec(spec)
spec.loader.exec_module(b)


class HistoricalImportTest(unittest.TestCase):
    def setUp(self):
        self.pages = {'/': '首页', '/en': 'Home', '/blog/a': '文章 A', '/en/blog/a': 'Article A', '/ai/demo': 'Demo'}
        self.cutoff = datetime.fromisoformat('2026-09-23T18:47:00+08:00')

    def row(self, time='22/Sep/2026:12:00:00 +0800', path='/blog/a/', status='200', method='GET',
            ip='8.8.8.8', ua='Mozilla/5.0 Safari/605.1.15', ref='https://google.com/search?q=private'):
        return f'{ip} - - [{time}] "{method} {path} HTTP/1.1" {status} 99 "{ref}" "{ua}"\n'

    def test_cleaning_overlap_privacy_and_range_unique(self):
        lines = [
            self.row(time='21/Sep/2026:12:00:00 +0800'),
            self.row(time='22/Sep/2026:12:00:00 +0800', path='/en/blog/a/?secret=yes'),
            self.row(path='/ai/demo/', ip='1.1.1.1'),
            self.row(status='301'), self.row(method='HEAD'), self.row(ua='Googlebot/1.0'),
            self.row(path='/private/'), self.row(path='/site-events.js'),
            self.row(path='/blog/ghost/'), self.row(ip='127.0.0.1'),
            self.row(time='23/Sep/2026:18:47:00 +0800'),
            self.row(time='23/Sep/2026:18:48:00 +0800'),
        ]
        with tempfile.TemporaryDirectory() as directory:
            with gzip.open(Path(directory, 'access.log.1.gz'), 'wt') as handle:
                handle.writelines(lines[:5])
            Path(directory, 'access.log').write_text(''.join(lines[5:]))
            result = b.generate(directory, self.pages, self.cutoff)
        self.assertEqual(result['pv'], 3)
        self.assertEqual(result['uv'], 2)
        self.assertEqual(result['article_pv'], 2)
        self.assertEqual(result['ai_pv'], 1)
        self.assertEqual(result['coverage']['files'], 2)
        self.assertEqual(result['coverage']['days'], 2)
        self.assertEqual([row['uv'] for row in result['daily']], [1, 2])
        payload = json.dumps(result)
        for private in ('8.8.8.8', '1.1.1.1', 'secret=yes', 'private', 'Safari/605'):
            self.assertNotIn(private, payload)
        self.assertEqual(result['sources'][0], ('google.com', 3))
        self.assertEqual(result['excluded']['after_cutoff'], 2)
        self.assertEqual(result['excluded']['non_page_or_unpublished'], 3)

    def test_empty_and_missing_days(self):
        result = b.summarize([], self.pages, self.cutoff)
        self.assertEqual(result['pv'], 0)
        self.assertEqual(result['daily'], [])
        with tempfile.TemporaryDirectory() as directory:
            Path(directory, 'access.log').write_text(self.row(time='20/Sep/2026:09:00:00 +0800')
                                                      + self.row(time='22/Sep/2026:09:00:00 +0800'))
            result = b.generate(directory, self.pages, self.cutoff)
        self.assertEqual([day['pv'] for day in result['daily']], [1, 0, 1])

    def test_route_canonicalization_and_host_boundary(self):
        self.assertEqual(b.page_path('/blog/a/index.html?x=secret', self.pages), '/blog/a')
        self.assertEqual(b.page_path('/en/', self.pages), '/en')
        self.assertIsNone(b.page_path('https://other.example/blog/a/', self.pages))
        self.assertEqual(b.source_host('https://zhuyawei.com/contact/?x=secret'), '直接 / 未知')


if __name__ == '__main__':
    unittest.main()
