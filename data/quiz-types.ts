export type QuizQuestion = {
  scenario: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export type QuizTier = {
  id: "easy" | "moderate" | "expert";
  title: string;
  questions: QuizQuestion[];
};

export type QuizCategory = {
  id: string;
  title: string;
  badgeTitle: string;
  emoji: string;
  description: string;
  tiers: QuizTier[];
};