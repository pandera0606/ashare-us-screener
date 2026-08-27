# -*- coding: utf-8 -*-
"""Fetch A-share quotes + news, write js/data/market-context.js.

Usage:
  python tools/fetch_context.py
  python tools/fetch_context.py --start 2026-08-17 --end 2026-08-25
  python tools/fetch_context.py --quotes-only
  python tools/fetch_context.py --news-only
"""
from __future__ import print_function

import argparse
import datetime as dt
import json
import os
import re
import ssl
import time
import urllib.parse
import urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MAPPING = os.path.join(ROOT, "js", "data", "mapping.js")
BOARD = os.path.join(ROOT, "js", "data", "sample-board.js")
OUT = os.path.join(ROOT, "js", "data", "market-context.js")

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
CTX = ssl.create_default_context()
TZ8 = dt.timezone(dt.timedelta(hours=8))

SECTOR_RE = re.compile(
    r'id:\s*"(?P<id>[^"]+)"\s*,\s*nameCn:\s*"(?P<nameCn>[^"]+)"\s*,\s*'
    r'nameEn:\s*"(?P<nameEn>[^"]+)"\s*,\s*leaderTicker:\s*"(?P<leader>[^"]+)"',
    re.S,
)
STOCK_RE = re.compile(
    r'\{\s*ticker:\s*"(?P<ticker>[A-Z0-9]+)"\s*,\s*name:\s*"(?P<name>[^"]+)"\s*,'
    r'\s*sectorId:\s*"(?P<sectorId>[^"]+)"'
)
A_RE = re.compile(r'ticker:\s*"(?P<ticker>\d{6})"\s*,\s*name:\s*"(?P<name>[^"]+)"')

EXTRA_KW = {
    "semi": ["半导体", "芯片", "晶圆", "光刻", "Chip"],
    "ai": ["算力", "人工智能", "AI服务器", "大模型", "GPU"],
    "ev": ["新能源车", "电动车", "动力电池", "智能驾驶"],
    "solar": ["光伏", "逆变器", "储能", "硅料"],
    "biotech": ["创新药", "减肥药", "胰岛素", "疫苗", "GLP"],
    "internet": ["消费电子", "流媒体", "苹果链"],
    "consumer": ["消费股", "商超", "美妆"],
    "energy": ["原油", "石油", "油气"],
    "software": ["软件", "SaaS", "云服务"],
    "finance": ["美联储", "银行股", "华尔街"],
}


def http_bytes(url, ref="https://finance.sina.com.cn/"):
    req = urllib.request.Request(url, headers={
        "User-Agent": UA,
        "Accept": "*/*",
        "Referer": ref,
    })
    with urllib.request.urlopen(req, context=CTX, timeout=20) as r:
        return r.read()


def http_json(url, ref="https://finance.qq.com/"):
    raw = http_bytes(url, ref)
    text = raw.decode("utf-8", "ignore")
    if text.lstrip()[:1] not in "{[":
        i = text.find("(")
        j = text.rfind(")")
        if i >= 0 and j > i:
            text = text[i + 1:j]
    return json.loads(text)


def parse_mapping():
    text = open(MAPPING, "r", encoding="utf-8").read()
    sectors = []
    for m in SECTOR_RE.finditer(text):
        sectors.append({
            "id": m.group("id"),
            "nameCn": m.group("nameCn"),
            "nameEn": m.group("nameEn"),
            "leaderTicker": m.group("leader"),
        })
    us = {}
    for m in STOCK_RE.finditer(text):
        us[m.group("ticker")] = {
            "name": m.group("name"),
            "sectorId": m.group("sectorId"),
        }
    a_shares = {}
    for m in A_RE.finditer(text):
        a_shares[m.group("ticker")] = m.group("name")
    return sectors, us, a_shares


def parse_board():
    text = open(BOARD, "r", encoding="utf-8").read()
    days = []
    parts = re.split(r'usDate:\s*"', text)
    for part in parts[1:]:
        us_date = part[:10]
        if not re.match(r"\d{4}-\d{2}-\d{2}", us_date):
            continue
        body = part.split("usDate:", 1)[0]
        ids = re.findall(r'\bid:\s*"([a-z]+)"', body)
        snaps = re.findall(r'snap\("([A-Z]+)"', body)
        secs = []
        for i, sid in enumerate(ids[:3]):
            leader = snaps[i * 2] if i * 2 < len(snaps) else None
            gainer = snaps[i * 2 + 1] if i * 2 + 1 < len(snaps) else None
            secs.append({"id": sid, "leader": leader, "gainer": gainer})
        if secs:
            days.append({"usDate": us_date, "sectors": secs})
    return days


