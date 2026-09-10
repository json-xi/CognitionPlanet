import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button, Card, ProgressBar, Screen } from '../components/ui';
import {
  applyReview,
  defaultPlanDate,
  defaultReviewDate,
  upsertPlan,
} from '../logic/actionProgram';
import {
  formatDateKey,
  getDay,
  getTrainingActionScore,
  isProgramActive,
  programDayIndex,
  reviewedDaysCount,
} from '../logic/actionScore';
import { colors, font, radius, spacing } from '../theme/theme';
import type {
  ActionDay,
  ActionItem,
  ActionItemStatus,
  ActionProgram,
} from '../types';

type Props = {
  program: ActionProgram;
  onChange: (next: ActionProgram) => void;
  onBack: () => void;
  onOpenLatestReport?: () => void;
};

type Tab = 'plan' | 'review' | 'trend';

const emptyItems = (): ActionItem[] => [
  { id: '1', text: '', status: 'pending', startedLate: false },
  { id: '2', text: '', status: 'pending', startedLate: false },
  { id: '3', text: '', status: 'pending', startedLate: false },
];

function StatusChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.scoreRow}>
      <Text style={styles.scoreLabel}>{label}</Text>
      <View style={styles.scoreBarWrap}>
        <ProgressBar value={value} color={colors.accent} height={5} />
      </View>
      <Text style={styles.scoreValue}>{Math.round(value)}</Text>
    </View>
  );
}

