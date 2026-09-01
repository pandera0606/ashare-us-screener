# -*- coding: utf-8 -*-
"""Fetch US daily bars and rebuild js/data/sample-board.js.

Usage:
  python tools/fetch_board.py
  python tools/fetch_board.py --start 2026-08-17 --end 2026-08-25

Source: Tencent Finance daily K (usTICKER.OQ / usTICKER.N).
Sectors are equal-weight averages of seed US tickers in mapping.js.
"""
from __future__ import print_function

import argparse
import datetime as dt
import json
import os
import re
import ssl
import time
import urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MAPPING = os.path.join(ROOT, "js", "data", "mapping.js")
OUT = os.path.join(ROOT, "js", "data", "sample-board.js")

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
CTX = ssl.create_default_context()

# Exchange suffix on Tencent quotes (probed 2026-08-26).
SUFFIX = {
    "NVDA": ".OQ", "AMD": ".OQ", "TSM": ".N", "AVGO": ".OQ", "ASML": ".OQ",
    "AMAT": ".OQ", "LRCX": ".OQ", "KLAC": ".OQ", "MU": ".OQ", "ARM": ".OQ",
    "INTC": ".OQ", "QCOM": ".OQ", "MRVL": ".OQ", "SMCI": ".OQ", "ANET": ".N",
    "MSFT": ".OQ", "GOOGL": ".OQ", "META": ".OQ", "AMZN": ".OQ", "PLTR": ".OQ",
    "ORCL": ".N", "CRM": ".N", "NOW": ".N", "ADBE": ".OQ", "TSLA": ".OQ",
    "RIVN": ".OQ", "LCID": ".OQ", "GM": ".N", "NIO": ".N", "XPEV": ".N",
    "FSLR": ".OQ", "ENPH": ".OQ", "SEDG": ".OQ", "LLY": ".N", "NVO": ".N",
    "MRNA": ".OQ", "VRTX": ".OQ", "AAPL": ".OQ", "NFLX": ".OQ", "COST": ".OQ",
    "NKE": ".N", "KO": ".N", "PG": ".N", "XOM": ".N", "CVX": ".N", "COP": ".N",
    "JPM": ".N", "GS": ".N", "BLK": ".N",
    "COIN": ".OQ", "MSTR": ".OQ", "MARA": ".OQ", "IBIT": ".OQ",
}

SECTOR_RE = re.compile(
    r'id:\s*"(?P<id>[^"]+)"\s*,\s*nameCn:\s*"(?P<nameCn>[^"]+)"\s*,\s*'
    r'nameEn:\s*"(?P<nameEn>[^"]+)"\s*,\s*leaderTicker:\s*"(?P<leader>[^"]+)"',
    re.S,
)
STOCK_RE = re.compile(
    r'\{\s*ticker:\s*"(?P<ticker>[A-Z0-9]+)"\s*,\s*name:\s*"(?P<name>[^"]+)"\s*,'
    r'\s*sectorId:\s*"(?P<sectorId>[^"]+)"'
)


def js_str(s):
    return json.dumps(s, ensure_ascii=False)


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
    stocks = []
    for m in STOCK_RE.finditer(text):
        stocks.append({
            "ticker": m.group("ticker"),
            "name": m.group("name"),
            "sectorId": m.group("sectorId"),
        })
    return sectors, stocks


def http_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    with urllib.request.urlopen(req, context=CTX, timeout=20) as r:
        return json.loads(r.read().decode("utf-8"))


