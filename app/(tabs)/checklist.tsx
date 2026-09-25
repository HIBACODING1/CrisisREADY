import { useRouter } from "expo-router";
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  getCurrentUser,
  LocalUser,
} from "../../utils/auth-storage";

import {
  getChecklistProgress,
  saveChecklistProgress,
} from "../../utils/checklist-storage";

type FilterType =
  | "all"
  | "completed"
  | "pending";

type ChecklistTask = {
  id: string;
  text: string;
  completed: boolean;
};

type ChecklistCategory = {
  id: string;
  icon: string;
  title: string;
  tasks: ChecklistTask[];
};

const initialChecklist: ChecklistCategory[] = [
  {
    id: "emergency-kit",
    icon: "🎒",
    title: "Emergency Kit",
    tasks: [
      {
        id: "water",
        text: "Store enough drinking water",
        completed: false,
      },
      {
        id: "food",
        text: "Keep non-perishable food supplies",
        completed: false,
      },
      {
        id: "first-aid",
        text: "Prepare a first aid kit",
        completed: false,
      },
      {
        id: "flashlight",
        text: "Keep a working flashlight",
        completed: false,
      },
      {
        id: "batteries",
        text: "Store spare batteries",
        completed: false,
      },
      {
        id: "power-bank",
        text: "Keep a charged power bank",
        completed: false,
      },
      {
        id: "medicines",
        text: "Store essential medicines",
        completed: false,
      },
      {
        id: "radio",
        text: "Keep a battery-powered radio",
        completed: false,
      },
    ],
  },

  {
    id: "home-safety",
    icon: "🏠",
    title: "Home Safety",
    tasks: [
      {
        id: "exits",
        text: "Identify emergency exit routes",
        completed: false,
      },
      {
        id: "gas",
        text: "Know how to shut off the gas supply",
        completed: false,
      },
      {
        id: "electricity",
        text: "Know how to shut off electricity",
        completed: false,
      },
      {
        id: "safe-area",
        text: "Identify a safe meeting point",
        completed: false,
      },
    ],
  },

  {
    id: "communication",
    icon: "📡",
    title: "Communication",
    tasks: [
      {
        id: "contacts",
        text: "Save important emergency contacts",
        completed: false,
      },
      {
        id: "family-plan",
        text: "Create a family communication plan",
        completed: false,
      },
      {
        id: "emergency-number",
        text: "Know local emergency service numbers",
        completed: false,
      },
    ],
  },

  {
    id: "documents",
    icon: "📄",
    title: "Important Documents",
    tasks: [
      {
        id: "id-copies",
        text: "Keep copies of identity documents",
        completed: false,
      },
      {
        id: "medical-docs",
        text: "Keep important medical information",
        completed: false,
      },
      {
        id: "insurance",
        text: "Store insurance/property documents safely",
        completed: false,
      },
    ],
  },

  {
    id: "evacuation",
    icon: "🚗",
    title: "Evacuation Plan",
    tasks: [
      {
        id: "route",
        text: "Know at least two evacuation routes",
        completed: false,
      },
      {
        id: "vehicle",
        text: "Keep vehicle fuel above emergency reserve",
        completed: false,
      },
      {
        id: "meeting-place",
        text: "Choose a family meeting location",
        completed: false,
      },
    ],
  },
];

