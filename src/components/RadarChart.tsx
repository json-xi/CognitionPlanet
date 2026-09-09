import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  Polygon,
  RadialGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { DIMENSIONS, DIMENSION_MAP } from '../data/dimensions';
import { colors } from '../theme/theme';
import { DimensionScore } from '../types';

interface Props {
  scores: DimensionScore[];
  size?: number;
  /** 叠加显示的对比数据，例如上一次评估 */
  compare?: DimensionScore[];
}

const RINGS = [0.25, 0.5, 0.75, 1];

export default function RadarChart({ scores, size = 280, compare }: Props) {
  // 顶点标签分两行（维度名 + 分数），底部标签需要额外空间才不会被裁切
  const padding = 54;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - padding;

  const axes = useMemo(
    () =>
      DIMENSIONS.map((dim, i) => {
        // 从正上方开始，顺时针均分
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / DIMENSIONS.length;
        return { dim, angle };
      }),
    []
  );

  const pointAt = (angle: number, ratio: number) => ({
    x: cx + Math.cos(angle) * radius * ratio,
    y: cy + Math.sin(angle) * radius * ratio,
  });

  const polygonFor = (data: DimensionScore[]) =>
    axes
      .map(({ dim, angle }) => {
        const found = data.find((s) => s.dimension === dim.id);
        const ratio = Math.max((found?.score ?? 0) / 100, 0.04);
        const p = pointAt(angle, ratio);
        return `${p.x},${p.y}`;
      })
      .join(' ');

  const ringPolygon = (ratio: number) =>
    axes
      .map(({ angle }) => {
        const p = pointAt(angle, ratio);
        return `${p.x},${p.y}`;
      })
      .join(' ');

  return (
    <View>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id="radarFill" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={colors.accent} stopOpacity={0.55} />
            <Stop offset="100%" stopColor={colors.primary} stopOpacity={0.3} />
          </RadialGradient>
        </Defs>

        <G>
          {RINGS.map((r) => (
            <Polygon
              key={r}
              points={ringPolygon(r)}
              fill="none"
              stroke={colors.border}
              strokeWidth={1}
            />
          ))}

          {axes.map(({ dim, angle }) => {
            const p = pointAt(angle, 1);
            return (
              <Line
                key={dim.id}
                x1={cx}
                y1={cy}
                x2={p.x}
                y2={p.y}
                stroke={colors.border}
                strokeWidth={1}
              />
            );
          })}

          {compare && (
            <Polygon
              points={polygonFor(compare)}
              fill="none"
              stroke={colors.textFaint}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
          )}

          <Polygon
            points={polygonFor(scores)}
            fill="url(#radarFill)"
            stroke={colors.accent}
            strokeWidth={2}
          />

          {axes.map(({ dim, angle }) => {
            const found = scores.find((s) => s.dimension === dim.id);
            const ratio = Math.max((found?.score ?? 0) / 100, 0.04);
            const p = pointAt(angle, ratio);
            return (
              <Circle
                key={`dot-${dim.id}`}
                cx={p.x}
                cy={p.y}
                r={3.5}
                fill={DIMENSION_MAP[dim.id].color}
              />
            );
          })}

          {axes.map(({ dim, angle }) => {
            const label = pointAt(angle, 1.28);
            const cos = Math.cos(angle);
            const anchor =
              Math.abs(cos) < 0.2 ? 'middle' : cos > 0 ? 'start' : 'end';
            const found = scores.find((s) => s.dimension === dim.id);
            return (
              <G key={`label-${dim.id}`}>
                <SvgText
                  x={label.x}
                  y={label.y}
                  fill={colors.textMuted}
                  fontSize={11}
                  textAnchor={anchor}
                >
                  {dim.short}
                </SvgText>
                <SvgText
                  x={label.x}
                  y={label.y + 14}
                  fill={dim.color}
                  fontSize={12}
                  fontWeight="600"
                  textAnchor={anchor}
                >
                  {Math.round(found?.score ?? 0)}
                </SvgText>
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
}
