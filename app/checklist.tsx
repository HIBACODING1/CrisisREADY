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

export default function ChecklistScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Safety Checklist</Text>

          <View style={{ width: 30 }} />
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.circleOuter}>
            <View style={styles.circleInner}>
              <Text style={styles.circleText}>60%</Text>
            </View>
          </View>

          <View style={styles.progressTextBox}>
            <Text style={styles.progressTitle}>Checklist Progress</Text>
            <Text style={styles.progressSubtitle}>12 / 20 completed</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity style={styles.activeTab}>
            <Text style={styles.activeTabText}>All</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Completed</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Pending</Text>
          </TouchableOpacity>
        </View>

        {/* Checklist Items */}
        <View style={styles.listContainer}>
          <ChecklistItem
            icon="🎒"
            title="Emergency Kit"
            subtitle="8 / 12 completed"
          />

          <ChecklistItem
            icon="🏠"
            title="Home Safety"
            subtitle="2 / 4 completed"
          />

          <ChecklistItem
            icon="📡"
            title="Communication"
            subtitle="1 / 2 completed"
          />

          <ChecklistItem
            icon="📄"
            title="Documents"
            subtitle="1 / 2 completed"
          />
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Continue Checklist</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function ChecklistItem({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <TouchableOpacity style={styles.itemRow}>
      <View style={styles.itemIconBox}>
        <Text style={styles.itemIcon}>{icon}</Text>
      </View>

      <View style={styles.itemTextBox}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemSubtitle}>{subtitle}</Text>
      </View>

      <Text style={styles.itemArrow}>›</Text>
    </TouchableOpacity>
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
    marginBottom: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  circleOuter: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 10,
    borderColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },

  circleInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  circleText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
  },

  progressTextBox: {
    marginLeft: 22,
  },

  progressTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },

  progressSubtitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },

  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 12,
  },

  activeTab: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 3,
    borderBottomColor: "#2563EB",
  },

  tab: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 12,
  },

  activeTabText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#2563EB",
  },

  tabText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },

  listContainer: {
    marginTop: 4,
  },

  itemRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  itemIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: 28,
    color: "#111827",
  },

  continueButton: {
    height: 54,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 30,
  },

  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});