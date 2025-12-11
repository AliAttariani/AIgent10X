export default function AuthenticationPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Dev / Security / Ops</p>
        <h1 className="text-3xl font-semibold tracking-tight">Authentication</h1>
        <p className="text-base text-muted-foreground">
          Authenticate via service tokens or OAuth. All tokens are scoped to a workspace and environment for granular control.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Service tokens</h2>
        <p className="text-sm text-muted-foreground">
          Create tokens from the dashboard or API. Each token includes scopes like <code className="rounded bg-muted px-1">automations:trigger</code> or
          <code className="rounded bg-muted px-1">outcomes:read</code>. Rotate tokens quarterly or use the rotation API.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">OAuth 2.0</h2>
        <p className="text-sm text-muted-foreground">
          OAuth apps can request delegated access for user-driven actions inside PantherIQ. We support Authorization Code flow
          with PKCE. Tokens expire after one hour; refresh tokens live 30 days unless revoked.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Request signing</h2>
        <p className="text-sm text-muted-foreground">
          Include the <code className="rounded bg-muted px-1">X-PantherIQ-Signature</code> header with HMAC-SHA256 signatures when making sensitive requests. This ensures
          replay attacks are rejected and provides strong non-repudiation for audit logs.
        </p>
      </section>
    </article>
  );
}
