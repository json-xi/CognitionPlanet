import {
  ActionDayScore,
  ActionInsight,
  ActionLevel,
  DailyPlan,
  PlanTask,
  TaskStatus,
} from '../types';
import { colors } from '../theme/theme';

export const ACTION_LEVELS: ActionLevel[] = [
  {
    key: 'idle',
    name: '待机',
    emoji: '🌑',
    min: 0,
    color: '#5F6B8F',
    description: '计划与执行还没形成闭环，先从每天 1–3 件小事做起。',
  },
  {
    key: 'spark',
    name: '点火',
    emoji: '🌒',
    min: 35,
    color: '#4ECDC4',
    description: '已经开始动起来了。把计划写具体一点，复盘别隔太久。',
  },
  {
    key: 'orbit',
    name: '入轨',
    emoji: '🌓',
    min: 50,
    color: '#7C5CFF',
    description: '计划—执行—复盘开始形成节奏，继续保持连续复盘。',
  },
  {
    key: 'thrust',
    name: '推进',
    emoji: '🌔',
    min: 65,
    color: '#FFC861',
    description: '执行率不错。可以试着提高高优先级事项的完成占比。',
  },
  {
    key: 'ignition',
    name: '燃速',
    emoji: '🌕',
    min: 80,
    color: '#FF7A85',
    description: '计划克制、执行扎实。行动力已经是你的竞争优势。',
  },
];

export function getActionLevel(score: number): ActionLevel {
  for (let i = ACTION_LEVELS.length - 1; i >= 0; i -= 1) {
    if (score >= ACTION_LEVELS[i].min) return ACTION_LEVELS[i];
  }
  return ACTION_LEVELS[0];
}

/** 本地日历日 YYYY-MM-DD */
export function toDateKey(ts: number = Date.now()): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatDateLabel(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return `${m}月${d}日 周${weekdays[date.getDay()]}`;
}

export function shiftDateKey(dateKey: string, deltaDays: number): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + deltaDays);
  return toDateKey(date.getTime());
}

const STATUS_WEIGHT: Record<TaskStatus, number> = {
  done: 100,
  partial: 50,
  skipped: 0,
};

/** 计划质量：任务数量适中 + 有优先级区分 */
export function scorePlanning(tasks: PlanTask[]): number {
  if (tasks.length === 0) return 0;

  let quantity = 40;
  if (tasks.length >= 1 && tasks.length <= 2) quantity = 70;
  else if (tasks.length >= 3 && tasks.length <= 6) quantity = 100;
  else if (tasks.length >= 7 && tasks.length <= 8) quantity = 75;
  else quantity = 55; // 任务过多，容易流于形式

  const titlesOk =
    tasks.filter((t) => t.title.trim().length >= 2).length / tasks.length;
  const clarity = Math.round(titlesOk * 100);

  const priorities = new Set(tasks.map((t) => t.priority));
  const diversity =
    tasks.length === 1 ? 80 : priorities.size >= 2 ? 100 : 70;

  return Math.round(quantity * 0.5 + clarity * 0.3 + diversity * 0.2);
}

/** 执行率：各任务完成度平均 */
export function scoreCompletion(
  tasks: PlanTask[],
  results?: Record<string, TaskStatus>
): number | null {
  if (!results || tasks.length === 0) return null;
  const scores = tasks.map((t) => {
    const status = results[t.id];
    return status ? STATUS_WEIGHT[status] : 0;
  });
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export function scoreDay(plan: DailyPlan): ActionDayScore {
  const planning = scorePlanning(plan.tasks);
  const completion = scoreCompletion(plan.tasks, plan.taskResults);
  const reviewed = Boolean(plan.reviewedAt && completion !== null);
  const overall = reviewed
    ? Math.round((completion as number) * 0.7 + planning * 0.3)
    : planning;

  return {
    date: plan.date,
    completion: completion ?? 0,
    planning,
    overall,
    reviewed,
  };
}

export function buildInsight(plans: DailyPlan[]): ActionInsight {
  const today = toDateKey();
  const sorted = [...plans].sort((a, b) => a.date.localeCompare(b.date));
  const reviewedScores = sorted
    .map(scoreDay)
    .filter((s) => s.reviewed);

  const average =
    reviewedScores.length === 0
      ? null
      : Math.round(
          reviewedScores.reduce((sum, s) => sum + s.overall, 0) /
            reviewedScores.length
        );

  const recent = reviewedScores.slice(-7);
  const recent7 =
    recent.length === 0
      ? null
      : Math.round(
          recent.reduce((sum, s) => sum + s.overall, 0) / recent.length
        );

  // 连续复盘：从昨天或今天起向前数（今天若未复盘则从昨天起）
  let streak = 0;
  let cursor = today;
  const byDate = new Map(sorted.map((p) => [p.date, p]));
  const todayPlan = byDate.get(today);
  if (!todayPlan?.reviewedAt) {
    cursor = shiftDateKey(today, -1);
  }
  while (true) {
    const plan = byDate.get(cursor);
    if (!plan?.reviewedAt) break;
    streak += 1;
    cursor = shiftDateKey(cursor, -1);
  }

  const pendingReviewCount = sorted.filter(
    (p) => p.date < today && !p.reviewedAt && p.tasks.length > 0
  ).length;

  const levelScore = recent7 ?? average ?? 0;

  return {
    average,
    recent7,
    streak,
    reviewedCount: reviewedScores.length,
    pendingReviewCount,
    level: getActionLevel(levelScore),
  };
}

export function createEmptyPlan(date: string): DailyPlan {
  return {
    id: `plan_${date}_${Date.now()}`,
    date,
    createdAt: Date.now(),
    tasks: [],
  };
}

export function createTask(title: string, priority: PlanTask['priority'] = 'medium'): PlanTask {
  return {
    id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title: title.trim(),
    priority,
  };
}

export function statusLabel(status: TaskStatus): string {
  switch (status) {
    case 'done':
      return '完成';
    case 'partial':
      return '部分';
    case 'skipped':
      return '未做';
  }
}

export function statusColor(status: TaskStatus): string {
  switch (status) {
    case 'done':
      return colors.accent;
    case 'partial':
      return colors.gold;
    case 'skipped':
      return colors.danger;
  }
}

export function priorityLabel(p: PlanTask['priority']): string {
  switch (p) {
    case 'high':
      return '高';
    case 'medium':
      return '中';
    case 'low':
      return '低';
  }
}
