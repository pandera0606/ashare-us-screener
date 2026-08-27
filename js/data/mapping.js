var MappingData = (function () {
  var SECTORS = [
    {
      id: "semi",
      nameCn: "半导体",
      nameEn: "Semiconductors",
      leaderTicker: "NVDA",
      aShares: [
        { ticker: "688256", name: "寒武纪", note: "国产 AI 芯片设计对标" },
        { ticker: "688041", name: "海光信息", note: "CPU/DCU 算力芯片" },
        { ticker: "688981", name: "中芯国际", note: "晶圆代工" },
        { ticker: "688347", name: "华虹公司", note: "特色工艺代工" },
        { ticker: "002371", name: "北方华创", note: "半导体设备" },
        { ticker: "688012", name: "中微公司", note: "刻蚀设备" },
        { ticker: "603986", name: "兆易创新", note: "存储与 MCU" },
        { ticker: "688008", name: "澜起科技", note: "互联芯片" }
      ]
    },
    {
      id: "ai",
      nameCn: "AI算力",
      nameEn: "AI Compute",
      leaderTicker: "NVDA",
      aShares: [
        { ticker: "688256", name: "寒武纪", note: "AI 加速芯片" },
        { ticker: "000977", name: "浪潮信息", note: "AI 服务器" },
        { ticker: "603019", name: "中科曙光", note: "高端计算" },
        { ticker: "601138", name: "工业富联", note: "算力代工与服务器" },
        { ticker: "002230", name: "科大讯飞", note: "语音与大模型应用" },
        { ticker: "300418", name: "昆仑万维", note: "AI 应用与内容" }
      ]
    },
    {
      id: "ev",
      nameCn: "新能源车",
      nameEn: "EV & Battery",
      leaderTicker: "TSLA",
      aShares: [
        { ticker: "002594", name: "比亚迪", note: "整车+电池垂直整合" },
        { ticker: "300750", name: "宁德时代", note: "动力电池龙头" },
        { ticker: "601127", name: "赛力斯", note: "华为智选合作车企" },
        { ticker: "601633", name: "长城汽车", note: "SUV 与新能源" },
        { ticker: "600104", name: "上汽集团", note: "传统车企转型" },
        { ticker: "600418", name: "江淮汽车", note: "与新势力代工合作" }
      ]
    },
    {
      id: "solar",
      nameCn: "光伏储能",
      nameEn: "Solar & Storage",
      leaderTicker: "FSLR",
      aShares: [
        { ticker: "601012", name: "隆基绿能", note: "硅片与组件" },
        { ticker: "600438", name: "通威股份", note: "硅料与电池片" },
        { ticker: "688599", name: "天合光能", note: "组件与系统" },
        { ticker: "300274", name: "阳光电源", note: "逆变器与储能" },
        { ticker: "688390", name: "固德威", note: "组串逆变器" },
        { ticker: "300763", name: "锦浪科技", note: "逆变器出口" }
      ]
    },
    {
      id: "biotech",
      nameCn: "创新药",
      nameEn: "Biotech",
      leaderTicker: "LLY",
      aShares: [
        { ticker: "600276", name: "恒瑞医药", note: "创新药平台" },
        { ticker: "688235", name: "百济神州", note: "肿瘤创新药" },
        { ticker: "600867", name: "通化东宝", note: "胰岛素" },
        { ticker: "603087", name: "甘李药业", note: "胰岛素类似物" },
        { ticker: "300142", name: "沃森生物", note: "疫苗" },
        { ticker: "300601", name: "康泰生物", note: "疫苗" }
      ]
    },
    {
      id: "internet",
      nameCn: "互联网科技",
      nameEn: "Internet & Tech",
      leaderTicker: "AAPL",
      aShares: [
        { ticker: "002475", name: "立讯精密", note: "消费电子组装" },
        { ticker: "002241", name: "歌尔股份", note: "声学与 VR" },
        { ticker: "300413", name: "芒果超媒", note: "长视频内容" },
        { ticker: "300251", name: "光线传媒", note: "影视内容" },
        { ticker: "002415", name: "海康威视", note: "视觉与数据" },
        { ticker: "000938", name: "紫光股份", note: "ICT 设备分销与云" }
      ]
    },
    {
      id: "consumer",
      nameCn: "消费",
      nameEn: "Consumer",
      leaderTicker: "COST",
      aShares: [
        { ticker: "601933", name: "永辉超市", note: "商超零售" },
        { ticker: "603708", name: "家家悦", note: "区域商超" },
        { ticker: "300979", name: "华利集团", note: "运动鞋履代工" },
        { ticker: "300005", name: "探路者", note: "户外服饰" },
        { ticker: "605499", name: "东鹏饮料", note: "功能饮料" },
        { ticker: "603605", name: "珀莱雅", note: "化妆品" },
        { ticker: "600315", name: "上海家化", note: "日化" }
      ]
    },
    {
      id: "energy",
      nameCn: "能源",
      nameEn: "Energy",
      leaderTicker: "XOM",
      aShares: [
        { ticker: "601857", name: "中国石油", note: "上下游一体化" },
        { ticker: "600938", name: "中国海油", note: "上游油气" },
        { ticker: "600028", name: "中国石化", note: "炼化与销售" }
      ]
    },
    {
      id: "software",
      nameCn: "软件SaaS",
      nameEn: "Software",
      leaderTicker: "MSFT",
      aShares: [
        { ticker: "688111", name: "金山办公", note: "办公套件" },
        { ticker: "600588", name: "用友网络", note: "企业软件" },
        { ticker: "603039", name: "泛微网络", note: "协同 OA" },
        { ticker: "688369", name: "致远互联", note: "协同管理" },
        { ticker: "300624", name: "万兴科技", note: "创意软件" },
        { ticker: "600536", name: "中国软件", note: "基础软件" }
      ]
    },
    {
      id: "finance",
      nameCn: "金融",
      nameEn: "Financials",
      leaderTicker: "JPM",
      aShares: [
        { ticker: "600036", name: "招商银行", note: "零售银行" },
        { ticker: "601166", name: "兴业银行", note: "股份行" },
        { ticker: "600030", name: "中信证券", note: "综合券商" },
        { ticker: "601688", name: "华泰证券", note: "券商" },
        { ticker: "300059", name: "东方财富", note: "互联网券商" }
      ]
    }
  ];

  var US_STOCKS = [
    { ticker: "NVDA", name: "英伟达", sectorId: "semi", aShares: [
      { ticker: "688256", name: "寒武纪", relation: "对标", note: "云端/边缘 AI 加速芯片设计" },
      { ticker: "688041", name: "海光信息", relation: "对标", note: "国产算力芯片（DCU）" },
      { ticker: "603019", name: "中科曙光", relation: "供应链", note: "高端计算整机与液冷" },
      { ticker: "601138", name: "工业富联", relation: "供应链", note: "AI 服务器代工" }
    ]},
    { ticker: "AMD", name: "超微半导体", sectorId: "semi", aShares: [
      { ticker: "688041", name: "海光信息", relation: "对标", note: "x86 授权与 DCU 路线相近" },
      { ticker: "688047", name: "龙芯中科", relation: "同概念", note: "国产 CPU" }
    ]},
    { ticker: "TSM", name: "台积电", sectorId: "semi", aShares: [
      { ticker: "688981", name: "中芯国际", relation: "对标", note: "大陆晶圆代工龙头" },
      { ticker: "688347", name: "华虹公司", relation: "对标", note: "特色工艺代工" }
    ]},
    { ticker: "AVGO", name: "博通", sectorId: "semi", aShares: [
      { ticker: "300782", name: "卓胜微", relation: "同概念", note: "射频前端" },
      { ticker: "688008", name: "澜起科技", relation: "同概念", note: "互联与内存接口芯片" }
    ]},
    { ticker: "ASML", name: "阿斯麦", sectorId: "semi", aShares: [
      { ticker: "002371", name: "北方华创", relation: "对标", note: "国产半导体设备平台" },
      { ticker: "688012", name: "中微公司", relation: "对标", note: "刻蚀设备" },
      { ticker: "688082", name: "盛美上海", relation: "对标", note: "清洗等湿法设备" }
    ]},
    { ticker: "AMAT", name: "应用材料", sectorId: "semi", aShares: [
      { ticker: "002371", name: "北方华创", relation: "对标", note: "薄膜/刻蚀/清洗设备组合" },
      { ticker: "688072", name: "拓荆科技", relation: "对标", note: "薄膜沉积" }
    ]},
    { ticker: "LRCX", name: "泛林集团", sectorId: "semi", aShares: [
      { ticker: "688012", name: "中微公司", relation: "对标", note: "刻蚀" },
      { ticker: "002371", name: "北方华创", relation: "对标", note: "设备平台" }
    ]},
    { ticker: "KLAC", name: "科磊", sectorId: "semi", aShares: [
      { ticker: "688361", name: "中科飞测", relation: "对标", note: "检测与量测" },
      { ticker: "300567", name: "精测电子", relation: "对标", note: "半导体检测" }
    ]},
    { ticker: "MU", name: "美光科技", sectorId: "semi", aShares: [
      { ticker: "603986", name: "兆易创新", relation: "对标", note: "存储芯片设计" },
      { ticker: "300223", name: "北京君正", relation: "同概念", note: "存储与计算芯片" }
    ]},
    { ticker: "ARM", name: "安谋", sectorId: "semi", aShares: [
      { ticker: "688256", name: "寒武纪", relation: "同概念", note: "AI IP/芯片设计" },
      { ticker: "688521", name: "芯原股份", relation: "对标", note: "芯片 IP 与设计服务" }
    ]},
    { ticker: "INTC", name: "英特尔", sectorId: "semi", aShares: [
      { ticker: "688041", name: "海光信息", relation: "对标", note: "服务器 CPU/DCU" },
      { ticker: "688047", name: "龙芯中科", relation: "同概念", note: "国产 CPU" },
      { ticker: "603501", name: "韦尔股份", relation: "同概念", note: "模拟与 CIS" }
    ]},
    { ticker: "QCOM", name: "高通", sectorId: "semi", aShares: [
      { ticker: "300782", name: "卓胜微", relation: "供应链", note: "射频前端配套" },
      { ticker: "603160", name: "汇顶科技", relation: "同概念", note: "手机芯片与触控" }
    ]},
    { ticker: "MRVL", name: "迈威尔", sectorId: "semi", aShares: [
      { ticker: "688008", name: "澜起科技", relation: "对标", note: "互联芯片" },
      { ticker: "000063", name: "中兴通讯", relation: "同概念", note: "通信与算力互联" }
    ]},
    { ticker: "SMCI", name: "超微电脑", sectorId: "ai", aShares: [
      { ticker: "601138", name: "工业富联", relation: "对标", note: "AI 服务器代工" },
      { ticker: "000977", name: "浪潮信息", relation: "对标", note: "AI 服务器整机" },
      { ticker: "603019", name: "中科曙光", relation: "对标", note: "高端服务器" }
    ]},
    { ticker: "ANET", name: "Arista", sectorId: "ai", aShares: [
      { ticker: "000063", name: "中兴通讯", relation: "同概念", note: "数据中心网络" },
      { ticker: "000938", name: "紫光股份", relation: "对标", note: "ICT 与网络设备" }
    ]},
    { ticker: "MSFT", name: "微软", sectorId: "software", aShares: [
      { ticker: "688111", name: "金山办公", relation: "对标", note: "办公套件与云文档" },
      { ticker: "600588", name: "用友网络", relation: "同概念", note: "企业软件与云" }
    ]},
    { ticker: "GOOGL", name: "谷歌", sectorId: "ai", aShares: [
      { ticker: "002230", name: "科大讯飞", relation: "同概念", note: "搜索/语音与大模型应用" },
      { ticker: "601360", name: "三六零", relation: "同概念", note: "搜索与安全" }
    ]},
    { ticker: "META", name: "Meta", sectorId: "internet", aShares: [
      { ticker: "300418", name: "昆仑万维", relation: "同概念", note: "社交/内容与 AI 应用" },
      { ticker: "300315", name: "掌趣科技", relation: "同概念", note: "游戏与应用分发" }
    ]},
    { ticker: "AMZN", name: "亚马逊", sectorId: "internet", aShares: [
      { ticker: "002315", name: "焦点科技", relation: "同概念", note: "跨境电商平台" },
      { ticker: "000977", name: "浪潮信息", relation: "供应链", note: "云计算基础设施" }
    ]},
    { ticker: "PLTR", name: "Palantir", sectorId: "ai", aShares: [
      { ticker: "002230", name: "科大讯飞", relation: "同概念", note: "行业大模型落地" },
      { ticker: "002415", name: "海康威视", relation: "同概念", note: "数据与视觉智能" }
    ]},
    { ticker: "ORCL", name: "甲骨文", sectorId: "software", aShares: [
      { ticker: "600536", name: "中国软件", relation: "对标", note: "基础软件与数据库生态" },
      { ticker: "002368", name: "太极股份", relation: "同概念", note: "行业信息化" }
    ]},
    { ticker: "CRM", name: "Salesforce", sectorId: "software", aShares: [
      { ticker: "600588", name: "用友网络", relation: "对标", note: "企业云与 ERP/CRM" },
      { ticker: "600756", name: "浪潮软件", relation: "同概念", note: "政务与企业软件" }
    ]},
    { ticker: "NOW", name: "ServiceNow", sectorId: "software", aShares: [
      { ticker: "603039", name: "泛微网络", relation: "对标", note: "流程与协同" },
      { ticker: "688369", name: "致远互联", relation: "对标", note: "协同运营平台" }
    ]},
    { ticker: "ADBE", name: "Adobe", sectorId: "software", aShares: [
      { ticker: "300624", name: "万兴科技", relation: "对标", note: "创意与数字媒体软件" },
      { ticker: "688111", name: "金山办公", relation: "同概念", note: "桌面生产力软件" }
    ]},
    { ticker: "TSLA", name: "特斯拉", sectorId: "ev", aShares: [
      { ticker: "002594", name: "比亚迪", relation: "对标", note: "新能源整车龙头" },
      { ticker: "300750", name: "宁德时代", relation: "供应链", note: "动力电池" },
      { ticker: "601127", name: "赛力斯", relation: "同概念", note: "智能电动车" }
    ]},
    { ticker: "RIVN", name: "Rivian", sectorId: "ev", aShares: [
      { ticker: "600418", name: "江淮汽车", relation: "同概念", note: "新势力合作/代工" },
      { ticker: "601633", name: "长城汽车", relation: "同概念", note: "皮卡与新能源" }
    ]},
    { ticker: "LCID", name: "Lucid", sectorId: "ev", aShares: [
      { ticker: "601127", name: "赛力斯", relation: "同概念", note: "高端智能电动车" }
    ]},
    { ticker: "GM", name: "通用汽车", sectorId: "ev", aShares: [
      { ticker: "600104", name: "上汽集团", relation: "对标", note: "传统车企电动化" },
      { ticker: "601238", name: "广汽集团", relation: "对标", note: "合资+自主新能源" }
    ]},
    { ticker: "NIO", name: "蔚来", sectorId: "ev", aShares: [
      { ticker: "601127", name: "赛力斯", relation: "同概念", note: "中高端智能电动" },
      { ticker: "600418", name: "江淮汽车", relation: "供应链", note: "代工合作历史" }
    ]},
    { ticker: "XPEV", name: "小鹏汽车", sectorId: "ev", aShares: [
      { ticker: "601238", name: "广汽集团", relation: "同概念", note: "智驾与产能合作" },
      { ticker: "002594", name: "比亚迪", relation: "对标", note: "智能电动整车" }
    ]},
    { ticker: "FSLR", name: "First Solar", sectorId: "solar", aShares: [
      { ticker: "601012", name: "隆基绿能", relation: "对标", note: "光伏制造龙头" },
      { ticker: "600438", name: "通威股份", relation: "对标", note: "硅料与电池片" },
      { ticker: "688599", name: "天合光能", relation: "对标", note: "组件" }
    ]},
    { ticker: "ENPH", name: "Enphase", sectorId: "solar", aShares: [
      { ticker: "300274", name: "阳光电源", relation: "对标", note: "逆变器与储能" },
      { ticker: "688390", name: "固德威", relation: "对标", note: "组串逆变器" }
    ]},
    { ticker: "SEDG", name: "SolarEdge", sectorId: "solar", aShares: [
      { ticker: "300274", name: "阳光电源", relation: "对标", note: "逆变器" },
      { ticker: "300763", name: "锦浪科技", relation: "对标", note: "组串逆变器出口" }
    ]},
    { ticker: "LLY", name: "礼来", sectorId: "biotech", aShares: [
      { ticker: "600276", name: "恒瑞医药", relation: "对标", note: "创新药管线平台" },
      { ticker: "688235", name: "百济神州", relation: "对标", note: "肿瘤创新药" }
    ]},
    { ticker: "NVO", name: "诺和诺德", sectorId: "biotech", aShares: [
      { ticker: "600867", name: "通化东宝", relation: "对标", note: "胰岛素" },
      { ticker: "603087", name: "甘李药业", relation: "对标", note: "胰岛素类似物" }
    ]},
    { ticker: "MRNA", name: "Moderna", sectorId: "biotech", aShares: [
      { ticker: "300142", name: "沃森生物", relation: "同概念", note: "疫苗平台" },
      { ticker: "300601", name: "康泰生物", relation: "同概念", note: "疫苗" }
    ]},
    { ticker: "VRTX", name: "Vertex", sectorId: "biotech", aShares: [
      { ticker: "688235", name: "百济神州", relation: "同概念", note: "创新药商业化" },
      { ticker: "002294", name: "信立泰", relation: "同概念", note: "慢病与创新转型" }
    ]},
    { ticker: "AAPL", name: "苹果", sectorId: "internet", aShares: [
      { ticker: "002475", name: "立讯精密", relation: "供应链", note: "组装与精密结构件" },
      { ticker: "002241", name: "歌尔股份", relation: "供应链", note: "声学、光学与 XR" }
    ]},
    { ticker: "NFLX", name: "奈飞", sectorId: "internet", aShares: [
      { ticker: "300413", name: "芒果超媒", relation: "对标", note: "长视频平台" },
      { ticker: "300251", name: "光线传媒", relation: "同概念", note: "内容制作" }
    ]},
    { ticker: "COST", name: "开市客", sectorId: "consumer", aShares: [
      { ticker: "601933", name: "永辉超市", relation: "同概念", note: "商超零售" },
      { ticker: "603708", name: "家家悦", relation: "同概念", note: "区域连锁商超" }
    ]},
    { ticker: "NKE", name: "耐克", sectorId: "consumer", aShares: [
      { ticker: "300979", name: "华利集团", relation: "供应链", note: "运动鞋履代工" },
      { ticker: "300005", name: "探路者", relation: "同概念", note: "户外运动服饰" }
    ]},
    { ticker: "KO", name: "可口可乐", sectorId: "consumer", aShares: [
      { ticker: "605499", name: "东鹏饮料", relation: "同概念", note: "饮料品牌" },
      { ticker: "000848", name: "承德露露", relation: "同概念", note: "植物蛋白饮料" }
    ]},
    { ticker: "PG", name: "宝洁", sectorId: "consumer", aShares: [
      { ticker: "600315", name: "上海家化", relation: "对标", note: "日化品牌" },
      { ticker: "603605", name: "珀莱雅", relation: "同概念", note: "化妆品" }
    ]},
    { ticker: "XOM", name: "埃克森美孚", sectorId: "energy", aShares: [
      { ticker: "601857", name: "中国石油", relation: "对标", note: "一体化油气" },
      { ticker: "600938", name: "中国海油", relation: "对标", note: "上游油气" }
    ]},
    { ticker: "CVX", name: "雪佛龙", sectorId: "energy", aShares: [
      { ticker: "600028", name: "中国石化", relation: "对标", note: "炼化一体化" }
    ]},
    { ticker: "COP", name: "康菲石油", sectorId: "energy", aShares: [
      { ticker: "600938", name: "中国海油", relation: "对标", note: "上游开发" }
    ]},
    { ticker: "JPM", name: "摩根大通", sectorId: "finance", aShares: [
      { ticker: "600036", name: "招商银行", relation: "对标", note: "零售与综合银行" },
      { ticker: "601166", name: "兴业银行", relation: "对标", note: "股份行" }
    ]},
    { ticker: "GS", name: "高盛", sectorId: "finance", aShares: [
      { ticker: "600030", name: "中信证券", relation: "对标", note: "综合券商" },
      { ticker: "601688", name: "华泰证券", relation: "对标", note: "券商" }
    ]},
    { ticker: "BLK", name: "贝莱德", sectorId: "finance", aShares: [
      { ticker: "300059", name: "东方财富", relation: "同概念", note: "财富管理与流量入口" },
      { ticker: "600030", name: "中信证券", relation: "同概念", note: "机构业务" }
    ]},
    { ticker: "BYDDY", name: "比亚迪ADR", sectorId: "ev", aShares: [
      { ticker: "002594", name: "比亚迪", relation: "ADR", note: "同一公司 A 股" }
    ]}
  ];

  function sectorById(id) {
    for (var i = 0; i < SECTORS.length; i++) {
      if (SECTORS[i].id === id) return SECTORS[i];
    }
    return null;
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

  var aNameIndex = {};
  function rememberA(ticker, name) {
    if (!aNameIndex[ticker]) aNameIndex[ticker] = name;
  }

  SECTORS.forEach(function (sec) {
    sec.aShares.forEach(function (a) { rememberA(a.ticker, a.name); });
  });
  US_STOCKS.forEach(function (us) {
    us.aShares.forEach(function (a) { rememberA(a.ticker, a.name); });
  });

  var aToUs = {};
  US_STOCKS.forEach(function (us) {
    us.aShares.forEach(function (a) {
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
    SECTORS.forEach(function (sec) {
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

  return {
    SECTORS: SECTORS,
    US_STOCKS: US_STOCKS,
    sectorById: sectorById,
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
    isKnown: isKnown
  };
})();
