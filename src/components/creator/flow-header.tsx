"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreatorFlowHeaderProps {
  stepIndex: number;
  onStepBack: () => void | Promise<void>;
  onAutoSaveDraft: () => void | Promise<void>;
}

export default function CreatorFlowHeader({ stepIndex, onStepBack, onAutoSaveDraft }: CreatorFlowHeaderProps) {
  const router = useRouter();
  const [isExitDialogOpen, setExitDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleBack = useCallback(() => {
    if (stepIndex > 0) {
      void onStepBack();
      return;
    }
    router.push("/browse");
  }, [onStepBack, router, stepIndex]);

  const handleExit = useCallback(() => {
    setExitDialogOpen(true);
  }, []);

  const handleConfirmExit = useCallback(async () => {
    try {
      setIsSaving(true);
      await onAutoSaveDraft();
    } finally {
      setIsSaving(false);
      setExitDialogOpen(false);
      router.push("/creator/drafts");
    }
  }, [onAutoSaveDraft, router]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-4">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-1 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <span aria-hidden>←</span>
            Back
          </button>
          <span className="text-sm font-semibold tracking-tight text-foreground">AIgent10X</span>
          <button
            type="button"
            onClick={handleExit}
            className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-1 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            Exit
          </button>
        </div>
      </header>

      <Dialog open={isExitDialogOpen} onOpenChange={setExitDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Leave and save draft?</DialogTitle>
            <DialogDescription>
              Your progress will be saved. You can continue later from your drafts.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-3">
            <DialogClose asChild>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="button"
              onClick={handleConfirmExit}
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? "Saving..." : "Save & Exit"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
