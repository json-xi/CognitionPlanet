import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BookCard from '../components/BookCard';
import PlanetOrb from '../components/PlanetOrb';
import RadarChart from '../components/RadarChart';
import { Button, Card, ProgressBar, Screen } from '../components/ui';
import { DIMENSION_MAP, getLevel } from '../data/dimensions';
import { buildReadingPlan, flattenPlan } from '../logic/recommend';
import {
  diffFromPrevious,
  getHint,
  scoreLabel,
  sortByWeakest,
} from '../logic/scoring';
import { colors, font, radius, spacing } from '../theme/theme';
import { Assessment } from '../types';

interface Props {
  assessment: Assessment;
  previous?: Assessment;
  finishedBooks: string[];
  onToggleFinished: (id: string) => void;
  onBack: () => void;
  onRetake: () => void;
}

export default function ResultScreen({
  assessment,
  previous,
  finishedBooks,
  onToggleFinished,
  onBack,
  onRetake,
}: Props) {
  const level = getLevel(assessment.overall);
  const plan = useMemo(
    () => buildReadingPlan(assessment.dimensionScores),
    [assessment]
  );
  const totalBooks = flattenPlan(plan).length;
  const ranked = sortByWeakest(assessment.dimensionScores);
  const delta = diffFromPrevious(assessment, previous);

  let bookIndex = 0;

  return (
    <Screen>
      <View style={styles.topBar}>
        <Pressable onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>‹ 首页</Text>
        </Pressable>
        <Text style={styles.date}>
          {new Date(assessment.createdAt).toLocaleDateString('zh-CN')}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <PlanetOrb size={150} color={level.color} emoji={level.emoji} />
          <Text style={styles.heroLabel}>你的认知等级</Text>
          <Text style={[styles.heroLevel, { color: level.color }]}>
            {level.name}
          </Text>
          <View style={styles.heroScoreRow}>
            <Text style={styles.heroScore}>{Math.round(assessment.overall)}</Text>
            <Text style={styles.heroScoreUnit}>/ 100</Text>
            {delta !== null && (
              <Text
                style={[
                  styles.delta,
                  { color: delta >= 0 ? colors.accent : colors.danger },
                ]}
              >
                {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}
              </Text>
            )}
          </View>
          <Text style={styles.heroDesc}>{level.description}</Text>
        </View>

        <Card style={styles.radarCard}>
          <Text style={styles.cardTitle}>认知画像</Text>
          <View style={styles.radarWrap}>
            <RadarChart
              scores={assessment.dimensionScores}
              compare={previous?.dimensionScores}
              size={300}
            />
          </View>
          {previous && (
            <Text style={styles.legend}>虚线为上一次评估结果</Text>
          )}
        </Card>

        <Text style={styles.sectionHead}>逐维诊断</Text>
        <Text style={styles.sectionSub}>由弱到强排列，越靠前越值得优先投入</Text>

        {ranked.map((item, i) => {
          const dim = DIMENSION_MAP[item.dimension];
          return (
            <View key={item.dimension} style={styles.dimCard}>
              <View style={styles.dimHead}>
                <Text style={styles.dimRank}>{i + 1}</Text>
                <Text style={styles.dimName}>
                  {dim.emoji} {dim.name}
                </Text>
                <View style={styles.dimScoreWrap}>
                  <Text style={[styles.dimScore, { color: dim.color }]}>
                    {Math.round(item.score)}
                  </Text>
                  <Text style={styles.dimScoreLabel}>
                    {scoreLabel(item.score)}
                  </Text>
                </View>
              </View>
              <ProgressBar value={item.score} color={dim.color} height={5} />
              <Text style={styles.dimHint}>
                {getHint(item.dimension, item.score)}
              </Text>
            </View>
          );
        })}

        <Text style={styles.sectionHead}>为你定制的书单</Text>
        <Text style={styles.sectionSub}>
          共 {totalBooks} 本，按「先补短板、再扩边界、最后筑高峰」的顺序排列。
          点右侧圆圈可标记已读完。
        </Text>

        {plan.map((stage) => (
          <View key={stage.stage} style={styles.stage}>
            <View style={styles.stageHead}>
              <View style={styles.stageBadge}>
                <Text style={styles.stageBadgeText}>阶段 {stage.stage}</Text>
              </View>
              <Text style={styles.stageTitle}>{stage.title}</Text>
            </View>
            <Text style={styles.stageGoal}>{stage.goal}</Text>
            {stage.books.map((book) => {
              bookIndex += 1;
              return (
                <BookCard
                  key={book.id}
                  book={book}
                  index={bookIndex}
                  finished={finishedBooks.includes(book.id)}
                  onToggleFinished={onToggleFinished}
                />
              );
            })}
          </View>
        ))}

        <Card style={styles.adviceCard}>
          <Text style={styles.cardTitle}>怎么读才有效</Text>
          {[
            '一次只读一本，读完再开下一本，顺序本身就是设计过的。',
            '每读完一章，合上书用自己的话复述一遍——这一步决定了留存率。',
            '把书里的方法用在最近一个真实决策上，写下过程，一个月后回头看。',
            '1–3 个月后回来重测一次，用雷达图对比看哪块真的动了。',
          ].map((t, i) => (
            <View key={i} style={styles.adviceRow}>
              <Text style={styles.adviceDot}>·</Text>
              <Text style={styles.adviceText}>{t}</Text>
            </View>
          ))}
        </Card>

        <View style={styles.footerActions}>
          <Button
            label="重新评估"
            variant="ghost"
            onPress={onRetake}
            style={{ flex: 1 }}
          />
          <Button label="回到首页" onPress={onBack} style={{ flex: 1 }} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  back: { color: colors.textMuted, fontSize: font.body },
  date: { color: colors.textFaint, fontSize: font.small },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },

  hero: { alignItems: 'center', marginBottom: spacing.lg },
  heroLabel: { color: colors.textFaint, fontSize: font.tiny, marginTop: spacing.sm },
  heroLevel: { fontSize: font.h1, fontWeight: '800', letterSpacing: 2, marginTop: 2 },
  heroScoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: spacing.sm,
  },
  heroScore: { color: colors.text, fontSize: 40, fontWeight: '800' },
  heroScoreUnit: { color: colors.textFaint, fontSize: font.small, marginLeft: 4 },
  delta: { fontSize: font.small, fontWeight: '700', marginLeft: spacing.md },
  heroDesc: {
    color: colors.textMuted,
    fontSize: font.small + 1,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
  },

  radarCard: { alignItems: 'center', paddingVertical: spacing.lg },
  cardTitle: {
    color: colors.text,
    fontSize: font.h3,
    fontWeight: '700',
    alignSelf: 'flex-start',
  },
  radarWrap: { marginTop: spacing.sm },
  legend: {
    color: colors.textFaint,
    fontSize: font.tiny,
    marginTop: spacing.sm,
  },

  sectionHead: {
    color: colors.text,
    fontSize: font.h2,
    fontWeight: '800',
    marginTop: spacing.xl,
  },
  sectionSub: {
    color: colors.textMuted,
    fontSize: font.small,
    lineHeight: 20,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },

  dimCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  dimHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dimRank: {
    color: colors.textFaint,
    fontSize: font.small,
    width: 20,
    fontWeight: '700',
  },
  dimName: { flex: 1, color: colors.text, fontSize: font.body + 1, fontWeight: '600' },
  dimScoreWrap: { alignItems: 'flex-end' },
  dimScore: { fontSize: font.h3, fontWeight: '800' },
  dimScoreLabel: { color: colors.textFaint, fontSize: font.tiny },
  dimHint: {
    color: colors.textMuted,
    fontSize: font.small,
    lineHeight: 21,
    marginTop: spacing.md,
  },

  stage: { marginBottom: spacing.lg },
  stageHead: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  stageBadge: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: spacing.sm,
  },
  stageBadgeText: { color: colors.primary, fontSize: font.tiny, fontWeight: '700' },
  stageTitle: { color: colors.text, fontSize: font.h3, fontWeight: '700' },
  stageGoal: {
    color: colors.textMuted,
    fontSize: font.small,
    lineHeight: 21,
    marginBottom: spacing.md,
  },

  adviceCard: { marginTop: spacing.sm },
  adviceRow: { flexDirection: 'row', marginTop: spacing.md },
  adviceDot: { color: colors.accent, fontSize: font.body, marginRight: spacing.sm },
  adviceText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: font.small + 1,
    lineHeight: 22,
  },

  footerActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
});
