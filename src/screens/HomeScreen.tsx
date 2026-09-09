import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import PlanetOrb from '../components/PlanetOrb';
import { Button, Card, ProgressBar, Screen } from '../components/ui';
import { DIMENSION_MAP, getLevel } from '../data/dimensions';
import { QUESTION_BANK_SIZE, QUESTIONS_PER_DIMENSION } from '../data/questions';
import { quizQuestionCount } from '../logic/sample';
import { sortByWeakest } from '../logic/scoring';
import { colors, font, radius, spacing } from '../theme/theme';
import { Assessment } from '../types';

interface Props {
  latest?: Assessment;
  historyCount: number;
  finishedCount: number;
  onStart: () => void;
  onOpenResult: () => void;
  onOpenLibrary: () => void;
  onOpenHistory: () => void;
}

export default function HomeScreen({
  latest,
  historyCount,
  finishedCount,
  onStart,
  onOpenResult,
  onOpenLibrary,
  onOpenHistory,
}: Props) {
  const level = latest ? getLevel(latest.overall) : null;
  const weakest = latest ? sortByWeakest(latest.dimensionScores)[0] : null;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.brand}>认知星球</Text>
        <Text style={styles.slogan}>测一测你的思维，然后用书把它补上</Text>

        <View style={styles.orbWrap}>
          <PlanetOrb
            size={200}
            color={level?.color ?? colors.primary}
            emoji={level?.emoji ?? '🪐'}
          />
        </View>

        {latest && level ? (
          <Card style={styles.summaryCard}>
            <View style={styles.summaryTop}>
              <View>
                <Text style={styles.summaryLabel}>当前认知等级</Text>
                <Text style={[styles.levelName, { color: level.color }]}>
                  {level.emoji} {level.name}
                </Text>
              </View>
              <View style={styles.scoreBox}>
                <Text style={styles.scoreNum}>{Math.round(latest.overall)}</Text>
                <Text style={styles.scoreUnit}>/ 100</Text>
              </View>
            </View>

            <ProgressBar value={latest.overall} color={level.color} />

            {weakest && (
              <Text style={styles.weakHint}>
                当前最短的一块板是
                <Text style={{ color: DIMENSION_MAP[weakest.dimension].color }}>
                  {' '}
                  {DIMENSION_MAP[weakest.dimension].name}{' '}
                </Text>
                （{Math.round(weakest.score)} 分）
              </Text>
            )}

            <Button
              label="查看完整报告与书单"
              onPress={onOpenResult}
              style={{ marginTop: spacing.lg }}
            />
          </Card>
        ) : (
          <Card style={styles.summaryCard}>
            <Text style={styles.emptyTitle}>还没有测过</Text>
            <Text style={styles.emptyDesc}>
              每次从题库抽 {quizQuestionCount(QUESTIONS_PER_DIMENSION)}{' '}
              道题（每维 {QUESTIONS_PER_DIMENSION} 道），约 5
              分钟。测完会给出六个维度的认知画像，并按你的短板生成一份分阶段书单。重测时会换题，避免记住答案。
            </Text>
            <Button
              label="开始认知评估"
              onPress={onStart}
              style={{ marginTop: spacing.lg }}
            />
          </Card>
        )}

        <View style={styles.statsRow}>
          <StatBox value={String(historyCount)} label="评估次数" />
          <StatBox value={String(finishedCount)} label="已读完" />
          <StatBox value={String(QUESTION_BANK_SIZE)} label="题库题量" />
        </View>

        <View style={styles.actions}>
          {latest && (
            <ActionRow
              emoji="🔄"
              title="重新评估"
              desc="认知会变化，建议每 1–3 个月重测一次"
              onPress={onStart}
            />
          )}
          <ActionRow
            emoji="📚"
            title="书库"
            desc="按维度和难度浏览全部推荐书目"
            onPress={onOpenLibrary}
          />
          <ActionRow
            emoji="📈"
            title="成长轨迹"
            desc="查看历次评估与分数变化"
            onPress={onOpenHistory}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ActionRow({
  emoji,
  title,
  desc,
  onPress,
}: {
  emoji: string;
  title: string;
  desc: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.actionRow, pressed && { opacity: 0.7 }]}
    >
      <Text style={styles.actionEmoji}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDesc}>{desc}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  brand: {
    color: colors.text,
    fontSize: font.h1,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
  },
  slogan: {
    color: colors.textFaint,
    fontSize: font.small,
    textAlign: 'center',
    marginTop: spacing.sm,
    letterSpacing: 0.5,
  },
  orbWrap: { alignItems: 'center', marginVertical: spacing.md },
  summaryCard: { marginTop: spacing.xs },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  summaryLabel: { color: colors.textFaint, fontSize: font.tiny },
  levelName: { fontSize: font.h2, fontWeight: '800', marginTop: 4 },
  scoreBox: { flexDirection: 'row', alignItems: 'baseline' },
  scoreNum: { color: colors.text, fontSize: 34, fontWeight: '800' },
  scoreUnit: { color: colors.textFaint, fontSize: font.small, marginLeft: 3 },
  weakHint: {
    color: colors.textMuted,
    fontSize: font.small,
    marginTop: spacing.md,
    lineHeight: 20,
  },
  emptyTitle: { color: colors.text, fontSize: font.h3, fontWeight: '700' },
  emptyDesc: {
    color: colors.textMuted,
    fontSize: font.small + 1,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  statValue: { color: colors.text, fontSize: font.h3, fontWeight: '700' },
  statLabel: { color: colors.textFaint, fontSize: font.tiny, marginTop: 3 },
  actions: { marginTop: spacing.lg, gap: spacing.sm },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  actionEmoji: { fontSize: 20, marginRight: spacing.md },
  actionTitle: { color: colors.text, fontSize: font.body, fontWeight: '600' },
  actionDesc: { color: colors.textFaint, fontSize: font.tiny, marginTop: 2 },
  chevron: { color: colors.textFaint, fontSize: 22, marginLeft: spacing.sm },
});
