"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useActionState } from "react";
import AuthLayout from "./AuthLayout";
import FormField from "./FormField";
import SubmitButton from "./SubmitButton";
import { signupAction, type AuthState } from "@/app/actions/auth";

const OAuthButtons = dynamic(() => import("./OAuthButtons"), {
  loading: () => <div className="oauth-buttons oauth-buttons--loading" aria-hidden="true" />,
});

const initialState: AuthState = { ok: false };

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(
    signupAction,
    initialState
  );

  return (
    <AuthLayout
      variant="split"
      size="large"
      title="Join MNTN"
      subtitle="Create an account to keep trail notes"
      imageTagline="Start your next adventure on the trail."
      footer={
        <>
          Already have an account? <Link href="/login">Sign in</Link>
        </>
      }
    >
      <OAuthButtons />
      <div className="auth-divider">or sign up with email</div>
      {state.error && (
        <div className="form-alert form-alert--error">{state.error}</div>
      )}
      <form action={formAction}>
        <FormField
          id="name"
          label="Name"
          name="name"
          autoComplete="name"
          required
          error={state.fieldErrors?.name}
        />
        <FormField
          id="email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          error={state.fieldErrors?.email}
        />
        <FormField
          id="password"
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          error={state.fieldErrors?.password}
        />
        <FormField
          id="passwordConfirm"
          label="Confirm password"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          required
          error={state.fieldErrors?.passwordConfirm}
        />
        <SubmitButton pending={pending}>Create account</SubmitButton>
      </form>
    </AuthLayout>
  );
}
