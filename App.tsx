import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, View } from 'react-native';
import { Screen } from './src/components/ui';
import { sampleQuizQuestions } from './src/logic/sample';
import { buildAssessment } from './src/logic/scoring';
import { Route } from './src/navigation';
import HistoryScreen from './src/screens/HistoryScreen';
import HomeScreen from './src/screens/HomeScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultScreen from './src/screens/ResultScreen';
import {
  loadAssessments,
  loadFinishedBooks,
  saveAssessment,
  toggleFinishedBook,
} from './src/storage/storage';
import { colors } from './src/theme/theme';
import { Assessment, Question } from './src/types';

export default function App() {
  const [route, setRoute] = useState<Route>({ name: 'home' });
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [finishedBooks, setFinishedBooks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  /** 当前这一场评估抽中的题目，进入 quiz 时生成，交卷后清空 */
  const [quizPaper, setQuizPaper] = useState<Question[] | null>(null);

  useEffect(() => {
    (async () => {
      const [list, finished] = await Promise.all([
        loadAssessments(),
        loadFinishedBooks(),
      ]);
      setAssessments(list);
      setFinishedBooks(finished);
      setLoading(false);
    })();
  }, []);

  const goHome = useCallback(() => {
    setQuizPaper(null);
    setRoute({ name: 'home' });
  }, []);

  const startQuiz = useCallback(() => {
    const paper = sampleQuizQuestions(assessments);
    setQuizPaper(paper);
    setRoute({ name: 'quiz' });
  }, [assessments]);

  // Android 物理返回键
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (route.name === 'home') return false;
      goHome();
      return true;
    });
    return () => sub.remove();
  }, [route, goHome]);

  const handleFinishQuiz = useCallback(
    async (answers: Record<string, string>) => {
      const questionIds = quizPaper?.map((q) => q.id) ?? Object.keys(answers);
      const assessment = buildAssessment(answers, questionIds);
      const next = await saveAssessment(assessment);
      setAssessments(next);
      setQuizPaper(null);
      setRoute({ name: 'result', assessmentId: assessment.id });
    },
    [quizPaper]
  );

  const handleToggleFinished = useCallback(async (bookId: string) => {
    const next = await toggleFinishedBook(bookId);
    setFinishedBooks(next);
  }, []);

  if (loading) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary} />
        </View>
        <StatusBar style="light" />
      </Screen>
    );
  }

  const latest = assessments[0];

  let content: React.ReactNode;

  switch (route.name) {
    case 'quiz':
      content = (
        <QuizScreen
          key={quizPaper?.map((q) => q.id).join(',') || 'empty'}
          questions={quizPaper ?? []}
          onFinish={handleFinishQuiz}
          onExit={goHome}
        />
      );
      break;

    case 'result': {
      const index = assessments.findIndex((a) => a.id === route.assessmentId);
      const assessment = index >= 0 ? assessments[index] : latest;
      if (!assessment) {
        content = (
          <HomeScreen
            historyCount={0}
            finishedCount={finishedBooks.length}
            onStart={startQuiz}
            onOpenResult={goHome}
            onOpenLibrary={() => setRoute({ name: 'library' })}
            onOpenHistory={() => setRoute({ name: 'history' })}
          />
        );
        break;
      }
      content = (
        <ResultScreen
          assessment={assessment}
          previous={index >= 0 ? assessments[index + 1] : assessments[1]}
          finishedBooks={finishedBooks}
          onToggleFinished={handleToggleFinished}
          onBack={goHome}
          onRetake={startQuiz}
        />
      );
      break;
    }

    case 'library':
      content = (
        <LibraryScreen
          finishedBooks={finishedBooks}
          onToggleFinished={handleToggleFinished}
          onBack={goHome}
        />
      );
      break;

    case 'history':
      content = (
        <HistoryScreen
          assessments={assessments}
          onOpen={(id) => setRoute({ name: 'result', assessmentId: id })}
          onBack={goHome}
        />
      );
      break;

    default:
      content = (
        <HomeScreen
          latest={latest}
          historyCount={assessments.length}
          finishedCount={finishedBooks.length}
          onStart={startQuiz}
          onOpenResult={() =>
            latest && setRoute({ name: 'result', assessmentId: latest.id })
          }
          onOpenLibrary={() => setRoute({ name: 'library' })}
          onOpenHistory={() => setRoute({ name: 'history' })}
        />
      );
  }

  return (
    <>
      {content}
      <StatusBar style="light" />
    </>
  );
}
