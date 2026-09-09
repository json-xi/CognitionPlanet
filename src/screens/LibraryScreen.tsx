import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BookCard from '../components/BookCard';
import { Screen } from '../components/ui';
import { BOOKS } from '../data/books';
import { DIMENSIONS } from '../data/dimensions';
import { colors, font, radius, spacing } from '../theme/theme';
import { BookLevel, DimensionId } from '../types';

interface Props {
  finishedBooks: string[];
  onToggleFinished: (id: string) => void;
  onBack: () => void;
}

const LEVEL_FILTERS: { id: BookLevel | 'all'; label: string }[] = [
  { id: 'all', label: '全部难度' },
  { id: 'entry', label: '入门' },
  { id: 'advanced', label: '进阶' },
  { id: 'deep', label: '深度' },
];

export default function LibraryScreen({
  finishedBooks,
  onToggleFinished,
  onBack,
}: Props) {
  const [dimFilter, setDimFilter] = useState<DimensionId | 'all'>('all');
  const [levelFilter, setLevelFilter] = useState<BookLevel | 'all'>('all');

  const books = useMemo(
    () =>
      BOOKS.filter(
        (b) =>
          (dimFilter === 'all' || b.dimensions.includes(dimFilter)) &&
          (levelFilter === 'all' || b.level === levelFilter)
      ),
    [dimFilter, levelFilter]
  );

  return (
    <Screen>
      <View style={styles.topBar}>
        <Pressable onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>‹ 首页</Text>
        </Pressable>
        <Text style={styles.title}>书库</Text>
        <Text style={styles.count}>{books.length} 本</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chipRow}
      >
        <Chip
          label="全部维度"
          active={dimFilter === 'all'}
          onPress={() => setDimFilter('all')}
        />
        {DIMENSIONS.map((d) => (
          <Chip
            key={d.id}
            label={`${d.emoji} ${d.short}`}
            color={d.color}
            active={dimFilter === d.id}
            onPress={() => setDimFilter(d.id)}
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={[styles.chipRow, { paddingTop: 0 }]}
      >
        {LEVEL_FILTERS.map((l) => (
          <Chip
            key={l.id}
            label={l.label}
            active={levelFilter === l.id}
            onPress={() => setLevelFilter(l.id)}
          />
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {books.map((b) => (
          <BookCard
            key={b.id}
            book={b}
            finished={finishedBooks.includes(b.id)}
            onToggleFinished={onToggleFinished}
          />
        ))}
        {books.length === 0 && (
          <Text style={styles.empty}>这个组合下暂时没有书，换个筛选看看。</Text>
        )}
      </ScrollView>
    </Screen>
  );
}

function Chip({
  label,
  active,
  color,
  onPress,
}: {
  label: string;
  active: boolean;
  color?: string;
  onPress: () => void;
}) {
  const tint = color ?? colors.primary;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active && { borderColor: tint, backgroundColor: `${tint}22` },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Text style={[styles.chipText, active && { color: tint, fontWeight: '600' }]}>
        {label}
      </Text>
    </Pressable>
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
  back: { color: colors.textMuted, fontSize: font.body, width: 60 },
  title: { color: colors.text, fontSize: font.h3, fontWeight: '700' },
  count: { color: colors.textFaint, fontSize: font.small, width: 60, textAlign: 'right' },
  // 横向 ScrollView 在纵向 flex 容器里会被拉伸，需显式禁止伸缩
  chipScroll: { flexGrow: 0, flexShrink: 0 },
  chipRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  chipText: { color: colors.textMuted, fontSize: font.small },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  empty: {
    color: colors.textFaint,
    fontSize: font.small,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});
