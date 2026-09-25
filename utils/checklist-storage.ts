import AsyncStorage from "@react-native-async-storage/async-storage";

const CHECKLIST_KEY = "crisisready_checklist_progress";

type StoredChecklistProgress = {
  [userId: string]: string[];
};

export async function getChecklistProgress(
  userId: string
): Promise<string[]> {
  const stored = await AsyncStorage.getItem(CHECKLIST_KEY);

  if (!stored) {
    return [];
  }

  const allProgress: StoredChecklistProgress =
    JSON.parse(stored);

  return allProgress[userId] || [];
}

export async function saveChecklistProgress(
  userId: string,
  completedTaskIds: string[]
): Promise<void> {
  const stored = await AsyncStorage.getItem(CHECKLIST_KEY);

  const allProgress: StoredChecklistProgress =
    stored ? JSON.parse(stored) : {};

  allProgress[userId] = completedTaskIds;

  await AsyncStorage.setItem(
    CHECKLIST_KEY,
    JSON.stringify(allProgress)
  );
}