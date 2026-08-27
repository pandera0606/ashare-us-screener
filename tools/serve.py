# -*- coding: utf-8 -*-
"""Serve this folder on the LAN so a phone/tablet browser can open index.html.

Usage:
  python tools/serve.py
  python tools/serve.py --port 8765

Phone and computer must be on the same Wi-Fi. This is a static file server,
not an app backend: the page still loads mapping/board/briefings as JS files.
"""
from __future__ import print_function

import argparse
import os
import socket
import sys

try:
    from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
except ImportError:
    from BaseHTTPServer import HTTPServer as ThreadingHTTPServer
    from SimpleHTTPServer import SimpleHTTPRequestHandler

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def lan_ip():
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        sock.connect(("8.8.8.8", 80))
        return sock.getsockname()[0]
    except OSError:
        return "127.0.0.1"
    finally:
        sock.close()


def main():
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        except (OSError, ValueError):
            pass

    ap = argparse.ArgumentParser(description="局域网静态服务，方便手机打开 index.html")
    ap.add_argument("--port", type=int, default=8765)
    ap.add_argument("--host", default="0.0.0.0", help="监听地址，默认 0.0.0.0")
    args = ap.parse_args()

    os.chdir(ROOT)
    ip = lan_ip()
    httpd = ThreadingHTTPServer((args.host, args.port), SimpleHTTPRequestHandler)

    print("静态目录: %s" % ROOT, flush=True)
    print("本机打开: http://127.0.0.1:%s/" % args.port, flush=True)
    print("手机打开: http://%s:%s/" % (ip, args.port), flush=True)
    print("同一 Wi-Fi。Windows 若手机打不开，在防火墙放行 TCP %s（专用网络）。Ctrl+C 停止。" % args.port, flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n已停止")
        httpd.server_close()


if __name__ == "__main__":
    main()
