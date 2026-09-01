(function () {
  if (typeof window.MappingData === "undefined") {
    window.MappingData = {
      normalize: function (raw) {
        var t = String(raw || "").trim().toUpperCase();
        t = t.replace(/^(SH|SZ|SS)\.?/, "");
        if (/^\d+$/.test(t) && t.length < 6) {
          while (t.length < 6) t = "0" + t;
        }
        return t;
      },
      getRelated: function (t) {
        t = this.normalize(t);
        return { primary: { ticker: t, name: t }, mapped: [] };
      },
      getMappedFromUs: function () { return []; },
      getStockName: function (t) { return this.normalize(t); },
      searchStocks: function () { return []; },
      isKnown: function () { return false; },
      sectorById: function () { return null; },
      usByTicker: function () { return null; }
    };
  }
  if (typeof window.SampleBoard === "undefined") {
    window.SampleBoard = {
      DAYS: [],
      META: null,
      listDates: function () { return []; },
      getDay: function () { return null; },
      latestDate: function () { return null; },
      hasBoard: function () { return false; }
    };
  }
  if (typeof window.SampleAnalysis === "undefined") {
    window.SampleAnalysis = {};
  }

  function briefingReady() {
    return typeof DailyBriefings !== "undefined" && DailyBriefings;
  }

  function latestDataDate() {
    var dates = [];
    var d = SampleBoard.latestDate();
    if (d) dates.push(d);
    if (briefingReady()) {
      var b = DailyBriefings.latestDate();
      if (b) dates.push(b);
    }
    dates.sort();
    return dates.length ? dates[dates.length - 1] : null;
  }

  var state = {
    viewYear: 2026,
    viewMonth: 7,
    selectedDate: latestDataDate() || "2026-08-26",
    selectedSectorId: null,
    selectedUsTicker: null,
    selectedBriefSector: null,
    drillMode: null,
    focusTicker: null,
    draftShots: [],
    searchQuery: "",
    searchOpen: false,
    searchSelected: [],
    notes: [],
    toastTimer: null,
    calDrawerOpen: false,
    mapSort: { key: "", dir: "desc" }
  };

  var QUOTE_COLS = [
    { key: "prevClose", label: "前收", kind: "price" },
    { key: "dayPct", label: "当日涨幅", kind: "pct" },
    { key: "d1Pct", label: "前日涨幅", kind: "pct" },
    { key: "d5Pct", label: "5日涨幅", kind: "pct" },
    { key: "d10Pct", label: "10日涨幅", kind: "pct" }
  ];

  var MAX_SHOT_BYTES = 2 * 1024 * 1024;

  function $(id) {
    return document.getElementById(id);
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function pctClass(n) {
    if (n > 0) return "up";
    if (n < 0) return "down";
    return "";
  }

  function fmtPct(n) {
    var sign = n > 0 ? "+" : "";
    return sign + Number(n).toFixed(2) + "%";
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function ymd(y, m, d) {
    return y + "-" + pad(m + 1) + "-" + pad(d);
  }

  function beijingHint(usDate) {
    var p = usDate.split("-");
    var dt = new Date(Date.UTC(Number(p[0]), Number(p[1]) - 1, Number(p[2]) + 1, 4, 0, 0));
    return "北京时间 " + dt.getUTCFullYear() + "-" + pad(dt.getUTCMonth() + 1) + "-" + pad(dt.getUTCDate()) + " 04:00 后（夏令时收盘）";
  }

  function weekday(usDate) {
    var p = usDate.split("-");
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2])).getDay();
  }

  function notesForDate(usDate) {
    return state.notes.filter(function (n) { return n.usDate === usDate; });
  }

  function datesWithNotes() {
    var map = {};
    state.notes.forEach(function (n) { map[n.usDate] = true; });
    return map;
  }

  function showToast(msg) {
    var el = $("toast-root");
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(function () { el.hidden = true; }, 2200);
  }

  function hasUnsavedWork() {
    var fund = $("fund-text");
    var tech = $("tech-text");
    if (state.draftShots.length) return true;
    if (fund && fund.value.trim()) return true;
    if (tech && tech.value.trim()) return true;
    return false;
  }

  function reloadApp() {
    showToast("正在刷新…");
    var go = function () { location.reload(); };
    if (!("serviceWorker" in navigator) || !navigator.serviceWorker.getRegistration) {
      go();
      return;
    }
    navigator.serviceWorker.getRegistration().then(function (reg) {
      return reg ? reg.update() : null;
    }).catch(function () {}).then(go);
  }

  function isNarrow() {
    return window.matchMedia("(max-width: 980px)").matches;
  }

  function td(label, inner, extraClass) {
    return '<td data-label="' + esc(label) + '"' +
      (extraClass ? ' class="' + extraClass + '"' : "") + ">" + inner + "</td>";
  }

  function tableWrap(html) {
    return '<div class="table-wrap">' + html + "</div>";
  }

  function ensureFold(panel, id) {
    if (!panel) return;
    panel.classList.add("foldable");
    if (!panel.id) panel.id = id;
    var head = panel.querySelector(".panel-head");
    if (!head || head.querySelector(".fold-toggle")) return;
    var wrap = document.createElement("div");
    wrap.className = "fold-head-text";
    while (head.firstChild) wrap.appendChild(head.firstChild);
    head.appendChild(wrap);
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn ghost fold-toggle";
    btn.setAttribute("data-action", "toggle-fold");
    btn.setAttribute("data-fold", panel.id);
    btn.textContent = "展开";
    head.appendChild(btn);
  }

  function ensureMobileChrome() {
    var top = document.querySelector(".topbar");
    if (top && !$("date-bar")) {
      var bar = document.createElement("div");
      bar.id = "date-bar";
      bar.className = "date-bar";
      top.parentNode.insertBefore(bar, top.nextSibling);
    }
    if (!$("cal-backdrop")) {
      var bd = document.createElement("div");
      bd.id = "cal-backdrop";
      bd.className = "cal-backdrop";
      bd.setAttribute("data-action", "close-cal");
      document.body.appendChild(bd);
    }
    var side = document.querySelector(".sidebar");
    if (side && !side.id) side.id = "calendar-drawer";
    ensureFold(document.querySelector(".search-panel"), "search-panel");
    ensureFold(document.querySelector(".analysis-panel"), "analysis-panel");
    var notes = $("day-notes-root");
    if (notes && notes.closest) {
      var notesPanel = notes.closest(".panel");
      if (notesPanel) notesPanel.classList.add("day-notes-panel");
    }
  }

  function dateBarMarks(dateStr) {
    var bits = [];
    if (SampleBoard.hasBoard(dateStr)) bits.push("日榜");
    if (briefingReady() && DailyBriefings.hasBriefing(dateStr)) bits.push("简报");
    if (notesForDate(dateStr).length) bits.push("笔记");
    return bits.length ? bits.join(" · ") : "无归档数据";
  }

  function renderDateBar() {
    var el = $("date-bar");
    if (!el) return;
    el.innerHTML =
      '<div class="date-bar-main">' +
        "<strong>" + esc(state.selectedDate) + "</strong>" +
        '<span class="muted">' + esc(dateBarMarks(state.selectedDate)) + "</span>" +
      "</div>" +
      '<div class="date-bar-actions">' +
        '<button type="button" class="btn ghost" data-action="reload-app">刷新</button>' +
        '<button type="button" class="btn ghost" data-action="goto-latest">最近</button>' +
        '<button type="button" class="btn ghost" data-action="toggle-cal">' +
          (state.calDrawerOpen ? "收起" : "换日期") + "</button>" +
      "</div>";
  }

  function syncCalDrawer() {
    var bar = $("date-bar");
    if (bar) {
      document.documentElement.style.setProperty("--date-bar-h", bar.offsetHeight + "px");
    }
    var side = document.querySelector(".sidebar");
    var bd = $("cal-backdrop");
    var open = !!state.calDrawerOpen && isNarrow();
    document.documentElement.classList.toggle("cal-open", open);
    if (side) side.classList.toggle("is-open", open);
    if (bd) {
      bd.classList.toggle("is-open", open);
      bd.hidden = !open;
    }
  }

  function scrollToResults() {
    var target = $("drilldown-root");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openAnalysisPanel() {
    var panel = $("analysis-panel") || document.querySelector(".analysis-panel");
    if (!panel || !isNarrow()) return;
    panel.classList.add("is-open");
    var btn = panel.querySelector(".fold-toggle");
    if (btn) btn.textContent = "收起";
  }

  function renderCalendar() {
    var y = state.viewYear;
    var m = state.viewMonth;
    var first = new Date(y, m, 1);
    var startWeekday = (first.getDay() + 6) % 7;
    var daysInMonth = new Date(y, m + 1, 0).getDate();
    var noteMap = datesWithNotes();
    var cells = [];
    var i;
    for (i = 0; i < startWeekday; i++) cells.push(null);
    for (i = 1; i <= daysInMonth; i++) cells.push(i);
    while (cells.length % 7 !== 0) cells.push(null);

    var rows = "";
    for (i = 0; i < cells.length; i += 7) {
      rows += "<tr>";
      for (var j = 0; j < 7; j++) {
        var day = cells[i + j];
        if (day == null) {
          rows += "<td></td>";
          continue;
        }
        var dateStr = ymd(y, m, day);
        var wd = weekday(dateStr);
        var cls = [];
        if (dateStr === state.selectedDate) cls.push("selected");
        if (wd === 0 || wd === 6) cls.push("weekend");
        var marks = "";
        if (SampleBoard.hasBoard(dateStr)) marks += '<i class="dot gold"></i>';
        if (briefingReady() && DailyBriefings.hasBriefing(dateStr)) marks += '<i class="dot brief"></i>';
        if (noteMap[dateStr]) marks += '<i class="dot blue"></i>';
        rows += '<td><button type="button" data-action="pick-date" data-date="' + dateStr + '" class="' + cls.join(" ") + '">' +
          day + '<div class="marks">' + marks + "</div></button></td>";
      }
      rows += "</tr>";
    }

    $("calendar-root").innerHTML =
      '<div class="cal-nav">' +
        '<button type="button" class="btn ghost" data-action="prev-month">上月</button>' +
        "<h2>" + y + "年" + (m + 1) + "月</h2>" +
        '<button type="button" class="btn ghost" data-action="next-month">下月</button>' +
      "</div>" +
      '<div class="cal-quick">' +
        '<button type="button" class="btn ghost" data-action="goto-latest">最近有数据日</button>' +
        '<button type="button" class="btn ghost" data-action="goto-today">今日</button>' +
      "</div>" +
      '<table class="cal-grid"><thead><tr><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th></tr></thead><tbody>' +
      rows + "</tbody></table>";
  }

  function numVal(v) {
    return v == null || v === "" || (typeof v === "number" && isNaN(v));
  }

  function sortMapped(list, getVal) {
    var key = state.mapSort && state.mapSort.key;
    if (!key) return list;
    var dir = state.mapSort.dir === "asc" ? 1 : -1;
    return list.slice().sort(function (a, b) {
      var va = getVal(a, key);
      var vb = getVal(b, key);
      var na = numVal(va);
      var nb = numVal(vb);
      if (na && nb) return 0;
      if (na) return 1;
      if (nb) return -1;
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
  }

  function sortTh(col) {
    var active = state.mapSort.key === col.key;
    var arrow = active ? (state.mapSort.dir === "desc" ? " ↓" : " ↑") : "";
    return '<th class="sortable col-num' + (active ? " is-sorted" : "") + '">' +
      '<button type="button" data-action="sort-quote" data-key="' + esc(col.key) + '">' +
      esc(col.label) + arrow + "</button></th>";
  }

  function quoteHead() {
    return QUOTE_COLS.map(sortTh).join("");
  }

  function fmtQuoteCell(q, col) {
    var v = q ? q[col.key] : null;
    if (numVal(v)) return '<span class="muted">—</span>';
    if (col.kind === "pct") {
      return '<span class="' + pctClass(v) + '">' + fmtPct(v) + "</span>";
    }
    return '<span class="mono">' + v + "</span>";
  }

  function quoteTds(q) {
    return QUOTE_COLS.map(function (col) {
      return td(col.label, fmtQuoteCell(q, col), "col-num");
    }).join("");
  }

  function renderNewsList(items, emptyText) {
    if (!items || !items.length) {
      return '<p class="empty news-empty">' + esc(emptyText || "暂无匹配资讯") + "</p>";
    }
    return '<ul class="news-list">' + items.map(function (n) {
      var tags = (n.tags || []).map(function (t) {
        var cls = "tag";
        if (t === "龙头") cls += " tag-leader";
        else if (t === "涨幅最高") cls += " tag-gainer";
        else if (t === "板块") cls += " tag-sector";
        else if (t === "近一周") cls += " tag-week";
        return '<span class="' + cls + '">' + esc(t) + "</span>";
      }).join("");
      return "<li>" +
        '<a href="' + esc(n.url) + '" target="_blank" rel="noopener noreferrer" data-action="noop">' +
        esc(n.title) + "</a>" +
        '<div class="news-meta">' + esc(n.date || "") + " · " + esc(n.source || "") + tags + "</div>" +
        "</li>";
    }).join("") + "</ul>";
  }

  function ctxReady() {
    return typeof MarketContext !== "undefined";
  }

  function quoteOf(ticker, usDate) {
    if (!ctxReady()) return null;
    var q = MarketContext.quote(ticker, usDate);
    if (!q) return null;
    if (q.dayPct != null) return q;
    var dates = SampleBoard.listDates().slice().sort();
    var i = dates.indexOf(usDate);
    var filled = null;
    if (i >= 0) {
      for (var j = i + 1; j < dates.length; j++) {
        var nq = MarketContext.quote(ticker, dates[j]);
        if (nq && nq.asOf && q.asOf && nq.asOf > q.asOf && nq.d1Pct != null) {
          filled = { dayPct: nq.d1Pct, dayAsOf: nq.asOf };
          break;
        }
      }
    }
    if (!filled) return q;
    var out = {};
    for (var k in q) {
      if (Object.prototype.hasOwnProperty.call(q, k)) out[k] = q[k];
    }
    out.dayPct = filled.dayPct;
    out.dayAsOf = filled.dayAsOf;
    return out;
  }

  function stockBlock(kind, stock, role) {
    return '<div class="stock-row role-' + esc(role || "leader") + '">' +
      '<div class="label">' + esc(kind) + "</div>" +
      '<div class="line1">' +
        '<button type="button" class="stock-link" data-action="pick-us" data-ticker="' + esc(stock.ticker) + '">' +
          esc(stock.ticker) + " " + esc(stock.name) + "</button>" +
        '<span class="pct ' + pctClass(stock.changePct) + '">' + fmtPct(stock.changePct) + "</span>" +
      "</div>" +
      '<div class="tech-meta">量能 ' + Number(stock.volumeVsAvg).toFixed(2) + "x · " + esc(stock.maBias) + " · 趋势 " + esc(stock.trend) + "</div>" +
      '<div class="tech-meta">' + esc(stock.techNote) + "</div>" +
    "</div>";
  }

  function parseUsFromBrief(us) {
    return String(us || "").replace(/[+\-−].*$/, "").trim().split(/\s+/)[0];
  }

  function parseAFromBrief(a) {
    var s = String(a || "");
    var m = s.match(/(\d{6})/);
    var ticker = m ? m[1] : MappingData.normalize(s);
    var name = s.replace(ticker, "").replace(/\s+/g, " ").trim() || ticker;
    return { ticker: ticker, name: name };
  }

  function briefingDay() {
    return briefingReady() ? DailyBriefings.getDay(state.selectedDate) : null;
  }

  function boardDay() {
    return SampleBoard.getDay(state.selectedDate);
  }

  function renderTopbar() {
    var el = $("page-stamp");
    if (!el) return;
    var bits = ["日历按美股交易日归档"];
    if (briefingReady() && DailyBriefings.META) {
      bits.push("简报保存 " + DailyBriefings.META.savedAt);
      bits.push("美股日 " + DailyBriefings.META.latestUsDate);
    } else if (SampleBoard.META) {
      bits.push("日榜 " + SampleBoard.META.start + " 至 " + SampleBoard.META.end);
    }
    el.textContent = bits.join(" · ");
  }

  function renderBriefing() {
    var root = $("briefing-root");
    if (!root) return;
    var day = briefingDay();
    if (!day) {
      if (!briefingReady() || boardDay()) {
        root.innerHTML = "";
        root.hidden = true;
        return;
      }
      root.hidden = false;
      root.innerHTML = '<div class="panel-head"><h2>' + esc(state.selectedDate) + " 隔夜简报</h2>" +
        '<p class="muted">日历已切到这一天。有简报的日期在日历上有绿色点。</p></div>' +
        '<p class="empty">这一天还没有隔夜简报。</p>';
      return;
    }
    root.hidden = false;
    var html = '<div class="date-head"><div><h2>' + esc(day.usDate) + " 隔夜简报</h2>" +
      '<p class="muted">生成 ' + esc(day.generatedAt) + " · 保存 " + esc(day.savedAt) +
      " · 点击板块看映射 A 股，点美股代码看该股对应 A 股</p></div>" +
      '<button type="button" class="btn ghost" data-action="open-brief-doc">阅读全文</button></div>';
    html += '<div class="brief-lead"><strong>' + esc(day.headline) + "</strong></div>";
    if (boardDay()) {
      html += '<p class="muted">下方日榜卡片与原来一样：点板块或代码查看映射。板块全表、逻辑链与破绽在「阅读全文」里。</p>';
    } else {
      html += '<div class="sector-grid">';
      (day.top3 || []).forEach(function (sec) {
        var row = null;
        (day.sectors || []).forEach(function (s) {
          if (s.nameCn === sec.nameCn) row = s;
        });
        var leader = row ? parseUsFromBrief(row.leader) : "";
        var gainer = row ? parseUsFromBrief(row.topGainer) : "";
        var leaderPct = row ? row.leader.replace(leader, "").trim() : "";
        var gainerPct = row ? row.topGainer.replace(gainer, "").trim() : "";
        var same = leader && leader === gainer;
        var active = state.drillMode === "brief-sector" && state.selectedBriefSector === sec.nameCn
          ? " active"
          : "";
        html += '<div class="sector-card' + active + '" data-action="pick-brief-sector" data-name="' +
          esc(sec.nameCn) + '" role="button" tabindex="0">' +
          '<div class="name"><strong>' + esc(sec.nameCn) + '</strong><span class="pct ' +
          pctClass(sec.changePct) + '">' + fmtPct(sec.changePct) + "</span></div>" +
          '<div class="en">' + esc(sec.take || "") + "</div>";
        if (leader) {
          html += '<div class="stock-row role-leader">' +
            '<div class="label">龙头</div>' +
            '<div class="line1">' +
              '<button type="button" class="stock-link" data-action="pick-brief-us" data-ticker="' +
              esc(leader) + '" data-name="' + esc(sec.nameCn) + '">' + esc(leader) + "</button>" +
              '<span class="pct">' + esc(leaderPct) + "</span>" +
            "</div></div>";
        }
        if (gainer) {
          html += '<div class="stock-row role-gainer">' +
            '<div class="label">' + (same ? "涨幅最高（同龙头）" : "涨幅最高") + "</div>" +
            '<div class="line1">' +
              '<button type="button" class="stock-link" data-action="pick-brief-us" data-ticker="' +
              esc(gainer) + '" data-name="' + esc(sec.nameCn) + '">' + esc(gainer) + "</button>" +
              '<span class="pct">' + esc(gainerPct) + "</span>" +
            "</div></div>";
        }
        html += "</div>";
      });
      html += "</div>";
    }
    html += '<div class="brief-links">';
    html += '<button type="button" class="btn ghost" data-action="open-brief-doc">阅读全文</button>';
    if (day.mdPath) {
      html += '<a href="' + esc(day.mdPath) + '" data-action="go">Markdown 源文件</a>';
    }
    var snap = DailyBriefings.META && DailyBriefings.META.pageSnapshot;
    var onSnapshot = !!document.querySelector(".page-snapshot-banner");
    if (snap && !onSnapshot) {
      html += '<a href="' + esc(snap) + '" data-action="go">当日页面快照</a>';
    }
    html += "</div>";
    root.innerHTML = html;
  }

  function renderBoard() {
    var root = $("board-root");
    var day = boardDay();
    if (!day) {
      if (briefingDay()) {
        root.hidden = true;
        root.innerHTML = "";
        return;
      }
      root.hidden = false;
      root.innerHTML = '<div class="date-head"><div><h2>' + state.selectedDate + " 美股收盘</h2>" +
        '<p class="muted">' + beijingHint(state.selectedDate) + "</p></div></div>" +
        '<p class="empty">当日暂无美股板块日榜。仍可在下方做个股分析并保存到这一天。</p>';
      return;
    }
    root.hidden = false;
    var html = '<div class="date-head"><div><h2>' + state.selectedDate + " 美股收盘</h2>" +
      '<p class="muted">' + beijingHint(state.selectedDate) + "</p></div></div>";
    if (SampleBoard.META) {
      html += '<p class="muted">' + esc(SampleBoard.META.provider) +
        " · " + esc(SampleBoard.META.start) + " 至 " + esc(SampleBoard.META.end) +
        " · 抓取于 " + esc(SampleBoard.META.fetchedAt) + "</p>";
    }
    if (ctxReady() && MarketContext.META) {
      html += '<p class="muted">' + esc(MarketContext.META.quoteSource) +
        " · " + esc(MarketContext.META.newsSource) +
        " · 抓取于 " + esc(MarketContext.META.fetchedAt) + "</p>";
    }
    if (day.note) html += '<p class="muted">' + esc(day.note) + "</p>";
    html += '<div class="sector-grid">';
    day.sectors.forEach(function (sec) {
      var active = state.selectedSectorId === sec.id && state.drillMode === "sector" ? " active" : "";
      var gainerLabel = sec.leader && sec.topGainer && sec.leader.ticker === sec.topGainer.ticker
        ? "涨幅最高（同龙头）"
        : "涨幅最高";
      html += '<div class="sector-card' + active + '" data-action="pick-sector" data-id="' + esc(sec.id) + '" role="button" tabindex="0">' +
        '<div class="name"><strong>' + esc(sec.nameCn) + '</strong><span class="pct ' + pctClass(sec.changePct) + '">' + fmtPct(sec.changePct) + "</span></div>" +
        '<div class="en">' + esc(sec.nameEn) + "</div>" +
        stockBlock("龙头", sec.leader, "leader") +
        stockBlock(gainerLabel, sec.topGainer, "gainer");
      if (ctxReady()) {
        var seenUrl = {};
        function takeNews(arr) {
          return (arr || []).filter(function (n) {
            if (!n || !n.url || seenUrl[n.url]) return false;
            seenUrl[n.url] = true;
            return true;
          });
        }
        var lNews = sec.leader ? takeNews(MarketContext.usNews(state.selectedDate, sec.leader.ticker)) : [];
        var gNews = [];
        if (sec.topGainer && (!sec.leader || sec.topGainer.ticker !== sec.leader.ticker)) {
          gNews = takeNews(MarketContext.usNews(state.selectedDate, sec.topGainer.ticker));
        }
        var sNews = takeNews(MarketContext.sectorNews(state.selectedDate, sec.id));
        html += '<div class="sector-news" data-action="noop"><div class="label">当日资讯</div>';
        if (!lNews.length && !gNews.length && !sNews.length) {
          html += renderNewsList([], "当日暂无匹配资讯");
        } else {
          if (sec.leader && lNews.length) {
            html += '<div class="news-group"><div class="news-group-label"><span class="role-chip leader">龙头</span>' +
              esc(sec.leader.ticker) + " " + esc(sec.leader.name) + "</div>" +
              renderNewsList(lNews) + "</div>";
          }
          if (sec.topGainer && gNews.length) {
            html += '<div class="news-group"><div class="news-group-label"><span class="role-chip gainer">涨幅最高</span>' +
              esc(sec.topGainer.ticker) + " " + esc(sec.topGainer.name) + "</div>" +
              renderNewsList(gNews) + "</div>";
          }
          if (sNews.length) {
            html += '<div class="news-group"><div class="news-group-label"><span class="role-chip sector">板块</span>当日消息</div>' +
              renderNewsList(sNews) + "</div>";
          }
        }
        html += "</div>";
      }
      html += "</div>";
    });
    html += "</div>";
    $("board-root").innerHTML = html;
  }

  function renderBriefMapped(rows, title, hint) {
    var root = $("drilldown-root");
    if (!rows.length) {
      root.innerHTML = '<div class="panel-head"><h2>' + esc(title) + "</h2></div>" +
        '<p class="empty">该板块/个股暂无写入简报的映射 A 股。</p>';
      return;
    }
    var body = sortMapped(rows, function (r, key) {
      if (key === "dUsPct") return r.dUsPct;
      if (key === "dReactPct") return r.dReactPct;
      return null;
    }).map(function (r) {
      var a = parseAFromBrief(r.a);
      return "<tr>" +
        td("代码", '<button type="button" class="stock-link" data-action="analyze" data-ticker="' + a.ticker + '">' +
          esc(a.ticker) + "</button>") +
        td("名称", esc(a.name)) +
        td("关系", '<span class="rel">' + esc(r.relation) + "</span>") +
        td("A 美股日", numVal(r.dUsPct) ? '<span class="muted">—</span>' : '<span class="' + pctClass(r.dUsPct) + '">' + fmtPct(r.dUsPct) + "</span>", "col-num") +
        td("A 反应日", numVal(r.dReactPct) ? '<span class="muted">—</span>' : '<span class="' + pctClass(r.dReactPct) + '">' + fmtPct(r.dReactPct) + "</span>", "col-num") +
        td("对应美股", esc(r.us) + " · " + esc(r.role)) +
        td("", '<button type="button" class="btn ghost" data-action="analyze" data-ticker="' + a.ticker + '">分析此股</button>') +
        "</tr>";
    }).join("");
    root.innerHTML = '<div class="panel-head"><h2>' + esc(title) + "</h2>" +
      '<p class="muted">' + esc(hint) + "</p></div>" +
      tableWrap('<table class="table quote-table"><thead><tr><th>代码</th><th>名称</th><th>关系</th>' +
      sortTh({ key: "dUsPct", label: "A 美股日" }) +
      sortTh({ key: "dReactPct", label: "A 反应日" }) +
      '<th>对应美股</th><th></th></tr></thead><tbody>' +
      body + "</tbody></table>");
  }

  function renderDrilldown() {
    var root = $("drilldown-root");
    if (state.drillMode === "brief-sector" && state.selectedBriefSector) {
      var bDay = briefingDay();
      var rows = ((bDay && bDay.mappedA) || []).filter(function (r) {
        return r.sectorCn === state.selectedBriefSector;
      });
      renderBriefMapped(
        rows,
        "板块映射 A 股 · " + state.selectedBriefSector,
        "点上方板块卡片后才列出该板块映射。A 反应日是对隔夜美股的下一 A 股交易日。"
      );
      return;
    }
    if (state.drillMode === "brief-us" && state.selectedUsTicker) {
      var bDayUs = briefingDay();
      var usRows = ((bDayUs && bDayUs.mappedA) || []).filter(function (r) {
        return parseUsFromBrief(r.us) === state.selectedUsTicker;
      });
      renderBriefMapped(
        usRows,
        "个股映射 A 股 · " + state.selectedUsTicker,
        "点美股代码后才列出该股对应 A 股。"
      );
      return;
    }
    if (state.drillMode === "sector" && state.selectedSectorId) {
      var sec = MappingData.sectorById(state.selectedSectorId);
      if (!sec) {
        root.innerHTML = '<p class="empty">未找到该板块映射。</p>';
        return;
      }
      var rows = sortMapped(sec.aShares.map(function (a) {
        return { a: a, q: quoteOf(a.ticker, state.selectedDate) };
      }), function (row, key) {
        return row.q ? row.q[key] : null;
      }).map(function (row) {
        var a = row.a;
        return "<tr>" +
          td("代码", '<button type="button" class="stock-link" data-action="analyze" data-ticker="' + a.ticker + '">' + a.ticker + "</button>") +
          td("名称", esc(a.name)) +
          td("关系", "板块映射") +
          quoteTds(row.q) +
          td("说明", esc(a.note), "col-note") +
          td("", '<button type="button" class="btn ghost" data-action="analyze" data-ticker="' + a.ticker + '">分析此股</button>') +
        "</tr>";
      }).join("");
      var weekNews = "";
      if (ctxReady()) {
        var miss = [];
        weekNews = sec.aShares.map(function (a) {
          var items = MarketContext.aNews(state.selectedDate, a.ticker);
          if (!items.length) {
            miss.push(a.ticker + " " + a.name);
            return "";
          }
          return '<div class="related-news"><h3>' + esc(a.ticker) + " " + esc(a.name) + " · 近一周资讯</h3>" +
            renderNewsList(items) + "</div>";
        }).join("");
        if (miss.length && weekNews) {
          weekNews += '<p class="muted">其余 ' + miss.length + " 只近一周暂无匹配资讯。</p>";
        } else if (!weekNews) {
          weekNews = '<p class="empty">近一周暂无匹配资讯。</p>';
        }
        weekNews = '<div class="mapped-news"><div class="mapped-news-title">关联 A 股 · 近一周资讯</div>' + weekNews + "</div>";
      }
      root.innerHTML = '<div class="panel-head"><h2>板块映射 A 股 · ' + esc(sec.nameCn) + "</h2>" +
        '<p class="muted">行业/概念级候选。前收为该美股日对应的最近 A 股收盘；当日涨幅为下一 A 股交易日；前日/5日/10日为相对前收的涨跌。点击行情字段名排序。</p></div>' +
        tableWrap('<table class="table quote-table"><thead><tr><th>代码</th><th>名称</th><th>关系</th>' + quoteHead() + '<th>说明</th><th></th></tr></thead><tbody>' + rows + "</tbody></table>") +
        (weekNews || '<p class="empty">近一周暂无匹配资讯。</p>');
      return;
    }
    if (state.drillMode === "us" && state.selectedUsTicker) {
      var us = MappingData.usByTicker(state.selectedUsTicker);
      var name = us ? us.name : state.selectedUsTicker;
      var mapped = MappingData.getMappedFromUs(state.selectedUsTicker);
      if (!mapped.length) {
        root.innerHTML = '<div class="panel-head"><h2>个股映射 A 股 · ' + esc(state.selectedUsTicker) + " " + esc(name) + "</h2></div>" +
          '<p class="empty">种子映射中暂无对应 A 股。可在个股分析中手动记录，或后续补充 mapping.js。</p>';
        return;
      }
      var body = sortMapped(mapped.map(function (a) {
        return { a: a, q: quoteOf(a.ticker, state.selectedDate) };
      }), function (row, key) {
        return row.q ? row.q[key] : null;
      }).map(function (row) {
        var a = row.a;
        return "<tr>" +
          td("代码", '<button type="button" class="stock-link" data-action="analyze" data-ticker="' + a.ticker + '">' + a.ticker + "</button>") +
          td("名称", esc(a.name)) +
          td("关系", '<span class="rel">' + esc(a.relation) + "</span>") +
          quoteTds(row.q) +
          td("说明", esc(a.note), "col-note") +
          td("", '<button type="button" class="btn ghost" data-action="analyze" data-ticker="' + a.ticker + '">分析此股</button>') +
        "</tr>";
      }).join("");
      var weekNews = "";
      if (ctxReady()) {
        var usDayNews = MarketContext.usNews(state.selectedDate, state.selectedUsTicker);
        if (usDayNews.length) {
          weekNews += '<div class="related-news"><h3>' + esc(state.selectedUsTicker) + " " + esc(name) + " · 当日资讯</h3>" +
            renderNewsList(usDayNews) + "</div>";
        }
        weekNews += mapped.map(function (a) {
          var items = MarketContext.aNews(state.selectedDate, a.ticker);
          if (!items.length) return "";
          return '<div class="related-news"><h3>' + esc(a.ticker) + " " + esc(a.name) + " · 近一周资讯</h3>" +
            renderNewsList(items) + "</div>";
        }).join("");
        if (!weekNews) weekNews = '<p class="empty">近一周暂无匹配资讯。</p>';
        weekNews = '<div class="mapped-news"><div class="mapped-news-title">对应股票资讯</div>' + weekNews + "</div>";
      }
      root.innerHTML = '<div class="panel-head"><h2>个股映射 A 股 · ' + esc(state.selectedUsTicker) + " " + esc(name) + "</h2>" +
        '<p class="muted">按业务关系列出。前收为对应最近 A 股收盘；当日涨幅为下一 A 股交易日。点击行情字段名排序。</p></div>' +
        tableWrap('<table class="table quote-table"><thead><tr><th>代码</th><th>名称</th><th>关系</th>' + quoteHead() + '<th>说明</th><th></th></tr></thead><tbody>' + body + "</tbody></table>") +
        (weekNews || '<p class="empty">近一周暂无匹配资讯。</p>');
      return;
    }
    root.innerHTML = '<div class="panel-head"><h2>映射明细</h2><p class="muted">点击上方板块查看该板块 A 股；点击美股代码查看业务对应 A 股。</p></div>' +
      '<p class="empty">尚未选择板块或美股个股。</p>';
  }

  function fillAnalysisForm(ticker) {
    var t = MappingData.normalize(ticker);
    state.focusTicker = t;
    $("ticker-input").value = t;
    var sample = SampleAnalysis[t] || null;
    $("fund-text").value = sample ? sample.fundamental : "";
    $("tech-text").value = sample ? sample.technical : "";
    $("no-data-hint").hidden = !!sample;
    renderAnalysisChips();
  }

  function renderAnalysisChips() {
    var t = state.focusTicker;
    var box = $("analysis-chips");
    if (!t) {
      box.innerHTML = "";
      $("save-hint").textContent = "将保存到 " + state.selectedDate;
      return;
    }
    var rel = MappingData.getRelated(t);
    var chips = [];
    function chip(item, active) {
      return '<button type="button" class="chip' + (active ? " active" : "") + '" data-action="analyze" data-ticker="' + esc(item.ticker) + '">' +
        esc(item.ticker) + " " + esc(item.name) + (item.relation ? " · " + esc(item.relation) : "") + "</button>";
    }
    chips.push(chip(rel.primary, rel.primary.ticker === t));
    rel.mapped.forEach(function (m) {
      chips.push(chip(m, m.ticker === t));
    });
    box.innerHTML = chips.join("");
    $("save-hint").textContent = "将保存到 " + state.selectedDate + " · " + (rel.mapped.length ? "含 " + rel.mapped.length + " 只映射股" : "无种子映射");
  }

  function renderShots() {
    $("shot-previews").innerHTML = state.draftShots.map(function (s, idx) {
      return '<div class="shot-card"><img src="' + s.dataUrl + '" alt="" />' +
        '<div class="cap"><span>' + esc(s.name) + '</span>' +
        '<button type="button" class="btn ghost" data-action="remove-shot" data-idx="' + idx + '">删除</button></div></div>';
    }).join("");
  }

  function noteMatchesTickers(note, tickers) {
    var set = {};
    tickers.forEach(function (t) { set[t] = true; });
    if (set[note.primaryTicker]) return true;
    var mapped = note.mappedTickers || [];
    for (var i = 0; i < mapped.length; i++) {
      if (set[mapped[i]]) return true;
    }
    return false;
  }

  function renderNoteCard(note, withJump) {
    var mapped = note.mappedTickers || [];
    var mappedHtml;
    if (!mapped.length) {
      mappedHtml = '<p class="muted">映射股：无</p>';
    } else {
      var relatedMap = {};
      MappingData.getRelated(note.primaryTicker).mapped.forEach(function (m) {
        relatedMap[m.ticker] = m;
      });
      mappedHtml = '<div class="mapped-list"><div class="mapped-label">映射股</div><ul>' +
        mapped.map(function (t) {
          var name = MappingData.getStockName(t);
          var rel = relatedMap[t];
          var relText = rel && rel.relation ? " · " + esc(rel.relation) : "";
          return '<li><span class="mono">' + esc(t) + "</span> " + esc(name) + relText + "</li>";
        }).join("") + "</ul></div>";
    }

    var shots = note.screenshots || [];
    var shotsHtml;
    if (!shots.length) {
      shotsHtml = '<p class="muted">无走势截图</p>';
    } else {
      shotsHtml = '<div class="note-shots">' + shots.map(function (s, idx) {
        var cap = s.name || "走势截图";
        return '<figure class="shot-card note-shot" data-action="view-shot" data-note-id="' + esc(note.id) + '" data-idx="' + idx + '">' +
          '<img src="' + s.dataUrl + '" alt="' + esc(cap) + '" />' +
          "<figcaption>" + esc(cap) + "</figcaption></figure>";
      }).join("") + "</div>";
    }

    var jump = withJump
      ? '<button type="button" class="btn ghost" data-action="pick-date" data-date="' + note.usDate + '">查看当日</button>'
      : "";
    return '<article class="note-card">' +
      "<h3>" + esc(note.primaryTicker) + " " + esc(MappingData.getStockName(note.primaryTicker)) +
      " · " + esc(note.usDate) + "</h3>" +
      mappedHtml +
      (note.fundamental ? "<p><strong>基本面</strong> " + esc(note.fundamental) + "</p>" : "") +
      (note.technical ? "<p><strong>技术面</strong> " + esc(note.technical) + "</p>" : "") +
      shotsHtml +
      '<div class="chip-row">' + jump +
        '<button type="button" class="btn ghost danger" data-action="delete-note" data-id="' + esc(note.id) + '">删除</button>' +
      "</div></article>";
  }

  function renderDayNotes() {
    var list = notesForDate(state.selectedDate);
    if (!list.length) {
      $("day-notes-root").innerHTML = '<p class="empty">这一天还没有保存分析。</p>';
      return;
    }
    $("day-notes-root").innerHTML = '<div class="note-list">' + list.map(function (n) { return renderNoteCard(n, false); }).join("") + "</div>";
  }

  function renderSearchChips() {
    $("search-chips").innerHTML = state.searchSelected.map(function (t) {
      return '<span class="chip">' + esc(t) + " " + esc(MappingData.getStockName(t)) +
        '<button type="button" class="x" data-action="remove-search" data-ticker="' + esc(t) + '">×</button></span>';
    }).join("");
  }

  function renderSearchDropdown() {
    var box = $("search-dropdown");
    if (!state.searchOpen || !state.searchQuery) {
      box.hidden = true;
      box.innerHTML = "";
      return;
    }
    var hits = MappingData.searchStocks(state.searchQuery);
    if (!hits.length) {
      box.hidden = false;
      box.innerHTML = '<button type="button" disabled>无匹配种子股票</button>';
      return;
    }
    box.hidden = false;
    box.innerHTML = hits.map(function (s) {
      return '<button type="button" data-action="add-search" data-ticker="' + s.ticker + '">' +
        esc(s.ticker) + " " + esc(s.name) + " · " + (s.market === "A" ? "A股" : "美股") + "</button>";
    }).join("");
  }

  function renderSearchResults() {
    var root = $("search-results-root");
    if (!state.searchSelected.length) {
      root.innerHTML = '<p class="empty">尚未选择股票。在上方输入代码或名称并点选，可同时查看多只股票的全部已存分析。</p>';
      return;
    }
    var hits = state.notes.filter(function (n) { return noteMatchesTickers(n, state.searchSelected); });
    if (!hits.length) {
      root.innerHTML = '<p class="empty">所选股票尚无已保存分析。可先在下方分析后点「保存到日历」。</p>';
      return;
    }
    root.innerHTML = '<div class="note-list">' + hits.map(function (n) { return renderNoteCard(n, true); }).join("") + "</div>";
  }

  function openShot(noteId, idx) {
    var note = null;
    for (var i = 0; i < state.notes.length; i++) {
      if (state.notes[i].id === noteId) {
        note = state.notes[i];
        break;
      }
    }
    if (!note || !note.screenshots || !note.screenshots[idx]) return;
    var shot = note.screenshots[idx];
    $("modal-root").innerHTML =
      '<div class="modal-backdrop" data-action="close-modal"><div class="lightbox" data-action="noop">' +
        '<img src="' + shot.dataUrl + '" alt="' + esc(shot.name || "走势截图") + '" />' +
        "<p>" + esc(shot.name || "走势截图") + " · " + esc(note.primaryTicker) + " " +
        esc(MappingData.getStockName(note.primaryTicker)) + "</p>" +
        '<button type="button" class="btn primary" data-action="close-modal">关闭</button>' +
      "</div></div>";
  }

  function closeOverlay() {
    var root = $("modal-root");
    if (root) root.innerHTML = "";
    document.documentElement.classList.remove("brief-doc-open");
  }

  function emphasizeFirstSentence(text) {
    var s = String(text || "");
    var i = s.indexOf("。");
    if (i === -1) return esc(s);
    return "<strong>" + esc(s.slice(0, i + 1)) + "</strong>" + esc(s.slice(i + 1));
  }

  function pctSpan(v) {
    if (numVal(v)) return '<span class="muted">—</span>';
    return '<span class="' + pctClass(v) + '">' + fmtPct(v) + "</span>";
  }

  function briefDocSection(id, title, inner) {
    if (!inner) return "";
    return '<section id="' + id + '"><h2>' + esc(title) + "</h2>" + inner + "</section>";
  }

  function renderBriefDoc(open) {
    var root = $("modal-root");
    if (!root) return;
    if (!open) {
      closeOverlay();
      return;
    }
    var day = briefingDay();
    if (!day) {
      closeOverlay();
      showToast("这一天还没有隔夜简报");
      return;
    }
    document.documentElement.classList.add("brief-doc-open");
    var toc = [
      ["brief-sec-concl", "结论"],
      ["brief-sec-sectors", "板块"],
      ["brief-sec-top3", "前三拆解"],
      ["brief-sec-mapped", "映射 A 股"],
      ["brief-sec-logic", "逻辑链"],
      ["brief-sec-caveats", "破绽"],
      ["brief-sec-watch", "关注点"]
    ];
    var tocHtml = '<nav class="brief-toc">';
    toc.forEach(function (item) {
      tocHtml += '<button type="button" data-action="brief-jump" data-id="' + item[0] + '">' +
        esc(item[1]) + "</button>";
    });
    tocHtml += "</nav>";

    var statsHtml = "";
    if (day.stats && day.stats.length) {
      statsHtml = '<div class="brief-stats">';
      day.stats.forEach(function (stat) {
        var tone = stat.tone === "down" ? "down" : (stat.tone === "up" ? "up" : "");
        statsHtml += '<div class="brief-stat"><span class="v ' + tone + '">' + esc(stat.value) +
          '</span><span class="k">' + esc(stat.label) + "</span></div>";
      });
      statsHtml += "</div>";
    }

    var conclInner = '<p class="lead">' + esc(day.summary || day.headline || "") + "</p>" + statsHtml;

    var sectorInner = "";
    if (day.sectors && day.sectors.length) {
      var sBody = day.sectors.map(function (sec) {
        return "<tr>" +
          td("板块", esc(sec.nameCn)) +
          td("等权涨跌", pctSpan(sec.changePct), "col-num") +
          td("龙头", esc(sec.leader)) +
          td("涨幅最高", esc(sec.topGainer)) +
          td("备注", esc(sec.note || ""), "col-note") +
          "</tr>";
      }).join("");
      sectorInner = tableWrap(
        '<table class="table"><thead><tr><th>板块</th><th class="col-num">等权涨跌</th><th>龙头</th><th>涨幅最高</th><th>备注</th></tr></thead><tbody>' +
        sBody + "</tbody></table>"
      );
    }

    var top3Inner = "";
    (day.top3 || []).forEach(function (sec) {
      top3Inner += '<div class="top3-block"><h3><span>' + esc(sec.nameCn) + '</span>' +
        '<span class="' + pctClass(sec.changePct) + '">' + fmtPct(sec.changePct) + "</span></h3>";
      if (sec.take) top3Inner += "<p>" + esc(sec.take) + "</p>";
      if (sec.bullets && sec.bullets.length) {
        top3Inner += "<ul>";
        sec.bullets.forEach(function (b) {
          top3Inner += "<li>" + esc(b) + "</li>";
        });
        top3Inner += "</ul>";
      }
      top3Inner += "</div>";
    });

    var mappedInner = "";
    if (day.mappedA && day.mappedA.length) {
      mappedInner = '<p class="muted">关系类型是种子映射，不是产业结论。A 美股日是隔夜前已走完的 A 股收盘；A 反应日是对隔夜美股的下一 A 股交易日。</p>';
      var mBody = day.mappedA.map(function (r) {
        var a = parseAFromBrief(r.a);
        return "<tr>" +
          td("板块", esc(r.sectorCn)) +
          td("美股", esc(r.us)) +
          td("角色", esc(r.role)) +
          td("A 股", '<button type="button" class="stock-link" data-action="analyze-from-doc" data-ticker="' +
            esc(a.ticker) + '">' + esc(a.name) + " " + esc(a.ticker) + "</button>") +
          td("关系", '<span class="rel">' + esc(r.relation) + "</span>") +
          td("A 美股日", pctSpan(r.dUsPct), "col-num") +
          td("A 反应日", pctSpan(r.dReactPct), "col-num") +
          "</tr>";
      }).join("");
      mappedInner += tableWrap(
        '<table class="table"><thead><tr><th>板块</th><th>美股</th><th>角色</th><th>A 股</th><th>关系</th>' +
        '<th class="col-num">A 美股日</th><th class="col-num">A 反应日</th></tr></thead><tbody>' +
        mBody + "</tbody></table>"
      );
    }

    var logicInner = "";
    if (day.logic && day.logic.length) {
      logicInner = '<ol class="logic">';
      day.logic.forEach(function (item) {
        logicInner += "<li>" + emphasizeFirstSentence(item) + "</li>";
      });
      logicInner += "</ol>";
    }

    var caveatsInner = "";
    if (day.caveats && day.caveats.length) {
      var cBody = day.caveats.map(function (c) {
        return "<tr>" + td("破绽", "<strong>" + esc(c.title) + "</strong>") +
          td("为什么要紧", esc(c.detail)) + "</tr>";
      }).join("");
      caveatsInner = tableWrap(
        '<table class="table"><thead><tr><th>破绽</th><th>为什么要紧</th></tr></thead><tbody>' +
        cBody + "</tbody></table>"
      );
    }

    var watchInner = "";
    if (day.watch && day.watch.length) {
      var wBody = day.watch.map(function (w) {
        return "<tr>" + td("观察点", "<strong>" + esc(w.point) + "</strong>") +
          td("确认 / 证伪", esc(w.check)) + "</tr>";
      }).join("");
      watchInner = tableWrap(
        '<table class="table"><thead><tr><th>观察点</th><th>确认 / 证伪</th></tr></thead><tbody>' +
        wBody + "</tbody></table>"
      );
    }

    var miss = (day.tickersMiss && day.tickersMiss.length) ? day.tickersMiss.join("、") : "";
    var seedN = (typeof MappingData !== "undefined" && MappingData.US_STOCKS)
      ? MappingData.US_STOCKS.length : 0;
    var endHtml = '<p class="brief-doc-end">' +
      esc(String(day.tickersOk || 0)) + "/" + seedN + " 只种子美股有日K" +
      (miss ? "。缺失：" + esc(miss) + "。" : "。") +
      "映射与涨跌幅只用于研究台账，不构成投资建议。";
    if (day.mdPath) {
      endHtml += ' 源文件：<a href="' + esc(day.mdPath) + '" data-action="go">Markdown</a>';
    }
    endHtml += "</p>";

    root.innerHTML =
      '<div class="brief-doc-shell" role="dialog" aria-modal="true" aria-labelledby="brief-doc-title">' +
        '<div class="brief-doc-bar">' +
          "<strong>美股 " + esc(day.usDate) + " 收盘简报</strong>" +
          '<button type="button" class="btn ghost" data-action="close-modal">关闭</button>' +
        "</div>" +
        '<div class="brief-doc-scroll">' +
          '<article class="brief-doc">' +
            '<p class="kicker">隔夜简报</p>' +
            '<h1 id="brief-doc-title">' + esc(day.headline) + "</h1>" +
            '<p class="brief-doc-meta">美股交易日 ' + esc(day.usDate) +
              " · 生成 " + esc(day.generatedAt) +
              " · 保存 " + esc(day.savedAt) +
              (day.source ? " · " + esc(day.source) : "") + "</p>" +
            (day.disclaimer ? '<p class="disclaimer">' + esc(day.disclaimer) + "</p>" : "") +
            tocHtml +
            briefDocSection("brief-sec-concl", "结论", conclInner) +
            briefDocSection("brief-sec-sectors", "板块等权涨跌幅", sectorInner) +
            briefDocSection("brief-sec-top3", "前三板块拆解", top3Inner) +
            briefDocSection("brief-sec-mapped", "映射 A 股", mappedInner) +
            briefDocSection("brief-sec-logic", "逻辑链", logicInner) +
            briefDocSection("brief-sec-caveats", "逻辑破绽", caveatsInner) +
            briefDocSection("brief-sec-watch", "后续关注", watchInner) +
            endHtml +
          "</article>" +
        "</div>" +
      "</div>";
    var closeBtn = root.querySelector("[data-action='close-modal']");
    if (closeBtn) closeBtn.focus();
  }

  function renderModal(open) {
    var root = $("modal-root");
    if (!open) {
      closeOverlay();
      return;
    }
    document.documentElement.classList.remove("brief-doc-open");
    root.innerHTML =
      '<div class="modal-backdrop" data-action="close-modal"><div class="modal" data-action="noop">' +
        "<h2>映射说明</h2>" +
        "<p>本页种子映射用于演示「美股热度 → A 股候选」流程，不是完备的研究结论，也不是投资建议。</p>" +
        "<h3>两层结构</h3>" +
        "<ul><li>板块 → A 股：点击日榜板块，列出行业/概念候选。</li>" +
        "<li>美股个股 → A 股：点击龙头或涨幅最高代码，按业务关系列出。</li></ul>" +
        "<h3>关系类型</h3>" +
        "<ul><li>对标：商业模式或产品地位相近。</li>" +
        "<li>供应链：上下游配套。</li>" +
        "<li>同概念：同一产业主题，但并非直接竞争对手。</li>" +
        "<li>ADR：同一公司的不同上市地。</li></ul>" +
        "<h3>行情数据</h3>" +
        "<p>日榜由 tools/fetch_board.py 抓取美股日K。关联 A 股行情与资讯由 tools/fetch_context.py 抓取后写入 js/data/market-context.js。隔夜简报写入 briefings/YYYY-MM-DD.md 与 js/data/briefings.js，页面按日历日期读取。当日 index.html 另存到 archive/ 下带时间戳的目录。页面不在浏览器里实时拉数。资讯按标题/摘要匹配龙头、涨幅最高与映射股名称，越近的交易日覆盖越好。</p>" +
        '<button type="button" class="btn primary" data-action="close-modal">关闭</button>' +
      "</div></div>";
  }

  function render() {
    renderTopbar();
    renderDateBar();
    renderCalendar();
    renderBriefing();
    renderBoard();
    renderDrilldown();
    renderAnalysisChips();
    renderShots();
    renderDayNotes();
    renderSearchChips();
    renderSearchDropdown();
    renderSearchResults();
    syncCalDrawer();
  }

  function pickDate(dateStr) {
    state.selectedDate = dateStr;
    var p = dateStr.split("-");
    state.viewYear = Number(p[0]);
    state.viewMonth = Number(p[1]) - 1;
    state.selectedSectorId = null;
    state.selectedUsTicker = null;
    state.selectedBriefSector = null;
    state.drillMode = null;
    state.calDrawerOpen = false;
    render();
    if (isNarrow()) {
      var lead = $("briefing-root");
      var board = $("board-root");
      var el = lead && !lead.hidden ? lead : board;
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function loadNotes() {
    return AppStore.getAll().then(function (rows) {
      state.notes = rows;
    }).catch(function (err) {
      console.error(err);
      showToast("本地数据库不可用，分析将无法保存");
    });
  }

  function compressImage(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onerror = function () { reject(new Error("读取图片失败")); };
      reader.onload = function () {
        var img = new Image();
        img.onerror = function () { reject(new Error("图片无法解析")); };
        img.onload = function () {
          var maxDim = 1600;
          var scale = Math.min(1, maxDim / Math.max(img.width, img.height));
          var canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          var q = 0.72;
          var dataUrl = canvas.toDataURL("image/jpeg", q);
          while (dataUrl.length > MAX_SHOT_BYTES * 1.37 && q > 0.4) {
            q -= 0.08;
            dataUrl = canvas.toDataURL("image/jpeg", q);
          }
          if (dataUrl.length > MAX_SHOT_BYTES * 1.37) {
            reject(new Error("截图过大，请换更小的图片（建议 2MB 内）"));
            return;
          }
          resolve({ name: file.name || "screenshot.jpg", dataUrl: dataUrl, type: "image/jpeg" });
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function saveNote() {
    var ticker = MappingData.normalize($("ticker-input").value || state.focusTicker);
    if (!ticker) {
      showToast("请先输入股票代码并点分析");
      return;
    }
    var fund = $("fund-text").value.trim();
    var tech = $("tech-text").value.trim();
    if (!fund && !tech && !state.draftShots.length) {
      showToast("请至少填写一段分析或上传一张截图");
      return;
    }
    var rel = MappingData.getRelated(ticker);
    var note = {
      id: AppStore.uid(),
      usDate: state.selectedDate,
      primaryTicker: ticker,
      mappedTickers: rel.mapped.map(function (m) { return m.ticker; }),
      fundamental: fund,
      technical: tech,
      screenshots: state.draftShots.slice(),
      createdAt: new Date().toISOString()
    };
    AppStore.save(note).then(function () {
      state.draftShots = [];
      return loadNotes();
    }).then(function () {
      render();
      showToast("已保存到 " + note.usDate);
    }).catch(function (err) {
      console.error(err);
      showToast("保存失败");
    });
  }

  function bind() {
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-action]");
      if (!t) {
        if (!$("search-box").contains(e.target)) {
          state.searchOpen = false;
          renderSearchDropdown();
        }
        return;
      }
      var action = t.getAttribute("data-action");
      if (action === "noop") {
        e.stopPropagation();
        return;
      }
      if (action === "reload-app") {
        reloadApp();
        return;
      }
      if (action === "toggle-cal") {
        state.calDrawerOpen = !state.calDrawerOpen;
        renderDateBar();
        syncCalDrawer();
        return;
      }
      if (action === "close-cal") {
        state.calDrawerOpen = false;
        renderDateBar();
        syncCalDrawer();
        return;
      }
      if (action === "toggle-fold") {
        var foldId = t.getAttribute("data-fold");
        var panel = $(foldId);
        if (!panel) return;
        panel.classList.toggle("is-open");
        var foldBtn = panel.querySelector(".fold-toggle");
        if (foldBtn) foldBtn.textContent = panel.classList.contains("is-open") ? "收起" : "展开";
        return;
      }
      if (action === "prev-month") {
        if (state.viewMonth === 0) { state.viewYear -= 1; state.viewMonth = 11; }
        else state.viewMonth -= 1;
        render();
        return;
      }
      if (action === "next-month") {
        if (state.viewMonth === 11) { state.viewYear += 1; state.viewMonth = 0; }
        else state.viewMonth += 1;
        render();
        return;
      }
      if (action === "goto-latest") {
        pickDate(latestDataDate() || state.selectedDate);
        return;
      }
      if (action === "goto-today") {
        var now = new Date();
        pickDate(ymd(now.getFullYear(), now.getMonth(), now.getDate()));
        return;
      }
      if (action === "pick-date") {
        pickDate(t.getAttribute("data-date"));
        return;
      }
      if (action === "go") {
        e.preventDefault();
        var dest = t.href || t.getAttribute("href");
        if (dest) window.location.assign(dest);
        return;
      }
      if (action === "sort-quote") {
        var sortKey = t.getAttribute("data-key");
        if (state.mapSort.key === sortKey) {
          state.mapSort.dir = state.mapSort.dir === "desc" ? "asc" : "desc";
        } else {
          state.mapSort.key = sortKey;
          state.mapSort.dir = "desc";
        }
        renderDrilldown();
        return;
      }
      if (action === "pick-sector") {
        state.selectedSectorId = t.getAttribute("data-id");
        state.selectedUsTicker = null;
        state.selectedBriefSector = null;
        state.drillMode = "sector";
        render();
        if (isNarrow()) scrollToResults();
        return;
      }
      if (action === "pick-brief-sector") {
        state.selectedBriefSector = t.getAttribute("data-name");
        state.selectedSectorId = null;
        state.selectedUsTicker = null;
        state.drillMode = "brief-sector";
        render();
        $("drilldown-root").scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
      }
      if (action === "pick-brief-us") {
        e.stopPropagation();
        state.selectedUsTicker = MappingData.normalize(t.getAttribute("data-ticker"));
        state.selectedBriefSector = t.getAttribute("data-name");
        state.selectedSectorId = null;
        state.drillMode = "brief-us";
        render();
        $("drilldown-root").scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
      }
      if (action === "pick-us") {
        e.stopPropagation();
        state.selectedUsTicker = MappingData.normalize(t.getAttribute("data-ticker"));
        state.drillMode = "us";
        state.selectedBriefSector = null;
        var us = MappingData.usByTicker(state.selectedUsTicker);
        if (us) state.selectedSectorId = us.sectorId;
        render();
        if (isNarrow()) scrollToResults();
        return;
      }
      if (action === "analyze") {
        e.stopPropagation();
        fillAnalysisForm(t.getAttribute("data-ticker"));
        openAnalysisPanel();
        $("ticker-input").scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      if (action === "remove-shot") {
        state.draftShots.splice(Number(t.getAttribute("data-idx")), 1);
        renderShots();
        return;
      }
      if (action === "add-search") {
        var add = MappingData.normalize(t.getAttribute("data-ticker"));
        if (state.searchSelected.indexOf(add) === -1) state.searchSelected.push(add);
        state.searchQuery = "";
        $("search-input").value = "";
        state.searchOpen = false;
        renderSearchChips();
        renderSearchDropdown();
        renderSearchResults();
        return;
      }
      if (action === "remove-search") {
        var rm = t.getAttribute("data-ticker");
        state.searchSelected = state.searchSelected.filter(function (x) { return x !== rm; });
        renderSearchChips();
        renderSearchResults();
        return;
      }
      if (action === "view-shot") {
        e.stopPropagation();
        openShot(t.getAttribute("data-note-id"), Number(t.getAttribute("data-idx")));
        return;
      }
      if (action === "delete-note") {
        AppStore.remove(t.getAttribute("data-id")).then(loadNotes).then(function () {
          render();
          showToast("已删除");
        });
        return;
      }
      if (action === "open-brief-doc") {
        renderBriefDoc(true);
        return;
      }
      if (action === "brief-jump") {
        e.preventDefault();
        var jump = document.getElementById(t.getAttribute("data-id"));
        if (jump) jump.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (action === "analyze-from-doc") {
        e.stopPropagation();
        var fromDoc = MappingData.normalize(t.getAttribute("data-ticker"));
        closeOverlay();
        fillAnalysisForm(fromDoc);
        openAnalysisPanel();
        $("ticker-input").scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      if (action === "close-modal") {
        closeOverlay();
        return;
      }
    });

    $("analysis-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var t = MappingData.normalize($("ticker-input").value);
      if (!t) {
        showToast("请输入股票代码");
        return;
      }
      fillAnalysisForm(t);
      openAnalysisPanel();
      if (!MappingData.isKnown(t) && !SampleAnalysis[t]) {
        $("no-data-hint").hidden = false;
      }
    });

    $("save-btn").addEventListener("click", saveNote);

    $("shot-input").addEventListener("change", function (e) {
      var files = Array.prototype.slice.call(e.target.files || []);
      e.target.value = "";
      files.forEach(function (file) {
        compressImage(file).then(function (shot) {
          state.draftShots.push(shot);
          renderShots();
        }).catch(function (err) {
          showToast(err.message || "截图处理失败");
        });
      });
    });

    $("search-input").addEventListener("input", function (e) {
      state.searchQuery = e.target.value;
      state.searchOpen = true;
      renderSearchDropdown();
    });

    $("search-input").addEventListener("focus", function () {
      if (state.searchQuery) {
        state.searchOpen = true;
        renderSearchDropdown();
      }
    });

    $("btn-mapping-help").addEventListener("click", function () {
      renderModal(true);
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && $("modal-root") && $("modal-root").innerHTML) {
        closeOverlay();
      }
    });

    window.addEventListener("resize", function () {
      if (!isNarrow() && state.calDrawerOpen) state.calDrawerOpen = false;
      renderDateBar();
      syncCalDrawer();
    });
  }

  ensureMobileChrome();
  bind();
  $("save-hint").textContent = "将保存到 " + state.selectedDate;
  renderDateBar();
  loadNotes().then(render);

  var pageLoadedAt = Date.now();
  var swRefreshing = false;

  function registerServiceWorker() {
    if (location.protocol !== "http:" && location.protocol !== "https:") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register(new URL("sw.js", document.baseURI)).then(function (reg) {
      reg.update();
    }).catch(function () {});
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (swRefreshing) return;
      swRefreshing = true;
      location.reload();
    });
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState !== "visible") return;
      navigator.serviceWorker.getRegistration().then(function (reg) {
        if (reg) reg.update();
      }).catch(function () {});
      if (Date.now() - pageLoadedAt < 2 * 60 * 60 * 1000) return;
      if (hasUnsavedWork()) return;
      location.reload();
    });
  }

  registerServiceWorker();
})();
