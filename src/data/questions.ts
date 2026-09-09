import { Question } from '../types';

/**
 * 每个维度 8 题，共 48 题。
 * 每次评估按维度抽题（见 src/logic/sample.ts），避免重测记住答案。
 * 选项分值 0-100，代表该回答体现的认知水平，非对错二分。
 * 情景题(scenario)测能力，习惯题(habit)测日常行为倾向。
 */
export const QUESTIONS: Question[] = [
  // ───────────────── 批判性思维 ─────────────────
  {
    id: 'c1',
    dimension: 'critical',
    kind: 'scenario',
    text: '朋友转来一篇文章：「研究发现，每天喝咖啡的人平均寿命更长。」你的第一反应是？',
    options: [
      { id: 'a', text: '记下来，以后多喝点咖啡', score: 10 },
      { id: 'b', text: '不太信，咖啡喝多了伤身体', score: 25 },
      { id: 'c', text: '想知道这研究是谁做的、样本有多大', score: 80 },
      {
        id: 'd',
        text: '先想想：会不会是爱喝咖啡的人本来就更健康、社交更多',
        score: 100,
      },
    ],
  },
  {
    id: 'c2',
    dimension: 'critical',
    kind: 'scenario',
    text: '「这个方案肯定行，因为张总也是这么想的。」这句话最主要的问题是？',
    options: [
      { id: 'a', text: '没问题，张总经验丰富', score: 0 },
      { id: 'b', text: '说话的人态度太绝对了', score: 35 },
      { id: 'c', text: '张总也可能判断失误', score: 60 },
      { id: 'd', text: '它用「谁说的」替代了「凭什么」', score: 100 },
    ],
  },
  {
    id: 'c3',
    dimension: 'critical',
    kind: 'scenario',
    text: '以下哪种情况，最能支持「A 导致了 B」这个结论？',
    options: [
      { id: 'a', text: '很多专家都认为 A 导致 B', score: 5 },
      { id: 'b', text: 'A 和 B 总是同时出现', score: 20 },
      { id: 'c', text: '每次都是 A 先出现，B 随后出现', score: 40 },
      {
        id: 'd',
        text: '随机分组后，被施加 A 的那组出现 B 明显更多',
        score: 100,
      },
    ],
  },
  {
    id: 'c4',
    dimension: 'critical',
    kind: 'scenario',
    text: '争论中对方说：「你又不是做这行的，没资格评论。」这属于？',
    options: [
      { id: 'a', text: '合理的质疑，我确实不够专业', score: 20 },
      { id: 'b', text: '对方只是情绪上来了', score: 40 },
      { id: 'c', text: '稻草人谬误', score: 45 },
      { id: 'd', text: '攻击发言者而非论点，回避了问题本身', score: 100 },
    ],
  },
  {
    id: 'c5',
    dimension: 'critical',
    kind: 'habit',
    text: '当你看到一个恰好支持自己观点的数据时，你通常会？',
    options: [
      { id: 'a', text: '很高兴，直接拿去引用', score: 10 },
      { id: 'b', text: '觉得终于有证据了', score: 25 },
      { id: 'c', text: '会顺手看一眼数据来源', score: 65 },
      {
        id: 'd',
        text: '用检验反对意见时同样严格的标准去检验它',
        score: 100,
      },
    ],
  },
  {
    id: 'c6',
    dimension: 'critical',
    kind: 'scenario',
    text: '一篇报道说：「调查显示，90% 的受访者支持该政策。」你最该先问什么？',
    options: [
      { id: 'a', text: '另外 10% 为什么反对', score: 25 },
      { id: 'b', text: '这个政策到底好不好', score: 15 },
      { id: 'c', text: '是不是权威媒体发的', score: 35 },
      {
        id: 'd',
        text: '受访者是谁、怎么抽的、一共问了多少人',
        score: 100,
      },
    ],
  },
  {
    id: 'c7',
    dimension: 'critical',
    kind: 'scenario',
    text: '有人说：「要么全面支持，要么就是反对进步。」这句话的问题是？',
    options: [
      { id: 'a', text: '语气太冲，容易伤人', score: 20 },
      { id: 'b', text: '没给出具体例子', score: 35 },
      { id: 'c', text: '把复杂立场压成了非此即彼的假两难', score: 100 },
      { id: 'd', text: '偷换了「进步」这个概念', score: 55 },
    ],
  },
  {
    id: 'c8',
    dimension: 'critical',
    kind: 'habit',
    text: '看到一条爆炸性新闻时，你通常会？',
    options: [
      { id: 'a', text: '先转发出去，重要的是快', score: 0 },
      { id: 'b', text: '看完标题就形成判断', score: 15 },
      { id: 'c', text: '会读完正文再决定信不信', score: 55 },
      {
        id: 'd',
        text: '先找原始来源或第二家独立报道交叉核实',
        score: 100,
      },
    ],
  },

  // ───────────────── 概率与不确定性 ─────────────────
  {
    id: 'p1',
    dimension: 'probability',
    kind: 'scenario',
    text: '某病发病率为千分之一，检测准确率 99%（健康人有 1% 会被误报）。你检测呈阳性，真正患病的概率大约是？',
    options: [
      { id: 'a', text: '约 99%', score: 5 },
      { id: 'b', text: '约 50%', score: 45 },
      { id: 'c', text: '约 9%', score: 100 },
      { id: 'd', text: '约 1%', score: 25 },
    ],
  },
  {
    id: 'p2',
    dimension: 'probability',
    kind: 'scenario',
    text: '一枚公平硬币连续 5 次都是正面，第 6 次出现反面的概率是？',
    options: [
      { id: 'a', text: '大于 50%，该轮到反面了', score: 5 },
      { id: 'b', text: '小于 50%，正在连正面的势头上', score: 10 },
      { id: 'c', text: '说不好，要看具体情况', score: 30 },
      { id: 'd', text: '仍然是 50%', score: 100 },
    ],
  },
  {
    id: 'p3',
    dimension: 'probability',
    kind: 'scenario',
    text: '你说某件事「我有 70% 的把握」，最准确的含义是？',
    options: [
      { id: 'a', text: '大概七成的人会同意我', score: 5 },
      { id: 'b', text: '只是个说法，没有精确含义', score: 15 },
      { id: 'c', text: '我比较确定，但不敢打包票', score: 30 },
      {
        id: 'd',
        text: '类似情形我说 100 次 70%，其中约 70 次会成真',
        score: 100,
      },
    ],
  },
  {
    id: 'p4',
    dimension: 'probability',
    kind: 'scenario',
    text: '某投资策略过去三年年化收益 40%。你的判断更接近？',
    options: [
      { id: 'a', text: '策略很强，值得跟进', score: 10 },
      { id: 'b', text: '过去不代表未来，所以完全没参考价值', score: 40 },
      { id: 'c', text: '得先看这三年的市场环境和最大回撤', score: 75 },
      {
        id: 'd',
        text: '三年的样本太短，还分不清是能力还是运气',
        score: 100,
      },
    ],
  },
  {
    id: 'p5',
    dimension: 'probability',
    kind: 'habit',
    text: '做重要判断时，你会给不同结果明确估一个概率数字吗？',
    options: [
      { id: 'a', text: '从来不会，凭感觉', score: 0 },
      { id: 'b', text: '很少，通常只说「可能」「大概」', score: 25 },
      { id: 'c', text: '偶尔会在心里估一下', score: 55 },
      { id: 'd', text: '经常会，而且事后会回头看估得准不准', score: 100 },
    ],
  },
  {
    id: 'p6',
    dimension: 'probability',
    kind: 'scenario',
    text: '天气预报说「明天下雨概率 30%」。最准确的理解是？',
    options: [
      { id: 'a', text: '明天大概会下三分之一天的雨', score: 10 },
      { id: 'b', text: '明天有 30% 的地区会下雨', score: 20 },
      { id: 'c', text: '气象员自己也不太确定', score: 30 },
      {
        id: 'd',
        text: '类似条件下，大约 10 次里有 3 次会下雨',
        score: 100,
      },
    ],
  },
  {
    id: 'p7',
    dimension: 'probability',
    kind: 'scenario',
    text: '连续三次抽中大奖后，有人说「手气热，再来一次」。你怎么看？',
    options: [
      { id: 'a', text: '有道理，运气会延续', score: 5 },
      { id: 'b', text: '恰恰相反，该冷却了', score: 15 },
      { id: 'c', text: '要看奖池还剩多少', score: 35 },
      {
        id: 'd',
        text: '独立事件彼此无关，过去结果不改变下一次概率',
        score: 100,
      },
    ],
  },
  {
    id: 'p8',
    dimension: 'probability',
    kind: 'habit',
    text: '面对「几乎确定」和「有一点可能」这类说法，你会？',
    options: [
      { id: 'a', text: '直接按字面意思接受', score: 10 },
      { id: 'b', text: '觉得差不多就行，不必较真', score: 25 },
      { id: 'c', text: '会在心里换成大概的百分比', score: 65 },
      {
        id: 'd',
        text: '会要求对方给出数字区间，并记下事后对照',
        score: 100,
      },
    ],
  },

  // ───────────────── 认知偏差觉察 ─────────────────
  {
    id: 'b1',
    dimension: 'bias',
    kind: 'scenario',
    text: '「成功的创业者都很能坚持，所以坚持是成功的关键。」这个推理忽略了什么？',
    options: [
      { id: 'a', text: '没忽略什么，坚持确实重要', score: 5 },
      { id: 'b', text: '成功还需要运气和资源', score: 50 },
      { id: 'c', text: '创业者的样本量太小', score: 35 },
      {
        id: 'd',
        text: '那些同样坚持、却失败了因而我们看不见的人',
        score: 100,
      },
    ],
  },
  {
    id: 'b2',
    dimension: 'bias',
    kind: 'scenario',
    text: '商品标签写着「原价 2999，现价 999」，主要利用的是？',
    options: [
      { id: 'a', text: '从众心理', score: 20 },
      { id: 'b', text: '稀缺效应', score: 30 },
      { id: 'c', text: '损失厌恶', score: 45 },
      { id: 'd', text: '锚定效应', score: 100 },
    ],
  },
  {
    id: 'b3',
    dimension: 'bias',
    kind: 'scenario',
    text: '一个项目你已投入八个月，现在发现方向大概率是错的。你会？',
    options: [
      { id: 'a', text: '再坚持坚持，都投入这么久了', score: 0 },
      { id: 'b', text: '很纠结，很难真正放手', score: 30 },
      { id: 'c', text: '直接放弃，不想再纠结', score: 50 },
      {
        id: 'd',
        text: '提醒自己已投入的是沉没成本，只比较从现在起的收益',
        score: 100,
      },
    ],
  },
  {
    id: 'b4',
    dimension: 'bias',
    kind: 'habit',
    text: '你多久会主动读一篇明确反对你观点的深度内容？',
    options: [
      { id: 'a', text: '几乎不会', score: 0 },
      { id: 'b', text: '偶尔刷到了会看两眼', score: 30 },
      { id: 'c', text: '每个月至少认真读一次', score: 65 },
      {
        id: 'd',
        text: '我专门订阅了几个观点和我不同但很靠谱的信息源',
        score: 100,
      },
    ],
  },
  {
    id: 'b5',
    dimension: 'bias',
    kind: 'habit',
    text: '事情发生后，你常有「我早就知道会这样」的感觉吗？',
    options: [
      { id: 'a', text: '经常有，说明我判断挺准的', score: 5 },
      { id: 'b', text: '有时会有', score: 40 },
      { id: 'c', text: '有，但我知道这多半是后见之明在作祟', score: 80 },
      { id: 'd', text: '我会提前把预测写下来，事后拿出来对照', score: 100 },
    ],
  },
  {
    id: 'b6',
    dimension: 'bias',
    kind: 'scenario',
    text: '你买了一只股票后，开始只看利好新闻、跳过利空分析。这主要是？',
    options: [
      { id: 'a', text: '信息过载，只能挑着看', score: 20 },
      { id: 'b', text: '正常的风险控制', score: 10 },
      { id: 'c', text: '确认偏误：只搜集支持既有立场的信息', score: 100 },
      { id: 'd', text: '损失厌恶在作祟', score: 45 },
    ],
  },
  {
    id: 'b7',
    dimension: 'bias',
    kind: 'scenario',
    text: '团队里第一个发言的人定了调，后面的人纷纷附和。最可能发生了什么？',
    options: [
      { id: 'a', text: '大家本来就意见一致', score: 15 },
      { id: 'b', text: '第一个人权威高，别人不敢反驳', score: 50 },
      { id: 'c', text: '话题本身没什么可争的', score: 20 },
      {
        id: 'd',
        text: '锚定 + 从众：早期意见压缩了后续独立判断的空间',
        score: 100,
      },
    ],
  },
  {
    id: 'b8',
    dimension: 'bias',
    kind: 'habit',
    text: '做完一个重要决定后，你会主动寻找「反对这个决定」的理由吗？',
    options: [
      { id: 'a', text: '不会，决定了就往前走', score: 10 },
      { id: 'b', text: '偶尔会，但很快就放弃', score: 35 },
      { id: 'c', text: '重大决定会刻意找反方意见', score: 75 },
      {
        id: 'd',
        text: '会，而且尽量在决定落地前就完成这一步',
        score: 100,
      },
    ],
  },

  // ───────────────── 系统思维 ─────────────────
  {
    id: 's1',
    dimension: 'systems',
    kind: 'scenario',
    text: '某城市为治堵拓宽了主干道，一年后拥堵反而更严重。最可能的解释是？',
    options: [
      { id: 'a', text: '拓宽得还不够宽', score: 10 },
      { id: 'b', text: '施工期间的影响还没消退', score: 5 },
      { id: 'c', text: '这段时间车辆保有量增加了', score: 40 },
      {
        id: 'd',
        text: '路更好走吸引了更多车流，形成了增强回路',
        score: 100,
      },
    ],
  },
  {
    id: 's2',
    dimension: 'systems',
    kind: 'scenario',
    text: '一个问题在团队里反复出现，你更倾向于？',
    options: [
      { id: 'a', text: '找到该负责的人', score: 10 },
      { id: 'b', text: '每次出现就快速把它解决掉', score: 25 },
      { id: 'c', text: '制定更严格的流程规范', score: 50 },
      { id: 'd', text: '去找是什么结构和激励在持续生产这个问题', score: 100 },
    ],
  },
  {
    id: 's3',
    dimension: 'systems',
    kind: 'scenario',
    text: '「二阶效应」指的是？',
    options: [
      { id: 'a', text: '第二重要的那个影响', score: 15 },
      { id: 'b', text: '意料之外的副作用', score: 35 },
      { id: 'c', text: '长期才会显现的影响', score: 45 },
      { id: 'd', text: '一个行动的后果本身所引发的后续后果', score: 100 },
    ],
  },
  {
    id: 's4',
    dimension: 'systems',
    kind: 'scenario',
    text: '要真正改变一个系统的行为，通常最有效的是？',
    options: [
      { id: 'a', text: '换掉执行的人', score: 15 },
      { id: 'b', text: '投入更多资源', score: 20 },
      { id: 'c', text: '加强监督和考核力度', score: 40 },
      { id: 'd', text: '改变系统的目标和游戏规则', score: 100 },
    ],
  },
  {
    id: 's5',
    dimension: 'systems',
    kind: 'habit',
    text: '做决定时，你会追问「然后呢？再然后呢？」往下推演几步吗？',
    options: [
      { id: 'a', text: '基本不会，想清楚眼前就行', score: 0 },
      { id: 'b', text: '只有重大决策才会', score: 55 },
      { id: 'c', text: '经常会推演两三步', score: 80 },
      {
        id: 'd',
        text: '习惯性会，还会想「如果所有人都这么做会怎样」',
        score: 100,
      },
    ],
  },
  {
    id: 's6',
    dimension: 'systems',
    kind: 'scenario',
    text: '公司给销售提成按「成交单数」算，结果客服投诉暴增。最可能的原因是？',
    options: [
      { id: 'a', text: '客服人手不够', score: 20 },
      { id: 'b', text: '产品本身质量下降了', score: 30 },
      { id: 'c', text: '客户最近变得更挑剔', score: 15 },
      {
        id: 'd',
        text: '激励结构推动了「先成交再说」，把问题转移到下游',
        score: 100,
      },
    ],
  },
  {
    id: 's7',
    dimension: 'systems',
    kind: 'scenario',
    text: '「延迟」在系统里通常意味着？',
    options: [
      { id: 'a', text: '做事的人效率低', score: 10 },
      { id: 'b', text: '信息传得出了问题', score: 35 },
      { id: 'c', text: '因果之间存在时间差，容易让人误判干预效果', score: 100 },
      { id: 'd', text: '需要加更多监控节点', score: 40 },
    ],
  },
  {
    id: 's8',
    dimension: 'systems',
    kind: 'habit',
    text: '遇到反复出现的问题时，你更常做的是？',
    options: [
      { id: 'a', text: '每次都用最快的办法先压下去', score: 15 },
      { id: 'b', text: '换个人来负责同一件事', score: 25 },
      { id: 'c', text: '写一份更细的操作手册', score: 50 },
      {
        id: 'd',
        text: '画清相关方、激励和反馈回路，再决定改哪里',
        score: 100,
      },
    ],
  },

  // ───────────────── 决策质量 ─────────────────
  {
    id: 'd1',
    dimension: 'decision',
    kind: 'scenario',
    text: '判断一个决策做得好不好，最合理的标准是？',
    options: [
      { id: 'a', text: '看最后结果好不好', score: 10 },
      { id: 'b', text: '看事后有没有后悔', score: 20 },
      { id: 'c', text: '看有没有听取足够多人的意见', score: 30 },
      {
        id: 'd',
        text: '看当时是否用好了能拿到的信息、推理是否成立',
        score: 100,
      },
    ],
  },
  {
    id: 'd2',
    dimension: 'decision',
    kind: 'scenario',
    text: '在两个都还不错的选项之间纠结时，你通常？',
    options: [
      { id: 'a', text: '反复比较，常常拖很久', score: 20 },
      { id: 'b', text: '问问别人的意见', score: 35 },
      { id: 'c', text: '凭直觉挑一个', score: 50 },
      {
        id: 'd',
        text: '先判断这个决定可不可逆，可逆就快速做',
        score: 100,
      },
    ],
  },
  {
    id: 'd3',
    dimension: 'decision',
    kind: 'scenario',
    text: '一个期望值为正、但有 30% 概率会亏损的机会，你的态度是？',
    options: [
      { id: 'a', text: '有亏损可能就不碰', score: 20 },
      { id: 'b', text: '看金额大小再说', score: 50 },
      { id: 'c', text: '期望值为正就做', score: 60 },
      {
        id: 'd',
        text: '只要能重复多次、且单次亏损不致命，就做',
        score: 100,
      },
    ],
  },
  {
    id: 'd4',
    dimension: 'decision',
    kind: 'habit',
    text: '「机会成本」在你的日常决策里扮演什么角色？',
    options: [
      { id: 'a', text: '基本没考虑过', score: 0 },
      { id: 'b', text: '听过这个词，但不常用', score: 25 },
      { id: 'c', text: '花大钱的时候会想一想', score: 60 },
      {
        id: 'd',
        text: '花时间时也会想「这段时间本来能用来做什么」',
        score: 100,
      },
    ],
  },
  {
    id: 'd5',
    dimension: 'decision',
    kind: 'habit',
    text: '重要决策前，你会做「事前验尸」吗（假设它已经失败，倒推原因）？',
    options: [
      { id: 'a', text: '没这么做过', score: 0 },
      { id: 'b', text: '会大致想想有什么风险', score: 40 },
      { id: 'c', text: '会认真列一份风险清单', score: 70 },
      { id: 'd', text: '会正式做一遍，并据此修改方案', score: 100 },
    ],
  },
  {
    id: 'd6',
    dimension: 'decision',
    kind: 'scenario',
    text: '两个方案：A 稳赚小钱，B 有机会大赚也可能亏本。你怎么选？',
    options: [
      { id: 'a', text: '永远选稳的，不冒险', score: 25 },
      { id: 'b', text: '选看起来更刺激的那个', score: 15 },
      { id: 'c', text: '看身边的人怎么选', score: 20 },
      {
        id: 'd',
        text: '比较期望值、下行风险和自己能否承受最坏结果',
        score: 100,
      },
    ],
  },
  {
    id: 'd7',
    dimension: 'decision',
    kind: 'scenario',
    text: '一个决定做错了，但结果碰巧很好。你的反应更接近？',
    options: [
      { id: 'a', text: '结果好就说明决定是对的', score: 5 },
      { id: 'b', text: '庆幸自己运气不错，然后翻篇', score: 35 },
      { id: 'c', text: '有点不安，但说不清为什么', score: 50 },
      {
        id: 'd',
        text: '仍然按决策当时的信息质量来复盘，不让好运掩盖坏过程',
        score: 100,
      },
    ],
  },
  {
    id: 'd8',
    dimension: 'decision',
    kind: 'habit',
    text: '面对可逆的小决定（比如换个工具试用），你通常？',
    options: [
      { id: 'a', text: '还是会纠结很久', score: 15 },
      { id: 'b', text: '拖到不得不选', score: 25 },
      { id: 'c', text: '会尽快选定一个先试', score: 70 },
      {
        id: 'd',
        text: '先判断可逆性，可逆就设短周期试点，不可逆才深入分析',
        score: 100,
      },
    ],
  },

  // ───────────────── 元认知与学习力 ─────────────────
  {
    id: 'm1',
    dimension: 'meta',
    kind: 'habit',
    text: '你能清楚说出自己知识边界在哪里吗？',
    options: [
      { id: 'a', text: '没认真想过这个问题', score: 0 },
      { id: 'b', text: '大概有个模糊的感觉', score: 35 },
      { id: 'c', text: '比较清楚哪些领域自己是外行', score: 70 },
      {
        id: 'd',
        text: '很清楚，也能坦然说出「这个我不懂」',
        score: 100,
      },
    ],
  },
  {
    id: 'm2',
    dimension: 'meta',
    kind: 'scenario',
    text: '学习新知识时，哪种方式你用得最多？',
    options: [
      { id: 'a', text: '反复阅读、划重点', score: 20 },
      { id: 'b', text: '看讲解视频', score: 25 },
      { id: 'c', text: '做笔记、整理成体系', score: 50 },
      { id: 'd', text: '合上书自我测验，尝试复述给别人听', score: 100 },
    ],
  },
  {
    id: 'm3',
    dimension: 'meta',
    kind: 'scenario',
    text: '关于「我觉得我懂了」这种感觉，你认为？',
    options: [
      { id: 'a', text: '说明确实是懂了', score: 5 },
      { id: 'b', text: '大概率是懂了', score: 25 },
      { id: 'c', text: '因人而异，看情况', score: 40 },
      { id: 'd', text: '很不可靠，能讲清楚给外行听才算数', score: 100 },
    ],
  },
  {
    id: 'm4',
    dimension: 'meta',
    kind: 'habit',
    text: '发现自己错了的时候，你的第一反应通常是？',
    options: [
      { id: 'a', text: '先解释一下当时的客观情况', score: 15 },
      { id: 'b', text: '有点难受，但会尽快翻篇', score: 30 },
      { id: 'c', text: '不太舒服，但会承认', score: 55 },
      { id: 'd', text: '好奇：我是在哪一步推错的', score: 100 },
    ],
  },
  {
    id: 'm5',
    dimension: 'meta',
    kind: 'habit',
    text: '你会定期回头检查自己过去的判断准不准吗？',
    options: [
      { id: 'a', text: '从来不会', score: 0 },
      { id: 'b', text: '偶尔想起来会感慨一下', score: 30 },
      { id: 'c', text: '会回顾，但主要凭印象', score: 60 },
      { id: 'd', text: '有决策记录，会定期拿出来对照复盘', score: 100 },
    ],
  },
  {
    id: 'm6',
    dimension: 'meta',
    kind: 'scenario',
    text: '刚学完一个概念，感觉「懂了」。下一步最有效的是？',
    options: [
      { id: 'a', text: '马上学下一个，趁热打铁', score: 15 },
      { id: 'b', text: '再把原文重读一遍加深印象', score: 25 },
      { id: 'c', text: '把笔记整理得更漂亮', score: 35 },
      {
        id: 'd',
        text: '合上材料，尝试用自己的话讲给外行听或做几道题',
        score: 100,
      },
    ],
  },
  {
    id: 'm7',
    dimension: 'meta',
    kind: 'habit',
    text: '学习时遇到卡壳，你更常怎么做？',
    options: [
      { id: 'a', text: '跳过，以后再说', score: 15 },
      { id: 'b', text: '反复盯着同一段看', score: 30 },
      { id: 'c', text: '换个讲解或例子再试', score: 65 },
      {
        id: 'd',
        text: '先定位卡在哪一步，再针对缺口补材料或练习',
        score: 100,
      },
    ],
  },
  {
    id: 'm8',
    dimension: 'meta',
    kind: 'habit',
    text: '对于「我是不是高估了自己的理解」，你会？',
    options: [
      { id: 'a', text: '很少怀疑自己', score: 10 },
      { id: 'b', text: '偶尔会担心，但没有具体动作', score: 35 },
      { id: 'c', text: '会刻意找题或找人提问来检验', score: 80 },
      {
        id: 'd',
        text: '把它当成常规习惯：预测自己的表现，再和实际结果对照',
        score: 100,
      },
    ],
  },
];

/** 题库总量 */
export const QUESTION_BANK_SIZE = QUESTIONS.length;

/** 每次评估抽题数 = 维度数 × 每维抽题数 */
export const QUESTIONS_PER_DIMENSION = 3;

/** @deprecated 请用 QUESTION_BANK_SIZE；保留别名以免旧引用报错 */
export const QUESTION_COUNT = QUESTION_BANK_SIZE;
