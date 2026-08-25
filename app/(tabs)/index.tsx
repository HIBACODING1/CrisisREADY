import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  DisasterAlert,
  getActiveAlerts,
} from "../../utils/alert-storage";

import {
  getCurrentUser,
} from "../../utils/auth-storage";

import {
  getUserQuizProgress,
} from "../../utils/quiz-progress-storage";

import {
  getChecklistProgress,
} from "../../utils/checklist-storage";

import {
  quizCategories,
} from "../../data/quiz-data";

export default function HomeScreen() {
  const router = useRouter();

  const [activeAlerts, setActiveAlerts] =
    useState<DisasterAlert[]>([]);

  const [userName, setUserName] =
    useState("User");

  const [preparednessScore, setPreparednessScore] =
    useState(0);

  const [quizPercentage, setQuizPercentage] =
    useState(0);

  const [checklistPercentage, setChecklistPercentage] =
    useState(0);

  // ======================================================
  // LOAD ALERTS
  // ======================================================

  const loadAlerts = async () => {
    try {
      const alerts = await getActiveAlerts();
      setActiveAlerts(alerts);
    } catch (error) {
      console.log(
        "Could not load home alerts:",
        error
      );
    }
  };

  // ======================================================
  // LOAD PREPAREDNESS SCORE
  // ======================================================

  const loadPreparedness = async () => {
    try {
      const user = await getCurrentUser();

      if (!user) {
        return;
      }

      setUserName(user.name || "User");

      // ==================================================
      // QUIZ PROGRESS
      // ==================================================

      const quizProgress =
        await getUserQuizProgress(user.id);

      let completedQuizLevels = 0;

      quizCategories.forEach((category) => {
        const progress =
          quizProgress[category.id];

        if (!progress) {
          return;
        }

        if (progress.easy) {
          completedQuizLevels += 1;
        }

        if (progress.moderate) {
          completedQuizLevels += 1;
        }

        if (progress.expert) {
          completedQuizLevels += 1;
        }
      });

      const totalQuizLevels =
        quizCategories.length * 3;

      const calculatedQuizPercentage =
        totalQuizLevels === 0
          ? 0
          : Math.round(
              (completedQuizLevels /
                totalQuizLevels) *
                100
            );

      setQuizPercentage(
        calculatedQuizPercentage
      );

      // ==================================================
      // CHECKLIST PROGRESS
      // ==================================================

      const completedChecklistIds =
        await getChecklistProgress(
          user.id
        );

      const TOTAL_CHECKLIST_TASKS = 21;

      const calculatedChecklistPercentage =
        Math.round(
          (completedChecklistIds.length /
            TOTAL_CHECKLIST_TASKS) *
            100
        );

      setChecklistPercentage(
        calculatedChecklistPercentage
      );

      // ==================================================
      // FINAL PREPAREDNESS SCORE
      // 50% QUIZ + 50% CHECKLIST
      // ==================================================

      const finalScore =
        Math.round(
          calculatedQuizPercentage *
            0.5 +
            calculatedChecklistPercentage *
              0.5
        );

      setPreparednessScore(finalScore);

      console.log(
        "QUIZ:",
        calculatedQuizPercentage
      );

      console.log(
        "CHECKLIST:",
        calculatedChecklistPercentage
      );

      console.log(
        "FINAL SCORE:",
        finalScore
      );
    } catch (error) {
      console.log(
        "Could not calculate preparedness score:",
        error
      );
    }
  };

  // ======================================================
  // REFRESH EVERY TIME HOME OPENS
  // ======================================================

  useFocusEffect(
    useCallback(() => {
      loadAlerts();
      loadPreparedness();
    }, [])
  );

  const latestAlert =
    activeAlerts.length > 0
      ? activeAlerts[0]
      : null;

  // ======================================================
  // NAVIGATION
  // ======================================================

  const openChecklist = () => {
    router.push(
      "/(tabs)/checklist" as any
    );
  };

  const openResources = () => {
    router.push(
      "/(tabs)/explore" as any
    );
  };

  const openQuiz = () => {
    router.push("/quiz" as any);
  };

  const openEmergencyGuide = () => {
    router.push(
      "/(tabs)/alerts" as any
    );
  };

  const openPanic = () => {
    router.push("/panic" as any);
  };

  const openAlerts = () => {
    router.push(
      "/(tabs)/alerts" as any
    );
  };

  // ======================================================
  // ALERT EMOJI
  // ======================================================

  const getAlertEmoji = (
    disasterType: string
  ) => {
    switch (
      disasterType.toLowerCase()
    ) {
      case "flood":
        return "🌊";

      case "earthquake":
        return "🌍";

      case "landslide":
        return "⛰️";

      case "fire":
        return "🔥";

      case "heatwave":
        return "☀️";

      default:
        return "🚨";
    }
  };

  // ======================================================
  // SCORE MESSAGE
  // ======================================================

  const getScoreMessage = () => {
    if (preparednessScore >= 80) {
      return "Excellent preparedness!";
    }

    if (preparednessScore >= 60) {
      return "You’re doing great!";
    }

    if (preparednessScore >= 30) {
      return "Good progress!";
    }

    return "Let’s get prepared!";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity>
            <Text style={styles.menuIcon}>
              ☰
            </Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Hello, {userName}!
          </Text>

          <TouchableOpacity
            style={styles.bellWrapper}
            onPress={openAlerts}
          >
            <Text style={styles.bellIcon}>
              🔔
            </Text>

            {activeAlerts.length > 0 && (
              <View
                style={
                  styles.notificationCount
                }
              >
                <Text
                  style={
                    styles.notificationCountText
                  }
                >
                  {activeAlerts.length > 9
                    ? "9+"
                    : activeAlerts.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ACTIVE ALERT */}

        {latestAlert && (
          <TouchableOpacity
            style={styles.alertBanner}
            onPress={openAlerts}
          >
            <View
              style={styles.alertTopRow}
            >
              <Text
                style={styles.alertEmoji}
              >
                {getAlertEmoji(
                  latestAlert.disasterType
                )}
              </Text>

              <View style={{ flex: 1 }}>
                <Text
                  style={
                    styles.alertSeverity
                  }
                >
                  {latestAlert.severity.toUpperCase()}
                </Text>

                <Text
                  style={styles.alertTitle}
                >
                  {latestAlert.title}
                </Text>

                <Text
                  style={
                    styles.alertLocation
                  }
                >
                  📍 {latestAlert.location}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={22}
                color="#991B1B"
              />
            </View>

            <Text
              style={
                styles.alertMessage
              }
              numberOfLines={2}
            >
              {latestAlert.message}
            </Text>
          </TouchableOpacity>
        )}

        {/* PREPAREDNESS SCORE */}

        <View style={styles.scoreCard}>
          <View style={styles.cardTopRow}>
            <Text
              style={
                styles.scoreCardTitle
              }
            >
              Preparedness Score
            </Text>

            <Text style={styles.chevron}>
              ⌄
            </Text>
          </View>

          <View style={styles.scoreContent}>
            <View
              style={styles.circleOuter}
            >
              <View
                style={styles.circleInner}
              >
                <Text
                  style={
                    styles.scoreNumber
                  }
                >
                  {preparednessScore}%
                </Text>
              </View>
            </View>

            <View
              style={styles.scoreTextBox}
            >
              <Text
                style={
                  styles.scoreMessage
                }
              >
                {getScoreMessage()}
              </Text>

              <Text
                style={
                  styles.scoreSubText
                }
              >
                Quiz Progress: {quizPercentage}%
              </Text>

              <Text
                style={
                  styles.scoreSubText
                }
              >
                Checklist Progress:{" "}
                {checklistPercentage}%
              </Text>

              <View
                style={
                  styles.scoreFormulaBox
                }
              >
                <Text
                  style={
                    styles.scoreFormulaText
                  }
                >
                  Overall Score = 50% Quiz + 50% Checklist
                </Text>
              </View>

              <TouchableOpacity
                style={
                  styles.progressButton
                }
                onPress={openChecklist}
              >
                <Text
                  style={
                    styles.progressButtonText
                  }
                >
                  View Checklist
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* PANIC BUTTON */}

        <TouchableOpacity
          style={styles.panicButton}
          onPress={openPanic}
        >
          <View
            style={
              styles.panicIconCircle
            }
          >
            <Text
              style={styles.panicIcon}
            >
              ⚠️
            </Text>
          </View>

          <View
            style={styles.panicTextBox}
          >
            <Text
              style={styles.panicTitle}
            >
              Disaster Panic Button
            </Text>

            <Text
              style={
                styles.panicSubtitle
              }
            >
              SOS calls, location sharing and
              safety steps
            </Text>
          </View>
        </TouchableOpacity>

        {/* QUICK ACTIONS */}

        <Text style={styles.sectionTitle}>
          Quick Actions
        </Text>

        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={openChecklist}
          >
            <View
              style={[
                styles.iconBox,
                styles.greenBox,
              ]}
            >
              <Text
                style={
                  styles.actionIcon
                }
              >
                ✅
              </Text>
            </View>

            <Text
              style={
                styles.actionTitle
              }
            >
              Safety Checklist
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={
              openEmergencyGuide
            }
          >
            <View
              style={[
                styles.iconBox,
                styles.orangeBox,
              ]}
            >
              <Text
                style={
                  styles.actionIcon
                }
              >
                🚨
              </Text>
            </View>

            <Text
              style={
                styles.actionTitle
              }
            >
              Emergency Guide
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={openResources}
          >
            <View
              style={[
                styles.iconBox,
                styles.tealBox,
              ]}
            >
              <Text
                style={
                  styles.actionIcon
                }
              >
                🏥
              </Text>
            </View>

            <Text
              style={
                styles.actionTitle
              }
            >
              Resources
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={openQuiz}
          >
            <View
              style={[
                styles.iconBox,
                styles.redBox,
              ]}
            >
              <Text
                style={
                  styles.actionIcon
                }
              >
                🛡️
              </Text>
            </View>

            <Text
              style={
                styles.actionTitle
              }
            >
              Quiz Zone
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
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
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 12,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  menuIcon: {
    fontSize: 28,
    color: "#111827",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  bellWrapper: {
    position: "relative",
    minWidth: 32,
    minHeight: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  bellIcon: {
    fontSize: 22,
  },

  notificationCount: {
    position: "absolute",
    right: -8,
    top: -9,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
  },

  notificationCountText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
  },

  alertBanner: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    borderRadius: 17,
    padding: 15,
    marginBottom: 16,
  },

  alertTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  alertEmoji: {
    fontSize: 30,
    marginRight: 11,
  },

  alertSeverity: {
    fontSize: 10,
    fontWeight: "900",
    color: "#DC2626",
  },

  alertTitle: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: "900",
    color: "#7F1D1D",
  },

  alertLocation: {
    marginTop: 4,
    fontSize: 11,
    color: "#991B1B",
    fontWeight: "700",
  },

  alertMessage: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 19,
    color: "#7F1D1D",
  },

  scoreCard: {
    backgroundColor: "#DCFCE7",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    marginBottom: 16,
  },

  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  scoreCardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#14532D",
  },

  chevron: {
    fontSize: 18,
    color: "#14532D",
  },

  scoreContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  circleOuter: {
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 9,
    borderColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0FDF4",
  },

  circleInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },

  scoreNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: "#14532D",
  },

  scoreTextBox: {
    flex: 1,
    marginLeft: 18,
  },

  scoreMessage: {
    fontSize: 15,
    fontWeight: "800",
    color: "#166534",
    marginBottom: 5,
  },

  scoreSubText: {
    fontSize: 12,
    color: "#4B5563",
    marginBottom: 3,
  },

  scoreFormulaBox: {
    backgroundColor:
      "rgba(255,255,255,0.55)",
    borderRadius: 7,
    paddingVertical: 5,
    paddingHorizontal: 7,
    marginTop: 5,
  },

  scoreFormulaText: {
    fontSize: 9,
    lineHeight: 13,
    color: "#166534",
    fontWeight: "700",
  },

  progressButton: {
    backgroundColor: "#0284C7",
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 8,
  },

  progressButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  panicButton: {
    backgroundColor: "#DC2626",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },

  panicIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor:
      "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  panicIcon: {
    fontSize: 26,
  },

  panicTextBox: {
    flex: 1,
  },

  panicTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 4,
  },

  panicSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: "#FEE2E2",
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 12,
  },

  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  actionCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  greenBox: {
    backgroundColor: "#DCFCE7",
  },

  orangeBox: {
    backgroundColor: "#FFEDD5",
  },

  tealBox: {
    backgroundColor: "#CCFBF1",
  },

  redBox: {
    backgroundColor: "#FEE2E2",
  },

  actionIcon: {
    fontSize: 22,
  },

  actionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },
});