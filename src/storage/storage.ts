import AsyncStorage from '@react-native-async-storage/async-storage';
import { DIMENSIONS } from '../data/dimensions';
import { ActionProgram, Assessment, DimensionId } from '../types';

const KEY_ASSESSMENTS = '@conplanet/assessments';
const KEY_FINISHED_BOOKS = '@conplanet/finished_books';
const KEY_ACTION_PROGRAM = '@conplanet/action_program';

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

export async function loadActionProgram(): Promise<ActionProgram | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY_ACTION_PROGRAM);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ActionProgram;
    if (!parsed?.id || !Array.isArray(parsed.days)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function saveActionProgram(
  program: ActionProgram
): Promise<ActionProgram> {
  await AsyncStorage.setItem(KEY_ACTION_PROGRAM, JSON.stringify(program));
  return program;
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.multiRemove([
    KEY_ASSESSMENTS,
    KEY_FINISHED_BOOKS,
    KEY_ACTION_PROGRAM,
  ]);
}
