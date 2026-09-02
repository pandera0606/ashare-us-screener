(function () {
  if (typeof MappingData === "undefined") {
    document.body.innerHTML = "<p style='padding:24px'>无法加载映射数据。请确认 js/data/mapping-seed.js 与 js/data/mapping.js 在同一仓库里。</p>";
    return;
  }

  var RELATIONS = MappingData.RELATIONS || ["对标", "供应链", "同概念", "ADR"];
  var KINDS = MappingData.KINDS || ["gics", "extra"];
  var draft = MappingData.snapshot();
  if (!draft.concepts) draft.concepts = [];
  var selectedKind = draft.sectors.length ? "sector" : (draft.concepts.length ? "concept" : "sector");
  var selectedId = selectedKind === "sector"
    ? (draft.sectors[0] ? draft.sectors[0].id : null)
    : (draft.concepts[0] ? draft.concepts[0].id : null);
  var dirty = false;
  var toastTimer = null;

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

  function cloneJson(x) {
    return JSON.parse(JSON.stringify(x));
  }

  function toast(msg) {
    var el = $("toast-root");
    if (!el) return;
    el.hidden = false;
    el.textContent = msg;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 2800);
  }

  function markDirty() {
    dirty = true;
    syncStatus();
  }

  function groupList(kind) {
    return kind === "concept" ? draft.concepts : draft.sectors;
  }

  function findGroup(kind, id) {
    var list = groupList(kind);
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function currentGroup() {
    return findGroup(selectedKind, selectedId);
  }

  function usInSector(sectorId) {
    return draft.usStocks.filter(function (us) { return us.sectorId === sectorId; });
  }

  function usInConcept(conceptId) {
    return draft.usStocks.filter(function (us) {
      return (us.conceptIds || []).indexOf(conceptId) >= 0;
    });
  }

  function syncStatus() {
    var el = $("map-status");
    var bits = [];
    bits.push(draft.sectors.length + " 个板块");
    bits.push(draft.concepts.length + " 个概念");
    bits.push(draft.usStocks.length + " 只美股");
    if (MappingData.hasOverride()) bits.push("本机有覆盖");
    if (dirty) bits.push("未保存");
    if (el) el.textContent = bits.join(" · ") + " · 不构成投资建议";
    var sum = $("map-summary");
    if (sum) sum.textContent = dirty ? "有未保存更改" : "与当前草稿一致";
  }

  function nextId(prefix, list) {
    var n = 1;
    var used = {};
    list.forEach(function (s) { used[s.id] = true; });
    while (used[prefix + n]) n += 1;
    return prefix + n;
  }

  function emptyA(withRel) {
    var row = { ticker: "", name: "", note: "" };
    if (withRel) row.relation = "同概念";
    return row;
  }

  function renderGroupButtons(list, kind, rootId) {
    var root = $(rootId);
    if (!root) return;
    if (!list.length) {
      root.innerHTML = '<p class="empty">还没有' + (kind === "concept" ? "概念" : "板块") + "。</p>";
      return;
    }
    root.innerHTML = list.map(function (sec) {
      var n = kind === "concept" ? usInConcept(sec.id).length : usInSector(sec.id).length;
      var active = selectedKind === kind && sec.id === selectedId ? " active" : "";
      var extra = "";
      if (kind === "sector" && sec.kind === "extra") extra = " · 增补";
      return '<button type="button" class="map-sec-btn' + active + '" data-action="pick-' + kind + '" data-id="' +
        esc(sec.id) + '"><strong>' + esc(sec.nameCn || sec.id) + "</strong>" +
        '<span class="muted">' + esc(sec.id) + extra + " · " + n + " 只美股</span></button>";
    }).join("");
  }

  function renderList() {
    renderGroupButtons(draft.sectors, "sector", "map-sector-list");
    renderGroupButtons(draft.concepts, "concept", "map-concept-list");
  }

  function relationSelect(value) {
    return RELATIONS.map(function (rel) {
      return '<option value="' + esc(rel) + '"' + (rel === value ? " selected" : "") + ">" + esc(rel) + "</option>";
    }).join("");
  }

  function aRows(rows, kind, usTicker) {
    if (!rows.length) {
      return '<p class="empty">暂无映射 A 股</p>';
    }
    var head = kind === "us"
      ? "<th>代码</th><th>名称</th><th>关系</th><th>备注</th><th></th>"
      : "<th>代码</th><th>名称</th><th>备注</th><th></th>";
    var body = rows.map(function (a, i) {
      var extra = kind === "us"
        ? ' data-ticker="' + esc(usTicker) + '"'
        : "";
      var rel = kind === "us"
        ? '<td data-label="关系"><select data-edit="' + kind + '-a" data-index="' + i + '" data-key="relation"' + extra + ">" +
          relationSelect(a.relation || "同概念") + "</select></td>"
        : "";
      return "<tr>" +
        '<td data-label="代码"><input data-edit="' + kind + '-a" data-index="' + i + '" data-key="ticker"' + extra +
          ' value="' + esc(a.ticker) + '" placeholder="002594" /></td>' +
        '<td data-label="名称"><input data-edit="' + kind + '-a" data-index="' + i + '" data-key="name"' + extra +
          ' value="' + esc(a.name) + '" placeholder="名称" /></td>' +
        rel +
        '<td data-label="备注"><input data-edit="' + kind + '-a" data-index="' + i + '" data-key="note"' + extra +
          ' value="' + esc(a.note) + '" placeholder="说明" /></td>' +
        '<td data-label=""><button type="button" class="btn ghost danger" data-action="del-' + kind + '-a" data-index="' + i + '"' +
          extra + ">删除</button></td>" +
        "</tr>";
    }).join("");
    return '<div class="table-wrap"><table class="table map-table"><thead><tr>' + head + "</tr></thead><tbody>" +
      body + "</tbody></table></div>";
  }

  function sectorSelect(value) {
    return draft.sectors.map(function (sec) {
      return '<option value="' + esc(sec.id) + '"' + (sec.id === value ? " selected" : "") + ">" +
        esc(sec.nameCn + " · " + sec.id) + "</option>";
    }).join("");
  }

  function conceptChecks(us) {
    var ids = us.conceptIds || [];
    if (!draft.concepts.length) return '<p class="muted">还没有概念标签。</p>';
    return '<div class="map-concept-checks">' + draft.concepts.map(function (c) {
      var on = ids.indexOf(c.id) >= 0;
      return '<label class="map-check"><input type="checkbox" data-edit="us-concept" data-ticker="' +
        esc(us.ticker) + '" data-id="' + esc(c.id) + '"' + (on ? " checked" : "") + " /> " +
        esc(c.nameCn) + "</label>";
    }).join("") + "</div>";
  }

  function renderUsCard(us, showSector) {
    var html = '<div class="map-us">' +
      '<div class="map-fields">' +
        '<label>代码<input data-edit="us" data-ticker="' + esc(us.ticker) + '" data-key="ticker" value="' + esc(us.ticker) + '" /></label>' +
        '<label>名称<input data-edit="us" data-ticker="' + esc(us.ticker) + '" data-key="name" value="' + esc(us.name) + '" /></label>';
    if (showSector) {
      html += '<label>所属板块<select data-edit="us" data-ticker="' + esc(us.ticker) + '" data-key="sectorId">' +
        sectorSelect(us.sectorId) + "</select></label>";
    }
    html += "</div>";
    html += '<div class="map-block-head"><span class="muted">概念标签</span></div>' + conceptChecks(us);
    html += '<div class="map-block-head"><span class="muted">对应 A 股</span>' +
      '<div class="map-inline">' +
        '<button type="button" class="btn ghost" data-action="add-us-a" data-ticker="' + esc(us.ticker) + '">添加 A 股</button>' +
        '<button type="button" class="btn ghost danger" data-action="del-us" data-ticker="' + esc(us.ticker) + '">删除美股</button>' +
      "</div></div>" +
      aRows(us.aShares || [], "us", us.ticker) +
      "</div>";
    return html;
  }

  function renderDetail() {
    var root = $("map-detail");
    if (!root) return;
    var sec = currentGroup();
    if (!sec) {
      root.innerHTML = '<p class="empty">选择左侧板块或概念，或新增一个。</p>';
      return;
    }
    var isConcept = selectedKind === "concept";
    var members = isConcept ? usInConcept(sec.id) : usInSector(sec.id);
    var leaderOpts = members.map(function (us) {
      return '<option value="' + esc(us.ticker) + '"' + (us.ticker === sec.leaderTicker ? " selected" : "") + ">" +
        esc(us.ticker + " " + us.name) + "</option>";
    }).join("");
    if (sec.leaderTicker && !members.some(function (us) { return us.ticker === sec.leaderTicker; })) {
      leaderOpts = '<option value="' + esc(sec.leaderTicker) + '" selected>' + esc(sec.leaderTicker) + "（未挂到当前组）</option>" + leaderOpts;
    }
    if (!leaderOpts) {
      leaderOpts = '<option value="">先添加美股</option>';
    }

    var title = isConcept ? (sec.nameCn || "未命名概念") : (sec.nameCn || "未命名板块");
    var html = '<div class="panel-head"><h2>' + esc(title) + "</h2>" +
      '<p class="muted">' + (isConcept
        ? "概念 id 给日榜「概念」维度用。美股可挂多个概念；主板块仍在 GICS 里。"
        : "板块 id 给日榜脚本用，改 id 会同步该板块下美股的 sectorId。GICS 一级行业之外的主题用「增补」。") +
      "</p></div>";
    html += '<div class="map-fields">' +
      '<label>' + (isConcept ? "概念 id" : "板块 id") + '<input data-edit="group" data-key="id" value="' + esc(sec.id) + '" /></label>' +
      '<label>龙头美股<select data-edit="group" data-key="leaderTicker">' + leaderOpts + "</select></label>" +
      '<label>中文名<input data-edit="group" data-key="nameCn" value="' + esc(sec.nameCn) + '" /></label>' +
      '<label>英文名<input data-edit="group" data-key="nameEn" value="' + esc(sec.nameEn) + '" /></label>';
    if (!isConcept) {
      html += '<label>类型<select data-edit="group" data-key="kind">' +
        '<option value="gics"' + (sec.kind !== "extra" ? " selected" : "") + ">GICS 一级行业</option>" +
        '<option value="extra"' + (sec.kind === "extra" ? " selected" : "") + ">非 GICS 增补</option>" +
        "</select></label>";
    }
    html += "</div>";
    html += '<div class="map-block"><div class="map-block-head"><h3>' + (isConcept ? "概念级 A 股" : "板块级 A 股") + "</h3>" +
      '<button type="button" class="btn ghost" data-action="add-group-a">添加 A 股</button></div>' +
      '<p class="muted">点研究台卡片时列出的行业/概念候选，不必与下面某只美股一一对应。</p>' +
      aRows(sec.aShares || [], "group") +
      "</div>";

    if (isConcept) {
      html += '<div class="map-block"><div class="map-block-head"><h3>挂了这个概念的美股</h3></div>';
      html += '<p class="muted">在所属 GICS 板块里给美股勾选概念；也可在下面移除标签。日榜等权只统计挂了该概念的种子美股。</p>';
      if (!members.length) {
        html += '<p class="empty">还没有美股挂这个概念。</p>';
      }
      members.forEach(function (us) {
        html += renderUsCard(us, true);
      });
      html += "</div>";
      html += '<div class="map-footer-actions"><button type="button" class="btn danger" data-action="del-group">删除这个概念</button></div>';
    } else {
      html += '<div class="map-block"><div class="map-block-head"><h3>板块内美股</h3>' +
        '<button type="button" class="btn ghost" data-action="add-us">添加美股</button></div>';
      if (!members.length) {
        html += '<p class="empty">该板块还没有美股。日榜等权平均只统计这里的种子美股。</p>';
      }
      members.forEach(function (us) {
        html += renderUsCard(us, false);
      });
      html += "</div>";
      html += '<div class="map-footer-actions"><button type="button" class="btn danger" data-action="del-group">删除这个板块</button></div>';
    }
    root.innerHTML = html;
  }

  function render() {
    renderList();
    renderDetail();
    syncStatus();
  }

  function currentPayload() {
    return { sectors: draft.sectors, concepts: draft.concepts, usStocks: draft.usStocks };
  }

  function findUs(ticker) {
    var t = String(ticker || "").toUpperCase();
    for (var i = 0; i < draft.usStocks.length; i++) {
      if (draft.usStocks[i].ticker === t) return draft.usStocks[i];
    }
    return null;
  }

  function saveLocal() {
    var err = MappingData.saveOverride(currentPayload());
    if (err) {
      toast(err);
      return false;
    }
    draft = MappingData.snapshot();
    dirty = false;
    render();
    toast("已保存到本机浏览器。同源打开的研究台刷新后生效。");
    return true;
  }

  function downloadSeed() {
    var err = MappingData.validate(MappingData.normalizePayload(currentPayload()));
    if (err) {
      toast(err);
      return;
    }
    var text = MappingData.emitSeedFile(currentPayload());
    if (window.showSaveFilePicker) {
      window.showSaveFilePicker({
        suggestedName: "mapping-seed.js",
        types: [{ description: "JavaScript", accept: { "text/javascript": [".js"] } }]
      }).then(function (handle) {
        return handle.createWritable().then(function (writable) {
          return writable.write(text).then(function () { return writable.close(); });
        });
      }).then(function () {
        toast("已写回 mapping-seed.js。请确认覆盖的是 js/data/mapping-seed.js。");
      }).catch(function (e) {
        if (e && e.name === "AbortError") return;
        triggerDownload(text);
      });
      return;
    }
    triggerDownload(text);
  }

  function triggerDownload(text) {
    var blob = new Blob([text], { type: "text/javascript;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "mapping-seed.js";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 400);
    toast("已下载 mapping-seed.js，请覆盖 js/data/mapping-seed.js 后刷新研究台。");
  }

  function restoreSeed() {
    if (!confirm("恢复仓库里的 mapping-seed.js，并清掉本机覆盖？未下载的修改会丢失。")) return;
    MappingData.clearOverride();
    draft = MappingData.seedSnapshot();
    if (!draft.concepts) draft.concepts = [];
    selectedKind = draft.sectors.length ? "sector" : "concept";
    selectedId = draft.sectors.length ? draft.sectors[0].id : (draft.concepts[0] && draft.concepts[0].id);
    dirty = false;
    render();
    toast("已恢复仓库种子。");
  }

  function parseImported(text) {
    var raw = String(text || "").replace(/^\uFEFF/, "").trim();
    if (!raw) throw new Error("文件是空的");
    if (raw.charAt(0) === "{") {
      var json = JSON.parse(raw);
      return {
        sectors: json.sectors,
        concepts: json.concepts || json.CONCEPTS || [],
        usStocks: json.usStocks || json.US_STOCKS
      };
    }
    var fn = new Function(raw + ";\nreturn (typeof MappingSeed !== 'undefined') ? MappingSeed : null;");
    var seed = fn();
    if (!seed || !seed.sectors) throw new Error("不是 MappingSeed 或 JSON");
    return { sectors: seed.sectors, concepts: seed.concepts || [], usStocks: seed.usStocks };
  }

  function importFile(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = parseImported(String(reader.result || ""));
        var norm = MappingData.normalizePayload(data);
        var err = MappingData.validate(norm);
        if (err) {
          toast(err);
          return;
        }
        draft = cloneJson(norm);
        selectedKind = draft.sectors.length ? "sector" : "concept";
        selectedId = draft.sectors.length ? draft.sectors[0].id : (draft.concepts[0] && draft.concepts[0].id);
        dirty = true;
        render();
        toast("已导入，记得保存或下载。");
      } catch (e) {
        toast("导入失败：" + (e && e.message ? e.message : e));
      }
    };
    reader.readAsText(file, "utf-8");
  }

  function renameGroupId(sec, next) {
    var prev = sec.id;
    if (!next || next === prev) return false;
    if (findGroup(selectedKind, next) && next !== prev) {
      toast((selectedKind === "concept" ? "概念" : "板块") + " id 已存在：" + next);
      return false;
    }
    sec.id = next;
    if (selectedKind === "sector") {
      draft.usStocks.forEach(function (us) {
        if (us.sectorId === prev) us.sectorId = next;
      });
    } else {
      draft.usStocks.forEach(function (us) {
        us.conceptIds = (us.conceptIds || []).map(function (id) { return id === prev ? next : id; });
      });
    }
    selectedId = next;
    return true;
  }

  function onEdit(el) {
    var kind = el.getAttribute("data-edit");
    var key = el.getAttribute("data-key");
    var value = el.value;
    var sec = currentGroup();
    if (kind === "group" && sec) {
      if (key === "id") {
        if (!renameGroupId(sec, String(value || "").trim())) {
          el.value = sec.id;
          return;
        }
        markDirty();
        render();
        return;
      }
      sec[key] = value;
      markDirty();
      if (key === "nameCn") renderList();
      return;
    }
    if (kind === "group-a" && sec) {
      var si = Number(el.getAttribute("data-index"));
      if (!sec.aShares[si]) return;
      sec.aShares[si][key] = value;
      markDirty();
      return;
    }
    if (kind === "us") {
      var oldT = el.getAttribute("data-ticker");
      var us = findUs(oldT);
      if (!us) return;
      if (key === "ticker") {
        var nt = MappingData.normalize(value);
        if (!nt || nt === us.ticker) return;
        if (findUs(nt)) {
          toast("美股代码已存在：" + nt);
          el.value = us.ticker;
          return;
        }
        draft.sectors.concat(draft.concepts).forEach(function (g) {
          if (g.leaderTicker === us.ticker) g.leaderTicker = nt;
        });
        us.ticker = nt;
        markDirty();
        render();
        return;
      }
      if (key === "sectorId") {
        us.sectorId = value;
        markDirty();
        render();
        return;
      }
      us[key] = value;
      markDirty();
      return;
    }
    if (kind === "us-concept") {
      var stock = findUs(el.getAttribute("data-ticker"));
      var cid = el.getAttribute("data-id");
      if (!stock || !cid) return;
      stock.conceptIds = stock.conceptIds || [];
      var idx = stock.conceptIds.indexOf(cid);
      if (el.checked && idx < 0) stock.conceptIds.push(cid);
      if (!el.checked && idx >= 0) stock.conceptIds.splice(idx, 1);
      markDirty();
      renderList();
      return;
    }
    if (kind === "us-a") {
      var ut = el.getAttribute("data-ticker");
      var ui = Number(el.getAttribute("data-index"));
      var stockA = findUs(ut);
      if (!stockA || !stockA.aShares[ui]) return;
      stockA.aShares[ui][key] = value;
      markDirty();
    }
  }

  function placeholderTicker() {
    var ticker = "TICKER";
    var n = 1;
    while (findUs(ticker)) {
      ticker = "TICKER" + n;
      n += 1;
    }
    return ticker;
  }

  document.addEventListener("input", function (ev) {
    var el = ev.target.closest("[data-edit]");
    if (!el) return;
    if (el.tagName === "SELECT") return;
    if (el.type === "checkbox") return;
    var key = el.getAttribute("data-key");
    if (key === "id" || key === "ticker") return;
    onEdit(el);
  });

  document.addEventListener("change", function (ev) {
    var el = ev.target.closest("[data-edit]");
    if (!el) return;
    onEdit(el);
  });

  document.addEventListener("click", function (ev) {
    var btn = ev.target.closest("[data-action]");
    if (!btn) return;
    var action = btn.getAttribute("data-action");
    var sec = currentGroup();

    if (action === "pick-sector") {
      selectedKind = "sector";
      selectedId = btn.getAttribute("data-id");
      render();
      return;
    }
    if (action === "pick-concept") {
      selectedKind = "concept";
      selectedId = btn.getAttribute("data-id");
      render();
      return;
    }
    if (action === "add-sector" || action === "add-concept") {
      var isConcept = action === "add-concept";
      var list = isConcept ? draft.concepts : draft.sectors;
      var id = nextId(isConcept ? "concept" : "sector", list);
      var ticker = placeholderTicker();
      list.push({
        id: id,
        nameCn: isConcept ? "新概念" : "新板块",
        nameEn: isConcept ? "New Concept" : "New Sector",
        kind: isConcept ? undefined : "extra",
        leaderTicker: ticker,
        aShares: [emptyA(false)]
      });
      if (!isConcept) {
        draft.usStocks.push({
          ticker: ticker,
          name: "",
          sectorId: id,
          conceptIds: [],
          aShares: [emptyA(true)]
        });
      } else if (!findUs(ticker)) {
        var host = draft.sectors[0];
        if (!host) {
          toast("请先建一个板块，再给概念挂美股。");
          list.pop();
          return;
        }
        draft.usStocks.push({
          ticker: ticker,
          name: "",
          sectorId: host.id,
          conceptIds: [id],
          aShares: [emptyA(true)]
        });
        if (!host.leaderTicker) host.leaderTicker = ticker;
      }
      selectedKind = isConcept ? "concept" : "sector";
      selectedId = id;
      markDirty();
      render();
      return;
    }
    if (action === "del-group") {
      if (!sec) return;
      var label = selectedKind === "concept" ? "概念" : "板块";
      if (selectedKind === "sector" && !confirm("删除板块「" + sec.nameCn + "」及其下全部美股映射？")) return;
      if (selectedKind === "concept" && !confirm("删除概念「" + sec.nameCn + "」？美股仍保留，只去掉这个标签。")) return;
      if (selectedKind === "sector") {
        draft.usStocks = draft.usStocks.filter(function (us) { return us.sectorId !== sec.id; });
        draft.sectors = draft.sectors.filter(function (s) { return s.id !== sec.id; });
        selectedKind = draft.sectors.length ? "sector" : "concept";
        selectedId = draft.sectors.length ? draft.sectors[0].id : (draft.concepts[0] && draft.concepts[0].id);
      } else {
        draft.usStocks.forEach(function (us) {
          us.conceptIds = (us.conceptIds || []).filter(function (id) { return id !== sec.id; });
        });
        draft.concepts = draft.concepts.filter(function (s) { return s.id !== sec.id; });
        selectedId = draft.concepts.length ? draft.concepts[0].id : (draft.sectors[0] && draft.sectors[0].id);
        selectedKind = draft.concepts.length ? "concept" : "sector";
      }
      markDirty();
      render();
      return;
    }
    if (action === "add-group-a") {
      if (!sec) return;
      sec.aShares = sec.aShares || [];
      sec.aShares.push(emptyA(false));
      markDirty();
      render();
      return;
    }
    if (action === "del-group-a") {
      if (!sec) return;
      sec.aShares.splice(Number(btn.getAttribute("data-index")), 1);
      markDirty();
      render();
      return;
    }
    if (action === "add-us") {
      if (!sec || selectedKind !== "sector") return;
      var ticker = placeholderTicker();
      draft.usStocks.push({
        ticker: ticker,
        name: "",
        sectorId: sec.id,
        conceptIds: [],
        aShares: [emptyA(true)]
      });
      if (!sec.leaderTicker) sec.leaderTicker = ticker;
      markDirty();
      render();
      return;
    }
    if (action === "del-us") {
      var delT = btn.getAttribute("data-ticker");
      if (!confirm("删除美股 " + delT + " 及其 A 股映射？")) return;
      draft.usStocks = draft.usStocks.filter(function (us) { return us.ticker !== delT; });
      draft.sectors.concat(draft.concepts).forEach(function (g) {
        if (g.leaderTicker !== delT) return;
        var rest = selectedKind === "concept" && g.id === selectedId
          ? usInConcept(g.id)
          : usInSector(g.id);
        g.leaderTicker = rest.length ? rest[0].ticker : "";
      });
      markDirty();
      render();
      return;
    }
    if (action === "add-us-a") {
      var addTo = findUs(btn.getAttribute("data-ticker"));
      if (!addTo) return;
      addTo.aShares.push(emptyA(true));
      markDirty();
      render();
      return;
    }
    if (action === "del-us-a") {
      var from = findUs(btn.getAttribute("data-ticker"));
      if (!from) return;
      from.aShares.splice(Number(btn.getAttribute("data-index")), 1);
      markDirty();
      render();
      return;
    }
    if (action === "save-local") {
      saveLocal();
      return;
    }
    if (action === "download-seed") {
      downloadSeed();
      return;
    }
    if (action === "restore-seed") {
      restoreSeed();
      return;
    }
    if (action === "import-file") {
      $("map-import").click();
    }
  });

  $("map-import").addEventListener("change", function () {
    var file = this.files && this.files[0];
    this.value = "";
    if (file) importFile(file);
  });

  window.addEventListener("beforeunload", function (ev) {
    if (!dirty) return;
    ev.preventDefault();
    ev.returnValue = "";
  });

  render();
})();
