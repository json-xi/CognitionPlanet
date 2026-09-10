import { Question } from '../types';

/**
 * 每个维度 8 题，共 40 题。
 * 每次评估按维度抽题（见 src/logic/sample.ts），避免重测记住答案。
 * 选项分值 0-100，代表该回答体现的能力水平，非对错二分。
 * scenario = 情景判断；habit = 习惯自评。
 */
export const QUESTIONS: Question[] = [
  // ───────────────── 元认知 ─────────────────
  {
    id: 'me1',
    dimension: 'meta',
    kind: 'habit',
    text: '你能清楚说出自己最近一个月最弱的一项能力，并举出具体例子吗？',
    options: [
      { id: 'a', text: '说不清，也没想过', score: 5 },
      { id: 'b', text: '有模糊感觉，但举不出例子', score: 30 },
      { id: 'c', text: '能说出一项，并想到一两个场景', score: 70 },
      { id: 'd', text: '能说出，而且有记录可对照', score: 100 },
    ],
  },
  {
    id: 'me2',
    dimension: 'meta',
    kind: 'scenario',
    text: '做完一件重要的事，结果不太好。你的第一反应更接近？',
    options: [
      { id: 'a', text: '先怪外部条件或别人', score: 10 },
      { id: 'b', text: '难受一会儿，然后翻篇', score: 30 },
      { id: 'c', text: '承认有自己的问题，但说不清卡在哪', score: 55 },
      { id: 'd', text: '拆步骤：哪里判断错了、信息不够、还是执行跑偏', score: 100 },
    ],
  },
  {
    id: 'me3',
    dimension: 'meta',
    kind: 'habit',
    text: '发现自己某方面不行时，你会主动改方法吗？',
    options: [
      { id: 'a', text: '很少，多半继续硬扛', score: 10 },
      { id: 'b', text: '会焦虑，但不知道怎么改', score: 35 },
      { id: 'c', text: '会试着换方法，但不系统', score: 65 },
      { id: 'd', text: '会定一个可检验的小实验，再根据结果调整', score: 100 },
    ],
  },
  {
    id: 'me4',
    dimension: 'meta',
    kind: 'scenario',
    text: '有人请你用一分钟介绍「你擅长什么、不擅长什么」。你会？',
    options: [
      { id: 'a', text: '卡住，不太说得清', score: 10 },
      { id: 'b', text: '只能说很笼统的标签', score: 35 },
      { id: 'c', text: '能说出几项，但边界偏糊', score: 60 },
      { id: 'd', text: '能具体说，并附上近期证据', score: 100 },
    ],
  },
  {
    id: 'me5',
    dimension: 'meta',
    kind: 'habit',
    text: '你多久会回头检查一次自己过去的判断或计划准不准？',
    options: [
      { id: 'a', text: '几乎从不', score: 0 },
      { id: 'b', text: '偶尔想起来感慨一下', score: 30 },
      { id: 'c', text: '大事之后会复盘', score: 65 },
      { id: 'd', text: '有固定节奏，对照记录看偏差', score: 100 },
    ],
  },
  {
    id: 'me6',
    dimension: 'meta',
    kind: 'scenario',
    text: '学到一个新方法后，你怎么判断「自己是不是真会了」？',
    options: [
      { id: 'a', text: '觉得懂了就算会了', score: 10 },
      { id: 'b', text: '能复述大意就算会了', score: 30 },
      { id: 'c', text: '能讲给别人听就算会了', score: 60 },
      { id: 'd', text: '能在真实任务里用出来，并解释取舍', score: 100 },
    ],
  },
  {
    id: 'me7',
    dimension: 'meta',
    kind: 'habit',
    text: '面对超出能力范围的任务，你通常？',
    options: [
      { id: 'a', text: '硬接，然后偷偷焦虑', score: 15 },
      { id: 'b', text: '直接回避', score: 25 },
      { id: 'c', text: '会承认吃力，但未必说出口', score: 55 },
      { id: 'd', text: '能坦然标出边界，并设计补位或求助', score: 100 },
    ],
  },
  {
    id: 'me8',
    dimension: 'meta',
    kind: 'habit',
    text: '你是否有一份「自己的强弱清单」，并会更新？',
    options: [
      { id: 'a', text: '没有，也不觉得需要', score: 5 },
      { id: 'b', text: '心里有，但没写下来', score: 35 },
      { id: 'c', text: '写过，但很少更新', score: 60 },
      { id: 'd', text: '有，而且会根据反馈定期改', score: 100 },
    ],
  },

  // ───────────────── 专注力 ─────────────────
  {
    id: 'fo1',
    dimension: 'focus',
    kind: 'habit',
    text: '做需要深度思考的事时，你通常能连续专注多久？',
    options: [
      { id: 'a', text: '很难超过 10 分钟', score: 10 },
      { id: 'b', text: '大约 20–30 分钟', score: 40 },
      { id: 'c', text: '大约 45–60 分钟', score: 70 },
      { id: 'd', text: '经常能进入 90 分钟以上的深度块', score: 100 },
    ],
  },
  {
    id: 'fo2',
    dimension: 'focus',
    kind: 'scenario',
    text: '正在赶一份重要材料，手机弹出一条无关消息。你更常？',
    options: [
      { id: 'a', text: '立刻点开看', score: 5 },
      { id: 'b', text: '犹豫一下还是看了', score: 30 },
      { id: 'c', text: '先记下来，当前块结束后再看', score: 75 },
      { id: 'd', text: '深度时段手机不在手边 / 已屏蔽干扰', score: 100 },
    ],
  },
  {
    id: 'fo3',
    dimension: 'focus',
    kind: 'habit',
    text: '一天里，你有多少时间处在「真正单任务」状态？',
    options: [
      { id: 'a', text: '几乎没有，一直在切来切去', score: 10 },
      { id: 'b', text: '偶尔有，但不稳定', score: 40 },
      { id: 'c', text: '每天至少有一块受保护的时间', score: 75 },
      { id: 'd', text: '深度块是日程默认项，很少被挤掉', score: 100 },
    ],
  },
  {
    id: 'fo4',
    dimension: 'focus',
    kind: 'scenario',
    text: '开会时脑子开始飘走。你通常怎么处理？',
    options: [
      { id: 'a', text: '由着它飘，开完也不知道讲了啥', score: 10 },
      { id: 'b', text: '自责一下，然后继续飘', score: 30 },
      { id: 'c', text: '强迫自己听，但很费劲', score: 55 },
      { id: 'd', text: '用笔记或提问把注意力拉回目标', score: 100 },
    ],
  },
  {
    id: 'fo5',
    dimension: 'focus',
    kind: 'habit',
    text: '你的工作/学习环境对专注友好吗？',
    options: [
      { id: 'a', text: '到处是干扰，几乎没管过', score: 10 },
      { id: 'b', text: '想过要整理，但一直没动手', score: 30 },
      { id: 'c', text: '做了一些屏蔽，偶尔失效', score: 65 },
      { id: 'd', text: '有明确的专注场景与规则，大多数时候有效', score: 100 },
    ],
  },
  {
    id: 'fo6',
    dimension: 'focus',
    kind: 'scenario',
    text: '同事/家人在你深度工作时打断你。你更常？',
    options: [
      { id: 'a', text: '立刻停下应对', score: 15 },
      { id: 'b', text: '烦，但还是接住了', score: 35 },
      { id: 'c', text: '会说「等一下」，但边界不稳', score: 60 },
      { id: 'd', text: '事先约定可打断时段，当前块尽量守住', score: 100 },
    ],
  },
  {
    id: 'fo7',
    dimension: 'focus',
    kind: 'habit',
    text: '被打断之后，你回到原任务通常需要多久？',
    options: [
      { id: 'a', text: '经常回不去，直接换事做', score: 10 },
      { id: 'b', text: '要很久才能找回应有思路', score: 35 },
      { id: 'c', text: '几分钟内能接上', score: 70 },
      { id: 'd', text: '有断点记录，几乎可以无缝接回', score: 100 },
    ],
  },
  {
    id: 'fo8',
    dimension: 'focus',
    kind: 'habit',
    text: '你会主动安排「无通知时段」吗？',
    options: [
      { id: 'a', text: '不会，通知一直开着', score: 5 },
      { id: 'b', text: '想过，但坚持不下来', score: 30 },
      { id: 'c', text: '偶尔会开勿扰', score: 60 },
      { id: 'd', text: '几乎每天都有固定的无通知深度时段', score: 100 },
    ],
  },

  // ───────────────── 学习力 ─────────────────
  {
    id: 'le1',
    dimension: 'learning',
    kind: 'habit',
    text: '学完新东西后，你最常怎么巩固？',
    options: [
      { id: 'a', text: '看过就算，很少再碰', score: 10 },
      { id: 'b', text: '再读一遍或划重点', score: 30 },
      { id: 'c', text: '做笔记整理', score: 55 },
      { id: 'd', text: '合上材料自测，或讲给别人听', score: 100 },
    ],
  },
  {
    id: 'le2',
    dimension: 'learning',
    kind: 'scenario',
    text: '「我觉得我懂了」这种感觉，你怎么看？',
    options: [
      { id: 'a', text: '说明确实懂了', score: 10 },
      { id: 'b', text: '大概率懂了', score: 30 },
      { id: 'c', text: '不可靠，但我也没更好办法', score: 50 },
      { id: 'd', text: '很不可靠，能用不看资料做出来才算', score: 100 },
    ],
  },
  {
    id: 'le3',
    dimension: 'learning',
    kind: 'habit',
    text: '一周后，你还记得上周学的关键内容吗？',
    options: [
      { id: 'a', text: '大多忘了', score: 10 },
      { id: 'b', text: '只记得模糊印象', score: 35 },
      { id: 'c', text: '能回忆主干，细节要靠笔记', score: 65 },
      { id: 'd', text: '能主动回忆，并在新情境里用上', score: 100 },
    ],
  },
  {
    id: 'le4',
    dimension: 'learning',
    kind: 'scenario',
    text: '学习时卡住了，你更常怎么做？',
    options: [
      { id: 'a', text: '跳过，以后再说', score: 15 },
      { id: 'b', text: '反复盯着同一段', score: 30 },
      { id: 'c', text: '换个讲解或例子再试', score: 65 },
      { id: 'd', text: '先定位卡在哪一步，再针对缺口补', score: 100 },
    ],
  },
  {
    id: 'le5',
    dimension: 'learning',
    kind: 'habit',
    text: '你有没有把学到的东西用到真实任务里的习惯？',
    options: [
      { id: 'a', text: '很少，学归学、用归用', score: 10 },
      { id: 'b', text: '偶尔会联想到，但没刻意练', score: 40 },
      { id: 'c', text: '学完会找机会试用一次', score: 70 },
      { id: 'd', text: '学习前就设定应用场景，学完立刻落地', score: 100 },
    ],
  },
  {
    id: 'le6',
    dimension: 'learning',
    kind: 'scenario',
    text: '同样一小时，哪种学习方式你用得最多？',
    options: [
      { id: 'a', text: '被动刷课/听播客', score: 20 },
      { id: 'b', text: '精读并做摘抄', score: 40 },
      { id: 'c', text: '带着问题学，边学边记要点', score: 65 },
      { id: 'd', text: '学一点就练一点，用输出倒逼输入', score: 100 },
    ],
  },
  {
    id: 'le7',
    dimension: 'learning',
    kind: 'habit',
    text: '你会做间隔复习吗（隔几天再测自己）？',
    options: [
      { id: 'a', text: '从不', score: 5 },
      { id: 'b', text: '知道有用，但没做', score: 30 },
      { id: 'c', text: '偶尔会回头看笔记', score: 55 },
      { id: 'd', text: '有节奏地自测，错的会再排进计划', score: 100 },
    ],
  },
  {
    id: 'le8',
    dimension: 'learning',
    kind: 'habit',
    text: '学一个领域时，你会刻意建立「概念之间的联系」吗？',
    options: [
      { id: 'a', text: '不会，东学一点西学一点', score: 15 },
      { id: 'b', text: '偶尔会联想到旧知识', score: 40 },
      { id: 'c', text: '会画简单结构或清单', score: 70 },
      { id: 'd', text: '会主动画关系图，并不断修正模型', score: 100 },
    ],
  },

  // ───────────────── 行动力 ─────────────────
  {
    id: 'ac1',
    dimension: 'action',
    kind: 'habit',
    text: '你清单上的事，最终真正完成的比例大概是？',
    options: [
      { id: 'a', text: '很低，大多数不了了之', score: 10 },
      { id: 'b', text: '完成一小部分', score: 35 },
      { id: 'c', text: '重要的大多能完成', score: 70 },
      { id: 'd', text: '承诺的事几乎都能闭环', score: 100 },
    ],
  },
  {
    id: 'ac2',
    dimension: 'action',
    kind: 'scenario',
    text: '一个重要但不紧急的事，你通常？',
    options: [
      { id: 'a', text: '一拖再拖，直到爆雷', score: 5 },
      { id: 'b', text: '想做，但总被别的事挤掉', score: 30 },
      { id: 'c', text: '会排进计划，偶尔跳票', score: 65 },
      { id: 'd', text: '拆成最小一步，今天就启动', score: 100 },
    ],
  },
  {
    id: 'ac3',
    dimension: 'action',
    kind: 'habit',
    text: '启动一件难事时，你最大的障碍是？',
    options: [
      { id: 'a', text: '根本不想开始', score: 15 },
      { id: 'b', text: '想完美规划后才动手', score: 35 },
      { id: 'c', text: '能开始，但热身很久', score: 60 },
      { id: 'd', text: '有固定启动仪式，两分钟内进入', score: 100 },
    ],
  },
  {
    id: 'ac4',
    dimension: 'action',
    kind: 'scenario',
    text: '做到一半被打断，过了两小时。你更常？',
    options: [
      { id: 'a', text: '这件事基本黄了', score: 10 },
      { id: 'b', text: '需要很大决心才重启', score: 35 },
      { id: 'c', text: '当天内会捡起来', score: 70 },
      { id: 'd', text: '有断点标记，打断后能快速续上', score: 100 },
    ],
  },
  {
    id: 'ac5',
    dimension: 'action',
    kind: 'habit',
    text: '你如何处理「想法很多、落地很少」？',
    options: [
      { id: 'a', text: '继续收集想法，很少筛选', score: 15 },
      { id: 'b', text: '会内疚，但没有改法', score: 30 },
      { id: 'c', text: '会选少数几件推进', score: 65 },
      { id: 'd', text: '有明确的捕获→澄清→下周只推少数关键项', score: 100 },
    ],
  },
  {
    id: 'ac6',
    dimension: 'action',
    kind: 'scenario',
    text: '状态不好的一天，你对已安排的任务会？',
    options: [
      { id: 'a', text: '整天空窗，什么都不做', score: 10 },
      { id: 'b', text: '取消大部分，安慰自己明天补', score: 30 },
      { id: 'c', text: '硬撑着做完，质量很差', score: 50 },
      { id: 'd', text: '切到「低能量可完成」版本，仍推进一点', score: 100 },
    ],
  },
  {
    id: 'ac7',
    dimension: 'action',
    kind: 'habit',
    text: '你有没有把大目标拆成「今天就能做的一步」的习惯？',
    options: [
      { id: 'a', text: '没有，目标常常悬着', score: 10 },
      { id: 'b', text: '会拆，但拆完仍偏大', score: 40 },
      { id: 'c', text: '重要目标会拆到可执行', score: 70 },
      { id: 'd', text: '几乎每个目标都有下一步动作和下次检查点', score: 100 },
    ],
  },
  {
    id: 'ac8',
    dimension: 'action',
    kind: 'habit',
    text: '对「完成」的定义，你更接近？',
    options: [
      { id: 'a', text: '想过 / 讨论过就算有进展', score: 15 },
      { id: 'b', text: '开始做了就算完成一半', score: 35 },
      { id: 'c', text: '交付出去才算', score: 75 },
      { id: 'd', text: '交付并确认结果符合标准才算闭环', score: 100 },
    ],
  },

  // ───────────────── 情绪力 ─────────────────
  {
    id: 'em1',
    dimension: 'emotion',
    kind: 'habit',
    text: '情绪上来时，你能否准确叫出它的名字（不只是「难受」）？',
    options: [
      { id: 'a', text: '很少，只会觉得糟', score: 10 },
      { id: 'b', text: '大概知道是怒/怕/累之一', score: 40 },
      { id: 'c', text: '多数时候能区分更细的情绪', score: 75 },
      { id: 'd', text: '能命名，并觉察身体信号与触发点', score: 100 },
    ],
  },
  {
    id: 'em2',
    dimension: 'emotion',
    kind: 'scenario',
    text: '被批评后心里很冲，你接下来更可能？',
    options: [
      { id: 'a', text: '立刻回怼或冷战', score: 10 },
      { id: 'b', text: '表面平静，心里反刍很久', score: 30 },
      { id: 'c', text: '先离开现场，过后再处理', score: 65 },
      { id: 'd', text: '给自己冷静窗口，再针对事实回应', score: 100 },
    ],
  },
  {
    id: 'em3',
    dimension: 'emotion',
    kind: 'habit',
    text: '焦虑或低落时，你的专注和学习通常会？',
    options: [
      { id: 'a', text: '基本报废，整天废掉', score: 10 },
      { id: 'b', text: '明显下降，很难拉回来', score: 35 },
      { id: 'c', text: '会受影响，但仍能完成底线任务', score: 70 },
      { id: 'd', text: '有调节套路，多数时候能保底运转', score: 100 },
    ],
  },
  {
    id: 'em4',
    dimension: 'emotion',
    kind: 'scenario',
    text: '重要截止日前压力很大。你更常？',
    options: [
      { id: 'a', text: '逃避，刷手机麻痹', score: 10 },
      { id: 'b', text: '空转焦虑，效率极低', score: 30 },
      { id: 'c', text: '硬扛着做，身心透支', score: 50 },
      { id: 'd', text: '把压力拆成步骤与恢复节奏，边做边稳', score: 100 },
    ],
  },
  {
    id: 'em5',
    dimension: 'emotion',
    kind: 'habit',
    text: '你有没有一套「情绪急救」手段（呼吸、走动、写下来等）？',
    options: [
      { id: 'a', text: '没有，只能硬扛或爆发', score: 10 },
      { id: 'b', text: '知道一些，但用不上', score: 35 },
      { id: 'c', text: '有一两招，偶尔有效', score: 65 },
      { id: 'd', text: '有工具箱，能按强度选手段', score: 100 },
    ],
  },
  {
    id: 'em6',
    dimension: 'emotion',
    kind: 'scenario',
    text: '和亲近的人起冲突后，你更常？',
    options: [
      { id: 'a', text: '翻旧账或贴标签', score: 15 },
      { id: 'b', text: '假装没事，情绪积压', score: 30 },
      { id: 'c', text: '会沟通，但容易再次被点燃', score: 55 },
      { id: 'd', text: '先稳情绪，再谈具体需求与边界', score: 100 },
    ],
  },
  {
    id: 'em7',
    dimension: 'emotion',
    kind: 'habit',
    text: '情绪是否经常毁掉你已经排好的计划？',
    options: [
      { id: 'a', text: '经常，情绪一来计划全废', score: 10 },
      { id: 'b', text: '有时会', score: 40 },
      { id: 'c', text: '偶尔，大体能守住', score: 70 },
      { id: 'd', text: '很少；情绪波动时仍有保底计划', score: 100 },
    ],
  },
  {
    id: 'em8',
    dimension: 'emotion',
    kind: 'habit',
    text: '你如何看待负面情绪？',
    options: [
      { id: 'a', text: '应该尽快消灭', score: 20 },
      { id: 'b', text: '很烦，能躲就躲', score: 30 },
      { id: 'c', text: '正常，但不知道怎么用', score: 60 },
      { id: 'd', text: '它是信号：提示需求、边界或价值冲突', score: 100 },
    ],
  },
];

/** 题库总量 */
export const QUESTION_BANK_SIZE = QUESTIONS.length;

/** 每次评估每个维度抽几道 */
export const QUESTIONS_PER_DIMENSION = 3;

/** @deprecated 请用 QUESTION_BANK_SIZE */
export const QUESTION_COUNT = QUESTION_BANK_SIZE;
