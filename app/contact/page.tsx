"use client";

import { useState } from "react";
import { Mail, MessageSquare, Clock, Send, Loader2, CheckCircle } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
    } catch (err) {
      console.error("[contact] send failed:", err);
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        {/* Hero */}
        <section className="bg-white border-b border-gray-100 py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-500">
              Have a question or need help? We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact info */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--teal-50)] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                  <p className="text-sm text-gray-500">
                    <a href="mailto:hello@gethiretoday.com" className="text-teal hover:underline">hello@gethiretoday.com</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--teal-50)] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Response Time</h3>
                  <p className="text-sm text-gray-500">We typically respond within 24 hours on business days.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--teal-50)] flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Common Topics</h3>
                  <ul className="text-sm text-gray-500 space-y-1 mt-1">
                    <li>• Billing and subscription</li>
                    <li>• Account issues</li>
                    <li>• Feature requests</li>
                    <li>• Bug reports</li>
                    <li>• Privacy requests</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 card-shadow">
                {status === "success" ? (
                  <div className="flex flex-col items-center text-center py-8 gap-4">
                    <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Message Sent!</h2>
                    <p className="text-gray-500">Thanks for reaching out. We&apos;ll get back to you within 24 hours.</p>
                    <button
                      onClick={() => { setForm({ name: "", email: "", subject: "", message: "" }); setStatus("idle"); }}
                      className="btn-teal-outline text-sm mt-2"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal)] focus:border-transparent"
                          placeholder="Jane Smith"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal)] focus:border-transparent"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                      <input
                        type="text"
                        required
                        value={form.subject}
                        onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                        className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal)] focus:border-transparent"
                        placeholder="How can we help?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal)] focus:border-transparent resize-none"
                        placeholder="Describe your issue or question in detail..."
                      />
                    </div>

                    {status === "error" && (
                      <p className="text-sm text-red-600">Something went wrong. Please email us directly at hello@gethiretoday.com.</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="btn-teal w-full flex items-center justify-center gap-2"
                    >
                      {status === "loading" ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                      ) : (
                        <><Send className="w-4 h-4" /> Send Message</>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
