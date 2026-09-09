import React, { useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button, ProgressBar, Screen } from '../components/ui';
import { DIMENSION_MAP } from '../data/dimensions';
import { QUESTIONS } from '../data/questions';
import { colors, font, radius, spacing } from '../theme/theme';

interface Props {
  onFinish: (answers: Record<string, string>) => void;
  onExit: () => void;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export default function QuizScreen({ onFinish, onExit }: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const fade = useRef(new Animated.Value(1)).current;
  const slide = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  const question = QUESTIONS[index];
  const dim = DIMENSION_MAP[question.dimension];
  const selected = answers[question.id];
  const isLast = index === QUESTIONS.length - 1;

  const animateTo = (next: number, direction: 1 | -1) => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 0,
        duration: 130,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: -16 * direction,
        duration: 130,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIndex(next);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      slide.setValue(16 * direction);
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(slide, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleSelect = (optionId: string) => {
    const next = { ...answers, [question.id]: optionId };
    setAnswers(next);

    if (isLast) return;
    // 留一点时间让选中态被看见，再翻页
    setTimeout(() => animateTo(index + 1, 1), 220);
  };

  const goBack = () => {
    if (index === 0) {
      onExit();
      return;
    }
    animateTo(index - 1, -1);
  };

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / QUESTIONS.length) * 100;

  return (
    <Screen>
      <View style={styles.topBar}>
        <Pressable onPress={goBack} hitSlop={12}>
          <Text style={styles.back}>‹ {index === 0 ? '退出' : '上一题'}</Text>
        </Pressable>
        <Text style={styles.counter}>
          {index + 1} / {QUESTIONS.length}
        </Text>
      </View>

      <View style={styles.progressWrap}>
        <ProgressBar value={progress} color={dim.color} height={4} />
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{ opacity: fade, transform: [{ translateX: slide }] }}
        >
          <View
            style={[
              styles.dimTag,
              { borderColor: `${dim.color}55`, backgroundColor: `${dim.color}18` },
            ]}
          >
            <Text style={[styles.dimTagText, { color: dim.color }]}>
              {dim.emoji} {dim.name}
            </Text>
          </View>

          <Text style={styles.question}>{question.text}</Text>

          <View style={styles.options}>
            {question.options.map((opt, i) => {
              const active = selected === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => handleSelect(opt.id)}
                  style={({ pressed }) => [
                    styles.option,
                    active && {
                      borderColor: dim.color,
                      backgroundColor: `${dim.color}1F`,
                    },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <View
                    style={[
                      styles.letter,
                      active && { backgroundColor: dim.color, borderColor: dim.color },
                    ]}
                  >
                    <Text
                      style={[
                        styles.letterText,
                        active && { color: colors.bgDeep },
                      ]}
                    >
                      {LETTERS[i]}
                    </Text>
                  </View>
                  <Text
                    style={[styles.optionText, active && { color: colors.text }]}
                  >
                    {opt.text}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {isLast && (
            <Button
              label={
                answeredCount === QUESTIONS.length
                  ? '生成我的认知报告'
                  : `还有 ${QUESTIONS.length - answeredCount} 题未作答`
              }
              disabled={answeredCount !== QUESTIONS.length}
              onPress={() => onFinish(answers)}
              style={{ marginTop: spacing.xl }}
            />
          )}

          <Text style={styles.tip}>
            凭第一反应作答，不必追求「正确答案」——测的是你真实的思考方式。
          </Text>
        </Animated.View>
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
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  back: { color: colors.textMuted, fontSize: font.body },
  counter: { color: colors.textFaint, fontSize: font.small },
  progressWrap: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  dimTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  dimTagText: { fontSize: font.tiny, fontWeight: '600' },
  question: {
    color: colors.text,
    fontSize: font.h2,
    fontWeight: '700',
    lineHeight: 33,
    marginTop: spacing.md,
  },
  options: { marginTop: spacing.xl, gap: spacing.md },
  option: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  letter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  letterText: { color: colors.textMuted, fontSize: font.tiny, fontWeight: '700' },
  optionText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: font.body + 1,
    lineHeight: 24,
    paddingTop: 2,
  },
  tip: {
    color: colors.textFaint,
    fontSize: font.tiny,
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 18,
  },
});
