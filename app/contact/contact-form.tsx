"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "mt-2 block w-full rounded-xl bg-white px-4 py-3 text-slate-900 shadow-sm ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#10B759]";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");

    try {
      // TODO: send `data` to your backend, e.g.
      // await fetch("/api/contact", { method: "POST", body: JSON.stringify(data) });
      console.log("Contact form:", data);
      await new Promise((r) => setTimeout(r, 800));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="mt-8 flex flex-col items-start gap-4" role="status">
        <CheckCircle2 className="h-10 w-10 text-[#10B759]" />
        <p className="text-lg font-semibold text-emerald-950">Message sent</p>
        <p className="text-slate-600">
          Thanks for getting in touch. We&apos;ll reply within one working day.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-sm font-semibold text-emerald-700 underline-offset-4 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
      <label className="block text-sm font-medium text-emerald-950">
        Name
        <input name="name" required autoComplete="name" className={inputClass} />
      </label>

      <label className="block text-sm font-medium text-emerald-950">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
      </label>

      <label className="block text-sm font-medium text-emerald-950 sm:col-span-2">
        Phone <span className="font-normal text-slate-500">(optional)</span>
        <input name="phone" type="tel" autoComplete="tel" className={inputClass} />
      </label>

      <label className="block text-sm font-medium text-emerald-950 sm:col-span-2">
        What can we help with?
        <select name="topic" defaultValue="booking" className={inputClass}>
          <option value="booking">A booking or tee time</option>
          <option value="course">A course question</option>
          <option value="trip">Planning a golf trip</option>
          <option value="other">Something else</option>
        </select>
      </label>

      <label className="block text-sm font-medium text-emerald-950 sm:col-span-2">
        Message
        <textarea
          name="message"
          required
          rows={5}
          className={`${inputClass} resize-y`}
        />
      </label>

      {status === "error" && (
        <p className="text-sm text-red-600 sm:col-span-2" role="alert">
          Your message couldn&apos;t be sent. Check your connection and try
          again, or email us directly.
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 rounded-full bg-[#10B759] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-px hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}