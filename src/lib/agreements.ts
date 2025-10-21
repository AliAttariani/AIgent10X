export async function recordCreatorAgreementAcceptance(userId: string, version: string): Promise<void> {
  const timestamp = new Date().toISOString();

  // TODO: Replace with database persistence when storage is ready.
  console.info("[agreements] creator acceptance", {
    userId,
    version,
    timestamp,
  });
}
