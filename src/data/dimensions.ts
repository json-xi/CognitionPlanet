import { CognitiveLevel, Dimension, DimensionId } from '../types';

export const DIMENSIONS: Dimension[] = [
  {
    id: 'critical',
    name: '批判性思维',
    short: '批判思维',
    emoji: '🔍',
    color: '#7C5CFF',
    summary: '能否分辨证据与观点，识别论证中的漏洞。',
    lowHint:
      '你容易接受包装得像结论的说法，还没有形成「先看证据来源」的反射。这是所有其他能力的地基，建议优先补。',
    midHint:
      '你已经会质疑，但质疑往往停在「我觉得不对」，还没有变成可复用的论证检查清单。',
    highHint:
      '你能稳定区分相关与因果、证据与权威。接下来可以练习对自己支持的观点用同样的严格标准。',
  },
  {
    id: 'probability',
    name: '概率与不确定性',
    short: '概率思维',
    emoji: '🎲',
    color: '#4ECDC4',
    summary: '面对不确定信息时，能否用概率而非非黑即白的方式思考。',
    lowHint:
      '你倾向于把世界看成「会发生 / 不会发生」，容易被小样本和极端案例带偏。补上这块收益极大。',
    midHint:
      '你知道要考虑概率，但还没习惯给判断标价——把「大概率」变成具体数字。',
    highHint:
      '你已经能用概率语言思考。下一步是校准：记录预测并回头验证自己的置信度是否准确。',
  },
  {
    id: 'bias',
    name: '认知偏差觉察',
    short: '偏差觉察',
    emoji: '🪞',
    color: '#FFC861',
    summary: '能否察觉自己大脑的系统性出厂设置错误。',
    lowHint:
      '你对自己判断的信心，明显高于判断本身的可靠度。先从认识几个高频偏差开始，效果立竿见影。',
    midHint:
      '你能认出别人身上的偏差，但用在自己身上时还有盲区。这是最常见的卡点。',
    highHint:
      '你对自身偏差有清醒认知。可以进一步研究群体决策中的噪声与制度性纠偏。',
  },
  {
    id: 'systems',
    name: '系统思维',
    short: '系统思维',
    emoji: '🕸️',
    color: '#63A4FF',
    summary: '能否看见结构、反馈回路与二阶效应，而不只是单点因果。',
    lowHint:
      '你倾向于「哪里出问题修哪里」。学会看结构后，你会发现很多反复出现的问题根本不在表面。',
    midHint:
      '你能意识到问题背后有结构，但还缺少描述结构的工具（存量、流量、反馈回路）。',
    highHint:
      '你已经能识别反馈回路和杠杆点。可以进阶到复杂系统与非线性领域。',
  },
  {
    id: 'decision',
    name: '决策质量',
    short: '决策力',
    emoji: '♟️',
    color: '#FF8FA3',
    summary: '能否把认知转化成好决策，而不是被结果好坏牵着走。',
    lowHint:
      '你目前主要用结果反推决策好坏，这会让你从运气中学到错误的教训。',
    midHint:
      '你有决策意识，但缺少固定流程——比如可逆性判断、事前验尸、期望值估算。',
    highHint:
      '你能区分决策质量与结果质量。接下来可以建立个人决策日志，形成长期复利。',
  },
  {
    id: 'meta',
    name: '元认知与学习力',
    short: '元认知',
    emoji: '🧭',
    color: '#9BE58A',
    summary: '能否知道自己知道什么、不知道什么，并高效地修正。',
    lowHint:
      '「觉得懂了」和「真的懂了」之间的差距，是你目前最大的隐性成本。',
    midHint:
      '你有反思习惯，但反思偏感受化，还没变成可检验的记录与对照。',
    highHint:
      '你的自我校准能力不错。可以研究理性本身的心理学基础，把它体系化。',
  },
];

export const DIMENSION_MAP: Record<DimensionId, Dimension> = DIMENSIONS.reduce(
  (acc, d) => {
    acc[d.id] = d;
    return acc;
  },
  {} as Record<DimensionId, Dimension>
);

/** 由低到高排列，查找时从后往前匹配 */
export const LEVELS: CognitiveLevel[] = [
  {
    key: 'dust',
    name: '星尘',
    emoji: '✨',
    min: 0,
    color: '#8B96B8',
    description:
      '你的认知正处在聚合期。此刻的每一次刻意阅读，都会被放大很多倍——这是回报率最高的阶段。',
  },
  {
    key: 'planetesimal',
    name: '星子',
    emoji: '🌑',
    min: 35,
    color: '#63A4FF',
    description:
      '你已经有了自己的判断框架，但还不稳定，容易被强势的叙事推着走。补齐地基后会有明显跃升。',
  },
  {
    key: 'planet',
    name: '行星',
    emoji: '🪐',
    min: 50,
    color: '#4ECDC4',
    description:
      '你已经形成了稳定的思考轨道，能独立处理大多数判断。短板集中在少数几个维度上，针对性补最有效。',
  },
  {
    key: 'star',
    name: '恒星',
    emoji: '⭐',
    min: 65,
    color: '#FFC861',
    description:
      '你不仅能判断，还能给别人提供判断的依据。接下来的提升来自深度而非广度。',
  },
  {
    key: 'galaxy',
    name: '星系',
    emoji: '🌌',
    min: 80,
    color: '#7C5CFF',
    description:
      '你已经建立了跨领域的思维模型网络。剩下的提升空间在于把知识转化为长期一致的行动。',
  },
];

export function getLevel(score: number): CognitiveLevel {
  let matched = LEVELS[0];
  for (const level of LEVELS) {
    if (score >= level.min) matched = level;
  }
  return matched;
}
