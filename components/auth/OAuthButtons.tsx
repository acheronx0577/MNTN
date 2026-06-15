"use client";

import { useState } from "react";
import { getClientPB } from "@/lib/pocketbase/client";
import { finalizeOAuth } from "@/app/actions/auth";
import { GitHubIcon, GoogleIcon } from "./AuthIcons";

export default function OAuthButtons() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOAuth = async (provider: "google" | "github") => {
    setLoading(provider);
    setError(null);
    try {
      const pb = getClientPB();
      await pb.collection("users").authWithOAuth2({ provider });
      const result = await finalizeOAuth(
        pb.authStore.token,
        pb.authStore.record
      );
      if (!result.ok) {
        setError(result.error);
        setLoading(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "OAuth sign-in failed. Try again."
      );
      setLoading(null);
    }
  };

  return (
    <div className="oauth-buttons">
      {error && <div className="form-alert form-alert--error">{error}</div>}
      <button
        type="button"
        className="oauth-btn"
        disabled={!!loading}
        onClick={() => handleOAuth("google")}
      >
        <span className="oauth-btn__icon">
          <GoogleIcon />
        </span>
        <span className="oauth-btn__label">
          {loading === "google" ? "Connecting…" : "Google"}
        </span>
      </button>
      <button
        type="button"
        className="oauth-btn"
        disabled={!!loading}
        onClick={() => handleOAuth("github")}
      >
        <span className="oauth-btn__icon">
          <GitHubIcon />
        </span>
        <span className="oauth-btn__label">
          {loading === "github" ? "Connecting…" : "GitHub"}
        </span>
      </button>
    </div>
  );
}
