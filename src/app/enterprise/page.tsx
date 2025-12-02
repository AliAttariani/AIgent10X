"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

const INITIAL_FORM = {
  name: "",
  company: "",
  email: "",
  message: "",
};

type FormState = typeof INITIAL_FORM;

type SubmitState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export default function EnterprisePage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const [isPending, startTransition] = useTransition();

  const handleChange = (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
      if (submitState.status !== "idle") {
        setSubmitState({ status: "idle" });
      }
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      try {
        const response = await fetch("/api/enterprise-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!response.ok) {
          throw new Error("Request failed");
        }

        setSubmitState({ status: "success", message: "Thanks for reaching out. We will contact you shortly." });
        setForm(INITIAL_FORM);
      } catch {
        setSubmitState({ status: "error", message: "Something went wrong. Please try again." });
      }
    });
  };

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 pb-24 pt-16 text-foreground">
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top,#1f2333_0%,#0b0c10_70%,transparent_100%)]" aria-hidden />
      <header className="max-w-3xl space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-300">Enterprise</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">PantherIQ for Teams</h1>
        <p className="text-lg text-zinc-400">
          Custom usage, SLAs, private models, and dedicated support. Built for security-conscious teams that need more than a swipe.
        </p>
      </header>

      <section className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_minmax(0,0.9fr)] lg:items-start">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-black/40 p-8 shadow-[0_20px_48px_rgba(0,0,0,0.45)] backdrop-blur"
        >
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium text-zinc-100">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                value={form.name}
                onChange={handleChange("name")}
                className="h-12 rounded-2xl border border-white/10 bg-black/60 px-4 text-sm text-zinc-100 shadow-inner outline-none transition focus:border-white/30 focus:ring-0"
                placeholder="Taylor Morgan"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="company" className="text-sm font-medium text-zinc-100">
                Company
              </label>
              <input
                id="company"
                name="company"
                required
                value={form.company}
                onChange={handleChange("company")}
                className="h-12 rounded-2xl border border-white/10 bg-black/60 px-4 text-sm text-zinc-100 shadow-inner outline-none transition focus:border-white/30 focus:ring-0"
                placeholder="Northwind Labs"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-zinc-100">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange("email")}
                className="h-12 rounded-2xl border border-white/10 bg-black/60 px-4 text-sm text-zinc-100 shadow-inner outline-none transition focus:border-white/30 focus:ring-0"
                placeholder="you@company.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-medium text-zinc-100">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange("message")}
                className="rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-zinc-100 shadow-inner outline-none transition focus:border-white/30 focus:ring-0"
                placeholder="Tell us about your use case, timelines, and goals."
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs text-zinc-500">We respond within one business day.</p>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-2xl bg-white px-6 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Sending…" : "Request a consult"}
            </button>
          </div>

          {submitState.status !== "idle" ? (
            <div
              className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
                submitState.status === "success"
                  ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                  : "border-red-400/30 bg-red-500/10 text-red-200"
              }`}
            >
              {submitState.message}
            </div>
          ) : null}
        </form>

        <aside className="space-y-6 rounded-3xl border border-white/10 bg-black/30 p-8 text-sm text-zinc-400 shadow-[0_20px_48px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-100">What to expect</h2>
            <p>
              A dedicated solutions architect will map your deployment, cover security requirements, and tailor pricing to your usage profile.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-100">Popular enterprise add-ons</h3>
            <ul className="space-y-2">
              <li>• Private model routing in an isolated tenant</li>
              <li>• SOC 2 aligned audit logging</li>
              <li>• 24/7 on-call with sub-two-hour response</li>
              <li>• Volume-based pricing and invoicing</li>
            </ul>
          </div>
          <div className="space-y-2 text-xs text-zinc-500">
            <p>Prefer email? Reach us at <Link href="mailto:enterprise@pantheriq.ai" className="text-zinc-200 underline-offset-2 hover:underline">enterprise@pantheriq.ai</Link>.</p>
            <p>Creators receive 90% of marketplace sales. Enterprise plans unlock private deployment controls.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
