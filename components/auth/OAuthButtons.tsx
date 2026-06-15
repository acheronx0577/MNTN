"use client";

import { useEffect, useState } from "react";
import { getClientPB } from "@/lib/pocketbase/client";
import { getPocketBaseReachabilityError } from "@/lib/pocketbase/url";
import { finalizeOAuth } from "@/app/actions/auth";
import { GitHubIcon, GoogleIcon } from "./AuthIcons";

function formatOAuthError(err: unknown): string {
  if (!(err instanceof Error)) {
    return "OAuth sign-in failed. Try again.";
  }

  const msg = err.message.toLowerCase();

  if (msg.includes("popup blocked")) {
    return err.message;
  }

  if (msg.includes("failed to fetch") || msg.includes("networkerror")) {
    return getPocketBaseReachabilityError();
  }

  if (msg.includes("provider is not enabled") || msg.includes("no such provider")) {
    return "This provider is not enabled in PocketBase. Open http://127.0.0.1:8090/_/ → Settings → Auth providers → enable Google/GitHub and save Client ID + secret.";
  }

  if (
    msg.includes("something went wrong") ||
    msg.includes("auth failed") ||
    msg.includes("oauth2")
  ) {
    return "OAuth handshake failed. In PocketBase admin: Settings → Application → set Application URL to http://localhost:3000, then Settings → Auth providers → enable Google with your Client ID and secret.";
  }

  return err.message;
}

function isNextRedirect(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

export default function OAuthButtons() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [enabledProviders, setEnabledProviders] = useState<string[] | null>(null);

  useEffect(() => {
    const pb = getClientPB();
    pb.collection("users")
      .listAuthMethods()
      .then((methods) => {
        const providers =
          methods.oauth2?.providers?.map((p) => p.name) ?? [];
        setEnabledProviders(providers);
        if (!methods.oauth2?.enabled || providers.length === 0) {
          setError(
            "OAuth is not enabled in PocketBase yet. Open http://127.0.0.1:8090/_/ → Collections → users → Options → OAuth2 → enable Google/GitHub."
          );
        }
      })
      .catch(() => {
        setEnabledProviders([]);
        setError(getPocketBaseReachabilityError());
      });
  }, []);

  const handleOAuth = (provider: "google" | "github") => {
    if (enabledProviders && !enabledProviders.includes(provider)) {
      setError(
        `${provider === "google" ? "Google" : "GitHub"} is not enabled in PocketBase. Enable it under Collections → users → Options → OAuth2.`
      );
      return;
    }

    setLoading(provider);
    setError(null);

    const pb = getClientPB();

    pb.collection("users")
      .authWithOAuth2({
        provider,
        urlCallback: (url) => {
          const popup = window.open(
            url,
            "pocketbase-oauth",
            "width=520,height=720,scrollbars=yes,resizable=yes"
          );
          if (!popup) {
            throw new Error(
              "Popup blocked. Allow popups for this site and try again."
            );
          }
        },
      })
      .then(() => {
        const cookie = pb.authStore.exportToCookie({
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          path: "/",
        });
        return finalizeOAuth(cookie);
      })
      .then((result) => {
        if (!result.ok) {
          setError(result.error ?? "Could not complete OAuth sign-in.");
          setLoading(null);
        }
      })
      .catch((err) => {
        if (isNextRedirect(err)) return;
        setError(formatOAuthError(err));
        setLoading(null);
      });
  };

  return (
    <div className="oauth-buttons">
      <div className="oauth-buttons__row">
        <button
          type="button"
          className="oauth-btn"
          disabled={!!loading || enabledProviders?.length === 0}
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
          disabled={!!loading || enabledProviders?.length === 0}
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
