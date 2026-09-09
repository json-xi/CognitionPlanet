import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';
import { Button, Card, ProgressBar, Screen } from '../components/ui';
import { tipForScore } from '../data/actionHints';
import {
  buildInsight,
  formatDateLabel,
  scoreDay,
  shiftDateKey,
  toDateKey,
} from '../logic/actionScore';
import { colors, font, radius, spacing } from '../theme/theme';
import { DailyPlan } from '../types';

interface Props {
  plans: DailyPlan[];
  onBack: () => void;
  onEditPlan: (date: string) => void;
  onReview: (date: string) => void;
}

export default function ActionScreen({
  plans,
  onBack,
  onEditPlan,
  onReview,
}: Props) {
  const today = toDateKey();
  const yesterday = shiftDateKey(today, -1);
  const byDate = useMemo(
    () => new Map(plans.map((p) => [p.date, p])),
    [plans]
  );
  const todayPlan = byDate.get(today);
  const yesterdayPlan = byDate.get(yesterday);
  const insight = useMemo(() => buildInsight(plans), [plans]);

  const reviewedChrono = useMemo(
    () =>
      [...plans]
        .map(scoreDay)
        .filter((s) => s.reviewed)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [plans]
  );

  const displayScore = insight.recent7 ?? insight.average;
  const level = insight.level;

  // 待复盘：优先昨天，再其它更早未复盘
  const pending = plans.filter(
    (p) => p.date < today && !p.reviewedAt && p.tasks.length > 0
  );

  return (
    <Screen>
      <View style={styles.topBar}>
        <Pressable onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>‹ 首页</Text>
        </Pressable>
        <Text style={styles.title}>行动力</Text>
        <View style={{ width: 52 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card>
          <Text style={styles.summaryLabel}>行动力等级</Text>
          <View style={styles.summaryTop}>
            <Text style={[styles.levelName, { color: level.color }]}>
              {level.emoji} {level.name}
            </Text>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreNum}>
                {displayScore === null ? '—' : Math.round(displayScore)}
              </Text>
              <Text style={styles.scoreUnit}>/ 100</Text>
            </View>
          </View>
          {displayScore !== null && (
            <ProgressBar value={displayScore} color={level.color} />
          )}
          <Text style={styles.levelDesc}>{level.description}</Text>
          <Text style={styles.tip}>
            {tipForScore(displayScore ?? 0)}
          </Text>
        </Card>

        <View style={styles.statsRow}>
          <StatBox value={String(insight.streak)} label="连续复盘" />
          <StatBox value={String(insight.reviewedCount)} label="已复盘天" />
          <StatBox
            value={String(insight.pendingReviewCount)}
            label="待复盘"
          />
        </View>

        <Card style={{ marginTop: spacing.lg }}>
          <Text style={styles.cardTitle}>今天 · {formatDateLabel(today)}</Text>
          {todayPlan && todayPlan.tasks.length > 0 ? (
            <>
              <Text style={styles.cardBody}>
                已定 {todayPlan.tasks.length} 件事
                {todayPlan.reviewedAt ? ' · 已复盘' : ' · 待执行'}
              </Text>
              {todayPlan.tasks.slice(0, 3).map((t) => (
                <Text key={t.id} style={styles.taskPreview}>
                  · {t.title}
                </Text>
              ))}
              {todayPlan.tasks.length > 3 && (
                <Text style={styles.taskPreview}>
                  · 还有 {todayPlan.tasks.length - 3} 件…
                </Text>
              )}
              <View style={styles.btnRow}>
                <Button
                  label="改计划"
                  variant="ghost"
                  onPress={() => onEditPlan(today)}
                  style={{ flex: 1 }}
                />
                {!todayPlan.reviewedAt && (
                  <Button
                    label="今日复盘"
                    onPress={() => onReview(today)}
                    style={{ flex: 1 }}
                  />
                )}
                {todayPlan.reviewedAt && (
                  <Button
                    label="查看复盘"
                    onPress={() => onReview(today)}
                    style={{ flex: 1 }}
                  />
                )}
              </View>
            </>
          ) : (
            <>
              <Text style={styles.cardBody}>
                还没有今天的计划。先写下打算做的几件事，明天再回来复盘执行情况。
              </Text>
              <Button
                label="制定今日计划"
                onPress={() => onEditPlan(today)}
                style={{ marginTop: spacing.md }}
              />
            </>
          )}
        </Card>

        {yesterdayPlan &&
          yesterdayPlan.tasks.length > 0 &&
          !yesterdayPlan.reviewedAt && (
            <Card style={{ marginTop: spacing.md }}>
              <Text style={styles.cardTitle}>
                昨天待复盘 · {formatDateLabel(yesterday)}
              </Text>
              <Text style={styles.cardBody}>
                有 {yesterdayPlan.tasks.length} 件计划还没对照执行情况。复盘后才会计入行动力。
              </Text>
              <Button
                label="复盘昨天"
                onPress={() => onReview(yesterday)}
                style={{ marginTop: spacing.md }}
              />
            </Card>
          )}

        {pending.filter((p) => p.date !== yesterday).length > 0 && (
          <View style={{ marginTop: spacing.lg }}>
            <Text style={styles.sectionTitle}>更早未复盘</Text>
            {pending
              .filter((p) => p.date !== yesterday)
              .slice(0, 5)
              .map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() => onReview(p.date)}
                  style={({ pressed }) => [
                    styles.row,
                    pressed && { opacity: 0.75 },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowTitle}>{formatDateLabel(p.date)}</Text>
                    <Text style={styles.rowSub}>{p.tasks.length} 件事待标记</Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </Pressable>
              ))}
          </View>
        )}

        {reviewedChrono.length >= 2 && (
          <Card style={{ marginTop: spacing.lg }}>
            <Text style={styles.cardTitle}>行动力趋势</Text>
            <TrendLine data={reviewedChrono.map((s) => s.overall)} />
            <View style={styles.trendMeta}>
              <Text style={styles.trendMetaText}>
                最早 {Math.round(reviewedChrono[0].overall)}
              </Text>
              <Text style={styles.trendMetaText}>
                最近{' '}
                {Math.round(reviewedChrono[reviewedChrono.length - 1].overall)}
              </Text>
            </View>
          </Card>
        )}

        {reviewedChrono.length > 0 && (
          <View style={{ marginTop: spacing.lg }}>
            <Text style={styles.sectionTitle}>近期复盘</Text>
            {[...reviewedChrono].reverse().slice(0, 14).map((s) => {
              const plan = byDate.get(s.date);
              return (
                <Pressable
                  key={s.date}
                  onPress={() => onReview(s.date)}
                  style={({ pressed }) => [
                    styles.row,
                    pressed && { opacity: 0.75 },
                  ]}
                >
                  <View
                    style={[
                      styles.dot,
                      {
                        backgroundColor:
                          s.overall >= 65
                            ? colors.accent
                            : s.overall >= 50
                              ? colors.gold
                              : colors.danger,
                      },
                    ]}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowTitle}>{formatDateLabel(s.date)}</Text>
                    <Text style={styles.rowSub}>
                      行动力 {s.overall} · 执行 {s.completion} · 计划{' '}
                      {s.planning}
                      {plan?.reflection ? ` · ${plan.reflection.slice(0, 18)}` : ''}
                    </Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {plans.length === 0 && (
          <Text style={styles.empty}>
            从制定今天的计划开始。第二天回来标记执行情况，就能看到行动力曲线。
          </Text>
        )}
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

function TrendLine({ data }: { data: number[] }) {
  const w = 280;
  const h = 72;
  const pad = 8;
  const min = Math.min(...data, 0);
  const max = Math.max(...data, 100);
  const span = Math.max(max - min, 1);
  const points = data
    .map((v, i) => {
      const x = pad + (i / Math.max(data.length - 1, 1)) * (w - pad * 2);
      const y = h - pad - ((v - min) / span) * (h - pad * 2);
      return `${x},${y}`;
    })
    .join(' ');
  const last = data[data.length - 1];
  const lastX =
    pad +
    ((data.length - 1) / Math.max(data.length - 1, 1)) * (w - pad * 2);
  const lastY = h - pad - ((last - min) / span) * (h - pad * 2);

  return (
    <View style={{ alignItems: 'center', marginTop: spacing.md }}>
      <Svg width={w} height={h}>
        <Polyline
          points={points}
          fill="none"
          stroke={colors.accent}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <Circle cx={lastX} cy={lastY} r={4} fill={colors.accent} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  back: { color: colors.textMuted, fontSize: font.body, width: 52 },
  title: { color: colors.text, fontSize: font.h3, fontWeight: '700' },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  summaryLabel: { color: colors.textFaint, fontSize: font.tiny },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 4,
    marginBottom: spacing.md,
  },
  levelName: { fontSize: font.h2, fontWeight: '800' },
  scoreBox: { flexDirection: 'row', alignItems: 'baseline' },
  scoreNum: { color: colors.text, fontSize: 34, fontWeight: '800' },
  scoreUnit: { color: colors.textFaint, fontSize: font.small, marginLeft: 3 },
  levelDesc: {
    color: colors.textMuted,
    fontSize: font.small,
    marginTop: spacing.md,
    lineHeight: 20,
  },
  tip: {
    color: colors.textFaint,
    fontSize: font.tiny,
    marginTop: spacing.sm,
    lineHeight: 18,
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
  cardTitle: {
    color: colors.text,
    fontSize: font.h3,
    fontWeight: '700',
  },
  cardBody: {
    color: colors.textMuted,
    fontSize: font.small + 1,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  taskPreview: {
    color: colors.textFaint,
    fontSize: font.small,
    marginTop: 4,
  },
  btnRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: font.small,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  rowTitle: { color: colors.text, fontSize: font.body, fontWeight: '600' },
  rowSub: {
    color: colors.textFaint,
    fontSize: font.tiny,
    marginTop: 2,
  },
  chevron: { color: colors.textFaint, fontSize: 22, marginLeft: spacing.sm },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.md,
  },
  trendMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  trendMetaText: { color: colors.textFaint, fontSize: font.tiny },
  empty: {
    color: colors.textFaint,
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 22,
    fontSize: font.small,
  },
});
