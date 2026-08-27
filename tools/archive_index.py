# -*- coding: utf-8 -*-
"""Snapshot index.html into archive/<YYYY-MM-DD_HHMM>.html with timestamps.

Usage:
  python tools/archive_index.py
  python tools/archive_index.py --us-date 2026-08-26

The snapshot lives one level under archive/ and uses <base href="../"> so
css/js/briefings paths match the working copy. Double-click and in-page
links both work. Updates js/data/briefings.js META.pageSnapshot.
"""
from __future__ import print_function

import argparse
import datetime as dt
import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
INDEX = os.path.join(ROOT, "index.html")
BRIEFINGS_JS = os.path.join(ROOT, "js", "data", "briefings.js")
TZ8 = dt.timezone(dt.timedelta(hours=8))


def now_bj():
    return dt.datetime.now(TZ8)


def inject_base(html):
    tag = '  <base href="../" />\n'
    if "<base " in html:
        return html
    if "<head>" in html:
        return html.replace("<head>", "<head>\n" + tag, 1)
    return tag + html


def inject_banner(html, saved_at, us_date, stamp):
    banner = (
        '<div class="page-snapshot-banner">'
        "页面快照 · 保存于 %s（北京时间） · 对应美股交易日 %s · "
        "工作副本请打开 "
        '<a href="index.html">index.html</a>'
        " · 本文件 archive/%s.html"
        "</div>\n"
    ) % (saved_at, us_date, stamp)
    if "<body>" in html:
        return html.replace("<body>", "<body>\n  " + banner, 1)
    return banner + html


def patch_briefings_snapshot(rel_path, saved_at):
    if not os.path.isfile(BRIEFINGS_JS):
        return
    text = open(BRIEFINGS_JS, "r", encoding="utf-8").read()
    text, n1 = re.subn(
        r'pageSnapshot:\s*"[^"]*"',
        'pageSnapshot: "%s"' % rel_path.replace("\\", "/"),
        text,
        count=1,
    )
    text, n2 = re.subn(
        r'savedAt:\s*"\d{4}-\d{2}-\d{2} \d{2}:\d{2}"',
        'savedAt: "%s"' % saved_at,
        text,
        count=1,
    )
    if n1 or n2:
        with open(BRIEFINGS_JS, "w", encoding="utf-8", newline="\n") as f:
            f.write(text)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--us-date", default="", help="US session date YYYY-MM-DD")
    args = ap.parse_args()

    now = now_bj()
    saved_at = now.strftime("%Y-%m-%d %H:%M")
    stamp = now.strftime("%Y-%m-%d_%H%M")
    us_date = args.us_date or now.strftime("%Y-%m-%d")

    html = open(INDEX, "r", encoding="utf-8").read()
    html = re.sub(
        r"<!-- pageUpdated:.*?-->",
        "<!-- pageUpdated: %s CST · briefingUsDate: %s · snapshot: %s -->" % (
            saved_at, us_date, stamp),
        html,
        count=1,
    )
    html = inject_base(html)
    html = inject_banner(html, saved_at, us_date, stamp)

    out_dir = os.path.join(ROOT, "archive")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, stamp + ".html")
    with open(out_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(html)

    rel = "archive/%s.html" % stamp
    patch_briefings_snapshot(rel, saved_at)
    print("wrote", out_path)
    print("savedAt", saved_at)
    print("usDate", us_date)
    print("pageSnapshot", rel)


if __name__ == "__main__":
    main()
