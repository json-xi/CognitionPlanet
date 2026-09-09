import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { colors } from '../theme/theme';

interface Props {
  size?: number;
  color?: string;
  emoji?: string;
  label?: string;
}

export default function PlanetOrb({
  size = 180,
  color = colors.primary,
  emoji = '🪐',
  label,
}: Props) {
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinLoop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 18000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 2600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    spinLoop.start();
    pulseLoop.start();
    return () => {
      spinLoop.stop();
      pulseLoop.stop();
    };
  }, [spin, pulse]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });

  const r = size / 2;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={[StyleSheet.absoluteFill, { transform: [{ rotate }] }]}
      >
        <Svg width={size} height={size}>
          <Ellipse
            cx={r}
            cy={r}
            rx={r - 4}
            ry={(r - 4) * 0.42}
            fill="none"
            stroke={`${color}66`}
            strokeWidth={1.2}
          />
          <Circle cx={size - 6} cy={r} r={3} fill={colors.gold} />
        </Svg>
      </Animated.View>

      <Animated.View style={{ transform: [{ scale }] }}>
        <Svg width={size * 0.62} height={size * 0.62}>
          <Defs>
            <RadialGradient id="orb" cx="35%" cy="30%" r="75%">
              <Stop offset="0%" stopColor={color} stopOpacity={0.95} />
              <Stop offset="65%" stopColor={color} stopOpacity={0.45} />
              <Stop offset="100%" stopColor={colors.bgDeep} stopOpacity={0.9} />
            </RadialGradient>
          </Defs>
          <Circle
            cx={size * 0.31}
            cy={size * 0.31}
            r={size * 0.29}
            fill="url(#orb)"
            stroke={`${color}88`}
            strokeWidth={1}
          />
        </Svg>
        <View style={styles.center} pointerEvents="none">
          <Text style={{ fontSize: size * 0.2 }}>{emoji}</Text>
        </View>
      </Animated.View>

      {!!label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 6,
  },
});