def a_symbol(ticker):
    if ticker.startswith(("6", "9")):
        return "sh" + ticker
    return "sz" + ticker


def fetch_a_kline(ticker, bars=50):
    code = a_symbol(ticker)
    param = "%s,day,,,%s,qfq" % (code, bars)
    urls = [
        "https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param=" + param,
        "https://proxy.finance.qq.com/ifzqgtimg/appstock/app/newfqkline/get?param=" + param,
    ]
    last_err = None
    for attempt in range(3):
        for url in urls:
            try:
                data = http_json(url)
            except Exception as e:
                last_err = e
                continue
            inner = (data.get("data") or {}).get(code) or {}
            if not inner and data.get("data"):
                inner = next(iter(data["data"].values()), {}) or {}
            rows = inner.get("qfqday") or inner.get("day") or []
            by_date = {}
            for row in rows:
                if not row or len(row) < 6:
                    continue
                try:
                    by_date[row[0]] = {
                        "date": row[0],
                        "close": float(row[2]),
                    }
                except (TypeError, ValueError):
                    continue
            if len(by_date) >= 6:
                return by_date
            last_err = RuntimeError("empty a-kline " + ticker)
        time.sleep(0.4 * (attempt + 1))
    raise last_err or RuntimeError("no a-kline " + ticker)


def ret_n(closes, n):
    if len(closes) < n + 1:
        return None
    prev = closes[-(n + 1)]
    last = closes[-1]
    if prev <= 0:
        return None
    return round((last / prev - 1.0) * 100.0, 2)


def quote_as_of(hist, asof):
    all_dates = sorted(hist)
    dates = [d for d in all_dates if d <= asof]
    if len(dates) < 2:
        return None
    t = dates[-1]
    closes = [hist[d]["close"] for d in dates]
    after = [d for d in all_dates if d > asof]
    day_pct = None
    day_asof = None
    if after:
        nxt = after[0]
        prev = hist[t]["close"]
        last = hist[nxt]["close"]
        if prev > 0:
            day_pct = round((last / prev - 1.0) * 100.0, 2)
            day_asof = nxt
    return {
        "asOf": t,
        "prevClose": round(hist[t]["close"], 2),
        "dayPct": day_pct,
        "dayAsOf": day_asof,
        "d1Pct": ret_n(closes, 1),
        "d5Pct": ret_n(closes, 5),
        "d10Pct": ret_n(closes, 10),
    }


def dt_of_unix(ts):
    try:
        return dt.datetime.fromtimestamp(int(ts), TZ8).strftime("%Y-%m-%d %H:%M")
    except (TypeError, ValueError, OSError):
        return ""


def news_when(show, ts=None):
    s = str(show or "").strip()
    if len(s) >= 16 and s[10] in " T":
        return s[:16].replace("T", " ")
    full = dt_of_unix(ts) if ts else ""
    if full:
        return full
    if len(s) >= 10 and s[4] == "-":
        return s[:10]
    return ""


def add_days(ymd, n):
    d = dt.datetime.strptime(ymd, "%Y-%m-%d")
    return (d + dt.timedelta(days=n)).strftime("%Y-%m-%d")


def fetch_sina_news(pages=8, num=50):
    items = []
    seen = set()
    for page in range(1, pages + 1):
        url = "https://feed.mix.sina.com.cn/api/roll/get?pageid=153&lid=2516&num=%s&page=%s" % (num, page)
        try:
            data = http_json(url, "https://finance.sina.com.cn/")
        except Exception as e:
            print("sina page", page, "ERR", e)
            continue
        rows = ((data.get("result") or {}).get("data")) or []
        for it in rows:
            link = it.get("url") or ""
            if not link or link in seen:
                continue
            seen.add(link)
            title = it.get("title") or it.get("stitle") or ""
            intro = it.get("intro") or it.get("summary") or ""
            items.append({
                "title": title,
                "url": link,
                "date": news_when("", it.get("ctime") or it.get("intime")),
                "source": it.get("media_name") or "新浪财经",
                "blob": (title + " " + intro).lower(),
            })
        time.sleep(0.15)
    return items


