import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  changePassword,
  getCurrentUser,
  LocalUser,
  logoutUser,
  updateUserName,
} from "../../utils/auth-storage";

import {
  getUserQuizProgress,
  UserQuizProgress,
} from "../../utils/quiz-progress-storage";

import { quizCategories } from "../../data/quiz-data";

export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState<LocalUser | null>(null);

  const [quizProgress, setQuizProgress] =
    useState<UserQuizProgress>({});

  // Edit name
  const [editNameVisible, setEditNameVisible] = useState(false);
  const [newName, setNewName] = useState("");

  // Change password
  const [passwordModalVisible, setPasswordModalVisible] =
    useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ======================================================
  // LOAD USER + QUIZ PROGRESS
  // ======================================================

  const loadProfile = async () => {
    try {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setUser(currentUser);

      const savedProgress =
        await getUserQuizProgress(currentUser.id);

      setQuizProgress(savedProgress);
    } catch (error) {
      console.log("Could not load profile:", error);
    }
  };

  /*
    useFocusEffect means the profile refreshes every time
    the user opens the Profile tab.

    Therefore:
    Quiz completed -> Profile opened -> latest result appears.
  */
  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  // ======================================================
  // QUIZ STATUS
  // ======================================================

  const getQuizStatus = (categoryId: string) => {
    const progress = quizProgress[categoryId];

    if (!progress) {
      return {
        title: "Not Started",
        detail: "Start Level 1",
        completedLevels: 0,
        badge: false,
      };
    }

    if (progress.expert) {
      return {
        title: "Expert Badge Earned",
        detail: "All 3 levels completed",
        completedLevels: 3,
        badge: true,
      };
    }

    if (progress.moderate) {
      return {
        title: "Level 2 Completed",
        detail: "Level 3 Expert unlocked",
        completedLevels: 2,
        badge: false,
      };
    }

    if (progress.easy) {
      return {
        title: "Level 1 Completed",
        detail: "Level 2 Moderate unlocked",
        completedLevels: 1,
        badge: false,
      };
    }

    return {
      title: "Not Started",
      detail: "Start Level 1",
      completedLevels: 0,
      badge: false,
    };
  };

  // ======================================================
  // OVERALL STATISTICS
  // ======================================================

  const totalLevelsCompleted = quizCategories.reduce(
    (total, category) => {
      const status = getQuizStatus(category.id);
      return total + status.completedLevels;
    },
    0
  );

  const totalBadges = quizCategories.reduce(
    (total, category) => {
      const status = getQuizStatus(category.id);
      return total + (status.badge ? 1 : 0);
    },
    0
  );

  const totalPossibleLevels = quizCategories.length * 3;

  // ======================================================
  // EDIT NAME
  // ======================================================

  const openEditName = () => {
    setNewName(user?.name || "");
    setEditNameVisible(true);
  };

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      Alert.alert(
        "Invalid Name",
        "Please enter your name."
      );
      return;
    }

    try {
      const updatedUser =
        await updateUserName(newName);

      setUser(updatedUser);
      setEditNameVisible(false);

      Alert.alert(
        "Profile Updated",
        "Your name has been updated successfully."
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not update your name.";

      Alert.alert("Error", message);
    }
  };

  // ======================================================
  // CHANGE PASSWORD
  // ======================================================

  const openChangePassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordModalVisible(true);
  };

  const handleChangePassword = async () => {
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      Alert.alert(
        "Missing Information",
        "Please complete all password fields."
      );
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        "Password Too Short",
        "Your new password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Passwords Do Not Match",
        "Please make sure your new passwords match."
      );
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert(
        "Choose a New Password",
        "Your new password must be different from your current password."
      );
      return;
    }

    try {
      await changePassword(
        currentPassword,
        newPassword
      );

      setPasswordModalVisible(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      Alert.alert(
        "Password Changed",
        "Your password has been changed successfully."
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not change your password.";

      Alert.alert(
        "Password Change Failed",
        message
      );
    }
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logoutUser();
              router.replace("/login");
            } catch (error) {
              Alert.alert(
                "Error",
                "Could not log out. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  // ======================================================
  // ACCOUNT DATE
  // ======================================================

  const formattedCreatedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "-";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>
          Profile
        </Text>

        {/* PROFILE CARD */}

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </Text>
          </View>

          <Text style={styles.name}>
            {user?.name || "CrisisREADY User"}
          </Text>

          <Text style={styles.email}>
            {user?.email ||
              "No email available"}
          </Text>
        </View>

        {/* PROGRESS SUMMARY */}

        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>
            Learning Progress
          </Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View style={styles.summaryIconBlue}>
                <Ionicons
                  name="school-outline"
                  size={22}
                  color="#2563EB"
                />
              </View>

              <Text style={styles.summaryNumber}>
                {totalLevelsCompleted}
              </Text>

              <Text style={styles.summaryLabel}>
                Levels Completed
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <View style={styles.summaryIconGold}>
                <Text style={styles.summaryEmoji}>
                  🏅
                </Text>
              </View>

              <Text style={styles.summaryNumber}>
                {totalBadges}
              </Text>

              <Text style={styles.summaryLabel}>
                Badges Earned
              </Text>
            </View>
          </View>

          <Text style={styles.overallProgress}>
            {totalLevelsCompleted} of{" "}
            {totalPossibleLevels} quiz levels
            completed
          </Text>
        </View>

        {/* QUIZ PROGRESS */}

        <View style={styles.quizProgressCard}>
          <Text style={styles.sectionTitle}>
            Disaster Quiz Progress
          </Text>

          <Text style={styles.progressDescription}>
            Your progress is saved automatically
            to this account.
          </Text>

          {quizCategories.map(
            (category, index) => {
              const status =
                getQuizStatus(category.id);

              return (
                <View key={category.id}>
                  <View
                    style={styles.disasterRow}
                  >
                    <View
                      style={
                        styles.disasterEmojiBox
                      }
                    >
                      <Text
                        style={
                          styles.disasterEmoji
                        }
                      >
                        {category.emoji}
                      </Text>
                    </View>

                    <View
                      style={
                        styles.disasterContent
                      }
                    >
                      <Text
                        style={
                          styles.disasterTitle
                        }
                      >
                        {category.title}
                      </Text>

                      <Text
                        style={[
                          styles.disasterStatus,

                          status.badge &&
                            styles.badgeStatus,
                        ]}
                      >
                        {status.badge
                          ? "🏅 "
                          : status.completedLevels >
                              0
                            ? "✓ "
                            : ""}
                        {status.title}
                      </Text>

                      <Text
                        style={
                          styles.disasterDetail
                        }
                      >
                        {status.detail}
                      </Text>

                      {/* LEVEL DOTS */}

                      <View
                        style={styles.levelRow}
                      >
                        <View
                          style={[
                            styles.levelPill,

                            status.completedLevels >=
                              1 &&
                              styles.levelCompleted,
                          ]}
                        >
                          <Text
                            style={[
                              styles.levelText,

                              status.completedLevels >=
                                1 &&
                                styles.levelCompletedText,
                            ]}
                          >
                            L1
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.levelPill,

                            status.completedLevels >=
                              2 &&
                              styles.levelCompleted,
                          ]}
                        >
                          <Text
                            style={[
                              styles.levelText,

                              status.completedLevels >=
                                2 &&
                                styles.levelCompletedText,
                            ]}
                          >
                            L2
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.levelPill,

                            status.completedLevels >=
                              3 &&
                              styles.levelCompleted,
                          ]}
                        >
                          <Text
                            style={[
                              styles.levelText,

                              status.completedLevels >=
                                3 &&
                                styles.levelCompletedText,
                            ]}
                          >
                            L3
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {index <
                    quizCategories.length -
                      1 && (
                    <View
                      style={styles.divider}
                    />
                  )}
                </View>
              );
            }
          )}
        </View>

        {/* ACCOUNT INFORMATION */}

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>
            Account Information
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Name
            </Text>

            <Text style={styles.infoValue}>
              {user?.name || "-"}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Email
            </Text>

            <Text style={styles.infoValue}>
              {user?.email || "-"}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Member Since
            </Text>

            <Text style={styles.infoValue}>
              {formattedCreatedDate}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Account Type
            </Text>

            <Text style={styles.infoValue}>
              Local Account
            </Text>
          </View>
        </View>

        {/* ACCOUNT SETTINGS */}

        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>
            Account Settings
          </Text>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={openEditName}
          >
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#2563EB"
                />
              </View>

              <View>
                <Text
                  style={styles.settingTitle}
                >
                  Edit Name
                </Text>

                <Text
                  style={
                    styles.settingSubtitle
                  }
                >
                  Change your profile name
                </Text>
              </View>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#94A3B8"
            />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={openChangePassword}
          >
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#2563EB"
                />
              </View>

              <View>
                <Text
                  style={styles.settingTitle}
                >
                  Change Password
                </Text>

                <Text
                  style={
                    styles.settingSubtitle
                  }
                >
                  Update your account password
                </Text>
              </View>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#94A3B8"
            />
          </TouchableOpacity>
        </View>

        {/* LOGOUT */}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#FFFFFF"
          />

          <Text style={styles.logoutText}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* EDIT NAME MODAL */}

      <Modal
        visible={editNameVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setEditNameVisible(false)
        }
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : undefined
          }
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Edit Name
            </Text>

            <Text
              style={styles.modalSubtitle}
            >
              Enter the name you want displayed
              on your profile.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#9CA3AF"
              value={newName}
              onChangeText={setNewName}
              autoCapitalize="words"
            />

            <View
              style={styles.modalButtons}
            >
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() =>
                  setEditNameVisible(false)
                }
              >
                <Text
                  style={
                    styles.cancelButtonText
                  }
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleUpdateName}
              >
                <Text
                  style={styles.saveButtonText}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* CHANGE PASSWORD MODAL */}

      <Modal
        visible={passwordModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setPasswordModalVisible(false)
        }
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : undefined
          }
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Change Password
            </Text>

            <Text
              style={styles.modalSubtitle}
            >
              Enter your current password and
              choose a new password.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Current Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={currentPassword}
              onChangeText={
                setCurrentPassword
              }
            />

            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={confirmPassword}
              onChangeText={
                setConfirmPassword
              }
            />

            <Text
              style={styles.passwordHint}
            >
              Password must contain at least 6
              characters.
            </Text>

            <View
              style={styles.modalButtons}
            >
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() =>
                  setPasswordModalVisible(
                    false
                  )
                }
              >
                <Text
                  style={
                    styles.cancelButtonText
                  }
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={
                  handleChangePassword
                }
              >
                <Text
                  style={styles.saveButtonText}
                >
                  Change
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 40,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 24,
  },

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 2,
  },

  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  avatarText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#2563EB",
  },

  name: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
    textAlign: "center",
  },

  email: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 5,
    textAlign: "center",
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 20,
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  summaryItem: {
    flex: 1,
    alignItems: "center",
  },

  summaryDivider: {
    width: 1,
    height: 85,
    backgroundColor: "#E5E7EB",
  },

  summaryIconBlue: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  summaryIconGold: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },

  summaryEmoji: {
    fontSize: 23,
  },

  summaryNumber: {
    marginTop: 7,
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
  },

  summaryLabel: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
    textAlign: "center",
  },

  overallProgress: {
    marginTop: 17,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    textAlign: "center",
    fontSize: 13,
    color: "#64748B",
    fontWeight: "700",
  },

  quizProgressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 20,
  },

  progressDescription: {
    marginTop: -5,
    marginBottom: 10,
    fontSize: 12,
    lineHeight: 18,
    color: "#6B7280",
  },

  disasterRow: {
    flexDirection: "row",
    paddingVertical: 15,
  },

  disasterEmojiBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  disasterEmoji: {
    fontSize: 27,
  },

  disasterContent: {
    flex: 1,
  },

  disasterTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#111827",
  },

  disasterStatus: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "800",
    color: "#2563EB",
  },

  badgeStatus: {
    color: "#16A34A",
  },

  disasterDetail: {
    marginTop: 3,
    fontSize: 11,
    color: "#6B7280",
  },

  levelRow: {
    flexDirection: "row",
    marginTop: 9,
    gap: 6,
  },

  levelPill: {
    minWidth: 37,
    height: 25,
    borderRadius: 999,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  levelCompleted: {
    backgroundColor: "#DCFCE7",
  },

  levelText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#94A3B8",
  },

  levelCompletedText: {
    color: "#16A34A",
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 20,
  },

  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },

  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },

  infoValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "700",
    maxWidth: "65%",
    textAlign: "right",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  settingRow: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  settingIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  settingTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },

  settingSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 3,
  },

  logoutButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    flexDirection: "row",
    gap: 8,
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
  },

  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 22,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
  },

  modalSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 20,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#DDE3EA",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },

  passwordHint: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 16,
  },

  modalButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDE3EA",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "700",
  },

  saveButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});