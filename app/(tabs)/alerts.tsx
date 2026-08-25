import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  DisasterAlert,
  getActiveAlerts,
} from "../../utils/alert-storage";

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<DisasterAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    try {
      setLoading(true);

      const activeAlerts = await getActiveAlerts();

      setAlerts(activeAlerts);
    } catch (error) {
      console.log("Could not load user alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAlerts();
    }, [])
  );

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

  const getSeverityLabel = (
    severity: string
  ) => {
    return severity.toUpperCase();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>
              Emergency Alerts
            </Text>

            <Text style={styles.subtitle}>
              Active disaster warnings and safety information
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="notifications-outline"
              size={27}
              color="#2563EB"
            />
          </View>
        </View>

        {loading ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              Loading alerts...
            </Text>
          </View>
        ) : alerts.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={42}
                color="#16A34A"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No Active Alerts
            </Text>

            <Text style={styles.emptyText}>
              There are currently no active disaster warnings.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.activeSummary}>
              <Ionicons
                name="warning-outline"
                size={22}
                color="#DC2626"
              />

              <Text style={styles.activeSummaryText}>
                {alerts.length} active{" "}
                {alerts.length === 1 ? "alert" : "alerts"}
              </Text>
            </View>

            {alerts.map((alertItem) => (
              <View
                key={alertItem.id}
                style={styles.alertCard}
              >
                <View style={styles.alertTop}>
                  <View style={styles.alertIconBox}>
                    <Ionicons
                      name={
                        getSeverityIcon(
                          alertItem.severity
                        ) as any
                      }
                      size={28}
                      color="#DC2626"
                    />
                  </View>

                  <View style={styles.alertHeading}>
                    <Text style={styles.alertTitle}>
                      {alertItem.title}
                    </Text>

                    <Text style={styles.alertMeta}>
                      {alertItem.disasterType}
                    </Text>
                  </View>

                  <View style={styles.severityPill}>
                    <Text style={styles.severityText}>
                      {getSeverityLabel(
                        alertItem.severity
                      )}
                    </Text>
                  </View>
                </View>

                <View style={styles.locationRow}>
                  <Ionicons
                    name="location-outline"
                    size={17}
                    color="#64748B"
                  />

                  <Text style={styles.locationText}>
                    {alertItem.location}
                  </Text>
                </View>

                <Text style={styles.message}>
                  {alertItem.message}
                </Text>

                <View style={styles.footerRow}>
                  <Ionicons
                    name="time-outline"
                    size={15}
                    color="#94A3B8"
                  />

                  <Text style={styles.dateText}>
                    {formatDate(alertItem.createdAt)}
                  </Text>
                </View>
              </View>
            ))}
          </>
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111827",
  },

  subtitle: {
    marginTop: 5,
    fontSize: 13,
    color: "#6B7280",
    maxWidth: 260,
  },

  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },

  activeSummary: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 15,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  activeSummaryText: {
    marginLeft: 9,
    fontSize: 14,
    fontWeight: "800",
    color: "#991B1B",
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
  },

  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
  },

  emptyText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: "#6B7280",
    textAlign: "center",
  },

  alertCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#FECACA",
    padding: 17,
    marginBottom: 14,
  },

  alertTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  alertIconBox: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  alertHeading: {
    flex: 1,
  },

  alertTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
  },

  alertMeta: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },

  severityPill: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#FEE2E2",
  },

  severityText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#B91C1C",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },

  locationText: {
    marginLeft: 5,
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
  },

  message: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: "#374151",
  },

  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },

  dateText: {
    marginLeft: 5,
    fontSize: 11,
    color: "#94A3B8",
  },
});