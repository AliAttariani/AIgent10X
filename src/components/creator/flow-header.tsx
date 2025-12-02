"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { BRAND } from "@/config/brand";
import { saveDraft } from "@/lib/creator-drafts";

type SaveDraftFn = typeof saveDraft;

interface CreatorFlowHeaderProps {
  step: number;
  onPreviousStep?: () => void | Promise<void>;
  currentFormData: unknown;
  userId: string;
}

const persistDraft: SaveDraftFn = saveDraft ?? (async () => {});

export default function CreatorFlowHeader({
  step,
  onPreviousStep,
  currentFormData,
  userId,
}: CreatorFlowHeaderProps) {
  const router = useRouter();
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleBack = useCallback(() => {
    if (step > 1 && typeof onPreviousStep === "function") {
      void onPreviousStep();
      return;
    }

    router.push("/browse");
  }, [onPreviousStep, router, step]);

  const handleExit = useCallback(() => {
    setConfirmOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setConfirmOpen(false);
  }, []);

  const handleConfirm = useCallback(async () => {
    try {
      setIsSaving(true);
      await persistDraft(userId, currentFormData);
      setConfirmOpen(false);
      router.push("/creator/drafts");
    } finally {
      setIsSaving(false);
    }
  }, [currentFormData, router, userId]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b">
        <div className="mx-auto max-w-3xl md:max-w-4xl px-4 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex h-8 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted/50 hover:text-foreground"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              ←
            </span>
            <span>Back</span>
          </button>
          <span className="text-sm font-semibold tracking-tight text-foreground">{BRAND.NAME}</span>
          <button
            type="button"
            onClick={handleExit}
            className="inline-flex h-8 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted/50 hover:text-foreground"
          >
            Exit
          </button>
        </div>
      </header>

      {isConfirmOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-background p-6 shadow-lg">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">Leave and save draft?</h2>
              <p className="text-sm text-muted-foreground">
                Your progress will be saved. You can continue later from your drafts.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? "Saving..." : "Save & Exit"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
