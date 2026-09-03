# A股筛选模型 · 美股热度映射

给后续 Agent 与维护者用的项目说明。改功能时必须同步更新本文档，并在文末「版本记录」追加条目。更短的协作约定见 [AGENTS.md](AGENTS.md)。

当前版本：**v0.1.22**（2026-09-04）

## 1. 项目目标

根据**美股收盘后的板块涨幅热度**，筛选可跟踪的 **A 股候选**，并用日历把「当日热度 + 个股分析」存成可回看的研究台账。

双击 [index.html](index.html) 即可在浏览器中打开（普通 `<script>` 加载，不用 ES Module，避免 `file://` 跨域）。美股日榜由离线脚本抓取后写入数据文件，页面不在浏览器里实时拉行情。

### 非目标（本版明确不做）

- 浏览器内实时抓取美股 / A 股行情或资讯
- 登录、云同步、多用户
- 下单、回测、收益统计
- 把种子映射当成完备或权威的产业研究结论

种子映射与抓取行情**不构成投资建议**。技术摘要由日K推算，不是盘中逐笔。

## 2. 目录

```
index.html                 单页入口（工作副本，顶栏显示最近简报保存时间）
archive/YYYY-MM-DD_HHMM.html  按日带时间戳的 index.html 快照（页内 `<base href="../">`）
briefings/YYYY-MM-DD.md    隔夜简报 Markdown（生成/保存时间写在文头）
css/app.css                深色金融台样式（涨红跌绿）
js/data/mapping.js         板块→A股、美股→A股 两层种子映射（MappingData）
js/data/sample-board.js    美股交易日前 3 板块日榜（SampleBoard，由脚本生成）
js/data/market-context.js  关联 A 股行情 + 资讯（MarketContext，由脚本生成）
js/data/sample-analysis.js 部分股票的示例基本面/技术面文案（SampleAnalysis）
js/data/briefings.js       隔夜简报（DailyBriefings，按美股日归档）
js/store.js                IndexedDB 封装（AppStore）
js/app.js                  日历、简报、日榜、映射下钻、分析、多选检索
tools/fetch_board.py       离线抓取美股日K并重写 sample-board.js
tools/fetch_context.py     离线抓取 A 股日K与资讯，重写 market-context.js
tools/archive_index.py     把当前 index.html 拷到 archive/ 并写时间戳
tools/serve.py             局域网静态服务（电脑开着时手机也可打开）
tools/make_icons.py        生成主屏幕图标 PNG
tools/pull_latest.ps1      本机从 GitHub 拉取云端日榜/简报
tools/install_pull_task.ps1 注册 Windows 计划任务（工作日 7:00 + 登录时）
manifest.json              网页应用清单（添加到主屏幕）
sw.js                      Service Worker（仅 http/https，file:// 不注册）
icons/                     主屏幕 / Apple Touch 图标
.github/workflows/pages.yml  推送到 main 后发布 GitHub Pages
README.md                  本文件
AGENTS.md                  Agent 协作约定
```

脚本加载顺序必须保持：`mapping.js` → `sample-board.js` → `market-context.js` → `sample-analysis.js` → `briefings.js` → `store.js` → `app.js`。`market-context.js` 或日榜 / 映射缺失时页面仍可打开：没有行情/资讯或日榜，但有 `briefings.js` 时仍能看隔夜简报。

## 3. 用户使用路径

日历按**美股交易日** `YYYY-MM-DD` 归档。美股夏令时收盘对应北京时间**次日 04:00** 之后（界面有提示）。默认打开最近一条有日榜或简报的日期（当前简报为 `2026-09-03`）。已抓取日榜区间：`2026-08-17` 至 `2026-09-03`。

1. **日历**  
   左侧月视图。金色点 = 当日有板块日榜；绿色点 = 当日有隔夜简报；蓝色点 = 当日有已保存分析。支持上月/下月、「最近有数据日」、「今日」。无日榜的日期仍可看简报、做个股分析并保存。
2. **隔夜简报**  
   主栏日榜上方，只显示结论标题和前三板块卡片（无日榜文件时）。**点击板块**才在下方映射区列出该板块 A 股；**点击美股代码**才列出该股对应 A 股。点「阅读全文」打开文档阅读层（结论、板块表、前三拆解、映射 A 股、逻辑链、破绽、关注点），不离开当前日历日。Markdown 源文件仍在 `briefings/YYYY-MM-DD.md`，文末可打开。板块全表、逻辑链与破绽不铺在主页。
