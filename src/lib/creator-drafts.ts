const STORAGE_PREFIX = "creator-draft";

interface StoredDraft {
  version: number;
  updatedAt: number;
  data: unknown;
}

function getStorageKey(userId: string) {
  return `${STORAGE_PREFIX}:${userId}`;
}

export async function saveDraft(userId: string, data: unknown): Promise<void> {
  if (typeof window === "undefined" || !userId) {
    return;
  }

  const payload: StoredDraft = {
    version: 1,
    updatedAt: Date.now(),
    data,
  };

  try {
    window.localStorage.setItem(getStorageKey(userId), JSON.stringify(payload));
  } catch (error) {
    console.warn("[creator-drafts] Failed to save draft", error);
  }
}

export async function loadDraft(userId: string): Promise<StoredDraft | null> {
  if (typeof window === "undefined" || !userId) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(getStorageKey(userId));
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as StoredDraft;
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return parsed;
  } catch (error) {
    console.warn("[creator-drafts] Failed to load draft", error);
    return null;
  }
}

export async function clearDraft(userId: string): Promise<void> {
  if (typeof window === "undefined" || !userId) {
    return;
  }

  try {
    window.localStorage.removeItem(getStorageKey(userId));
  } catch (error) {
    console.warn("[creator-drafts] Failed to clear draft", error);
  }
}
