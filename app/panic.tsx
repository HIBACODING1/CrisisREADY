import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as SMS from "expo-sms";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { getCurrentUser } from "../utils/auth-storage";

import {
  EmergencyContact,
  EmergencyContacts,
  getEmergencyContacts,
  saveEmergencyContacts,
  deleteEmergencyContact,
} from "../utils/emergency-contacts-storage";

// ======================================================
// OFFICIAL EMERGENCY CONTACTS
// ======================================================

const emergencyContacts = [
  {
    title: "Rescue 1122",
    subtitle: "Ambulance and emergency rescue",
    number: "1122",
    icon: "medical-outline",
    color: "#DC2626",
    bgColor: "#FEE2E2",
  },
  {
    title: "Police Emergency",
    subtitle: "Police help and public safety",
    number: "15",
    icon: "shield-checkmark-outline",
    color: "#2563EB",
    bgColor: "#DBEAFE",
  },
  {
    title: "Fire Brigade",
    subtitle: "Fire emergency response",
    number: "16",
    icon: "flame-outline",
    color: "#EA580C",
    bgColor: "#FFEDD5",
  },
  {
    title: "Edhi Ambulance",
    subtitle: "Ambulance support",
    number: "115",
    icon: "heart-outline",
    color: "#16A34A",
    bgColor: "#DCFCE7",
  },
];

// ======================================================
// SAFETY STEPS
// ======================================================

const quickSafetySteps = [
  {
    title: "Flood",
    steps: [
      "Move to higher ground immediately.",
      "Avoid walking or driving through flood water.",
      "Stay away from electric poles and wires.",
    ],
    icon: "water-outline",
    color: "#2563EB",
    bgColor: "#DBEAFE",
  },
  {
    title: "Earthquake",
    steps: [
      "Drop, cover and hold during shaking.",
      "Stay away from windows and heavy objects.",
      "Leave carefully after shaking stops.",
    ],
    icon: "home-outline",
    color: "#7C3AED",
    bgColor: "#EDE9FE",
  },
  {
    title: "Fire",
    steps: [
      "Leave the building using stairs if safe.",
      "Stay low under smoke.",
      "Do not go back inside.",
    ],
    icon: "flame-outline",
    color: "#DC2626",
    bgColor: "#FEE2E2",
  },
  {
    title: "Heatwave",
    steps: [
      "Move to shade or a cool place.",
      "Drink water regularly.",
      "Help children, elders and sick people first.",
    ],
    icon: "sunny-outline",
    color: "#EA580C",
    bgColor: "#FFEDD5",
  },
];

type ContactKey =
  | "contact1"
  | "contact2"
  | "contact3";

const emptyContacts: EmergencyContacts = {
  contact1: {
    name: "",
    phone: "",
  },

  contact2: {
    name: "",
    phone: "",
  },

  contact3: {
    name: "",
    phone: "",
  },
};

