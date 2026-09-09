/**
 * 逻辑自检：题库完整性、分维抽题、算分与书单推荐。
 * 运行：npm run verify
 */
import { BOOKS } from '../src/data/books';
import { DIMENSION_MAP, DIMENSIONS, getLevel } from '../src/data/dimensions';
import {
  QUESTIONS,
  QUESTIONS_PER_DIMENSION,
} from '../src/data/questions';
import { buildReadingPlan, flattenPlan } from '../src/logic/recommend';
import {
  collectRecentQuestionIds,
  quizQuestionCount,
  sampleQuizQuestions,
} from '../src/logic/sample';
import { buildAssessment, sortByWeakest } from '../src/logic/scoring';
import { Assessment } from '../src/types';

let failures = 0;

function check(label: string, ok: boolean, detail = '') {
  if (!ok) failures += 1;
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? ` — ${detail}` : ''}`);
}

/** 可复现的伪随机，方便回归 */
function seededRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

console.log('\n=== 数据完整性 ===');

check('题目总数为 48', QUESTIONS.length === 48, `实际 ${QUESTIONS.length}`);

for (const dim of DIMENSIONS) {
  const n = QUESTIONS.filter((q) => q.dimension === dim.id).length;
  check(`${dim.name} 有 8 道题`, n === 8, `实际 ${n}`);
}

const dupQuestionIds = QUESTIONS.map((q) => q.id).filter(
  (id, i, arr) => arr.indexOf(id) !== i
);
check('题目 id 无重复', dupQuestionIds.length === 0, dupQuestionIds.join(','));

for (const q of QUESTIONS) {
  const ok =
    q.options.length >= 3 &&
    q.options.every((o) => o.score >= 0 && o.score <= 100) &&
    q.options.some((o) => o.score >= 90);
  check(`${q.id} 选项合法且存在高分项`, ok);
}

const dupBookIds = BOOKS.map((b) => b.id).filter(
  (id, i, arr) => arr.indexOf(id) !== i
);
check('书籍 id 无重复', dupBookIds.length === 0, dupBookIds.join(','));

for (const dim of DIMENSIONS) {
  const primary = BOOKS.filter((b) => b.dimensions[0] === dim.id);
  const entry = primary.filter((b) => b.level === 'entry').length;
  check(
    `${dim.name} 至少 5 本主推书且含入门书`,
    primary.length >= 5 && entry >= 1,
    `共 ${primary.length} 本 / 入门 ${entry} 本`
  );
}

console.log('\n=== 分维度抽题 ===');

const expectedQuizSize = quizQuestionCount(QUESTIONS_PER_DIMENSION);
check(
  `每次抽题数为 ${expectedQuizSize}`,
  expectedQuizSize === DIMENSIONS.length * QUESTIONS_PER_DIMENSION
);

const paper1 = sampleQuizQuestions([], {
  random: seededRandom(1),
});
check(
  '首场抽题数量正确',
  paper1.length === expectedQuizSize,
  `实际 ${paper1.length}`
);

for (const dim of DIMENSIONS) {
  const n = paper1.filter((q) => q.dimension === dim.id).length;
  check(
    `首场 ${dim.name} 抽到 ${QUESTIONS_PER_DIMENSION} 道`,
    n === QUESTIONS_PER_DIMENSION,
    `实际 ${n}`
  );
}

check(
  '首场题目无重复',
  new Set(paper1.map((q) => q.id)).size === paper1.length
);

// 模拟上一场评估，验证重测避开近期题目
const fakePrev: Assessment = {
  id: 'as_prev',
  createdAt: Date.now() - 1000,
  questionIds: paper1.map((q) => q.id),
  answers: Object.fromEntries(paper1.map((q) => [q.id, q.options[0].id])),
  overall: 40,
  dimensionScores: DIMENSIONS.map((d) => ({ dimension: d.id, score: 40 })),
};

const paper2 = sampleQuizQuestions([fakePrev], {
  random: seededRandom(2),
});
const overlap = paper2.filter((q) => (fakePrev.questionIds ?? []).includes(q.id));
check(
  '重测与上场题目零重叠（题池足够时）',
  overlap.length === 0,
  `重叠 ${overlap.length} 题：${overlap.map((q) => q.id).join(',')}`
);

const recent = collectRecentQuestionIds([fakePrev], 3);
check(
  '近期题号集合与上场一致',
  recent.size === (fakePrev.questionIds?.length ?? 0)
);

// 选项顺序被打乱：同一题两次抽样，选项 id 序列不完全相同的概率很高
const optOrders = new Set<string>();
for (let i = 0; i < 8; i += 1) {
  const p = sampleQuizQuestions([], { random: seededRandom(100 + i) });
  const c1 = p.find((q) => q.id === 'c1');
  if (c1) optOrders.add(c1.options.map((o) => o.id).join(''));
}
check(
  '选项顺序会被打乱（多次抽样出现不同排列）',
  optOrders.size >= 2,
  `不同排列数 ${optOrders.size}`
);

console.log('\n=== 模拟答题（基于抽题卷） ===');

function simulate(
  name: string,
  pick: (qIndex: number) => number,
  seed: number
) {
  const paper = sampleQuizQuestions([], { random: seededRandom(seed) });
  const answers: Record<string, string> = {};
  paper.forEach((q, i) => {
    const idx = Math.min(Math.max(pick(i), 0), q.options.length - 1);
    // 注意：选项已被打乱，按当前卷面下标取
    answers[q.id] = q.options[idx].id;
  });

  const assessment = buildAssessment(
    answers,
    paper.map((q) => q.id)
  );
  const level = getLevel(assessment.overall);
  const plan = buildReadingPlan(assessment.dimensionScores);
  const books = flattenPlan(plan);
  const weakest = sortByWeakest(assessment.dimensionScores)[0];

  console.log(
    `\n[${name}] 总分 ${assessment.overall} → ${level.name}｜短板 ${
      DIMENSION_MAP[weakest.dimension].name
    } ${weakest.score}`
  );
  console.log(
    `  卷面 ${paper.map((q) => q.id).join(',')}`
  );
  console.log(
    `  维度：${assessment.dimensionScores
      .map((s) => `${DIMENSION_MAP[s.dimension].short} ${s.score}`)
      .join('  ')}`
  );
  console.log(`  书单 ${books.length} 本：${books.map((b) => b.title).join('、')}`);

  check(
    '  记录了 questionIds',
    (assessment.questionIds?.length ?? 0) === paper.length
  );

  const ids = books.map((b) => b.id);
  check(
    '  书单无重复',
    new Set(ids).size === ids.length,
    `${ids.length} 本 / 去重后 ${new Set(ids).size}`
  );
  check('  书单数量在 5–10 本', books.length >= 5 && books.length <= 10);
  check(
    '  第一阶段命中最弱维度',
    plan[0].books.some((b) => b.dimensions.includes(weakest.dimension))
  );
  check(
    '  总分落在 0–100',
    assessment.overall >= 0 && assessment.overall <= 100
  );

  if (weakest.score < 40) {
    check(
      '  短板极弱时首本为入门书',
      plan[0].books[0].level === 'entry',
      `实际 ${plan[0].books[0].level}`
    );
  }

  return assessment;
}

simulate('全部选卷面 A', () => 0, 11);
simulate('全部选卷面最后一项', () => 99, 22);
simulate('交替作答', (i) => i % 4, 33);
simulate('偏科型（批判维选高分项）', (i) => {
  // 这里无法按维度精准，改为：奇数题选最后、偶数选第一，覆盖中低分
  return i % 2 === 0 ? 99 : 0;
}, 44);

console.log('\n=== 结果 ===');
if (failures > 0) {
  console.log(`${failures} 项检查未通过`);
  process.exit(1);
}
console.log('全部检查通过');
