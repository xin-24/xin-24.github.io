import type { CalendarItem, ContentPlan, KocProfile, Platform, ProfileDiagnosis, ReviewInsight, TopicIdea } from "./types";

export const platformLabels: Record<Platform, string> = {
  xiaohongshu: "小红书",
  douyin: "抖音",
  shipinhao: "视频号",
  bilibili: "B站"
};

export const goalLabels = {
  followers: "涨粉",
  engagement: "互动",
  conversion: "转化",
  brand_deal: "商单"
};

export const stageLabels = {
  new: "新号冷启动",
  growing: "增长爬坡",
  stable: "稳定运营"
};

export const demoProfile: KocProfile = {
  niche: "轻食控糖与上班族便当",
  platform: "xiaohongshu",
  stage: "growing",
  audience: "25-35 岁一线城市上班族，想瘦但没有时间研究营养",
  style: "理性、干净、有一点朋友式吐槽",
  painPoints: ["选题重复", "内容转粉弱", "不知道如何植入产品", "复盘只看点赞"],
  goal: "followers"
};

export const demoDiagnosis: ProfileDiagnosis = {
  persona: "懂营养但不说教的控糖便当搭子",
  positioning: "把复杂营养知识翻译成上班族 15 分钟能执行的控糖饮食方案，用真实通勤场景建立信任。",
  scores: {
    audienceMatch: 92,
    differentiation: 84,
    contentConsistency: 88,
    businessPotential: 79
  },
  opportunities: [
    "把「控糖」拆成便利店、外卖、公司微波炉三个高频场景，降低用户行动门槛。",
    "用连续 7 天实验型内容建立账号记忆点，比单条菜谱更容易被收藏。",
    "在每条内容末尾加入可复用的决策口诀，提高评论区互动和转发。"
  ],
  risks: [
    "过度强调体重变化会削弱长期信任，应突出精力、饱腹和执行成本。",
    "如果只发布成品图，容易被归类为普通食谱号，需要增加决策过程和踩坑对比。"
  ]
};

export const demoTopics: TopicIdea[] = [
  {
    id: "topic-1",
    title: "我用 23 元便利店午餐，拼出一份不困的控糖组合",
    platform: "xiaohongshu",
    contentType: "场景实验",
    audienceMatch: 96,
    viralPotential: 90,
    productionDifficulty: 32,
    commercialValue: 78,
    reason: "便利店是上班族最高频场景，预算明确、结果可验证，天然适合收藏和评论补充。"
  },
  {
    id: "topic-2",
    title: "外卖不知道点什么？照这个 3 步法避开下午犯困",
    platform: "douyin",
    contentType: "快节奏口播",
    audienceMatch: 91,
    viralPotential: 87,
    productionDifficulty: 28,
    commercialValue: 74,
    reason: "用强痛点开场，把抽象营养建议压缩成可执行算法，适合短视频快速传播。"
  },
  {
    id: "topic-3",
    title: "办公室微波炉便当：5 分钟组装、饱到晚上 6 点",
    platform: "xiaohongshu",
    contentType: "清单教程",
    audienceMatch: 89,
    viralPotential: 76,
    productionDifficulty: 45,
    commercialValue: 82,
    reason: "内容可沉淀为系列模板，也能自然承接便当盒、调味品、低 GI 食材合作。"
  },
  {
    id: "topic-4",
    title: "一周控糖复盘：哪一天最容易破防，怎么提前补救",
    platform: "bilibili",
    contentType: "复盘长视频",
    audienceMatch: 82,
    viralPotential: 68,
    productionDifficulty: 58,
    commercialValue: 70,
    reason: "长内容强化专业可信度，适合作为账号背书资产，再切片到短视频平台。"
  }
];

