import React, { useMemo, useState } from 'react';
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
  formatDateLabel,
  scoreCompletion,
  scoreDay,
  scorePlanning,
  statusColor,
  statusLabel,
} from '../logic/actionScore';
import { tipForScore } from '../data/actionHints';
import { colors, font, radius, spacing } from '../theme/theme';
import { DailyPlan, TaskStatus } from '../types';

interface Props {
  plan: DailyPlan;
  onSave: (plan: DailyPlan) => void;
  onBack: () => void;
}

const STATUSES: TaskStatus[] = ['done', 'partial', 'skipped'];

export default function ActionReviewScreen({ plan, onSave, onBack }: Props) {
  const [results, setResults] = useState<Record<string, TaskStatus>>(() => {
    const initial: Record<string, TaskStatus> = {};
    for (const task of plan.tasks) {
      initial[task.id] = plan.taskResults?.[task.id] ?? 'done';
    }
    return initial;
  });
  const [reflection, setReflection] = useState(plan.reflection ?? '');

  const preview = useMemo(() => {
    const draft: DailyPlan = {
      ...plan,
      reviewedAt: Date.now(),
      taskResults: results,
      reflection: reflection.trim() || undefined,
    };
    return scoreDay(draft);
  }, [plan, results, reflection]);

  const setStatus = (taskId: string, status: TaskStatus) => {
    setResults((prev) => ({ ...prev, [taskId]: status }));
  };

  const handleSave = () => {
    const next: DailyPlan = {
      ...plan,
      reviewedAt: Date.now(),
      taskResults: results,
      reflection: reflection.trim() || undefined,
    };
    onSave(next);
  };

  const completion = scoreCompletion(plan.tasks, results) ?? 0;
  const planning = scorePlanning(plan.tasks);

  return (
    <Screen>
      <View style={styles.topBar}>
        <Pressable onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>‹ 返回</Text>
        </Pressable>
        <Text style={styles.title}>执行复盘</Text>
        <View style={{ width: 52 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.dateLabel}>{formatDateLabel(plan.date)}</Text>
        <Text style={styles.hint}>
          对照昨天（或当天）的计划，如实标记每件事做到了哪一步。
        </Text>

        <Card style={{ marginTop: spacing.md }}>
          <View style={styles.scoreRow}>
            <View>
              <Text style={styles.metaLabel}>预估行动力</Text>
              <Text style={styles.bigScore}>{preview.overall}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: spacing.lg }}>
              <Text style={styles.metaLine}>执行率 {completion}</Text>
              <ProgressBar value={completion} color={colors.accent} />
              <Text style={[styles.metaLine, { marginTop: spacing.sm }]}>
                计划质量 {planning}
              </Text>
              <ProgressBar value={planning} color={colors.primary} />
            </View>
          </View>
          <Text style={styles.tip}>{tipForScore(preview.overall)}</Text>
        </Card>

        {plan.tasks.map((task, index) => (
          <View key={task.id} style={styles.taskCard}>
            <Text style={styles.taskTitle}>
              {index + 1}. {task.title}
            </Text>
            <View style={styles.statusRow}>
              {STATUSES.map((s) => {
                const active = results[task.id] === s;
                return (
                  <Pressable
                    key={s}
                    onPress={() => setStatus(task.id, s)}
                    style={[
                      styles.statusChip,
                      active && {
                        backgroundColor: statusColor(s) + '33',
                        borderColor: statusColor(s),
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        active && { color: statusColor(s), fontWeight: '700' },
                      ]}
                    >
                      {statusLabel(s)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}

        <Text style={styles.reflectLabel}>一句反思（可选）</Text>
        <TextInput
          value={reflection}
          onChangeText={setReflection}
          placeholder="今天卡住的点是什么？明天改什么？"
          placeholderTextColor={colors.textFaint}
          style={styles.reflectInput}
          multiline
          maxLength={200}
        />

        <Button
          label={plan.reviewedAt ? '更新复盘' : '提交复盘'}
          onPress={handleSave}
          style={{ marginTop: spacing.xl }}
        />
        <Button
          label="取消"
          variant="ghost"
          onPress={onBack}
          style={{ marginTop: spacing.sm }}
        />
      </ScrollView>
    </Screen>
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
  dateLabel: {
    color: colors.text,
    fontSize: font.h2,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  hint: {
    color: colors.textFaint,
    fontSize: font.small,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  scoreRow: { flexDirection: 'row', alignItems: 'center' },
  metaLabel: { color: colors.textFaint, fontSize: font.tiny },
  bigScore: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '800',
    marginTop: 2,
  },
  metaLine: {
    color: colors.textMuted,
    fontSize: font.tiny,
    marginBottom: 4,
  },
  tip: {
    color: colors.textMuted,
    fontSize: font.small,
    marginTop: spacing.md,
    lineHeight: 20,
  },
  taskCard: {
    marginTop: spacing.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  taskTitle: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  statusRow: { flexDirection: 'row', gap: spacing.sm },
  statusChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusText: { color: colors.textFaint, fontSize: font.small },
  reflectLabel: {
    color: colors.textMuted,
    fontSize: font.small,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  reflectInput: {
    minHeight: 88,
    textAlignVertical: 'top',
    color: colors.text,
    fontSize: font.body,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
});
