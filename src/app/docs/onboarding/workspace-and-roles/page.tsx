export default function WorkspaceAndRolesPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Onboarding</p>
        <h1 className="text-3xl font-semibold tracking-tight">Workspace & roles</h1>
        <p className="text-base text-muted-foreground">
          Structure access in a way that mirrors your org chart. PantherIQ enforces least-privilege defaults while leaving clear
          audit trails for every automation run.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Role model</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border p-4">
            <h3 className="text-base font-semibold">Owners</h3>
            <p className="text-sm text-muted-foreground">Manage billing, approve automations, and invite administrators.</p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <h3 className="text-base font-semibold">Admins</h3>
            <p className="text-sm text-muted-foreground">Configure integrations, edit runbooks, and pause or resume automations.</p>
          </div>
          <div className="rounded-2xl border border-border p-4">
            <h3 className="text-base font-semibold">Reviewers</h3>
            <p className="text-sm text-muted-foreground">View outcomes, comment on QA notes, and submit escalation requests.</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Access policies</h2>
        <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
          <li>Use SSO with SCIM provisioning to sync user lifecycle events.</li>
          <li>Enable environment labels (sandbox, staging, production) to scope integration keys.</li>
          <li>Grant temporary admin rights for audits or launches, then auto-revoke via policy timers.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Audit trails</h2>
        <p className="text-sm text-muted-foreground">
          Every action—invites, role changes, automation edits, run approvals—is captured with timestamp, actor, and metadata.
          Export audit logs to your SIEM nightly or stream them via webhook for real-time monitoring.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Org structures</h2>
        <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          <pre className="whitespace-pre-wrap text-xs leading-6">
{`HQ Workspace
├─ Growth BU
│  ├─ SDR pod (reviewer seats)
│  └─ RevOps (admin)
└─ CX BU
   ├─ Support leadership (owner)
   └─ Automation operators (admin)`}
          </pre>
          <p className="mt-3">
            Map each business unit to a workspace or environment. This keeps data residency and reporting clean while still
            sharing templates across teams.
          </p>
        </div>
      </section>
    </article>
  );
}
