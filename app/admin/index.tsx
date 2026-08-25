import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  endAdminSession,
} from "../../utils/alert-storage";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Admin Logout",
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
            await endAdminSession();

            router.replace("/login");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.smallTitle}>
              CrisisREADY
            </Text>

            <Text style={styles.pageTitle}>
              Admin Dashboard
            </Text>
          </View>

          <View style={styles.adminIcon}>
            <Ionicons
              name="shield-checkmark-outline"
              size={28}
              color="#2563EB"
            />
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons
              name="warning-outline"
              size={34}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Disaster Alert Management
            </Text>

            <Text style={styles.heroText}>
              Create and manage emergency alerts
              that appear to CrisisREADY users.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Alert Management
        </Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() =>
            router.navigate(
              "/admin/create-alert" as any
            )
          }
        >
          <View style={styles.blueIcon}>
            <Ionicons
              name="add-circle-outline"
              size={28}
              color="#2563EB"
            />
          </View>

          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>
              Create Disaster Alert
            </Text>

            <Text style={styles.actionDescription}>
              Generate and publish a new emergency
              warning.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color="#94A3B8"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() =>
            router.navigate(
              "/admin/alerts" as any
            )
          }
        >
          <View style={styles.orangeIcon}>
            <Ionicons
              name="notifications-outline"
              size={28}
              color="#EA580C"
            />
          </View>

          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>
              Manage Alerts
            </Text>

            <Text style={styles.actionDescription}>
              View and deactivate previously
              generated alerts.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color="#94A3B8"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={21}
            color="#FFFFFF"
          />

          <Text style={styles.logoutText}>
            Logout Admin
          </Text>
        </TouchableOpacity>
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
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  smallTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#2563EB",
    marginBottom: 3,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111827",
  },

  adminIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },

  heroCard: {
    backgroundColor: "#2563EB",
    borderRadius: 22,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor:
      "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  heroContent: {
    flex: 1,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  heroText: {
    color: "#DBEAFE",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 14,
  },

  actionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 17,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
  },

  blueIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  orangeIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  actionContent: {
    flex: 1,
  },

  actionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
  },

  actionDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: "#6B7280",
    marginTop: 3,
  },

  logoutButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#DC2626",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 8,
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});