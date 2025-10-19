'use client';

import { useEffect, useState } from 'react';

interface HealthResponse {
  ok: boolean;
  env: {
    CLERK: boolean;
    STRIPE: boolean;
  };
  deps: Record<string, string | null>;
}

export default function HealthPage() {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetch('/api/health')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json() as Promise<HealthResponse>;
      })
      .then((json) => {
        if (isMounted) setData(json);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 px-6 py-12">
      <h1 className="text-3xl font-semibold">Health Check</h1>
      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-destructive">
          Failed to load health data: {error}
        </p>
      ) : !data ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <section className="space-y-6 rounded-md border bg-card p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-medium">Status</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {data.ok ? 'All systems operational.' : 'Some checks failed.'}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Environment variables</h3>
            <ul className="mt-2 space-y-2">
              {Object.entries(data.env).map(([key, present]) => (
                <li
                  key={key}
                  className="flex items-center justify-between rounded border px-3 py-2 text-sm"
                >
                  <span>{key}</span>
                  <span className={present ? 'text-emerald-600' : 'text-red-600'}>
                    {present ? 'Present' : 'Missing'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium">Dependencies</h3>
            <ul className="mt-2 space-y-2">
              {Object.entries(data.deps).map(([name, version]) => (
                <li key={name} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
                  <span>{name}</span>
                  <span className="font-mono">{version ?? 'n/a'}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
