import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const emergencyContacts = [
  {
    title: "Rescue 1122",
    subtitle: "Ambulance, rescue and emergency response",
    phone: "1122",
    icon: "medical-outline",
  },
  {
    title: "Police Emergency",
    subtitle: "Report crime, danger or public safety emergency",
    phone: "15",
    icon: "shield-checkmark-outline",
  },
  {
    title: "Fire Brigade",
    subtitle: "Fire emergency support",
    phone: "16",
    icon: "flame-outline",
  },
  {
    title: "Edhi Ambulance",
    subtitle: "Ambulance and emergency medical assistance",
    phone: "115",
    icon: "heart-outline",
  },
  {
    title: "PDMA Punjab",
    subtitle: "Disaster emergency support",
    phone: "1129",
    icon: "warning-outline",
  },
  {
    title: "Motorway Police",
    subtitle: "Road and motorway emergency helpline",
    phone: "130",
    icon: "car-outline",
  },
];

const resourceSections = [
  {
    title: "Emergency Kit",
    icon: "bag-handle-outline",
    points: [
      "Keep drinking water and dry food ready.",
      "Store basic medicine, first aid items and a torch.",
      "Keep a power bank, batteries and phone charger available.",
      "Check supplies regularly and replace expired items.",
    ],
  },
  {
    title: "Important Documents",
    icon: "document-text-outline",
    points: [
      "Keep copies of CNIC, passport and medical documents.",
      "Store digital copies on your phone or cloud storage.",
      "Keep documents in a waterproof folder.",
      "Share important copies with a trusted family member if needed.",
    ],
  },
  {
    title: "Flood Safety",
    icon: "water-outline",
    points: [
      "Move to higher ground if flooding starts.",
      "Avoid walking or driving through flood water.",
      "Keep children away from drains and fast-moving water.",
      "Follow local authority warnings and evacuation advice.",
    ],
  },
  {
    title: "Earthquake Safety",
    icon: "home-outline",
    points: [
      "Drop, cover and hold during shaking.",
      "Stay away from windows, glass and heavy furniture.",
      "Move outside only when shaking stops.",
      "Check for gas leaks, injuries and building damage afterwards.",
    ],
  },
  {
    title: "Family Communication Plan",
    icon: "people-outline",
    points: [
      "Save emergency contacts on every family member’s phone.",
      "Choose one meeting point near home and one outside the area.",
      "Decide who will contact children, elders or vulnerable family members.",
      "Keep phone numbers written on paper in case phone battery dies.",
    ],
  },
];

export default function ResourcesScreen() {
  const callNumber = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Resource Hub</Text>
          <Text style={styles.headerSubtitle}>
            Static emergency contacts and basic preparedness guidance for the
            CrisisREADY prototype.
          </Text>
        </View>

        <View style={styles.noticeBox}>
          <Ionicons name="information-circle-outline" size={24} color="#2563EB" />
          <Text style={styles.noticeText}>
            This is prototype information. In a real emergency, always follow
            official local authority instructions.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <Text style={styles.sectionSubtitle}>Tap a number to call.</Text>
        </View>

        <View style={styles.contactList}>
          {emergencyContacts.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.contactCard}
              onPress={() => callNumber(item.phone)}
            >
              <View style={styles.contactIconBox}>
                <Ionicons name={item.icon as any} size={24} color="#2563EB" />
              </View>

              <View style={styles.contactTextBox}>
                <Text style={styles.contactTitle}>{item.title}</Text>
                <Text style={styles.contactSubtitle}>{item.subtitle}</Text>
              </View>

              <View style={styles.phoneBox}>
                <Text style={styles.phoneText}>{item.phone}</Text>
                <Ionicons name="call-outline" size={18} color="#16A34A" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Preparedness Resources</Text>
          <Text style={styles.sectionSubtitle}>
            Basic information users can read before an emergency.
          </Text>
        </View>

        <View style={styles.resourceList}>
          {resourceSections.map((section) => (
            <View key={section.title} style={styles.resourceCard}>
              <View style={styles.resourceTop}>
                <View style={styles.resourceIconBox}>
                  <Ionicons name={section.icon as any} size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.resourceTitle}>{section.title}</Text>
              </View>

              {section.points.map((point, index) => (
                <View key={index} style={styles.pointRow}>
                  <View style={styles.dot} />
                  <Text style={styles.pointText}>{point}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.bottomSpace} />
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
    paddingHorizontal: 22,
  },

  header: {
    marginTop: 18,
    marginBottom: 18,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 8,
  },

  headerSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
    fontWeight: "600",
  },

  noticeBox: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },

  noticeText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    lineHeight: 20,
    color: "#1E3A8A",
    fontWeight: "600",
  },

  sectionHeader: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 4,
  },

  sectionSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },

  contactList: {
    marginBottom: 26,
  },

  contactCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
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

  contactIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  contactTextBox: {
    flex: 1,
  },

  contactTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 4,
  },

  contactSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: "#6B7280",
    fontWeight: "600",
  },

  phoneBox: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  phoneText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#16A34A",
  },

  resourceList: {
    gap: 12,
  },

  resourceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  resourceTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  resourceIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  resourceTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#111827",
  },

  pointRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#2563EB",
    marginTop: 7,
    marginRight: 10,
  },

  pointText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: "#374151",
    fontWeight: "600",
  },

  bottomSpace: {
    height: 30,
  },
});