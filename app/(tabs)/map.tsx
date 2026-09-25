import * as Location from "expo-location";
import { useFocusEffect } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, {
  Circle,
  Marker,
} from "react-native-maps";

import {
  DisasterAlert,
  getActiveAlerts,
} from "../../utils/alert-storage";

export default function MapScreen() {
  const [location, setLocation] =
    useState<Location.LocationObject | null>(null);

  const [alerts, setAlerts] =
    useState<DisasterAlert[]>([]);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  // ======================================================
  // LOAD CURRENT LOCATION
  // ======================================================

  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMessage(
          "Location permission is required to show your current position."
        );

        return;
      }

      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      setLocation(currentLocation);
    } catch (error) {
      console.log(
        "Could not get location:",
        error
      );

      setErrorMessage(
        "CrisisREADY could not get your current location."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // LOAD ACTIVE ALERTS
  // ======================================================

  const loadAlerts = async () => {
    try {
      const activeAlerts =
        await getActiveAlerts();

      const validMapAlerts =
        activeAlerts.filter(
          (alert) =>
            alert.latitude !== 0 &&
            alert.longitude !== 0
        );

      setAlerts(validMapAlerts);
    } catch (error) {
      console.log(
        "Could not load disaster map alerts:",
        error
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAlerts();
    }, [])
  );

  // ======================================================
  // DISTANCE CALCULATION
  // ======================================================

  const calculateDistanceKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const earthRadiusKm = 6371;

    const toRadians = (
      degrees: number
    ) => (degrees * Math.PI) / 180;

    const dLat =
      toRadians(lat2 - lat1);

    const dLon =
      toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return earthRadiusKm * c;
  };

  // ======================================================
  // NEAREST THREAT
  // ======================================================

  const nearestThreat = useMemo(() => {
    if (!location || alerts.length === 0) {
      return null;
    }

    const userLat =
      location.coords.latitude;

    const userLng =
      location.coords.longitude;

    const alertsWithDistance =
      alerts.map((alert) => {
        const distanceKm =
          calculateDistanceKm(
            userLat,
            userLng,
            alert.latitude,
            alert.longitude
          );

        return {
          alert,
          distanceKm,
        };
      });

    alertsWithDistance.sort(
      (a, b) =>
        a.distanceKm - b.distanceKm
    );

    return alertsWithDistance[0];
  }, [location, alerts]);

  // ======================================================
  // RISK STATUS
  // ======================================================

  const getRiskStatus = () => {
    if (!nearestThreat) {
      return {
        label: "NO ACTIVE THREATS",
        message:
          "No mapped disaster zones are currently active.",
      };
    }

    const {
      alert,
      distanceKm,
    } = nearestThreat;

    if (
      distanceKm <=
      alert.radiusKm
    ) {
      return {
        label: "DANGER ZONE",
        message:
          "You are inside the reported disaster danger radius.",
      };
    }

    if (
      distanceKm <=
      alert.radiusKm + 2
    ) {
      return {
        label: "NEAR DANGER ZONE",
        message:
          "You are close to the reported disaster area.",
      };
    }

    return {
      label: "OUTSIDE DANGER ZONE",
      message:
        "You are currently outside the reported danger radius.",
    };
  };

  const riskStatus =
    getRiskStatus();

  // ======================================================
  // UI STATES
  // ======================================================

  if (loading) {
    return (
      <SafeAreaView
        style={styles.safeArea}
      >
        <View
          style={
            styles.centerContainer
          }
        >
          <ActivityIndicator
            size="large"
            color="#2563EB"
          />

          <Text
            style={
              styles.loadingText
            }
          >
            Getting your current location...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMessage || !location) {
    return (
      <SafeAreaView
        style={styles.safeArea}
      >
        <View
          style={
            styles.centerContainer
          }
        >
          <Text
            style={
              styles.locationEmoji
            }
          >
            📍
          </Text>

          <Text
            style={
              styles.errorTitle
            }
          >
            Location Access Required
          </Text>

          <Text
            style={
              styles.errorText
            }
          >
            {errorMessage}
          </Text>

          <TouchableOpacity
            style={
              styles.retryButton
            }
            onPress={loadLocation}
          >
            <Text
              style={
                styles.retryText
              }
            >
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const latitude =
    location.coords.latitude;

  const longitude =
    location.coords.longitude;

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <ScrollView
        contentContainerStyle={
          styles.container
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text
              style={
                styles.pageTitle
              }
            >
              Live Disaster Map
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Your current safety status
            </Text>
          </View>

          <View
            style={
              styles.liveBadge
            }
          >
            <View
              style={styles.liveDot}
            />

            <Text
              style={
                styles.liveText
              }
            >
              LIVE
            </Text>
          </View>
        </View>

        {/* SAFETY STATUS */}

        <View
          style={
            styles.statusCard
          }
        >
          <Text
            style={
              styles.statusLabel
            }
          >
            {riskStatus.label}
          </Text>

          <Text
            style={
              styles.statusMessage
            }
          >
            {riskStatus.message}
          </Text>

          {nearestThreat && (
            <>
              <View
                style={
                  styles.statusDivider
                }
              />

              <Text
                style={
                  styles.threatText
                }
              >
                Nearest Threat:{" "}
                {
                  nearestThreat.alert
                    .disasterType
                }
              </Text>

              <Text
                style={
                  styles.threatText
                }
              >
                Distance:{" "}
                {nearestThreat.distanceKm.toFixed(
                  2
                )}{" "}
                km
              </Text>

              <Text
                style={
                  styles.threatText
                }
              >
                Danger Radius:{" "}
                {
                  nearestThreat.alert
                    .radiusKm
                }{" "}
                km
              </Text>
            </>
          )}
        </View>

        {/* CURRENT LOCATION */}

        <View
          style={
            styles.locationCard
          }
        >
          <Text
            style={
              styles.locationTitle
            }
          >
            📍 Current Location
          </Text>

          <Text
            style={
              styles.coordinates
            }
          >
            Latitude:{" "}
            {latitude.toFixed(5)}
          </Text>

          <Text
            style={
              styles.coordinates
            }
          >
            Longitude:{" "}
            {longitude.toFixed(5)}
          </Text>

          <Text
            style={
              styles.activeAlertText
            }
          >
            Active mapped alerts:{" "}
            {alerts.length}
          </Text>
        </View>

        {/* MAP */}

        <View
          style={
            styles.mapContainer
          }
        >
          <MapView
            style={styles.map}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.08,
              longitudeDelta: 0.08,
            }}
            showsUserLocation
            showsMyLocationButton
          >
            {/* USER */}

            <Marker
              coordinate={{
                latitude,
                longitude,
              }}
              title="You are here"
              description="Your current CrisisREADY location"
            />

            {/* DISASTER ALERTS */}

            {alerts.map(
              (alert) => (
                <React.Fragment
                  key={alert.id}
                >
                  <Circle
                    center={{
                      latitude:
                        alert.latitude,
                      longitude:
                        alert.longitude,
                    }}
                    radius={
                      alert.radiusKm *
                      1000
                    }
                    strokeColor="rgba(220, 38, 38, 0.8)"
                    fillColor="rgba(220, 38, 38, 0.18)"
                    strokeWidth={2}
                  />

                  <Marker
                    coordinate={{
                      latitude:
                        alert.latitude,
                      longitude:
                        alert.longitude,
                    }}
                    title={`${alert.disasterType} — ${alert.severity}`}
                    description={`${alert.title} • ${alert.location}`}
                    pinColor="red"
                  />
                </React.Fragment>
              )
            )}
          </MapView>
        </View>

        {/* ACTIVE ALERT LIST */}

        {alerts.length > 0 && (
          <>
            <Text
              style={
                styles.sectionTitle
              }
            >
              Active Disaster Zones
            </Text>

            {alerts.map(
              (alert) => {
                const distance =
                  calculateDistanceKm(
                    latitude,
                    longitude,
                    alert.latitude,
                    alert.longitude
                  );

                return (
                  <View
                    key={alert.id}
                    style={
                      styles.alertCard
                    }
                  >
                    <Text
                      style={
                        styles.alertTitle
                      }
                    >
                      {alert.disasterType} —{" "}
                      {alert.severity}
                    </Text>

                    <Text
                      style={
                        styles.alertLocation
                      }
                    >
                      {alert.location}
                    </Text>

                    <Text
                      style={
                        styles.alertMessage
                      }
                    >
                      {alert.title}
                    </Text>

                    <Text
                      style={
                        styles.distanceText
                      }
                    >
                      Distance from you:{" "}
                      {distance.toFixed(
                        2
                      )}{" "}
                      km
                    </Text>

                    <Text
                      style={
                        styles.radiusText
                      }
                    >
                      Danger radius:{" "}
                      {alert.radiusKm} km
                    </Text>
                  </View>
                );
              }
            )}
          </>
        )}

        {/* REFRESH */}

        <TouchableOpacity
          style={
            styles.refreshButton
          }
          onPress={async () => {
            await loadLocation();
            await loadAlerts();
          }}
        >
          <Text
            style={
              styles.refreshText
            }
          >
            Refresh Map
          </Text>
        </TouchableOpacity>

        <View
          style={{ height: 20 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor:
        "#F8FAFC",
    },

    container: {
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 25,
    },

    header: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      marginBottom: 16,
    },

    pageTitle: {
      fontSize: 25,
      fontWeight: "900",
      color: "#111827",
    },

    subtitle: {
      marginTop: 4,
      fontSize: 13,
      color: "#6B7280",
    },

    liveBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor:
        "#DCFCE7",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
    },

    liveDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor:
        "#16A34A",
      marginRight: 6,
    },

    liveText: {
      fontSize: 10,
      fontWeight: "900",
      color: "#166534",
    },

    statusCard: {
      backgroundColor:
        "#FFF7ED",
      borderWidth: 1,
      borderColor:
        "#FDBA74",
      borderRadius: 17,
      padding: 16,
      marginBottom: 14,
    },

    statusLabel: {
      fontSize: 14,
      fontWeight: "900",
      color: "#9A3412",
    },

    statusMessage: {
      marginTop: 5,
      fontSize: 13,
      lineHeight: 19,
      color: "#7C2D12",
    },

    statusDivider: {
      height: 1,
      backgroundColor:
        "#FED7AA",
      marginVertical: 10,
    },

    threatText: {
      fontSize: 12,
      color: "#9A3412",
      fontWeight: "700",
      marginBottom: 3,
    },

    locationCard: {
      backgroundColor:
        "#FFFFFF",
      borderWidth: 1,
      borderColor:
        "#E5E7EB",
      borderRadius: 16,
      padding: 15,
      marginBottom: 14,
    },

    locationTitle: {
      fontSize: 15,
      fontWeight: "900",
      color: "#111827",
      marginBottom: 7,
    },

    coordinates: {
      fontSize: 12,
      color: "#64748B",
      marginBottom: 2,
    },

    activeAlertText: {
      marginTop: 7,
      fontSize: 12,
      fontWeight: "800",
      color: "#2563EB",
    },

    mapContainer: {
      height: 390,
      borderRadius: 20,
      overflow: "hidden",
      borderWidth: 1,
      borderColor:
        "#E5E7EB",
      marginBottom: 20,
    },

    map: {
      flex: 1,
    },

    sectionTitle: {
      fontSize: 17,
      fontWeight: "900",
      color: "#111827",
      marginBottom: 10,
    },

    alertCard: {
      backgroundColor:
        "#FFFFFF",
      borderRadius: 15,
      borderWidth: 1,
      borderColor:
        "#FECACA",
      padding: 14,
      marginBottom: 10,
    },

    alertTitle: {
      fontSize: 14,
      fontWeight: "900",
      color: "#991B1B",
    },

    alertLocation: {
      marginTop: 3,
      fontSize: 12,
      fontWeight: "700",
      color: "#64748B",
    },

    alertMessage: {
      marginTop: 7,
      fontSize: 13,
      color: "#374151",
    },

    distanceText: {
      marginTop: 9,
      fontSize: 12,
      fontWeight: "800",
      color: "#DC2626",
    },

    radiusText: {
      marginTop: 3,
      fontSize: 11,
      color: "#6B7280",
    },

    refreshButton: {
      height: 50,
      backgroundColor:
        "#2563EB",
      borderRadius: 13,
      alignItems: "center",
      justifyContent:
        "center",
      marginTop: 8,
    },

    refreshText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "900",
    },

    centerContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent:
        "center",
      paddingHorizontal: 30,
    },

    loadingText: {
      marginTop: 14,
      fontSize: 14,
      color: "#6B7280",
      fontWeight: "700",
    },

    locationEmoji: {
      fontSize: 48,
      marginBottom: 12,
    },

    errorTitle: {
      fontSize: 20,
      fontWeight: "900",
      color: "#111827",
      textAlign: "center",
    },

    errorText: {
      marginTop: 8,
      fontSize: 13,
      lineHeight: 19,
      color: "#6B7280",
      textAlign: "center",
    },

    retryButton: {
      marginTop: 18,
      backgroundColor:
        "#2563EB",
      paddingHorizontal: 22,
      paddingVertical: 12,
      borderRadius: 12,
    },

    retryText: {
      color: "#FFFFFF",
      fontWeight: "800",
    },
  });