def fetch_kline(ticker, bars=80):
    suffix = SUFFIX.get(ticker, ".OQ")
    codes = ["us%s%s" % (ticker, suffix)]
    if suffix != ".OQ":
        codes.append("us%s.OQ" % ticker)
    if suffix != ".N":
        codes.append("us%s.N" % ticker)
    last_err = None
    for code in codes:
        param = "%s,day,,,%s,qfq" % (code, bars)
        urls = [
            "https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param=" + param,
            "https://proxy.finance.qq.com/ifzqgtimg/appstock/app/newfqkline/get?param=" + param,
        ]
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
            parsed = []
            for row in rows:
                if not row or len(row) < 6:
                    continue
                try:
                    parsed.append({
                        "date": row[0],
                        "open": float(row[1]),
                        "close": float(row[2]),
                        "high": float(row[3]),
                        "low": float(row[4]),
                        "volume": float(row[5] or 0),
                    })
                except (TypeError, ValueError):
                    continue
            if len(parsed) >= 6:
                by_date = {}
                for p in parsed:
                    by_date[p["date"]] = p
                return by_date
            last_err = RuntimeError("empty kline for %s" % code)
    raise last_err or RuntimeError("no kline for " + ticker)


def sma(vals, n):
    if len(vals) < n:
        return None
    return sum(vals[-n:]) / float(n)


def snapshot(ticker, name, hist, us_date):
    dates = sorted(d for d in hist if d <= us_date)
    if len(dates) < 2:
        return None
    today = hist[dates[-1]]
    if today["date"] != us_date:
        return None
    prev = hist[dates[-2]]
    if prev["close"] <= 0:
        return None
    change = (today["close"] / prev["close"] - 1.0) * 100.0
    closes = [hist[d]["close"] for d in dates]
    vols = [hist[d]["volume"] for d in dates]
    ma5 = sma(closes, 5)
    ma10 = sma(closes, 10)
    ma20 = sma(closes, 20)
    vol_n = vols[-20:] if len(vols) >= 5 else vols
    vol_avg = sum(vol_n) / float(len(vol_n)) if vol_n else 0.0
    volx = (today["volume"] / vol_avg) if vol_avg > 0 else 0.0
    close = today["close"]

    if ma20 is not None and close >= ma20:
        if ma5 is not None and ma10 is not None and ma5 >= ma20 and ma5 >= ma10:
            ma_bias = "MA5上穿MA20" if ma10 < ma20 else "站上MA20"
        elif ma10 is not None and close >= ma10:
            ma_bias = "站上MA10"
        elif ma5 is not None and close >= ma5:
            ma_bias = "站上MA5"
        else:
            ma_bias = "站上MA20"
    elif ma10 is not None and close < ma10:
        ma_bias = "跌破MA10"
    elif ma5 is not None and close < ma5:
        ma_bias = "跌破MA5"
    elif ma20 is not None and close < ma20:
        ma_bias = "跌破MA20"
    else:
        ma_bias = "均线纠缠"

    if ma5 is not None and ma10 is not None and ma20 is not None and ma5 > ma10 > ma20 and close > ma20:
        trend = "上升"
    elif ma20 is not None and close < ma20:
        trend = "回调"
    elif ma5 is not None and close < ma5:
        trend = "回调"
    else:
        trend = "震荡"

    bits = []
    if change >= 3:
        bits.append("日内涨幅较大")
    elif change <= -3:
        bits.append("日内回调明显")
    else:
        bits.append("涨跌幅度中性")
    if volx >= 1.8:
        bits.append("量能显著放大")
    elif volx >= 1.15:
        bits.append("量能温和放大")
    elif volx > 0 and volx <= 0.75:
        bits.append("量能偏低")
    else:
        bits.append("量能大致持平")
    bits.append("%s，趋势%s" % (ma_bias, trend))
    note = "；".join(bits) + "。由日K推算，非盘中逐笔。"

    return {
        "ticker": ticker,
        "name": name,
        "changePct": round(change, 2),
        "volumeVsAvg": round(volx, 2),
        "maBias": ma_bias,
        "trend": trend,
        "techNote": note,
    }


def trading_dates(histories, start, end):
    found = set()
    for hist in histories.values():
        for d in hist:
            if start <= d <= end:
                found.add(d)
    return sorted(found)


