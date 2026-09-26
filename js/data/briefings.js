/* Daily US-close briefings. Loaded by index.html as a JS constant (no fetch). */
var DailyBriefings = (function () {
  var META = {
    timezone: "Asia/Shanghai",
    savedAt: "2026-09-26 10:45",
    latestUsDate: "2026-09-03",
    mdDir: "briefings",
    pageSnapshot: "archive/2026-09-26_1045.html"
  };

  var DAYS = [
    {
      usDate: "2026-09-03",
      generatedAt: "2026-09-26 10:42",
      savedAt: "2026-09-26 10:45",
      source: "腾讯财经日K · GICS板块 / 概念等权",
      mdPath: "briefings/2026-09-03.md",
      headline: "两维第一都是加密货币；GICS 第二是金融，概念第二才是软件回补",
      summary: "GICS 前三是加密货币 +11.08%、金融 +2.23%、信息技术 +1.72%。概念前三是加密货币、软件SaaS +3.98%、AI算力 +3.26%。软件和 AI 并进信息技术后被稀释。四只加密全红。SolarEdge 从 +4.59% 吐到 −0.53%。能源最弱 −0.83%。A 股 9/4 已收盘：四方精创 +14.58% 是同概念，东方财富只 +0.74%。",
      disclaimer: "技术摘要由日K推算，不是盘中逐笔。种子映射与行情不构成投资建议。A 股没有比特币现货或合规交易所对标。加密货币是非 GICS 增补板块，同时保留为概念标签。",
      stats: [
        { label: "加密货币（两维第一）", value: "+11.08%", tone: "up" },
        { label: "金融（GICS 第二）", value: "+2.23%", tone: "up" },
        { label: "软件SaaS（概念第二）", value: "+3.98%", tone: "up" },
        { label: "能源（最弱）", value: "−0.83%", tone: "down" }
      ],
      sectors: [
        { nameCn: "加密货币", changePct: 11.08, leader: "COIN +10.14%", topGainer: "MSTR +17.56%", note: "4 只全红，量能都过 1.3×" },
        { nameCn: "金融", changePct: 2.23, leader: "JPM +1.64%", topGainer: "GS +3.34%", note: "3 只全红，贝莱德仍跌破 MA10" },
        { nameCn: "信息技术", changePct: 1.72, leader: "NVDA +1.80%", topGainer: "PLTR +7.71%", note: "22 只，软件和 AI 被稀释" }
      ],
      top3: [
        {
          nameCn: "加密货币",
          changePct: 11.08,
          take: "四只全红、量能都过 1.3×。去掉 Strategy 仍约 +8.9%。映射全是同概念。",
          bullets: [
            "龙头 COIN Coinbase +10.14%，量能 1.38×，站上 MA10。资讯未匹配到 Coinbase 标题",
            "最高 MSTR Strategy +17.56%，量能 1.62×，站上 MA20。比特币财库杠杆，不是营运公司",
            "MARA +10.79%；IBIT +5.85%。资讯：比特币突破 8 万美元，没有个股标题"
          ]
        },
        {
          nameCn: "金融",
          changePct: 2.23,
          take: "GICS 第二名。概念榜上金融只排第四，因为软件和 AI 插在前面。三只全红。",
          bullets: [
            "龙头 JPM 摩根大通 +1.64%，量能 1.00×，站上 MA10、震荡",
            "最高 GS 高盛 +3.34%，量能 0.92×，站上 MA10。BLK +1.72% 仍跌破 MA10",
            "A 股 9/4 招商 +1.51%、兴业 +1.62%，券商更淡。同向但幅度小"
          ]
        },
        {
          nameCn: "信息技术",
          changePct: 1.72,
          take: "22 只等权把软件 +3.98% 和 AI +3.26% 稀释成第三。不要把 GICS 第三读成软件或算力主线。",
          bullets: [
            "龙头 NVDA 英伟达 +1.80%，量能 1.06×，MA5 上穿 MA20。资讯：约 130 亿美元收购 Hugging Face",
            "最高 PLTR Palantir +7.71%，量能 1.07×。昨天 −5.81%，没有匹配资讯",
            "AVGO −2.74%，量能 2.67×。博通放量收绿，半导体等权只有 +0.31%"
          ]
        }
      ],
      concepts: [
        { nameCn: "加密货币", changePct: 11.08, leader: "COIN +10.14%", topGainer: "MSTR +17.56%", note: "4 只全红" },
        { nameCn: "软件SaaS", changePct: 3.98, leader: "MSFT +2.68%", topGainer: "NOW +6.49%", note: "昨天最弱，五只全红反抽" },
        { nameCn: "AI算力", changePct: 3.26, leader: "NVDA +1.80%", topGainer: "PLTR +7.71%", note: "Palantir 翻昨天 −5.81%" },
        { nameCn: "金融", changePct: 2.23, leader: "JPM +1.64%", topGainer: "GS +3.34%", note: "三只全红" },
        { nameCn: "新能源车", changePct: 1.38, leader: "TSLA +5.42%", topGainer: "TSLA +5.42%", note: "龙头即最高，Lucid −2.34%" },
        { nameCn: "光伏储能", changePct: 1.36, leader: "FSLR +2.38%", topGainer: "FSLR +2.38%", note: "SolarEdge 回吐，第一名证伪" },
        { nameCn: "互联网科技", changePct: 0.94, leader: "AAPL +1.00%", topGainer: "META +3.01%", note: "Meta 续涨，奈飞平盘" },
        { nameCn: "半导体", changePct: 0.31, leader: "NVDA +1.80%", topGainer: "ARM +3.29%", note: "博通 −2.74% 放量" },
        { nameCn: "创新药", changePct: 0.12, leader: "LLY −0.04%", topGainer: "NVO +1.58%", note: "礼来第三夜平盘，Moderna 续跌" },
        { nameCn: "消费", changePct: 0.03, leader: "COST −0.33%", topGainer: "NKE +1.39%", note: "开市客续绿" },
        { nameCn: "能源", changePct: -0.83, leader: "XOM −1.18%", topGainer: "CVX −0.22%", note: "三只齐绿" }
      ],
      conceptTop3: [
        {
          nameCn: "加密货币",
          changePct: 11.08,
          take: "四只共振，不是单票。去掉 Strategy 仍约 +8.9%。资讯在比特币价格，不在个股。",
          bullets: [
            "龙头 COIN +10.14%，量能 1.38×，站上 MA10",
            "最高 MSTR +17.56%，量能 1.62×，站上 MA20",
            "MARA +10.79%；IBIT +5.85%。资讯：比特币突破 8 万美元"
          ]
        },
        {
          nameCn: "软件SaaS",
          changePct: 3.98,
          take: "昨天最弱今夜五只全红。这是修复，不是新主线。GICS 上看不见这个名次。",
          bullets: [
            "龙头 MSFT +2.68%，量能 1.03×。资讯是 2027 财年报告架构，不是产品",
            "最高 NOW +6.49%，量能 1.00×。昨天 −4.32%，没有匹配资讯",
            "ORCL +5.69% 续修 9/1 的 −5.23%。Snowflake 不在种子池"
          ]
        },
        {
          nameCn: "AI算力",
          changePct: 3.26,
          take: "主要是 Palantir 均值回归。去掉它，另外四只等权约 +2.15%，低于金融。",
          bullets: [
            "龙头 NVDA +1.80%，量能 1.06×。资讯：约 130 亿美元收购 Hugging Face",
            "最高 PLTR +7.71%，量能 1.07×。昨天 −5.81%，没有匹配资讯",
            "ANET +2.87% 量能 0.70× 仍跌破 MA10；寒武纪 9/4 −2.54%，对标没跟"
          ]
        }
      ],
      mappedA: [
        { sectorCn: "加密货币", us: "COIN +10.14%", role: "龙头", a: "东方财富 300059", relation: "同概念", dUsPct: 0.53, dReactPct: 0.74 },
        { sectorCn: "加密货币", us: "COIN +10.14%", role: "龙头", a: "同花顺 300033", relation: "同概念", dUsPct: 1.08, dReactPct: 1.14 },
        { sectorCn: "加密货币", us: "MSTR +17.56%", role: "涨幅最高", a: "东方财富 300059", relation: "同概念", dUsPct: 0.53, dReactPct: 0.74 },
        { sectorCn: "加密货币", us: "MSTR +17.56%", role: "涨幅最高", a: "御银股份 002177", relation: "同概念", dUsPct: -1.31, dReactPct: 1.66 },
        { sectorCn: "加密货币", us: "MARA +10.79%", role: "样本", a: "四方精创 300468", relation: "同概念", dUsPct: -1.76, dReactPct: 14.58 },
        { sectorCn: "加密货币", us: "MARA +10.79%", role: "样本", a: "飞天诚信 300386", relation: "同概念", dUsPct: -3.32, dReactPct: 2.7 },
        { sectorCn: "金融", us: "JPM +1.64%", role: "龙头", a: "招商银行 600036", relation: "对标", dUsPct: 0.49, dReactPct: 1.51 },
        { sectorCn: "金融", us: "JPM +1.64%", role: "龙头", a: "兴业银行 601166", relation: "对标", dUsPct: 0.17, dReactPct: 1.62 },
        { sectorCn: "金融", us: "GS +3.34%", role: "涨幅最高", a: "中信证券 600030", relation: "对标", dUsPct: 1.42, dReactPct: 0.47 },
        { sectorCn: "金融", us: "GS +3.34%", role: "涨幅最高", a: "华泰证券 601688", relation: "对标", dUsPct: 1.46, dReactPct: 0.31 },
        { sectorCn: "软件SaaS", us: "MSFT +2.68%", role: "龙头", a: "金山办公 688111", relation: "对标", dUsPct: 0.27, dReactPct: 1.65 },
        { sectorCn: "软件SaaS", us: "MSFT +2.68%", role: "龙头", a: "用友网络 600588", relation: "同概念", dUsPct: -1.49, dReactPct: 2.72 },
        { sectorCn: "软件SaaS", us: "NOW +6.49%", role: "涨幅最高", a: "泛微网络 603039", relation: "对标", dUsPct: -1.06, dReactPct: 0.79 },
        { sectorCn: "软件SaaS", us: "NOW +6.49%", role: "涨幅最高", a: "致远互联 688369", relation: "对标", dUsPct: -0.88, dReactPct: 0.79 },
        { sectorCn: "AI算力", us: "NVDA +1.80%", role: "龙头", a: "寒武纪 688256", relation: "对标", dUsPct: -0.72, dReactPct: -2.54 },
        { sectorCn: "AI算力", us: "NVDA +1.80%", role: "龙头", a: "海光信息 688041", relation: "对标", dUsPct: -0.41, dReactPct: -1.03 },
        { sectorCn: "AI算力", us: "PLTR +7.71%", role: "涨幅最高", a: "科大讯飞 002230", relation: "同概念", dUsPct: -0.56, dReactPct: 0.77 },
        { sectorCn: "AI算力", us: "PLTR +7.71%", role: "涨幅最高", a: "海康威视 002415", relation: "同概念", dUsPct: -0.57, dReactPct: -0.31 }
      ],
      logic: [
        "加密货币第一名是四只共振。等权 +11.08%，去掉 Strategy 仍约 +8.9%。资讯在比特币 8 万美元。反应日东方财富只 +0.74%；四方精创 +14.58% 是同概念，对着 Marathon，不是矿场对标。",
        "GICS 第二是金融，概念第二是软件修复。ServiceNow 从 −4.32% 到 +6.49%，量能 1.00×。泛微 / 致远 9/4 只 +0.79%。招商、兴业约 +1.5%。",
        "AI 第三名是 Palantir 翻昨天，不是收购主线。英伟达有 Hugging Face 标题却只 +1.80%。寒武纪 9/4 −2.54%、海光 −1.03%。",
        "昨天的光伏概念第一名隔夜证伪。SolarEdge −0.53%、量能 0.60×。能源三只齐绿，中国石油 9/4 −0.37%。"
      ],
      caveats: [
        { title: "加密货币映射全是同概念", detail: "A 股没有交易所或现货 ETF 对标。东方财富 9/4 只 +0.74%。" },
        { title: "四方精创不是矿场", detail: "+14.58% 对着 Marathon，关系是同概念。一天涨幅不能写成跟上比特币链。" },
        { title: "Strategy 是杠杆财库", detail: "+17.56% 放大比特币，不是营运改善。" },
        { title: "软件是修复不是启动", detail: "ServiceNow 量能 1.00×，昨天刚 −4.32%。Snowflake 不在种子池。" },
        { title: "Palantir 没有匹配资讯", detail: "+7.71% 对着昨天 −5.81%，更像均值回归。" },
        { title: "收购标题与涨幅不匹配", detail: "Hugging Face 约 130 亿美元，NVDA 只 +1.80%。寒武纪、海光 9/4 还在绿。" },
        { title: "去掉 Palantir，AI 掉出概念前三", detail: "另外四只等权约 +2.15%，低于金融 +2.23%。" },
        { title: "信息技术第三名被稀释", detail: "22 只等权 +1.72%。不要读成软件或 AI 主线。" },
        { title: "光伏第一名隔夜证伪", detail: "SEDG −0.53%、量能 0.60×。" },
        { title: "BYDDY 无日K", detail: "新能源车等权少一只，板块涨幅可能略有偏差。" }
      ],
      watch: [
        { point: "比特币能否守住 8 万", check: "四只共振。若隔夜吐回，第一名就是一日脉冲。" },
        { point: "四方精创能否离开一天", check: "9/4 已大涨，但是同概念。吐回就还是一日游。" },
        { point: "ServiceNow 能否守住 MA20", check: "量能持平的反抽。失守就把软件第二名写成修复结束。" },
        { point: "Palantir 能否守住 MA20", check: "没有资讯。再吐回，AI 第三名就不成立。" },
        { point: "英伟达收购是否定价完毕", check: "+1.80% 没有做成大阳。看寒武纪是否还绿。" },
        { point: "SolarEdge 是否继续弱", check: "已经证伪概念第一。若再破 MA20，光伏这条线关掉。" },
        { point: "原油能否止住最弱", check: "能源三只齐绿。中国石油 9/1 到 9/4 都没跟出趋势。" }
      ],
      tickersOk: 77,
      tickersMiss: ["BYDDY"]
    },
    {
      usDate: "2026-09-02",
      generatedAt: "2026-09-26 10:42",
      savedAt: "2026-09-26 10:45",
      source: "腾讯财经日K · GICS板块 / 概念等权",
      mdPath: "briefings/2026-09-02.md",
      headline: "GICS 第一是原材料小幅普涨，概念第一仍是光伏；Moderna 掉出前三",
      summary: "GICS 前三是原材料 +1.40%（纽蒙特 +2.06%，林德只 +0.14%）、通信服务 +1.13%、医疗保健 +0.98%。概念第一是光伏储能 +2.00%，主要靠 SolarEdge +4.59%、量能 0.70×。互联网第二 +1.30%，苹果平盘。创新药第三 +0.77% 换成诺和诺德，Moderna 从 +9.93% 吐到 −2.24%。能源掉出前三。",
      disclaimer: "技术摘要由日K推算，不是盘中逐笔。种子映射与行情不构成投资建议。光伏在 GICS 里归工业，点「板块」看不到概念第一。",
      stats: [
        { label: "原材料（GICS 第一）", value: "+1.40%", tone: "up" },
        { label: "光伏储能（概念第一）", value: "+2.00%", tone: "up" },
        { label: "互联网科技（概念第二）", value: "+1.30%", tone: "up" },
        { label: "软件SaaS（概念最弱）", value: "−0.94%", tone: "down" }
      ],
      sectors: [
        { nameCn: "原材料", changePct: 1.40, leader: "LIN +0.14%", topGainer: "NEM +2.06%", note: "3 只都红，林德量能 0.61×" },
        { nameCn: "通信服务", changePct: 1.13, leader: "GOOGL +0.63%", topGainer: "META +2.47%", note: "6 只，电信把 Meta / 奈飞稀释" },
        { nameCn: "医疗保健", changePct: 0.98, leader: "LLY +0.01%", topGainer: "NVO +3.66%", note: "7 只，Moderna −2.24% 被稀释" }
      ],
      top3: [
        {
          nameCn: "原材料",
          changePct: 1.40,
          take: "三只小红，不是林德脉冲。龙头弱于最高。不要和 9/1 旧稿的 +23.86% 连着读。",
          bullets: [
            "龙头 LIN 林德 +0.14%，量能 0.61×，站上 MA20、上升",
            "最高 NEM 纽蒙特 +2.06%，量能 0.76×，站上 MA20、回调；FCX +2.01%",
            "杭氧 9/3 +3.79% 对不上林德这只平盘。山东黄金反应日 −1.03%"
          ]
        },
        {
          nameCn: "通信服务",
          changePct: 1.13,
          take: "概念互联网是 +1.30%。GICS 把电信并进来后稀释。龙头谷歌不是涨幅最高。",
          bullets: [
            "龙头 GOOGL +0.63%，量能 1.01×，仍跌破 MA10",
            "最高 META +2.47%，量能 1.08×，MA5 上穿 MA20。资讯：发布更强 AI 模型",
            "NFLX +2.38%；DIS +1.66%；T / VZ 接近平盘"
          ]
        },
        {
          nameCn: "医疗保健",
          changePct: 0.98,
          take: "比概念创新药 +0.77% 略高，是保险和器械在红，把 Moderna 的拖累冲淡了。",
          bullets: [
            "龙头 LLY +0.01%，量能 0.95×，跌破 MA10。连续两夜平盘",
            "最高 NVO +3.66%，量能 1.20×，站上 MA10。没有匹配资讯",
            "MRNA −2.24%，量能 0.51×。昨天 +9.93% 的概念第一隔夜证伪"
          ]
        }
      ],
      concepts: [
        { nameCn: "光伏储能", changePct: 2.00, leader: "FSLR +1.48%", topGainer: "SEDG +4.59%", note: "3 只，最高量能 0.70×" },
        { nameCn: "互联网科技", changePct: 1.30, leader: "AAPL −0.05%", topGainer: "META +2.47%", note: "5 只含 DIS，苹果平盘" },
        { nameCn: "创新药", changePct: 0.77, leader: "LLY +0.01%", topGainer: "NVO +3.66%", note: "Moderna 回吐，诺和诺德换上来" },
        { nameCn: "半导体", changePct: 0.51, leader: "NVDA +3.21%", topGainer: "NVDA +3.21%", note: "龙头即最高，设备股仍弱" },
        { nameCn: "能源", changePct: 0.28, leader: "XOM −0.24%", topGainer: "COP +0.74%", note: "连续前三结束，龙头转绿" },
        { nameCn: "消费", changePct: 0.06, leader: "COST −1.22%", topGainer: "PG +0.98%", note: "开市客拖累" },
        { nameCn: "加密货币", changePct: 0.00, leader: "COIN −1.05%", topGainer: "MARA +2.35%", note: "昨日最弱之后持平" },
        { nameCn: "新能源车", changePct: -0.40, leader: "TSLA +0.26%", topGainer: "LCID +3.52%", note: "蔚来 −4.93%，量能 2.15×" },
        { nameCn: "金融", changePct: -0.44, leader: "JPM +0.36%", topGainer: "JPM +0.36%", note: "贝莱德 −1.86%" },
        { nameCn: "AI算力", changePct: -0.57, leader: "NVDA +3.21%", topGainer: "NVDA +3.21%", note: "Palantir −5.81% 把等权拉绿" },
        { nameCn: "软件SaaS", changePct: -0.94, leader: "MSFT −0.84%", topGainer: "ORCL +3.13%", note: "ServiceNow −4.32%；甲骨文反抽" }
      ],
      conceptTop3: [
        {
          nameCn: "光伏储能",
          changePct: 2.00,
          take: "三只样本加 SolarEdge。龙头仍跌破 MA10，最高量能偏低。GICS 工业只排第四。",
          bullets: [
            "龙头 FSLR +1.48%，量能 0.80×，跌破 MA10。没有个股标题",
            "最高 SEDG +4.59%，量能 0.70×，MA5 上穿 MA20。不是放量反转",
            "ENPH −0.06%。资讯是美国二季度储能装机创新高，不是个股"
          ]
        },
        {
          nameCn: "互联网科技",
          changePct: 1.30,
          take: "不是苹果续涨。AAPL −0.05%。样本含 DIS，等权高于旧的十一主题口径。",
          bullets: [
            "龙头 AAPL −0.05%，量能 0.85×，仍站上 MA20。人事标题没有做成第二日",
            "最高 META +2.47%，量能 1.08×。资讯：发布更强 AI 模型",
            "NFLX +2.38%；DIS +1.66%；AMZN +0.02% 仍跌破 MA10"
          ]
        },
        {
          nameCn: "创新药",
          changePct: 0.77,
          take: "换成诺和诺德，不是礼来，更不是昨天的 Moderna。",
          bullets: [
            "龙头 LLY +0.01%，量能 0.95×，跌破 MA10。连续两夜平盘",
            "最高 NVO +3.66%，量能 1.20×，站上 MA10。没有匹配资讯",
            "MRNA −2.24%，量能 0.51×。昨天 +9.93% 隔夜证伪"
          ]
        }
      ],
      mappedA: [
        { sectorCn: "原材料", us: "LIN +0.14%", role: "龙头", a: "杭氧股份 002430", relation: "对标", dUsPct: -0.86, dReactPct: 3.79 },
        { sectorCn: "原材料", us: "LIN +0.14%", role: "龙头", a: "万华化学 600309", relation: "同概念", dUsPct: -2.41, dReactPct: 2.96 },
        { sectorCn: "原材料", us: "NEM +2.06%", role: "涨幅最高", a: "山东黄金 600547", relation: "对标", dUsPct: 2.71, dReactPct: -1.03 },
        { sectorCn: "原材料", us: "NEM +2.06%", role: "涨幅最高", a: "中金黄金 600489", relation: "对标", dUsPct: -2.56, dReactPct: 4.01 },
        { sectorCn: "光伏储能", us: "FSLR +1.48%", role: "龙头", a: "隆基绿能 601012", relation: "对标", dUsPct: -2.65, dReactPct: -0.43 },
        { sectorCn: "光伏储能", us: "FSLR +1.48%", role: "龙头", a: "通威股份 600438", relation: "对标", dUsPct: -3.89, dReactPct: -0.7 },
        { sectorCn: "光伏储能", us: "SEDG +4.59%", role: "涨幅最高", a: "阳光电源 300274", relation: "对标", dUsPct: -3.3, dReactPct: 0.79 },
        { sectorCn: "光伏储能", us: "SEDG +4.59%", role: "涨幅最高", a: "锦浪科技 300763", relation: "对标", dUsPct: -2.77, dReactPct: 0.62 },
        { sectorCn: "互联网科技", us: "AAPL −0.05%", role: "龙头", a: "立讯精密 002475", relation: "供应链", dUsPct: 0.28, dReactPct: -1.59 },
        { sectorCn: "互联网科技", us: "AAPL −0.05%", role: "龙头", a: "歌尔股份 002241", relation: "供应链", dUsPct: 0.88, dReactPct: -1.49 },
        { sectorCn: "互联网科技", us: "META +2.47%", role: "涨幅最高", a: "昆仑万维 300418", relation: "同概念", dUsPct: -3.4, dReactPct: -0.27 },
        { sectorCn: "互联网科技", us: "META +2.47%", role: "涨幅最高", a: "掌趣科技 300315", relation: "同概念", dUsPct: -1.44, dReactPct: -2.2 },
        { sectorCn: "创新药", us: "LLY +0.01%", role: "龙头", a: "恒瑞医药 600276", relation: "对标", dUsPct: -1.43, dReactPct: 0.86 },
        { sectorCn: "创新药", us: "LLY +0.01%", role: "龙头", a: "百济神州 688235", relation: "对标", dUsPct: 0.57, dReactPct: 0.32 },
        { sectorCn: "创新药", us: "NVO +3.66%", role: "涨幅最高", a: "通化东宝 600867", relation: "对标", dUsPct: -1.58, dReactPct: -0.25 },
        { sectorCn: "创新药", us: "NVO +3.66%", role: "涨幅最高", a: "甘李药业 603087", relation: "对标", dUsPct: -2.07, dReactPct: 2.66 }
      ],
      logic: [
        "概念第一是光伏，GICS 第一不是。SolarEdge 贡献了大部分等权，量能 0.70×。A 股组件 9/3 仍绿，逆变器只是小红。",
        "GICS 原材料第一是三只小红。林德 +0.14%、量能 0.61×。杭氧 9/3 +3.79% 对不上这只平盘。",
        "互联网第二名是 Meta 模型，不是苹果人事续上。AAPL −0.05%。昆仑万维 9/3 仍 −0.27%，而且是同概念。",
        "创新药第三名证伪了昨天的 Moderna。沃森 9/2 −3.16%，9/3 只 +0.08%。诺和诺德没有匹配资讯。",
        "能源连续前三结束。XOM 转绿。中国石油 9/2、9/3 都绿，中国海油也没有跟。"
      ],
      caveats: [
        { title: "光伏样本只有 3 只", detail: "去掉 SEDG，First Solar / Enphase 等权接近 +0.7%。" },
        { title: "SolarEdge 量能只有 0.70×", detail: "MA5 上穿 MA20 但量能偏低，写成反转过早。" },
        { title: "光伏个股没有匹配资讯", detail: "标题只有储能装机，不能写成逆变器主线。" },
        { title: "杭氧大涨对不上林德", detail: "林德 +0.14%，杭氧 9/3 +3.79%。" },
        { title: "黄金两只 A 股方向相反", detail: "山东黄金 9/3 −1.03%，中金黄金 +4.01%。" },
        { title: "苹果龙头其实收绿", detail: "AAPL −0.05%。把互联网第二写成苹果链是角色错配。" },
        { title: "Meta 映射是同概念", detail: "昆仑万维 / 掌趣 9/3 仍绿。" },
        { title: "诺和诺德没有匹配资讯", detail: "+3.66% 不能写成减肥药回流。" },
        { title: "Moderna 第一名隔夜证伪", detail: "量能降到 0.51×。疫苗同概念没有接上。" },
        { title: "AI 被 Palantir 对冲", detail: "NVDA +3.21%，PLTR −5.81%，AI 等权仍绿。" },
        { title: "软件最高是反抽", detail: "ORCL +3.13% 对着昨天 −5.23%；ServiceNow −4.32%。" },
        { title: "BYDDY 无日K", detail: "新能源车等权少一只，板块涨幅可能略有偏差。" }
      ],
      watch: [
        { point: "SolarEdge 是否一日脉冲", check: "量能只有 0.70×。若隔夜吐回，光伏概念第一就不成立。" },
        { point: "A 股光伏能否离开绿", check: "9/3 组件仍绿。若再杀，就没有映射到对标股。" },
        { point: "诺和诺德能否守住 MA10", check: "没有匹配资讯。若隔夜吐回，创新药第三名就是单票。" },
        { point: "礼来是否仍不跟", check: "连续两夜平盘。收购标题没有做成股价。" },
        { point: "苹果是否守住 MA20", check: "人事第二日已平盘。" },
        { point: "英伟达 MA5 上穿 MA20", check: "量能 1.24×。Palantir −5.81% 不要写成算力回流。" },
        { point: "ServiceNow −4.32% 是否扩散", check: "软件最弱。甲骨文反抽不能写成 SaaS 回暖。" }
      ],
      tickersOk: 77,
      tickersMiss: ["BYDDY"]
    },
    {
      usDate: "2026-09-01",
      generatedAt: "2026-09-02 06:35",
      savedAt: "2026-09-26 10:45",
      source: "腾讯财经日K · GICS板块 / 概念等权",
      mdPath: "briefings/2026-09-01.md",
      headline: "GICS 第一是能源；概念第一仍是 Moderna。林德 +23.86% 来自断裂日K",
      summary: "连续日K上林德 9/1 是 −0.58%，原材料等权 −2.54%，不是旧稿的 +5.61%。GICS 前三改为能源 +2.47%、医疗保健 +1.83%、公用事业 +0.41%。概念前三仍是创新药 +2.58% / 能源 / 互联网科技 +0.06%。加密货币最弱 −4.78%。A 股 9/2 石油股续跌，加密同概念回吐。",
      disclaimer: "技术摘要由日K推算，不是盘中逐笔。种子映射与行情不构成投资建议。usLIN.N 日K从 2023 跳到最新一根，旧稿的林德涨幅已作废。加密货币是非 GICS 增补板块，同时保留为概念标签。",
      stats: [
        { label: "能源（GICS 第一）", value: "+2.47%", tone: "up" },
        { label: "创新药（概念第一）", value: "+2.58%", tone: "up" },
        { label: "医疗保健（GICS 第二）", value: "+1.83%", tone: "up" },
        { label: "加密货币（最弱）", value: "−4.78%", tone: "down" }
      ],
      sectors: [
        { nameCn: "能源", changePct: 2.47, leader: "XOM +2.24%", topGainer: "COP +2.79%", note: "3 只全红，连续两日前三" },
        { nameCn: "医疗保健", changePct: 1.83, leader: "LLY +0.28%", topGainer: "MRNA +9.93%", note: "7 只样本，Moderna 被保险/器械稀释" },
        { nameCn: "公用事业", changePct: 0.41, leader: "NEE +0.72%", topGainer: "NEE +0.72%", note: "3 只小红，仍跌破 MA10" }
      ],
      top3: [
        {
          nameCn: "能源",
          changePct: 2.47,
          take: "GICS 第一、概念第二，同一组石油股。三只全红，趋势仍标震荡。样本只有 3 只，等权就是油价。",
          bullets: [
            "龙头 XOM 埃克森美孚 +2.24%，量能 0.81×，站上 MA10、震荡",
            "最高 COP 康菲石油 +2.79%，量能 0.92×；CVX +2.38%",
            "资讯：WTI 突破 90 美元、美伊敌对升级。中国石油 9/2 −1.52%，没有接上"
          ]
        },
        {
          nameCn: "医疗保健",
          changePct: 1.83,
          take: "GICS 第二。创新药概念是 +2.58%，并进保险/器械后被稀释。龙头仍是礼来，最高仍是 Moderna。",
          bullets: [
            "龙头 LLY 礼来 +0.28%，量能 0.91×，跌破 MA10。资讯：现金收购 Merida",
            "最高 MRNA Moderna +9.93%，量能 0.80×，站上 MA10。没有匹配到 Moderna 标题",
            "点日榜「概念」才是四只样本的 +2.58%"
          ]
        },
        {
          nameCn: "公用事业",
          changePct: 0.41,
          take: "第三名是跌得少，不是电力主线。三只都小红，仍跌破 MA10。龙头即最高。",
          bullets: [
            "龙头即最高 NEE 新纪元能源 +0.72%，量能 1.06×，跌破 MA10、回调",
            "DUK +0.40%；SO +0.10%",
            "长江电力 9/2 +1.13%，龙源电力 −0.99%。不要写成公用事业映射"
          ]
        }
      ],
      concepts: [
        { nameCn: "创新药", changePct: 2.58, leader: "LLY +0.28%", topGainer: "MRNA +9.93%", note: "4 只样本，等权被 Moderna 单票拉起" },
        { nameCn: "能源", changePct: 2.47, leader: "XOM +2.24%", topGainer: "COP +2.79%", note: "3 只全红，连续两日前三" },
        { nameCn: "互联网科技", changePct: 0.06, leader: "AAPL +2.61%", topGainer: "AAPL +2.61%", note: "5 只样本含 DIS，苹果单票，亚马逊续跌" },
        { nameCn: "消费", changePct: -0.94, leader: "COST −0.42%", topGainer: "PG +0.75%", note: "龙头与最高未变，等权较旧稿下修" },
        { nameCn: "光伏储能", changePct: -0.88, leader: "FSLR −1.11%", topGainer: "SEDG +0.90%", note: "趋势仍回调" },
        { nameCn: "金融", changePct: -1.65, leader: "JPM −0.30%", topGainer: "JPM −0.30%", note: "三只齐绿" },
        { nameCn: "半导体", changePct: -1.94, leader: "NVDA −1.51%", topGainer: "AVGO −0.18%", note: "13 只全绿，设备股更弱" },
        { nameCn: "AI算力", changePct: -2.22, leader: "NVDA −1.51%", topGainer: "GOOGL −1.28%", note: "五只齐绿" },
        { nameCn: "软件SaaS", changePct: -2.40, leader: "MSFT −1.24%", topGainer: "CRM +0.22%", note: "甲骨文 −5.23%" },
        { nameCn: "新能源车", changePct: -3.19, leader: "TSLA −3.22%", topGainer: "GM −0.80%", note: "特斯拉回吐周一" },
        { nameCn: "加密货币", changePct: -4.78, leader: "COIN −6.01%", topGainer: "IBIT −2.04%", note: "昨日第一变最弱" }
      ],
      conceptTop3: [
        {
          nameCn: "创新药",
          changePct: 2.58,
          take: "等权第一是 Moderna 单票，不是礼来、也不是肥胖症叙事。四只里两红两绿。",
          bullets: [
            "龙头 LLY 礼来 +0.28%，量能 0.91×，跌破 MA10。资讯：收购 Merida",
            "最高 MRNA +9.93%，量能 0.80×，站上 MA10。没有匹配资讯",
            "VRTX +0.57%；NVO −0.46%。去掉 Moderna，其余三只等权接近 0"
          ]
        },
        {
          nameCn: "能源",
          changePct: 2.47,
          take: "概念第二、GICS 第一。三只石油股全红。A 股 9/2 没有接上。",
          bullets: [
            "龙头 XOM +2.24%，量能 0.81×，站上 MA10",
            "最高 COP +2.79%，量能 0.92×；CVX +2.38%",
            "中国石油 9/2 −1.52%，中国海油 −2.14%"
          ]
        },
        {
          nameCn: "互联网科技",
          changePct: 0.06,
          take: "第三名几乎是苹果一只。加入 DIS 后等权从旧口径 +0.38% 淡到 +0.06%。",
          bullets: [
            "龙头即最高 AAPL +2.61%，量能 1.31×，站上 MA20。资讯：库克卸任 CEO",
            "META +1.08%，MA5 上穿 MA20",
            "NFLX −0.30%；AMZN −1.87% 跌破 MA10"
          ]
        }
      ],
      mappedA: [
        { sectorCn: "公用事业", us: "NEE +0.72%", role: "龙头", a: "长江电力 600900", relation: "对标", dUsPct: 1.1, dReactPct: 1.13 },
        { sectorCn: "公用事业", us: "NEE +0.72%", role: "龙头", a: "龙源电力 001289", relation: "同概念", dUsPct: 0.33, dReactPct: -0.99 },
        { sectorCn: "创新药", us: "LLY +0.28%", role: "龙头", a: "恒瑞医药 600276", relation: "对标", dUsPct: 0.35, dReactPct: -1.43 },
        { sectorCn: "创新药", us: "LLY +0.28%", role: "龙头", a: "百济神州 688235", relation: "对标", dUsPct: -1.17, dReactPct: 0.57 },
        { sectorCn: "创新药", us: "MRNA +9.93%", role: "涨幅最高", a: "沃森生物 300142", relation: "同概念", dUsPct: 0.22, dReactPct: -3.16 },
        { sectorCn: "创新药", us: "MRNA +9.93%", role: "涨幅最高", a: "康泰生物 300601", relation: "同概念", dUsPct: 1.89, dReactPct: 0.15 },
        { sectorCn: "能源", us: "XOM +2.24%", role: "龙头", a: "中国石油 601857", relation: "对标", dUsPct: 0.09, dReactPct: -1.52 },
        { sectorCn: "能源", us: "XOM +2.24%", role: "龙头", a: "中国海油 600938", relation: "对标", dUsPct: -0.58, dReactPct: -2.14 },
        { sectorCn: "能源", us: "COP +2.79%", role: "涨幅最高", a: "中国海油 600938", relation: "对标", dUsPct: -0.58, dReactPct: -2.14 },
        { sectorCn: "互联网科技", us: "AAPL +2.61%", role: "龙头", a: "立讯精密 002475", relation: "供应链", dUsPct: -1.21, dReactPct: 0.28 },
        { sectorCn: "互联网科技", us: "AAPL +2.61%", role: "龙头", a: "歌尔股份 002241", relation: "供应链", dUsPct: -1.32, dReactPct: 0.88 }
      ],
      logic: [
        "GICS 第一是能源，不是原材料。旧稿林德 +23.86% 来自断裂的 usLIN.N。连续日K上原材料等权 −2.54%。概念第一仍是创新药 +2.58%。",
        "创新药第一名是 Moderna 单票，不是礼来收购。四只等权 +2.58%。GICS 医疗保健是 +1.83%。沃森 9/2 −3.16%，没有跟上。",
        "能源是油价，连续第二天。中国石油 9/1 平盘、9/2 −1.52%，中国海油 9/2 −2.14%。映射不是传导。",
        "互联网第三名是苹果人事。AAPL +2.61%。亚马逊续跌。半导体 13 只全绿。",
        "昨天加密货币第一名隔夜证伪。9/2 飞天诚信 −1.63%、四方精创 −0.45%，一日游成立。"
      ],
      caveats: [
        { title: "旧稿原材料第一不成立", detail: "usLIN.N 没有 9/1 的连续日K。林德实际 −0.58%。" },
        { title: "公用事业第三是跌得少", detail: "等权只有 +0.41%，三只仍跌破 MA10。" },
        { title: "创新药样本只有 4 只", detail: "等权第一主要靠 MRNA +9.93%；去掉它接近持平。" },
        { title: "Moderna 没有匹配资讯", detail: "+9.93% 的原因不明，不能写成疫苗主线。" },
        { title: "礼来收购不等于板块上涨", detail: "龙头几乎平盘、跌破 MA10。" },
        { title: "疫苗映射是同概念", detail: "沃森 9/2 −3.16%，康泰只 +0.15%。" },
        { title: "能源样本只有 3 只", detail: "等权第一就是油价。" },
        { title: "A 股石油股连续没跟", detail: "9/1 平盘、9/2 续跌。" },
        { title: "加密货币没有 A 股对标", detail: "9/1 概念股大涨、9/2 回吐，都不是跟上 Coinbase。" },
        { title: "BYDDY 无日K", detail: "新能源车等权少一只，板块涨幅可能略有偏差。" }
      ],
      watch: [
        { point: "不要沿用林德 +23.86%", check: "当日连续日K已是 −0.58%。看后面原材料是否仍不在 GICS 前三。" },
        { point: "Moderna 是否一日脉冲", check: "量能只有 0.80×。若隔夜吐回 MA10 下方，创新药第一名就不成立。" },
        { point: "礼来收购是否补涨", check: "标题在、股价平。若后续仍不红，收购不是隔夜主线。" },
        { point: "WTI 能否守住 90", check: "中国石油 9/1、9/2 都没跟。" },
        { point: "苹果人事是否一日游", check: "看 AAPL 是否守住 MA20。" },
        { point: "加密概念是否只是一日游", check: "9/2 飞天、四方已经回吐。" },
        { point: "甲骨文 −5.23% 是否扩散", check: "软件里只有 Salesforce 小红。" }
      ],
      tickersOk: 77,
      tickersMiss: ["BYDDY"]
    },
    {
      usDate: "2026-08-31",
      generatedAt: "2026-09-01 06:36",
      savedAt: "2026-09-01 12:52",
      source: "腾讯财经日K · GICS板块 / 概念等权",
      mdPath: "briefings/2026-08-31.md",
      headline: "隔夜主线是加密货币：GICS 与概念前两名相同，第三名被信息技术稀释",
      summary: "GICS+增补板块等权第一仍是加密货币 +3.10%，能源第二 +2.16%。第三名变成信息技术 +0.36%——半导体、软件、AI 并在一起被稀释了。概念维度第三仍是半导体 +0.55%。A 股 9/1 已收盘：飞天诚信 / 四方精创大涨但是同概念；中国石油平盘，没有兑现布伦特破 90。",
      disclaimer: "技术摘要由日K推算，不是盘中逐笔。种子映射与行情不构成投资建议。A 股没有比特币现货或合规交易所对标。加密货币是非 GICS 增补板块，同时保留为概念标签。",
      stats: [
        { label: "加密货币（板块/概念第一）", value: "+3.10%", tone: "up" },
        { label: "能源（第二）", value: "+2.16%", tone: "up" },
        { label: "信息技术（GICS 第三）", value: "+0.36%", tone: "up" },
        { label: "半导体（概念第三）", value: "+0.55%", tone: "up" }
      ],
      sectors: [
        { nameCn: "加密货币", changePct: 3.10, leader: "COIN +5.31%", topGainer: "COIN +5.31%", note: "非 GICS 增补，4 只样本，龙头即最高" },
        { nameCn: "能源", changePct: 2.16, leader: "XOM +2.71%", topGainer: "XOM +2.71%", note: "GICS 能源，3 只石油股" },
        { nameCn: "信息技术", changePct: 0.36, leader: "NVDA +1.48%", topGainer: "QCOM +3.83%", note: "22 只样本，半导体+软件+硬件合并后第三" }
      ],
      top3: [
        {
          nameCn: "加密货币",
          changePct: 3.10,
          take: "GICS 没有这一级。作为增补板块，8 月收官的风险偏好仍在比特币链上。四只全红，龙头即最高。",
          bullets: [
            "龙头即最高 COIN Coinbase +5.31%，量能 1.12×，站上 MA20、上升",
            "MSTR Strategy +4.42%。资讯：Strategy 时隔两月重启买币，上周购入约 3.7 亿美元 BTC",
            "IBIT +1.75%；MARA +0.94%。等权第一是交易平台 + 比特币财库，不是矿企单票"
          ]
        },
        {
          nameCn: "能源",
          changePct: 2.16,
          take: "GICS 能源与概念能源同一组石油股。三只全红，龙头即最高。资讯写能源是标普500唯一收涨行业，那是不含加密货币的口径。",
          bullets: [
            "龙头即最高 XOM 埃克森美孚 +2.71%，量能 1.29×，站上 MA5、震荡",
            "CVX +2.12%，量能 1.51×；COP +1.64%。布伦特破 90",
            "样本只有 3 只，等权第二就是油价，不是风格切换"
          ]
        },
        {
          nameCn: "信息技术",
          changePct: 0.36,
          take: "GICS 把半导体、软件、AI 算力并进信息技术，等权只有 +0.36%。概念里半导体单独还能排第三（+0.55%），合并后被软件/硬件稀释。",
          bullets: [
            "龙头 NVDA 英伟达 +1.48%，量能 0.97×，站上 MA10、震荡",
            "最高 QCOM 高通 +3.83%，量能 1.32×，MA5 上穿 MA20",
            "不要把 GICS 第三直接读成半导体主线；点日榜「概念」才看得到 +0.55% 的半导体"
          ]
        }
      ],
      concepts: [
        { nameCn: "加密货币", changePct: 3.10, leader: "COIN +5.31%", topGainer: "COIN +5.31%", note: "4 只样本，龙头即最高" },
        { nameCn: "能源", changePct: 2.16, leader: "XOM +2.71%", topGainer: "XOM +2.71%", note: "3 只样本，龙头即最高" },
        { nameCn: "半导体", changePct: 0.55, leader: "NVDA +1.48%", topGainer: "QCOM +3.83%", note: "13 只样本，设备股仍绿" },
        { nameCn: "软件SaaS", changePct: 0.19, leader: "MSFT −1.22%", topGainer: "NOW +2.27%", note: "5 只样本，龙头收绿" },
        { nameCn: "AI算力", changePct: 0.03, leader: "NVDA +1.48%", topGainer: "NVDA +1.48%", note: "龙头即最高，谷歌 −2.09%" },
        { nameCn: "创新药", changePct: 0.02, leader: "LLY −1.52%", topGainer: "MRNA +1.70%", note: "龙头弱于 Moderna" },
        { nameCn: "光伏储能", changePct: -0.32, leader: "FSLR −1.25%", topGainer: "SEDG +2.52%", note: "三只分化，趋势仍回调" },
        { nameCn: "新能源车", changePct: -0.39, leader: "TSLA +5.51%", topGainer: "TSLA +5.51%", note: "特斯拉单票，蔚来/Lucid 拖累" },
        { nameCn: "消费", changePct: -0.43, leader: "COST −0.17%", topGainer: "PG +0.93%", note: "耐克回吐周五" },
        { nameCn: "金融", changePct: -0.66, leader: "JPM −0.45%", topGainer: "JPM −0.45%", note: "三只齐绿" },
        { nameCn: "互联网科技", changePct: -1.3, leader: "AAPL −0.89%", topGainer: "NFLX −0.82%", note: "4 只全绿，亚马逊 −2.50%" }
      ],
      conceptTop3: [
        {
          nameCn: "加密货币",
          changePct: 3.10,
          take: "8 月收官的风险偏好在比特币链上。四只全红，龙头即最高，趋势标上升。",
          bullets: [
            "龙头即最高 COIN Coinbase +5.31%，量能 1.12×，站上 MA20、上升",
            "MSTR Strategy +4.42%。资讯：Strategy 时隔两月重启买币，上周购入约 3.7 亿美元 BTC",
            "IBIT +1.75%；MARA +0.94%。等权第一是交易平台 + 比特币财库，不是矿企单票"
          ]
        },
        {
          nameCn: "能源",
          changePct: 2.16,
          take: "三只石油股全红，龙头即最高，趋势仍标震荡。资讯写能源是标普500唯一收涨行业，那是 GICS 口径。",
          bullets: [
            "龙头即最高 XOM 埃克森美孚 +2.71%，量能 1.29×，站上 MA5、震荡",
            "CVX +2.12%，量能 1.51×；COP +1.64%。布伦特破 90",
            "样本只有 3 只，等权第二就是油价，不是风格切换"
          ]
        },
        {
          nameCn: "半导体",
          changePct: 0.55,
          take: "周五 −3.56% 之后的弱反抽。领涨的是高通，不是设备股，也不是再来一脚英伟达。",
          bullets: [
            "龙头 NVDA 英伟达 +1.48%，量能 0.97×，站上 MA10、震荡",
            "最高 QCOM 高通 +3.83%，量能 1.32×，MA5 上穿 MA20、震荡",
            "MU +2.77%；设备股 AMAT / LRCX / KLAC 小跌，迈威尔 −2.29%。13 只里大约一半红"
          ]
        }
      ],
      mappedA: [
        { sectorCn: "加密货币", us: "COIN +5.31%", role: "龙头", a: "东方财富 300059", relation: "同概念", dUsPct: -0.15, dReactPct: 0.72 },
        { sectorCn: "加密货币", us: "COIN +5.31%", role: "龙头", a: "同花顺 300033", relation: "同概念", dUsPct: -0.56, dReactPct: -0.08 },
        { sectorCn: "加密货币", us: "MSTR +4.42%", role: "样本", a: "御银股份 002177", relation: "同概念", dUsPct: -1.66, dReactPct: 4.04 },
        { sectorCn: "加密货币", us: "MARA +0.94%", role: "样本", a: "四方精创 300468", relation: "同概念", dUsPct: -2.5, dReactPct: 7.01 },
        { sectorCn: "加密货币", us: "MARA +0.94%", role: "样本", a: "飞天诚信 300386", relation: "同概念", dUsPct: -2.7, dReactPct: 8.85 },
        { sectorCn: "能源", us: "XOM +2.71%", role: "龙头", a: "中国石油 601857", relation: "对标", dUsPct: 1.69, dReactPct: 0 },
        { sectorCn: "能源", us: "XOM +2.71%", role: "龙头", a: "中国海油 600938", relation: "对标", dUsPct: 1.52, dReactPct: 0.29 },
        { sectorCn: "半导体", us: "QCOM +3.83%", role: "涨幅最高", a: "卓胜微 300782", relation: "供应链", dUsPct: 2.05, dReactPct: -3.75 },
        { sectorCn: "半导体", us: "QCOM +3.83%", role: "涨幅最高", a: "汇顶科技 603160", relation: "同概念", dUsPct: 5.97, dReactPct: -0.52 },
        { sectorCn: "半导体", us: "NVDA +1.48%", role: "龙头", a: "寒武纪 688256", relation: "对标", dUsPct: 6.26, dReactPct: 0.82 },
        { sectorCn: "半导体", us: "NVDA +1.48%", role: "龙头", a: "海光信息 688041", relation: "对标", dUsPct: 3.43, dReactPct: -1.32 }
      ],
      logic: [
        "GICS 信息技术第三（+0.36%）不等于半导体主线。概念维度半导体仍是 +0.55%；把芯片、软件、AI 服务器放进同一级，等权会被稀释。",
        "种子表漏加密货币时，隔夜主线会被写成原油。补上 COIN / MSTR / MARA / IBIT 之后，等权第一是 +3.10%，压过能源 +2.16%。标普「唯一收涨行业」是不含加密货币的 GICS 口径。",
        "加密货币第一名传不到 A 股交易所对标。东方财富 9/1 只 +0.72%，同花顺平盘。真正大涨的是飞天诚信 +8.85%、四方精创 +7.01%——全是同概念，不是 Coinbase。",
        "能源第二名也没有在 9/1 兑现。中国石油平盘、中国海油 +0.29%。8/31 白天那一列对应更早的美股日。布伦特破 90 的隔夜脉冲，A 股石油股当天没接。",
        "半导体反抽修的是周五，9/1 还往回吐。NVDA +1.48% 量能回到均量附近。卓胜微 9/1 −3.75%，海光 −1.32%。8/31 国产算力大涨是对着周五英伟达回吐，映射当天已经反向。"
      ],
      caveats: [
        { title: "加密货币没有 A 股对标", detail: "映射全是同概念。把飞天诚信、四方精创的 9/1 大涨写成跟上 Coinbase，是概念股，不是交易所或矿企。" },
        { title: "加密货币样本只有 4 只", detail: "等权第一主要靠 COIN / MSTR；MARA 只 +0.94%。不是全产业链普涨。" },
        { title: "能源样本只有 3 只", detail: "等权第二就是油价，不能当成板块轮动或避险风格。" },
        { title: "标普行业口径 ≠ 种子板块", detail: "资讯写能源是唯一收涨行业，是因为比特币相关不在 GICS 能源里。" },
        { title: "8/31 国产算力已经跟周五反向", detail: "寒武纪、海光在美股英伟达 −4.57% 的反应日大涨。种子映射不是传导。" },
        { title: "互联网「最高」其实是跌得最少", detail: "NFLX −0.82% 只是四只里最不绿的；亚马逊 −2.50% 才是周五轮动的回吐。" },
        { title: "特斯拉单票不等于新能源车", detail: "TSLA +5.51%，但蔚来、Lucid 收跌，板块等权仍绿。" },
        { title: "NVDA 同时是 AI 与半导体龙头", detail: "AI算力等权只有 +0.03%，谷歌 −2.09%。" },
        { title: "BYDDY 无日K", detail: "新能源车等权少一只，板块涨幅可能略有偏差。" }
      ],
      watch: [
        { point: "Strategy / Coinbase 能否续", check: "若买币新闻是一日脉冲，加密货币第一名就不会隔夜再排第一。看 COIN 是否守住 MA20。" },
        { point: "A 股加密概念是否一日游", check: "飞天诚信、四方精创 9/1 大涨后，若隔日高开低走，说明只是同概念炒作。" },
        { point: "原油能否守住 90", check: "若布伦特回落，能源第二名就是一日油价脉冲；中国石油 9/1 已经没跟。" },
        { point: "英伟达反抽质量", check: "NVDA 量能已回到均量附近；若再跌破 MA10，周五回吐就还没修完。" },
        { point: "寒武纪 / 海光 / 卓胜微", check: "9/1 已经走弱或回吐。后面若美股半导体再红，不要默认国产算力跟。" },
        { point: "亚马逊回吐是否确认一日游", check: "AMZN 从 +3.97% 变成 −2.50%，重新跌破 MA10。" },
        { point: "特斯拉是否扩散", check: "TSLA +5.51% 若只是单票，不要把新能源车写成隔夜主线。" },
        { point: "光伏是否止跌", check: "阳光电源 8/31 再跌 6.34%，美股 FSLR / ENPH 继续回调。" }
      ],
      tickersOk: 53,
      tickersMiss: ["BYDDY"]
    },
    {
      usDate: "2026-08-28",
      generatedAt: "2026-08-31 06:37",
      savedAt: "2026-08-31 06:37",
      source: "腾讯财经日K · GICS板块 / 概念等权",
      mdPath: "briefings/2026-08-28.md",
      headline: "隔夜主线是七巨头轮动与英伟达回吐，不是全面风险偏好",
      summary: "GICS 板块第一是通信服务 +1.69%（奈飞 / 谷歌），不是互联网科技概念。概念维度仍是互联网科技 +2.07%、软件SaaS +1.58%、消费 +1.24%。英伟达 −4.57% 拖累信息技术。A 股 8/31 反应日尚未开盘，不编造涨跌。",
      disclaimer: "技术摘要由日K推算，不是盘中逐笔。种子映射与行情不构成投资建议。概念表沿用当时主题口径；GICS 表按 v0.1.21 重算。",
      stats: [
        { label: "通信服务（GICS 第一）", value: "+1.69%", tone: "up" },
        { label: "互联网科技（概念第一）", value: "+2.07%", tone: "up" },
        { label: "软件SaaS（概念第二）", value: "+1.58%", tone: "up" },
        { label: "光伏储能（概念最弱）", value: "−4.68%", tone: "down" }
      ],
      sectors: [
        { nameCn: "通信服务", changePct: 1.69, leader: "GOOGL +1.74%", topGainer: "NFLX +2.35%", note: "GICS，含电信与媒体" },
        { nameCn: "必需消费", changePct: 0.81, leader: "COST +1.16%", topGainer: "COST +1.16%", note: "GICS 必选，龙头即最高" },
        { nameCn: "能源", changePct: 0.62, leader: "XOM +0.17%", topGainer: "CVX +1.05%", note: "3 只石油股小幅收红" }
      ],
      top3: [
        {
          nameCn: "通信服务",
          changePct: 1.69,
          take: "GICS 把谷歌、Meta、奈飞和电信运营商放在一起。当天领涨的是奈飞，不是苹果链。",
          bullets: [
            "龙头 GOOGL 谷歌 +1.74%，量能大致持平，仍在 MA20 下",
            "最高 NFLX 奈飞 +2.35%，站上 MA20、上升",
            "概念「互联网科技」还含苹果和亚马逊，等权更高（+2.07%）"
          ]
        },
        {
          nameCn: "必需消费",
          changePct: 0.81,
          take: "GICS 拆出必选消费后，开市客单独把这一级抬到第二。不能外推成可选消费。",
          bullets: [
            "龙头即最高 COST 开市客 +1.16%",
            "这是防御型消费，不是耐克那条可选消费腿",
            "概念「消费」把必选和可选混在一起，当天 +1.24%"
          ]
        },
        {
          nameCn: "能源",
          changePct: 0.62,
          take: "石油股小幅收红，远弱于通信和概念里的互联网科技。",
          bullets: [
            "龙头 XOM +0.17%；最高 CVX +1.05%",
            "不是油价主线日",
            "GICS 与概念能源样本相同"
          ]
        }
      ],
      concepts: [
        { nameCn: "互联网科技", changePct: 2.29, leader: "AAPL +1.63%", topGainer: "AMZN +3.97%", note: "4 只样本，AMZN 仍在 MA20 下" },
        { nameCn: "软件SaaS", changePct: 1.58, leader: "MSFT +1.68%", topGainer: "NOW +4.54%", note: "5 只样本，CRM 高位消化" },
        { nameCn: "消费", changePct: 1.32, leader: "COST +1.16%", topGainer: "NKE +3.02%", note: "4 只样本，趋势仍回调" },
        { nameCn: "能源", changePct: 0.62, leader: "XOM +0.17%", topGainer: "CVX +1.05%", note: "3 只样本，小幅收红" },
        { nameCn: "金融", changePct: 0.01, leader: "JPM +0.96%", topGainer: "JPM +0.96%", note: "龙头即最高，近乎持平" },
        { nameCn: "新能源车", changePct: -0.92, leader: "TSLA −1.71%", topGainer: "XPEV +1.77%", note: "BYDDY 无日K，RIVN −4.35%" },
        { nameCn: "创新药", changePct: -1.49, leader: "LLY −0.13%", topGainer: "LLY −0.13%", note: "龙头即最高，四只齐绿" },
        { nameCn: "AI算力", changePct: -1.81, leader: "NVDA −4.57%", topGainer: "GOOGL +1.74%", note: "英伟达回吐拖累等权" },
        { nameCn: "半导体", changePct: -3.56, leader: "NVDA −4.57%", topGainer: "MU −0.27%", note: "13 只样本，MRVL −10.28%" },
        { nameCn: "光伏储能", changePct: -4.68, leader: "FSLR −2.68%", topGainer: "FSLR −2.68%", note: "三只齐跌，趋势回调" }
      ],
      conceptTop3: [
        {
          nameCn: "互联网科技",
          changePct: 2.29,
          take: "七巨头内部换人。龙头苹果跟涨，亚马逊从均线下方反抽，趋势仍标回调。",
          bullets: [
            "龙头 AAPL 苹果 +1.63%，量能 0.90×，站上 MA20、上升",
            "最高 AMZN 亚马逊 +3.97%，量能 1.30×，跌破 MA20、回调",
            "NFLX +2.35% 趋势上升；META +1.21%。四只全红，但样本只有 4 只"
          ]
        },
        {
          nameCn: "软件SaaS",
          changePct: 1.58,
          take: "昨天被 Salesforce 单票抬上去的板块，今天变成更均匀的跟涨，幅度小得多。",
          bullets: [
            "龙头 MSFT 微软 +1.68%，量能 1.02×，MA5 上穿 MA20、震荡",
            "最高 NOW ServiceNow +4.54%，量能 1.59×，站上 MA20、上升",
            "CRM +1.57%，量能仍 2.25×；ADBE +0.82%；ORCL −0.72%。五只里四只收红"
          ]
        },
        {
          nameCn: "消费",
          changePct: 1.32,
          take: "从昨天等权 −1.26% 的防守下跌里反抽，均线位置没有修好。",
          bullets: [
            "龙头 COST 开市客 +1.16%，量能 0.80×，跌破 MA10、回调",
            "最高 NKE 耐克 +3.02%，量能大致持平，仍跌破 MA10、回调",
            "KO +0.67%；PG +0.45%。四只全红，但都不是趋势启动"
          ]
        }
      ],
      mappedA: [
        { sectorCn: "互联网科技", us: "AMZN +3.97%", role: "涨幅最高", a: "焦点科技 002315", relation: "同概念", dUsPct: 0.47, dReactPct: null },
        { sectorCn: "互联网科技", us: "AMZN +3.97%", role: "涨幅最高", a: "浪潮信息 000977", relation: "供应链", dUsPct: -1.06, dReactPct: null },
        { sectorCn: "互联网科技", us: "AAPL +1.63%", role: "龙头", a: "立讯精密 002475", relation: "供应链", dUsPct: -1.01, dReactPct: null },
        { sectorCn: "互联网科技", us: "AAPL +1.63%", role: "龙头", a: "歌尔股份 002241", relation: "供应链", dUsPct: -1.59, dReactPct: null },
        { sectorCn: "软件SaaS", us: "NOW +4.54%", role: "涨幅最高", a: "泛微网络 603039", relation: "对标", dUsPct: 1.84, dReactPct: null },
        { sectorCn: "软件SaaS", us: "NOW +4.54%", role: "涨幅最高", a: "致远互联 688369", relation: "对标", dUsPct: 1.01, dReactPct: null },
        { sectorCn: "软件SaaS", us: "MSFT +1.68%", role: "龙头", a: "金山办公 688111", relation: "对标", dUsPct: 1.29, dReactPct: null },
        { sectorCn: "软件SaaS", us: "MSFT +1.68%", role: "龙头", a: "用友网络 600588", relation: "同概念", dUsPct: 0.69, dReactPct: null },
        { sectorCn: "消费", us: "NKE +3.02%", role: "涨幅最高", a: "华利集团 300979", relation: "供应链", dUsPct: -0.06, dReactPct: null },
        { sectorCn: "消费", us: "NKE +3.02%", role: "涨幅最高", a: "探路者 300005", relation: "同概念", dUsPct: 7.04, dReactPct: null },
        { sectorCn: "消费", us: "COST +1.16%", role: "龙头", a: "永辉超市 601933", relation: "同概念", dUsPct: 0.64, dReactPct: null },
        { sectorCn: "消费", us: "COST +1.16%", role: "龙头", a: "家家悦 603708", relation: "同概念", dUsPct: 1.4, dReactPct: null }
      ],
      logic: [
        "隔夜不是普涨。等权前三是互联网科技、软件SaaS、消费，但广度一般：光伏储能 −4.68%，半导体 −3.56%，AI算力 −1.81%，创新药和新能源车也收绿。资金在七巨头内部换人，并回吐昨天的英伟达财报。",
        "互联网第一名不可外推成「科技主线」。板块第一主要靠 AMZN +3.97% 和 NFLX +2.35%。亚马逊仍跌破 MA20。A 股立讯、歌尔 8/28 收绿是对更早交易日的反应，不能当成已经兑现今夜苹果/亚马逊。",
        "英伟达把 8/27 的财报阳线吐了一半。NVDA 从 +8.74% 变成 −4.57%、量能 1.53×、重新跌破 MA20。半导体等权 −3.56%，迈威尔 −10.28%。A 股 8/28 海光、工业富联已经不像 8/27 的大涨；8/31 才是对今夜这笔回吐的第一根日K。"
      ],
      caveats: [
        { title: "互联网样本只有 4 只", detail: "等权第一很容易被亚马逊单票反抽劫持，不能当成板块趋势。" },
        { title: "A 股反应日尚未开盘", detail: "8/31 日K 不存在。把 8/28 的 A 股涨跌当成对今夜美股的映射，方向会反。" },
        { title: "NVDA 同时是 AI 与半导体龙头", detail: "两个板块都被同一只票拖累；半导体「最高」美光只跌 0.27%，设备股跌得更深。" },
        { title: "探路者与耐克不是同一条产业链", detail: "探路者 8/28 +7.04% 是「同概念」户外服饰，华利集团这条供应链几乎平盘。" },
        { title: "消费仍在均线下方", detail: "四只都收红但 COST / NKE / PG 仍跌破 MA10。" },
        { title: "BYDDY 无日K", detail: "新能源车等权少一只，板块涨幅可能略有偏差。" }
      ],
      watch: [
        { point: "英伟达回吐是否扩散", check: "NVDA 跌破 MA20 之后，若继续破位，AI/半导体会从财报次日回吐变成趋势转弱。" },
        { point: "海光 / 工业富联 / 寒武纪的 8/31", check: "8/27 已大涨、8/28 基本平盘的国产算力，面对今夜英伟达 −4.57%，是高开低走还是不再跟。" },
        { point: "亚马逊能否回到 MA20", check: "AMZN 仍跌破 MA20；若反抽失败，互联网第一名就是一日轮动。" },
        { point: "ServiceNow / Salesforce 是否续得住", check: "NOW 连涨两天、CRM 量能 2.25× 高位消化；A 股泛微、金山、用友 8/31 是否跟。" },
        { point: "苹果链 8/31", check: "立讯、歌尔 8/28 已收绿；若苹果续涨而组装链不跟，映射只是种子不是传导。" },
        { point: "光伏是否止跌", check: "FSLR / ENPH / SEDG 齐跌，阳光电源 8/27 刚跌 12.24%。" },
        { point: "创新药是否止跌", check: "礼来、诺和诺德、Moderna 继续收绿时，不要用前三板块掩盖这条空头腿。" }
      ],
      tickersOk: 49,
      tickersMiss: ["BYDDY"]
    },
    {
      usDate: "2026-08-27",
      generatedAt: "2026-08-28 07:25",
      savedAt: "2026-08-28 07:25",
      source: "腾讯财经日K · GICS板块 / 概念等权",
      mdPath: "briefings/2026-08-27.md",
      headline: "隔夜主线是软件财报与英伟达，不是全面风险偏好",
      summary: "GICS 板块第一是加密货币 +6.03%（Strategy +11.54%），信息技术第二 +3.22% 被 Salesforce 单票抬高。概念维度仍是软件SaaS +8.43%、加密货币 +6.03%、AI算力 +3.08%。当时写的光伏第三是主题口径。A 股 8/28 反应日尚未开盘，不编造涨跌。",
      disclaimer: "技术摘要由日K推算，不是盘中逐笔。种子映射与行情不构成投资建议。概念表沿用当时主题口径；GICS 表按 v0.1.21 重算。",
      stats: [
        { label: "加密货币（GICS 第一）", value: "+6.03%", tone: "up" },
        { label: "软件SaaS（概念第一）", value: "+8.43%", tone: "up" },
        { label: "信息技术（GICS 第二）", value: "+3.22%", tone: "up" },
        { label: "创新药（概念最弱）", value: "−1.91%", tone: "down" }
      ],
      sectors: [
        { nameCn: "加密货币", changePct: 6.03, leader: "COIN +4.92%", topGainer: "MSTR +11.54%", note: "非 GICS 增补，Strategy 单票权重大" },
        { nameCn: "信息技术", changePct: 3.22, leader: "NVDA +8.74%", topGainer: "CRM +22.58%", note: "GICS 把软件财报和英伟达并进同一级" },
        { nameCn: "工业", changePct: -0.07, leader: "CAT −0.60%", topGainer: "ENPH +2.16%", note: "工程机械与光伏设备对冲后近乎持平" }
      ],
      top3: [
        {
          nameCn: "加密货币",
          changePct: 6.03,
          take: "当时主题日榜没有这一级。按 GICS+增补重算，8/27 真正的板块第一是比特币链，不是软件。",
          bullets: [
            "龙头 COIN Coinbase +4.92%",
            "最高 MSTR Strategy +11.54%",
            "概念「软件SaaS」+8.43% 更高，但那是主题标签，不是 GICS 板块"
          ]
        },
        {
          nameCn: "信息技术",
          changePct: 3.22,
          take: "GICS 把 Salesforce 财报和英伟达并进信息技术。等权被 22% 单票劫持，不能读成科技普涨。",
          bullets: [
            "龙头 NVDA 英伟达 +8.74%，量能 2.39×，站上 MA10",
            "最高 CRM Salesforce +22.58%",
            "概念里软件单独 +8.43%、AI算力 +3.08%，拆开看才知道是两笔财报"
          ]
        },
        {
          nameCn: "工业",
          changePct: -0.07,
          take: "新补的工业样本几乎走平。光伏设备在工业里，不再单独把板块抬到第三。",
          bullets: [
            "龙头 CAT 卡特彼勒 −0.60%",
            "最高 ENPH Enphase +2.16%",
            "概念「光伏储能」当天仍红，但 GICS 工业把工程机械和太阳能设备对冲掉了"
          ]
        }
      ],
      concepts: [
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
      conceptTop3: [
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
        "GICS 信息技术把 Salesforce 和英伟达并进同一级（+3.22%）。概念里软件单独 +8.43%、AI 单独 +3.08%；加密货币作为增补板块才是 GICS 第一（+6.03%），当时主题日榜看不见。",
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
      source: "腾讯财经日K · GICS板块 / 概念等权",
      mdPath: "briefings/2026-08-26.md",
      headline: "隔夜主线是「局部反弹」，不是全面风险偏好",
      summary: "GICS 板块第一是工业 +2.37%，主要靠 SolarEdge 把电气设备抬上去；信息技术第二 +0.79%。概念维度仍是光伏储能 +4.38%、半导体 / AI算力各 +0.58%。真正传到 A 股的是光模块 / 国产算力，不是光伏逆变器。",
      disclaimer: "技术摘要由日K推算，不是盘中逐笔。种子映射与行情不构成投资建议。概念表沿用当时主题口径；GICS 表按 v0.1.21 重算。",
      stats: [
        { label: "工业（GICS 第一）", value: "+2.37%", tone: "up" },
        { label: "光伏储能（概念第一）", value: "+4.38%", tone: "up" },
        { label: "信息技术（GICS 第二）", value: "+0.79%", tone: "up" },
        { label: "创新药（概念最弱）", value: "−3.35%", tone: "down" }
      ],
      sectors: [
        { nameCn: "工业", changePct: 2.37, leader: "CAT +1.31%", topGainer: "SEDG +10.71%", note: "GICS，光伏设备并进工业" },
        { nameCn: "信息技术", changePct: 0.79, leader: "NVDA −1.59%", topGainer: "ANET +5.92%", note: "英伟达收绿，网络设备领涨" },
        { nameCn: "公用事业", changePct: 0.01, leader: "NEE +0.00%", topGainer: "DUK +0.25%", note: "新补样本，近乎走平" }
      ],
      top3: [
        {
          nameCn: "工业",
          changePct: 2.37,
          take: "GICS 工业第一名不是工程机械主线，是 SolarEdge 超跌反弹把电气设备抬上去。",
          bullets: [
            "龙头 CAT 卡特彼勒 +1.31%",
            "最高 SEDG SolarEdge +10.71%，量能 1.66×，仍跌破 MA20",
            "概念「光伏储能」单独看是 +4.38%；并进工业后样本被稀释，但仍排 GICS 第一"
          ]
        },
        {
          nameCn: "信息技术",
          changePct: 0.79,
          take: "网络设备强于算力整机。ANET 领涨，英伟达放量回调。",
          bullets: [
            "龙头 NVDA 英伟达 −1.59%，量能 1.54×，跌破 MA10",
            "最高 ANET Arista +5.92%",
            "概念把半导体和 AI 拆开后各约 +0.58%，合并进信息技术几乎看不出结构"
          ]
        },
        {
          nameCn: "公用事业",
          changePct: 0.01,
          take: "新补的电力股近乎走平，只是填上 GICS 缺口，不是隔夜主线。",
          bullets: [
            "龙头 NEE 新纪元能源平盘",
            "最高 DUK 杜克能源 +0.25%",
            "不要把第三名读成公用事业启动"
          ]
        }
      ],
      concepts: [
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
      conceptTop3: [
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
