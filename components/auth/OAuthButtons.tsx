"use client";

import { useState } from "react";
import { getClientPB } from "@/lib/pocketbase/client";
import { finalizeOAuth } from "@/app/actions/auth";
import { GitHubIcon, GoogleIcon } from "./AuthIcons";

function formatOAuthError(err: unknown): string {
  if (!(err instanceof Error)) {
    return "OAuth sign-in failed. Try again.";
  }

  const msg = err.message.toLowerCase();

  if (msg.includes("failed to fetch") || msg.includes("networkerror")) {
    return "Cannot reach PocketBase. Run npm run dev:pb and check NEXT_PUBLIC_POCKETBASE_URL.";
  }

  if (
    msg.includes("something went wrong") ||
    msg.includes("provider") ||
    msg.includes("oauth2")
  ) {
    return "OAuth is not configured in PocketBase yet. In the admin UI (Settings → Auth providers), enable Google or GitHub with your client ID and secret.";
  }

  return err.message;
}

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
      setError(formatOAuthError(err));
      setLoading(null);
    }
  };

  return (
    <div className="oauth-buttons">
      <div className="oauth-buttons__row">
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
      {error && (
        <div className="form-alert form-alert--error oauth-buttons__error">
          {error}
        </div>
      )}
    </div>
  );
}
