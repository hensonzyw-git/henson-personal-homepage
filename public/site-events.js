// First-party, anonymous measurements. No cookie or persistent visitor identifier.
(() => {
  if (location.hostname !== 'zhuyawei.com' || navigator.webdriver) return;
  const excluded = () => {
    try { return localStorage.getItem('henson.analytics.exclude') === '1'; }
    catch { return false; }
  };
  if (excluded() || navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return;
  const page = location.pathname.replace(/\/+$/, '') || '/';
  const view = crypto.randomUUID();
  let started = false;
  const sent = new Set();
  let source = '';
  try {
    const ref = new URL(document.referrer);
    if (ref.hostname !== location.hostname) source = ref.hostname;
  } catch {}
  function send(event, target = '') {
    if (excluded()) return;
    const key = `${event}:${target}`;
    if (sent.has(key)) return;
    sent.add(key);
    const query = new URLSearchParams({ e: event, p: page, v: view, r: source, t: target });
    // Never transmit the current query/hash, external link query, email or link text.
    fetch(`/_events?${query}`, {
      credentials: 'omit', keepalive: true, cache: 'no-store',
      referrerPolicy: 'origin', headers: { 'X-Homepage-Event': '1' },
    }).catch(() => {});
  }
  function start() {
    if (!started && document.visibilityState === 'visible') {
      started = true;
      send('pageview');
    }
  }
  start();
  document.addEventListener('visibilitychange', start);
  document.addEventListener('click', (event) => {
    if (!event.isTrusted || !started) return;
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (url.protocol === 'mailto:') send('contact_click', 'email');
    else if (url.hostname === 'www.linkedin.com' && url.pathname.replace(/\/$/, '') === '/in/yaweizhu-henson') send('contact_click', 'linkedin');
    else if (url.hostname === 'github.com' && /^\/hensonzyw-git\/?$/.test(url.pathname)) send('contact_click', 'github');
    else if (url.hostname === 'github.com') send('repo_click', url.pathname.replace(/\/+$/, ''));
    else if (url.origin !== location.origin && /^https?:$/.test(url.protocol)) send('outbound_click', url.hostname);
    else if (link.closest('.lang-toggle')) send('language_switch', url.pathname.startsWith('/en') ? 'en' : 'zh');
    else if (url.pathname.replace(/^\/en(?=\/|$)/, '').replace(/\/$/, '') === '/contact') send('contact_intent');
  }, { passive: true });
  const article = document.querySelector('.article-body');
  if (!article) return;
  let activeMs = 0;
  let previous = performance.now();
  let wasVisible = document.visibilityState === 'visible';
  let depth = 0;
  function measure() {
    const now = performance.now();
    const visible = document.visibilityState === 'visible';
    if (wasVisible) activeMs += Math.min(now - previous, 1500);
    previous = now;
    wasVisible = visible;
    if (!visible || !started) return;
    const rect = article.getBoundingClientRect();
    depth = Math.max(depth, Math.min(1, Math.max(0, (innerHeight - rect.top) / rect.height)));
    if (activeMs >= 30000 && depth >= 0.5) send('read_50');
    if (activeMs >= 60000 && depth >= 0.9) send('read_90');
  }
  setInterval(measure, 1000);
  document.addEventListener('visibilitychange', measure);
})();
