import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const source = readFileSync('public/site-events.js', 'utf8');
function browser({ host = 'zhuyawei.com', excluded = false, dnt = false, hidden = false, article = true } = {}) {
  const calls = [], listeners = {}, timers = [];
  let time = 0;
  const document = { visibilityState: hidden ? 'hidden' : 'visible', referrer: 'https://search.test/private?q=secret',
    addEventListener: (name, fn) => (listeners[name] ||= []).push(fn),
    querySelector: () => article ? { getBoundingClientRect: () => ({ top: -900, height: 1000 }) } : null };
  const context = { location: { hostname: host, pathname: '/blog/example/', href: `https://${host}/blog/example/?secret=x#s`, origin: `https://${host}` },
    navigator: { doNotTrack: dnt ? '1' : '0' }, localStorage: { getItem: () => excluded ? '1' : null },
    crypto: { randomUUID: () => '11111111-1111-4111-a111-111111111111' }, URL, URLSearchParams,
    fetch: (url, options) => { calls.push({ query: new URL(url, `https://${host}`).searchParams, options }); return Promise.resolve(); },
    performance: { now: () => time }, document, innerHeight: 800, setInterval: (fn) => timers.push(fn) };
  vm.runInNewContext(source, context);
  return { calls, document, context, advance: (seconds) => { for (let n = 0; n < seconds; n++) { time += 1000; timers.forEach(fn => fn()); } },
    fire: (name, value = {}) => (listeners[name] || []).forEach(fn => fn(value)) };
}
test('single pageview contains no query, hash, source path or credentials', () => {
  const b = browser();
  assert.equal(b.calls.length, 1);
  assert.equal(b.calls[0].query.get('p'), '/blog/example');
  assert.equal(b.calls[0].query.get('r'), 'search.test');
  assert.equal(b.calls[0].options.credentials, 'omit');
  b.fire('visibilitychange'); assert.equal(b.calls.length, 1);
});
test('local previews, owner opt-out and privacy preference send no events', () => {
  for (const options of [{host:'localhost'}, {excluded:true}, {dnt:true}]) assert.equal(browser(options).calls.length, 0);
});
test('prerender and background time do not become reading', () => {
  const b = browser({hidden:true}); b.advance(120); assert.equal(b.calls.length, 0);
  b.document.visibilityState = 'visible'; b.fire('visibilitychange'); b.advance(29);
  assert.equal(b.calls.length, 1);
  b.advance(1); assert.equal(b.calls[1].query.get('e'), 'read_50');
  b.document.visibilityState = 'hidden'; b.fire('visibilitychange'); b.advance(120);
  assert.equal(b.calls.length, 2);
  b.document.visibilityState = 'visible'; b.fire('visibilitychange'); b.advance(30);
  assert.equal(b.calls[2].query.get('e'), 'read_90');
  b.advance(120); assert.equal(b.calls.length, 3);
});
test('real link intent is counted without blocking navigation or disclosing parameters', () => {
  const b = browser(); const link = { href:'https://github.com/hensonzyw-git/personal-agent?token=secret', closest:()=>null };
  const click = {isTrusted:true,target:{closest:()=>link}};
  b.fire('click', click); b.fire('click', click);
  assert.equal(b.calls.length, 2); assert.equal(b.calls[1].query.get('e'), 'repo_click');
  assert.equal(b.calls[1].query.get('t'), '/hensonzyw-git/personal-agent');
  link.href='mailto:private@test.com'; b.fire('click', click);
  assert.equal(b.calls[2].query.get('t'), 'email');
});
