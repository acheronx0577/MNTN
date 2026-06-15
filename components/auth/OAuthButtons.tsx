"use client";

import { useEffect, useState } from "react";
import { getClientPB } from "@/lib/pocketbase/client";
import { finalizeOAuth } from "@/app/actions/auth";
import { GitHubIcon, GoogleIcon } from "./AuthIcons";

function isPbAbort(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "isAbort" in err &&
    (err as { isAbort?: boolean }).isAbort === true
  );
}

function formatOAuthError(err: unknown): string {
  if (!(err instanceof Error)) {
    return "OAuth sign-in failed. Try again.";
  }

  const msg = err.message.toLowerCase();

  if (msg.includes("popup blocked")) {
    return err.message;
  }

  if (msg.includes("failed to fetch") || msg.includes("networkerror")) {
    return "Could not reach PocketBase. Try again.";
  }

  if (msg.includes("redirect_uri") || msg.includes("invalid request")) {
    return (
      "Google OAuth misconfigured. In Google Cloud Console → Credentials → your OAuth client, add redirect URI: " +
      "https://k1y1g4i89co8bd1.ba7w.pocketbasecloud.com/api/oauth2-redirect " +
      "(not your Vercel URL). Also set PocketBase Application URL to https://mntn-lemon.vercel.app."
    );
  }

  if (msg.includes("provider is not enabled") || msg.includes("no such provider")) {
    return "This provider is not enabled in PocketBase. Enable it under Collections → users → Options → OAuth2.";
  }

  if (
    msg.includes("something went wrong") ||
    msg.includes("auth failed") ||
    msg.includes("oauth2")
  ) {
    return "OAuth handshake failed. Check PocketBase Application URL and OAuth2 provider settings.";
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
    let active = true;
    const pb = getClientPB();

    pb.collection("users")
      .listAuthMethods()
      .then((methods) => {
        if (!active) return;
        const providers =
          methods.oauth2?.providers?.map((p) => p.name) ?? [];
        setEnabledProviders(providers);
        if (!methods.oauth2?.enabled || providers.length === 0) {
          setError(
            "OAuth is not enabled in PocketBase. Enable Google/GitHub under Collections → users → Options → OAuth2."
          );
        }
      })
      .catch((err) => {
        if (!active || isPbAbort(err)) return;
        setEnabledProviders([]);
      });

    return () => {
      active = false;
    };
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

    // Open popup synchronously on click — avoids blockers and flaky first attempts.
    const popup = window.open(
      "about:blank",
      "pocketbase-oauth",
      "width=520,height=720,scrollbars=yes,resizable=yes"
    );
    if (!popup) {
      setError("Popup blocked. Allow popups for this site and try again.");
      setLoading(null);
      return;
    }

    const pb = getClientPB();
    const requestKey = `oauth-${provider}-${Date.now()}`;
    let popupWatcher: number | null = null;
    let closeCancelTimer: number | null = null;
    let oauthSettled = false;

    const stopPopupWatcher = () => {
      oauthSettled = true;
      if (popupWatcher !== null) {
        window.clearInterval(popupWatcher);
        popupWatcher = null;
      }
      if (closeCancelTimer !== null) {
        window.clearTimeout(closeCancelTimer);
        closeCancelTimer = null;
      }
    };

    pb.collection("users")
      .authWithOAuth2({
        provider,
        requestKey,
        urlCallback: (url) => {
          popup.location.href = url;

          popupWatcher = window.setInterval(() => {
            if (oauthSettled) {
              stopPopupWatcher();
              return;
            }
            // Popup also closes on successful OAuth — wait before cancelling.
            if (popup.closed && closeCancelTimer === null) {
              closeCancelTimer = window.setTimeout(() => {
                if (!oauthSettled) {
                  pb.cancelRequest(requestKey);
                }
              }, 4000);
            }
          }, 300);
        },
      })
      .then(() => {
        stopPopupWatcher();
        const cookie = pb.authStore.exportToCookie({
          httpOnly: true,
          secure: window.location.protocol === "https:",
          sameSite: "lax",
          path: "/",
        });
        return finalizeOAuth(cookie);
      })
      .then((result) => {
        if (!result.ok) {
          setError(result.error ?? "Could not complete OAuth sign-in.");
        }
        setLoading(null);
      })
      .catch((err) => {
        stopPopupWatcher();
        if (isNextRedirect(err)) return;
        if (isPbAbort(err)) {
          setLoading(null);
          return;
        }
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
