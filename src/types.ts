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
