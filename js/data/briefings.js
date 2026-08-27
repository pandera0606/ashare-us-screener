/* Daily US-close briefings. Loaded by index.html as a JS constant (no fetch). */
var DailyBriefings = (function () {
  var META = {
    timezone: "Asia/Shanghai",
    savedAt: "2026-08-28 07:27",
    latestUsDate: "2026-08-27",
    mdDir: "briefings",
    pageSnapshot: "archive/2026-08-28_0727.html"
  };

  var DAYS = [
    {
      usDate: "2026-08-27",
      generatedAt: "2026-08-28 07:25",
      savedAt: "2026-08-28 07:25",
      source: "腾讯财经日K · 种子美股等权",
      mdPath: "briefings/2026-08-27.md",
      headline: "隔夜主线是软件财报与英伟达，不是全面风险偏好",
      summary: "十板块五个收红。软件SaaS 等权 +8.43%，几乎被 Salesforce 单日 +22.58% 抬起来，龙头微软只涨 1.75%。AI算力第二完全靠英伟达财报后 +8.74% 放量。A 股 8/28 反应日尚未开盘，不编造涨跌。",
      disclaimer: "技术摘要由日K推算，不是盘中逐笔。种子映射与行情不构成投资建议。",
      stats: [
        { label: "软件SaaS（等权第一）", value: "+8.43%", tone: "up" },
        { label: "AI算力（第二）", value: "+3.08%", tone: "up" },
        { label: "光伏储能（第三）", value: "+1.83%", tone: "up" },
        { label: "创新药（最弱）", value: "−1.91%", tone: "down" }
      ],
      sectors: [
        { nameCn: "软件SaaS", changePct: 8.43, leader: "MSFT +1.75%", topGainer: "CRM +22.58%", note: "5 只样本，CRM 单票权重大" },
        { nameCn: "AI算力", changePct: 3.08, leader: "NVDA +8.74%", topGainer: "NVDA +8.74%", note: "龙头即最高" },
        { nameCn: "光伏储能", changePct: 1.83, leader: "FSLR +2.02%", topGainer: "ENPH +2.16%", note: "3 只样本，趋势仍回调" },
        { nameCn: "半导体", changePct: 1.63, leader: "NVDA +8.74%", topGainer: "NVDA +8.74%", note: "英伟达领涨，设备股分化" },
        { nameCn: "新能源车", changePct: 0.78, leader: "TSLA +2.60%", topGainer: "RIVN +2.88%", note: "BYDDY 无日K" },
        { nameCn: "金融", changePct: -0.36, leader: "JPM −0.64%", topGainer: "GS +0.04%", note: "温和回落" },
        { nameCn: "能源", changePct: -0.72, leader: "XOM −1.11%", topGainer: "CVX −0.22%", note: "原油链偏弱" },
        { nameCn: "互联网科技", changePct: -1.01, leader: "AAPL +0.36%", topGainer: "AAPL +0.36%", note: "苹果微涨，奈飞/亚马逊收绿" },
        { nameCn: "消费", changePct: -1.26, leader: "COST −2.24%", topGainer: "NKE −0.39%", note: "防守品种齐跌" },
        { nameCn: "创新药", changePct: -1.91, leader: "LLY −1.12%", topGainer: "VRTX +0.05%", note: "礼来、诺和诺德、Moderna 齐跌" }
      ],
      top3: [
        {
          nameCn: "软件SaaS",
          changePct: 8.43,
          take: "财报日把等权第一送上去。龙头微软只是跟涨，趋势仍标震荡。",
          bullets: [
            "龙头 MSFT 微软 +1.75%，量能 0.95×，MA5 上穿 MA20、震荡",
            "最高 CRM Salesforce +22.58%，量能 3.95×，站上 MA20、上升",
            "NOW +10.04%、ADBE +5.73%、ORCL +2.06%。五只里四只收红、微软最弱"
          ]
        },
        {
          nameCn: "AI算力",
          changePct: 3.08,
          take: "英伟达自己就是板块。网络设备没有接力昨天的反弹。",
          bullets: [
            "龙头即最高 NVDA 英伟达 +8.74%，量能 2.39×，站上 MA10、震荡",
            "PLTR +4.75% 趋势上升；SMCI +2.86%",
            "GOOGL −0.39%；ANET −0.57%，量能 0.61×。昨天的网络设备领涨没有续上"
          ]
        },
        {
          nameCn: "光伏储能",
          changePct: 1.83,
          take: "三只都收红，但幅度小、趋势仍回调，不像趋势启动。",
          bullets: [
            "龙头 FSLR 第一太阳能 +2.02%，量能 0.57×，跌破 MA10",
            "最高 ENPH Enphase +2.16%，量能大致持平，仍跌破 MA20",
            "SEDG +1.30%，昨天 +10.71% 的超跌反弹没有再加速"
          ]
        }
      ],
      mappedA: [
        { sectorCn: "软件SaaS", us: "CRM +22.58%", role: "涨幅最高", a: "用友网络 600588", relation: "对标", dUsPct: 1.19, dReactPct: null },
        { sectorCn: "软件SaaS", us: "CRM +22.58%", role: "涨幅最高", a: "浪潮软件 600756", relation: "同概念", dUsPct: 0.56, dReactPct: null },
        { sectorCn: "软件SaaS", us: "MSFT +1.75%", role: "龙头", a: "金山办公 688111", relation: "对标", dUsPct: 2.23, dReactPct: null },
        { sectorCn: "软件SaaS", us: "MSFT +1.75%", role: "龙头", a: "用友网络 600588", relation: "同概念", dUsPct: 1.19, dReactPct: null },
        { sectorCn: "AI算力", us: "NVDA +8.74%", role: "龙头", a: "寒武纪 688256", relation: "对标", dUsPct: 2.75, dReactPct: null },
        { sectorCn: "AI算力", us: "NVDA +8.74%", role: "龙头", a: "海光信息 688041", relation: "对标", dUsPct: 6.5, dReactPct: null },
        { sectorCn: "AI算力", us: "NVDA +8.74%", role: "龙头", a: "工业富联 601138", relation: "供应链", dUsPct: 5.43, dReactPct: null },
        { sectorCn: "AI算力", us: "NVDA +8.74%", role: "龙头", a: "中科曙光 603019", relation: "供应链", dUsPct: 2.72, dReactPct: null },
        { sectorCn: "光伏储能", us: "ENPH +2.16%", role: "涨幅最高", a: "阳光电源 300274", relation: "对标", dUsPct: -12.24, dReactPct: null },
        { sectorCn: "光伏储能", us: "ENPH +2.16%", role: "涨幅最高", a: "固德威 688390", relation: "对标", dUsPct: -1.76, dReactPct: null },
        { sectorCn: "光伏储能", us: "FSLR +2.02%", role: "龙头", a: "隆基绿能 601012", relation: "对标", dUsPct: -1.06, dReactPct: null },
        { sectorCn: "光伏储能", us: "FSLR +2.02%", role: "龙头", a: "通威股份 600438", relation: "对标", dUsPct: -0.92, dReactPct: null }
      ],
      logic: [
        "隔夜不是普涨。等权前三是软件SaaS、AI算力、光伏储能，但广度一般：创新药 −1.91%，消费 −1.26%，互联网科技和能源也收绿。资金在买财报，而不是抬所有风险资产。",
        "软件第一名不可外推成「SaaS 主线」。板块第一主要靠 CRM +22.58%（量能 3.95×）和 NOW +10.04%。龙头微软只涨 1.75%。把单票财报映射成 A 股软件板块趋势，需要 8/28 用友、金山自己确认。",
        "英伟达扭转了 8/26 的放量回调。NVDA 从 −1.59% 变成 +8.74%、量能 2.39×、重新站上 MA10。ANET 昨天领涨今天收绿。A 股 8/27 海光、工业富联大涨是对更早交易日的反应，不能当成已经兑现今夜英伟达。"
      ],
      caveats: [
        { title: "软件样本只有 5 只", detail: "等权第一很容易被单票 22% 财报劫持，不能当成板块趋势。" },
        { title: "A 股反应日尚未开盘", detail: "8/28 日K 不存在。把 8/27 的 A 股涨跌当成对今夜美股的映射，方向会反。" },
        { title: "NVDA 同时是 AI 与半导体龙头", detail: "两个板块的「最高」其实是同一只票，半导体等权只有 +1.63%，设备股并没有同步大涨。" },
        { title: "光伏仍在均线下方", detail: "三只都收红但 FSLR 量能 0.57×，阳光电源 8/27 刚跌 12.24%。" },
        { title: "BYDDY 无日K", detail: "新能源车等权少一只，板块涨幅可能略有偏差。" }
      ],
      watch: [
        { point: "Salesforce 是否一日游", check: "CRM 量能 3.95× 之后能否站稳 MA20；A 股用友、浪潮软件 8/28 是否跟。" },
        { point: "英伟达能否守住 MA10", check: "若财报次日回吐并再跌破 MA10，AI/半导体内部会从龙头扭转变成假突破。" },
        { point: "海光 / 工业富联的 8/28", check: "8/27 已经大涨的国产算力，面对今夜英伟达，是继续还是高开低走。" },
        { point: "ANET 与光模块", check: "昨天网络设备领涨今天收绿；天孚、新易盛若 8/28 走弱，说明 8/27 更像一日游。" },
        { point: "光伏映射是否还要看", check: "需要 FSLR 放量、阳光电源止跌。" },
        { point: "创新药是否止跌", check: "礼来、诺和诺德、Moderna 连跌时，不要用前三板块掩盖这条空头腿。" }
      ],
      tickersOk: 49,
      tickersMiss: ["BYDDY"]
    },
    {
      usDate: "2026-08-26",
      generatedAt: "2026-08-27 15:06",
      savedAt: "2026-08-27 15:25",
      source: "腾讯财经日K · 种子美股等权",
      mdPath: "briefings/2026-08-26.md",
      headline: "隔夜主线是「局部反弹」，不是全面风险偏好",
      summary: "十板块里只有五个收红，第一名光伏被 SolarEdge 单日 +10.71% 抬起来，龙头第一太阳能反而收跌。真正传到 A 股的是光模块 / 国产算力，不是光伏逆变器。",
      disclaimer: "技术摘要由日K推算，不是盘中逐笔。种子映射与行情不构成投资建议。",
      stats: [
        { label: "光伏储能（等权第一）", value: "+4.38%", tone: "up" },
        { label: "人工智能（第二）", value: "+0.88%", tone: "up" },
        { label: "半导体（第三）", value: "+0.58%", tone: "up" },
        { label: "创新药（最弱）", value: "−3.35%", tone: "down" }
      ],
      sectors: [
        { nameCn: "光伏储能", changePct: 4.38, leader: "FSLR −0.43%", topGainer: "SEDG +10.71%", note: "3 只样本，单票权重大" },
        { nameCn: "人工智能", changePct: 0.88, leader: "MSFT +0.95%", topGainer: "ANET +5.92%", note: "网络设备强于算力整机" },
        { nameCn: "半导体", changePct: 0.58, leader: "NVDA −1.59%", topGainer: "ARM +3.93%", note: "英伟达放量回调" },
        { nameCn: "软件云服务", changePct: 0.43, leader: "ORCL +2.84%", topGainer: "ORCL +2.84%", note: "龙头即最高" },
        { nameCn: "消费电子", changePct: 0.1, leader: "AAPL +1.15%", topGainer: "AAPL +1.15%", note: "样本仅 2 只" },
        { nameCn: "金融", changePct: -0.69, leader: "JPM −0.05%", topGainer: "JPM −0.05%", note: "温和回落" },
        { nameCn: "能源", changePct: -0.77, leader: "XOM −1.53%", topGainer: "CVX +0.16%", note: "原油链偏弱" },
        { nameCn: "消费", changePct: -1.16, leader: "COST −0.41%", topGainer: "PG −0.28%", note: "防守品种也没人买" },
        { nameCn: "新能源车", changePct: -1.64, leader: "TSLA −1.26%", topGainer: "XPEV +0.95%", note: "BYDDY 无日K" },
        { nameCn: "创新药", changePct: -3.35, leader: "LLY −3.59%", topGainer: "VRTX −1.01%", note: "礼来、诺和诺德、Moderna 齐跌" }
      ],
      top3: [
        {
          nameCn: "光伏储能",
          changePct: 4.38,
          take: "龙头弱、补涨票强。趋势仍是回调，不像趋势启动。",
          bullets: [
            "龙头 FSLR 第一太阳能 −0.43%，量能 0.56×，跌破 MA10",
            "最高 SEDG SolarEdge +10.71%，量能 1.66×，仍跌破 MA20",
            "成员 ENPH +2.86%。三只里两只反弹、龙头未确认"
          ]
        },
        {
          nameCn: "人工智能",
          changePct: 0.88,
          take: "网络设备强于算力整机。ANET 领涨，SMCI 拖后腿。",
          bullets: [
            "龙头 MSFT 微软 +0.95%，量能 0.61×，站上 MA10、震荡",
            "最高 ANET Arista +5.92%，量能大致持平，站上 MA10",
            "PLTR +2.76% 趋势上升；SMCI −2.78%；GOOGL −1.43%"
          ]
        },
        {
          nameCn: "半导体",
          changePct: 0.58,
          take: "内部轮动：ARM / 高通 / 迈威尔收红，英伟达放量回调。",
          bullets: [
            "龙头 NVDA 英伟达 −1.59%，量能 1.54×，跌破 MA10、回调",
            "最高 ARM 安谋 +3.93%，量能 0.84×，仍跌破 MA10",
            "QCOM、MRVL 各 +1.97%；设备股 AMAT / LRCX / AVGO 小跌"
          ]
        }
      ],
      mappedA: [
        { sectorCn: "光伏储能", us: "SEDG +10.71%", role: "涨幅最高", a: "阳光电源 300274", relation: "对标", dUsPct: 2.76, dReactPct: -12.24 },
        { sectorCn: "光伏储能", us: "FSLR −0.43%", role: "龙头", a: "隆基绿能 601012", relation: "对标", dUsPct: 0.9, dReactPct: -1.06 },
        { sectorCn: "光伏储能", us: "FSLR −0.43%", role: "龙头", a: "通威股份 600438", relation: "供应链", dUsPct: 0, dReactPct: -0.92 },
        { sectorCn: "人工智能", us: "ANET +5.92%", role: "涨幅最高", a: "天孚通信 300394", relation: "同概念", dUsPct: -1.37, dReactPct: 5.36 },
        { sectorCn: "人工智能", us: "ANET +5.92%", role: "涨幅最高", a: "新易盛 300502", relation: "同概念", dUsPct: -0.52, dReactPct: 2.59 },
        { sectorCn: "人工智能", us: "MSFT +0.95%", role: "龙头", a: "金山办公 688111", relation: "同概念", dUsPct: -0.73, dReactPct: 2.23 },
        { sectorCn: "人工智能", us: "MSFT +0.95%", role: "龙头", a: "科大讯飞 002230", relation: "同概念", dUsPct: 0.79, dReactPct: 0.28 },
        { sectorCn: "半导体", us: "NVDA −1.59%", role: "龙头", a: "宁德时代 300750", relation: "同概念", dUsPct: 0.6, dReactPct: -1.58 },
        { sectorCn: "半导体", us: "ARM +3.93%", role: "涨幅最高", a: "海光信息 688041", relation: "同概念", dUsPct: -0.47, dReactPct: 6.5 },
        { sectorCn: "半导体", us: "ARM +3.93%", role: "涨幅最高", a: "龙芯中科 688047", relation: "同概念", dUsPct: -0.38, dReactPct: 4.43 },
        { sectorCn: "半导体", us: "NVDA −1.59%", role: "龙头", a: "北方华创 002371", relation: "供应链", dUsPct: 0.04, dReactPct: 2.47 },
        { sectorCn: "半导体", us: "NVDA −1.59%", role: "龙头", a: "中芯国际 688981", relation: "同概念", dUsPct: 3.46, dReactPct: 1.76 }
      ],
      logic: [
        "隔夜不是普涨。等权前三是光伏、人工智能、半导体，但广度很差：创新药 −3.35%，新能源车 −1.64%，消费和能源也收绿。资金在做结构，而不是抬风险偏好。",
        "光伏第一名不可外推。板块第一完全靠 SEDG 超跌反弹。龙头 FSLR 收跌、量能萎缩。A 股阳光电源 8/27 跌 12.24%，隆基、通威跟跌。把美股逆变器反弹映射成 A 股光伏主线，当天是错的。",
        "真正跟出来的是「网络 + 国产算力」。ANET 之后天孚通信 +5.36%、新易盛 +2.59%；ARM 之后海光信息 +6.50%、龙芯中科 +4.43%。英伟达放量跌破 MA10，宁德时代没有给出对标意义。"
      ],
      caveats: [
        { title: "光伏样本只有 3 只", detail: "等权第一很容易被单票 10% 反弹劫持，不能当成板块趋势。" },
        { title: "阳光电源与 SEDG 反向", detail: "同一映射对标在反应日出现超过 20 个百分点的裂口，当日映射失效。" },
        { title: "NVDA 映射到宁德时代过弱", detail: "「同概念」跨了电池和算力，相关更像风险偏好，不是产业链。" },
        { title: "日榜数据文件当时缺失", detail: "本次按种子池重算，未写入 sample-board.js；与页面日历日榜可能对不齐。" },
        { title: "BYDDY 无日K", detail: "新能源车等权少一只，板块跌幅可能略有偏差。" }
      ],
      watch: [
        { point: "光模块是否续强", check: "ANET 能否站稳 MA10；天孚、新易盛是否把 8/27 涨幅做成趋势而不是一日游。" },
        { point: "海光 / 龙芯的反弹质量", check: "海光 10 日仍约 −20% 量级，8/27 是超跌反抽还是均线修复。" },
        { point: "英伟达放量回调是否扩散", check: "若 NVDA 继续跌破更长均线，半导体内部轮动可能变成整体回撤。" },
        { point: "光伏映射是否修复", check: "需要 FSLR 不再落后、阳光电源止跌。" },
        { point: "创新药是否止跌", check: "礼来、诺和诺德连跌时，不要用「前三板块」掩盖这条空头主线。" }
      ],
      tickersOk: 49,
      tickersMiss: ["BYDDY"]
    }
  ];

  var byDate = {};
  DAYS.forEach(function (d) { byDate[d.usDate] = d; });

  function listDates() {
    return DAYS.map(function (d) { return d.usDate; });
  }

  function getDay(usDate) {
    return byDate[usDate] || null;
  }

  function latestDate() {
    return DAYS.length ? DAYS[0].usDate : null;
  }

  function hasBriefing(usDate) {
    return !!byDate[usDate];
  }

  return {
    DAYS: DAYS,
    META: META,
    listDates: listDates,
    getDay: getDay,
    latestDate: latestDate,
    hasBriefing: hasBriefing
  };
})();