3. **美股前 3 板块**  
   每张卡片两行个股：  
   - **龙头**：映射表预置的板块代表性龙头（产业地位，不是当日涨幅第一）。  
   - **涨幅最高**：该板块当日涨幅第一。  
   字段：涨跌幅、成交量相对均量、均线位置、趋势、技术备注。  
   卡片底部展示**当日资讯**，优先龙头与涨幅最高相关标题，其余归入板块。
4. **映射下钻**  
   - 点击板块卡片空白处 → 该板块行业/概念级 A 股。  
   - 点击美股代码（龙头或涨幅最高）→ 业务对应 A 股，关系类型为 `对标` / `供应链` / `同概念` / `ADR`。  
   - 每只关联 A 股按字段展示：前收、当日涨幅（下一 A 股交易日）、前日涨幅、5 日涨幅、10 日涨幅；涨红跌绿。点击行情字段名可排序。  
   - 行内「分析此股」进入下方分析区。
5. **个股分析**  
   输入 A 股 6 位代码或美股 ticker（大小写不敏感，可带 `.SZ` / `SH` 前缀）。展示该股 + 双向映射，可切换 chip。有种子文案则预填基本面/技术面；否则提示上传走势截图。点「保存到日历」写入**当前选中交易日**。当日已存分析会列出映射股的**代码 + 名称**（及关系类型），并展示上传的走势截图（可点击放大）。
6. **多选检索**  
   主栏最上方「多选检索」面板：搜索框、已选标签与检索结果在同一块区域内相邻展示。可同时多选，列出这些股票的全部历史分析，可「查看当日」跳转日历。手机上该面板默认收起，点「展开」再用。

### 3.1 手机 / 平板打开

iPhone / iPad **不能**把 iCloud 里的 `index.html` 当成 App：系统预览加载不了旁边的 `css/`、`js/`。电脑上继续双击即可。

要在手机上像 App 一样从主屏幕打开、又**不用电脑起服务**，需要一个 https 地址，然后「添加到主屏幕」。本仓库已带 `manifest.json` 与 `sw.js`（只在 http/https 注册，不影响 `file://`）。

**推荐：GitHub Pages + 添加到主屏幕**

1. 把改动推到 `main`。首次还要在仓库 **Settings → Pages → Source** 选 **GitHub Actions**。
2. 发布后地址一般是：`https://pandera0606.github.io/ashare-us-screener/`
3. 用 **Safari**（iPhone）或 **Chrome**（Android）打开该地址，不要用微信内置浏览器。
4. iPhone：分享 → **添加到主屏幕**。Android：菜单 → **添加到主屏幕** / **安装应用**。
5. 之后从主屏幕图标打开，全屏、无浏览器地址栏。主屏幕是独立应用，**没有 Safari 的下拉刷新**。要点顶栏或日期条上的「刷新」，才会重新拉取 GitHub 上的日榜/简报。离开超过约 2 小时再打开，且分析区没有未保存草稿时，也会自动重载。

注意：GitHub Pages 会把当前站点内容放到网上。仓库若是公开的，简报和映射别人也能打开。私有仓库的 Pages 通常需要付费方案。笔记仍在**这部手机这只浏览器**的 IndexedDB 里，和电脑、和其他设备不互通。更新日榜/简报后要再 push。Service Worker 联网时先拉网上的新文件，离线才用缓存。

**备用：电脑局域网服务**（电脑开着、同一 Wi-Fi 时）

```
python tools/serve.py
```

终端打印的 `http://192.168.x.x:8765/` 用手机浏览器打开。Windows 若打不开，防火墙放行该端口。这个地址也可以「添加到主屏幕」，但电脑关机或换网络后图标会失效，所以日常看盘更适合 Pages。

窄屏默认先看结果：顶上日期条 → 隔夜简报 → 日榜 → 映射 → 当日笔记。点「换日期」才弹出日历；「多选检索」和「个股分析」默认收起。平板竖屏同手机；约 721px 以上日榜卡片两列。

本版不做封装进 App Store 的原生壳（Capacitor / Xcode）。那是另一条线，需要开发者账号。

### 3.2 本机看到云端日榜 / 简报

