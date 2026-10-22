"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useEffect, useSyncExternalStore } from "react";

const CONSENT_KEY = "ga4-consent";
type ConsentChoice = "granted" | "denied" | null;
type Gtag = (...args: unknown[]) => void;

function updateAnalyticsConsent(choice: Exclude<ConsentChoice, null>) {
  const gtag = (window as typeof window & { gtag?: Gtag }).gtag;
  gtag?.("consent", "update", {
    ad_storage: "denied",
    analytics_storage: choice === "granted" ? "granted" : "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

function readConsent(): ConsentChoice {
  try {
    const saved = window.localStorage.getItem(CONSENT_KEY);
    return saved === "granted" || saved === "denied" ? saved : null;
  } catch {
    return null;
  }
}

function subscribeToConsent(onChange: () => void) {
  window.addEventListener("ga4-consent-change", onChange);
  return () => window.removeEventListener("ga4-consent-change", onChange);
}

export default function AnalyticsConsent() {
  const choice = useSyncExternalStore(subscribeToConsent, readConsent, () => null);

  useEffect(() => {
    if (choice) updateAnalyticsConsent(choice);
  }, [choice]);

  function choose(nextChoice: Exclude<ConsentChoice, null>) {
    try {
      window.localStorage.setItem(CONSENT_KEY, nextChoice);
    } catch {
      // A denied choice remains the safe fallback when storage is unavailable.
    }
    updateAnalyticsConsent(nextChoice);
    window.dispatchEvent(new Event("ga4-consent-change"));
  }

  return (
    <>
      {choice === "granted" && <GoogleAnalytics gaId="G-LV0CW7PHH0" />}
      {choice === null && (
        <aside
          aria-label="Analytics consent"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-xl border border-slate-300 bg-white p-4 text-sm text-slate-800 shadow-xl"
        >
          <p className="mb-3">
            Allow anonymous, aggregate usage measurement? No names, form contents,
            search text, or user IDs are collected.
          </p>
          <div className="flex gap-2">
            <button
              className="rounded-lg bg-slate-900 px-3 py-2 font-medium text-white"
              onClick={() => choose("granted")}
            >
              Allow analytics
            </button>
            <button
              className="rounded-lg border border-slate-300 px-3 py-2 font-medium"
              onClick={() => choose("denied")}
            >
              Decline
            </button>
          </div>
        </aside>
      )}
      {choice !== null && (
        <button
          className="fixed bottom-3 left-3 z-40 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 shadow"
          onClick={() => {
            try {
              window.localStorage.removeItem(CONSENT_KEY);
            } catch {
              // The banner remains unavailable when storage is blocked.
            }
            window.dispatchEvent(new Event("ga4-consent-change"));
          }}
        >
          Analytics settings
        </button>
      )}
    </>
  );
}
