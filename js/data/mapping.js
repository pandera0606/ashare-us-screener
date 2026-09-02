var MappingData = (function () {
  var RELATIONS = ["对标", "供应链", "同概念", "ADR"];
  var STORAGE_KEY = "ashare-us-screener-mapping-v2";
  var KINDS = ["gics", "extra"];

  var SECTORS = [];
  var CONCEPTS = [];
  var US_STOCKS = [];
  var SEED = { sectors: [], concepts: [], usStocks: [] };
  var aNameIndex = {};
  var aToUs = {};

  function cloneJson(x) {
    return JSON.parse(JSON.stringify(x));
  }

  function replaceArray(target, next) {
    target.length = 0;
    (next || []).forEach(function (item) {
      target.push(item);
    });
  }

  function findById(list, id) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function sectorById(id) {
    return findById(SECTORS, id);
  }

  function conceptById(id) {
    return findById(CONCEPTS, id);
  }

  function usByTicker(ticker) {
    var t = String(ticker || "").toUpperCase();
    for (var i = 0; i < US_STOCKS.length; i++) {
      if (US_STOCKS[i].ticker === t) return US_STOCKS[i];
    }
    return null;
  }

  function normalize(raw) {
    var s = String(raw || "").trim().toUpperCase();
    s = s.replace(/[\s．。]/g, "");
    s = s.replace(/\.(SH|SZ|SS|HK|US)$/i, "");
    s = s.replace(/^(SH|SZ|SS)/, "");
    if (/^\d{1,5}$/.test(s)) {
      while (s.length < 6) s = "0" + s;
    }
    return s;
  }

  function isAShare(ticker) {
    return /^\d{6}$/.test(ticker);
  }

  function rememberA(ticker, name) {
    if (!aNameIndex[ticker]) aNameIndex[ticker] = name;
  }

  function rebuildIndexes() {
    aNameIndex = {};
    aToUs = {};
    SECTORS.concat(CONCEPTS).forEach(function (sec) {
      (sec.aShares || []).forEach(function (a) { rememberA(a.ticker, a.name); });
    });
    US_STOCKS.forEach(function (us) {
      (us.aShares || []).forEach(function (a) {
        rememberA(a.ticker, a.name);
        if (!aToUs[a.ticker]) aToUs[a.ticker] = [];
        aToUs[a.ticker].push({
          ticker: us.ticker,
          name: us.name,
          relation: a.relation,
          note: a.note,
          sectorId: us.sectorId
        });
      });
    });
  }

  function mapAShare(a, withRel) {
    var row = {
      ticker: normalize(a && a.ticker),
      name: String((a && a.name) || "").trim(),
      note: String((a && a.note) || "").trim()
    };
    if (withRel) {
      row.relation = RELATIONS.indexOf(a && a.relation) >= 0 ? a.relation : "同概念";
    }
    return row;
  }

  function mapGroup(sec, withKind) {
    var row = {
      id: String((sec && sec.id) || "").trim(),
      nameCn: String((sec && sec.nameCn) || "").trim(),
      nameEn: String((sec && sec.nameEn) || "").trim(),
      leaderTicker: normalize((sec && sec.leaderTicker) || ""),
      aShares: ((sec && sec.aShares) || []).map(function (a) {
        return mapAShare(a, false);
      }).filter(function (a) { return a.ticker && a.name; })
    };
    if (withKind) {
      row.kind = KINDS.indexOf(sec && sec.kind) >= 0 ? sec.kind : "gics";
    }
    return row;
  }

  function mapConceptIds(raw) {
    var seen = {};
    var out = [];
    ((raw && Array.isArray(raw)) ? raw : []).forEach(function (id) {
      var v = String(id || "").trim();
      if (!v || seen[v]) return;
      seen[v] = true;
      out.push(v);
    });
    return out;
  }

  function normalizePayload(data) {
    var sectors = ((data && data.sectors) || []).map(function (sec) {
      return mapGroup(sec, true);
    });
    var concepts = ((data && data.concepts) || []).map(function (sec) {
      return mapGroup(sec, false);
    });
    var usStocks = ((data && data.usStocks) || []).map(function (us) {
      return {
        ticker: normalize((us && us.ticker) || ""),
        name: String((us && us.name) || "").trim(),
        sectorId: String((us && us.sectorId) || "").trim(),
        conceptIds: mapConceptIds(us && us.conceptIds),
        aShares: ((us && us.aShares) || []).map(function (a) {
          return mapAShare(a, true);
        }).filter(function (a) { return a.ticker && a.name; })
      };
    });
    return { sectors: sectors, concepts: concepts, usStocks: usStocks };
  }

  function validateGroup(list, label, ids) {
    var i, j, sec, a;
    for (i = 0; i < list.length; i++) {
      sec = list[i];
      if (!sec.id) return label + "缺少 id";
      if (!/^[a-z][a-z0-9_-]*$/.test(sec.id)) {
        return label + " id 只能用小写字母开头，后接字母/数字/下划线/连字符：" + sec.id;
      }
      if (ids[sec.id]) return label + " id 重复：" + sec.id;
      ids[sec.id] = true;
      if (!sec.nameCn) return label + "缺少中文名：" + sec.id;
      if (!sec.nameEn) return label + "缺少英文名：" + sec.id;
      if (!sec.leaderTicker) return label + "「" + (sec.nameCn || sec.id) + "」缺少龙头美股代码";
      if (!Array.isArray(sec.aShares)) return label + " aShares 必须是数组：" + sec.id;
      for (j = 0; j < sec.aShares.length; j++) {
        a = sec.aShares[j];
        if (!a.ticker || !a.name) return label + " " + sec.id + " 的 A 股缺代码或名称";
        if (!isAShare(a.ticker)) return label + " " + sec.id + " 的 A 股代码应为 6 位数字：" + a.ticker;
      }
    }
    return null;
  }

  function validate(data) {
    if (!data || !Array.isArray(data.sectors) || !Array.isArray(data.usStocks)) {
      return "需要 sectors 与 usStocks 两个数组";
    }
    if (!Array.isArray(data.concepts)) return "需要 concepts 数组（可为 empty）";
    if (!data.sectors.length) return "至少保留一个板块";
    var sectorIds = {};
    var conceptIds = {};
    var err = validateGroup(data.sectors, "板块", sectorIds);
    if (err) return err;
    err = validateGroup(data.concepts, "概念", conceptIds);
    if (err) return err;
    var i, j, us, a, k;
    var tickers = {};
    for (i = 0; i < data.usStocks.length; i++) {
      us = data.usStocks[i];
      if (!us.ticker || !us.name) return "美股缺代码或名称";
      if (!/^[A-Z0-9][A-Z0-9._-]*$/.test(us.ticker)) return "美股代码无效：" + us.ticker;
      if (tickers[us.ticker]) return "美股代码重复：" + us.ticker;
      tickers[us.ticker] = true;
      if (!sectorIds[us.sectorId]) return us.ticker + " 的 sectorId 不存在：" + us.sectorId;
      for (k = 0; k < (us.conceptIds || []).length; k++) {
        if (!conceptIds[us.conceptIds[k]]) {
          return us.ticker + " 的概念不存在：" + us.conceptIds[k];
        }
      }
      if (!Array.isArray(us.aShares) || !us.aShares.length) {
        return us.ticker + " 至少需要一条 A 股映射";
      }
      for (j = 0; j < us.aShares.length; j++) {
        a = us.aShares[j];
        if (!a.ticker || !a.name) return us.ticker + " 的 A 股缺代码或名称";
        if (!isAShare(a.ticker)) return us.ticker + " 的 A 股代码应为 6 位数字：" + a.ticker;
        if (RELATIONS.indexOf(a.relation) === -1) return us.ticker + " 的关系类型无效：" + a.relation;
      }
    }
    for (i = 0; i < data.sectors.length; i++) {
      if (!tickers[data.sectors[i].leaderTicker]) {
        return "板块「" + data.sectors[i].nameCn + "」的龙头 " + data.sectors[i].leaderTicker + " 不在美股列表中";
      }
    }
    for (i = 0; i < data.concepts.length; i++) {
      if (!tickers[data.concepts[i].leaderTicker]) {
        return "概念「" + data.concepts[i].nameCn + "」的龙头 " + data.concepts[i].leaderTicker + " 不在美股列表中";
      }
    }
    return null;
  }

  function applyPayload(data, strict) {
    var norm = normalizePayload(data);
    if (strict !== false) {
      var err = validate(norm);
      if (err) return err;
    }
    replaceArray(SECTORS, cloneJson(norm.sectors));
    replaceArray(CONCEPTS, cloneJson(norm.concepts));
    replaceArray(US_STOCKS, cloneJson(norm.usStocks));
    rebuildIndexes();
    return null;
  }

  function snapshot() {
    return { sectors: cloneJson(SECTORS), concepts: cloneJson(CONCEPTS), usStocks: cloneJson(US_STOCKS) };
  }

  function seedSnapshot() {
    return cloneJson(SEED);
  }

  function readStorage() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function hasOverride() {
    return !!readStorage();
  }

  function saveOverride(data) {
    var norm = normalizePayload(data);
    var err = validate(norm);
    if (err) return err;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(norm));
    } catch (e) {
      return "本机存储失败：" + (e && e.message ? e.message : e);
    }
    return applyPayload(norm);
  }

  function clearOverride() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    return applyPayload(SEED, false);
  }

  function jsStr(s) {
    return JSON.stringify(s == null ? "" : String(s));
  }

  function emitAShare(a, withRel) {
    var parts = ["ticker: " + jsStr(a.ticker), "name: " + jsStr(a.name)];
    if (withRel) parts.push("relation: " + jsStr(a.relation || "同概念"));
    parts.push("note: " + jsStr(a.note || ""));
    return "{ " + parts.join(", ") + " }";
  }

  function emitGroup(lines, list, withKind) {
    list.forEach(function (sec, i) {
      lines.push("    {");
      lines.push("      id: " + jsStr(sec.id) + ",");
      lines.push("      nameCn: " + jsStr(sec.nameCn) + ",");
      lines.push("      nameEn: " + jsStr(sec.nameEn) + ",");
      if (withKind) lines.push("      kind: " + jsStr(sec.kind || "gics") + ",");
      lines.push("      leaderTicker: " + jsStr(sec.leaderTicker) + ",");
      lines.push("      aShares: [");
      (sec.aShares || []).forEach(function (a, j, arr) {
        lines.push("        " + emitAShare(a, false) + (j < arr.length - 1 ? "," : ""));
      });
      lines.push("      ]");
      lines.push("    }" + (i < list.length - 1 ? "," : ""));
    });
  }

  function emitSeedFile(data) {
    var norm = normalizePayload(data || snapshot());
    var lines = [];
    lines.push("/* 板块与股票映射种子。用根目录 mapping.html 编辑后覆盖本文件。不构成投资建议。");
    lines.push(" * sectors = GICS 一级行业 + 非 GICS 增补（如加密货币）。");
    lines.push(" * concepts = 原来的主题板块，现作概念标签；一只美股可挂多个概念。");
    lines.push(" */");
    lines.push("var MappingSeed = {");
    lines.push("  sectors: [");
    emitGroup(lines, norm.sectors, true);
    lines.push("  ],");
    lines.push("  concepts: [");
    emitGroup(lines, norm.concepts, false);
    lines.push("  ],");
    lines.push("  usStocks: [");
    norm.usStocks.forEach(function (us, i) {
      var cjs = "[" + (us.conceptIds || []).map(jsStr).join(", ") + "]";
      lines.push("    { ticker: " + jsStr(us.ticker) + ", name: " + jsStr(us.name) + ", sectorId: " + jsStr(us.sectorId) + ", conceptIds: " + cjs + ", aShares: [");
      (us.aShares || []).forEach(function (a, j, arr) {
        lines.push("      " + emitAShare(a, true) + (j < arr.length - 1 ? "," : ""));
      });
      lines.push("    ]}" + (i < norm.usStocks.length - 1 ? "," : ""));
    });
    lines.push("  ]");
    lines.push("};");
    lines.push("");
    return lines.join("\n");
  }

  function getStockName(ticker) {
    var t = normalize(ticker);
    var us = usByTicker(t);
    if (us) return us.name;
    if (aNameIndex[t]) return aNameIndex[t];
    return t;
  }

  function getMarket(ticker) {
    return isAShare(normalize(ticker)) ? "A" : "US";
  }

  function getMappedFromUs(ticker) {
    var us = usByTicker(normalize(ticker));
    return us ? us.aShares.slice() : [];
  }

  function getMappedFromA(ticker) {
    var t = normalize(ticker);
    return (aToUs[t] || []).slice();
  }

  function getRelated(ticker) {
    var t = normalize(ticker);
    if (!t) return { primary: null, mapped: [], market: null };
    if (isAShare(t)) {
      return {
        primary: { ticker: t, name: getStockName(t), market: "A" },
        mapped: getMappedFromA(t).map(function (x) {
          return { ticker: x.ticker, name: x.name, market: "US", relation: x.relation, note: x.note };
        }),
        market: "A"
      };
    }
    var us = usByTicker(t);
    return {
      primary: { ticker: t, name: us ? us.name : t, market: "US" },
      mapped: getMappedFromUs(t).map(function (x) {
        return { ticker: x.ticker, name: x.name, market: "A", relation: x.relation, note: x.note };
      }),
      market: "US"
    };
  }

  function getAllStocks() {
    var list = [];
    var seen = {};
    US_STOCKS.forEach(function (us) {
      if (!seen[us.ticker]) {
        seen[us.ticker] = true;
        list.push({ ticker: us.ticker, name: us.name, market: "US", sectorId: us.sectorId });
      }
      us.aShares.forEach(function (a) {
        if (!seen[a.ticker]) {
          seen[a.ticker] = true;
          list.push({ ticker: a.ticker, name: a.name, market: "A", sectorId: us.sectorId });
        }
      });
    });
    SECTORS.concat(CONCEPTS).forEach(function (sec) {
      sec.aShares.forEach(function (a) {
        if (!seen[a.ticker]) {
          seen[a.ticker] = true;
          list.push({ ticker: a.ticker, name: a.name, market: "A", sectorId: sec.id });
        }
      });
    });
    return list;
  }

  function searchStocks(q) {
    var query = String(q || "").trim().toUpperCase();
    if (!query) return [];
    return getAllStocks().filter(function (s) {
      return s.ticker.indexOf(query) !== -1 || String(s.name).toUpperCase().indexOf(query) !== -1;
    }).slice(0, 20);
  }

  function isKnown(ticker) {
    var t = normalize(ticker);
    return !!(usByTicker(t) || aNameIndex[t]);
  }

  (function init() {
    var fileSeed = {
      sectors: (typeof MappingSeed !== "undefined" && MappingSeed.sectors) ? MappingSeed.sectors : [],
      concepts: (typeof MappingSeed !== "undefined" && MappingSeed.concepts) ? MappingSeed.concepts : [],
      usStocks: (typeof MappingSeed !== "undefined" && MappingSeed.usStocks) ? MappingSeed.usStocks : []
    };
    SEED = cloneJson(fileSeed);
    var stored = readStorage();
    var err = stored ? applyPayload(stored, true) : applyPayload(SEED, false);
    if (err) {
      if (typeof console !== "undefined" && console.warn) {
        console.warn("mapping override ignored:", err);
      }
      applyPayload(SEED, false);
    }
  })();

  return {
    SECTORS: SECTORS,
    CONCEPTS: CONCEPTS,
    US_STOCKS: US_STOCKS,
    RELATIONS: RELATIONS,
    KINDS: KINDS,
    STORAGE_KEY: STORAGE_KEY,
    sectorById: sectorById,
    conceptById: conceptById,
    usByTicker: usByTicker,
    normalize: normalize,
    isAShare: isAShare,
    getStockName: getStockName,
    getMarket: getMarket,
    getMappedFromUs: getMappedFromUs,
    getMappedFromA: getMappedFromA,
    getRelated: getRelated,
    getAllStocks: getAllStocks,
    searchStocks: searchStocks,
    isKnown: isKnown,
    validate: validate,
    normalizePayload: normalizePayload,
    snapshot: snapshot,
    seedSnapshot: seedSnapshot,
    hasOverride: hasOverride,
    saveOverride: saveOverride,
    clearOverride: clearOverride,
    emitSeedFile: emitSeedFile
  };
})();
