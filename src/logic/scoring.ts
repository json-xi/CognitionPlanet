import { DIMENSIONS, DIMENSION_MAP } from '../data/dimensions';
import { QUESTIONS } from '../data/questions';
import { Assessment, DimensionId, DimensionScore } from '../types';

function round(n: number) {
  return Math.round(n * 10) / 10;
}

/** 按维度求答对选项分值的平均分，未作答的题不计入 */
export function computeDimensionScores(
  answers: Record<string, string>
): DimensionScore[] {
  return DIMENSIONS.map((dim) => {
    const questions = QUESTIONS.filter((q) => q.dimension === dim.id);
    const scores: number[] = [];

    for (const q of questions) {
      const chosen = answers[q.id];
      if (!chosen) continue;
      const option = q.options.find((o) => o.id === chosen);
      if (option) scores.push(option.score);
    }

    const score = scores.length
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 0;

    return { dimension: dim.id, score: round(score) };
  });
}

export function computeOverall(dimensionScores: DimensionScore[]): number {
  if (!dimensionScores.length) return 0;
  const sum = dimensionScores.reduce((acc, d) => acc + d.score, 0);
  return round(sum / dimensionScores.length);
}

export function buildAssessment(answers: Record<string, string>): Assessment {
  const dimensionScores = computeDimensionScores(answers);
  return {
    id: `as_${Date.now()}`,
    createdAt: Date.now(),
    answers,
    dimensionScores,
    overall: computeOverall(dimensionScores),
  };
}

/** 按分数从低到高排序，用于定位短板 */
export function sortByWeakest(scores: DimensionScore[]): DimensionScore[] {
  return [...scores].sort((a, b) => a.score - b.score);
}

export function getHint(dimension: DimensionId, score: number): string {
  const dim = DIMENSION_MAP[dimension];
  if (score < 45) return dim.lowHint;
  if (score < 72) return dim.midHint;
  return dim.highHint;
}

export function scoreLabel(score: number): string {
  if (score < 35) return '待开垦';
  if (score < 50) return '起步';
  if (score < 65) return '稳健';
  if (score < 80) return '扎实';
  return '突出';
}

/** 与上一次评估相比的变化量，无历史时返回 null */
export function diffFromPrevious(
  current: Assessment,
  previous?: Assessment
): number | null {
  if (!previous) return null;
  return round(current.overall - previous.overall);
}