def build_days(sectors, stocks, histories, start, end):
    name_of = {s["ticker"]: s["name"] for s in stocks}
    members = {}
    for sec in sectors:
        tickers = [s["ticker"] for s in stocks if s["sectorId"] == sec["id"]]
        if sec["leaderTicker"] not in tickers:
            tickers.append(sec["leaderTicker"])
        members[sec["id"]] = tickers

    days = []
    for us_date in trading_dates(histories, start, end):
        ranked = []
        for sec in sectors:
            snaps = []
            for t in members[sec["id"]]:
                hist = histories.get(t)
                if not hist:
                    continue
                snap = snapshot(t, name_of.get(t, t), hist, us_date)
                if snap:
                    snaps.append(snap)
            if not snaps:
                continue
            avg = sum(x["changePct"] for x in snaps) / float(len(snaps))
            leader_t = sec["leaderTicker"]
            leader = None
            for x in snaps:
                if x["ticker"] == leader_t:
                    leader = x
                    break
            if leader is None:
                leader = sorted(snaps, key=lambda x: -x["changePct"])[0]
            top = sorted(snaps, key=lambda x: -x["changePct"])[0]
            ranked.append({
                "id": sec["id"],
                "nameCn": sec["nameCn"],
                "nameEn": sec["nameEn"],
                "changePct": round(avg, 2),
                "leader": leader,
                "topGainer": top,
                "n": len(snaps),
            })
        ranked.sort(key=lambda x: -x["changePct"])
        top3 = ranked[:3]
        if len(top3) < 1:
            continue
        names = "、".join("%s %+.2f%%" % (x["nameCn"], x["changePct"]) for x in top3)
        split_n = sum(1 for x in top3 if x["leader"]["ticker"] != x["topGainer"]["ticker"])
        note = "种子美股等权，涨幅前三：%s。" % names
        if split_n:
            note += "其中 %d 个板块龙头弱于日内最高。" % split_n
        else:
            note += "当日三板块龙头亦为日内最高。"
        days.append({
            "usDate": us_date,
            "note": note,
            "sectors": top3,
        })
    days.sort(key=lambda d: d["usDate"], reverse=True)
    return days


def emit_snap(s):
    return "snap(%s, %s, %.2f, %.2f, %s, %s, %s)" % (
        js_str(s["ticker"]), js_str(s["name"]), s["changePct"], s["volumeVsAvg"],
        js_str(s["maBias"]), js_str(s["trend"]), js_str(s["techNote"]),
    )


