import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  QuizCategory,
  QuizTier,
  quizCategories,
} from "../data/quiz-data";
import {
  getUserQuizProgress,
  saveTierCompletion,
  UserQuizProgress,
} from "../utils/quiz-progress-storage";

import {
  getCurrentUser,
  LocalUser,
} from "../utils/auth-storage";

type CategoryProgress = {
  easy: boolean;
  moderate: boolean;
  expert: boolean;
};

type QuizProgress = {
  [categoryId: string]: CategoryProgress;
};

const emptyProgress: CategoryProgress = {
  easy: false,
  moderate: false,
  expert: false,
};

export default function QuizScreen() {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] =
    React.useState<QuizCategory | null>(null);

  const [selectedTier, setSelectedTier] =
    React.useState<QuizTier | null>(null);

  const [currentQuestion, setCurrentQuestion] =
    React.useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    React.useState<number | null>(null);

  const [score, setScore] = React.useState(0);

  const [quizFinished, setQuizFinished] =
    React.useState(false);

  // Each disaster now has its OWN progression.
  const [progress, setProgress] =
    React.useState<QuizProgress>({});

  const getCategoryProgress = (
    categoryId: string
  ): CategoryProgress => {
    return progress[categoryId] || emptyProgress;
  };

  const markTierPassed = (
    categoryId: string,
    tierId: "easy" | "moderate" | "expert"
  ) => {
    setProgress((previous) => {
      const oldProgress =
        previous[categoryId] || emptyProgress;

      return {
        ...previous,

        [categoryId]: {
          ...oldProgress,
          [tierId]: true,
        },
      };
    });
  };

  const startTier = (tier: QuizTier) => {
    if (tier.questions.length === 0) {
      return;
    }

    setSelectedTier(tier);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  };

  const returnToTiers = () => {
    setSelectedTier(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  };

  const returnToCategories = () => {
    setSelectedCategory(null);
    setSelectedTier(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  };

  const handleAnswer = (index: number) => {
    if (!selectedTier || selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(index);

    const question =
      selectedTier.questions[currentQuestion];

    if (index === question.correctAnswer) {
      setScore((previousScore) => previousScore + 1);
    }
  };

  const goNext = () => {
    if (!selectedTier || !selectedCategory) {
      return;
    }

    if (
      currentQuestion + 1 <
      selectedTier.questions.length
    ) {
      setCurrentQuestion(
        (previousQuestion) =>
          previousQuestion + 1
      );

      setSelectedAnswer(null);
    } else {
      // 4/5 or 5/5 = pass
      if (score >= 4) {
        markTierPassed(
          selectedCategory.id,
          selectedTier.id
        );
      }

      setQuizFinished(true);
    }
  };

  const restartTier = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  };

  // ======================================================
  // SCREEN 1 — DISASTER CATEGORIES
  // ======================================================

  if (!selectedCategory) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
            >
              <Text style={styles.backIcon}>
                ‹
              </Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              Quiz Zone
            </Text>

            <View style={{ width: 30 }} />
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <Ionicons
                name="school-outline"
                size={36}
                color="#FFFFFF"
              />
            </View>

            <Text style={styles.heroTitle}>
              Emergency Learning Path
            </Text>

            <Text style={styles.heroSubtitle}>
              Complete Easy, Moderate and Expert
              levels to become an expert in each
              emergency category.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>
            Choose a Disaster
          </Text>

          {quizCategories.map((category) => {
            const categoryProgress =
              getCategoryProgress(category.id);

            const badgeEarned =
              categoryProgress.expert;

            return (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() =>
                  setSelectedCategory(category)
                }
              >
                <View
                  style={styles.categoryEmojiBox}
                >
                  <Text
                    style={styles.categoryEmoji}
                  >
                    {category.emoji}
                  </Text>
                </View>

                <View style={styles.categoryText}>
                  <Text
                    style={styles.categoryTitle}
                  >
                    {category.title}
                  </Text>

                  <Text
                    style={
                      styles.categoryDescription
                    }
                  >
                    {category.description}
                  </Text>

                  <Text
                    style={styles.questionCount}
                  >
                    15 Question Learning Path
                  </Text>

                  {badgeEarned && (
                    <Text
                      style={
                        styles.categoryBadgeText
                      }
                    >
                      🏅 Expert Badge Earned
                    </Text>
                  )}
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            );
          })}

          <View style={styles.bottomSpace} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ======================================================
  // SCREEN 2 — TIERS
  // ======================================================

  if (!selectedTier) {
    const categoryProgress =
      getCategoryProgress(selectedCategory.id);

    const easyTier =
      selectedCategory.tiers.find(
        (tier) => tier.id === "easy"
      );

    const moderateTier =
      selectedCategory.tiers.find(
        (tier) => tier.id === "moderate"
      );

    const expertTier =
      selectedCategory.tiers.find(
        (tier) => tier.id === "expert"
      );

    const easyPassed =
      categoryProgress.easy;

    const moderatePassed =
      categoryProgress.moderate;

    const expertPassed =
      categoryProgress.expert;

    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={returnToCategories}
            >
              <Text style={styles.backIcon}>
                ‹
              </Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              {selectedCategory.title}
            </Text>

            <View style={{ width: 30 }} />
          </View>

          <View style={styles.categoryHero}>
            <Text style={styles.bigEmoji}>
              {selectedCategory.emoji}
            </Text>

            <Text
              style={styles.categoryHeroTitle}
            >
              {selectedCategory.title}
            </Text>

            <Text
              style={
                styles.categoryHeroSubtitle
              }
            >
              Complete all three levels to earn
              the expert badge.
            </Text>

            <View
              style={styles.totalQuestionsBox}
            >
              <Text
                style={styles.totalQuestionsText}
              >
                15 Questions Total
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>
            Learning Levels
          </Text>

          {/* EASY */}

          <TouchableOpacity
            style={styles.tierCard}
            onPress={() => {
              if (easyTier) {
                startTier(easyTier);
              }
            }}
          >
            <View
              style={[
                styles.tierNumber,
                styles.easyNumber,
              ]}
            >
              <Text style={styles.tierNumberText}>
                1
              </Text>
            </View>

            <View style={styles.tierContent}>
              <Text style={styles.tierLabel}>
                TIER 1
              </Text>

              <Text style={styles.tierTitle}>
                Easy
              </Text>

              <Text style={styles.tierInfo}>
                5 Questions
              </Text>

              <Text style={styles.availableText}>
                {easyPassed
                  ? "✓ Completed"
                  : "● Available"}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={24}
              color="#16A34A"
            />
          </TouchableOpacity>

          {/* MODERATE */}

          {easyPassed ? (
            <TouchableOpacity
              style={styles.tierCard}
              onPress={() => {
                if (moderateTier) {
                  startTier(moderateTier);
                }
              }}
            >
              <View
                style={[
                  styles.tierNumber,
                  styles.moderateNumber,
                ]}
              >
                <Text
                  style={styles.tierNumberText}
                >
                  2
                </Text>
              </View>

              <View style={styles.tierContent}>
                <Text style={styles.tierLabel}>
                  TIER 2
                </Text>

                <Text style={styles.tierTitle}>
                  Moderate
                </Text>

                <Text style={styles.tierInfo}>
                  5 Questions
                </Text>

                <Text
                  style={styles.availableText}
                >
                  {moderatePassed
                    ? "✓ Completed"
                    : "● Unlocked"}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={24}
                color="#16A34A"
              />
            </TouchableOpacity>
          ) : (
            <View
              style={[
                styles.tierCard,
                styles.lockedTier,
              ]}
            >
              <View
                style={[
                  styles.tierNumber,
                  styles.moderateNumber,
                ]}
              >
                <Text
                  style={styles.tierNumberText}
                >
                  2
                </Text>
              </View>

              <View style={styles.tierContent}>
                <Text style={styles.tierLabel}>
                  TIER 2
                </Text>

                <Text style={styles.tierTitle}>
                  Moderate
                </Text>

                <Text style={styles.tierInfo}>
                  5 Questions
                </Text>

                <Text style={styles.lockedText}>
                  🔒 Complete Easy to unlock
                </Text>
              </View>
            </View>
          )}

          {/* EXPERT */}

          {moderatePassed ? (
            <TouchableOpacity
              style={styles.tierCard}
              onPress={() => {
                if (expertTier) {
                  startTier(expertTier);
                }
              }}
            >
              <View
                style={[
                  styles.tierNumber,
                  styles.expertNumber,
                ]}
              >
                <Text
                  style={styles.tierNumberText}
                >
                  3
                </Text>
              </View>

              <View style={styles.tierContent}>
                <Text style={styles.tierLabel}>
                  TIER 3
                </Text>

                <Text style={styles.tierTitle}>
                  Expert
                </Text>

                <Text style={styles.tierInfo}>
                  5 Questions
                </Text>

                <Text
                  style={styles.availableText}
                >
                  {expertPassed
                    ? "✓ Completed"
                    : "● Unlocked"}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={24}
                color="#16A34A"
              />
            </TouchableOpacity>
          ) : (
            <View
              style={[
                styles.tierCard,
                styles.lockedTier,
              ]}
            >
              <View
                style={[
                  styles.tierNumber,
                  styles.expertNumber,
                ]}
              >
                <Text
                  style={styles.tierNumberText}
                >
                  3
                </Text>
              </View>

              <View style={styles.tierContent}>
                <Text style={styles.tierLabel}>
                  TIER 3
                </Text>

                <Text style={styles.tierTitle}>
                  Expert
                </Text>

                <Text style={styles.tierInfo}>
                  5 Questions
                </Text>

                <Text style={styles.lockedText}>
                  🔒 Complete Moderate to unlock
                </Text>
              </View>
            </View>
          )}

          {/* BADGE */}

          <View
            style={[
              styles.badgeCard,
              expertPassed &&
                styles.badgeEarnedCard,
            ]}
          >
            <Text style={styles.badgeEmoji}>
              🏅
            </Text>

            <View style={styles.badgeTextBox}>
              <Text style={styles.badgeLabel}>
                EXPERT BADGE
              </Text>

              <Text style={styles.badgeTitle}>
                {selectedCategory.badgeTitle}
              </Text>

              <Text
                style={
                  expertPassed
                    ? styles.badgeEarned
                    : styles.badgeLocked
                }
              >
                {expertPassed
                  ? "✓ Badge Earned"
                  : "🔒 Complete all 3 tiers"}
              </Text>
            </View>
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ======================================================
  // SCREEN 3 — RESULT
  // ======================================================

  if (quizFinished) {
    const passed = score >= 4;

    const isExpert =
      selectedTier.id === "expert";

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.resultContainer}>
          <View style={styles.resultCard}>
            <Text style={styles.resultEmoji}>
              {passed
                ? isExpert
                  ? "🏅"
                  : "✅"
                : "📚"}
            </Text>

            <Text style={styles.resultTitle}>
              {passed
                ? isExpert
                  ? "Expert Badge Earned!"
                  : "Tier Completed!"
                : "Keep Learning"}
            </Text>

            <Text style={styles.resultTier}>
              {selectedCategory.title} —{" "}
              {selectedTier.title}
            </Text>

            <Text style={styles.resultScore}>
              {score} /{" "}
              {selectedTier.questions.length}
            </Text>

            <Text style={styles.percentage}>
              {Math.round(
                (score /
                  selectedTier.questions.length) *
                  100
              )}
              %
            </Text>

            {passed ? (
              <Text style={styles.resultMessage}>
                {isExpert
                  ? `Congratulations! You earned the ${selectedCategory.badgeTitle} badge.`
                  : "Great work! You passed this level. The next tier has been unlocked."}
              </Text>
            ) : (
              <Text style={styles.resultMessage}>
                You need at least 4/5 (80%) to
                pass this level. Try again.
              </Text>
            )}

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={restartTier}
            >
              <Text
                style={styles.primaryButtonText}
              >
                Retry This Tier
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={returnToTiers}
            >
              <Text
                style={
                  styles.secondaryButtonText
                }
              >
                Return to Levels
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ======================================================
  // SCREEN 4 — QUESTIONS
  // ======================================================

  const question =
    selectedTier.questions[currentQuestion];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={returnToTiers}
          >
            <Text style={styles.backIcon}>
              ‹
            </Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {selectedTier.title}
          </Text>

          <View style={{ width: 30 }} />
        </View>

        <View style={styles.quizTopCard}>
          <Text style={styles.quizTopEmoji}>
            {selectedCategory.emoji}
          </Text>

          <Text style={styles.quizTopTitle}>
            {selectedCategory.title}
          </Text>

          <Text style={styles.quizLevel}>
            {selectedTier.title} Level
          </Text>

          <View style={styles.progressBox}>
            <Text style={styles.progressText}>
              Question {currentQuestion + 1} /{" "}
              {selectedTier.questions.length}
            </Text>
          </View>
        </View>

        <View style={styles.scenarioCard}>
          <Text style={styles.scenarioLabel}>
            Scenario
          </Text>

          <Text style={styles.scenarioText}>
            {question.scenario}
          </Text>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionText}>
            {question.question}
          </Text>

          {question.options.map(
            (option, index) => {
              const isSelected =
                selectedAnswer === index;

              const isCorrect =
                question.correctAnswer === index;

              const showCorrect =
                selectedAnswer !== null &&
                isCorrect;

              const showWrong =
                selectedAnswer !== null &&
                isSelected &&
                !isCorrect;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    showCorrect &&
                      styles.correctOption,
                    showWrong &&
                      styles.wrongOption,
                  ]}
                  onPress={() =>
                    handleAnswer(index)
                  }
                >
                  <View
                    style={styles.optionCircle}
                  >
                    <Text
                      style={styles.optionLetter}
                    >
                      {String.fromCharCode(
                        65 + index
                      )}
                    </Text>
                  </View>

                  <Text
                    style={styles.optionText}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            }
          )}
        </View>

        {selectedAnswer !== null && (
          <View
            style={[
              styles.feedbackCard,

              selectedAnswer ===
              question.correctAnswer
                ? styles.correctFeedback
                : styles.wrongFeedback,
            ]}
          >
            <Text style={styles.feedbackTitle}>
              {selectedAnswer ===
              question.correctAnswer
                ? "Correct Answer"
                : "Not the Safest Choice"}
            </Text>

            <Text style={styles.feedbackText}>
              {question.explanation}
            </Text>

            <TouchableOpacity
              style={styles.nextButton}
              onPress={goNext}
            >
              <Text
                style={styles.nextButtonText}
              >
                {currentQuestion + 1 ===
                selectedTier.questions.length
                  ? "Finish Quiz"
                  : "Next Question"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    flex: 1,
    paddingHorizontal: 22,
  },

  header: {
    marginTop: 10,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backIcon: {
    fontSize: 36,
    color: "#111827",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
  },

  heroCard: {
    backgroundColor: "#2563EB",
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
    marginBottom: 24,
  },

  heroIcon: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor:
      "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  heroTitle: {
    fontSize: 25,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
  },

  heroSubtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: "#DBEAFE",
    textAlign: "center",
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 14,
  },

  categoryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  categoryEmojiBox: {
    width: 58,
    height: 58,
    backgroundColor: "#DBEAFE",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  categoryEmoji: {
    fontSize: 30,
  },

  categoryText: {
    flex: 1,
  },

  categoryTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#111827",
  },

  categoryDescription: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
  },

  questionCount: {
    marginTop: 6,
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "800",
  },

  categoryBadgeText: {
    marginTop: 6,
    fontSize: 12,
    color: "#16A34A",
    fontWeight: "900",
  },

  categoryHero: {
    backgroundColor: "#2563EB",
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
    marginBottom: 22,
  },

  bigEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },

  categoryHeroTitle: {
    fontSize: 25,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  categoryHeroSubtitle: {
    marginTop: 7,
    fontSize: 14,
    color: "#DBEAFE",
    textAlign: "center",
  },

  totalQuestionsBox: {
    marginTop: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },

  totalQuestionsText: {
    color: "#2563EB",
    fontWeight: "900",
    fontSize: 13,
  },

  tierCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  lockedTier: {
    opacity: 0.55,
  },

  tierNumber: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  easyNumber: {
    backgroundColor: "#DCFCE7",
  },

  moderateNumber: {
    backgroundColor: "#FEF3C7",
  },

  expertNumber: {
    backgroundColor: "#F3E8FF",
  },

  tierNumberText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
  },

  tierContent: {
    flex: 1,
  },

  tierLabel: {
    fontSize: 11,
    fontWeight: "900",
    color: "#6B7280",
  },

  tierTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
    marginTop: 2,
  },

  tierInfo: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  availableText: {
    color: "#16A34A",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 5,
  },

  lockedText: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 5,
  },

  badgeCard: {
    backgroundColor: "#FFF7ED",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#FDBA74",
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  badgeEarnedCard: {
    backgroundColor: "#F0FDF4",
    borderColor: "#16A34A",
  },

  badgeEmoji: {
    fontSize: 42,
    marginRight: 14,
  },

  badgeTextBox: {
    flex: 1,
  },

  badgeLabel: {
    fontSize: 11,
    color: "#EA580C",
    fontWeight: "900",
  },

  badgeTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
    marginTop: 3,
  },

  badgeLocked: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 5,
  },

  badgeEarned: {
    fontSize: 12,
    color: "#16A34A",
    fontWeight: "900",
    marginTop: 5,
  },

  quizTopCard: {
    backgroundColor: "#2563EB",
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
    marginBottom: 16,
  },

  quizTopEmoji: {
    fontSize: 40,
  },

  quizTopTitle: {
    fontSize: 23,
    fontWeight: "900",
    color: "#FFFFFF",
    marginTop: 6,
  },

  quizLevel: {
    fontSize: 14,
    color: "#DBEAFE",
    fontWeight: "700",
    marginTop: 3,
  },

  progressBox: {
    marginTop: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  progressText: {
    color: "#2563EB",
    fontWeight: "900",
  },

  scenarioCard: {
    backgroundColor: "#FEFCE8",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#FACC15",
    marginBottom: 14,
  },

  scenarioLabel: {
    fontSize: 13,
    fontWeight: "900",
    color: "#CA8A04",
    marginBottom: 8,
    textTransform: "uppercase",
  },

  scenarioText: {
    fontSize: 15,
    lineHeight: 23,
    color: "#111827",
    fontWeight: "700",
  },

  questionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 14,
  },

  questionText: {
    fontSize: 18,
    lineHeight: 25,
    color: "#111827",
    fontWeight: "900",
    marginBottom: 16,
  },

  optionButton: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 15,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  correctOption: {
    backgroundColor: "#DCFCE7",
    borderColor: "#16A34A",
  },

  wrongOption: {
    backgroundColor: "#FEE2E2",
    borderColor: "#DC2626",
  },

  optionCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E0E7FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  optionLetter: {
    color: "#2563EB",
    fontWeight: "900",
  },

  optionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#111827",
    fontWeight: "700",
  },

  feedbackCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
  },

  correctFeedback: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },

  wrongFeedback: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },

  feedbackTitle: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "900",
    marginBottom: 8,
  },

  feedbackText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#374151",
    marginBottom: 14,
  },

  nextButton: {
    backgroundColor: "#2563EB",
    borderRadius: 13,
    paddingVertical: 13,
    alignItems: "center",
  },

  nextButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  resultContainer: {
    flex: 1,
    paddingHorizontal: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  resultCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 26,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  resultEmoji: {
    fontSize: 55,
    marginBottom: 12,
  },

  resultTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
    textAlign: "center",
  },

  resultTier: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 5,
  },

  resultScore: {
    fontSize: 44,
    fontWeight: "900",
    color: "#2563EB",
    marginTop: 18,
  },

  percentage: {
    fontSize: 18,
    fontWeight: "900",
    color: "#16A34A",
    marginBottom: 12,
  },

  resultMessage: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 20,
  },

  primaryButton: {
    width: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  secondaryButton: {
    width: "100%",
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#111827",
    fontWeight: "900",
  },

  bottomSpace: {
    height: 40,
  },
});