#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';

const env = process.env;
const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const skipChecks = args.has('--skip-checks');

const config = {
  sshUser: env.ECS_SSH_USER || 'henson-admin',
  sshHost: env.ECS_SSH_HOST || '8.153.84.10',
  sshKey: expandHome(env.ECS_SSH_KEY || '~/.ssh/henson_aliyun_ecs'),
  remoteDir: env.ECS_REMOTE_DIR || '/var/www/zhuyawei.com/current',
  siteUrl: env.SITE_URL || 'https://zhuyawei.com',
  verifyPaths: (env.VERIFY_PATHS || '/,/blog/,/en/,/logo.svg,/llms.txt,/rss.xml,/en/rss.xml').split(',').filter(Boolean),
};

const sshTarget = `${config.sshUser}@${config.sshHost}`;
const sshBase = ['ssh', '-i', config.sshKey, '-o', 'BatchMode=yes', sshTarget];
const rsyncSsh = `ssh -i ${shellQuote(config.sshKey)} -o BatchMode=yes`;

main();

function main() {
  if (!existsSync(config.sshKey)) {
    fail(`SSH key not found: ${config.sshKey}`);
  }

  logConfig();

  if (!skipChecks) {
    run('npm', ['run', 'build']);
    run('node', ['test/ac-checks.mjs']);
  } else {
    note('Skipping local build/checks because --skip-checks was passed.');
  }

  const rsyncArgs = [
    '-az',
    '--delete',
    '-e',
    rsyncSsh,
    dryRun ? '--dry-run' : null,
    'dist/',
    `${sshTarget}:${config.remoteDir}/`,
  ].filter(Boolean);
  run('rsync', rsyncArgs);

  if (!dryRun) {
    run(...sshCommand([
      `sudo chown -R root:www-data ${shellQuote(config.remoteDir)}`,
      `sudo find ${shellQuote(config.remoteDir)} -type d -exec chmod 755 {} +`,
      `sudo find ${shellQuote(config.remoteDir)} -type f -exec chmod 644 {} +`,
      'sudo nginx -t',
      'sudo systemctl reload nginx',
    ].join(' && ')));

    for (const verifyPath of config.verifyPaths) {
      verifyUrl(new URL(verifyPath, config.siteUrl).toString());
    }
    verifyUtf8Text(new URL('/llms.txt', config.siteUrl).toString());
  } else {
    note('Dry run complete. Remote files and Nginx were not changed.');
  }
}

function run(cmd, cmdArgs, options = {}) {
  note(`$ ${cmd} ${cmdArgs.map(shellQuote).join(' ')}`);
  const result = spawnSync(cmd, cmdArgs, {
    stdio: 'inherit',
    shell: false,
    ...options,
  });
  if (result.status !== 0) {
    fail(`Command failed with exit code ${result.status}: ${cmd}`);
  }
}

function sshCommand(remoteCommand) {
  return ['ssh', [...sshBase.slice(1), remoteCommand]];
}

function verifyUrl(url) {
  const result = spawnSync('curl', [
    '-s',
    '-o',
    '/dev/null',
    '-w',
    '%{http_code}',
    '--max-time',
    '15',
    url,
  ], { encoding: 'utf8' });

  if (result.status !== 0) {
    fail(`Verification request failed: ${url}`);
  }

  const code = result.stdout.trim();
  note(`verify ${url} -> ${code}`);
  if (!['200', '301', '404'].includes(code)) {
    fail(`Unexpected status for ${url}: ${code}`);
  }
}

function verifyUtf8Text(url) {
  const result = spawnSync('curl', [
    '-s',
    '-D',
    '-',
    '-o',
    '/dev/null',
    '--max-time',
    '15',
    url,
  ], { encoding: 'utf8' });

  if (result.status !== 0) {
    fail(`Header verification request failed: ${url}`);
  }

  const contentType = result.stdout
    .split('\n')
    .find((line) => line.toLowerCase().startsWith('content-type:')) ?? '';
  note(`verify ${url} content-type -> ${contentType.replace(/^content-type:\s*/i, '').trim()}`);
  if (!/text\/plain/i.test(contentType) || !/charset=utf-8/i.test(contentType)) {
    fail(`Expected text/plain; charset=utf-8 for ${url}`);
  }
}

function logConfig() {
  note(`Deploy target: ${sshTarget}:${config.remoteDir}`);
  note(`Site URL: ${config.siteUrl}`);
  note(`Verify paths: ${config.verifyPaths.join(', ')}`);
  if (dryRun) note('Mode: dry run');
}

function expandHome(value) {
  return value.startsWith('~/') ? path.join(homedir(), value.slice(2)) : value;
}

function shellQuote(value) {
  if (/^[A-Za-z0-9_./:@%+=,-]+$/.test(value)) return value;
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function note(message) {
  console.log(`[deploy-ecs] ${message}`);
}

function fail(message) {
  console.error(`[deploy-ecs] ${message}`);
  process.exit(1);
}
