"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-sm">
        <SignUp
          signInUrl="/auth/sign-in"
          routing="path"
          path="/auth/sign-up"
          afterSignUpUrl="/account"
        />
      </div>
    </main>
  );
}