工作日北京时间 **6:30**，Cursor 自动化把日榜和隔夜简报提交到 GitHub `main`。它改的是远程仓库，**不会**直接改这个 iCloud 文件夹。本机要再拉一次，双击 `index.html` 才是新数据。

两条任务前后衔接，不能合成一条：

1. 云端自动化写入 GitHub。
2. 本机计划任务运行 `tools/pull_latest.ps1`，把 `main` 拉回当前文件夹。
3. 重新打开 `index.html`（`file://` 不走 Service Worker，关掉旧标签再打开即可）。

首次在项目根目录注册计划任务：

```
powershell -ExecutionPolicy Bypass -File tools/install_pull_task.ps1
```

触发：工作日 **7:00**（此时起最多轮询约 40 分钟，等云端提交到）；用户登录时再拉一次（电脑当时没开着的兜底）。也可手动运行 `tools/pull_latest.ps1 -Once`。日志在 `tools/pull_latest.log`，不进仓库。

电脑关机或休眠时 7:00 不会跑，登录后再拉。本机有未提交改动时脚本会先暂存再快进拉取，成功后恢复；冲突则远程数据留下，本机改动留在 stash，需手工处理。

卸载：

```
powershell -ExecutionPolicy Bypass -File tools/install_pull_task.ps1 -Uninstall
```

## 4. 数据 schema

### 4.1 BoardDay（板块日榜）

定义于 `SampleBoard.DAYS`。

```
BoardDay {
  usDate: "YYYY-MM-DD",
  note?: string,
  sectors: [                    // v0.1 固定 3 条
    {
      id: string,               // 对应 MappingData.SECTORS[].id
      nameCn, nameEn,
      changePct: number,
      leader: TechSnap,
      topGainer: TechSnap
    }
  ]
}

TechSnap {
  ticker, name,
  changePct: number,
  volumeVsAvg: number,          // 相对均量倍数，如 1.28
  maBias: string,               // 如「站上MA20」
  trend: "上升" | "震荡" | "回调",
  techNote: string
}
```

### 4.2 Mapping（两层映射）

全局对象 `MappingData`。

- `SECTORS[]`：`{ id, nameCn, nameEn, leaderTicker, aShares: [{ ticker, name, note }] }`
- `US_STOCKS[]`：`{ ticker, name, sectorId, aShares: [{ ticker, name, relation, note }] }`
- `relation` 只允许：`对标` | `供应链` | `同概念` | `ADR`

主要 API：

| 方法 | 作用 |
| --- | --- |
| `normalize(raw)` | 统一代码（A 股补零到 6 位，去掉 SH/SZ 前缀） |
| `getRelated(ticker)` | 该股 + 双向映射列表 |
| `getMappedFromUs` / `getMappedFromA` | 单方向映射 |
| `searchStocks(q)` | 名称或代码检索，最多 20 条 |
| `isKnown(ticker)` | 是否在种子表中 |

**如何改映射：** 只改 [js/data/mapping.js](js/data/mapping.js)。新增美股必须带 `sectorId` 与至少一条 A 股映射；新增板块要同时能被日榜 `sectors[].id` 引用。改完后在版本记录写清增减了哪些 ticker。

**如何更新日榜：** 不要手改 [js/data/sample-board.js](js/data/sample-board.js)（由脚本生成）。在项目根目录运行：

```
python tools/fetch_board.py --start 2026-08-17 --end 2026-09-03
```

板块涨幅 = 该板块种子美股当日涨跌幅的等权平均；龙头取 `SECTORS[].leaderTicker`；涨幅最高取该板块种子池当日涨幅第一。缺行情的 ticker 记入 `META.tickersMiss`，页面仍可对个股上传截图。

**如何加分析范文：** 在 [js/data/sample-analysis.js](js/data/sample-analysis.js) 以 ticker 为键增加 `{ fundamental, technical }`。未知代码走截图空态。

### 4.4 MarketContext（A 股行情 + 资讯）

定义于 `js/data/market-context.js`（由脚本生成，不要手改）。

