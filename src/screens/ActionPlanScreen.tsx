import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button, Card, Screen } from '../components/ui';
import {
  createEmptyPlan,
  createTask,
  formatDateLabel,
  priorityLabel,
  scorePlanning,
} from '../logic/actionScore';
import { colors, font, radius, spacing } from '../theme/theme';
import { DailyPlan, PlanTask } from '../types';

interface Props {
  date: string;
  existing?: DailyPlan;
  onSave: (plan: DailyPlan) => void;
  onBack: () => void;
}

const PRIORITIES: PlanTask['priority'][] = ['high', 'medium', 'low'];

export default function ActionPlanScreen({
  date,
  existing,
  onSave,
  onBack,
}: Props) {
  const [tasks, setTasks] = useState<PlanTask[]>(
    () => existing?.tasks.map((t) => ({ ...t })) ?? []
  );
  const [draft, setDraft] = useState('');
  const [priority, setPriority] = useState<PlanTask['priority']>('medium');

  const planningScore = useMemo(() => scorePlanning(tasks), [tasks]);

  const addTask = () => {
    const title = draft.trim();
    if (!title) return;
    if (tasks.length >= 10) return;
    setTasks((prev) => [...prev, createTask(title, priority)]);
    setDraft('');
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const cyclePriority = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const idx = PRIORITIES.indexOf(t.priority);
        return { ...t, priority: PRIORITIES[(idx + 1) % PRIORITIES.length] };
      })
    );
  };

  const handleSave = () => {
    const base = existing ?? createEmptyPlan(date);
    // 改计划会清空未提交的回顾状态（已复盘则保留结果里仍存在的任务）
    const keptResults =
      existing?.taskResults &&
      Object.fromEntries(
        Object.entries(existing.taskResults).filter(([taskId]) =>
          tasks.some((t) => t.id === taskId)
        )
      );
    const plan: DailyPlan = {
      ...base,
      tasks,
      reviewedAt:
        existing?.reviewedAt &&
        keptResults &&
        tasks.every((t) => keptResults[t.id])
          ? existing.reviewedAt
          : undefined,
      taskResults:
        existing?.reviewedAt &&
        keptResults &&
        tasks.every((t) => keptResults[t.id])
          ? keptResults
          : undefined,
      reflection:
        existing?.reviewedAt &&
        keptResults &&
        tasks.every((t) => keptResults[t.id])
          ? existing.reflection
          : undefined,
    };
    onSave(plan);
  };

  return (
    <Screen>
      <View style={styles.topBar}>
        <Pressable onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>‹ 返回</Text>
        </Pressable>
        <Text style={styles.title}>日计划</Text>
        <View style={{ width: 52 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.dateLabel}>{formatDateLabel(date)}</Text>
        <Text style={styles.hint}>
          建议写 3–6 件具体可完成的事。点优先级可切换高/中/低。
        </Text>

        <Card style={{ marginTop: spacing.md }}>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>计划质量预估</Text>
            <Text style={styles.scoreValue}>{planningScore}</Text>
          </View>
          <Text style={styles.scoreTip}>
            {tasks.length === 0
              ? '还没有任务'
              : tasks.length > 6
                ? '任务偏多，容易完不成'
                : tasks.length < 3
                  ? '可以再补一两件关键事项'
                  : '数量合适，保存后去执行吧'}
          </Text>
        </Card>

        <View style={styles.composer}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="例如：读完《思考快与慢》第 3 章"
            placeholderTextColor={colors.textFaint}
            style={styles.input}
            onSubmitEditing={addTask}
            returnKeyType="done"
            maxLength={80}
          />
          <View style={styles.composerRow}>
            <View style={styles.priorityPicker}>
              {PRIORITIES.map((p) => (
                <Pressable
                  key={p}
                  onPress={() => setPriority(p)}
                  style={[
                    styles.priorityChip,
                    priority === p && styles.priorityChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityChipText,
                      priority === p && styles.priorityChipTextActive,
                    ]}
                  >
                    {priorityLabel(p)}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              onPress={addTask}
              style={({ pressed }) => [
                styles.addBtn,
                pressed && { opacity: 0.75 },
                (!draft.trim() || tasks.length >= 10) && { opacity: 0.4 },
              ]}
            >
              <Text style={styles.addBtnText}>添加</Text>
            </Pressable>
          </View>
        </View>

        {tasks.map((task, index) => (
          <View key={task.id} style={styles.taskRow}>
            <Text style={styles.taskIndex}>{index + 1}</Text>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Pressable
              onPress={() => cyclePriority(task.id)}
              style={styles.prioBadge}
            >
              <Text style={styles.prioBadgeText}>
                {priorityLabel(task.priority)}
              </Text>
            </Pressable>
            <Pressable onPress={() => removeTask(task.id)} hitSlop={10}>
              <Text style={styles.remove}>✕</Text>
            </Pressable>
          </View>
        ))}

        {tasks.length === 0 && (
          <Text style={styles.empty}>先加几条今天打算做的事。</Text>
        )}

        <Button
          label="保存计划"
          onPress={handleSave}
          disabled={tasks.length === 0}
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
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  scoreLabel: { color: colors.textFaint, fontSize: font.tiny },
  scoreValue: { color: colors.accent, fontSize: font.h2, fontWeight: '800' },
  scoreTip: {
    color: colors.textMuted,
    fontSize: font.small,
    marginTop: spacing.sm,
  },
  composer: {
    marginTop: spacing.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  input: {
    color: colors.text,
    fontSize: font.body,
    paddingVertical: spacing.sm,
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  priorityPicker: { flexDirection: 'row', gap: spacing.xs },
  priorityChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priorityChipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  priorityChipText: { color: colors.textFaint, fontSize: font.tiny },
  priorityChipTextActive: { color: colors.text, fontWeight: '600' },
  addBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
  },
  addBtnText: { color: colors.white, fontWeight: '600', fontSize: font.small },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  taskIndex: { color: colors.textFaint, width: 18, fontSize: font.small },
  taskTitle: { flex: 1, color: colors.text, fontSize: font.body },
  prioBadge: {
    backgroundColor: colors.cardStrong,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  prioBadgeText: { color: colors.textMuted, fontSize: font.tiny },
  remove: { color: colors.textFaint, fontSize: font.body, paddingLeft: 4 },
  empty: {
    color: colors.textFaint,
    textAlign: 'center',
    marginTop: spacing.xl,
    fontSize: font.small,
  },
});
