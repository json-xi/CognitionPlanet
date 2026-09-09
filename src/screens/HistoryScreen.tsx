import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';
import { Card, Screen } from '../components/ui';
import { DIMENSION_MAP, getLevel } from '../data/dimensions';
import { sortByWeakest } from '../logic/scoring';
import { colors, font, radius, spacing } from '../theme/theme';
import { Assessment } from '../types';

interface Props {
  assessments: Assessment[];
  onOpen: (id: string) => void;
  onBack: () => void;
}

export default function HistoryScreen({ assessments, onOpen, onBack }: Props) {
  // 时间正序用于画趋势线
  const chronological = [...assessments].sort((a, b) => a.createdAt - b.createdAt);

  return (
    <Screen>
      <View style={styles.topBar}>
        <Pressable onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>‹ 首页</Text>
        </Pressable>
        <Text style={styles.title}>成长轨迹</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {chronological.length >= 2 && (
          <Card style={{ marginBottom: spacing.lg }}>
            <Text style={styles.cardTitle}>总分变化</Text>
            <TrendLine data={chronological.map((a) => a.overall)} />
            <View style={styles.trendMeta}>
              <Text style={styles.trendMetaText}>
                首次 {Math.round(chronological[0].overall)}
              </Text>
              <Text style={styles.trendMetaText}>
                最新 {Math.round(chronological[chronological.length - 1].overall)}
              </Text>
            </View>
          </Card>
        )}

        {assessments.length === 0 && (
          <Text style={styles.empty}>还没有评估记录，先去测一次吧。</Text>
        )}

        {assessments.map((a, i) => {
          const level = getLevel(a.overall);
          const weakest = sortByWeakest(a.dimensionScores)[0];
          const older = assessments[i + 1];
          const delta = older
            ? Math.round((a.overall - older.overall) * 10) / 10
            : null;

          return (
            <Pressable
              key={a.id}
              onPress={() => onOpen(a.id)}
              style={({ pressed }) => [styles.row, pressed && { opacity: 0.75 }]}
            >
              <View style={[styles.dot, { backgroundColor: level.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>
                  {level.emoji} {level.name}
                  {i === 0 && <Text style={styles.latestTag}>  最新</Text>}
                </Text>
                <Text style={styles.rowSub}>
                  {new Date(a.createdAt).toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                <Text style={styles.rowWeak}>
                  短板：{DIMENSION_MAP[weakest.dimension].name}{' '}
                  {Math.round(weakest.score)}
                </Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.rowScore}>{Math.round(a.overall)}</Text>
                {delta !== null && (
                  <Text
                    style={[
                      styles.rowDelta,
                      { color: delta >= 0 ? colors.accent : colors.danger },
                    ]}
                  >
                    {delta >= 0 ? '+' : ''}
                    {delta}
                  </Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

function TrendLine({ data }: { data: number[] }) {
  const width = 260;
  const height = 90;
  const pad = 8;

  const max = Math.max(...data, 100);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = pad + (i * (width - pad * 2)) / Math.max(data.length - 1, 1);
    const y = height - pad - ((v - min) / range) * (height - pad * 2);
    return { x, y };
  });

  return (
    <View style={{ alignItems: 'center', marginTop: spacing.md }}>
      <Svg width={width} height={height}>
        <Polyline
          points={points.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={colors.accent}
          strokeWidth={2}
        />
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={3.5} fill={colors.accent} />
        ))}
      </Svg>
    </View>
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
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  cardTitle: { color: colors.text, fontSize: font.h3, fontWeight: '700' },
  trendMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  trendMetaText: { color: colors.textFaint, fontSize: font.tiny },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing.md },
  rowTitle: { color: colors.text, fontSize: font.body, fontWeight: '600' },
  latestTag: { color: colors.accent, fontSize: font.tiny, fontWeight: '400' },
  rowSub: { color: colors.textFaint, fontSize: font.tiny, marginTop: 3 },
  rowWeak: { color: colors.textMuted, fontSize: font.tiny, marginTop: 3 },
  rowRight: { alignItems: 'flex-end' },
  rowScore: { color: colors.text, fontSize: font.h2, fontWeight: '800' },
  rowDelta: { fontSize: font.tiny, fontWeight: '700' },
  empty: {
    color: colors.textFaint,
    fontSize: font.small,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});