```
QuoteAsOf {
  asOf: "YYYY-MM-DD",   // 不晚于所选美股日的最近 A 股交易日
  prevClose: number,    // 该日收盘价（界面称「前收」）
  dayPct, dayAsOf,      // 下一 A 股交易日涨跌幅 % 及其日期（界面称「当日涨幅」）
  d1Pct, d5Pct, d10Pct  // 相对 1/5/10 个交易日前收盘的涨跌幅 %
}

NewsItem {
  title, url,
  date: "YYYY-MM-DD HH:MM",  // 无时刻时仅日期
  source,
  tags: string[]        // 命中的关键词，以及 龙头 / 涨幅最高 / 板块 / 近一周
}
```

| 方法 | 作用 |
| --- | --- |
| `quote(ticker, usDate)` | 关联 A 股在该美股日对应的最近行情 |
| `sectorNews(usDate, sectorId)` | 该板块当日资讯 |
| `usNews(usDate, ticker)` | 龙头 / 涨幅最高美股当日资讯 |
| `aNews(usDate, ticker)` | 映射 A 股近一周资讯 |

资讯按**标题**匹配公司名或板块关键词；1–3 个字母的美股代码（如 `NOW`、`KO`）不参与匹配，以免误伤。滚动资讯源偏最新，越近的交易日覆盖越好。

**如何更新行情与资讯：** 不要手改 `market-context.js`。在项目根目录运行：

```
python tools/fetch_context.py --start 2026-08-17 --end 2026-09-03
python tools/fetch_context.py --quotes-only   # 只重抓日K（含当日涨幅），沿用已有资讯
python tools/fetch_context.py --news-only     # 只重抓资讯（含发布时间），沿用已有行情
```

通常先跑 `fetch_board.py` 再跑本脚本，以便按日榜里的龙头 / 涨幅最高去匹配资讯。`--quotes-only` / `--news-only` 失败时会尽量保留文件里已有的另一半数据。

### 4.5 DailyBriefing（隔夜简报）

定义于 `DailyBriefings.DAYS`（[js/data/briefings.js](js/data/briefings.js)）。人类可读副本在 [briefings/YYYY-MM-DD.md](briefings/2026-09-03.md)，文头写生成时间与保存时间。

```
DailyBriefing {
  usDate: "YYYY-MM-DD",       // 美股交易日
  generatedAt: "YYYY-MM-DD HH:MM",  // 北京时间，分析生成
  savedAt: "YYYY-MM-DD HH:MM",      // 北京时间，写入本地文件
  source, mdPath, headline, summary, disclaimer,
  stats: [{ label, value, tone: "up"|"down" }],
  sectors: [{ nameCn, changePct, leader, topGainer, note }],
  top3: [{ nameCn, changePct, take, bullets: string[] }],
  mappedA: [{ sectorCn, us, role, a, relation, dUsPct, dReactPct }],
  logic: string[],
  caveats: [{ title, detail }],
  watch: [{ point, check }],
  tickersOk: number,
  tickersMiss: string[]
}
```

`dUsPct` = 该美股日当天（或之前）最近 A 股收盘涨跌；`dReactPct` = A 股下一交易日（对隔夜美股的反应日）。

页面「阅读全文」用这份结构化对象渲染文档界面，**不 `fetch` Markdown**（`file://` 下也打不开本地 md）。`briefings/YYYY-MM-DD.md` 仍是给人读、给版本管理用的源文件。

**如何保存简报与页面快照：** 把 Markdown 写入 `briefings/YYYY-MM-DD.md`，把同日对象追加进 `js/data/briefings.js` 的 `DAYS`（新日期放数组最前）。然后：

```
python tools/archive_index.py --us-date 2026-09-03
```

会生成 `archive/YYYY-MM-DD_HHMM.html`（页头加 `<base href="../">`，与工作副本共用 `css/`、`js/`），并回写 `DailyBriefings.META.pageSnapshot`。不要 `fetch` 本地 JSON。

### 4.3 AnalysisNote（用户分析）

```
AnalysisNote {
  id: string,                   // AppStore.uid()
  usDate: "YYYY-MM-DD",
  primaryTicker: string,
  mappedTickers: string[],
  fundamental: string,
  technical: string,
  screenshots: [{ name, dataUrl, type }],
  createdAt: ISO string
}
```

## 5. 本地存储

| 项 | 值 |
| --- | --- |
| IndexedDB 库名 | `ashare-us-screener` |
| object store | `analyses`（keyPath: `id`） |
| 索引 | `usDate`, `primaryTicker` |
| localStorage | 本版未使用 |

