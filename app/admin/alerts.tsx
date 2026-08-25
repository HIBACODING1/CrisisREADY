import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
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
  deactivateAlert,
  DisasterAlert,
  getAlerts,
} from "../../utils/alert-storage";

export default function AdminAlertsScreen() {
  const router = useRouter();

  const [alerts, setAlerts] =
    useState<DisasterAlert[]>([]);

  const loadAlerts = async () => {
    try {
      const savedAlerts = await getAlerts();

      setAlerts(
        [...savedAlerts].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
      );
    } catch (error) {
      console.log("Could not load alerts:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAlerts();
    }, [])
  );

  const handleDeactivate = (
    alertItem: DisasterAlert
  ) => {
    Alert.alert(
      "Deactivate Alert",
      `Do you want to deactivate "${alertItem.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Deactivate",
          style: "destructive",
          onPress: async () => {
            try {
              await deactivateAlert(alertItem.id);

              await loadAlerts();

              Alert.alert(
                "Alert Deactivated",
                "This alert will no longer appear as an active user warning."
              );
            } catch (error) {
              Alert.alert(
                "Error",
                "Could not deactivate the alert."
              );
            }
          },
        },
      ]
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const getSeverityIcon = (
    severity: string
  ) => {
    switch (severity) {
      case "Critical":
        return "alert-circle";
      case "Severe":
        return "warning";
      case "Warning":
        return "notifications";
      default:
        return "information-circle";
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={25}
              color="#111827"
            />
          </TouchableOpacity>

          <Text style={styles.pageTitle}>
            Manage Alerts
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push("/admin/create-alert")
            }
          >
            <Ionicons
              name="add-circle-outline"
              size={27}
              color="#2563EB"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryLabel}>
              Total Alerts
            </Text>

            <Text style={styles.summaryNumber}>
              {alerts.length}
            </Text>
          </View>

          <View>
            <Text style={styles.summaryLabel}>
              Active
            </Text>

            <Text style={styles.summaryNumber}>
              {
                alerts.filter(
                  (alertItem) =>
                    alertItem.active
                ).length
              }
            </Text>
          </View>

          <View>
            <Text style={styles.summaryLabel}>
              Inactive
            </Text>

            <Text style={styles.summaryNumber}>
              {
                alerts.filter(
                  (alertItem) =>
                    !alertItem.active
                ).length
              }
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Published Alerts
        </Text>

        {alerts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons
              name="notifications-off-outline"
              size={42}
              color="#94A3B8"
            />

            <Text style={styles.emptyTitle}>
              No alerts yet
            </Text>

            <Text style={styles.emptyText}>
              Create your first disaster alert
              from the Admin Dashboard.
            </Text>
          </View>
        ) : (
          alerts.map((alertItem) => (
            <View
              key={alertItem.id}
              style={[
                styles.alertCard,
                !alertItem.active &&
                  styles.inactiveCard,
              ]}
            >
              <View style={styles.alertTopRow}>
                <View style={styles.alertIcon}>
                  <Ionicons
                    name={
                      getSeverityIcon(
                        alertItem.severity
                      ) as any
                    }
                    size={25}
                    color={
                      alertItem.active
                        ? "#DC2626"
                        : "#64748B"
                    }
                  />
                </View>

                <View style={styles.alertHeaderText}>
                  <Text style={styles.alertTitle}>
                    {alertItem.title}
                  </Text>

                  <Text style={styles.alertType}>
                    {alertItem.disasterType} •{" "}
                    {alertItem.severity}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusPill,
                    alertItem.active
                      ? styles.activePill
                      : styles.inactivePill,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      alertItem.active
                        ? styles.activeText
                        : styles.inactiveText,
                    ]}
                  >
                    {alertItem.active
                      ? "Active"
                      : "Inactive"}
                  </Text>
                </View>
              </View>

              <View style={styles.locationRow}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color="#64748B"
                />

                <Text style={styles.locationText}>
                  {alertItem.location}
                </Text>
              </View>

              <Text style={styles.message}>
                {alertItem.message}
              </Text>

              <Text style={styles.dateText}>
                Published:{" "}
                {formatDate(
                  alertItem.createdAt
                )}
              </Text>

              {alertItem.active && (
                <TouchableOpacity
                  style={styles.deactivateButton}
                  onPress={() =>
                    handleDeactivate(alertItem)
                  }
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={18}
                    color="#DC2626"
                  />

                  <Text
                    style={
                      styles.deactivateText
                    }
                  >
                    Deactivate Alert
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}

        <View style={{ height: 30 }} />
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
    paddingTop: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  pageTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },

  summaryLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "700",
    textAlign: "center",
  },

  summaryNumber: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 14,
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 28,
    alignItems: "center",
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: "900",
    color: "#111827",
  },

  emptyText: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
    color: "#6B7280",
    textAlign: "center",
  },

  alertCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 17,
    marginBottom: 14,
  },

  inactiveCard: {
    opacity: 0.6,
  },

  alertTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  alertIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  alertHeaderText: {
    flex: 1,
  },

  alertTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#111827",
  },

  alertType: {
    marginTop: 3,
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "700",
  },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  activePill: {
    backgroundColor: "#DCFCE7",
  },

  inactivePill: {
    backgroundColor: "#F1F5F9",
  },

  statusText: {
    fontSize: 10,
    fontWeight: "900",
  },

  activeText: {
    color: "#16A34A",
  },

  inactiveText: {
    color: "#64748B",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },

  locationText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },

  message: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 20,
    color: "#374151",
  },

  dateText: {
    marginTop: 12,
    fontSize: 11,
    color: "#94A3B8",
  },

  deactivateButton: {
    marginTop: 14,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    backgroundColor: "#FEF2F2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  deactivateText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#DC2626",
  },
});