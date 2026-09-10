import { ActionDay, ActionItem, ActionProgram } from '../types';
import {
  addDays,
  formatDateKey,
  scoreActionDay,
} from './actionScore';

export function createActionProgram(
  assessmentId: string,
  baselineActionScore: number,
  durationDays = 7
): ActionProgram {
  return {
    id: `ap_${Date.now()}`,
    assessmentId,
    baselineActionScore,
    startedAt: Date.now(),
    durationDays,
    days: [],
  };
}

export function upsertPlan(
  program: ActionProgram,
  dateKey: string,
  texts: string[],
  planNote?: string
): ActionProgram {
  const cleaned = texts.map((t) => t.trim()).filter(Boolean).slice(0, 3);
  while (cleaned.length < 3) cleaned.push('');

  const existing = program.days.find((d) => d.date === dateKey);
  const items: ActionItem[] = cleaned.map((text, i) => ({
    id: existing?.items[i]?.id ?? `ai_${dateKey}_${i}`,
    text,
    status: 'pending' as const,
    startedLate: false,
  }));

  const day: ActionDay = {
    date: dateKey,
    createdAt: existing?.createdAt ?? Date.now(),
    items,
    planNote: planNote?.trim() || undefined,
    reviewedAt: undefined,
    scores: undefined,
    reviewNote: undefined,
  };

  const days = existing
    ? program.days.map((d) => (d.date === dateKey ? day : d))
    : [...program.days, day].sort((a, b) => a.date.localeCompare(b.date));

  return { ...program, days };
}

export function applyReview(
  program: ActionProgram,
  dateKey: string,
  items: ActionItem[],
  reviewNote?: string
): ActionProgram {
  const scores = scoreActionDay(items);
  const prev = program.days.find((d) => d.date === dateKey);
  const day: ActionDay = {
    date: dateKey,
    createdAt: prev?.createdAt ?? Date.now(),
    reviewedAt: Date.now(),
    items,
    planNote: prev?.planNote,
    reviewNote: reviewNote?.trim() || undefined,
    scores,
  };

  const days = prev
    ? program.days.map((d) => (d.date === dateKey ? day : d))
    : [...program.days, day].sort((a, b) => a.date.localeCompare(b.date));

  return { ...program, days };
}

/** 默认规划哪一天：晚上默认写明天，白天补今天 */
export function defaultPlanDate(now = new Date()): string {
  const today = formatDateKey(now);
  return now.getHours() >= 18 ? addDays(today, 1) : today;
}

/** 默认复盘哪一天：优先昨天；傍晚起允许复盘今天 */
export function defaultReviewDate(
  program: ActionProgram,
  now = new Date()
): string {
  const today = formatDateKey(now);
  const yesterday = addDays(today, -1);
  if (program.days.some((d) => d.date === yesterday)) return yesterday;
  if (now.getHours() >= 18 && program.days.some((d) => d.date === today)) {
    return today;
  }
  const pending = [...program.days]
    .filter((d) => !d.reviewedAt)
    .sort((a, b) => b.date.localeCompare(a.date));
  return pending[0]?.date ?? yesterday;
}