截图经 canvas 压缩为 JPEG，单张目标约 2MB 以内。数据只存在本机浏览器，清站点数据会丢失笔记。`file://` 下 Chrome/Edge 一般可用 IndexedDB；若不可用，界面会 toast 提示。

封装：`AppStore.getAll()` / `save(note)` / `remove(id)` / `uid()`。

## 6. 行情与资讯抓取（离线脚本）

浏览器端**不**直接请求行情 / 资讯 API，以保证双击 HTML 可用。抓取在开发机用 Python 完成。

### 6.1 美股日榜

- 脚本：[tools/fetch_board.py](tools/fetch_board.py)
- 数据源：腾讯财经日K `web.ifzq.gtimg.cn`（失败则试 `proxy.finance.qq.com`），代码形如 `usNVDA.OQ` / `usJPM.N`
- 输入：`--start` `--end`（美股交易日，周末自动跳过）
- 输出：覆盖 [js/data/sample-board.js](js/data/sample-board.js)，含 `DAYS` 与 `META`
- 技术摘要：由日K计算涨跌幅、近 20 日均量比、MA5/10/20 位置与趋势文案；**不是**盘中逐笔
- 失败回落：未进日榜的日期仍可保存分析；无范文的个股走截图+备注
- 当前已抓取：`2026-08-17` 至 `2026-09-03`（14 个交易日）。种子 11 个板块、54 只美股；`BYDDY` 无日K，已跳过

### 6.2 关联 A 股行情与资讯

- 脚本：[tools/fetch_context.py](tools/fetch_context.py)
- A 股日K：腾讯财经 `sh` / `sz` 前缀（6/9 开头走 `sh`）
- 资讯：新浪财经美股频道滚动 + 东方财富栏目。按标题匹配龙头、涨幅最高、板块关键词与映射股名称
- 输出：覆盖 [js/data/market-context.js](js/data/market-context.js)
- 局限：滚动源以最新为主，历史交易日可能没有匹配资讯；匹配是关键词而非人工研判

失败回落：文件缺失或某只股票无行情时，界面显示「暂无」，仍可上传截图做分析。

若以后要在页面内实时拉数，应另增 `js/market-adapter.js`，保持：

```
MarketDataAdapter.getBoardDay(usDate) -> Promise<BoardDay>
MarketDataAdapter.getQuotes(tickers) -> Promise<{ [ticker]: TechSnap }>
```

不要把请求写死在 `app.js`。个股基本面仍以用户备注为主。

## 7. UI 与实现要点

- 单页结构：顶栏 → 多选检索 → 隔夜简报（结论 + 前三卡片）→ 日榜 → 映射明细（点选后才出现）→ 个股分析 → 当日已存分析。窄屏把简报/日榜提前，检索与分析默认折叠。
- 简报「阅读全文」是全屏文档层，用 `DailyBriefings` 渲染，不请求 `.md`。Esc 或「关闭」退出。映射表里的 A 股代码可跳去分析。
- 日历绿色点 = 有隔夜简报；工作副本是根目录 `index.html`，按日快照是 `archive/YYYY-MM-DD_HHMM.html`。
- 手机/平板：要像 App 一样从主屏幕打开，用 GitHub Pages 的 https 地址「添加到主屏幕」；电脑在线时也可用 `python tools/serve.py`。不要依赖 iCloud 里直接点 HTML。主屏幕全屏没有系统下拉刷新，用页内「刷新」。
- 当日笔记展示映射股代码与名称；截图以较大预览呈现，点击可放大。
- 事件委托：`document` 监听 `[data-action]`。板块卡片必须是 `div` 而不是 `button`，以免嵌套按钮被浏览器拆开。
- 分析表单（textarea、文件选择）不在每次 `render()` 时重建，避免光标丢失。
- 涨红跌绿遵循 A 股习惯。板块卡片上「龙头」金色标签、「涨幅最高」红色标签；资讯区独立深底、标题加粗偏亮，条目展示日期与时间；映射表行情拆成字段列（前收 / 当日 / 前日 / 5日 / 10日），点击字段名排序。前收只显示价格。
- 顶栏「映射说明」解释两层映射、关系类型，以及日榜 / A 股行情与资讯的离线抓取方式。

## 8. 给 Agent 的扩展清单（尚未实现，待用户补充需求）

