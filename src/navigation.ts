export type Route =
  | { name: 'home' }
  | { name: 'quiz' }
  | { name: 'result'; assessmentId: string }
  | { name: 'library' }
  | { name: 'history' }
  | { name: 'action' }
  | { name: 'action-plan'; date: string }
  | { name: 'action-review'; date: string };
