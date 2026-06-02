import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const goToHome = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          {/* Login / Sign Up Tabs */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "login" && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab("login")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "login" && styles.activeTabText,
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "signup" && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab("signup")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "signup" && styles.activeTabText,
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* CrisisREADY Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoIconText}>🛡️</Text>
            </View>

            <Text style={styles.logoText}>
              Crisis<Text style={styles.logoReady}>READY</Text>
            </Text>

            <Text style={styles.logoTagline}>Be Prepared. Stay Safe.</Text>
          </View>

          <Text style={styles.title}>
            {activeTab === "login" ? "Welcome Back!" : "Create Account"}
          </Text>

          <Text style={styles.subtitle}>
            {activeTab === "login"
              ? "Login to continue"
              : "Create your CrisisREADY account"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {activeTab === "login" && (
            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.loginButton} onPress={goToHome}>
            <Text style={styles.loginButtonText}>
              {activeTab === "login" ? "Login" : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.googleButton}>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>
              {activeTab === "login"
                ? "Don’t have an account?"
                : "Already have an account?"}
            </Text>

            <TouchableOpacity
              onPress={() =>
                setActiveTab(activeTab === "login" ? "signup" : "login")
              }
            >
              <Text style={styles.bottomLink}>
                {activeTab === "login" ? " Sign Up" : " Login"}
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
    shadowOffset: { width: 0, height: 4 },
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