export default function ActionScreen({
  program,
  onChange,
  onBack,
  onOpenLatestReport,
}: Props) {
  const [tab, setTab] = useState<Tab>('plan');
  const today = formatDateKey();
  const planDate = defaultPlanDate();
  const reviewDate = defaultReviewDate(program);
  const existingPlan = getDay(program, planDate);
  const existingReview = getDay(program, reviewDate);
  const dayIndex = programDayIndex(program, today);
  const active = isProgramActive(program);
  const trainingScore = getTrainingActionScore(program);

  const [planTexts, setPlanTexts] = useState<string[]>(() => {
    if (existingPlan?.items?.length) {
      return [0, 1, 2].map((i) => existingPlan.items[i]?.text ?? '');
    }
    return ['', '', ''];
  });
  const [planNote, setPlanNote] = useState(existingPlan?.planNote ?? '');
  const [planHint, setPlanHint] = useState('');

  const [reviewItems, setReviewItems] = useState<ActionItem[]>(() =>
    existingReview?.items?.length
      ? existingReview.items.map((item) => ({ ...item }))
      : emptyItems()
  );
  const [reviewNote, setReviewNote] = useState(
    existingReview?.reviewNote ?? ''
  );
  const [reviewHint, setReviewHint] = useState('');

  // 计划保存后 / 切换日期时，同步复盘区事项
  useEffect(() => {
    const day = getDay(program, reviewDate);
    if (!day) return;
    setReviewItems(day.items.map((item) => ({ ...item })));
    setReviewNote(day.reviewNote ?? '');
  }, [program, reviewDate]);

  const scoredDays = useMemo(
    () =>
      [...program.days]
        .filter((day) => day.scores)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [program.days]
  );

  const savePlan = () => {
    const filled = planTexts.map((t) => t.trim()).filter(Boolean);
    if (filled.length === 0) {
      setPlanHint('至少写下 1 件明天最重要的事');
      return;
    }
    const next = upsertPlan(program, planDate, planTexts, planNote);
    onChange(next);
    setPlanHint('已保存。明天回来对照：说到做到。');
  };

  const saveReview = () => {
    const withText = reviewItems.filter((item) => item.text.trim().length > 0);
    if (withText.length === 0) {
      setReviewHint('这一天还没有计划，先去写 3 件重点事');
      return;
    }
    if (withText.some((item) => item.status === 'pending')) {
      setReviewHint('每件事都要标：完成 / 部分完成 / 未做');
      return;
    }
    onChange(applyReview(program, reviewDate, reviewItems, reviewNote));
    setReviewHint('复盘已记入行动力分。');
  };

  const updateReviewItem = (id: string, patch: Partial<ActionItem>) => {
    setReviewItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  return (
    <Screen>
      <View style={styles.topBar}>
        <Pressable onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>‹ 首页</Text>
        </Pressable>
        <Text style={styles.topMeta}>
          {active ? `第 ${dayIndex}/${program.durationDays} 天` : '计划已结束'}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.kicker}>说到做到 · 行动对照</Text>
        <Text style={styles.title}>行动力训练</Text>
        <Text style={styles.lead}>
          这不是效率工具或待办清单。每晚只写明天 3
          件最重要的事，再对照完成情况——练的是「说到做到」。
        </Text>

        <Card style={styles.heroCard}>
          <Text style={styles.heroLabel}>训练行动力分 · 会回流总报告</Text>
          <Text style={styles.heroScore}>
            {trainingScore == null ? '—' : Math.round(trainingScore)}
          </Text>
          <Text style={styles.heroMeta}>
            基线 {Math.round(program.baselineActionScore)} · 已复盘{' '}
            {reviewedDaysCount(program)} 天
          </Text>
        </Card>

        <View style={styles.tabs}>
          {(
            [
              ['plan', '今日计划'],
              ['review', '复盘'],
              ['trend', '趋势'],
            ] as const
          ).map(([key, label]) => (
            <Pressable
              key={key}
              onPress={() => setTab(key)}
              style={[styles.tab, tab === key && styles.tabActive]}
            >
              <Text
                style={[styles.tabText, tab === key && styles.tabTextActive]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        {tab === 'plan' ? (
          <Card>
            <Text style={styles.panelTitle}>写下 3 件最重要的事</Text>
            <Text style={styles.panelHint}>
              计划日期 {planDate}
              {planDate !== today ? '（今晚为明天做准备）' : ''}
              。别排全天日历，只留真正要完成的。
            </Text>
            {planTexts.map((text, index) => (
              <View key={index} style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>重点 {index + 1}</Text>
                <TextInput
                  value={text}
                  onChangeText={(value) =>
                    setPlanTexts((prev) =>
                      prev.map((row, i) => (i === index ? value : row))
                    )
                  }
                  placeholder="一件具体、可完成的事"
                  placeholderTextColor={colors.textFaint}
                  style={styles.input}
                />
              </View>
            ))}
            <Text style={styles.fieldLabel}>一句提醒（可选）</Text>
            <TextInput
              value={planNote}
              onChangeText={setPlanNote}
              placeholder="例如：先启动最小的一步"
              placeholderTextColor={colors.textFaint}
              style={styles.input}
            />
            <Button
              label="保存行动对照"
              onPress={savePlan}
              style={{ marginTop: spacing.md }}
            />
            {planHint ? <Text style={styles.hint}>{planHint}</Text> : null}
          </Card>
        ) : null}

        {tab === 'review' ? (
          <Card>
            <Text style={styles.panelTitle}>对照完成情况</Text>
            <Text style={styles.panelHint}>
              复盘日期 {reviewDate}。允许当天晚上复盘，不必硬等第二天。完成 /
              部分完成 / 未做，并写一句原因。
            </Text>
            {reviewItems.every((item) => !item.text.trim()) ? (
              <Text style={styles.empty}>
                这一天还没有计划。先到「今日计划」写下 3 件重点事。
              </Text>
            ) : (
              reviewItems
                .filter((item) => item.text.trim().length > 0)
                .map((item, index) => (
                  <View key={item.id} style={styles.reviewBlock}>
                    <Text style={styles.fieldLabel}>重点 {index + 1}</Text>
                    <Text style={styles.reviewText}>{item.text}</Text>
                    <View style={styles.chipRow}>
                      {(
                        [
                          ['done', '完成'],
                          ['partial', '部分完成'],
                          ['skipped', '未做'],
                        ] as const
                      ).map(([status, label]) => (
                        <StatusChip
                          key={status}
                          label={label}
                          active={item.status === status}
                          onPress={() =>
                            updateReviewItem(item.id, {
                              status: status as ActionItemStatus,
                            })
                          }
                        />
                      ))}
                    </View>
                    <Pressable
                      onPress={() =>
                        updateReviewItem(item.id, {
                          startedLate: !item.startedLate,
                        })
                      }
                      style={[
                        styles.lateToggle,
                        item.startedLate && styles.lateToggleOn,
                      ]}
                    >
                      <Text
                        style={[
                          styles.lateToggleText,
                          item.startedLate && styles.lateToggleTextOn,
                        ]}
                      >
                        {item.startedLate
                          ? '已标记：启动偏晚'
                          : '启动是否偏晚？点此标记'}
                      </Text>
                    </Pressable>
                    <TextInput
                      value={item.reason ?? ''}
                      onChangeText={(reason) =>
                        updateReviewItem(item.id, { reason })
                      }
                      placeholder="一句原因（归因质量会计分）"
                      placeholderTextColor={colors.textFaint}
                      style={styles.input}
                    />
                  </View>
                ))
            )}
            <Text style={styles.fieldLabel}>整日备注（可选）</Text>
            <TextInput
              value={reviewNote}
              onChangeText={setReviewNote}
              placeholder="今天整体感觉如何"
              placeholderTextColor={colors.textFaint}
              style={styles.input}
            />
            <Button
              label="提交复盘"
              onPress={saveReview}
              style={{ marginTop: spacing.md }}
            />
            {reviewHint ? <Text style={styles.hint}>{reviewHint}</Text> : null}
            {existingReview?.scores ? (
              <View style={styles.scoreBox}>
                <Text style={styles.panelTitle}>本日行动力分</Text>
                <ScoreRow
                  label="完成率"
                  value={existingReview.scores.completion}
                />
                <ScoreRow
                  label="启动及时"
                  value={existingReview.scores.startTimeliness}
                />
                <ScoreRow
                  label="计划合理"
                  value={existingReview.scores.planQuality}
                />
                <ScoreRow
                  label="归因质量"
                  value={existingReview.scores.attribution}
                />
                <Text style={styles.overall}>
                  综合 {Math.round(existingReview.scores.overall)}
                </Text>
              </View>
            ) : null}
          </Card>
        ) : null}

        {tab === 'trend' ? (
          <Card>
            <Text style={styles.panelTitle}>行动力趋势</Text>
            <Text style={styles.panelHint}>
              训练分会按约 40% 权重回流到总报告里的「行动力」维度。
            </Text>
            {scoredDays.length === 0 ? (
              <Text style={styles.empty}>
                完成至少一次复盘后，这里会显示趋势。
              </Text>
            ) : (
              scoredDays.map((day: ActionDay) => (
                <View key={day.date} style={styles.trendRow}>
                  <View style={styles.trendHead}>
                    <Text style={styles.trendDate}>{day.date}</Text>
                    <Text style={styles.trendScore}>
                      {Math.round(day.scores!.overall)}
                    </Text>
                  </View>
                  <ProgressBar
                    value={day.scores!.overall}
                    color={colors.accent}
                    height={5}
                  />
                </View>
              ))
            )}
            {onOpenLatestReport ? (
              <Button
                label="查看总报告中的行动力"
                variant="ghost"
                onPress={onOpenLatestReport}
                style={{ marginTop: spacing.md }}
              />
            ) : null}
          </Card>
        ) : null}
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
  topMeta: { color: colors.textFaint, fontSize: font.small },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  kicker: {
    color: colors.accent,
    fontSize: font.tiny,
    letterSpacing: 1,
    fontWeight: '700',
  },
  title: {
    color: colors.text,
    fontSize: font.h2,
    fontWeight: '800',
  },
  lead: {
    color: colors.textMuted,
    fontSize: font.small + 1,
    lineHeight: 22,
  },
  heroCard: { alignItems: 'center', paddingVertical: spacing.lg },
  heroLabel: { color: colors.textFaint, fontSize: font.tiny },
  heroScore: {
    color: colors.text,
    fontSize: 48,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  heroMeta: {
    color: colors.textMuted,
    fontSize: font.small,
    marginTop: spacing.sm,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: colors.cardStrong },
  tabText: { color: colors.textMuted, fontSize: font.small, fontWeight: '600' },
  tabTextActive: { color: colors.text },
  panelTitle: {
    color: colors.text,
    fontSize: font.h3,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  panelHint: {
    color: colors.textMuted,
    fontSize: font.small,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  fieldBlock: { marginBottom: spacing.sm },
  fieldLabel: {
    color: colors.textFaint,
    fontSize: font.tiny,
    fontWeight: '700',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    backgroundColor: colors.cardStrong,
    fontSize: font.body,
  },
  hint: {
    color: colors.accent,
    fontSize: font.small,
    marginTop: spacing.sm,
  },
  empty: { color: colors.textMuted, fontSize: font.body, lineHeight: 22 },
  reviewBlock: {
    gap: spacing.sm,
    paddingTop: spacing.md,
    marginBottom: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  reviewText: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '600',
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    backgroundColor: colors.card,
  },
  chipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  chipText: { color: colors.textMuted, fontSize: font.tiny },
  chipTextActive: { color: colors.primary, fontWeight: '700' },
  lateToggle: {
    borderRadius: radius.sm,
    paddingVertical: 8,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.card,
  },
  lateToggleOn: { backgroundColor: 'rgba(255,200,97,0.15)' },
  lateToggleText: { color: colors.textMuted, fontSize: font.tiny },
  lateToggleTextOn: { color: colors.gold, fontWeight: '600' },
  scoreBox: {
    marginTop: spacing.lg,
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.cardStrong,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  scoreLabel: { width: 64, color: colors.textMuted, fontSize: font.tiny },
  scoreBarWrap: { flex: 1 },
  scoreValue: {
    width: 28,
    textAlign: 'right',
    color: colors.text,
    fontSize: font.tiny,
  },
  overall: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  trendRow: { gap: 6, marginBottom: spacing.md },
  trendHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendDate: { color: colors.textMuted, fontSize: font.small },
  trendScore: { color: colors.text, fontSize: font.body, fontWeight: '700' },
});
