import AsyncStorage from "@react-native-async-storage/async-storage";

export type LocalUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
};

const USERS_KEY = "crisisready_users";
const SESSION_KEY = "crisisready_current_user";

export async function getUsers(): Promise<LocalUser[]> {
  const storedUsers = await AsyncStorage.getItem(USERS_KEY);

  if (!storedUsers) {
    return [];
  }

  return JSON.parse(storedUsers);
}

export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<LocalUser> {
  const users = await getUsers();

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.email.toLowerCase() === normalizedEmail
  );

  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const newUser: LocalUser = {
    id: Date.now().toString(),
    name: name.trim(),
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [...users, newUser];

  await AsyncStorage.setItem(
    USERS_KEY,
    JSON.stringify(updatedUsers)
  );

  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify(newUser)
  );

  return newUser;
}

export async function loginUser(
  email: string,
  password: string
): Promise<LocalUser> {
  const users = await getUsers();

  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find(
    (savedUser) =>
      savedUser.email.toLowerCase() === normalizedEmail &&
      savedUser.password === password
  );

  if (!user) {
    throw new Error("Incorrect email or password.");
  }

  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify(user)
  );

  return user;
}

export async function getCurrentUser(): Promise<LocalUser | null> {
  const storedUser = await AsyncStorage.getItem(SESSION_KEY);

  if (!storedUser) {
    return null;
  }

  return JSON.parse(storedUser);
}

export async function logoutUser(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("No user is currently logged in.");
  }

  if (currentUser.password !== currentPassword) {
    throw new Error("Current password is incorrect.");
  }

  if (newPassword.length < 6) {
    throw new Error(
      "New password must contain at least 6 characters."
    );
  }

  const users = await getUsers();

  const updatedUsers = users.map((user) => {
    if (user.id === currentUser.id) {
      return {
        ...user,
        password: newPassword,
      };
    }

    return user;
  });

  const updatedCurrentUser = {
    ...currentUser,
    password: newPassword,
  };

  await AsyncStorage.setItem(
    USERS_KEY,
    JSON.stringify(updatedUsers)
  );

  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify(updatedCurrentUser)
  );
}
export async function updateUserName(
  newName: string
): Promise<LocalUser> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("No user is currently logged in.");
  }

  if (!newName.trim()) {
    throw new Error("Name cannot be empty.");
  }

  const users = await getUsers();

  const updatedUser: LocalUser = {
    ...currentUser,
    name: newName.trim(),
  };

  const updatedUsers = users.map((user) =>
    user.id === currentUser.id
      ? updatedUser
      : user
  );

  await AsyncStorage.setItem(
    USERS_KEY,
    JSON.stringify(updatedUsers)
  );

  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify(updatedUser)
  );

  return updatedUser;
} 