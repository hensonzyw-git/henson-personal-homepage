import test from 'node:test';
import assert from 'node:assert/strict';
import { readingTime } from '../src/lib/reading-time.mjs';

test('Chinese characters and English words use distinct units and sum in mixed prose', () => {
  assert.equal(readingTime('字'.repeat(400), 'zh').minutes, 1);
  assert.equal(readingTime('word '.repeat(200), 'en').minutes, 1);
  assert.equal(readingTime('字'.repeat(400) + ' word '.repeat(200), 'zh').minutes, 2);
  assert.equal(readingTime('word '.repeat(201), 'en').minutes, 2);
  assert.equal(readingTime('字'.repeat(401), 'zh').minutes, 2);
});

test('translations are independently counted, not copied from their pair', () => {
  assert.equal(readingTime('字'.repeat(800), 'zh').minutes, 2);
  assert.equal(readingTime('word '.repeat(600), 'en').minutes, 3);
});

test('Markdown labels count but code blocks, images, destinations and definitions do not', () => {
  const prose = '# 标题\n\n正文 **bold** [label](https://example.com/very/long/path) `pip`';
  const extras = '\n\n```python\n' + 'word '.repeat(1000) + '\n```\n\n'
    + '~~~text\n' + '字'.repeat(1000) + '\n~~~\n\n'
    + '    indented code\n\n![ignored image caption](image.png)\n\n'
    + '[hidden]: https://example.com/hidden "hidden title"\n\n<https://example.com/long/path>';
  assert.deepEqual(readingTime(prose + extras, 'zh'), readingTime(prose, 'zh'));
  assert.deepEqual(readingTime(prose, 'zh'), { minutes: 1, hanCharacters: 4, words: 3 });
});

test('punctuation, whitespace and markup do not inflate the count', () => {
  assert.deepEqual(readingTime('\n** ** --- ! ?\n', 'en'), { minutes: 1, hanCharacters: 0, words: 0 });
  assert.equal(readingTime('字，字。', 'zh').hanCharacters, 2);
  assert.equal(readingTime('𠀀', 'zh').hanCharacters, 1);
  assert.equal(readingTime('Hello &amp; world', 'en').words, 2);
  assert.equal(readingTime('', 'zh').minutes, 1);
});

test('HTML prose counts; comments and embedded scripts/styles/diagrams do not', () => {
  const text = '<div>正文 hello</div>\n';
  const invisible = '<!-- hidden -->\n<script>' + 'word '.repeat(1000)
    + '</script>\n<style>hidden</style>\n<svg><text>diagram</text></svg>\n';
  assert.deepEqual(readingTime(text + invisible, 'zh'), readingTime(text, 'zh'));
  assert.deepEqual(readingTime(text, 'zh'), { minutes: 1, hanCharacters: 2, words: 1 });
});