def fetch_em_news(column, pages=2, size=20):
    items = []
    seen = set()
    for page in range(1, pages + 1):
        url = (
            "https://np-listapi.eastmoney.com/comm/web/getNewsByColumns"
            "?biz=web_news_col&client=web&clientType=web&clientVersion=curr"
            "&column=%s&pageSize=%s&pageIndex=%s&req_trace=ctx"
            % (column, size, page)
        )
        try:
            data = http_json(url, "https://finance.eastmoney.com/")
        except Exception as e:
            print("em", column, "page", page, "ERR", e)
            continue
        rows = ((data.get("data") or {}).get("list")) or []
        for it in rows:
            link = it.get("uniqueUrl") or it.get("url") or ""
            if not link or link in seen:
                continue
            seen.add(link)
            title = it.get("title") or ""
            intro = it.get("summary") or ""
            show = it.get("showTime") or it.get("date") or ""
            items.append({
                "title": title,
                "url": link,
                "date": news_when(show),
                "source": it.get("mediaName") or "东方财富",
                "blob": (title + " " + intro).lower(),
            })
        time.sleep(0.15)
    return items


def news_keys(*parts):
    """Drop empty / too-short tokens. Skip 1–3 letter US tickers (NOW, KO, ARM)."""
    out = []
    seen = set()
    for p in parts:
        if not p:
            continue
        s = str(p).strip()
        if len(s) < 2:
            continue
        if re.match(r"^[A-Za-z]{1,3}$", s):
            continue
        key = s.lower()
        if key in seen:
            continue
        seen.add(key)
        out.append(s)
    return out


def match_news(pool, keywords, start, end, limit, title_only=False):
    keys = news_keys(*keywords)
    keys_l = [k.lower() for k in keys]
    scored = []
    for it in pool:
        day = (it.get("date") or "")[:10]
        if day and (day < start or day > end):
            continue
        blob = ((it.get("title") or "") if title_only else (it.get("blob") or it.get("title") or "")).lower()
        hits = [keys[i] for i, k in enumerate(keys_l) if k and k in blob]
        if not hits:
            continue
        scored.append((len(hits), it, hits))
    scored.sort(key=lambda x: (x[1].get("date") or "", x[0]), reverse=True)
    scored.sort(key=lambda x: -x[0])
    out = []
    seen = set()
    for _n, it, hits in scored:
        if it["url"] in seen:
            continue
        seen.add(it["url"])
        out.append({
            "title": it["title"],
            "url": it["url"],
            "date": it["date"],
            "source": it["source"],
            "tags": hits[:3],
        })
        if len(out) >= limit:
            break
    return out


def public_item(it, extra_tags):
    tags = list(it.get("tags") or [])
    for t in extra_tags:
        if t and t not in tags:
            tags.append(t)
    return {
        "title": it["title"],
        "url": it["url"],
        "date": it["date"],
        "source": it["source"],
        "tags": tags[:4],
    }


def load_existing_payload():
    if not os.path.isfile(OUT):
        return None
    text = open(OUT, "r", encoding="utf-8").read()
    m = re.search(r"var DATA = (\{.*\});\s*function quote", text, re.S)
    if not m:
        return None
    try:
        return json.loads(m.group(1))
    except (ValueError, TypeError):
        return None