- 浏览器内实时行情 / A 股行情
- 映射表可视化编辑器、导出/导入 JSON
- 分析笔记导出 Markdown
- 云同步
- 封装成 App Store / 应用商店原生壳（Capacitor 等）

做上述任何一项，都要改 README 版本记录，并核对 schema 是否向后兼容。IndexedDB 升版本时在 `store.js` 的 `onupgradeneeded` 写迁移，不要直接改 keyPath 导致旧笔记丢失。

## 9. 版本记录

### v0.1.22 — 2026-09-04

- 隔夜简报与日榜延伸到美股交易日 `2026-09-03`（加密货币 / 软件SaaS / AI算力）。加密货币四只全红、等权 +11.08%，资讯写比特币突破 8 万美元；映射仍全部是 `同概念`。软件从 9/2 最弱翻到第二，是 ServiceNow 回补不是新主线。AI 第三主要是 Palantir 翻昨天，英伟达有 Hugging Face 收购标题却只 +1.80%。昨天的光伏第一名被 SolarEdge 回吐证伪。A 股 9/4 反应日在生成时尚未开盘，映射表写 `null` / 「—」，不编造涨跌。A 股 9/3 已收盘：逆变器略红、组件仍绿，苹果链和 Meta 同概念没跟上；飞天诚信续跌，对着的是更早的美股日，不是今夜这笔比特币。
- 兼容性：IndexedDB 未改。Service Worker 缓存名随版本号，主屏幕打开需重新加载。

### v0.1.21 — 2026-09-03

- 隔夜简报与日榜延伸到美股交易日 `2026-09-02`（光伏储能 / 互联网科技 / 创新药）。光伏等权第一主要靠 SolarEdge 单票且量能偏低；昨天的 Moderna 第一名回吐，能源连续前三结束。A 股 9/3 反应日在生成时尚未开盘，映射表写 `null` / 「—」，不编造涨跌。A 股 9/2 已收盘：石油股续跌、疫苗同概念回吐，对着的是 9/1 美股。
- 兼容性：IndexedDB 未改。Service Worker 缓存名随版本号，主屏幕打开需重新加载。

### v0.1.20 — 2026-09-02

- 隔夜简报与日榜延伸到美股交易日 `2026-09-01`（创新药 / 能源 / 互联网科技）。创新药等权第一主要靠 Moderna 单票，礼来收购标题没有做成板块主线；能源连续两日前三，加密货币从 8/31 第一名回吐到最弱。A 股 9/2 反应日在生成时尚未开盘，映射表写 `null` / 「—」，不编造涨跌。
- 兼容性：IndexedDB 未改。Service Worker 缓存名随版本号，主屏幕打开需重新加载。

### v0.1.19 — 2026-09-01

- 隔夜简报增加文档阅读层：主页仍只显示结论 + 卡片，点「阅读全文」打开排版后的全文（板块表、前三拆解、映射、逻辑链、破绽、关注点）。页面不 fetch Markdown。
- 种子映射新增「加密货币」板块（COIN / MSTR / MARA / IBIT）。日榜按 11 个板块重算；08-31 简报按新口径改写，并补上 A 股 9/1 反应日实盘。更早简报仍是当时十板块快照，可能与重算后的日榜不完全一致。
- 兼容性：IndexedDB 未改。Service Worker 缓存名随版本号。A 股侧没有比特币现货或合规交易所对标，映射均为 `同概念`。

### v0.1.18 — 2026-09-01

- 隔夜简报与日榜延伸到美股交易日 `2026-08-31`（能源 / 半导体 / 软件SaaS）。8 月收官主线是原油，互联网科技回吐周五轮动。A 股 9/1 反应日在生成时尚未开盘，映射表写 `null` / 「—」，不编造涨跌。
- 兼容性：IndexedDB 未改。Service Worker 缓存名随版本号，主屏幕打开需重新加载。

### v0.1.17 — 2026-08-31

- 隔夜简报与日榜延伸到美股交易日 `2026-08-28`（互联网科技 / 软件SaaS / 消费）。英伟达财报次日回吐，半导体与光伏收在最弱。A 股 8/31 反应日在生成时尚未开盘，映射表写 `null` / 「—」，不编造涨跌。
- 兼容性：IndexedDB 未改。Service Worker 缓存名随版本号，主屏幕打开需重新加载。

### v0.1.16 — 2026-08-28

