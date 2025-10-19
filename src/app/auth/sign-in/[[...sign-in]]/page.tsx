"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-sm">
        <SignIn
          signUpUrl="/auth/sign-up"
          routing="path"
          path="/auth/sign-in"
          afterSignInUrl="/account"
        />
      </div>
    </main>
  );
}
