import AsyncStorage from '@react-native-async-storage/async-storage';
import { DIMENSIONS } from '../data/dimensions';
import { Assessment, DimensionId } from '../types';

const KEY_ASSESSMENTS = '@conplanet/assessments';
const KEY_FINISHED_BOOKS = '@conplanet/finished_books';

const VALID_DIMENSIONS = new Set(DIMENSIONS.map((d) => d.id));

/** 过滤掉维度模型变更前的旧评估，避免雷达图/书单读到失效 id */
function isCompatible(assessment: Assessment): boolean {
  if (!assessment?.dimensionScores?.length) return false;
  return assessment.dimensionScores.every((s) =>
    VALID_DIMENSIONS.has(s.dimension as DimensionId)
  );
}

export async function loadAssessments(): Promise<Assessment[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_ASSESSMENTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Assessment[];
    if (!Array.isArray(parsed)) return [];
    const compatible = parsed.filter(isCompatible);
    // 若有旧数据被丢掉，写回干净列表，避免下次再解析
    if (compatible.length !== parsed.length) {
      await AsyncStorage.setItem(KEY_ASSESSMENTS, JSON.stringify(compatible));
    }
    return compatible.sort((a, b) => b.createdAt - a.createdAt);
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

export async function clearAll(): Promise<void> {
  await AsyncStorage.multiRemove([KEY_ASSESSMENTS, KEY_FINISHED_BOOKS]);
}
