export type DimensionId =
  | 'critical'
  | 'probability'
  | 'bias'
  | 'systems'
  | 'decision'
  | 'meta';

export interface Dimension {
  id: DimensionId;
  name: string;
  /** 雷达图顶点用的短标签，最多 4 字 */
  short: string;
  emoji: string;
  color: string;
  summary: string;
  /** 分数偏低时的诊断话术 */
  lowHint: string;
  /** 分数中等时的诊断话术 */
  midHint: string;
  /** 分数较高时的诊断话术 */
  highHint: string;
}

export interface Option {
  id: string;
  text: string;
  /** 0-100，代表该选项体现的认知水平 */
  score: number;
}

export interface Question {
  id: string;
  dimension: DimensionId;
  /** scenario = 情景判断题（有优劣之分）；habit = 习惯自评题 */
  kind: 'scenario' | 'habit';
  text: string;
  options: Option[];
}

export type BookLevel = 'entry' | 'advanced' | 'deep';

export interface Book {
  id: string;
  title: string;
  author: string;
  /** 首个元素为主维度，其余为次要维度 */
  dimensions: DimensionId[];
  level: BookLevel;
  /** 一句话说明这本书能补上什么 */
  reason: string;
  tags: string[];
}

export interface DimensionScore {
  dimension: DimensionId;
  score: number;
}

export interface CognitiveLevel {
  key: string;
  name: string;
  emoji: string;
  min: number;
  color: string;
  description: string;
}

export interface Assessment {
  id: string;
  createdAt: number;
  /** questionId -> optionId */
  answers: Record<string, string>;
  overall: number;
  dimensionScores: DimensionScore[];
}

export interface ReadingStage {
  stage: number;
  title: string;
  goal: string;
  books: Book[];
}

/** 日计划里的单条任务 */
export interface PlanTask {
  id: string;
  title: string;
  /** 重要度：影响计划质量分，非强制 */
  priority: 'high' | 'medium' | 'low';
}

/** 任务实际执行情况：完成 / 部分完成 / 未做 */
export type TaskStatus = 'done' | 'partial' | 'skipped';

/**
 * 一天的计划 +（可选）次日回顾。
 * date 用本地 YYYY-MM-DD，便于按日历日归档。
 */
export interface DailyPlan {
  id: string;
  date: string;
  createdAt: number;
  tasks: PlanTask[];
  /** 回顾提交时间；有值表示已复盘 */
  reviewedAt?: number;
  /** taskId -> 执行状态 */
  taskResults?: Record<string, TaskStatus>;
  /** 可选反思 */
  reflection?: string;
}

export interface ActionDayScore {
  date: string;
  /** 执行率 0–100：done=100, partial=50, skipped=0 */
  completion: number;
  /** 计划质量 0–100：任务数量是否合理、是否区分优先级 */
  planning: number;
  /** 当日行动力 = 0.7*执行 + 0.3*计划 */
  overall: number;
  reviewed: boolean;
}

export interface ActionInsight {
  /** 已复盘天数的平均行动力 */
  average: number | null;
  /** 近 7 个已复盘日平均 */
  recent7: number | null;
  /** 连续复盘天数（从最近往前） */
  streak: number;
  /** 已复盘天数 */
  reviewedCount: number;
  /** 待复盘（有计划但未回顾，且日期早于今天） */
  pendingReviewCount: number;
  level: ActionLevel;
}

export interface ActionLevel {
  key: string;
  name: string;
  emoji: string;
  min: number;
  color: string;
  description: string;
}
