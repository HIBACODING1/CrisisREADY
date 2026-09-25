import AsyncStorage from "@react-native-async-storage/async-storage";

export type EmergencyContact = {
  name: string;
  phone: string;
};

export type EmergencyContacts = {
  contact1: EmergencyContact;
  contact2: EmergencyContact;
  contact3: EmergencyContact;
};

type StoredEmergencyContacts = {
  [userId: string]: EmergencyContacts;
};

const CONTACTS_KEY =
  "crisisready_emergency_contacts";

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

export async function getEmergencyContacts(
  userId: string
): Promise<EmergencyContacts> {
  const stored =
    await AsyncStorage.getItem(
      CONTACTS_KEY
    );

  if (!stored) {
    return emptyContacts;
  }

  const allContacts: StoredEmergencyContacts =
    JSON.parse(stored);

  return (
    allContacts[userId] ||
    emptyContacts
  );
}

export async function saveEmergencyContacts(
  userId: string,
  contacts: EmergencyContacts
): Promise<void> {
  const stored =
    await AsyncStorage.getItem(
      CONTACTS_KEY
    );

  const allContacts: StoredEmergencyContacts =
    stored
      ? JSON.parse(stored)
      : {};

  allContacts[userId] =
    contacts;

  await AsyncStorage.setItem(
    CONTACTS_KEY,
    JSON.stringify(
      allContacts
    )
  );
}

export async function deleteEmergencyContact(
  userId: string,
  contactKey:
    | "contact1"
    | "contact2"
    | "contact3"
): Promise<EmergencyContacts> {
  const contacts =
    await getEmergencyContacts(
      userId
    );

  const updatedContacts = {
    ...contacts,

    [contactKey]: {
      name: "",
      phone: "",
    },
  };

  await saveEmergencyContacts(
    userId,
    updatedContacts
  );

  return updatedContacts;
}