# 认知星球

一款认知能力自测 App。每次从题库按维度抽题作答，得到六个维度的认知画像，并按你的短板生成一份分阶段的读书计划。

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

### 认知六维模型

评估围绕六个可训练的思维能力展开，定义在 `src/data/dimensions.ts`：

| 维度 | 考察什么 |
| --- | --- |
| 批判性思维 | 分辨证据与观点，识别论证漏洞 |
| 概率与不确定性 | 用概率而非非黑即白的方式思考 |
| 认知偏差觉察 | 察觉自己大脑的系统性错误 |
| 系统思维 | 看见结构、反馈回路与二阶效应 |
| 决策质量 | 把认知转化为好决策，而非被结果牵着走 |
| 元认知与学习力 | 知道自己知道什么，并高效修正 |

### 评分与抽题

题库在 `src/data/questions.ts`，每个维度 8 题，共 48 题。每次评估由 `src/logic/sample.ts` **按维度抽 3 道**（共 18 题），并优先避开近 3 次评估用过的题；题目顺序与选项顺序都会打乱，降低重测时靠记忆得分的可能。

题目分两类：

- **情景判断题**：给出一个具体场景，四个选项体现不同深度的思考方式
- **习惯自评题**：测的是日常行为倾向，而非知识

每个选项带一个 0–100 的分值，不是简单的对错。维度分 = 该维度本场抽中题目的平均分；总分 = 六个维度的平均分。算分逻辑在 `src/logic/scoring.ts`。

总分对应五个等级：星尘（0–34）、星子（35–49）、行星（50–64）、恒星（65–79）、星系（80+）。

### 书单推荐

书库在 `src/data/books.ts`，45 本书，每本标注了主维度、附带维度、难度（入门/进阶/深度）和一句话推荐理由。

推荐算法在 `src/logic/recommend.ts`，分三个阶段：

1. **补地基** — 最弱的两个维度，取 3 本
2. **扩边界** — 中间两个维度，取 2 本
3. **筑高峰** — 最强的维度，取 2 本做深度阅读

选书时按「主维度匹配 > 难度贴近当前水平 > 覆盖维度多」排序。难度是跟着分数走的：分数低于 45 推入门书，45–72 推进阶书，72 以上推深度书。这样短板很弱的人不会一上来就被塞一本硬核著作。

## 目录结构

```
App.tsx                    应用入口与路由
src/
├── types.ts               全局类型定义
├── navigation.ts          路由类型
├── theme/theme.ts         配色、间距、字号
├── data/
│   ├── dimensions.ts      六维模型 + 等级定义
│   ├── questions.ts       48 道题库（每维 8 题）
│   └── books.ts           45 本书库
├── logic/
│   ├── sample.ts          分维度抽题（避开近期题 + 打乱选项）
│   ├── scoring.ts         算分引擎
│   └── recommend.ts       书单推荐算法
├── storage/storage.ts     AsyncStorage 本地持久化
├── components/
│   ├── RadarChart.tsx     六维雷达图（含上次结果对比）
│   ├── PlanetOrb.tsx      首页星球动效
│   ├── BookCard.tsx       书籍卡片
│   └── ui.tsx             按钮、卡片、进度条等基础组件
└── screens/
    ├── HomeScreen.tsx     首页
    ├── QuizScreen.tsx     答题
    ├── ResultScreen.tsx   评估报告 + 书单
    ├── LibraryScreen.tsx  书库浏览
    └── HistoryScreen.tsx  历史记录与趋势
scripts/verify.ts          数据与算法自检
```

## 怎么改内容

**加题**：在 `src/data/questions.ts` 里加一条，指定 `dimension`，给每个选项标 0–100 的分值。`scripts/verify.ts` 当前校验每个维度 8 题；加题后同步改断言。抽题数量由 `QUESTIONS_PER_DIMENSION`（默认 3）控制。

**加书**：在 `src/data/books.ts` 里加一条，`dimensions[0]` 是主维度（决定它会被推给谁），`level` 决定推给什么水平的人，`reason` 是展示给用户的推荐语。

**改维度**：`src/data/dimensions.ts` 里改，`lowHint` / `midHint` / `highHint` 是报告页对应分数段展示的诊断话术。

## 打包成正式 App

用 [EAS Build](https://docs.expo.dev/build/introduction/)：

```bash
npm install -g eas-cli
eas login
eas build --platform ios      # 需要 Apple 开发者账号
eas build --platform android
```

`app.json` 里的 `bundleIdentifier` 和 `package` 目前是占位值 `com.conplanet.app`，上架前需要改成你自己的。

## 已知边界

- 这是一个自评工具，测的是思维习惯和判断倾向，不是心理测量学意义上经过信效度检验的量表，结果仅供参考。
- 数据只存在本机，卸载 App 或清除数据后无法恢复，也不会在多设备间同步。
- 书单是基于规则匹配的，不涉及大模型。想要更个性化的分析，可以在 `src/logic/recommend.ts` 之上接一层 LLM。
# CognitionPlanet