- 主屏幕全屏没有系统下拉刷新：顶栏和手机日期条增加「刷新」，重新拉取 GitHub Pages 上的日榜/简报。
- Service Worker 改为联网优先、离线回落到缓存；打开时检查更新。离开超过约 2 小时再进入且分析区无未保存草稿时自动重载。
- 兼容性：IndexedDB 未改。缓存名改为 `ashare-us-screener-v0.1.16`，旧的 cache-first 缓存会被清掉。手机要等本次推到 `main` 并打开一次后才会换上新逻辑。

### v0.1.15 — 2026-08-28

- 隔夜简报与日榜延伸到美股交易日 `2026-08-27`（软件SaaS / AI算力 / 光伏储能）。A 股 8/28 反应日在生成时尚未开盘，映射表写 `null` / 「—」，不编造涨跌。
- 简报映射表在缺少 `dUsPct` / `dReactPct` 时显示「—」，避免把空值画成 0.00%。
- 兼容性：IndexedDB 未改。Service Worker 缓存名随版本号，主屏幕打开需重新加载。

### v0.1.14 — 2026-08-28

- 云端日榜/简报改为工作日北京时间 **6:30**；本机拉取计划任务改为 **7:00**（登录时仍再拉一次）。
- 兼容性：IndexedDB 与数据文件未改。已注册过计划任务的电脑需再跑一次 `tools/install_pull_task.ps1`。Cursor 自动化的触发时间要在自动化页里改成 6:30。

### v0.1.13 — 2026-08-28

- 本机可用 Windows 计划任务把 GitHub 上的日榜/简报拉回当前文件夹：`tools/pull_latest.ps1`、`tools/install_pull_task.ps1`（工作日 8:20 + 登录时）。
- 云端 8:00 自动化仍只写 GitHub，不能直接改 iCloud 里的 `index.html`。
- 兼容性：IndexedDB 与数据文件未改。未注册计划任务时用法不变，需要时手动 `git pull`。

### v0.1.12 — 2026-08-27

- 映射表「前收」只显示价格，不再附日期。
- 资讯 meta 展示到分钟（`YYYY-MM-DD HH:MM`）。`fetch_context.py` 支持 `--news-only`。
- 兼容性：IndexedDB 未改。旧资讯只有日期时仍只显示日期。

### v0.1.11 — 2026-08-27

- 板块/个股映射 A 股：行情改为独立字段列（前收、当日涨幅、前日涨幅、5 日、10 日），涨红跌绿；点击字段名排序。
- `QuoteAsOf` 增加 `dayPct` / `dayAsOf`（所选美股日之后的下一 A 股交易日）。`fetch_context.py` 支持 `--quotes-only`。
- 兼容性：IndexedDB 未改。旧 `market-context.js` 无 `dayPct` 时该列显示「—」，其余字段仍可用。

### v0.1.10 — 2026-08-27

- 支持像 App 一样从手机主屏幕打开：`manifest.json`、主屏幕图标、`sw.js`（仅 http/https 注册，`file://` 双击不受影响）。
- 增加 GitHub Pages 工作流。推到 `main` 并在仓库 Settings 启用 Pages 后，用 Safari/Chrome 打开站点再「添加到主屏幕」，无需电脑起 `serve.py`。
- 兼容性：IndexedDB 与数据文件未改。Pages 会公开当前站点内容；笔记仍只存在打开它的那只浏览器里。

### v0.1.9 — 2026-08-27

- 手机/平板可看结果：窄屏用顶部日期条换日期，日历改为抽屉；简报与日榜提前，检索/分析默认收起；映射表改为卡片。
- 新增 `tools/serve.py`，同一 Wi-Fi 用手机浏览器打开。不要在 iCloud「文件」里直接点 `index.html`。
- 兼容性：IndexedDB 与数据文件未改；电脑宽屏布局不变。旧 `archive/` 快照共用根目录 css/js，也会带上窄屏样式。

### v0.1.8 — 2026-08-27

- 修复点击日历日期不切换：补回 `pick-date` 事件处理，简报 / 日榜 / 映射 / 当日笔记随选中交易日重绘。
- 无简报但有日榜的日期会收起简报面板，避免看起来像还停在上一份简报。
- 兼容性：IndexedDB 与数据文件未改。

### v0.1.7 — 2026-08-27

