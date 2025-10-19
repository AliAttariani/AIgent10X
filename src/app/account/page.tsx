import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";

export default async function AccountPage() {
  const user = await currentUser();

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 px-6 py-12 text-center">
        <h1 className="text-2xl font-semibold">You are not signed in</h1>
        <Link
          href="/auth/sign-in"
          className="text-primary underline-offset-4 hover:underline"
        >
          Go to sign in
        </Link>
      </main>
    );
  }

  const primaryEmail = user.emailAddresses?.[0]?.emailAddress ?? "N/A";

  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6 py-12">
      <section className="w-full rounded-lg border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Account Overview</h1>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">User ID</dt>
            <dd className="font-mono text-sm">{user.id}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Email</dt>
            <dd>{primaryEmail}</dd>
          </div>
        </dl>
        <div className="mt-6">
          <Link
            href="/account/agents"
            className="inline-flex items-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
          >
            Manage agents
          </Link>
        </div>
      </section>
    </main>
  );
}
