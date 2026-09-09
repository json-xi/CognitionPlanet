/**
 * 逻辑自检：模拟几种典型答题模式，检查算分、等级和书单推荐是否合理。
 * 运行：npm run verify
 */
import { BOOKS } from '../src/data/books';
import { DIMENSION_MAP, DIMENSIONS, getLevel } from '../src/data/dimensions';
import { QUESTIONS } from '../src/data/questions';
import { buildReadingPlan, flattenPlan } from '../src/logic/recommend';
import { buildAssessment, sortByWeakest } from '../src/logic/scoring';

let failures = 0;

function check(label: string, ok: boolean, detail = '') {
  if (!ok) failures += 1;
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? ` — ${detail}` : ''}`);
}

console.log('\n=== 数据完整性 ===');

check('题目总数为 30', QUESTIONS.length === 30, `实际 ${QUESTIONS.length}`);

for (const dim of DIMENSIONS) {
  const n = QUESTIONS.filter((q) => q.dimension === dim.id).length;
  check(`${dim.name} 有 5 道题`, n === 5, `实际 ${n}`);
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

console.log('\n=== 模拟答题 ===');

function simulate(name: string, pick: (qIndex: number) => number) {
  const answers: Record<string, string> = {};
  QUESTIONS.forEach((q, i) => {
    const idx = Math.min(Math.max(pick(i), 0), q.options.length - 1);
    answers[q.id] = q.options[idx].id;
  });

  const assessment = buildAssessment(answers);
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
    `  维度：${assessment.dimensionScores
      .map((s) => `${DIMENSION_MAP[s.dimension].short} ${s.score}`)
      .join('  ')}`
  );
  console.log(`  书单 ${books.length} 本：${books.map((b) => b.title).join('、')}`);

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

  // 低分用户不该被推深度书打头
  if (weakest.score < 40) {
    check('  短板极弱时首本为入门书', plan[0].books[0].level === 'entry',
      `实际 ${plan[0].books[0].level}`);
  }

  return assessment;
}

// 全选第一个选项（多为低分项）
simulate('全部选 A', () => 0);
// 全选最后一个选项（多为高分项）
simulate('全部选最后一项', () => 99);
// 交替，模拟中等水平
simulate('交替作答', (i) => i % 4);
// 只在批判性思维上答得好，其余答得差
simulate('偏科型', (i) => (QUESTIONS[i].dimension === 'critical' ? 99 : 0));

console.log('\n=== 结果 ===');
if (failures > 0) {
  console.log(`${failures} 项检查未通过`);
  process.exit(1);
}
console.log('全部检查通过');
