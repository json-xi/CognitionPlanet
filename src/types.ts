export type DimensionId =
  | 'meta'
  | 'focus'
  | 'learning'
  | 'action'
  | 'emotion';

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
  /** 0-100，代表该选项体现的能力水平 */
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
  /** 本次抽中的题目 id；旧记录可能缺失，抽题时会回退到 answers 的 key */
  questionIds?: string[];
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

/** 行动对照：单日三件重点事项的完成状态 */
export type ActionItemStatus = 'done' | 'partial' | 'skipped' | 'pending';

export interface ActionItem {
  id: string;
  text: string;
  status: ActionItemStatus;
  /** 未完成/部分完成时的一句原因 */
  reason?: string;
  /** 是否启动拖延（当天较晚才动手） */
  startedLate?: boolean;
}

/** 某一天的行动对照记录（计划 + 可选复盘） */
export interface ActionDay {
  /** 计划针对的日期，本地 YYYY-MM-DD */
  date: string;
  createdAt: number;
  reviewedAt?: number;
  items: ActionItem[];
  /** 写计划时的一句提醒（可选） */
  planNote?: string;
  /** 复盘整日备注（可选） */
  reviewNote?: string;
  /** 复盘后算出的当日四维分 */
  scores?: ActionDayScores;
}

export interface ActionDayScores {
  /** 完成率 */
  completion: number;
  /** 启动是否及时（越高越好） */
  startTimeliness: number;
  /** 计划是否合理（三件、表述具体） */
  planQuality: number;
  /** 归因质量（原因是否写清楚） */
  attribution: number;
  /** 四维平均 */
  overall: number;
}

/** 7 天「说到做到」行动对照训练 */
export interface ActionProgram {
  id: string;
  /** 关联的评估 id */
  assessmentId: string;
  /** 开通时的行动力评估分 */
  baselineActionScore: number;
  startedAt: number;
  /** 计划持续天数 */
  durationDays: number;
  days: ActionDay[];
}