export default function PanicScreen() {
  const router = useRouter();

  // ======================================================
  // USER + CONTACT STORAGE
  // ======================================================

  const [currentUserId, setCurrentUserId] =
    React.useState<string | null>(null);

  const [contacts, setContacts] =
    React.useState<EmergencyContacts>(
      emptyContacts
    );

  const [loadingContacts, setLoadingContacts] =
    React.useState(true);

  // Which contact is currently being edited
  const [editingContact, setEditingContact] =
    React.useState<ContactKey | null>(null);

  const [editName, setEditName] =
    React.useState("");

  const [editPhone, setEditPhone] =
    React.useState("");

  // ======================================================
  // LOCATION
  // ======================================================

  const [locationText, setLocationText] =
    React.useState("");

  // ======================================================
  // LOAD SAVED CONTACTS WHEN SCREEN OPENS
  // ======================================================

  React.useEffect(() => {
    loadEmergencyContacts();
  }, []);

  const loadEmergencyContacts =
    async () => {
      try {
        setLoadingContacts(true);

        const currentUser =
          await getCurrentUser();

        if (!currentUser) {
          router.replace("/login");
          return;
        }

        setCurrentUserId(
          currentUser.id
        );

        const savedContacts =
          await getEmergencyContacts(
            currentUser.id
          );

        setContacts(
          savedContacts
        );
      } catch (error) {
        console.log(
          "Could not load emergency contacts:",
          error
        );

        Alert.alert(
          "Error",
          "Could not load your saved emergency contacts."
        );
      } finally {
        setLoadingContacts(false);
      }
    };

  // ======================================================
  // CALL PHONE NUMBER
  // ======================================================

  const callNumber = (
    number: string
  ) => {
    Linking.openURL(
      `tel:${number}`
    );
  };

  // ======================================================
  // CLEAN PHONE NUMBER
  // ======================================================

  const cleanPhoneNumber = (
    phone: string
  ) => {
    return phone.replace(
      /[^0-9+]/g,
      ""
    );
  };

  // ======================================================
  // GET CURRENT GPS LOCATION
  // ======================================================

  const getCurrentLocationMessage =
    async () => {
      try {
        const permission =
          await Location.requestForegroundPermissionsAsync();

        if (
          permission.status !==
          "granted"
        ) {
          Alert.alert(
            "Location Permission Needed",
            "Please allow location access to send your emergency coordinates."
          );

          return null;
        }

        const currentLocation =
          await Location.getCurrentPositionAsync(
            {
              accuracy:
                Location.Accuracy
                  .Balanced,
            }
          );

        const latitude =
          currentLocation.coords
            .latitude;

        const longitude =
          currentLocation.coords
            .longitude;

        setLocationText(
          `Coordinates ready: ${latitude.toFixed(
            5
          )}, ${longitude.toFixed(
            5
          )}`
        );

        return `CRISISREADY EMERGENCY SOS

I need immediate assistance.

My current location coordinates are:

Latitude: ${latitude.toFixed(6)}
Longitude: ${longitude.toFixed(6)}

Please send help to my location.`;
      } catch (error) {
        console.log(
          "Location error:",
          error
        );

        Alert.alert(
          "Location Error",
          "Unable to get your current GPS location."
        );

        return null;
      }
    };

  // ======================================================
  // SEND LOCATION SMS TO ONE SAVED CONTACT
  // ======================================================

  const sendSMSLocation = async (
    contact: EmergencyContact
  ) => {
    try {
      if (
        !contact.phone.trim()
      ) {
        Alert.alert(
          "Missing Number",
          "This emergency contact does not have a phone number."
        );

        return;
      }

      const message =
        await getCurrentLocationMessage();

      if (!message) {
        return;
      }

      const isAvailable =
        await SMS.isAvailableAsync();

      if (!isAvailable) {
        Alert.alert(
          "SMS Not Available",
          "SMS messaging is not available on this device."
        );

        return;
      }

      const phoneNumber =
        cleanPhoneNumber(
          contact.phone
        );

      await SMS.sendSMSAsync(
        [phoneNumber],
        message
      );
    } catch (error) {
      console.log(
        "SMS error:",
        error
      );

      Alert.alert(
        "SMS Error",
        "Unable to open the text messaging app."
      );
    }
  };

  // ======================================================
  // START ADD / EDIT
  // ======================================================

  const startEditContact = (
    key: ContactKey
  ) => {
    const contact =
      contacts[key];

    setEditingContact(key);

    setEditName(
      contact.name
    );

    setEditPhone(
      contact.phone
    );
  };

  // ======================================================
  // CANCEL EDIT
  // ======================================================

  const cancelEditContact =
    () => {
      setEditingContact(
        null
      );

      setEditName("");

      setEditPhone("");
    };

  // ======================================================
  // SAVE CONTACT
  // ======================================================

  const handleSaveContact =
    async () => {
      if (
        !editingContact
      ) {
        return;
      }

      if (
        !currentUserId
      ) {
        Alert.alert(
          "Error",
          "No logged-in user was found."
        );

        return;
      }

      if (
        !editName.trim()
      ) {
        Alert.alert(
          "Name Required",
          "Please enter the emergency contact's name."
        );

        return;
      }

      if (
        !editPhone.trim()
      ) {
        Alert.alert(
          "Phone Required",
          "Please enter the emergency contact's phone number."
        );

        return;
      }

      const updatedContacts: EmergencyContacts =
        {
          ...contacts,

          [editingContact]: {
            name: editName.trim(),
            phone:
              editPhone.trim(),
          },
        };

      try {
        await saveEmergencyContacts(
          currentUserId,
          updatedContacts
        );

        setContacts(
          updatedContacts
        );

        cancelEditContact();

        Alert.alert(
          "Contact Saved",
          "Emergency contact saved successfully."
        );
      } catch (error) {
        console.log(
          "Save contact error:",
          error
        );

        Alert.alert(
          "Save Failed",
          "Could not save the emergency contact."
        );
      }
    };

  // ======================================================
  // DELETE CONTACT
  // ======================================================

  const handleDeleteContact = (
    key: ContactKey
  ) => {
    if (
      !currentUserId
    ) {
      return;
    }

    const contact =
      contacts[key];

    Alert.alert(
      "Delete Contact",
      `Are you sure you want to delete ${
        contact.name ||
        "this emergency contact"
      }?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Delete",
          style: "destructive",

          onPress: async () => {
            try {
              const updatedContacts =
                await deleteEmergencyContact(
                  currentUserId,
                  key
                );

              setContacts(
                updatedContacts
              );

              if (
                editingContact ===
                key
              ) {
                cancelEditContact();
              }
            } catch (error) {
              console.log(
                "Delete contact error:",
                error
              );

              Alert.alert(
                "Delete Failed",
                "Could not delete the emergency contact."
              );
            }
          },
        },
      ]
    );
  };

  // ======================================================
  // CONTACT CARD
  // ======================================================

  const renderEmergencyContact =
    (
      key: ContactKey,
      number: number
    ) => {
      const contact =
        contacts[key];

      const isEditing =
        editingContact === key;

      // ==============================================
      // EDIT MODE
      // ==============================================

      if (isEditing) {
        return (
          <View
            style={
              styles.savedContactCard
            }
          >
            <Text
              style={
                styles.contactLabel
              }
            >
              Emergency Contact{" "}
              {number}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Contact name"
              placeholderTextColor="#9CA3AF"
              value={editName}
              onChangeText={
                setEditName
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Phone number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              value={editPhone}
              onChangeText={
                setEditPhone
              }
            />

            <View
              style={
                styles.editButtonsRow
              }
            >
              <TouchableOpacity
                style={
                  styles.saveButton
                }
                onPress={
                  handleSaveContact
                }
              >
                <Ionicons
                  name="save-outline"
                  size={17}
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.saveButtonText
                  }
                >
                  Save
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.cancelButton
                }
                onPress={
                  cancelEditContact
                }
              >
                <Text
                  style={
                    styles.cancelButtonText
                  }
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }

      // ==============================================
      // EMPTY CONTACT
      // ==============================================

      if (
        !contact.name &&
        !contact.phone
      ) {
        return (
          <View
            style={
              styles.savedContactCard
            }
          >
            <Text
              style={
                styles.contactLabel
              }
            >
              Emergency Contact{" "}
              {number}
            </Text>

            <Text
              style={
                styles.emptyContactText
              }
            >
              No contact added
            </Text>

            <TouchableOpacity
              style={
                styles.addContactButton
              }
              onPress={() =>
                startEditContact(
                  key
                )
              }
            >
              <Ionicons
                name="add-circle-outline"
                size={18}
                color="#1D4ED8"
              />

              <Text
                style={
                  styles.addContactText
                }
              >
                Add Contact
              </Text>
            </TouchableOpacity>
          </View>
        );
      }

      // ==============================================
      // SAVED CONTACT
      // ==============================================

      return (
        <View
          style={
            styles.savedContactCard
          }
        >
          <Text
            style={
              styles.contactLabel
            }
          >
            Emergency Contact{" "}
            {number}
          </Text>

          <Text
            style={
              styles.savedContactName
            }
          >
            {contact.name}
          </Text>

          <Text
            style={
              styles.savedContactPhone
            }
          >
            {contact.phone}
          </Text>

          {/* TEXT THIS SPECIFIC CONTACT */}

          <TouchableOpacity
            style={
              styles.textContactButton
            }
            onPress={() =>
              sendSMSLocation(
                contact
              )
            }
          >
            <Ionicons
              name="chatbubble-outline"
              size={18}
              color="#FFFFFF"
            />

            <Text
              style={
                styles.textContactButtonText
              }
            >
              Text{" "}
              {contact.name}
            </Text>
          </TouchableOpacity>

          {/* EDIT / DELETE */}

          <View
            style={
              styles.contactActions
            }
          >
            <TouchableOpacity
              style={
                styles.editButton
              }
              onPress={() =>
                startEditContact(
                  key
                )
              }
            >
              <Ionicons
                name="create-outline"
                size={16}
                color="#1D4ED8"
              />

              <Text
                style={
                  styles.editButtonText
                }
              >
                Edit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.deleteButton
              }
              onPress={() =>
                handleDeleteContact(
                  key
                )
              }
            >
              <Ionicons
                name="trash-outline"
                size={16}
                color="#DC2626"
              />

              <Text
                style={
                  styles.deleteButtonText
                }
              >
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    };

  // ======================================================
  // SCREEN
  // ======================================================

  return (
    <SafeAreaView
      style={
        styles.safeArea
      }
    >
      <ScrollView
        style={
          styles.container
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* HEADER */}

        <View
          style={styles.header}
        >
          <TouchableOpacity
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={
                styles.backIcon
              }
            >
              ‹
            </Text>
          </TouchableOpacity>

          <Text
            style={
              styles.headerTitle
            }
          >
            Emergency Mode
          </Text>

          <View
            style={{
              width: 30,
            }}
          />
        </View>

        {/* HERO */}

        <View
          style={
            styles.heroCard
          }
        >
          <View
            style={
              styles.heroIconBox
            }
          >
            <Ionicons
              name="warning-outline"
              size={46}
              color="#FFFFFF"
            />
          </View>

          <Text
            style={
              styles.heroTitle
            }
          >
            Disaster Panic Button
          </Text>

          <Text
            style={
              styles.heroText
            }
          >
            Quickly call emergency
            services, text your GPS
            coordinates to a saved
            contact and follow
            immediate safety steps.
          </Text>

          <TouchableOpacity
            style={
              styles.mainSosButton
            }
            onPress={() =>
              callNumber("1122")
            }
          >
            <Ionicons
              name="call-outline"
              size={24}
              color="#FFFFFF"
            />

            <Text
              style={
                styles.mainSosText
              }
            >
              CALL RESCUE 1122
            </Text>
          </TouchableOpacity>
        </View>

        {/* USER EMERGENCY CONTACTS */}

        <View
          style={
            styles.smsCard
          }
        >
          <Text
            style={
              styles.smsTitle
            }
          >
            SMS Emergency Contacts
          </Text>

          <Text
            style={
              styles.smsSubtitle
            }
          >
            Save up to 3 emergency
            contacts. These contacts
            are stored separately for
            your account.
          </Text>

          {loadingContacts ? (
            <Text
              style={
                styles.loadingText
              }
            >
              Loading saved
              contacts...
            </Text>
          ) : (
            <>
              {renderEmergencyContact(
                "contact1",
                1
              )}

              {renderEmergencyContact(
                "contact2",
                2
              )}

              {renderEmergencyContact(
                "contact3",
                3
              )}
            </>
          )}
        </View>

        {/* GPS STATUS */}

        {locationText ? (
          <View
            style={
              styles.locationResult
            }
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={22}
              color="#16A34A"
            />

            <Text
              style={
                styles.locationResultText
              }
            >
              {locationText}
            </Text>
          </View>
        ) : null}

        {/* EMERGENCY CALLS */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Emergency Calls
        </Text>

        {emergencyContacts.map(
          (contact) => (
            <TouchableOpacity
              key={
                contact.number
              }
              style={
                styles.contactCard
              }
              onPress={() =>
                callNumber(
                  contact.number
                )
              }
            >
              <View
                style={[
                  styles.contactIconBox,
                  {
                    backgroundColor:
                      contact.bgColor,
                  },
                ]}
              >
                <Ionicons
                  name={
                    contact.icon as any
                  }
                  size={26}
                  color={
                    contact.color
                  }
                />
              </View>

              <View
                style={
                  styles.contactTextBox
                }
              >
                <Text
                  style={
                    styles.contactTitle
                  }
                >
                  {
                    contact.title
                  }
                </Text>

                <Text
                  style={
                    styles.contactSubtitle
                  }
                >
                  {
                    contact.subtitle
                  }
                </Text>
              </View>

              <View
                style={
                  styles.callBadge
                }
              >
                <Text
                  style={
                    styles.callBadgeText
                  }
                >
                  {
                    contact.number
                  }
                </Text>
              </View>
            </TouchableOpacity>
          )
        )}

        {/* SAFETY STEPS */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Immediate Safety Steps
        </Text>

        {quickSafetySteps.map(
          (item) => (
            <View
              key={item.title}
              style={
                styles.safetyCard
              }
            >
              <View
                style={
                  styles.safetyTopRow
                }
              >
                <View
                  style={[
                    styles.safetyIconBox,
                    {
                      backgroundColor:
                        item.bgColor,
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      item.icon as any
                    }
                    size={24}
                    color={
                      item.color
                    }
                  />
                </View>

                <Text
                  style={
                    styles.safetyTitle
                  }
                >
                  {item.title}
                </Text>
              </View>

              {item.steps.map(
                (
                  step,
                  index
                ) => (
                  <Text
                    key={
                      index
                    }
                    style={
                      styles.safetyStep
                    }
                  >
                    • {step}
                  </Text>
                )
              )}
            </View>
          )
        )}

        {/* OTHER PAGES */}

        <View
          style={
            styles.bottomButtonsRow
          }
        >
          <TouchableOpacity
            style={
              styles.secondaryButton
            }
            onPress={() =>
              router.push(
                "/(tabs)/explore" as any
              )
            }
          >
            <Text
              style={
                styles.secondaryButtonText
              }
            >
              Open Resources
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              styles.secondaryButton
            }
            onPress={() =>
              router.push(
                "/(tabs)/alerts" as any
              )
            }
          >
            <Text
              style={
                styles.secondaryButtonText
              }
            >
              Open Alerts
            </Text>
          </TouchableOpacity>
        </View>

        {/* INFO */}

        <View
          style={
            styles.infoCard
          }
        >
          <Text
            style={
              styles.infoTitle
            }
          >
            SMS Emergency Location
          </Text>

          <Text
            style={
              styles.infoText
            }
          >
            Press Text Contact to
            obtain your current GPS
            coordinates and open your
            phone's normal SMS app
            with that contact and
            emergency message
            prepared.
          </Text>
        </View>

        <View
          style={{
            height: 40,
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ======================================================
// STYLES
// ======================================================

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor:
        "#F8FAFC",
    },

    container: {
      flex: 1,
      paddingHorizontal: 22,
    },

    header: {
      marginTop: 10,
      marginBottom: 18,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    backIcon: {
      fontSize: 36,
      color: "#111827",
      fontWeight: "300",
    },

    headerTitle: {
      fontSize: 18,
      fontWeight: "900",
      color: "#111827",
    },

    heroCard: {
      backgroundColor:
        "#DC2626",
      borderRadius: 24,
      padding: 24,
      alignItems: "center",
      marginBottom: 16,
    },

    heroIconBox: {
      width: 84,
      height: 84,
      borderRadius: 30,
      backgroundColor:
        "rgba(255,255,255,0.18)",
      alignItems: "center",
      justifyContent:
        "center",
      marginBottom: 16,
    },

    heroTitle: {
      fontSize: 26,
      fontWeight: "900",
      color: "#FFFFFF",
      textAlign: "center",
      marginBottom: 10,
    },

    heroText: {
      fontSize: 14,
      lineHeight: 21,
      color: "#FEE2E2",
      textAlign: "center",
      fontWeight: "600",
      marginBottom: 20,
    },

    mainSosButton: {
      backgroundColor:
        "#991B1B",
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 22,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      borderWidth: 1,
      borderColor:
        "#FCA5A5",
    },

    mainSosText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "900",
    },

    // ====================================================
    // SMS CONTACT AREA
    // ====================================================

    smsCard: {
      backgroundColor:
        "#FFFFFF",
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor:
        "#BFDBFE",
      marginBottom: 14,
    },

    smsTitle: {
      fontSize: 18,
      fontWeight: "900",
      color: "#1D4ED8",
      marginBottom: 6,
    },

    smsSubtitle: {
      fontSize: 13,
      lineHeight: 19,
      color: "#4B5563",
      fontWeight: "600",
      marginBottom: 14,
    },

    loadingText: {
      fontSize: 13,
      color: "#6B7280",
      fontWeight: "700",
      paddingVertical: 10,
    },

    savedContactCard: {
      backgroundColor:
        "#F8FAFC",
      borderRadius: 15,
      padding: 14,
      borderWidth: 1,
      borderColor:
        "#E5E7EB",
      marginBottom: 12,
    },

    contactLabel: {
      fontSize: 11,
      fontWeight: "900",
      color: "#64748B",
      textTransform:
        "uppercase",
      marginBottom: 6,
    },

    savedContactName: {
      fontSize: 17,
      fontWeight: "900",
      color: "#111827",
    },

    savedContactPhone: {
      fontSize: 13,
      color: "#6B7280",
      fontWeight: "700",
      marginTop: 3,
      marginBottom: 12,
    },

    emptyContactText: {
      fontSize: 13,
      color: "#94A3B8",
      marginBottom: 10,
    },

    input: {
      backgroundColor:
        "#FFFFFF",
      borderWidth: 1,
      borderColor:
        "#E5E7EB",
      borderRadius: 12,
      paddingHorizontal: 13,
      paddingVertical: 11,
      fontSize: 14,
      color: "#111827",
      fontWeight: "600",
      marginBottom: 10,
    },

    addContactButton: {
      backgroundColor:
        "#EFF6FF",
      borderRadius: 12,
      paddingVertical: 11,
      alignItems: "center",
      justifyContent:
        "center",
      flexDirection: "row",
      gap: 7,
      borderWidth: 1,
      borderColor:
        "#BFDBFE",
    },

    addContactText: {
      color: "#1D4ED8",
      fontSize: 13,
      fontWeight: "900",
    },

    textContactButton: {
      backgroundColor:
        "#2563EB",
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: "center",
      justifyContent:
        "center",
      flexDirection: "row",
      gap: 8,
      marginBottom: 9,
    },

    textContactButtonText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "900",
    },

    contactActions: {
      flexDirection: "row",
      gap: 8,
    },

    editButton: {
      flex: 1,
      backgroundColor:
        "#EFF6FF",
      borderRadius: 10,
      paddingVertical: 10,
      alignItems: "center",
      justifyContent:
        "center",
      flexDirection: "row",
      gap: 5,
      borderWidth: 1,
      borderColor:
        "#BFDBFE",
    },

    editButtonText: {
      color: "#1D4ED8",
      fontSize: 12,
      fontWeight: "900",
    },

    deleteButton: {
      flex: 1,
      backgroundColor:
        "#FEF2F2",
      borderRadius: 10,
      paddingVertical: 10,
      alignItems: "center",
      justifyContent:
        "center",
      flexDirection: "row",
      gap: 5,
      borderWidth: 1,
      borderColor:
        "#FECACA",
    },

    deleteButtonText: {
      color: "#DC2626",
      fontSize: 12,
      fontWeight: "900",
    },

    editButtonsRow: {
      flexDirection: "row",
      gap: 8,
    },

    saveButton: {
      flex: 1,
      backgroundColor:
        "#2563EB",
      borderRadius: 10,
      paddingVertical: 11,
      alignItems: "center",
      justifyContent:
        "center",
      flexDirection: "row",
      gap: 6,
    },

    saveButtonText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "900",
    },

    cancelButton: {
      flex: 1,
      backgroundColor:
        "#F3F4F6",
      borderRadius: 10,
      paddingVertical: 11,
      alignItems: "center",
      justifyContent:
        "center",
    },

    cancelButtonText: {
      color: "#374151",
      fontSize: 13,
      fontWeight: "900",
    },

    // ====================================================
    // LOCATION
    // ====================================================

    locationResult: {
      backgroundColor:
        "#F0FDF4",
      borderRadius: 14,
      borderWidth: 1,
      borderColor:
        "#BBF7D0",
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },

    locationResultText: {
      flex: 1,
      marginLeft: 8,
      color: "#166534",
      fontSize: 13,
      fontWeight: "700",
    },

    sectionTitle: {
      fontSize: 17,
      fontWeight: "900",
      color: "#111827",
      marginBottom: 12,
      marginTop: 6,
    },

    // ====================================================
    // OFFICIAL EMERGENCY CONTACTS
    // ====================================================

    contactCard: {
      backgroundColor:
        "#FFFFFF",
      borderRadius: 18,
      padding: 14,
      borderWidth: 1,
      borderColor:
        "#E5E7EB",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },

    contactIconBox: {
      width: 52,
      height: 52,
      borderRadius: 16,
      alignItems: "center",
      justifyContent:
        "center",
      marginRight: 12,
    },

    contactTextBox: {
      flex: 1,
    },

    contactTitle: {
      fontSize: 15,
      fontWeight: "900",
      color: "#111827",
      marginBottom: 3,
    },

    contactSubtitle: {
      fontSize: 12,
      lineHeight: 17,
      color: "#6B7280",
      fontWeight: "600",
    },

    callBadge: {
      backgroundColor:
        "#F3F4F6",
      paddingVertical: 7,
      paddingHorizontal: 10,
      borderRadius: 999,
    },

    callBadgeText: {
      color: "#111827",
      fontSize: 13,
      fontWeight: "900",
    },

    // ====================================================
    // SAFETY
    // ====================================================

    safetyCard: {
      backgroundColor:
        "#FFFFFF",
      borderRadius: 18,
      padding: 15,
      borderWidth: 1,
      borderColor:
        "#E5E7EB",
      marginBottom: 12,
    },

    safetyTopRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },

    safetyIconBox: {
      width: 42,
      height: 42,
      borderRadius: 14,
      alignItems: "center",
      justifyContent:
        "center",
      marginRight: 10,
    },

    safetyTitle: {
      fontSize: 16,
      fontWeight: "900",
      color: "#111827",
    },

    safetyStep: {
      fontSize: 13,
      lineHeight: 20,
      color: "#374151",
      fontWeight: "700",
      marginBottom: 4,
    },

    // ====================================================
    // BOTTOM
    // ====================================================

    bottomButtonsRow: {
      flexDirection: "row",
      gap: 10,
      marginTop: 8,
      marginBottom: 14,
    },

    secondaryButton: {
      flex: 1,
      backgroundColor:
        "#EEF2FF",
      borderRadius: 14,
      paddingVertical: 13,
      alignItems: "center",
      borderWidth: 1,
      borderColor:
        "#C7D2FE",
    },

    secondaryButtonText: {
      color: "#3730A3",
      fontSize: 13,
      fontWeight: "900",
    },

    infoCard: {
      backgroundColor:
        "#EFF6FF",
      borderRadius: 16,
      padding: 15,
      borderWidth: 1,
      borderColor:
        "#BFDBFE",
    },

    infoTitle: {
      fontSize: 15,
      fontWeight: "900",
      color: "#1D4ED8",
      marginBottom: 6,
    },

    infoText: {
      fontSize: 13,
      lineHeight: 20,
      color: "#1E3A8A",
      fontWeight: "600",
    },
  });