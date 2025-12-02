import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_USER } from "@/config/mock-user";

type MetricsPoint = {
  label: string;
  value: number;
};

type MetricsPageProps = {
  params: {
    id: string;
  };
};

const requestSeries: MetricsPoint[] = [
  { label: "Mon", value: 2850 },
  { label: "Tue", value: 3120 },
  { label: "Wed", value: 2980 },
  { label: "Thu", value: 3340 },
  { label: "Fri", value: 3710 },
  { label: "Sat", value: 3485 },
  { label: "Sun", value: 3620 },
];

const errorRateSeries: MetricsPoint[] = [
  { label: "Mon", value: 0.42 },
  { label: "Tue", value: 0.58 },
  { label: "Wed", value: 0.37 },
  { label: "Thu", value: 0.49 },
  { label: "Fri", value: 0.63 },
  { label: "Sat", value: 0.55 },
  { label: "Sun", value: 0.47 },
];

const latencyBuckets: MetricsPoint[] = [
  { label: "<100ms", value: 38 },
  { label: "100-200ms", value: 42 },
  { label: "200-300ms", value: 28 },
  { label: "300-400ms", value: 18 },
  { label: "400-500ms", value: 9 },
  { label: ">500ms", value: 4 },
];

function formatAgentLabel(raw: string) {
  const clean = decodeURIComponent(raw);
  return clean
    .split(/[-_\s]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "Agent";
}

function LineChart({ data, gradientId, color }: { data: MetricsPoint[]; gradientId: string; color: string }) {
  if (data.length === 0) {
    return <div className="h-36 w-full rounded-2xl bg-black/30" />;
  }

  const width = 320;
  const height = 140;
  const max = Math.max(...data.map((point) => point.value));
  const min = Math.min(...data.map((point) => point.value));
  const range = max - min || 1;

  const points = data
    .map((point, index) => {
      const x = (index / (data.length - 1 || 1)) * width;
      const y = height - ((point.value - min) / range) * height;
      return `${x},${Number.isFinite(y) ? y : height}`;
    })
    .join(" ");

  const areaPoints = `${points} ${width},${height} 0,${height}`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-36 w-full" role="img" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#${gradientId})`} />
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="mt-3 grid grid-cols-7 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
        {data.map((point) => (
          <span key={point.label} className="text-center">
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function BarChart({ data, barColor }: { data: MetricsPoint[]; barColor: string }) {
  if (data.length === 0) {
    return <div className="h-40 w-full rounded-2xl bg-black/30" />;
  }

  const max = Math.max(...data.map((point) => point.value));

  return (
    <div className="w-full">
      <div className="flex items-end gap-3">
        {data.map((point) => {
          const height = max > 0 ? Math.max((point.value / max) * 120, 12) : 12;
          return (
            <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-md"
                style={{
                  height,
                  background: `linear-gradient(180deg, ${barColor} 0%, rgba(255,255,255,0.12) 100%)`,
                  boxShadow: `0 6px 18px rgba(0,0,0,0.35)`
                }}
              />
              <span className="text-[11px] uppercase tracking-[0.15em] text-zinc-500 text-center">{point.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CreatorAgentMetricsPage({ params }: MetricsPageProps) {
  if (MOCK_USER.plan !== "pro") {
    redirect("/creator/analytics");
  }

  const agentLabel = formatAgentLabel(params.id ?? "agent");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-4 pb-16 pt-10">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Creator Studio</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {agentLabel} performance metrics
        </h1>
        <p className="text-sm text-muted-foreground">
          Live operational telemetry refreshed every five minutes (mock data).
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-white/10 bg-[#0f1012] text-zinc-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-zinc-50">Requests over time</CardTitle>
            <CardDescription className="text-zinc-400">
              Rolling seven-day request volume from marketplace and integrations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart data={requestSeries} gradientId="requestsGradient" color="#8ec5ff" />
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-[#0f1012] text-zinc-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-zinc-50">Error rate</CardTitle>
            <CardDescription className="text-zinc-400">
              Percent of failed requests for the same seven-day period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 text-sm text-zinc-400">
              Last 24h: <span className="font-semibold text-emerald-300">0.47%</span>
            </div>
            <LineChart data={errorRateSeries} gradientId="errorsGradient" color="#f9a8d4" />
          </CardContent>
        </Card>
      </section>

      <Card className="border border-white/10 bg-[#0f1012] text-zinc-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-zinc-50">Latency distribution</CardTitle>
          <CardDescription className="text-zinc-400">
            Share of total requests by response latency bucket.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart data={latencyBuckets} barColor="#a5b4fc" />
        </CardContent>
      </Card>
    </main>
  );
}
