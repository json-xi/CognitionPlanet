import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DIMENSION_MAP } from '../data/dimensions';
import { colors, font, radius, spacing } from '../theme/theme';
import { Book, BookLevel } from '../types';

const LEVEL_TEXT: Record<BookLevel, string> = {
  entry: '入门',
  advanced: '进阶',
  deep: '深度',
};

const LEVEL_COLOR: Record<BookLevel, string> = {
  entry: colors.accent,
  advanced: colors.gold,
  deep: colors.primary,
};

interface Props {
  book: Book;
  index?: number;
  finished?: boolean;
  onToggleFinished?: (id: string) => void;
}

export default function BookCard({
  book,
  index,
  finished,
  onToggleFinished,
}: Props) {
  const primary = DIMENSION_MAP[book.dimensions[0]];

  return (
    <View style={[styles.card, finished && styles.cardFinished]}>
      <View style={styles.header}>
        <View style={[styles.spine, { backgroundColor: primary.color }]} />
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={2}>
            {index !== undefined ? `${index}. ` : ''}
            {book.title}
          </Text>
          <Text style={styles.author}>{book.author}</Text>
        </View>
        {onToggleFinished && (
          <Pressable
            hitSlop={10}
            onPress={() => onToggleFinished(book.id)}
            style={[styles.check, finished && styles.checkOn]}
          >
            <Text style={[styles.checkMark, finished && styles.checkMarkOn]}>
              ✓
            </Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.reason}>{book.reason}</Text>

      <View style={styles.meta}>
        <View
          style={[
            styles.pill,
            {
              borderColor: `${primary.color}55`,
              backgroundColor: `${primary.color}18`,
            },
          ]}
        >
          <Text style={[styles.pillText, { color: primary.color }]}>
            {primary.emoji} {primary.name}
          </Text>
        </View>
        <View
          style={[
            styles.pill,
            {
              borderColor: `${LEVEL_COLOR[book.level]}55`,
              backgroundColor: `${LEVEL_COLOR[book.level]}18`,
            },
          ]}
        >
          <Text style={[styles.pillText, { color: LEVEL_COLOR[book.level] }]}>
            {LEVEL_TEXT[book.level]}
          </Text>
        </View>
        {book.tags.slice(0, 2).map((t) => (
          <View key={t} style={styles.pill}>
            <Text style={styles.pillText}>{t}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardFinished: { opacity: 0.55 },
  header: { flexDirection: 'row', alignItems: 'flex-start' },
  spine: {
    width: 4,
    height: 38,
    borderRadius: 2,
    marginRight: spacing.md,
    marginTop: 2,
  },
  headerText: { flex: 1 },
  title: {
    color: colors.text,
    fontSize: font.h3 - 1,
    fontWeight: '700',
    lineHeight: 23,
  },
  author: {
    color: colors.textFaint,
    fontSize: font.small,
    marginTop: 3,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  checkOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  checkMark: { color: colors.textFaint, fontSize: 14, fontWeight: '700' },
  checkMarkOn: { color: colors.bgDeep },
  reason: {
    color: colors.textMuted,
    fontSize: font.small + 1,
    lineHeight: 21,
    marginTop: spacing.md,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.md,
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  pillText: { color: colors.textMuted, fontSize: font.tiny },
});
