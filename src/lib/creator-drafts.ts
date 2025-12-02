export async function saveDraft(userId: string, data: unknown) {
  try {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      `draft:${userId}`,
      JSON.stringify({
        data,
        ts: Date.now(),
      }),
    );
  } catch {
    // best-effort persistence; ignore storage failures
  }
}

export async function loadDraft(userId: string) {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    const value = window.localStorage.getItem(`draft:${userId}`);
    return value ? JSON.parse(value).data : null;
  } catch {
    return null;
  }
}
