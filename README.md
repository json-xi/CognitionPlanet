# 认知星球

一款认知能力自测 App。每次从题库按维度抽题作答，得到五个维度的认知画像，并按你的短板生成一份分阶段的读书计划。

技术栈：Expo（React Native）+ TypeScript。全部数据存在手机本地，无需注册、无需联网、不上传任何内容。

## 快速开始

```bash
npm install
npm start
```

然后按提示操作：

- 手机预览：装一个 Expo Go，扫描终端里的二维码
- iOS 模拟器：终端里按 `i`（需要 macOS + Xcode）
- Android 模拟器：终端里按 `a`
- 浏览器预览：`npm run web`

其他命令：

```bash
npm run typecheck   # TypeScript 类型检查
npm run verify      # 题库/书库数据校验 + 模拟答题验证推荐算法
```

## 它是怎么工作的

### 认知五维模型

评估围绕五个互相支撑的能力展开，定义在 `src/data/dimensions.ts`：

| 维度 | 核心问题 |
| --- | --- |
| 元认知 | 我清楚自己的强弱，并会据此调整吗？ |
| 专注力 | 我能持续聚焦，不被随时带走吗？ |
| 学习力 | 我学得进、记得住、用得出吗？ |
| 行动力 | 我能把想法变成完成的事吗？ |
| 情绪力 | 我能识别并调节情绪，不让它毁掉前四项吗？ |

情绪力托住前四项：情绪一塌，专注、学习、行动都会被冲掉。

### 评分与抽题

题库在 `src/data/questions.ts`，每个维度 8 题，共 40 题。每次评估由 `src/logic/sample.ts` **按维度抽 3 道**（共 15 题），并优先避开近 3 次评估用过的题；题目顺序与选项顺序都会打乱，降低重测时靠记忆得分的可能。

题目分两类：

- **情景判断题**：给出一个具体场景，四个选项体现不同深度的能力表现
- **习惯自评题**：测的是日常行为倾向，而非知识

每个选项带一个 0–100 的分值，不是简单的对错。维度分 = 该维度本场抽中题目的平均分；总分 = 五个维度的平均分。算分逻辑在 `src/logic/scoring.ts`。

总分对应五个等级：星尘（0–34）、星子（35–49）、行星（50–64）、恒星（65–79）、星系（80+）。

### 书单推荐

书库在 `src/data/books.ts`，每本标注了主维度、附带维度、难度（入门/进阶/深度）和一句话推荐理由。

推荐算法在 `src/logic/recommend.ts`，分三个阶段：

1. **补地基** — 最弱的两个维度，取 3 本
2. **扩边界** — 中间两个维度，取 2 本
3. **筑高峰** — 最强的维度，取 2 本做深度阅读

选书时按「主维度匹配 > 难度贴近当前水平 > 覆盖维度多」排序。难度跟着分数走：低于 45 推入门，45–72 推进阶，72 以上推深度。

### 说到做到 · 行动对照

评估报告里会单独展示行动力得分。若行动力偏低（低于 55），强烈推荐开通 **7 天行动对照**——这是行动力训练，不是效率待办或全天日历：

1. **今晚计划**：只写明天 3 件最重要的事
2. **复盘对照**：完成 / 部分完成 / 未做 + 一句原因（允许当天晚上复盘）
3. **四维打分**：完成率、启动及时、计划合理性、归因质量
4. **回流报告**：近 7 天训练均分按约 40% 权重并入总报告的行动力维度（评估 60% + 训练 40%）

开通后，首页出现二级入口「说到做到」。逻辑在 `src/logic/actionScore.ts` / `src/logic/actionProgram.ts`。

## 目录结构

```
App.tsx                    应用入口与路由
src/
├── types.ts               全局类型定义
├── navigation.ts          路由类型
├── theme/theme.ts         配色、间距、字号
├── data/
│   ├── dimensions.ts      五维模型 + 等级定义
│   ├── questions.ts       40 道题库（每维 8 题）
│   └── books.ts           书库（对齐五维）
├── logic/
│   ├── sample.ts          分维度抽题（避开近期题 + 打乱选项）
│   ├── scoring.ts         算分引擎
│   ├── recommend.ts       书单推荐算法
│   ├── actionScore.ts     行动对照四维打分与回流
│   └── actionProgram.ts   7 天计划创建/复盘
├── storage/storage.ts     AsyncStorage 本地持久化
├── components/
│   ├── RadarChart.tsx     雷达图（含上次结果对比）
│   ├── PlanetOrb.tsx      首页星球动效
│   ├── BookCard.tsx       书籍卡片
│   └── ui.tsx             按钮、卡片、进度条等基础组件
└── screens/
    ├── HomeScreen.tsx     首页（开通后含说到做到入口）
    ├── QuizScreen.tsx     答题
    ├── ResultScreen.tsx   评估报告 + 行动力引导 + 书单
    ├── ActionScreen.tsx   今日计划 / 复盘 / 趋势
    ├── LibraryScreen.tsx  书库浏览
    └── HistoryScreen.tsx  历史记录与趋势
scripts/verify.ts          数据与算法自检
```

## 怎么改内容

**加题**：在 `src/data/questions.ts` 里加一条，指定 `dimension`，给每个选项标 0–100 的分值。`scripts/verify.ts` 当前校验每个维度 8 题；加题后同步改断言。抽题数量由 `QUESTIONS_PER_DIMENSION`（默认 3）控制。

**加书**：在 `src/data/books.ts` 里加一条，`dimensions[0]` 是主维度（决定推给谁），`level` 决定推给什么水平的人，`reason` 是展示给用户的推荐语。

**改维度**：`src/data/dimensions.ts` 里改，`lowHint` / `midHint` / `highHint` 是报告页对应分数段展示的诊断话术。

## 打包成正式 App

用 [EAS Build](https://docs.expo.dev/build/introduction/)：

```bash
npm install -g eas-cli
eas login
eas build --platform ios
eas build --platform android
```

`app.json` 里的 `bundleIdentifier` / `package` 上架前改成你自己的。

## 已知边界

- 这是自评工具，测的是习惯与判断倾向，不是经过信效度检验的心理量表，结果仅供参考。
- 数据只存在本机，卸载或清数据后无法恢复，也不会多设备同步。
- 书单基于规则匹配；若要更个性化的分析，可在 `src/logic/recommend.ts` 之上接一层大模型，规则部分可保留做兜底。
