import { DIMENSIONS } from '../data/dimensions';
import {
  QUESTIONS,
  QUESTIONS_PER_DIMENSION,
} from '../data/questions';
import { Assessment, Option, Question } from '../types';

/** Fisher–Yates，原地打乱并返回同一数组 */
function shuffleInPlace<T>(arr: T[], random = Math.random): T[] {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleCopy<T>(arr: T[], random = Math.random): T[] {
  return shuffleInPlace([...arr], random);
}

/** 从近期评估里收集已出现过的题目 id（越近权重越高，仅用于排序） */
export function collectRecentQuestionIds(
  assessments: Assessment[],
  lookback = 3
): Set<string> {
  const recent = assessments.slice(0, lookback);
  const ids = new Set<string>();
  for (const a of recent) {
    if (a.questionIds?.length) {
      a.questionIds.forEach((id) => ids.add(id));
    } else {
      // 兼容旧记录：用 answers 的 key 当作当时出过的题
      Object.keys(a.answers).forEach((id) => ids.add(id));
    }
  }
  return ids;
}

/**
 * 从一个维度的题池里抽 count 道。
 * 优先从未在近期评估里出现过的题中抽；不够再从已出现的题里补。
 */
function pickFromDimension(
  pool: Question[],
  count: number,
  avoid: Set<string>,
  random: () => number
): Question[] {
  const fresh = shuffleCopy(
    pool.filter((q) => !avoid.has(q.id)),
    random
  );
  const used = shuffleCopy(
    pool.filter((q) => avoid.has(q.id)),
    random
  );
  return [...fresh, ...used].slice(0, Math.min(count, pool.length));
}

/** 打乱选项顺序，保留 option.id，评分不受影响 */
export function shuffleOptions(
  question: Question,
  random = Math.random
): Question {
  return {
    ...question,
    options: shuffleCopy(question.options, random) as Option[],
  };
}

/**
 * 按维度抽题，组成一次评估卷。
 * - 每个维度抽 QUESTIONS_PER_DIMENSION 道
 * - 优先避开近期评估用过的题
 * - 维度顺序与题内选项均打乱
 */
export function sampleQuizQuestions(
  assessments: Assessment[] = [],
  options?: {
    perDimension?: number;
    lookback?: number;
    random?: () => number;
  }
): Question[] {
  const perDimension = options?.perDimension ?? QUESTIONS_PER_DIMENSION;
  const lookback = options?.lookback ?? 3;
  const random = options?.random ?? Math.random;
  const avoid = collectRecentQuestionIds(assessments, lookback);

  const dims = shuffleCopy(DIMENSIONS, random);
  const picked: Question[] = [];

  for (const dim of dims) {
    const pool = QUESTIONS.filter((q) => q.dimension === dim.id);
    const selected = pickFromDimension(pool, perDimension, avoid, random);
    for (const q of selected) {
      picked.push(shuffleOptions(q, random));
    }
  }

  return shuffleCopy(picked, random);
}

export function quizQuestionCount(
  perDimension = QUESTIONS_PER_DIMENSION
): number {
  return DIMENSIONS.length * perDimension;
}
