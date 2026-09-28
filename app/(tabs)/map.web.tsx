import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.icon}>📍</Text>

        <Text style={styles.title}>Live Disaster Map</Text>

        <Text style={styles.text}>
          The CrisisREADY disaster map uses native mobile
          location and map services.
        </Text>

        <Text style={styles.note}>
          Open CrisisREADY on a mobile device to view your
          current location, active disaster zones and
          distance from nearby alerts.
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
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  icon: {
    fontSize: 48,
    marginBottom: 14,
  },

  title: {
    fontSize: 25,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 12,
  },

  text: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    color: "#374151",
  },

  note: {
    marginTop: 14,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    color: "#6B7280",
  },
}); 