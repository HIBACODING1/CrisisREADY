import { QuizCategory } from "./quiz-types";
import { floodQuiz } from "./quizzes/flood";
import { earthquakeQuiz } from "./quizzes/earthquake";
import { landslideQuiz } from "./quizzes/landslide";
import { fireQuiz } from "./quizzes/fire";
import { heatwaveQuiz } from "./quizzes/heatwave";

export type {
  QuizQuestion,
  QuizTier,
  QuizCategory,
} from "./quiz-types";

export const quizCategories: QuizCategory[] = [
  floodQuiz,
  earthquakeQuiz,
  landslideQuiz,
  fireQuiz,
  heatwaveQuiz,
];