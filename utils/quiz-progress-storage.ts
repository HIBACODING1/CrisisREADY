import AsyncStorage from "@react-native-async-storage/async-storage";

export type TierProgress = {
  easy: boolean;
  moderate: boolean;
  expert: boolean;
};

export type UserQuizProgress = {
  [disasterId: string]: TierProgress;
};

const PROGRESS_KEY = "crisisready_quiz_progress";

type StoredProgress = {
  [userId: string]: UserQuizProgress;
};

const emptyTierProgress: TierProgress = {
  easy: false,
  moderate: false,
  expert: false,
};

export async function getUserQuizProgress(
  userId: string
): Promise<UserQuizProgress> {
  const stored = await AsyncStorage.getItem(PROGRESS_KEY);

  if (!stored) {
    return {};
  }

  const allProgress: StoredProgress = JSON.parse(stored);

  return allProgress[userId] || {};
}

export async function getDisasterProgress(
  userId: string,
  disasterId: string
): Promise<TierProgress> {
  const userProgress = await getUserQuizProgress(userId);

  return (
    userProgress[disasterId] || {
      ...emptyTierProgress,
    }
  );
}

export async function saveTierCompletion(
  userId: string,
  disasterId: string,
  tierId: "easy" | "moderate" | "expert"
): Promise<void> {
  const stored = await AsyncStorage.getItem(PROGRESS_KEY);

  const allProgress: StoredProgress = stored
    ? JSON.parse(stored)
    : {};

  const userProgress =
    allProgress[userId] || {};

  const disasterProgress =
    userProgress[disasterId] || {
      ...emptyTierProgress,
    };

  const updatedDisasterProgress: TierProgress = {
    ...disasterProgress,
    [tierId]: true,
  };

  allProgress[userId] = {
    ...userProgress,
    [disasterId]: updatedDisasterProgress,
  };

  await AsyncStorage.setItem(
    PROGRESS_KEY,
    JSON.stringify(allProgress)
  );
}

export function hasEarnedBadge(
  progress: TierProgress
): boolean {
  return (
    progress.easy &&
    progress.moderate &&
    progress.expert
  );
}

export function getCurrentLevel(
  progress: TierProgress
): string {
  if (
    progress.easy &&
    progress.moderate &&
    progress.expert
  ) {
    return "Badge Earned";
  }

  if (
    progress.easy &&
    progress.moderate
  ) {
    return "Expert Level";
  }

  if (progress.easy) {
    return "Moderate Level";
  }

  return "Easy Level";
}