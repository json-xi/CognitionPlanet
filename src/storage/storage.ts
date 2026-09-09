import AsyncStorage from '@react-native-async-storage/async-storage';
import { Assessment } from '../types';

const KEY_ASSESSMENTS = '@conplanet/assessments';
const KEY_FINISHED_BOOKS = '@conplanet/finished_books';

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

export async function clearAll(): Promise<void> {
  await AsyncStorage.multiRemove([KEY_ASSESSMENTS, KEY_FINISHED_BOOKS]);
}