export const demoContentPlan: ContentPlan = {
  topicId: "topic-1",
  titles: [
    "23 元便利店控糖午餐：下午真的没犯困",
    "打工人别乱买午餐了，这套组合饱到 5 点",
    "便利店也能控糖？我把选择逻辑摊开讲"
  ],
  hooks: [
    "如果你每天下午 3 点开始灵魂出走，先别怪咖啡，可能是午餐搭错了。",
    "今天不做精致饭盒，只用楼下便利店，拼一份真实上班族能买到的控糖午餐。",
    "这不是减肥餐，是让你下午还能开会不走神的午餐算法。"
  ],
  script:
    "开场展示便利店货架和账单，快速抛出下午犯困痛点。随后用三格画面拆解选择逻辑：先选蛋白质，再选高纤维主食，最后补一个无糖饮品或蔬菜。中段展示错误组合对比，例如甜饮加饭团为什么容易血糖波动。结尾给出口诀：有蛋白、有纤维、少甜饮，并引导评论区留下附近便利店品牌，下一条做对应版本。",
  storyboard: [
    "镜头 1：便利店门口和手机时间，字幕「12:18，午餐只剩 10 分钟」。",
    "镜头 2：手拿饭团、鸡胸肉、沙拉三件商品，屏幕右侧显示价格。",
    "镜头 3：错误组合红色标注，解释甜饮和精制碳水叠加。",
    "镜头 4：正确组合摆盘，显示饱腹、预算、执行难度三项评分。",
    "镜头 5：口播总结口诀，引导评论区点名便利店。"
  ],
  coverCopy: ["23 元控糖午餐", "便利店也能吃稳", "下午不犯困组合"],
  hashtags: ["#控糖午餐", "#上班族便当", "#便利店减脂", "#小红书健康生活", "#打工人吃什么"],
  commentReplies: [
    "可以，把你常去的便利店名字发我，我下一条按那个品牌做。",
    "如果下午会饿，优先加蛋白质，不建议只加一份甜玉米。",
    "这个组合不是越低卡越好，重点是让血糖波动小一点。"
  ]
};

export const demoCalendar: CalendarItem[] = [
  { id: "cal-1", day: "周一", time: "12:10", platform: "xiaohongshu", topic: "23 元便利店控糖午餐", goal: "收藏", status: "ready" },
  { id: "cal-2", day: "周二", time: "18:30", platform: "douyin", topic: "外卖 3 步避坑法", goal: "完播", status: "edit" },
  { id: "cal-3", day: "周三", time: "08:20", platform: "shipinhao", topic: "早餐别只喝拿铁", goal: "转发", status: "shoot" },
  { id: "cal-4", day: "周四", time: "12:15", platform: "xiaohongshu", topic: "公司微波炉便当清单", goal: "收藏", status: "brief" },
  { id: "cal-5", day: "周五", time: "20:45", platform: "bilibili", topic: "一周控糖复盘", goal: "关注", status: "brief" },
  { id: "cal-6", day: "周六", time: "10:30", platform: "xiaohongshu", topic: "周末备菜 4 件套", goal: "商单种草", status: "shoot" },
  { id: "cal-7", day: "周日", time: "21:10", platform: "douyin", topic: "下周午餐投票", goal: "互动", status: "ready" }
];

export const demoReview: ReviewInsight = {
  metricSummary: {
    views: 48200,
    likes: 3160,
    comments: 428,
    saves: 5900,
    followerGain: 1260
  },
  diagnosis:
    "收藏率明显高于互动率，说明内容具备强工具属性，但评论触发点还不够具体。建议下一轮把结尾问题从泛泛提问改成平台点名，例如「你楼下是罗森还是全家」。",
  nextActions: [
    "把便利店选题拆成 3 个品牌版本，形成连续追更。",
    "封面统一使用价格数字和结果承诺，提高系列识别度。",
    "评论区置顶收集城市和便利店品牌，反向生成下一周内容池。",
    "尝试引入低糖调味品或便当盒软植入，测试商业转化。"
  ]
};
