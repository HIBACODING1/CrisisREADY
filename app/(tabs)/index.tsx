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

export default function HomeScreen() {
  const router = useRouter();

  const openChecklist = () => {
    router.push("/checklist" as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Hello, User!</Text>

          <TouchableOpacity style={styles.bellWrapper}>
            <Text style={styles.bellIcon}>🔔</Text>
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Preparedness Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.cardTopRow}>
            <Text style={styles.scoreCardTitle}>Preparedness Score</Text>
            <Text style={styles.chevron}>⌄</Text>
          </View>

          <View style={styles.scoreContent}>
            <View style={styles.circleOuter}>
              <View style={styles.circleInner}>
                <Text style={styles.scoreNumber}>75%</Text>
              </View>
            </View>

            <View style={styles.scoreTextBox}>
              <Text style={styles.scoreMessage}>You’re doing great!</Text>
              <Text style={styles.scoreSubText}>Keep going!</Text>

              <TouchableOpacity style={styles.progressButton}>
                <Text style={styles.progressButtonText}>View Progress</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionsGrid}>
          {/* Safety Checklist */}
          <TouchableOpacity style={styles.actionCard} onPress={openChecklist}>
            <View style={[styles.iconBox, styles.greenBox]}>
              <Text style={styles.actionIcon}>✅</Text>
            </View>
            <Text style={styles.actionTitle}>Safety Checklist</Text>
          </TouchableOpacity>

          {/* Emergency Guide */}
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.iconBox, styles.orangeBox]}>
              <Text style={styles.actionIcon}>🚨</Text>
            </View>
            <Text style={styles.actionTitle}>Emergency Guide</Text>
          </TouchableOpacity>

          {/* Resources */}
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.iconBox, styles.tealBox]}>
              <Text style={styles.actionIcon}>🏥</Text>
            </View>
            <Text style={styles.actionTitle}>Resources</Text>
          </TouchableOpacity>

          {/* Quiz Zone */}
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.iconBox, styles.redBox]}>
              <Text style={styles.actionIcon}>🛡️</Text>
            </View>
            <Text style={styles.actionTitle}>Quiz Zone</Text>
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
  },

  bellIcon: {
    fontSize: 22,
  },

  notificationDot: {
    position: "absolute",
    right: -2,
    top: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2563EB",
  },

  scoreCard: {
    backgroundColor: "#DCFCE7",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    marginBottom: 22,
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
    marginBottom: 4,
  },

  scoreSubText: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 12,
  },

  progressButton: {
    backgroundColor: "#0284C7",
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: "flex-start",
  },

  progressButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
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
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
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