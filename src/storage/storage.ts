import AsyncStorage from '@react-native-async-storage/async-storage';
import { Assessment, DailyPlan } from '../types';

const KEY_ASSESSMENTS = '@conplanet/assessments';
const KEY_FINISHED_BOOKS = '@conplanet/finished_books';
const KEY_DAILY_PLANS = '@conplanet/daily_plans';

export async function loadAssessments(): Promise<Assessment[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_ASSESSMENTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Assessment[];
    return Array.isArray(parsed)
      ? parsed.sort((a, b) => b.createdAt - a.createdAt)
      : [];
  } catch {
    return [];
  }
}

export async function saveAssessment(
  assessment: Assessment
): Promise<Assessment[]> {
  const list = await loadAssessments();
  const next = [assessment, ...list].slice(0, 50);
  await AsyncStorage.setItem(KEY_ASSESSMENTS, JSON.stringify(next));
  return next;
}

export async function loadFinishedBooks(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_FINISHED_BOOKS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function toggleFinishedBook(bookId: string): Promise<string[]> {
  const list = await loadFinishedBooks();
  const next = list.includes(bookId)
    ? list.filter((id) => id !== bookId)
    : [...list, bookId];
  await AsyncStorage.setItem(KEY_FINISHED_BOOKS, JSON.stringify(next));
  return next;
}

export async function loadDailyPlans(): Promise<DailyPlan[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_DAILY_PLANS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DailyPlan[];
    return Array.isArray(parsed)
      ? parsed.sort((a, b) => b.date.localeCompare(a.date))
      : [];
  } catch {
    return [];
  }
}

/** 按 date 覆盖写入；同一天只保留一份计划 */
export async function upsertDailyPlan(plan: DailyPlan): Promise<DailyPlan[]> {
  const list = await loadDailyPlans();
  const next = [plan, ...list.filter((p) => p.date !== plan.date)].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
  // 保留最近 120 天，避免无限膨胀
  const trimmed = next.slice(0, 120);
  await AsyncStorage.setItem(KEY_DAILY_PLANS, JSON.stringify(trimmed));
  return trimmed;
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.multiRemove([
    KEY_ASSESSMENTS,
    KEY_FINISHED_BOOKS,
    KEY_DAILY_PLANS,
  ]);
}
