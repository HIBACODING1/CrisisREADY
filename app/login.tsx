import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  createUser,
  loginUser,
} from "../utils/auth-storage";

import {
  startAdminSession,
} from "../utils/alert-storage";

// ============================================
// ADMIN ACCOUNT
// ============================================

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "Admin@123";

export default function LoginScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] =
    useState<"login" | "signup">("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const clearFields = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const switchTab = (
    tab: "login" | "signup"
  ) => {
    setActiveTab(tab);
    clearFields();
  };

  // ============================================
  // LOGIN
  // ============================================

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        "Missing Information",
        "Please enter your email/username and password."
      );
      return;
    }

    try {
      setLoading(true);

      const enteredUsername =
        email.trim().toLowerCase();

      // ============================================
      // ADMIN LOGIN
      // ============================================

      if (enteredUsername === ADMIN_USERNAME) {
        if (password === ADMIN_PASSWORD) {
          // Create admin session
          await startAdminSession();

          clearFields();

          // Go directly to Admin Dashboard
          router.replace("/admin");

          return;
        }

        Alert.alert(
          "Admin Login Failed",
          "Incorrect administrator password."
        );

        return;
      }

      // ============================================
      // NORMAL USER LOGIN
      // ============================================

      await loginUser(
        email.trim(),
        password
      );

      clearFields();

      router.replace("/(tabs)");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to login.";

      Alert.alert(
        "Login Failed",
        message
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // SIGN UP
  // ============================================

  const handleSignUp = async () => {
    if (!name.trim()) {
      Alert.alert(
        "Name Required",
        "Please enter your name."
      );
      return;
    }

    if (!email.trim()) {
      Alert.alert(
        "Email Required",
        "Please enter your email address."
      );
      return;
    }

    // Prevent creation of normal account named admin
    if (
      email.trim().toLowerCase() ===
      ADMIN_USERNAME
    ) {
      Alert.alert(
        "Reserved Username",
        "This username is reserved for the administrator."
      );
      return;
    }

    if (
      !email.includes("@") ||
      !email.includes(".")
    ) {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid email address."
      );
      return;
    }

    if (!password) {
      Alert.alert(
        "Password Required",
        "Please create a password."
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Password Too Short",
        "Your password must contain at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      await createUser(
        name.trim(),
        email.trim(),
        password
      );

      Alert.alert(
        "Account Created",
        "Your CrisisREADY account has been created successfully.",
        [
          {
            text: "Continue",
            onPress: () => {
              clearFields();
              router.replace("/(tabs)");
            },
          },
        ]
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create account.";

      Alert.alert(
        "Sign Up Failed",
        message
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // MAIN BUTTON
  // ============================================

  const handleSubmit = () => {
    if (loading) {
      return;
    }

    if (activeTab === "login") {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  // ============================================
  // FORGOT PASSWORD
  // ============================================

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Your accounts are currently stored locally on this device."
    );
  };

  // ============================================
  // GOOGLE LOGIN
  // ============================================

  const handleGoogleLogin = () => {
    Alert.alert(
      "Google Login",
      "Google authentication is not enabled because CrisisREADY is currently using local accounts."
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <View style={styles.card}>

          {/* LOGIN / SIGN UP TABS */}

          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "login" &&
                  styles.activeTabButton,
              ]}
              onPress={() =>
                switchTab("login")
              }
              disabled={loading}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "login" &&
                    styles.activeTabText,
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "signup" &&
                  styles.activeTabButton,
              ]}
              onPress={() =>
                switchTab("signup")
              }
              disabled={loading}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "signup" &&
                    styles.activeTabText,
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* LOGO */}

          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoIconText}>
                🛡️
              </Text>
            </View>

            <Text style={styles.logoText}>
              Crisis
              <Text style={styles.logoReady}>
                READY
              </Text>
            </Text>

            <Text style={styles.logoTagline}>
              Be Prepared. Stay Safe.
            </Text>
          </View>

          <Text style={styles.title}>
            {activeTab === "login"
              ? "Welcome Back!"
              : "Create Account"}
          </Text>

          <Text style={styles.subtitle}>
            {activeTab === "login"
              ? "Login to continue"
              : "Create your CrisisREADY account"}
          </Text>

          {/* NAME */}

          {activeTab === "signup" && (
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
              editable={!loading}
            />
          )}

          {/* EMAIL / ADMIN USERNAME */}

          <TextInput
            style={styles.input}
            placeholder={
              activeTab === "login"
                ? "Email or Admin Username"
                : "Email"
            }
            placeholderTextColor="#9CA3AF"
            keyboardType={
              activeTab === "login"
                ? "default"
                : "email-address"
            }
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />

          {/* PASSWORD */}

          <TextInput
            style={styles.input}
            placeholder={
              activeTab === "signup"
                ? "Create Password"
                : "Password"
            }
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />

          {activeTab === "signup" && (
            <Text style={styles.passwordHint}>
              Password must contain at least 6 characters.
            </Text>
          )}

          {/* FORGOT PASSWORD */}

          {activeTab === "login" && (
            <TouchableOpacity
              style={styles.forgotButton}
              onPress={handleForgotPassword}
              disabled={loading}
            >
              <Text style={styles.forgotText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          )}

          {/* MAIN LOGIN / SIGNUP BUTTON */}

          <TouchableOpacity
            style={[
              styles.loginButton,
              loading &&
                styles.loginButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                color="#FFFFFF"
              />
            ) : (
              <Text
                style={styles.loginButtonText}
              >
                {activeTab === "login"
                  ? "Login"
                  : "Create Account"}
              </Text>
            )}
          </TouchableOpacity>

          {/* DIVIDER */}

          <View style={styles.dividerRow}>
            <View style={styles.divider} />

            <Text style={styles.orText}>
              or
            </Text>

            <View style={styles.divider} />
          </View>

          {/* GOOGLE */}

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            <Text style={styles.googleIcon}>
              G
            </Text>

            <Text style={styles.googleText}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* SWITCH LOGIN / SIGNUP */}

          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>
              {activeTab === "login"
                ? "Don’t have an account?"
                : "Already have an account?"}
            </Text>

            <TouchableOpacity
              onPress={() =>
                switchTab(
                  activeTab === "login"
                    ? "signup"
                    : "login"
                )
              }
              disabled={loading}
            >
              <Text style={styles.bottomLink}>
                {activeTab === "login"
                  ? " Sign Up"
                  : " Login"}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  wrapper: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 4,
  },

  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 26,
  },

  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 12,
  },

  activeTabButton: {
    borderBottomWidth: 3,
    borderBottomColor: "#2563EB",
  },

  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },

  activeTabText: {
    color: "#2563EB",
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 22,
  },

  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  logoIconText: {
    fontSize: 32,
  },

  logoText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1E40AF",
  },

  logoReady: {
    color: "#2563EB",
  },

  logoTagline: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 28,
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
    marginBottom: 14,
  },

  passwordHint: {
    marginTop: -5,
    marginBottom: 15,
    marginLeft: 4,
    fontSize: 12,
    color: "#6B7280",
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 18,
  },

  forgotText: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "600",
  },

  loginButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  loginButtonDisabled: {
    opacity: 0.65,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  orText: {
    marginHorizontal: 12,
    color: "#6B7280",
    fontSize: 13,
  },

  googleButton: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDE3EA",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  googleIcon: {
    fontSize: 18,
    fontWeight: "800",
    color: "#EA4335",
    marginRight: 10,
  },

  googleText: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "600",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },

  bottomText: {
    color: "#6B7280",
    fontSize: 13,
  },

  bottomLink: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "700",
  },
});