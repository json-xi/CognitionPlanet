import { LinearGradient } from 'expo-linear-gradient';
import React, { ReactNode } from 'react';
import {
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native';
import { colors, font, radius, spacing } from '../theme/theme';

export function Screen({ children }: { children: ReactNode }) {
  return (
    <LinearGradient
      colors={[colors.bgDeep, colors.bgMid, colors.bgSoft]}
      locations={[0, 0.55, 1]}
      style={styles.flex}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe}>{children}</SafeAreaView>
    </LinearGradient>
  );
}

export function Card({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  style,
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.buttonPrimary : styles.buttonGhost,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.buttonLabel,
          !isPrimary && { color: colors.textMuted },
          disabled && { color: colors.textFaint },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function ProgressBar({
  value,
  color = colors.primary,
  height = 6,
}: {
  value: number;
  color?: string;
  height?: number;
}) {
  return (
    <View style={[styles.progressTrack, { height, borderRadius: height / 2 }]}>
      <View
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  button: {
    borderRadius: radius.pill,
    paddingVertical: 15,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: { backgroundColor: colors.primary },
  buttonGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  buttonDisabled: { backgroundColor: 'rgba(255,255,255,0.07)' },
  buttonPressed: { opacity: 0.75, transform: [{ scale: 0.985 }] },
  buttonLabel: {
    color: colors.white,
    fontSize: font.body,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  progressTrack: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.09)',
    overflow: 'hidden',
  },
});
