/* 板块与股票映射种子。用根目录 mapping.html 编辑后覆盖本文件。不构成投资建议。
 * sectors = GICS 一级行业 + 非 GICS 增补（如加密货币）。
 * concepts = 原来的主题板块，现作概念标签；一只美股可挂多个概念。
 */
var MappingSeed = {
  sectors: [
    {
      id: "energy",
      nameCn: "能源",
      nameEn: "Energy",
      kind: "gics",
      leaderTicker: "XOM",
      aShares: [
        { ticker: "601857", name: "中国石油", note: "上下游一体化" },
        { ticker: "600938", name: "中国海油", note: "上游油气" },
        { ticker: "600028", name: "中国石化", note: "炼化与销售" }
      ]
    },
    {
      id: "materials",
      nameCn: "原材料",
      nameEn: "Materials",
      kind: "gics",
      leaderTicker: "LIN",
      aShares: [
        { ticker: "601899", name: "紫金矿业", note: "铜金等资源" },
        { ticker: "603993", name: "洛阳钼业", note: "铜钴钼" },
        { ticker: "600547", name: "山东黄金", note: "黄金开采" },
        { ticker: "600309", name: "万华化学", note: "化工材料" },
        { ticker: "002430", name: "杭氧股份", note: "工业气体设备" }
      ]
    },
    {
      id: "industrials",
      nameCn: "工业",
      nameEn: "Industrials",
      kind: "gics",
      leaderTicker: "CAT",
      aShares: [
        { ticker: "600031", name: "三一重工", note: "工程机械" },
        { ticker: "000425", name: "徐工机械", note: "工程机械" },
        { ticker: "000768", name: "中航西飞", note: "航空制造" },
        { ticker: "600760", name: "中航沈飞", note: "军机整机" },
        { ticker: "601006", name: "大秦铁路", note: "铁路运输" },
        { ticker: "601012", name: "隆基绿能", note: "光伏制造，工业设备链相关候选" },
        { ticker: "300274", name: "阳光电源", note: "电力设备与储能" }
      ]
    },
    {
      id: "disc",
      nameCn: "非必需消费",
      nameEn: "Consumer Discretionary",
      kind: "gics",
      leaderTicker: "AMZN",
      aShares: [
        { ticker: "002594", name: "比亚迪", note: "新能源整车" },
        { ticker: "300750", name: "宁德时代", note: "动力电池" },
        { ticker: "601127", name: "赛力斯", note: "智能电动车" },
        { ticker: "300979", name: "华利集团", note: "运动鞋履代工" },
        { ticker: "603833", name: "欧派家居", note: "定制家居零售相关" },
        { ticker: "603816", name: "顾家家居", note: "家具零售相关" }
      ]
    },
    {
      id: "staples",
      nameCn: "必需消费",
      nameEn: "Consumer Staples",
      kind: "gics",
      leaderTicker: "WMT",
      aShares: [
        { ticker: "601933", name: "永辉超市", note: "商超零售" },
        { ticker: "603708", name: "家家悦", note: "区域商超" },
        { ticker: "605499", name: "东鹏饮料", note: "饮料" },
        { ticker: "603605", name: "珀莱雅", note: "化妆品" },
        { ticker: "600315", name: "上海家化", note: "日化" },
        { ticker: "600887", name: "伊利股份", note: "乳制品" }
      ]
    },
    {
      id: "health",
      nameCn: "医疗保健",
      nameEn: "Health Care",
      kind: "gics",
      leaderTicker: "LLY",
      aShares: [
        { ticker: "600276", name: "恒瑞医药", note: "创新药平台" },
        { ticker: "688235", name: "百济神州", note: "肿瘤创新药" },
        { ticker: "300760", name: "迈瑞医疗", note: "医疗器械" },
        { ticker: "300015", name: "爱尔眼科", note: "专科医疗" },
        { ticker: "600763", name: "通策医疗", note: "口腔医疗" },
        { ticker: "603259", name: "药明康德", note: "CXO" }
      ]
    },
    {
      id: "finance",
      nameCn: "金融",
      nameEn: "Financials",
      kind: "gics",
      leaderTicker: "JPM",
      aShares: [
        { ticker: "600036", name: "招商银行", note: "零售银行" },
        { ticker: "601166", name: "兴业银行", note: "股份行" },
        { ticker: "600030", name: "中信证券", note: "综合券商" },
        { ticker: "601688", name: "华泰证券", note: "券商" },
        { ticker: "300059", name: "东方财富", note: "互联网券商" }
      ]
    },
    {
      id: "it",
      nameCn: "信息技术",
      nameEn: "Information Technology",
      kind: "gics",
      leaderTicker: "NVDA",
      aShares: [
        { ticker: "688256", name: "寒武纪", note: "AI 芯片设计" },
        { ticker: "688041", name: "海光信息", note: "CPU/DCU" },
        { ticker: "688981", name: "中芯国际", note: "晶圆代工" },
        { ticker: "002371", name: "北方华创", note: "半导体设备" },
        { ticker: "688111", name: "金山办公", note: "办公软件" },
        { ticker: "002475", name: "立讯精密", note: "消费电子" },
        { ticker: "600588", name: "用友网络", note: "企业软件" }
      ]
    },
    {
      id: "comm",
      nameCn: "通信服务",
      nameEn: "Communication Services",
      kind: "gics",
      leaderTicker: "GOOGL",
      aShares: [
        { ticker: "600941", name: "中国移动", note: "电信运营" },
        { ticker: "600050", name: "中国联通", note: "电信运营" },
        { ticker: "300413", name: "芒果超媒", note: "长视频" },
        { ticker: "300251", name: "光线传媒", note: "影视内容" },
        { ticker: "300418", name: "昆仑万维", note: "互联网应用" },
        { ticker: "002027", name: "分众传媒", note: "媒体广告" }
      ]
    },
    {
      id: "utilities",
      nameCn: "公用事业",
      nameEn: "Utilities",
      kind: "gics",
      leaderTicker: "NEE",
      aShares: [
        { ticker: "600900", name: "长江电力", note: "水电运营" },
        { ticker: "601985", name: "中国核电", note: "核电运营" },
        { ticker: "001289", name: "龙源电力", note: "新能源发电" },
        { ticker: "600011", name: "华能国际", note: "火电与综合发电" },
        { ticker: "600905", name: "三峡能源", note: "风光发电" }
      ]
    },
    {
      id: "realestate",
      nameCn: "房地产",
      nameEn: "Real Estate",
      kind: "gics",
      leaderTicker: "PLD",
      aShares: [
        { ticker: "000002", name: "万科A", note: "开发与物流地产" },
        { ticker: "600048", name: "保利发展", note: "开发商" },
        { ticker: "001979", name: "招商蛇口", note: "园区与住宅" },
        { ticker: "601728", name: "中国铁塔", note: "通信基础设施 REIT 对标" }
      ]
    },
    {
      id: "crypto",
      nameCn: "加密货币",
      nameEn: "Crypto",
      kind: "extra",
      leaderTicker: "COIN",
      aShares: [
        { ticker: "300059", name: "东方财富", note: "互联网券商与交易入口，不是加密货币交易所" },
        { ticker: "300033", name: "同花顺", note: "行情与交易软件" },
        { ticker: "300468", name: "四方精创", note: "银行区块链系统" },
        { ticker: "300386", name: "飞天诚信", note: "数字证书与安全芯片" },
        { ticker: "002177", name: "御银股份", note: "历史上的比特币 ATM / 加密货币概念" },
        { ticker: "300773", name: "拉卡拉", note: "第三方支付，偏数字人民币基础设施" }
      ]
    }
  ],
  concepts: [
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
    },
    {
      id: "crypto",
      nameCn: "加密货币",
      nameEn: "Crypto",
      leaderTicker: "COIN",
      aShares: [
        { ticker: "300059", name: "东方财富", note: "互联网券商与交易入口，不是加密货币交易所" },
        { ticker: "300033", name: "同花顺", note: "行情与交易软件" },
        { ticker: "300468", name: "四方精创", note: "银行区块链系统" },
        { ticker: "300386", name: "飞天诚信", note: "数字证书与安全芯片" },
        { ticker: "002177", name: "御银股份", note: "历史上的比特币 ATM / 加密货币概念" },
        { ticker: "300773", name: "拉卡拉", note: "第三方支付，偏数字人民币基础设施" }
      ]
    }
  ],
  usStocks: [
    { ticker: "NVDA", name: "英伟达", sectorId: "it", conceptIds: ["semi", "ai"], aShares: [
        { ticker: "688256", name: "寒武纪", relation: "对标", note: "云端/边缘 AI 加速芯片设计" },
      { ticker: "688041", name: "海光信息", relation: "对标", note: "国产算力芯片（DCU）" },
      { ticker: "603019", name: "中科曙光", relation: "供应链", note: "高端计算整机与液冷" },
      { ticker: "601138", name: "工业富联", relation: "供应链", note: "AI 服务器代工" }
    ]},
    { ticker: "AMD", name: "超微半导体", sectorId: "it", conceptIds: ["semi"], aShares: [
        { ticker: "688041", name: "海光信息", relation: "对标", note: "x86 授权与 DCU 路线相近" },
      { ticker: "688047", name: "龙芯中科", relation: "同概念", note: "国产 CPU" }
    ]},
    { ticker: "TSM", name: "台积电", sectorId: "it", conceptIds: ["semi"], aShares: [
        { ticker: "688981", name: "中芯国际", relation: "对标", note: "大陆晶圆代工龙头" },
      { ticker: "688347", name: "华虹公司", relation: "对标", note: "特色工艺代工" }
    ]},
    { ticker: "AVGO", name: "博通", sectorId: "it", conceptIds: ["semi"], aShares: [
        { ticker: "300782", name: "卓胜微", relation: "同概念", note: "射频前端" },
      { ticker: "688008", name: "澜起科技", relation: "同概念", note: "互联与内存接口芯片" }
    ]},
    { ticker: "ASML", name: "阿斯麦", sectorId: "it", conceptIds: ["semi"], aShares: [
        { ticker: "002371", name: "北方华创", relation: "对标", note: "国产半导体设备平台" },
      { ticker: "688012", name: "中微公司", relation: "对标", note: "刻蚀设备" },
      { ticker: "688082", name: "盛美上海", relation: "对标", note: "清洗等湿法设备" }
    ]},
    { ticker: "AMAT", name: "应用材料", sectorId: "it", conceptIds: ["semi"], aShares: [
        { ticker: "002371", name: "北方华创", relation: "对标", note: "薄膜/刻蚀/清洗设备组合" },
      { ticker: "688072", name: "拓荆科技", relation: "对标", note: "薄膜沉积" }
    ]},
    { ticker: "LRCX", name: "泛林集团", sectorId: "it", conceptIds: ["semi"], aShares: [
        { ticker: "688012", name: "中微公司", relation: "对标", note: "刻蚀" },
      { ticker: "002371", name: "北方华创", relation: "对标", note: "设备平台" }
    ]},
    { ticker: "KLAC", name: "科磊", sectorId: "it", conceptIds: ["semi"], aShares: [
        { ticker: "688361", name: "中科飞测", relation: "对标", note: "检测与量测" },
      { ticker: "300567", name: "精测电子", relation: "对标", note: "半导体检测" }
    ]},
    { ticker: "MU", name: "美光科技", sectorId: "it", conceptIds: ["semi"], aShares: [
        { ticker: "603986", name: "兆易创新", relation: "对标", note: "存储芯片设计" },
      { ticker: "300223", name: "北京君正", relation: "同概念", note: "存储与计算芯片" }
    ]},
    { ticker: "ARM", name: "安谋", sectorId: "it", conceptIds: ["semi"], aShares: [
        { ticker: "688256", name: "寒武纪", relation: "同概念", note: "AI IP/芯片设计" },
      { ticker: "688521", name: "芯原股份", relation: "对标", note: "芯片 IP 与设计服务" }
    ]},
    { ticker: "INTC", name: "英特尔", sectorId: "it", conceptIds: ["semi"], aShares: [
        { ticker: "688041", name: "海光信息", relation: "对标", note: "服务器 CPU/DCU" },
      { ticker: "688047", name: "龙芯中科", relation: "同概念", note: "国产 CPU" },
      { ticker: "603501", name: "韦尔股份", relation: "同概念", note: "模拟与 CIS" }
    ]},
    { ticker: "QCOM", name: "高通", sectorId: "it", conceptIds: ["semi"], aShares: [
        { ticker: "300782", name: "卓胜微", relation: "供应链", note: "射频前端配套" },
      { ticker: "603160", name: "汇顶科技", relation: "同概念", note: "手机芯片与触控" }
    ]},
    { ticker: "MRVL", name: "迈威尔", sectorId: "it", conceptIds: ["semi"], aShares: [
        { ticker: "688008", name: "澜起科技", relation: "对标", note: "互联芯片" },
      { ticker: "000063", name: "中兴通讯", relation: "同概念", note: "通信与算力互联" }
    ]},
    { ticker: "SMCI", name: "超微电脑", sectorId: "it", conceptIds: ["ai"], aShares: [
        { ticker: "601138", name: "工业富联", relation: "对标", note: "AI 服务器代工" },
      { ticker: "000977", name: "浪潮信息", relation: "对标", note: "AI 服务器整机" },
      { ticker: "603019", name: "中科曙光", relation: "对标", note: "高端服务器" }
    ]},
    { ticker: "ANET", name: "Arista", sectorId: "it", conceptIds: ["ai"], aShares: [
        { ticker: "000063", name: "中兴通讯", relation: "同概念", note: "数据中心网络" },
      { ticker: "000938", name: "紫光股份", relation: "对标", note: "ICT 与网络设备" }
    ]},
    { ticker: "MSFT", name: "微软", sectorId: "it", conceptIds: ["software"], aShares: [
        { ticker: "688111", name: "金山办公", relation: "对标", note: "办公套件与云文档" },
      { ticker: "600588", name: "用友网络", relation: "同概念", note: "企业软件与云" }
    ]},
    { ticker: "GOOGL", name: "谷歌", sectorId: "comm", conceptIds: ["ai"], aShares: [
        { ticker: "002230", name: "科大讯飞", relation: "同概念", note: "搜索/语音与大模型应用" },
      { ticker: "601360", name: "三六零", relation: "同概念", note: "搜索与安全" }
    ]},
    { ticker: "META", name: "Meta", sectorId: "comm", conceptIds: ["internet"], aShares: [
        { ticker: "300418", name: "昆仑万维", relation: "同概念", note: "社交/内容与 AI 应用" },
      { ticker: "300315", name: "掌趣科技", relation: "同概念", note: "游戏与应用分发" }
    ]},
    { ticker: "AMZN", name: "亚马逊", sectorId: "disc", conceptIds: ["internet"], aShares: [
        { ticker: "002315", name: "焦点科技", relation: "同概念", note: "跨境电商平台" },
      { ticker: "000977", name: "浪潮信息", relation: "供应链", note: "云计算基础设施" }
    ]},
    { ticker: "PLTR", name: "Palantir", sectorId: "it", conceptIds: ["ai"], aShares: [
        { ticker: "002230", name: "科大讯飞", relation: "同概念", note: "行业大模型落地" },
      { ticker: "002415", name: "海康威视", relation: "同概念", note: "数据与视觉智能" }
    ]},
    { ticker: "ORCL", name: "甲骨文", sectorId: "it", conceptIds: ["software"], aShares: [
        { ticker: "600536", name: "中国软件", relation: "对标", note: "基础软件与数据库生态" },
      { ticker: "002368", name: "太极股份", relation: "同概念", note: "行业信息化" }
    ]},
    { ticker: "CRM", name: "Salesforce", sectorId: "it", conceptIds: ["software"], aShares: [
        { ticker: "600588", name: "用友网络", relation: "对标", note: "企业云与 ERP/CRM" },
      { ticker: "600756", name: "浪潮软件", relation: "同概念", note: "政务与企业软件" }
    ]},
    { ticker: "NOW", name: "ServiceNow", sectorId: "it", conceptIds: ["software"], aShares: [
        { ticker: "603039", name: "泛微网络", relation: "对标", note: "流程与协同" },
      { ticker: "688369", name: "致远互联", relation: "对标", note: "协同运营平台" }
    ]},
    { ticker: "ADBE", name: "Adobe", sectorId: "it", conceptIds: ["software"], aShares: [
        { ticker: "300624", name: "万兴科技", relation: "对标", note: "创意与数字媒体软件" },
      { ticker: "688111", name: "金山办公", relation: "同概念", note: "桌面生产力软件" }
    ]},
    { ticker: "TSLA", name: "特斯拉", sectorId: "disc", conceptIds: ["ev"], aShares: [
        { ticker: "002594", name: "比亚迪", relation: "对标", note: "新能源整车龙头" },
      { ticker: "300750", name: "宁德时代", relation: "供应链", note: "动力电池" },
      { ticker: "601127", name: "赛力斯", relation: "同概念", note: "智能电动车" }
    ]},
    { ticker: "RIVN", name: "Rivian", sectorId: "disc", conceptIds: ["ev"], aShares: [
        { ticker: "600418", name: "江淮汽车", relation: "同概念", note: "新势力合作/代工" },
      { ticker: "601633", name: "长城汽车", relation: "同概念", note: "皮卡与新能源" }
    ]},
    { ticker: "LCID", name: "Lucid", sectorId: "disc", conceptIds: ["ev"], aShares: [
        { ticker: "601127", name: "赛力斯", relation: "同概念", note: "高端智能电动车" }
    ]},
    { ticker: "GM", name: "通用汽车", sectorId: "disc", conceptIds: ["ev"], aShares: [
        { ticker: "600104", name: "上汽集团", relation: "对标", note: "传统车企电动化" },
      { ticker: "601238", name: "广汽集团", relation: "对标", note: "合资+自主新能源" }
    ]},
    { ticker: "NIO", name: "蔚来", sectorId: "disc", conceptIds: ["ev"], aShares: [
        { ticker: "601127", name: "赛力斯", relation: "同概念", note: "中高端智能电动" },
      { ticker: "600418", name: "江淮汽车", relation: "供应链", note: "代工合作历史" }
    ]},
    { ticker: "XPEV", name: "小鹏汽车", sectorId: "disc", conceptIds: ["ev"], aShares: [
        { ticker: "601238", name: "广汽集团", relation: "同概念", note: "智驾与产能合作" },
      { ticker: "002594", name: "比亚迪", relation: "对标", note: "智能电动整车" }
    ]},
    { ticker: "FSLR", name: "First Solar", sectorId: "industrials", conceptIds: ["solar"], aShares: [
        { ticker: "601012", name: "隆基绿能", relation: "对标", note: "光伏制造龙头" },
      { ticker: "600438", name: "通威股份", relation: "对标", note: "硅料与电池片" },
      { ticker: "688599", name: "天合光能", relation: "对标", note: "组件" }
    ]},
    { ticker: "ENPH", name: "Enphase", sectorId: "industrials", conceptIds: ["solar"], aShares: [
        { ticker: "300274", name: "阳光电源", relation: "对标", note: "逆变器与储能" },
      { ticker: "688390", name: "固德威", relation: "对标", note: "组串逆变器" }
    ]},
    { ticker: "SEDG", name: "SolarEdge", sectorId: "industrials", conceptIds: ["solar"], aShares: [
        { ticker: "300274", name: "阳光电源", relation: "对标", note: "逆变器" },
      { ticker: "300763", name: "锦浪科技", relation: "对标", note: "组串逆变器出口" }
    ]},
    { ticker: "LLY", name: "礼来", sectorId: "health", conceptIds: ["biotech"], aShares: [
        { ticker: "600276", name: "恒瑞医药", relation: "对标", note: "创新药管线平台" },
      { ticker: "688235", name: "百济神州", relation: "对标", note: "肿瘤创新药" }
    ]},
    { ticker: "NVO", name: "诺和诺德", sectorId: "health", conceptIds: ["biotech"], aShares: [
        { ticker: "600867", name: "通化东宝", relation: "对标", note: "胰岛素" },
      { ticker: "603087", name: "甘李药业", relation: "对标", note: "胰岛素类似物" }
    ]},
    { ticker: "MRNA", name: "Moderna", sectorId: "health", conceptIds: ["biotech"], aShares: [
        { ticker: "300142", name: "沃森生物", relation: "同概念", note: "疫苗平台" },
      { ticker: "300601", name: "康泰生物", relation: "同概念", note: "疫苗" }
    ]},
    { ticker: "VRTX", name: "Vertex", sectorId: "health", conceptIds: ["biotech"], aShares: [
        { ticker: "688235", name: "百济神州", relation: "同概念", note: "创新药商业化" },
      { ticker: "002294", name: "信立泰", relation: "同概念", note: "慢病与创新转型" }
    ]},
    { ticker: "AAPL", name: "苹果", sectorId: "it", conceptIds: ["internet"], aShares: [
        { ticker: "002475", name: "立讯精密", relation: "供应链", note: "组装与精密结构件" },
      { ticker: "002241", name: "歌尔股份", relation: "供应链", note: "声学、光学与 XR" }
    ]},
    { ticker: "NFLX", name: "奈飞", sectorId: "comm", conceptIds: ["internet"], aShares: [
        { ticker: "300413", name: "芒果超媒", relation: "对标", note: "长视频平台" },
      { ticker: "300251", name: "光线传媒", relation: "同概念", note: "内容制作" }
    ]},
    { ticker: "COST", name: "开市客", sectorId: "staples", conceptIds: ["consumer"], aShares: [
        { ticker: "601933", name: "永辉超市", relation: "同概念", note: "商超零售" },
      { ticker: "603708", name: "家家悦", relation: "同概念", note: "区域连锁商超" }
    ]},
    { ticker: "NKE", name: "耐克", sectorId: "disc", conceptIds: ["consumer"], aShares: [
        { ticker: "300979", name: "华利集团", relation: "供应链", note: "运动鞋履代工" },
      { ticker: "300005", name: "探路者", relation: "同概念", note: "户外运动服饰" }
    ]},
    { ticker: "KO", name: "可口可乐", sectorId: "staples", conceptIds: ["consumer"], aShares: [
        { ticker: "605499", name: "东鹏饮料", relation: "同概念", note: "饮料品牌" },
      { ticker: "000848", name: "承德露露", relation: "同概念", note: "植物蛋白饮料" }
    ]},
    { ticker: "PG", name: "宝洁", sectorId: "staples", conceptIds: ["consumer"], aShares: [
        { ticker: "600315", name: "上海家化", relation: "对标", note: "日化品牌" },
      { ticker: "603605", name: "珀莱雅", relation: "同概念", note: "化妆品" }
    ]},
    { ticker: "XOM", name: "埃克森美孚", sectorId: "energy", conceptIds: ["energy"], aShares: [
        { ticker: "601857", name: "中国石油", relation: "对标", note: "一体化油气" },
      { ticker: "600938", name: "中国海油", relation: "对标", note: "上游油气" }
    ]},
    { ticker: "CVX", name: "雪佛龙", sectorId: "energy", conceptIds: ["energy"], aShares: [
        { ticker: "600028", name: "中国石化", relation: "对标", note: "炼化一体化" }
    ]},
    { ticker: "COP", name: "康菲石油", sectorId: "energy", conceptIds: ["energy"], aShares: [
        { ticker: "600938", name: "中国海油", relation: "对标", note: "上游开发" }
    ]},
    { ticker: "JPM", name: "摩根大通", sectorId: "finance", conceptIds: ["finance"], aShares: [
        { ticker: "600036", name: "招商银行", relation: "对标", note: "零售与综合银行" },
      { ticker: "601166", name: "兴业银行", relation: "对标", note: "股份行" }
    ]},
    { ticker: "GS", name: "高盛", sectorId: "finance", conceptIds: ["finance"], aShares: [
        { ticker: "600030", name: "中信证券", relation: "对标", note: "综合券商" },
      { ticker: "601688", name: "华泰证券", relation: "对标", note: "券商" }
    ]},
    { ticker: "BLK", name: "贝莱德", sectorId: "finance", conceptIds: ["finance"], aShares: [
        { ticker: "300059", name: "东方财富", relation: "同概念", note: "财富管理与流量入口" },
      { ticker: "600030", name: "中信证券", relation: "同概念", note: "机构业务" }
    ]},
    { ticker: "COIN", name: "Coinbase", sectorId: "crypto", conceptIds: ["crypto"], aShares: [
        { ticker: "300059", name: "东方财富", relation: "同概念", note: "互联网券商与交易入口；A 股没有合规加密货币交易所对标" },
      { ticker: "300033", name: "同花顺", relation: "同概念", note: "行情与交易软件" }
    ]},
    { ticker: "MSTR", name: "Strategy", sectorId: "crypto", conceptIds: ["crypto"], aShares: [
        { ticker: "300059", name: "东方财富", relation: "同概念", note: "风险资产交易入口，不是公司比特币财库" },
      { ticker: "002177", name: "御银股份", relation: "同概念", note: "历史上的比特币 ATM / 加密货币概念股" }
    ]},
    { ticker: "MARA", name: "Marathon", sectorId: "crypto", conceptIds: ["crypto"], aShares: [
        { ticker: "300468", name: "四方精创", relation: "同概念", note: "区块链系统，不是矿机或矿场" },
      { ticker: "300386", name: "飞天诚信", relation: "同概念", note: "加密与安全芯片，不是比特币矿企" }
    ]},
    { ticker: "IBIT", name: "iShares比特币ETF", sectorId: "crypto", conceptIds: ["crypto"], aShares: [
        { ticker: "300059", name: "东方财富", relation: "同概念", note: "场内交易与财富管理入口；A 股没有比特币现货 ETF 对标" },
      { ticker: "300773", name: "拉卡拉", relation: "同概念", note: "支付与数字人民币基础设施，不是现货比特币" }
    ]},
    { ticker: "BYDDY", name: "比亚迪ADR", sectorId: "disc", conceptIds: ["ev"], aShares: [
        { ticker: "002594", name: "比亚迪", relation: "ADR", note: "同一公司 A 股" }
    ]},
    { ticker: "FCX", name: "自由港", sectorId: "materials", conceptIds: [], aShares: [
        { ticker: "601899", name: "紫金矿业", relation: "对标", note: "铜金等资源龙头" },
        { ticker: "603993", name: "洛阳钼业", relation: "同概念", note: "铜钴资源" }
    ]},
    { ticker: "LIN", name: "林德", sectorId: "materials", conceptIds: [], aShares: [
        { ticker: "002430", name: "杭氧股份", relation: "对标", note: "工业气体设备" },
        { ticker: "600309", name: "万华化学", relation: "同概念", note: "化工材料平台" }
    ]},
    { ticker: "NEM", name: "纽蒙特", sectorId: "materials", conceptIds: [], aShares: [
        { ticker: "600547", name: "山东黄金", relation: "对标", note: "黄金开采" },
        { ticker: "600489", name: "中金黄金", relation: "对标", note: "黄金冶炼与开采" }
    ]},
    { ticker: "CAT", name: "卡特彼勒", sectorId: "industrials", conceptIds: [], aShares: [
        { ticker: "600031", name: "三一重工", relation: "对标", note: "工程机械龙头" },
        { ticker: "000425", name: "徐工机械", relation: "对标", note: "工程机械" }
    ]},
    { ticker: "GE", name: "通用电气", sectorId: "industrials", conceptIds: [], aShares: [
        { ticker: "600875", name: "东方电气", relation: "同概念", note: "发电设备" },
        { ticker: "601727", name: "上海电气", relation: "同概念", note: "机电设备" }
    ]},
    { ticker: "HON", name: "霍尼韦尔", sectorId: "industrials", conceptIds: [], aShares: [
        { ticker: "300124", name: "汇川技术", relation: "对标", note: "工业自动化" },
        { ticker: "688777", name: "中控技术", relation: "同概念", note: "工业控制" }
    ]},
    { ticker: "UNP", name: "联合太平洋", sectorId: "industrials", conceptIds: [], aShares: [
        { ticker: "601006", name: "大秦铁路", relation: "对标", note: "铁路货运" },
        { ticker: "601816", name: "京沪高铁", relation: "同概念", note: "铁路客运" }
    ]},
    { ticker: "BA", name: "波音", sectorId: "industrials", conceptIds: [], aShares: [
        { ticker: "000768", name: "中航西飞", relation: "对标", note: "航空制造" },
        { ticker: "600760", name: "中航沈飞", relation: "对标", note: "军机整机" }
    ]},
    { ticker: "NEE", name: "新纪元能源", sectorId: "utilities", conceptIds: [], aShares: [
        { ticker: "600900", name: "长江电力", relation: "对标", note: "电力运营龙头" },
        { ticker: "001289", name: "龙源电力", relation: "同概念", note: "新能源发电" }
    ]},
    { ticker: "DUK", name: "杜克能源", sectorId: "utilities", conceptIds: [], aShares: [
        { ticker: "600011", name: "华能国际", relation: "同概念", note: "综合发电" },
        { ticker: "600795", name: "国电电力", relation: "同概念", note: "电力运营" }
    ]},
    { ticker: "SO", name: "南方公司", sectorId: "utilities", conceptIds: [], aShares: [
        { ticker: "601985", name: "中国核电", relation: "同概念", note: "电力运营" },
        { ticker: "600905", name: "三峡能源", relation: "同概念", note: "风光发电" }
    ]},
    { ticker: "PLD", name: "普洛斯", sectorId: "realestate", conceptIds: [], aShares: [
        { ticker: "000002", name: "万科A", relation: "同概念", note: "物流地产与开发" },
        { ticker: "600048", name: "保利发展", relation: "同概念", note: "开发商" }
    ]},
    { ticker: "AMT", name: "美国电塔", sectorId: "realestate", conceptIds: [], aShares: [
        { ticker: "601728", name: "中国铁塔", relation: "对标", note: "通信铁塔基础设施" },
        { ticker: "600050", name: "中国联通", relation: "同概念", note: "通信基础设施需求方" }
    ]},
    { ticker: "SPG", name: "西蒙地产", sectorId: "realestate", conceptIds: [], aShares: [
        { ticker: "001979", name: "招商蛇口", relation: "同概念", note: "商业与园区地产" },
        { ticker: "600048", name: "保利发展", relation: "同概念", note: "开发与持有" }
    ]},
    { ticker: "T", name: "AT&T", sectorId: "comm", conceptIds: [], aShares: [
        { ticker: "600050", name: "中国联通", relation: "对标", note: "电信运营" },
        { ticker: "600941", name: "中国移动", relation: "对标", note: "电信运营" }
    ]},
    { ticker: "VZ", name: "威瑞森", sectorId: "comm", conceptIds: [], aShares: [
        { ticker: "600941", name: "中国移动", relation: "对标", note: "电信运营" },
        { ticker: "600050", name: "中国联通", relation: "对标", note: "电信运营" }
    ]},
    { ticker: "DIS", name: "迪士尼", sectorId: "comm", conceptIds: ["internet"], aShares: [
        { ticker: "300413", name: "芒果超媒", relation: "对标", note: "长视频平台" },
        { ticker: "300251", name: "光线传媒", relation: "同概念", note: "内容制作" }
    ]},
    { ticker: "HD", name: "家得宝", sectorId: "disc", conceptIds: ["consumer"], aShares: [
        { ticker: "603833", name: "欧派家居", relation: "同概念", note: "家居零售" },
        { ticker: "603816", name: "顾家家居", relation: "同概念", note: "家具零售" }
    ]},
    { ticker: "MCD", name: "麦当劳", sectorId: "disc", conceptIds: ["consumer"], aShares: [
        { ticker: "603043", name: "广州酒家", relation: "同概念", note: "餐饮品牌" },
        { ticker: "605108", name: "同庆楼", relation: "同概念", note: "餐饮连锁" }
    ]},
    { ticker: "WMT", name: "沃尔玛", sectorId: "staples", conceptIds: ["consumer"], aShares: [
        { ticker: "601933", name: "永辉超市", relation: "对标", note: "商超零售" },
        { ticker: "603708", name: "家家悦", relation: "同概念", note: "区域商超" }
    ]},
    { ticker: "PEP", name: "百事", sectorId: "staples", conceptIds: ["consumer"], aShares: [
        { ticker: "605499", name: "东鹏饮料", relation: "同概念", note: "饮料品牌" },
        { ticker: "000848", name: "承德露露", relation: "同概念", note: "植物蛋白饮料" }
    ]},
    { ticker: "UNH", name: "联合健康", sectorId: "health", conceptIds: [], aShares: [
        { ticker: "300015", name: "爱尔眼科", relation: "同概念", note: "专科医疗" },
        { ticker: "600763", name: "通策医疗", relation: "同概念", note: "医疗服务" }
    ]},
    { ticker: "JNJ", name: "强生", sectorId: "health", conceptIds: [], aShares: [
        { ticker: "300760", name: "迈瑞医疗", relation: "对标", note: "医疗器械与健康产品" },
        { ticker: "600276", name: "恒瑞医药", relation: "同概念", note: "制药" }
    ]},
    { ticker: "ABT", name: "雅培", sectorId: "health", conceptIds: [], aShares: [
        { ticker: "300760", name: "迈瑞医疗", relation: "对标", note: "体外诊断与器械" },
        { ticker: "603658", name: "安图生物", relation: "同概念", note: "体外诊断" }
    ]}
  ]
};