def load_existing_news():
    payload = load_existing_payload()
    return None if payload is None else payload.get("news")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--start", default="2026-08-17")
    ap.add_argument("--end", default="2026-08-26")
    ap.add_argument("--quotes-only", action="store_true",
                    help="只重抓 A 股日K，沿用现有 market-context.js 里的资讯")
    ap.add_argument("--news-only", action="store_true",
                    help="只重抓资讯，沿用现有 market-context.js 里的行情")
    args = ap.parse_args()

    sectors, us_map, a_shares = parse_mapping()
    sector_by_id = {s["id"]: s for s in sectors}
    days = parse_board()
    if not days:
        raise SystemExit("no board days in sample-board.js")

    existing = load_existing_payload() or {}
    old_quotes = existing.get("quotes") or {}

    quotes = {}
    miss_a = []
    if args.news_only:
        quotes = old_quotes
        raw_miss = ((existing.get("META") or {}).get("aMiss") or "")
        miss_a = [x for x in str(raw_miss).split(",") if x]
        print("reuse quotes", len(quotes))
    else:
        print("fetch A-share klines", len(a_shares))
        for i, ticker in enumerate(sorted(a_shares)):
            try:
                hist = fetch_a_kline(ticker)
                per_day = {}
                for day in days:
                    q = quote_as_of(hist, day["usDate"])
                    if q:
                        per_day[day["usDate"]] = q
                if per_day:
                    quotes[ticker] = per_day
                    print("OK", ticker, a_shares[ticker], "days", len(per_day))
                else:
                    miss_a.append(ticker)
                    print("EMPTY", ticker)
            except Exception as e:
                miss_a.append(ticker)
                print("MISS", ticker, type(e).__name__, e)
            time.sleep(0.2)

        kept = 0
        for ticker, per_day in old_quotes.items():
            if ticker not in quotes and per_day:
                quotes[ticker] = per_day
                kept += 1
                if ticker in miss_a:
                    miss_a.remove(ticker)
        if kept:
            print("kept previous quotes", kept)

    news = None
    news_pool_n = 0
    if args.quotes_only:
        news = load_existing_news()
        if news is None:
            raise SystemExit("quotes-only: 读不到现有 market-context.js 的资讯")
        news_pool_n = sum(len(v) for group in news.values() for v in group.values())
        print("reuse news", news_pool_n)
    else:
        print("fetch news")
        pool = []
        pool.extend(fetch_sina_news())
        print("sina", len(pool))
        pool.extend(fetch_em_news(350, pages=4))
        pool.extend(fetch_em_news(395, pages=2))
        print("news pool", len(pool))
        news_pool_n = len(pool)

        news = {"sector": {}, "us": {}, "a": {}}
        for day in days:
            us_date = day["usDate"]
            day_end = add_days(us_date, 1)
            week_start = add_days(us_date, -7)
            for sec in day["sectors"]:
                info = sector_by_id.get(sec["id"]) or {}
                leader = sec.get("leader")
                gainer = sec.get("gainer")
                leader_name = (us_map.get(leader) or {}).get("name") or ""
                gainer_name = (us_map.get(gainer) or {}).get("name") or ""
                kws = news_keys(
                    info.get("nameCn"), info.get("nameEn"),
                    leader, leader_name, gainer, gainer_name,
                    *EXTRA_KW.get(sec["id"], []),
                )
                items = match_news(pool, kws, us_date, day_end, 6, True)
                tagged = []
                for it in items:
                    extra = []
                    blob = (it["title"] or "").lower()
                    if leader and (leader.lower() in blob or leader_name.lower() in blob):
                        extra.append("龙头")
                    if gainer and gainer != leader and (gainer.lower() in blob or gainer_name.lower() in blob):
                        extra.append("涨幅最高")
                    if not extra:
                        extra.append("板块")
                    tagged.append(public_item(it, extra))
                news["sector"][us_date + "|" + sec["id"]] = tagged

                for tk, role in ((leader, "龙头"), (gainer, "涨幅最高")):
                    if not tk:
                        continue
                    name = (us_map.get(tk) or {}).get("name") or ""
                    items_u = match_news(pool, news_keys(tk, name), us_date, day_end, 4, True)
                    news["us"][us_date + "|" + tk] = [public_item(x, [role]) for x in items_u]

            for ticker, name in a_shares.items():
                items_a = match_news(pool, [ticker, name], week_start, day_end, 4, True)
                if items_a:
                    news["a"][us_date + "|" + ticker] = [public_item(x, ["近一周"]) for x in items_a]

    payload = {
        "META": {
            "quoteSource": "腾讯财经 A 股日K",
            "newsSource": "新浪财经美股频道 + 东方财富资讯",
            "start": args.start,
            "end": args.end,
            "fetchedAt": dt.datetime.now().strftime("%Y-%m-%d %H:%M"),
            "aOk": len(quotes),
            "aMiss": ",".join(miss_a),
            "newsPool": news_pool_n,
        },
        "quotes": quotes,
        "news": news,
    }
    js = (
        "/* Generated by tools/fetch_context.py — do not edit by hand. */\n"
        "var MarketContext = (function () {\n"
        "  var DATA = %s;\n"
        "  function quote(ticker, usDate) {\n"
        "    var m = DATA.quotes[ticker];\n"
        "    return m ? (m[usDate] || null) : null;\n"
        "  }\n"
        "  function sectorNews(usDate, sectorId) {\n"
        "    return (DATA.news.sector[usDate + '|' + sectorId] || []).slice();\n"
        "  }\n"
        "  function usNews(usDate, ticker) {\n"
        "    return (DATA.news.us[usDate + '|' + ticker] || []).slice();\n"
        "  }\n"
        "  function aNews(usDate, ticker) {\n"
        "    return (DATA.news.a[usDate + '|' + ticker] || []).slice();\n"
        "  }\n"
        "  return {\n"
        "    META: DATA.META,\n"
        "    quote: quote,\n"
        "    sectorNews: sectorNews,\n"
        "    usNews: usNews,\n"
        "    aNews: aNews\n"
        "  };\n"
        "})();\n"
    ) % json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write(js)
    print("wrote", OUT, "bytes", len(js))
    print("quotes", len(quotes), "miss", miss_a)


if __name__ == "__main__":
    main()
