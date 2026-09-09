/** 行动力报告页的短提示，按分数段选取 */
export const ACTION_TIPS = [
  {
    min: 0,
    tip: '今天只定 1–3 件必须完成的事，写清楚「做到什么算完成」。',
  },
  {
    min: 35,
    tip: '复盘尽量隔天完成。拖太久会记不清，分数也会失真。',
  },
  {
    min: 50,
    tip: '给任务标优先级：高优先级完成率上去了，行动力才会稳。',
  },
  {
    min: 65,
    tip: '部分完成也算推进。诚实标记，比全勾「完成」更有用。',
  },
  {
    min: 80,
    tip: '保持克制的计划量。真正拉开差距的是连续执行，不是堆任务。',
  },
];

export function tipForScore(score: number): string {
  let tip = ACTION_TIPS[0].tip;
  for (const item of ACTION_TIPS) {
    if (score >= item.min) tip = item.tip;
  }
  return tip;
}
