import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

if (!process.argv.includes('--apply')) {
  console.log('After local review and explicit release approval: npm run analytics:deploy -- --apply');
  process.exit(0);
}
const env = process.env;
const host = `${env.ECS_SSH_USER || 'henson-admin'}@${env.ECS_SSH_HOST || '8.153.84.10'}`;
const key = (env.ECS_SSH_KEY || '~/.ssh/henson_aliyun_ecs').replace(/^~\//, homedir() + '/');
const ssh = ['-i', key, '-o', 'BatchMode=yes', host];
function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: 'inherit', ...options });
  if (result.status !== 0) throw new Error(`${command} failed (${result.status})`);
  return result;
}
function quote(value) { return "'" + value.replaceAll("'", "'\\''") + "'"; }
const credentialPath = join(homedir(), '.config', 'henson-homepage', 'analytics-credentials.json');
if (!existsSync(credentialPath)) throw new Error('Run npm run analytics:configure in your own terminal first.');
let credentials;
try { credentials = JSON.parse(readFileSync(credentialPath, 'utf8')); }
catch { throw new Error('Invalid credential configuration; rerun npm run analytics:configure.'); }
if (!/^[A-Za-z0-9][A-Za-z0-9_.-]{0,31}$/.test(credentials.username || '')
    || !/^\$6\$[A-Za-z0-9./]{1,16}\$[A-Za-z0-9./]{86}$/.test(credentials.passwordHash || '')
    || Object.hasOwn(credentials, 'password')) {
  throw new Error('Manual hash-only credentials required; run npm run analytics:configure.');
}
run('npm', ['run', 'build']);
run('node', ['test/ac-checks.mjs']);
run('npm', ['run', 'analytics:test']);
run('npm', ['run', 'analytics:prepare']);
const stage = run('ssh', [...ssh, 'mktemp -d /tmp/homepage-analytics.XXXXXXXX'], { encoding:'utf8', stdio:['ignore','pipe','inherit'] }).stdout.trim();
if (!/^\/tmp\/homepage-analytics\.[A-Za-z0-9]+$/.test(stage)) throw new Error('Unexpected remote staging path.');
const transport = `ssh -i ${quote(key)} -o BatchMode=yes`;
try {
  run('rsync', ['-az', '-e', transport, 'ops/analytics/', `${host}:${stage}/ops/`]);
  run('rsync', ['-az', '-e', transport, '.analytics-build/', `${host}:${stage}/`]);
  run('ssh', [...ssh, `sudo python3 ${quote(stage + '/ops/install.py')} ${quote(stage)}`], { input:JSON.stringify(credentials)+'\n', stdio:['pipe','inherit','inherit'] });
  run('ssh', [...ssh, [
    'if ! sudo test -s /var/lib/homepage-analytics/dashboard/history.json; then',
    'sudo python3 /opt/homepage-analytics/backfill.py --logs /var/log/nginx --pages /opt/homepage-analytics/pages.json --output /var/lib/homepage-analytics/dashboard/history.json',
    '&& sudo chown root:www-data /var/lib/homepage-analytics/dashboard/history.json',
    '&& sudo chmod 640 /var/lib/homepage-analytics/dashboard/history.json;',
    'fi',
  ].join(' ')]);
  // Public deployment is a separate, visible step after the collector is ready.
  run('npm', ['run', 'deploy:ecs']);
  const base = 'https://zhuyawei.com/analytics/';
  for (const asset of ['', 'data.json', 'history.json', 'dashboard.js', 'dashboard.css', 'site.css']) {
    const response = await fetch(base + asset, { redirect:'manual' });
    if (response.status !== 401) throw new Error(`Unauthenticated ${asset || 'dashboard'} returned ${response.status}, expected 401`);
  }
  // No plaintext password is stored, so login is verified by the owner in-browser.
  run('ssh', [...ssh, "sudo -u homepage-analytics python3 -c 'import json,time; from datetime import datetime; d=json.load(open(\"/var/lib/homepage-analytics/dashboard/data.json\")); assert time.time()-datetime.fromisoformat(d[\"generated_at\"]).timestamp()<180; print(\"Private aggregation is fresh.\")'"]);
  run('ssh', [...ssh, "sudo -u www-data python3 -c 'import json; d=json.load(open(\"/var/lib/homepage-analytics/dashboard/history.json\")); assert d[\"source\"]==\"nginx_access_log\" and d[\"coverage\"][\"files\"]>0; print(\"Private historical import is available.\")'"]);
  console.log(`Verified unauthenticated access is blocked: ${base}\nSign in yourself using the credentials you configured; no secret is printed.`);
} finally {
  run('ssh', [...ssh, `rm -rf -- ${quote(stage)}`]);
}
