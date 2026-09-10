import { CognitiveLevel, Dimension, DimensionId } from '../types';

/**
 * 五维认知模型：
 * 元认知看清自己 → 专注力守住注意力 → 学习力吸收转化 → 行动力落地完成
 * → 情绪力托住前四项不被冲垮。
 */
export const DIMENSIONS: Dimension[] = [
  {
    id: 'meta',
    name: '元认知',
    short: '元认知',
    emoji: '🧭',
    color: '#7C5CFF',
    summary: '我清楚自己的强弱，并会据此调整吗？',
    lowHint:
      '你对自己的判断多半停留在感觉：「好像还行」「可能不太好」。缺少对照和记录，强弱边界是糊的，调整也就无从谈起。',
    midHint:
      '你对自己有大致画像，但调整往往事后才发生。把「我觉得」变成可检验的记录，元认知才会真正驱动行为。',
    highHint:
      '你能比较清楚地看见自己的强弱，并主动改策略。下一步是缩短反馈环——更早发现偏差，更小代价修正。',
  },
  {
    id: 'focus',
    name: '专注力',
    short: '专注力',
    emoji: '🎯',
    color: '#4ECDC4',
    summary: '我能持续聚焦，不被随时带走吗？',
    lowHint:
      '你的注意力很容易被通知、对话和「先看一眼」撕碎。深度工作几乎开不起来，其他能力再强也难发挥。',
    midHint:
      '你能进入状态，但维持不长，环境稍有扰动就断。需要的是可执行的护栏，而不只是「再努力一点」。',
    highHint:
      '你已经能守住较长的专注块。接下来可以练切换质量：进入快、退出干净、恢复也快。',
  },
  {
    id: 'learning',
    name: '学习力',
    short: '学习力',
    emoji: '📚',
    color: '#63A4FF',
    summary: '我学得进、记得住、用得出吗？',
    lowHint:
      '你投入了时间，但留存差、迁移弱——读过、听过，却很少真正变成自己的工具。先改方法，比加时长更划算。',
    midHint:
      '你能学会新东西，但「懂了」和「用得出」之间还有缺口。检索练习、间隔复习、真实场景演练会把缺口补上。',
    highHint:
      '你已经具备把输入变成输出的闭环。下一步是体系化：主动构建知识网络，并定期清理过时模型。',
  },
  {
    id: 'action',
    name: '行动力',
    short: '行动力',
    emoji: '🚀',
    color: '#FF8FA3',
    summary: '我能把想法变成完成的事吗？',
    lowHint:
      '你的清单很长，完成的很少。启动成本高、中断后难重启，想法停在头脑里就蒸发了。先降低启动门槛。',
    midHint:
      '你能推进重要事项，但稳定性不够——状态好时猛干，状态差时全面停摆。需要把完成变成不依赖情绪的系统。',
    highHint:
      '你已经能较稳定地把事做完。接下来可以练取舍：少做、做对、做透，让完成的事复利增长。',
  },
  {
    id: 'emotion',
    name: '情绪力',
    short: '情绪力',
    emoji: '💗',
    color: '#FFC861',
    summary: '我能识别并调节情绪，不让它毁掉前四项吗？',
    lowHint:
      '情绪一上来，专注、学习、行动都会被冲掉，事后才意识到「又被带走了」。先练识别，再谈调节。',
    midHint:
      '你能察觉情绪，但调节手段偏单一，常常靠硬扛或逃避。扩展工具箱，情绪才会从障碍变成信息。',
    highHint:
      '你已经能在情绪波动时保底运转。下一步是用情绪做导航：它在提示什么需求、什么边界、什么价值。',
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
      '你的五维能力还在聚合。此刻任何一项的刻意练习，都会被放大很多倍——这是回报率最高的阶段。',
  },
  {
    key: 'planetesimal',
    name: '星子',
    emoji: '🌑',
    min: 35,
    color: '#63A4FF',
    description:
      '你已经有了雏形，但还不稳定，容易被干扰和情绪推着走。先补最短的那块板，整体会明显上升。',
  },
  {
    key: 'planet',
    name: '行星',
    emoji: '🪐',
    min: 50,
    color: '#4ECDC4',
    description:
      '你已经形成了可运转的轨道：能学、能做、大体稳得住。短板集中在少数维度，针对性补最有效。',
  },
  {
    key: 'star',
    name: '恒星',
    emoji: '⭐',
    min: 65,
    color: '#FFC861',
    description:
      '你不仅自己运转得好，还能把方法讲清楚。接下来的提升来自深度打磨，而不是再堆新习惯。',
  },
  {
    key: 'galaxy',
    name: '星系',
    emoji: '🌌',
    min: 80,
    color: '#7C5CFF',
    description:
      '五维已经形成互相支撑的网络。剩下的空间在于把能力变成长期一致的产出，并帮助身边的人一起提升。',
  },
];

export function getLevel(score: number): CognitiveLevel {
  let matched = LEVELS[0];
  for (const level of LEVELS) {
    if (score >= level.min) matched = level;
  }
  return matched;
}
