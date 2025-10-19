"use client";

import { useEffect, useMemo, useState } from "react";

type PricingType = "free" | "one-time" | "subscription";

type BasicsState = {
  name: string;
  tagline: string;
  description: string;
  category: string;
  logoFile?: File | null;
};

type PricingState = {
  pricingType: PricingType | "";
  amount: string;
  trialDays: string;
  refundPolicyAccepted: boolean;
};

type TechState = {
  configJson: string;
  endpointUrl: string;
  scopes: string;
};

const initialBasics: BasicsState = {
  name: "",
  tagline: "",
  description: "",
  category: "",
  logoFile: null,
};

const initialPricing: PricingState = {
  pricingType: "",
  amount: "",
  trialDays: "14",
  refundPolicyAccepted: false,
};

const initialTech: TechState = {
  configJson: '{\n  "apiKey": "YOUR_KEY",\n  "environment": "production"\n}',
  endpointUrl: "https://",
  scopes: "analytics:read, users:write",
};

const steps = [
  { key: "basics", label: "Basics" },
  { key: "pricing", label: "Pricing & Trial" },
  { key: "tech", label: "Tech" },
] as const;

type StepKey = typeof steps[number]["key"];

type ValidationErrors = Partial<Record<string, string>>;

export default function NewAgentPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [basics, setBasics] = useState<BasicsState>(initialBasics);
  const [pricing, setPricing] = useState<PricingState>(initialPricing);
  const [tech, setTech] = useState<TechState>(initialTech);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const currentStep = steps[stepIndex];

  const validateStep = (key: StepKey): boolean => {
    const nextErrors: ValidationErrors = {};

    if (key === "basics") {
      if (!basics.name.trim()) {
        nextErrors.name = "Name is required.";
      }
      if (!basics.tagline.trim()) {
        nextErrors.tagline = "One-liner is required.";
      } else if (basics.tagline.length > 80) {
        nextErrors.tagline = "Keep the one-liner under 80 characters.";
      }
      if (!basics.category.trim()) {
        nextErrors.category = "Select a category.";
      }
      if (!basics.description.trim()) {
        nextErrors.description = "Add a longer description.";
      }
    }

    if (key === "pricing") {
      if (!pricing.pricingType) {
        nextErrors.pricingType = "Choose a pricing model.";
      }
      if (pricing.pricingType !== "free") {
        const value = Number(pricing.amount);
        if (!pricing.amount.trim() || Number.isNaN(value) || value <= 0) {
          nextErrors.amount = "Enter a positive price.";
        }
      }
      if (pricing.trialDays.trim()) {
        const days = Number(pricing.trialDays);
        if (Number.isNaN(days) || days < 0 || !Number.isInteger(days)) {
          nextErrors.trialDays = "Trial days must be a whole number.";
        }
      }
      if (!pricing.refundPolicyAccepted) {
        nextErrors.refundPolicyAccepted = "Acknowledge the refund policy.";
      }
    }

    if (key === "tech") {
      try {
        JSON.parse(tech.configJson || "{}");
      } catch (error) {
        nextErrors.configJson = "Provide valid JSON.";
      }
      try {
        const url = new URL(tech.endpointUrl);
        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch (error) {
        nextErrors.endpointUrl = "Enter a valid URL.";
      }
      if (!tech.scopes.trim()) {
        nextErrors.scopes = "List at least one scope.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(currentStep.key)) return;
    if (stepIndex < steps.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const goBack = () => {
    setErrors({});
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    const allValid = steps.every((step) => validateStep(step.key));
    if (!allValid) return;

    // Pretend we submit to an API here.
    console.info("Submitting draft", {
      basics,
      pricing,
      tech,
    });

    setToastMessage("Submitted for review (mock)");
    setBasics(initialBasics);
    setPricing(initialPricing);
    setTech(initialTech);
    setStepIndex(0);
    setErrors({});
  };

  const categoryOptions = useMemo(
    () => [
      "Marketing",
      "Support",
      "Finance",
      "Operations",
      "Content",
      "Sales",
      "Product",
      "HR",
      "Security",
    ],
    [],
  );

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 pb-28 pt-12 md:px-8 md:pb-16">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Creator Studio
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Submit a new agent
        </h1>
        <p className="text-sm text-muted-foreground">
          Fill in the details below. Our team will review the submission within one business day.
        </p>
      </header>

      <nav className="mt-8 flex flex-wrap gap-2 rounded-2xl border border-border bg-muted/40 p-2 text-sm md:gap-3">
        {steps.map((step, index) => {
          const isActive = index === stepIndex;
          const isCompleted = index < stepIndex;
          return (
            <button
              key={step.key}
              type="button"
              onClick={() => setStepIndex(index)}
              className={`${
                isActive
                  ? "bg-primary text-primary-foreground shadow"
                  : isCompleted
                    ? "border border-primary/30 bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
              } rounded-full px-4 py-2 transition`}
            >
              {index + 1}. {step.label}
            </button>
          );
        })}
      </nav>

      <form
        className="relative mt-8 flex-1 space-y-10"
        onSubmit={(event) => {
          event.preventDefault();
          goNext();
        }}
      >
        {currentStep.key === "basics" ? (
          <section className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground">Agent name</label>
              <input
                type="text"
                value={basics.name}
                onChange={(event) => setBasics((prev) => ({ ...prev, name: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder="Growth Coach Pro"
              />
              {errors.name ? <p className="mt-2 text-xs text-destructive">{errors.name}</p> : null}
            </div>

            <div>
              <div className="flex items-center justify-between text-sm">
                <label className="font-medium text-foreground">One-liner</label>
                <span className="text-xs text-muted-foreground">{basics.tagline.length}/80</span>
              </div>
              <input
                type="text"
                maxLength={80}
                value={basics.tagline}
                onChange={(event) => setBasics((prev) => ({ ...prev, tagline: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder="Optimizes your go-to-market strategy with live data."
              />
              {errors.tagline ? <p className="mt-2 text-xs text-destructive">{errors.tagline}</p> : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Long description (Markdown enabled)</label>
              <textarea
                rows={6}
                value={basics.description}
                onChange={(event) => setBasics((prev) => ({ ...prev, description: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder="## Overview\nExplain what problems you solve, integrations you support, and how teams deploy the agent."
              />
              {errors.description ? <p className="mt-2 text-xs text-destructive">{errors.description}</p> : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Category</label>
              <select
                value={basics.category}
                onChange={(event) => setBasics((prev) => ({ ...prev, category: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="">Select Category</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category ? <p className="mt-2 text-xs text-destructive">{errors.category}</p> : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Logo upload</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setBasics((prev) => ({ ...prev, logoFile: file }));
                }}
                className="mt-2 w-full rounded-xl border border-dashed border-border bg-muted/40 px-3 py-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary"
              />
              {basics.logoFile ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Selected file: {basics.logoFile.name}
                </p>
              ) : null}
            </div>
          </section>
        ) : null}

        {currentStep.key === "pricing" ? (
          <section className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground">Pricing model</label>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {["free", "one-time", "subscription"].map((option) => {
                  const value = option as PricingType;
                  const isSelected = pricing.pricingType === value;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setPricing((prev) => ({ ...prev, pricingType: value }))}
                      className={`${
                        isSelected
                          ? "border-2 border-primary bg-primary/10 text-primary"
                          : "border border-border text-muted-foreground hover:border-primary"
                      } rounded-2xl px-4 py-3 text-sm font-medium transition`}
                    >
                      {option === "one-time" ? "One-time" : option === "free" ? "Free" : "Subscription (monthly)"}
                    </button>
                  );
                })}
              </div>
              {errors.pricingType ? (
                <p className="mt-2 text-xs text-destructive">{errors.pricingType}</p>
              ) : null}
            </div>

            {pricing.pricingType !== "free" ? (
              <div>
                <label className="block text-sm font-medium text-foreground">
                  {pricing.pricingType === "one-time" ? "One-time price" : "Monthly price"}
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">USD</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={pricing.amount}
                    onChange={(event) => setPricing((prev) => ({ ...prev, amount: event.target.value }))}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    placeholder="49"
                  />
                </div>
                {errors.amount ? <p className="mt-2 text-xs text-destructive">{errors.amount}</p> : null}
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-medium text-foreground">Trial days</label>
              <input
                type="number"
                min="0"
                value={pricing.trialDays}
                onChange={(event) => setPricing((prev) => ({ ...prev, trialDays: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder="14"
              />
              {errors.trialDays ? <p className="mt-2 text-xs text-destructive">{errors.trialDays}</p> : null}
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 p-4 text-sm">
              <input
                type="checkbox"
                checked={pricing.refundPolicyAccepted}
                onChange={(event) =>
                  setPricing((prev) => ({ ...prev, refundPolicyAccepted: event.target.checked }))
                }
                className="mt-1 size-4 rounded border border-border text-primary focus:ring-primary"
              />
              <span>
                I confirm that this agent offers a 7-day refund policy with clear terms disclosed to buyers.
              </span>
            </label>
            {errors.refundPolicyAccepted ? (
              <p className="-mt-4 text-xs text-destructive">{errors.refundPolicyAccepted}</p>
            ) : null}
          </section>
        ) : null}

        {currentStep.key === "tech" ? (
          <section className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground">Configuration JSON</label>
              <textarea
                rows={8}
                value={tech.configJson}
                onChange={(event) => setTech((prev) => ({ ...prev, configJson: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 font-mono text-xs focus:border-primary focus:outline-none"
              />
              {errors.configJson ? <p className="mt-2 text-xs text-destructive">{errors.configJson}</p> : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Endpoint URL</label>
              <input
                type="url"
                value={tech.endpointUrl}
                onChange={(event) => setTech((prev) => ({ ...prev, endpointUrl: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder="https://api.your-agent.dev/ingest"
              />
              {errors.endpointUrl ? <p className="mt-2 text-xs text-destructive">{errors.endpointUrl}</p> : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Required scopes</label>
              <input
                type="text"
                value={tech.scopes}
                onChange={(event) => setTech((prev) => ({ ...prev, scopes: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder="analytics:read, customers:write"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Separate scopes with commas exactly as your integration expects them.
              </p>
              {errors.scopes ? <p className="mt-1 text-xs text-destructive">{errors.scopes}</p> : null}
            </div>
          </section>
        ) : null}

        <div className="hidden items-center justify-between gap-4 border-t border-border pt-6 md:flex">
          <button
            type="button"
            onClick={goBack}
            disabled={stepIndex === 0}
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="submit"
            className="rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90"
          >
            {stepIndex === steps.length - 1 ? "Submit for Review" : "Next"}
          </button>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
          <div className="flex items-center justify-between gap-4 text-sm">
            <button
              type="button"
              onClick={goBack}
              disabled={stepIndex === 0}
              className="rounded-lg border border-border px-3 py-2 font-medium text-muted-foreground transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground shadow transition hover:bg-primary/90"
            >
              {stepIndex === steps.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </form>

      {toastMessage ? (
        <div className="fixed bottom-20 left-1/2 z-50 w-[90%] max-w-xs -translate-x-1/2 rounded-xl border border-primary/30 bg-background px-4 py-3 text-sm text-foreground shadow-lg md:bottom-8">
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
}