def emit_js(days, meta):
    chunks = []
    chunks.append("var SampleBoard = (function () {")
    chunks.append("  function snap(ticker, name, changePct, volumeVsAvg, maBias, trend, techNote) {")
    chunks.append("    return {")
    chunks.append("      ticker: ticker,")
    chunks.append("      name: name,")
    chunks.append("      changePct: changePct,")
    chunks.append("      volumeVsAvg: volumeVsAvg,")
    chunks.append("      maBias: maBias,")
    chunks.append("      trend: trend,")
    chunks.append("      techNote: techNote")
    chunks.append("    };")
    chunks.append("  }")
    chunks.append("")
    chunks.append("  var META = {")
    chunks.append("    provider: %s," % js_str(meta["provider"]))
    chunks.append("    source: %s," % js_str(meta["source"]))
    chunks.append("    start: %s," % js_str(meta["start"]))
    chunks.append("    end: %s," % js_str(meta["end"]))
    chunks.append("    fetchedAt: %s," % js_str(meta["fetchedAt"]))
    chunks.append("    tickersOk: %s," % js_str(meta["tickersOk"]))
    chunks.append("    tickersMiss: %s" % js_str(meta["tickersMiss"]))
    chunks.append("  };")
    chunks.append("")
    chunks.append("  var DAYS = [")
    for i, day in enumerate(days):
        chunks.append("    {")
        chunks.append("      usDate: %s," % js_str(day["usDate"]))
        chunks.append("      note: %s," % js_str(day["note"]))
        chunks.append("      sectors: [")
        for j, sec in enumerate(day["sectors"]):
            comma = "," if j < len(day["sectors"]) - 1 else ""
            chunks.append("        {")
            chunks.append("          id: %s," % js_str(sec["id"]))
            chunks.append("          nameCn: %s," % js_str(sec["nameCn"]))
            chunks.append("          nameEn: %s," % js_str(sec["nameEn"]))
            chunks.append("          changePct: %.2f," % sec["changePct"])
            chunks.append("          leader: %s," % emit_snap(sec["leader"]))
            chunks.append("          topGainer: %s" % emit_snap(sec["topGainer"]))
            chunks.append("        }" + comma)
        chunks.append("      ]")
        chunks.append("    }" + ("," if i < len(days) - 1 else ""))
    chunks.append("  ];")
    chunks.append("")
    chunks.append("  var byDate = {};")
    chunks.append("  DAYS.forEach(function (d) { byDate[d.usDate] = d; });")
    chunks.append("")
    chunks.append("  function listDates() {")
    chunks.append("    return DAYS.map(function (d) { return d.usDate; });")
    chunks.append("  }")
    chunks.append("")
    chunks.append("  function getDay(usDate) {")
    chunks.append("    return byDate[usDate] || null;")
    chunks.append("  }")
    chunks.append("")
    chunks.append("  function latestDate() {")
    chunks.append("    return DAYS.length ? DAYS[0].usDate : null;")
    chunks.append("  }")
    chunks.append("")
    chunks.append("  function hasBoard(usDate) {")
    chunks.append("    return !!byDate[usDate];")
    chunks.append("  }")
    chunks.append("")
    chunks.append("  return {")
    chunks.append("    DAYS: DAYS,")
    chunks.append("    META: META,")
    chunks.append("    listDates: listDates,")
    chunks.append("    getDay: getDay,")
    chunks.append("    latestDate: latestDate,")
    chunks.append("    hasBoard: hasBoard")
    chunks.append("  };")
    chunks.append("})();")
    chunks.append("")
    header = (
        "/* Generated by tools/fetch_board.py — do not edit by hand.\n"
        " * %s to %s, fetched %s\n"
        " */\n"
    ) % (meta["start"], meta["end"], meta["fetchedAt"])
    return header + "\n".join(chunks)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--start", default="2026-08-17")
    ap.add_argument("--end", default="2026-08-31")
    args = ap.parse_args()

    sectors, stocks = parse_mapping()
    tickers = []
    seen = set()
    for s in stocks:
        if s["ticker"] not in seen:
            seen.add(s["ticker"])
            tickers.append(s["ticker"])
    for sec in sectors:
        if sec["leaderTicker"] not in seen:
            seen.add(sec["leaderTicker"])
            tickers.append(sec["leaderTicker"])

    histories = {}
    miss = []
    for i, t in enumerate(tickers):
        try:
            histories[t] = fetch_kline(t)
            n = len(histories[t])
            print("OK", t, "bars", n)
        except Exception as e:
            miss.append(t)
            print("MISS", t, type(e).__name__, e)
        time.sleep(0.12)

    days = build_days(sectors, stocks, histories, args.start, args.end)
    if not days:
        raise SystemExit("no board days built")

    meta = {
        "provider": "腾讯财经日K · 种子美股等权板块",
        "source": "tencent-kline",
        "start": args.start,
        "end": args.end,
        "fetchedAt": dt.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "tickersOk": ",".join(sorted(histories.keys())),
        "tickersMiss": ",".join(miss),
    }
    text = emit_js(days, meta)
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    print("wrote", OUT)
    print("days", [d["usDate"] for d in days])
    print("ok", len(histories), "miss", miss)


if __name__ == "__main__":
    main()
