"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/email/welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName: email.split("@")[0] }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="py-16 border-t border-slate-100" style={{ backgroundColor: "#ffffff" }}>
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#0f172a" }}>
          Get Free Resume Tips &amp; Templates
        </h2>
        <p className="text-sm mb-6" style={{ color: "#64748b" }}>
          Weekly career advice, ATS tricks, and new template drops. No spam. Unsubscribe any time.
        </p>

        {status === "success" ? (
          <div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold"
            style={{ backgroundColor: "#f0fdf9", color: "#4AB7A6", border: "1px solid #ccfbef" }}
          >
            <Check className="w-4 h-4" />
            You&apos;re in! Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="your@email.com"
              className="flex-1 px-5 py-3 rounded-full border text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor: error ? "#ef4444" : "#e2e8f0",
              }}
              disabled={status === "loading"}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
              style={{ backgroundColor: "#4AB7A6" }}
            >
              {status === "loading" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>Get Tips Free <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        )}

        {error && (
          <p className="mt-2 text-xs text-red-500">{error}</p>
        )}
      </div>
    </section>
  );
}
