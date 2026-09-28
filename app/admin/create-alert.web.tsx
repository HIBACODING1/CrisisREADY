import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function CreateAlertScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.icon}>🚨</Text>

        <Text style={styles.title}>Create Disaster Alert</Text>

        <Text style={styles.text}>
          Alert creation uses native map services to select
          the disaster location and danger radius.
        </Text>

        <Text style={styles.note}>
          Open CrisisREADY on a mobile device to create
          location-based disaster alerts.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    padding: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
  },

  icon: {
    fontSize: 48,
    marginBottom: 14,
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
    textAlign: "center",
  },

  text: {
    marginTop: 14,
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
    textAlign: "center",
  },

  note: {
    marginTop: 14,
    fontSize: 13,
    lineHeight: 20,
    color: "#6B7280",
    textAlign: "center",
  },
});