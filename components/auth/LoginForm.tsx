"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import AuthLayout from "./AuthLayout";
import FormField from "./FormField";
import SubmitButton from "./SubmitButton";
import OAuthButtons from "./OAuthButtons";
import { loginAction, type AuthState } from "@/app/actions/auth";

const initialState: AuthState = { ok: false };

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginForm() {
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !validateEmail(trimmed)) {
      setEmailError("Enter a valid email");
      return;
    }
    setEmail(trimmed);
    setEmailError(undefined);
    setStep("password");
  };

  const handleEditEmail = () => {
    setStep("email");
    setEmailError(undefined);
  };

  const subtitle =
    step === "email"
      ? "Enter your email to continue"
      : "Enter your password to sign in";

  return (
    <AuthLayout
      size="large"
      title="Welcome back"
      subtitle={subtitle}
      footer={
        <>
          Don&apos;t have an account? <Link href="/signup">Sign up</Link>
        </>
      }
    >
      <div className="login-steps" aria-hidden="true">
        <span className={`login-steps__dot${step === "email" ? " is-active" : " is-done"}`} />
        <span className="login-steps__line" />
        <span className={`login-steps__dot${step === "password" ? " is-active" : ""}`} />
      </div>

      {step === "email" ? (
        <>
          <OAuthButtons />
          <div className="auth-divider">or continue with email</div>
          <form onSubmit={handleContinue} noValidate className="login-form">
            <div className="form-field">
              <label htmlFor="login-email">Email</label>
              <div className="form-field__input-wrap">
                <i className="bx bx-envelope form-field__icon" aria-hidden="true" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(undefined);
                  }}
                  required
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "login-email-error" : undefined}
                />
              </div>
              {emailError && (
                <p className="form-field__error" id="login-email-error">
                  {emailError}
                </p>
              )}
            </div>
            <button type="submit" className="btn-primary btn-primary--icon">
              Continue
              <i className="bx bx-right-arrow-alt" aria-hidden="true" />
            </button>
          </form>
        </>
      ) : (
        <>
          {!state.ok && state.error && (
            <div className="form-alert form-alert--error">{state.error}</div>
          )}
          <form action={formAction} className="login-form">
            <input type="hidden" name="email" value={email} />
            <div className="login-email-locked">
              <div className="login-email-locked__content">
                <span className="login-email-locked__label">Email</span>
                <span className="login-email-locked__value">{email}</span>
              </div>
              <button
                type="button"
                className="login-email-locked__edit"
                onClick={handleEditEmail}
                aria-label="Edit email"
              >
                <i className="bx bx-pencil" aria-hidden="true" />
              </button>
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <div className="form-field__input-wrap">
                <i className="bx bx-lock-alt form-field__icon" aria-hidden="true" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Your password"
                  required
                />
              </div>
              {state.fieldErrors?.password && (
                <p className="form-field__error">{state.fieldErrors.password}</p>
              )}
            </div>
            <SubmitButton pending={pending} pendingLabel="Signing in…">
              Sign in
            </SubmitButton>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
