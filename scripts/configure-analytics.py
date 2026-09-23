#!/usr/bin/env python3
"""Manual hidden credential entry. Store only a salted hash, never plaintext."""
import getpass
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import warnings

DEFAULT_PATH = Path.home() / '.config/henson-homepage/analytics-credentials.json'
USERNAME = re.compile(r'[A-Za-z0-9][A-Za-z0-9_.-]{0,31}')


def encode_credentials(username, password):
    if not USERNAME.fullmatch(username):
        raise ValueError('账号须为 1–32 位英文字母、数字、点、下划线或短横线，首位为字母或数字。')
    if len(password) < 8 or len(password.encode('utf-8')) > 256 or any(c in password for c in '\n\r\0'):
        raise ValueError('密码至少 8 个字符、最多 256 字节，且不能包含换行或空字符。')
    result = subprocess.run(['openssl', 'passwd', '-6', '-stdin'], input=(password + '\n').encode(), capture_output=True)
    if result.returncode:
        raise ValueError('密码哈希生成失败，请检查本机 OpenSSL 是否支持 SHA-512 crypt。')
    return dict(username=username, passwordHash=result.stdout.decode().strip())


def save_config(path, config):
    path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    # Atomic replacement also avoids following an existing credential-file symlink.
    fd, name = tempfile.mkstemp(prefix='.analytics-credentials-', dir=path.parent)
    try:
        with os.fdopen(fd, 'w') as handle:
            json.dump(config, handle)
            handle.write('\n')
        os.chmod(name, 0o600)
        os.replace(name, path)
    finally:
        Path(name).unlink(missing_ok=True)


def main(path=DEFAULT_PATH):
    # Refuse pipes rather than allowing getpass to fall back to echoed input.
    if not sys.stdin.isatty():
        print('请在你自己的交互终端中运行 npm run analytics:configure；不接受管道或聊天输入。', file=sys.stderr)
        return 1
    try:
        warnings.simplefilter('error', getpass.GetPassWarning)
        username = getpass.getpass('账号（隐藏输入）: ')
        password = getpass.getpass('密码（隐藏输入，至少 8 字符）: ')
        confirmation = getpass.getpass('再次输入密码（隐藏输入）: ')
        if password != confirmation:
            raise ValueError('两次密码不一致，未保存。')
        config = encode_credentials(username, password)
        save_config(path, config)
    except getpass.GetPassWarning:
        print('此终端无法确保隐藏输入，已取消。', file=sys.stderr)
        return 1
    except (EOFError, KeyboardInterrupt):
        print('\n已取消，未保存。', file=sys.stderr)
        return 1
    except (ValueError, OSError) as error:
        # Never interpolate exception details from subprocesses or credential data.
        print(str(error) if isinstance(error, ValueError) else '无法保存配置，请检查文件权限。', file=sys.stderr)
        return 1
    print('配置已保存。账号、密码和哈希均不显示；仅保存加盐哈希，没有明文密码。')
    print('此步骤不部署；下次获准部署时会同步这组账号密码。')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
