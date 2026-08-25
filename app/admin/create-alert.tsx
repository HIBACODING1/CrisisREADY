import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, {
  Circle,
  MapPressEvent,
  Marker,
  Region,
} from "react-native-maps";

import {
  createAlert,
  DisasterSeverity,
} from "../../utils/alert-storage";

const disasterTypes = [
  "Flood",
  "Earthquake",
  "Fire",
  "Landslide",
  "Heatwave",
];

const severityLevels: DisasterSeverity[] = [
  "Advisory",
  "Warning",
  "Severe",
  "Critical",
];

const radiusOptions = [1, 2, 5, 10, 20];

export default function CreateAlertScreen() {
  const router = useRouter();

  const [disasterType, setDisasterType] =
    useState("Flood");

  const [severity, setSeverity] =
    useState<DisasterSeverity>("Warning");

  const [locationName, setLocationName] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [selectedLatitude, setSelectedLatitude] =
    useState<number | null>(null);

  const [selectedLongitude, setSelectedLongitude] =
    useState<number | null>(null);

  const [radiusKm, setRadiusKm] =
    useState(5);

  const [saving, setSaving] =
    useState(false);

  const [loadingMap, setLoadingMap] =
    useState(true);

  const [mapRegion, setMapRegion] =
    useState<Region>({
      latitude: 31.4504,
      longitude: 73.135,
      latitudeDelta: 0.15,
      longitudeDelta: 0.15,
    });

  // ======================================================
  // LOAD ADMIN CURRENT LOCATION FOR INITIAL MAP POSITION
  // ======================================================

  useEffect(() => {
    loadInitialMapLocation();
  }, []);

  const loadInitialMapLocation = async () => {
    try {
      setLoadingMap(true);

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        return;
      }

      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

      setMapRegion({
        latitude:
          currentLocation.coords.latitude,
        longitude:
          currentLocation.coords.longitude,
        latitudeDelta: 0.12,
        longitudeDelta: 0.12,
      });
    } catch (error) {
      console.log(
        "Could not load admin map location:",
        error
      );
    } finally {
      setLoadingMap(false);
    }
  };

  // ======================================================
  // MAP TAP
  // ======================================================

  const handleMapPress = (
    event: MapPressEvent
  ) => {
    const {
      latitude,
      longitude,
    } = event.nativeEvent.coordinate;

    setSelectedLatitude(latitude);
    setSelectedLongitude(longitude);
  };

  // ======================================================
  // PUBLISH ALERT
  // ======================================================

  const handlePublish = async () => {
    if (!locationName.trim()) {
      Alert.alert(
        "Location Required",
        "Please enter the affected location name."
      );
      return;
    }

    if (!title.trim()) {
      Alert.alert(
        "Title Required",
        "Please enter an alert title."
      );
      return;
    }

    if (!message.trim()) {
      Alert.alert(
        "Message Required",
        "Please enter the disaster alert message."
      );
      return;
    }

    if (
      selectedLatitude === null ||
      selectedLongitude === null
    ) {
      Alert.alert(
        "Map Location Required",
        "Please tap the map to select the disaster location."
      );
      return;
    }

    try {
      setSaving(true);

      await createAlert(
        disasterType,
        severity,
        locationName.trim(),
        title.trim(),
        message.trim(),
        selectedLatitude,
        selectedLongitude,
        radiusKm
      );

      Alert.alert(
        "Alert Published",
        "The disaster alert has been published successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace("/admin");
            },
          },
        ]
      );
    } catch (error) {
      console.log(
        "Could not publish alert:",
        error
      );

      Alert.alert(
        "Error",
        "Could not publish the alert."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#111827"
            />
          </TouchableOpacity>

          <View style={styles.headerTextBox}>
            <Text style={styles.pageTitle}>
              Generate Alert
            </Text>

            <Text style={styles.pageSubtitle}>
              Create and map an emergency warning
            </Text>
          </View>
        </View>

        {/* INFO */}

        <View style={styles.warningCard}>
          <Ionicons
            name="warning-outline"
            size={25}
            color="#DC2626"
          />

          <Text style={styles.warningText}>
            Tap the affected area directly on the
            map. CrisisREADY will save the
            coordinates automatically.
          </Text>
        </View>

        {/* DISASTER TYPE */}

        <Text style={styles.label}>
          Disaster Type
        </Text>

        <View style={styles.optionGrid}>
          {disasterTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.optionButton,
                disasterType === type &&
                  styles.selectedOption,
              ]}
              onPress={() =>
                setDisasterType(type)
              }
            >
              <Text
                style={[
                  styles.optionText,
                  disasterType === type &&
                    styles.selectedOptionText,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SEVERITY */}

        <Text style={styles.label}>
          Severity
        </Text>

        <View style={styles.optionGrid}>
          {severityLevels.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.optionButton,
                severity === level &&
                  styles.selectedSeverity,
              ]}
              onPress={() =>
                setSeverity(level)
              }
            >
              <Text
                style={[
                  styles.optionText,
                  severity === level &&
                    styles.selectedSeverityText,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* LOCATION NAME */}

        <Text style={styles.label}>
          Location Name
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. Faisalabad, Punjab"
          placeholderTextColor="#9CA3AF"
          value={locationName}
          onChangeText={setLocationName}
        />

        {/* TITLE */}

        <Text style={styles.label}>
          Alert Title
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. Flash Flood Warning"
          placeholderTextColor="#9CA3AF"
          value={title}
          onChangeText={setTitle}
        />

        {/* MESSAGE */}

        <Text style={styles.label}>
          Alert Message
        </Text>

        <TextInput
          style={styles.messageInput}
          placeholder="Enter safety instructions and emergency information..."
          placeholderTextColor="#9CA3AF"
          multiline
          textAlignVertical="top"
          value={message}
          onChangeText={setMessage}
        />

        {/* MAP SELECTOR */}

        <View style={styles.mapHeaderRow}>
          <View>
            <Text style={styles.sectionHeading}>
              Select Disaster Location
            </Text>

            <Text style={styles.helperText}>
              Tap anywhere on the map to place
              the disaster centre.
            </Text>
          </View>

          <Ionicons
            name="location"
            size={24}
            color="#DC2626"
          />
        </View>

        <View style={styles.mapContainer}>
          {loadingMap ? (
            <View style={styles.mapLoading}>
              <ActivityIndicator
                size="large"
                color="#2563EB"
              />

              <Text style={styles.mapLoadingText}>
                Loading map...
              </Text>
            </View>
          ) : (
            <MapView
              style={styles.map}
              region={mapRegion}
              onRegionChangeComplete={
                setMapRegion
              }
              onPress={handleMapPress}
              showsUserLocation
              showsMyLocationButton
            >
              {selectedLatitude !== null &&
                selectedLongitude !== null && (
                  <>
                    <Circle
                      center={{
                        latitude:
                          selectedLatitude,
                        longitude:
                          selectedLongitude,
                      }}
                      radius={
                        radiusKm * 1000
                      }
                      strokeColor="rgba(220,38,38,0.9)"
                      fillColor="rgba(220,38,38,0.18)"
                      strokeWidth={2}
                    />

                    <Marker
                      coordinate={{
                        latitude:
                          selectedLatitude,
                        longitude:
                          selectedLongitude,
                      }}
                      title="Disaster Centre"
                      description={`${disasterType} • ${severity}`}
                      pinColor="red"
                    />
                  </>
                )}
            </MapView>
          )}
        </View>

        {/* SELECTED COORDINATES */}

        <View style={styles.coordinateCard}>
          <Text style={styles.coordinateTitle}>
            Selected Location
          </Text>

          {selectedLatitude !== null &&
          selectedLongitude !== null ? (
            <>
              <Text style={styles.coordinateText}>
                Latitude:{" "}
                {selectedLatitude.toFixed(5)}
              </Text>

              <Text style={styles.coordinateText}>
                Longitude:{" "}
                {selectedLongitude.toFixed(5)}
              </Text>

              <Text style={styles.coordinateSuccess}>
                ✓ Map location selected
              </Text>
            </>
          ) : (
            <Text style={styles.coordinateEmpty}>
              No location selected yet. Tap the
              map above.
            </Text>
          )}
        </View>

        {/* RADIUS */}

        <Text style={styles.sectionHeading}>
          Danger Radius
        </Text>

        <Text style={styles.helperText}>
          Choose how far the reported danger zone
          extends from the selected point.
        </Text>

        <View style={styles.radiusRow}>
          {radiusOptions.map((radius) => (
            <TouchableOpacity
              key={radius}
              style={[
                styles.radiusButton,
                radiusKm === radius &&
                  styles.radiusButtonSelected,
              ]}
              onPress={() =>
                setRadiusKm(radius)
              }
            >
              <Text
                style={[
                  styles.radiusText,
                  radiusKm === radius &&
                    styles.radiusTextSelected,
                ]}
              >
                {radius} km
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* PREVIEW */}

        <Text style={styles.previewHeading}>
          Alert Preview
        </Text>

        <View style={styles.previewCard}>
          <View style={styles.previewTopRow}>
            <View style={styles.previewIcon}>
              <Ionicons
                name="warning"
                size={24}
                color="#DC2626"
              />
            </View>

            <View style={styles.previewTitleBox}>
              <Text style={styles.previewTitle}>
                {title.trim() ||
                  "Emergency Alert"}
              </Text>

              <Text style={styles.previewMeta}>
                {disasterType} • {severity}
              </Text>
            </View>
          </View>

          <Text style={styles.previewLocation}>
            📍{" "}
            {locationName.trim() ||
              "Affected location"}
          </Text>

          <Text style={styles.previewMessage}>
            {message.trim() ||
              "Emergency instructions will appear here."}
          </Text>

          <Text style={styles.previewRadius}>
            Danger Radius: {radiusKm} km
          </Text>
        </View>

        {/* PUBLISH */}

        <TouchableOpacity
          style={[
            styles.publishButton,
            saving &&
              styles.disabledButton,
          ]}
          onPress={handlePublish}
          disabled={saving}
        >
          <Ionicons
            name="notifications"
            size={20}
            color="#FFFFFF"
          />

          <Text style={styles.publishText}>
            {saving
              ? "Publishing..."
              : "Publish Disaster Alert"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={saving}
        >
          <Text style={styles.cancelText}>
            Cancel
          </Text>
        </TouchableOpacity>

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
    marginBottom: 22,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  headerTextBox: {
    flex: 1,
  },

  pageTitle: {
    fontSize: 25,
    fontWeight: "900",
    color: "#111827",
  },

  pageSubtitle: {
    marginTop: 3,
    fontSize: 13,
    color: "#6B7280",
  },

  warningCard: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  warningText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    lineHeight: 19,
    color: "#991B1B",
    fontWeight: "600",
  },

  label: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 9,
    marginTop: 7,
  },

  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },

  optionButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDE3EA",
    backgroundColor: "#FFFFFF",
  },

  selectedOption: {
    backgroundColor: "#DBEAFE",
    borderColor: "#2563EB",
  },

  selectedSeverity: {
    backgroundColor: "#FEE2E2",
    borderColor: "#DC2626",
  },

  optionText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
  },

  selectedOptionText: {
    color: "#1D4ED8",
  },

  selectedSeverityText: {
    color: "#B91C1C",
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#DDE3EA",
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    fontSize: 15,
    color: "#111827",
    marginBottom: 12,
  },

  messageInput: {
    minHeight: 130,
    borderWidth: 1,
    borderColor: "#DDE3EA",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingTop: 14,
    backgroundColor: "#FFFFFF",
    fontSize: 15,
    color: "#111827",
    marginBottom: 22,
  },

  mapHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },

  sectionHeading: {
    fontSize: 17,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 4,
  },

  helperText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#6B7280",
    marginBottom: 12,
  },

  mapContainer: {
    height: 340,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },

  map: {
    flex: 1,
  },

  mapLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  mapLoadingText: {
    marginTop: 10,
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "700",
  },

  coordinateCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },

  coordinateTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 5,
  },

  coordinateText: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 2,
  },

  coordinateSuccess: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "800",
    color: "#16A34A",
  },

  coordinateEmpty: {
    fontSize: 12,
    color: "#94A3B8",
  },

  radiusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },

  radiusButton: {
    minWidth: 58,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#DDE3EA",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },

  radiusButtonSelected: {
    backgroundColor: "#FEE2E2",
    borderColor: "#DC2626",
  },

  radiusText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#475569",
  },

  radiusTextSelected: {
    color: "#B91C1C",
  },

  previewHeading: {
    fontSize: 15,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 10,
  },

  previewCard: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    borderRadius: 17,
    padding: 15,
    marginBottom: 22,
  },

  previewTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  previewIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  previewTitleBox: {
    flex: 1,
  },

  previewTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#7F1D1D",
  },

  previewMeta: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: "700",
    color: "#B91C1C",
  },

  previewLocation: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: "700",
    color: "#991B1B",
  },

  previewMessage: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: "#7F1D1D",
  },

  previewRadius: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: "800",
    color: "#B91C1C",
  },

  publishButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#DC2626",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  disabledButton: {
    opacity: 0.6,
  },

  publishText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  cancelButton: {
    height: 48,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  cancelText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#64748B",
  },
});