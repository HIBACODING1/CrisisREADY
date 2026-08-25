import AsyncStorage from "@react-native-async-storage/async-storage";

export type DisasterSeverity =
  | "Advisory"
  | "Warning"
  | "Severe"
  | "Critical";

export type DisasterAlert = {
  id: string;
  disasterType: string;
  severity: DisasterSeverity;
  location: string;
  title: string;
  message: string;

  // NEW: map data
  latitude: number;
  longitude: number;
  radiusKm: number;

  createdAt: string;
  active: boolean;
};

const ALERTS_KEY = "crisisready_disaster_alerts";

// ======================================================
// GET ALL ALERTS
// ======================================================

export async function getAlerts(): Promise<DisasterAlert[]> {
  const storedAlerts =
    await AsyncStorage.getItem(ALERTS_KEY);

  if (!storedAlerts) {
    return [];
  }

  const parsedAlerts = JSON.parse(storedAlerts);

  /*
    Backward compatibility:
    Older alerts created before map support may not
    contain latitude, longitude or radiusKm.
  */

  return parsedAlerts.map((alert: any) => ({
    ...alert,

    latitude:
      typeof alert.latitude === "number"
        ? alert.latitude
        : 0,

    longitude:
      typeof alert.longitude === "number"
        ? alert.longitude
        : 0,

    radiusKm:
      typeof alert.radiusKm === "number"
        ? alert.radiusKm
        : 5,
  }));
}

// ======================================================
// GET ACTIVE ALERTS
// ======================================================

export async function getActiveAlerts(): Promise<DisasterAlert[]> {
  const alerts = await getAlerts();

  return alerts
    .filter((alert) => alert.active)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
}

// ======================================================
// CREATE ALERT
// ======================================================

export async function createAlert(
  disasterType: string,
  severity: DisasterSeverity,
  location: string,
  title: string,
  message: string,

  // NEW
  latitude: number,
  longitude: number,
  radiusKm: number
): Promise<DisasterAlert> {
  const alerts = await getAlerts();

  const newAlert: DisasterAlert = {
    id: Date.now().toString(),

    disasterType: disasterType.trim(),

    severity,

    location: location.trim(),

    title: title.trim(),

    message: message.trim(),

    latitude,

    longitude,

    radiusKm,

    createdAt: new Date().toISOString(),

    active: true,
  };

  const updatedAlerts = [
    newAlert,
    ...alerts,
  ];

  await AsyncStorage.setItem(
    ALERTS_KEY,
    JSON.stringify(updatedAlerts)
  );

  return newAlert;
}

// ======================================================
// DEACTIVATE ALERT
// ======================================================

export async function deactivateAlert(
  alertId: string
): Promise<void> {
  const alerts = await getAlerts();

  const updatedAlerts = alerts.map((alert) =>
    alert.id === alertId
      ? {
          ...alert,
          active: false,
        }
      : alert
  );

  await AsyncStorage.setItem(
    ALERTS_KEY,
    JSON.stringify(updatedAlerts)
  );
}

// ======================================================
// ADMIN SESSION
// ======================================================

const ADMIN_SESSION_KEY =
  "crisisready_admin_session";

export async function startAdminSession(): Promise<void> {
  await AsyncStorage.setItem(
    ADMIN_SESSION_KEY,
    "true"
  );
}

export async function isAdminLoggedIn(): Promise<boolean> {
  const session =
    await AsyncStorage.getItem(
      ADMIN_SESSION_KEY
    );

  return session === "true";
}

export async function endAdminSession(): Promise<void> {
  await AsyncStorage.removeItem(
    ADMIN_SESSION_KEY
  );
}