- 修复「当日页面快照」打开空白：快照改为 `archive/YYYY-MM-DD_HHMM.html` 单文件，并用 `<base href="../">` 加载根目录的 css/js；页内链接用 `data-action="go"` 跳到浏览器解析后的绝对地址（避免快照页上的相对路径指到 `archive/archive/`）。
- 兼容性：IndexedDB 未改；旧目录 `archive/YYYY-MM-DD_HHMM/index.html` 仍可放一条跳转到新文件。

### v0.1.6 — 2026-08-27

- 简报改回点选下钻：主页只保留结论标题 + 前三板块卡片；映射 A 股仍在「映射明细」里，点板块或美股代码后才出现。
- 十板块表、逻辑链、破绽、关注点不再平铺，改走 `briefings/YYYY-MM-DD.md`。
- 有日榜时不重复画三张简报卡片，沿用原来的板块卡片点击行为。
- 兼容性：IndexedDB 与简报数据文件未改，仅展示收束。

### v0.1.5 — 2026-08-27

- 隔夜简报落到本地：`briefings/YYYY-MM-DD.md`（文头带生成/保存时间）与 `js/data/briefings.js`（页面按日历读取，不 fetch JSON）。
- `index.html` 增加简报面板；日历绿色点标记有简报的日期；顶栏显示最近保存时间。
- 按日把 `index.html` 快照到 `archive/YYYY-MM-DD_HHMM/`（页顶时间戳 + 相对路径改写），脚本 `tools/archive_index.py`。
- 映射 / 日榜 JS 缺失时页面仍可打开并查看已保存简报。
- 兼容性：IndexedDB 未改；新增数据文件，旧笔记不受影响。

### v0.1.4 — 2026-08-27

- 提高日榜与映射区可读性：龙头/涨幅最高用不同色标签；资讯区独立深底、标题加亮；关联 A 股行情改为「前收 / 前日 / 5日 / 10日」胶囊，说明文字降为次级灰色。
- 兼容性：仅 CSS 与展示 markup，IndexedDB 与数据文件未改。

### v0.1.3 — 2026-08-26

- 板块卡片展示当日资讯，优先龙头与涨幅最高相关标题。
- 映射下钻为每只关联 A 股展示前收、前日涨幅、5 日涨幅、10 日涨幅，以及近一周资讯。
- 新增 `tools/fetch_context.py` 与 `js/data/market-context.js`（腾讯 A 股日K + 新浪/东财资讯）。页面仍不在浏览器里实时拉数。
- 资讯按标题匹配；短美股代码不参与匹配。滚动源偏最新，越近的交易日覆盖越好。
- 兼容性：IndexedDB 未改；`market-context.js` 缺失时页面仍可用，仅无行情/资讯。

### v0.1.2 — 2026-08-26

- 用 `tools/fetch_board.py` 离线抓取腾讯财经美股日K，生成 2026-08-17 至 2026-08-25 共 7 个交易日的前 3 板块日榜（种子池等权；龙头 vs 日内最高）。
- 页面展示数据来源与抓取时间；龙头与涨幅最高为同一只时标注「同龙头」。
- 49/50 只种子美股有日K；`BYDDY` 缺失。浏览器仍不实时请求行情。
- 兼容性：IndexedDB 未改；`SampleBoard` 增加可选 `META`，旧调用 `getDay/latestDate/hasBoard` 不变。

### v0.1.1 — 2026-08-26

- 当日已存分析：映射股改为「代码 + 名称 + 关系类型」列表；上传截图以较大预览展示，点击可放大查看。
- 多选检索从顶栏下移到主栏顶部，搜索框、已选标签与分析结果在同一面板内相邻，不再隔开整页。
- 兼容性：IndexedDB schema 未改，旧笔记可直接显示名称（从种子映射表解析）与已存截图。

### v0.1.0 — 2026-08-26

- 从空目录初始化静态单页：日历、美股前 3 板块（龙头 + 涨幅最高技术摘要）、板块/个股两层 A 股映射、个股分析（范文或截图）、保存到日历、多选检索。
- 种子映射：10 个板块、50 只美股、约 100 条美股→A 股关系；示例日榜 5 个交易日（2026-08-19 至 2026-08-25）。
- 用户笔记存 IndexedDB `ashare-us-screener` / `analyses`。
- 兼容性：分析笔记仅存在本机；无后端；无行情 API。旧数据无（首发）。
