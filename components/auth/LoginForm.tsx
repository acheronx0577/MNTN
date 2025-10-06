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
}