export default function ChecklistScreen() {
  const router = useRouter();

  const [currentUser, setCurrentUser] =
    useState<LocalUser | null>(null);

  const [categories, setCategories] =
    useState<ChecklistCategory[]>(
      initialChecklist
    );

  const [
    expandedCategory,
    setExpandedCategory,
  ] = useState<string | null>(
    "emergency-kit"
  );

  const [filter, setFilter] =
    useState<FilterType>("all");

  const [loading, setLoading] =
    useState(true);

  // ============================================
  // LOAD SAVED CHECKLIST FOR CURRENT USER
  // ============================================

  useEffect(() => {
    loadChecklist();
  }, []);

  const loadChecklist = async () => {
    try {
      setLoading(true);

      const user =
        await getCurrentUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setCurrentUser(user);

      const completedIds =
        await getChecklistProgress(
          user.id
        );

      setCategories(
        initialChecklist.map(
          (category) => ({
            ...category,
            tasks: category.tasks.map(
              (task) => ({
                ...task,
                completed:
                  completedIds.includes(
                    task.id
                  ),
              })
            ),
          })
        )
      );
    } catch (error) {
      console.log(
        "Could not load checklist:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // TOGGLE + SAVE CHECKLIST ITEM
  // ============================================

  const toggleTask = (
    categoryId: string,
    taskId: string
  ) => {
    setCategories((previous) => {
      const updated =
        previous.map((category) => {
          if (
            category.id !== categoryId
          ) {
            return category;
          }

          return {
            ...category,

            tasks: category.tasks.map(
              (task) =>
                task.id === taskId
                  ? {
                      ...task,
                      completed:
                        !task.completed,
                    }
                  : task
            ),
          };
        });

      if (currentUser) {
        const completedIds =
          updated.flatMap(
            (category) =>
              category.tasks
                .filter(
                  (task) =>
                    task.completed
                )
                .map(
                  (task) => task.id
                )
          );

        saveChecklistProgress(
          currentUser.id,
          completedIds
        ).catch((error) => {
          console.log(
            "Could not save checklist:",
            error
          );
        });
      }

      return updated;
    });
  };

  // ============================================
  // PROGRESS
  // ============================================

  const totalTasks = useMemo(
    () =>
      categories.reduce(
        (total, category) =>
          total +
          category.tasks.length,
        0
      ),
    [categories]
  );

  const completedTasks = useMemo(
    () =>
      categories.reduce(
        (total, category) =>
          total +
          category.tasks.filter(
            (task) =>
              task.completed
          ).length,
        0
      ),
    [categories]
  );

  const progressPercentage =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks /
            totalTasks) *
            100
        );

  // ============================================
  // FILTER
  // ============================================

  const getVisibleTasks = (
    tasks: ChecklistTask[]
  ) => {
    if (
      filter === "completed"
    ) {
      return tasks.filter(
        (task) =>
          task.completed
      );
    }

    if (
      filter === "pending"
    ) {
      return tasks.filter(
        (task) =>
          !task.completed
      );
    }

    return tasks;
  };

  // ============================================
  // CONTINUE
  // ============================================

  const continueChecklist = () => {
    const firstIncompleteCategory =
      categories.find(
        (category) =>
          category.tasks.some(
            (task) =>
              !task.completed
          )
      );

    if (
      firstIncompleteCategory
    ) {
      setExpandedCategory(
        firstIncompleteCategory.id
      );

      setFilter("pending");
    }
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <SafeAreaView
        style={
          styles.safeArea
        }
      >
        <View
          style={
            styles.loadingContainer
          }
        >
          <Text
            style={
              styles.loadingText
            }
          >
            Loading your checklist...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={
                styles.backIcon
              }
            >
              ‹
            </Text>
          </TouchableOpacity>

          <Text
            style={
              styles.headerTitle
            }
          >
            Safety Checklist
          </Text>

          <View
            style={{
              width: 30,
            }}
          />
        </View>

        {/* PROGRESS */}

        <View
          style={
            styles.progressSection
          }
        >
          <View
            style={
              styles.circleOuter
            }
          >
            <View
              style={
                styles.circleInner
              }
            >
              <Text
                style={
                  styles.circleText
                }
              >
                {
                  progressPercentage
                }
                %
              </Text>
            </View>
          </View>

          <View
            style={
              styles.progressTextBox
            }
          >
            <Text
              style={
                styles.progressTitle
              }
            >
              Checklist Progress
            </Text>

            <Text
              style={
                styles.progressSubtitle
              }
            >
              {completedTasks} /{" "}
              {totalTasks} completed
            </Text>

            <Text
              style={
                styles.progressMessage
              }
            >
              {progressPercentage ===
              100
                ? "Preparation checklist complete"
                : "Complete more tasks to improve readiness"}
            </Text>
          </View>
        </View>

        {/* FILTER TABS */}

        <View
          style={styles.tabRow}
        >
          <TouchableOpacity
            style={[
              styles.tab,

              filter === "all" &&
                styles.activeTab,
            ]}
            onPress={() =>
              setFilter("all")
            }
          >
            <Text
              style={[
                styles.tabText,

                filter === "all" &&
                  styles.activeTabText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,

              filter ===
                "completed" &&
                styles.activeTab,
            ]}
            onPress={() =>
              setFilter(
                "completed"
              )
            }
          >
            <Text
              style={[
                styles.tabText,

                filter ===
                  "completed" &&
                  styles.activeTabText,
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,

              filter ===
                "pending" &&
                styles.activeTab,
            ]}
            onPress={() =>
              setFilter(
                "pending"
              )
            }
          >
            <Text
              style={[
                styles.tabText,

                filter ===
                  "pending" &&
                  styles.activeTabText,
              ]}
            >
              Pending
            </Text>
          </TouchableOpacity>
        </View>

        {/* CATEGORIES */}

        <View
          style={
            styles.listContainer
          }
        >
          {categories.map(
            (category) => {
              const completedCount =
                category.tasks.filter(
                  (task) =>
                    task.completed
                ).length;

              const visibleTasks =
                getVisibleTasks(
                  category.tasks
                );

              const expanded =
                expandedCategory ===
                category.id;

              return (
                <View
                  key={category.id}
                  style={
                    styles.categoryCard
                  }
                >
                  <TouchableOpacity
                    style={
                      styles.itemRow
                    }
                    onPress={() =>
                      setExpandedCategory(
                        expanded
                          ? null
                          : category.id
                      )
                    }
                  >
                    <View
                      style={
                        styles.itemIconBox
                      }
                    >
                      <Text
                        style={
                          styles.itemIcon
                        }
                      >
                        {
                          category.icon
                        }
                      </Text>
                    </View>

                    <View
                      style={
                        styles.itemTextBox
                      }
                    >
                      <Text
                        style={
                          styles.itemTitle
                        }
                      >
                        {
                          category.title
                        }
                      </Text>

                      <Text
                        style={
                          styles.itemSubtitle
                        }
                      >
                        {
                          completedCount
                        }{" "}
                        /{" "}
                        {
                          category
                            .tasks
                            .length
                        }{" "}
                        completed
                      </Text>
                    </View>

                    <Text
                      style={
                        styles.itemArrow
                      }
                    >
                      {expanded
                        ? "⌄"
                        : "›"}
                    </Text>
                  </TouchableOpacity>

                  {expanded && (
                    <View
                      style={
                        styles.tasksContainer
                      }
                    >
                      {visibleTasks.length ===
                      0 ? (
                        <Text
                          style={
                            styles.noTasksText
                          }
                        >
                          No tasks in
                          this filter.
                        </Text>
                      ) : (
                        visibleTasks.map(
                          (task) => (
                            <TouchableOpacity
                              key={
                                task.id
                              }
                              style={
                                styles.taskRow
                              }
                              onPress={() =>
                                toggleTask(
                                  category.id,
                                  task.id
                                )
                              }
                            >
                              <View
                                style={[
                                  styles.checkbox,

                                  task.completed &&
                                    styles.checkboxCompleted,
                                ]}
                              >
                                {task.completed && (
                                  <Text
                                    style={
                                      styles.checkmark
                                    }
                                  >
                                    ✓
                                  </Text>
                                )}
                              </View>

                              <Text
                                style={[
                                  styles.taskText,

                                  task.completed &&
                                    styles.taskTextCompleted,
                                ]}
                              >
                                {
                                  task.text
                                }
                              </Text>
                            </TouchableOpacity>
                          )
                        )
                      )}
                    </View>
                  )}
                </View>
              );
            }
          )}
        </View>

        {/* CONTINUE */}

        {progressPercentage <
          100 && (
          <TouchableOpacity
            style={
              styles.continueButton
            }
            onPress={
              continueChecklist
            }
          >
            <Text
              style={
                styles.continueButtonText
              }
            >
              Continue Checklist
            </Text>
          </TouchableOpacity>
        )}

        {progressPercentage ===
          100 && (
          <View
            style={
              styles.completeCard
            }
          >
            <Text
              style={
                styles.completeEmoji
              }
            >
              ✅
            </Text>

            <Text
              style={
                styles.completeTitle
              }
            >
              Checklist Complete
            </Text>

            <Text
              style={
                styles.completeText
              }
            >
              You have completed all
              emergency preparedness
              checklist tasks.
            </Text>
          </View>
        )}

        <View
          style={{
            height: 35,
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor:
        "#F8FAFC",
    },

    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent:
        "center",
    },

    loadingText: {
      fontSize: 14,
      fontWeight: "700",
      color: "#6B7280",
    },

    container: {
      flex: 1,
      paddingHorizontal: 22,
    },

    header: {
      marginTop: 10,
      marginBottom: 28,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    backIcon: {
      fontSize: 36,
      color: "#111827",
      fontWeight: "300",
    },

    headerTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: "#111827",
    },

    progressSection: {
      backgroundColor:
        "#FFFFFF",
      borderRadius: 18,
      borderWidth: 1,
      borderColor:
        "#E5E7EB",
      padding: 18,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
    },

    circleOuter: {
      width: 104,
      height: 104,
      borderRadius: 52,
      borderWidth: 10,
      borderColor:
        "#22C55E",
      alignItems: "center",
      justifyContent:
        "center",
      backgroundColor:
        "#F0FDF4",
    },

    circleInner: {
      width: 76,
      height: 76,
      borderRadius: 38,
      backgroundColor:
        "#FFFFFF",
      alignItems: "center",
      justifyContent:
        "center",
    },

    circleText: {
      fontSize: 22,
      fontWeight: "900",
      color: "#111827",
    },

    progressTextBox: {
      flex: 1,
      marginLeft: 18,
    },

    progressTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: "#111827",
      marginBottom: 6,
    },

    progressSubtitle: {
      fontSize: 14,
      fontWeight: "700",
      color: "#374151",
    },

    progressMessage: {
      fontSize: 12,
      lineHeight: 18,
      color: "#6B7280",
      marginTop: 6,
    },

    tabRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor:
        "#E5E7EB",
      marginBottom: 14,
    },

    tab: {
      flex: 1,
      alignItems: "center",
      paddingBottom: 12,
    },

    activeTab: {
      borderBottomWidth: 3,
      borderBottomColor:
        "#2563EB",
    },

    activeTabText: {
      fontSize: 13,
      fontWeight: "800",
      color: "#2563EB",
    },

    tabText: {
      fontSize: 13,
      fontWeight: "700",
      color: "#64748B",
    },

    listContainer: {
      marginTop: 4,
    },

    categoryCard: {
      backgroundColor:
        "#FFFFFF",
      borderRadius: 14,
      marginBottom: 11,
      borderWidth: 1,
      borderColor:
        "#E5E7EB",
      overflow: "hidden",
    },

    itemRow: {
      padding: 14,
      flexDirection: "row",
      alignItems: "center",
    },

    itemIconBox: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor:
        "#EDE9FE",
      alignItems: "center",
      justifyContent:
        "center",
      marginRight: 12,
    },

    itemIcon: {
      fontSize: 22,
    },

    itemTextBox: {
      flex: 1,
    },

    itemTitle: {
      fontSize: 15,
      fontWeight: "800",
      color: "#111827",
      marginBottom: 4,
    },

    itemSubtitle: {
      fontSize: 13,
      color: "#6B7280",
      fontWeight: "600",
    },

    itemArrow: {
      fontSize: 25,
      color: "#64748B",
    },

    tasksContainer: {
      borderTopWidth: 1,
      borderTopColor:
        "#E5E7EB",
      paddingHorizontal: 14,
      paddingVertical: 8,
      backgroundColor:
        "#FAFAFA",
    },

    taskRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 11,
    },

    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 7,
      borderWidth: 2,
      borderColor:
        "#CBD5E1",
      backgroundColor:
        "#FFFFFF",
      alignItems: "center",
      justifyContent:
        "center",
      marginRight: 12,
    },

    checkboxCompleted: {
      backgroundColor:
        "#22C55E",
      borderColor:
        "#22C55E",
    },

    checkmark: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "900",
    },

    taskText: {
      flex: 1,
      fontSize: 14,
      lineHeight: 20,
      color: "#111827",
      fontWeight: "600",
    },

    taskTextCompleted: {
      color: "#64748B",
      textDecorationLine:
        "line-through",
    },

    noTasksText: {
      textAlign: "center",
      color: "#94A3B8",
      fontSize: 13,
      paddingVertical: 15,
    },

    continueButton: {
      height: 54,
      borderRadius: 12,
      backgroundColor:
        "#2563EB",
      alignItems: "center",
      justifyContent:
        "center",
      marginTop: 12,
    },

    continueButtonText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "800",
    },

    completeCard: {
      backgroundColor:
        "#F0FDF4",
      borderWidth: 1,
      borderColor:
        "#BBF7D0",
      borderRadius: 18,
      padding: 22,
      alignItems: "center",
      marginTop: 12,
    },

    completeEmoji: {
      fontSize: 36,
    },

    completeTitle: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: "900",
      color: "#166534",
    },

    completeText: {
      marginTop: 6,
      fontSize: 13,
      lineHeight: 19,
      color: "#4B5563",
      textAlign: "center",
    },
  });