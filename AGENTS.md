# Agent 约定

本仓库是给人和后续 Agent 共同维护的静态研究台。改代码前先读 [README.md](README.md)。

## 必须遵守

1. **改功能就改 README。** 目录、schema、存储 key、使用路径、适配器约定任一变化，同步更新 README，并在「版本记录」追加一节（版本号、日期、改了什么、兼容性）。
2. **不要编辑用户未要求的计划文件。**
3. **保持可双击打开。** 在未引入后端之前：继续用普通 `<script>` 顺序加载，数据写成 JS 常量，不要 `fetch` 本地 JSON，不要改成 ES Module。
4. **映射是种子不是结论。** 增删 [js/data/mapping.js](js/data/mapping.js) 时写清 `relation` 与 `note`，界面与 README 继续标明「不构成投资建议」。
5. **用户笔记兼容。** 不要轻易改 IndexedDB 库名 `ashare-us-screener`、store 名 `analyses` 或 `AnalysisNote` 字段含义。必须破坏性变更时升 `DB_VERSION` 并写迁移。
6. **行情与资讯用离线脚本，不要写进 app.js。** 更新日榜运行 `python tools/fetch_board.py --start YYYY-MM-DD --end YYYY-MM-DD`，覆盖 `js/data/sample-board.js`。更新关联 A 股行情与资讯运行 `python tools/fetch_context.py`，覆盖 `js/data/market-context.js`。不要手改这两个生成文件。失败回落到截图+备注。浏览器内实时请求仍须另做 adapter，见 README 第 6 节。
7. **隔夜简报也走本地文件。** Markdown 写到 `briefings/YYYY-MM-DD.md`（文头写生成/保存时间），结构化副本追加进 `js/data/briefings.js`。保存后运行 `python tools/archive_index.py --us-date YYYY-MM-DD`，把当时的 `index.html` 快照到 `archive/`。不要 `fetch` 本地 JSON。

## 建议工作流

1. 读 README 版本记录，确认当前版本。
2. 只改任务需要的文件。
3. 手工点一遍：选有简报或日榜的日期 → 看隔夜简报时间戳与结论 → 看板块卡片资讯（龙头 / 涨幅最高）→ 点板块看 A 股行情与近一周资讯 → 点美股代码 → 分析并保存 → 多选检索。
4. 更新 README 版本记录后再结束。
