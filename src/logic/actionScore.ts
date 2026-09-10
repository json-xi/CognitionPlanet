import { ActionDay, ActionDayScores, ActionItem, ActionProgram } from '../types';

function round(n: number) {
  return Math.round(n * 10) / 10;
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, n));
}

/** 单事项完成贡献：完成 1、部分 0.5、其余 0 */
function itemCompletion(status: ActionItem['status']): number {
  if (status === 'done') return 1;
  if (status === 'partial') return 0.5;
  return 0;
}

/**
 * 计划合理性：刚好 3 件、表述足够具体（字数）得分高。
 * 这是行动力训练，不是排满日程——超过 3 件会扣分。
 */
export function scorePlanQuality(items: ActionItem[]): number {
  if (!items.length) return 0;
  const countScore =
    items.length === 3 ? 100 : items.length < 3 ? items.length * 28 : 55;

  const specificity =
    items.reduce((sum, item) => {
      const len = item.text.trim().length;
      if (len >= 12) return sum + 100;
      if (len >= 6) return sum + 70;
      if (len >= 2) return sum + 35;
      return sum;
    }, 0) / items.length;

  return round(clamp(countScore * 0.55 + specificity * 0.45));
}

/** 完成率 */
export function scoreCompletion(items: ActionItem[]): number {
  if (!items.length) return 0;
  const ratio =
    items.reduce((sum, item) => sum + itemCompletion(item.status), 0) /
    items.length;
  return round(clamp(ratio * 100));
}

/**
 * 启动及时性：未启动/未做 → 低；启动拖延 → 中；按时启动 → 高。
 * pending 在复盘前不计入（按已复盘事项算）。
 */
export function scoreStartTimeliness(items: ActionItem[]): number {
  const reviewed = items.filter((i) => i.status !== 'pending');
  if (!reviewed.length) return 0;

  const total = reviewed.reduce((sum, item) => {
    if (item.status === 'skipped') return sum + 15;
    if (item.startedLate) return sum + 55;
    return sum + 100;
  }, 0);

  return round(clamp(total / reviewed.length));
}

/**
 * 归因质量：对未完成/部分完成写了原因，且原因不是敷衍两个字。
 * 全部完成时给满分（没有需要归因的项）。
 */
export function scoreAttribution(items: ActionItem[]): number {
  const needReason = items.filter(
    (i) => i.status === 'partial' || i.status === 'skipped'
  );
  if (!needReason.length) {
    const allDone =
      items.length > 0 && items.every((i) => i.status === 'done');
    return allDone ? 100 : 0;
  }

  const total = needReason.reduce((sum, item) => {
    const reason = (item.reason ?? '').trim();
    if (reason.length >= 8) return sum + 100;
    if (reason.length >= 3) return sum + 60;
    if (reason.length > 0) return sum + 30;
    return sum;
  }, 0);

  return round(clamp(total / needReason.length));
}

export function scoreActionDay(items: ActionItem[]): ActionDayScores {
  const completion = scoreCompletion(items);
  const startTimeliness = scoreStartTimeliness(items);
  const planQuality = scorePlanQuality(items);
  const attribution = scoreAttribution(items);
  const overall = round(
    (completion + startTimeliness + planQuality + attribution) / 4
  );
  return { completion, startTimeliness, planQuality, attribution, overall };
}

/** 本地日期 YYYY-MM-DD */
export function formatDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(dateKey: string, delta: number): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  return formatDateKey(dt);
}

export function isEvening(now = new Date()): boolean {
  return now.getHours() >= 18;
}

/** 行动力偏低阈值：低于此分引导开通 7 天对照 */
export const ACTION_LOW_THRESHOLD = 55;

export function getActionScore(assessmentScores: { dimension: string; score: number }[]): number {
  return assessmentScores.find((s) => s.dimension === 'action')?.score ?? 0;
}

export function isActionLow(score: number): boolean {
  return score < ACTION_LOW_THRESHOLD;
}

/** 近 N 天已复盘记录的训练均分；没有则 null */
export function getTrainingActionScore(
  program: ActionProgram | null | undefined,
  lookbackDays = 7
): number | null {
  if (!program) return null;
  const reviewed = program.days
    .filter((d) => d.reviewedAt && d.scores)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, lookbackDays);
  if (!reviewed.length) return null;
  const sum = reviewed.reduce((acc, d) => acc + (d.scores?.overall ?? 0), 0);
  return round(sum / reviewed.length);
}

/**
 * 把训练分回流到报告：评估行动力 60% + 近 7 天训练 40%。
 * 无训练数据时原样返回。
 */
export function blendActionIntoScores<T extends { dimension: string; score: number }>(
  scores: T[],
  trainingScore: number | null
): T[] {
  if (trainingScore == null) return scores;
  return scores.map((s) =>
    s.dimension === 'action'
      ? { ...s, score: round(s.score * 0.6 + trainingScore * 0.4) }
      : s
  );
}

export function getDay(
  program: ActionProgram,
  dateKey: string
): ActionDay | undefined {
  return program.days.find((d) => d.date === dateKey);
}

export function programDayIndex(program: ActionProgram, dateKey: string): number {
  const start = formatDateKey(new Date(program.startedAt));
  const [ys, ms, ds] = start.split('-').map(Number);
  const [ye, me, de] = dateKey.split('-').map(Number);
  const a = new Date(ys, ms - 1, ds).getTime();
  const b = new Date(ye, me - 1, de).getTime();
  return Math.floor((b - a) / 86400000) + 1;
}

export function isProgramActive(program: ActionProgram | null | undefined): boolean {
  if (!program) return false;
  const day = programDayIndex(program, formatDateKey());
  return day >= 1 && day <= program.durationDays;
}

export function reviewedDaysCount(program: ActionProgram): number {
  return program.days.filter((d) => d.reviewedAt).length;
}
