import { BOOKS } from '../data/books';
import { DIMENSION_MAP } from '../data/dimensions';
import { Book, BookLevel, DimensionId, DimensionScore, ReadingStage } from '../types';
import { sortByWeakest } from './scoring';

/** 分数越低，越应该从浅的书读起 */
function levelForScore(score: number): BookLevel {
  if (score < 45) return 'entry';
  if (score < 72) return 'advanced';
  return 'deep';
}

const LEVEL_ORDER: BookLevel[] = ['entry', 'advanced', 'deep'];

/** 与目标难度的距离，用于降级/升级兜底 */
function levelDistance(a: BookLevel, b: BookLevel) {
  return Math.abs(LEVEL_ORDER.indexOf(a) - LEVEL_ORDER.indexOf(b));
}

/**
 * 为某个维度挑书。
 * 排序优先级：主维度匹配 > 难度贴近 > 覆盖维度多（附带收益大）。
 */
function pickBooks(
  dimension: DimensionId,
  score: number,
  count: number,
  used: Set<string>
): Book[] {
  const target = levelForScore(score);

  const candidates = BOOKS.filter(
    (b) => !used.has(b.id) && b.dimensions.includes(dimension)
  );

  candidates.sort((a, b) => {
    const aPrimary = a.dimensions[0] === dimension ? 0 : 1;
    const bPrimary = b.dimensions[0] === dimension ? 0 : 1;
    if (aPrimary !== bPrimary) return aPrimary - bPrimary;

    const aDist = levelDistance(a.level, target);
    const bDist = levelDistance(b.level, target);
    if (aDist !== bDist) return aDist - bDist;

    return b.dimensions.length - a.dimensions.length;
  });

  const picked = candidates.slice(0, count);
  picked.forEach((b) => used.add(b.id));
  return picked;
}

/**
 * 生成三阶段读书计划：
 * 1. 补地基——最弱的两个维度
 * 2. 扩边界——中间两个维度
 * 3. 筑高峰——最强维度的深度阅读
 * （五维时：弱 2 + 中 2 + 强 1）
 */
export function buildReadingPlan(scores: DimensionScore[]): ReadingStage[] {
  const weakest = sortByWeakest(scores);
  const used = new Set<string>();
  const stages: ReadingStage[] = [];

  const [w1, w2] = weakest;
  const stage1: Book[] = [
    ...pickBooks(w1.dimension, w1.score, 2, used),
    ...pickBooks(w2.dimension, w2.score, 1, used),
  ];
  stages.push({
    stage: 1,
    title: '补地基',
    goal: `优先补齐${DIMENSION_MAP[w1.dimension].name}与${
      DIMENSION_MAP[w2.dimension].name
    }，这两块是目前拖累整体的短板。`,
    books: stage1,
  });

  const mid = weakest.slice(2, 4);
  const stage2: Book[] = mid.flatMap((d) =>
    pickBooks(d.dimension, d.score, 1, used)
  );
  stages.push({
    stage: 2,
    title: '扩边界',
    goal: `在${mid
      .map((d) => DIMENSION_MAP[d.dimension].name)
      .join('、')}上补充中等强度的输入，把已有的直觉变成方法。`,
    books: stage2,
  });

  const strongest = weakest[weakest.length - 1];
  // 第三阶段至少比入门高一档，但整体偏弱时不强推深度书
  const stage3Score = Math.max(strongest.score, 48);
  const stage3 = pickBooks(strongest.dimension, stage3Score, 2, used);
  const strongName = DIMENSION_MAP[strongest.dimension].name;
  stages.push({
    stage: 3,
    title: '筑高峰',
    goal:
      strongest.score >= 60
        ? `${strongName}是你的明显优势，用深度阅读把它变成真正的长板。`
        : `${strongName}是你目前相对最好的一块。前两阶段读完再来，那时你会读得更顺。`,
    books: stage3,
  });

  return stages.filter((s) => s.books.length > 0);
}

export function flattenPlan(stages: ReadingStage[]): Book[] {
  return stages.flatMap((s) => s.books);
}
