"use client";

import { useEffect, useState, useTransition, type Ref } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import type { LeadFlowSettingsDTO } from "@/lib/automations/leadFlowSettings";
import {
  saveLeadFlowSettingsAction,
  fetchLeadFlowSettingsAction,
  type LeadFlowSettingsFormInput,
} from "./actions/leadFlowSettingsActions";

interface LeadFlowSettingsPanelProps {
  agentSlug: string;
  initialSettings: LeadFlowSettingsDTO | null;
  onSettingsChange?: (settings: LeadFlowSettingsDTO | null) => void;
  statusSectionRef?: Ref<HTMLDivElement>;
  statusSwitchRef?: Ref<HTMLButtonElement>;
  highlightStatus?: boolean;
}

type LeadFlowSettingsClient = LeadFlowSettingsDTO;

type AlertState = {
  variant: "success" | "error";
  message: string;
};

export function LeadFlowSettingsPanel({
  agentSlug,
  initialSettings,
  onSettingsChange,
  statusSectionRef,
  statusSwitchRef,
  highlightStatus = false,
}: LeadFlowSettingsPanelProps) {
  const [settings, setSettings] = useState<LeadFlowSettingsClient | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [alertState, setAlertState] = useState<AlertState | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
      setLoadError(null);
      onSettingsChange?.(initialSettings);
    } else {
      setLoadError("Unable to load settings for this automation.");
      onSettingsChange?.(null);
    }
  }, [initialSettings, onSettingsChange]);

  if (loadError && !settings) {
    return (
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-lg">Settings unavailable</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>{loadError}</p>
          <Button
            variant="outline"
            onClick={handleRetry}
            disabled={isRefreshing}
          >
            {isRefreshing ? "Retrying..." : "Retry"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!settings) {
    return <SettingsSkeleton />;
  }

  const handleBooleanChange = (key: keyof LeadFlowSettingsClient, value: boolean) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleInputChange = (key: keyof LeadFlowSettingsClient, value: string | number | null) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleUndoDisable = () => {
    if (!settings?.isEnabled) {
      return;
    }
    handleBooleanChange("isEnabled", false);
    setAlertState({
      variant: "success",
      message: "Automation disabled. No further leads will be processed.",
    });
  };

  function handleRetry() {
    setIsRefreshing(true);
    fetchLeadFlowSettingsAction(agentSlug)
      .then((refreshed) => {
        setSettings(refreshed);
        setLoadError(null);
        setAlertState({ variant: "success", message: "Settings reloaded." });
        onSettingsChange?.(refreshed);
      })
      .catch((error) => {
        setLoadError(error instanceof Error ? error.message : "Unable to reload settings.");
      })
      .finally(() => setIsRefreshing(false));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!settings) return;

    setAlertState(null);
    const payload: LeadFlowSettingsFormInput = {
      agentSlug,
      isEnabled: settings.isEnabled,
      qualificationScoreThreshold: Number(settings.qualificationScoreThreshold),
      autoCloseBelowThreshold: settings.autoCloseBelowThreshold,
      defaultOwner: (settings.defaultOwner ?? "") || null,
      followUpDueInDays: Number(settings.followUpDueInDays),
    };

    startTransition(async () => {
      try {
        const updated = await saveLeadFlowSettingsAction(payload);
        setSettings(updated);
        onSettingsChange?.(updated);
        setAlertState({ variant: "success", message: "Settings saved" });
      } catch (error) {
        setAlertState({
          variant: "error",
          message: error instanceof Error ? error.message : "Unable to save settings.",
        });
      }
    });
  }

  return (
    <Card className="border border-border/70 shadow-lg">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl">Automation settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {alertState ? (
            <Alert variant={alertState.variant === "success" ? "success" : "error"}>
              <AlertDescription>{alertState.message}</AlertDescription>
            </Alert>
          ) : null}

          <section className="space-y-4">
            <div
              ref={statusSectionRef}
              className={cn(
                "flex items-start justify-between gap-4 rounded-2xl border border-transparent px-3 py-2 transition",
                highlightStatus &&
                  "border-primary/60 bg-primary/5 shadow-[0_0_0_1px_rgba(16,185,129,0.15)] animate-pulse",
              )}
            >
              <div>
                <Label className="text-base">Status</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle the Lead Flow Autopilot for all inbound leads matching this configuration.
                </p>
                {settings.isEnabled ? (
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <p>You can re-enable anytime. Previous runs remain unchanged.</p>
                    <button
                      type="button"
                      onClick={handleUndoDisable}
                      className="text-sm font-semibold text-primary underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                    >
                      Undo (disable automation)
                    </button>
                  </div>
                ) : null}
              </div>
              <Switch
                ref={statusSwitchRef}
                checked={settings.isEnabled}
                onClick={() => handleBooleanChange("isEnabled", !settings.isEnabled)}
                aria-label="Enable Lead Flow Autopilot"
              />
            </div>
          </section>

          <Separator />

          <section className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="qualificationScoreThreshold">Qualification score threshold</Label>
              <Input
                id="qualificationScoreThreshold"
                type="number"
                min={0}
                max={100}
                value={settings.qualificationScoreThreshold}
                onChange={(event) =>
                  handleInputChange("qualificationScoreThreshold", Number(event.target.value))
                }
              />
              <p className="text-xs text-muted-foreground">
                Leads meeting or exceeding this score are routed to the sales team.
              </p>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">Auto-close below threshold</Label>
              <div className="flex items-center justify-between rounded-lg border border-border/70 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Auto-close low-score leads</p>
                  <p className="text-xs text-muted-foreground">
                    Creates a follow-up task to auto-close or nurture leads below the threshold.
                  </p>
                </div>
                <Switch
                  checked={settings.autoCloseBelowThreshold}
                  onClick={() =>
                    handleBooleanChange(
                      "autoCloseBelowThreshold",
                      !settings.autoCloseBelowThreshold,
                    )
                  }
                  aria-label="Auto-close below threshold"
                />
              </div>
            </div>
          </section>

          <Separator />

          <section className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="defaultOwner">Default assignee</Label>
              <Input
                id="defaultOwner"
                placeholder="e.g. john@company.com"
                value={settings.defaultOwner ?? ""}
                onChange={(event) =>
                  handleInputChange(
                    "defaultOwner",
                    event.target.value.trim().length ? event.target.value : "",
                  )
                }
              />
              <p className="text-xs text-muted-foreground">
                Optional. If set, qualified leads will be assigned to this person. Leave blank to use your default routing rules.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="followUpDueInDays">Follow-up due in (days)</Label>
              <Input
                id="followUpDueInDays"
                type="number"
                min={1}
                max={30}
                value={settings.followUpDueInDays}
                onChange={(event) =>
                  handleInputChange("followUpDueInDays", Number(event.target.value))
                }
              />
              <p className="text-xs text-muted-foreground">
                Controls when HubSpot follow-up tasks are due after qualification.
              </p>
            </div>
          </section>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-muted-foreground">
            Last updated {new Date(settings.updatedAt).toLocaleString()}
          </div>
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={handleRetry}
              disabled={isPending || isRefreshing}
            >
              {isRefreshing ? "Refreshing..." : "Reload"}
            </Button>
            <Button type="submit" disabled={isPending || !settings}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

function SettingsSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <CardTitle className="h-6 w-40 rounded bg-muted" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
        <div className="h-32 rounded bg-muted" />
      </CardContent>
      <CardFooter>
        <div className="h-10 w-full rounded bg-muted" />
      </CardFooter>
    </Card>
  );
}
