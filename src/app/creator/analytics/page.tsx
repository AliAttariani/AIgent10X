import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_USER } from "@/config/mock-user";
import { Lock } from "lucide-react";

const isProPlan = MOCK_USER.plan === "pro";

const summaryMetrics = [
  { label: "Total Impressions", value: "89,120", delta: "+18% vs last week" },
  { label: "Profile Visits", value: "12,486", delta: "+9% vs last week" },
  { label: "Conversions", value: "642", delta: "+4% vs last week" },
];

const topAgents = [
  { name: "Revenue Radar", impressions: "32,440", conversions: "268", ranking: "#3" },
  { name: "Support Scribe", impressions: "21,098", conversions: "184", ranking: "#6" },
  { name: "Growth Coach Pro", impressions: "17,014", conversions: "126", ranking: "#11" },
];

const trafficBreakdown = [
  { source: "Marketplace search", share: "54%" },
  { source: "Featured collections", share: "27%" },
  { source: "Referral links", share: "12%" },
  { source: "Direct launch", share: "7%" },
];

export default function CreatorAnalyticsPage() {
  if (!isProPlan) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col items-center justify-center gap-6 px-6 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-muted">
          <Lock className="size-7 text-muted-foreground" aria-hidden="true" />
        </span>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground">Analytics is a Pro feature</h1>
          <p className="text-sm text-muted-foreground">
            Upgrade to Pro to access performance insights, usage metrics, and ranking boosts.
          </p>
        </div>
        <Button asChild size="lg" className="px-6">
          <Link href="/pricing">Upgrade to Pro</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-4 pb-16 pt-10">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Creator Studio</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Analytics dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Monitor your agent visibility, conversions, and top-performing listings at a glance.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summaryMetrics.map((metric) => (
          <Card key={metric.label} className="shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-3xl">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-emerald-600">{metric.delta}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Top performing agents</CardTitle>
            <CardDescription>High-performing listings ranked by conversions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topAgents.map((agent) => (
                <div key={agent.name} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{agent.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {agent.impressions} impressions · {agent.conversions} conversions
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {agent.ranking}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Traffic sources</CardTitle>
            <CardDescription>Where customers discovered your agents this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {trafficBreakdown.map((entry) => (
                <li key={entry.source} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{entry.source}</span>
                  <span className="font-medium text-foreground">{entry.share}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Daily conversions (last 7 days)</CardTitle>
          <CardDescription>Mocked chart data displayed in tabular format</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4 text-sm">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
              <div key={day} className="space-y-2 rounded-xl border border-border bg-muted/40 p-3 text-center">
                <p className="text-xs text-muted-foreground">{day}</p>
                <p className="text-lg font-semibold text-foreground">{[78, 85, 92, 101, 96, 88, 102][index]}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
