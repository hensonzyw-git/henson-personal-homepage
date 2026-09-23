(() => {
  let days = '7';
  let data;
  let historyDaily;
  const $ = (id) => document.getElementById(id);
  const labels = { read_50: '读到一半', read_90: '读到末尾', contact_click: '联系方式点击', repo_click: '项目仓库点击', outbound_click: '外链点击', language_switch: '切换语言', contact_intent: '前往联系页' };
  const format = (value) => new Intl.NumberFormat('zh-CN').format(value);
  function element(tag, text) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function table(id, headers, rows) {
    const host = $(id);
    host.replaceChildren();
    if (!rows.length) {
      const note = element('p', '这个时间范围还没有数据。');
      note.className = 'empty';
      host.append(note);
      return;
    }
    const node = element('table');
    const head = element('thead');
    const heading = element('tr');
    headers.forEach((value) => { const cell = element('th', value); cell.scope = 'col'; heading.append(cell); });
    head.append(heading);
    node.append(head);
    const body = element('tbody');
    rows.forEach((row) => {
      const tr = element('tr');
      row.forEach((value) => { const td = element('td'); td.append(value instanceof Node ? value : document.createTextNode(String(value))); tr.append(td); });
      body.append(tr);
    });
    node.append(body);
    host.append(node);
  }
  function rank(id, values) {
    $(id).replaceChildren();
    if (!values.length) { $(id).append(element('p', '暂无数据')); return; }
    values.forEach(([key, count]) => {
      const row = element('div'); row.className = 'rank';
      row.append(element('span', key), element('strong', format(count)));
      $(id).append(row);
    });
  }
  function chart(values, hostId = 'chart', noun = '浏览') {
    const svgNS = 'http://www.w3.org/2000/svg';
    const shape = (tag, attrs, text) => {
      const node = document.createElementNS(svgNS, tag);
      Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
      if (text !== undefined) node.textContent = text;
      return node;
    };
    const width = Math.max(280, $(hostId).clientWidth);
    const svg = shape('svg', { viewBox: `0 0 ${width} 220`, role: 'img', 'aria-label': `每日页面${noun}量，详细数字在下方每日数据中` });
    const max = Math.max(1, ...values.map((row) => row.pv));
    const step = (width - 80) / values.length;
    svg.append(shape('line', { x1: 50, y1: 180, x2: width - 20, y2: 180 }));
    svg.append(shape('text', { x: 12, y: 24 }, max));
    svg.append(shape('text', { x: 24, y: 180 }, '0'));
    values.forEach((row, i) => {
      const height = row.pv / max * 150;
      const bar = shape('rect', { x: 50 + i * step + step * 0.15, y: 180 - height, width: step * 0.7, height, rx: 2 });
      bar.append(shape('title', {}, `${row.date}：${row.pv} 次${noun}，${row.uv} 位访客（估算）`));
      svg.append(bar);
      if (i % Math.max(1, Math.ceil(values.length / (width < 600 ? 3 : 7))) === 0) svg.append(shape('text', { x: 50 + i * step, y: 207 }, row.date.slice(5)));
    });
    $(hostId).replaceChildren(svg);
  }
  function render() {
    const report = data.windows[days];
    const age = Date.now() - new Date(data.generated_at).getTime();
    const stamp = new Date(data.generated_at).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false });
    $('status').textContent = `${age > 180000 ? '⚠ 汇总已超过 3 分钟未更新，请检查定时任务。' : ''} 更新于 ${stamp} · 上海时间${data.first_event ? ` · 保留数据起点 ${new Date(data.first_event).toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai' })}` : ' · 等待首条有效上报'}`;
    $('report').hidden = false;
    for (const [id, key] of [['pv', 'pv'], ['uv', 'uv'], ['articles', 'article_pv'], ['contact', 'contact']]) $(id).textContent = format(report[key]);
    $('range').textContent = `${report.start} — ${report.end}`;
    chart(report.daily);
    table('daily', ['日期', '浏览量', '访客估算'], report.daily.map((r) => [r.date, r.pv, r.uv]));
    table('pages', ['页面', '浏览', '访客估算', '读到一半', '读到末尾'], report.pages.map((r) => {
      const cell = element('div');
      const link = element('a', r.title); link.href = r.path; link.target = '_blank'; link.rel = 'noopener';
      cell.append(link, element('small', r.path));
      const article = /^\/(en\/)?blog\/[^/]+$/.test(r.path);
      return [cell, r.pv, r.uv, article ? `${r.read_50} · ${Math.round(r.read_50 / r.pv * 100)}%` : '—', article ? `${r.read_90} · ${Math.round(r.read_90 / r.pv * 100)}%` : '—'];
    }));
    rank('sources', report.sources); rank('devices', report.devices); rank('languages', report.languages);
    table('events', ['动作', '目标', '次数'], report.events.map((r) => [labels[r.event] || r.event, r.target || '—', r.count]));
  }
  async function refreshHistory() {
    try {
      const response = await fetch('/analytics/history.json', { cache: 'no-store', credentials: 'same-origin' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const history = await response.json();
      if (history.source !== 'nginx_access_log') throw new Error('Unexpected history source');
      historyDaily = history.daily;
      $('history-shortcut-count').textContent = `${format(history.pv)} 次有效页面请求 · 查看历史数据`;
      $('history-status').textContent = `保留日志 ${history.coverage.files} 份 · 清洗后的时间范围`;
      $('history-report').hidden = false;
      $('history-range').textContent = history.coverage.log_first
        ? `${history.coverage.log_first.slice(0, 10)} — ${history.cutoff.slice(0, 10)} · 截止当天仅计至 ${history.cutoff.slice(11, 16)}`
        : '暂无可用日志';
      for (const [id, key] of [['history-pv', 'pv'], ['history-uv', 'uv'], ['history-articles', 'article_pv'], ['history-ai', 'ai_pv']]) $(id).textContent = format(history[key]);
      chart(history.daily, 'history-chart', '请求');
      table('history-daily', ['日期', '有效页面请求', '访客估算', '文章详情', 'AI 项目详情'],
        history.daily.map((r) => [r.date, r.pv, r.uv, r.article_pv, r.ai_pv]));
      table('history-pages', ['页面', '请求', '访客估算'], history.pages.map((r) => {
        const cell = element('div');
        const link = element('a', r.title); link.href = r.path; link.target = '_blank'; link.rel = 'noopener';
        cell.append(link, element('small', r.path));
        return [cell, r.pv, r.uv];
      }));
      rank('history-sources', history.sources);
    } catch {
      $('history-shortcut-count').textContent = '历史数据暂时无法读取';
      $('history-status').textContent = '历史汇总暂时无法读取；前端埋点数据仍可查看。';
    }
  }
  async function refresh() {
    try {
      const response = await fetch('/analytics/data.json', { cache: 'no-store', credentials: 'same-origin' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      data = await response.json();
      render();
    } catch {
      $('status').textContent = '统计暂时无法加载，请确认登录状态或稍后刷新。已有数字可能过时。';
    }
  }
  document.querySelectorAll('[data-days]').forEach((button) => button.addEventListener('click', () => {
    days = button.dataset.days;
    document.querySelectorAll('[data-days]').forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    if (data) render();
  }));
  function exclusion() {
    try { $('exclude').textContent = localStorage.getItem('henson.analytics.exclude') === '1' ? '已排除本浏览器 · 点击恢复统计' : '排除本浏览器的访问'; }
    catch { $('exclude').textContent = '浏览器不允许保存排除设置'; $('exclude').disabled = true; }
  }
  $('exclude').addEventListener('click', () => {
    try { const key = 'henson.analytics.exclude'; localStorage.getItem(key) === '1' ? localStorage.removeItem(key) : localStorage.setItem(key, '1'); exclusion(); }
    catch { $('exclude').textContent = '设置未保存，请检查浏览器隐私设置'; }
  });
  window.addEventListener('resize', () => {
    if (data) chart(data.windows[days].daily);
    if (historyDaily) chart(historyDaily, 'history-chart', '请求');
  });
  exclusion();
  refresh();
  refreshHistory();
  setInterval(refresh, 60000);
})();
