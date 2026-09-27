import { useState } from "react";
import type { FormEvent } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Check,
  AlertCircle,
  ArrowLeft,
  HelpCircle,
  Sparkles,
  CalendarRange,
  Refrigerator,
  ShoppingCart,
  ScanBarcode,
  ChartNoAxesColumn,
  Users,
} from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "../utils/cn";

/* ---------------- Brand icons ---------------- */

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.98-.2 1.92-.86 3.24-.77 1.58.13 2.77.75 3.55 1.9-3.27 1.96-2.5 6.27.49 7.46-.59 1.56-1.36 3.11-2.36 3.58zM12.03 7.25c-.15-2.23 1.66-4.25 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

/* ---------------- Feature ticker ---------------- */

const FEATURES = [
  { icon: Sparkles, label: "AI Meal Planning" },
  { icon: Refrigerator, label: "Pantry Tracking" },
  { icon: ShoppingCart, label: "Smart Grocery Lists" },
  { icon: ScanBarcode, label: "Barcode Scanning" },
  { icon: ChartNoAxesColumn, label: "Nutrition Analytics" },
  { icon: Users, label: "Family Sync" },
  { icon: CalendarRange, label: "Weekly Scheduling" },
];

function FeatureTicker() {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {FEATURES.map((f) => (
        <span key={f.label} className="flex items-center">
          <span className="flex items-center gap-2 px-6">
            <f.icon className="h-3 w-3 text-brand-600" />
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-ink-400">
              {f.label}
            </span>
          </span>
          <span className="h-0.5 w-0.5 rounded-full bg-ink-300" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative border-t border-ink-900/[0.06] bg-surface-2 py-3">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-surface-2 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-surface-2 to-transparent" />
      <div className="w-full overflow-hidden">
        <div className="marquee-track flex w-max shrink-0">
          {row("a")}
          {row("b")}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Form ---------------- */

type Status = "idle" | "loading" | "success";

export function LoginForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [capsOn, setCapsOn] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [status, setStatus] = useState<Status>("idle");
  const [shakeKey, setShakeKey] = useState(0);

  const validate = () => {
    const e: { email?: string; password?: string } = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 8)
      e.password = "Password must be at least 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

    const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (status !== "idle") return;
    if (!validate()) {
      setShakeKey((k) => k + 1);
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch((apiBase || "") + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      sessionStorage.setItem("nts-auth", JSON.stringify(data));
      setStatus("success");
      window.setTimeout(() => onSuccess(data), 900);
    } catch (err) {
      setErrors({ email: "Invalid email or password", password: "" });
      setShakeKey((k) => k + 1);
      setStatus("idle");
    }
  };

  const field =
    "field tnum h-11 w-full rounded-lg border bg-surface pl-10 pr-4 text-[0.85rem] text-ink-900 placeholder:text-ink-300 outline-none";

  return (
    <div className="form-scroll relative flex h-full min-w-0 flex-col overflow-x-hidden overflow-y-auto bg-canvas">
      {/* Ambient tint */}
      <div
        className="pointer-events-none absolute -top-36 right-0 h-[380px] w-[380px] opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(18,160,108,0.13), transparent)",
        }}
      />

      {/* Header */}
      <header className="animate-fade-up relative z-10 flex h-14 shrink-0 items-center justify-between px-5 sm:px-8 lg:px-10">
        <div className="lg:hidden">
          <Logo compact />
        </div>
        <a
          href="#"
          className="group hidden items-center gap-1.5 text-[0.75rem] font-medium text-ink-400 transition-colors hover:text-ink-900 lg:flex"
        >
          <ArrowLeft className="h-3 w-3 transition-transform duration-150 group-hover:-translate-x-0.5" />
          Back to website
        </a>
        <a
          href="#"
          className="flex items-center gap-1.5 rounded-lg border border-ink-900/[0.08] bg-surface px-2.5 py-1.5 text-[0.75rem] font-medium text-ink-500 transition-colors hover:border-ink-900/[0.16] hover:text-ink-900"
        >
          <HelpCircle className="h-3 w-3" />
          Need help?
        </a>
      </header>

      {/* Body */}
      <main className="relative z-10 mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center px-5 py-10 sm:px-8 lg:px-10">
        <div className="animate-fade-up d-1">
          <h2 className="font-display text-[2.1rem] font-medium leading-[1.05] tracking-[-0.02em] text-ink-900">
            Welcome{" "}
            <span className="font-light italic text-brand-700">back</span>
          </h2>
          <p className="mt-2.5 text-[0.85rem] leading-relaxed text-ink-500">
            Sign in to sync your meals, pantry and progress — picked up right
            where you left off.
          </p>
        </div>

        {/* Social */}
        <div className="animate-fade-up d-2 mt-7 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            className="elev-1 flex h-10 items-center justify-center gap-2.5 rounded-lg border border-ink-900/[0.08] bg-surface text-[0.82rem] font-semibold text-ink-900 transition-all duration-150 hover:border-ink-900/[0.16] hover:elev-2 active:scale-[0.99]"
          >
            <GoogleIcon />
            Google
          </button>
          <button
            type="button"
            className="elev-1 flex h-10 items-center justify-center gap-2.5 rounded-lg border border-ink-900/[0.08] bg-surface text-[0.82rem] font-semibold text-ink-900 transition-all duration-150 hover:border-ink-900/[0.16] hover:elev-2 active:scale-[0.99]"
          >
            <AppleIcon />
            Apple
          </button>
        </div>

        {/* Divider */}
        <div className="animate-fade-up d-3 mt-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-ink-900/[0.08]" />
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-ink-400">
            or with email
          </span>
          <span className="h-px flex-1 bg-ink-900/[0.08]" />
        </div>

        {/* Fields */}
        <form
          onSubmit={onSubmit}
          noValidate
          className="animate-fade-up d-4 mt-6 space-y-4"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-[0.78rem] font-semibold text-ink-900"
            >
              Email address
            </label>
            <div className="relative">
              <Mail
                className={cn(
                  "pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-colors",
                  errors.email ? "text-signal-red" : "text-ink-300"
                )}
              />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email)
                    setErrors((er) => ({ ...er, email: undefined }));
                }}
                className={cn(
                  field,
                  errors.email
                    ? "border-signal-red/50 focus:border-signal-red"
                    : "border-ink-900/[0.1] hover:border-ink-900/[0.2] focus:border-brand-600"
                )}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 flex items-center gap-1 text-[0.72rem] font-medium text-signal-red">
                <AlertCircle className="h-3 w-3" /> {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-[0.78rem] font-semibold text-ink-900"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className={cn(
                  "pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-colors",
                  errors.password ? "text-signal-red" : "text-ink-300"
                )}
              />
              <input
                id="password"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors((er) => ({ ...er, password: undefined }));
                }}
                onKeyUp={(e) =>
                  setCapsOn(e.getModifierState?.("CapsLock") ?? false)
                }
                onKeyDown={(e) =>
                  setCapsOn(e.getModifierState?.("CapsLock") ?? false)
                }
                className={cn(
                  field,
                  "pr-11",
                  errors.password
                    ? "border-signal-red/50 focus:border-signal-red"
                    : "border-ink-900/[0.1] hover:border-ink-900/[0.2] focus:border-brand-600"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-ink-300 transition-colors hover:bg-surface-3 hover:text-ink-900"
              >
                {showPw ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
            {errors.password ? (
              <p className="mt-1.5 flex items-center gap-1 text-[0.72rem] font-medium text-signal-red">
                <AlertCircle className="h-3 w-3" /> {errors.password}
              </p>
            ) : (
              capsOn && (
                <p className="mt-1.5 flex items-center gap-1 text-[0.72rem] font-medium text-signal-amber">
                  <AlertCircle className="h-3 w-3" /> Caps Lock is on
                </p>
              )
            )}
          </div>

          {/* Remember / forgot */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex cursor-pointer select-none items-center gap-2.5">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="grid h-[17px] w-[17px] place-items-center rounded-[5px] border border-ink-900/[0.18] bg-surface transition-colors duration-150 peer-checked:border-brand-600 peer-checked:bg-brand-600 [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
                <Check
                  className="h-2.5 w-2.5 text-white transition-opacity duration-150"
                  strokeWidth={3}
                />
              </span>
              <span className="text-[0.78rem] font-medium text-ink-500">
                Keep me signed in
              </span>
            </label>
            <a
              href="#"
              className="text-[0.78rem] font-semibold text-brand-600 transition-colors hover:text-brand-700"
            >
              Forgot password?
            </a>
          </div>

          {/* Error banner */}
          {(errors.email || errors.password) && (
            <div
              key={shakeKey}
              className="shake flex items-center gap-2.5 rounded-lg border border-signal-red/25 bg-signal-red-bg px-3.5 py-2.5"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-signal-red" />
              <p className="text-[0.75rem] font-medium text-signal-red">
                Please fix the highlighted fields to continue.
              </p>
            </div>
          )}

          {/* Success */}
          {status === "success" && (
            <div className="animate-fade-up flex items-center gap-2.5 rounded-lg border border-brand-500/30 bg-brand-50 px-3.5 py-2.5">
              <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-600">
                <Check className="h-2 w-2 text-white" strokeWidth={3} />
              </span>
              <p className="text-[0.75rem] font-medium text-brand-700">
                Signed in — opening your dashboard…
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status !== "idle"}
            className={cn(
              "group mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-lg text-[0.85rem] font-semibold text-white transition-all duration-150 active:scale-[0.99]",
              status === "idle" && "bg-brand-600 hover:bg-brand-700 hover:elev-2",
              status === "loading" && "bg-brand-700",
              status === "success" && "bg-brand-700"
            )}
          >
            {status === "idle" && (
              <>
                Sign in
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </>
            )}
            {status === "loading" && (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Signing you in…
              </>
            )}
            {status === "success" && (
              <>
                <Check className="h-3.5 w-3.5" /> Welcome back
              </>
            )}
          </button>
        </form>

        {/* Sign up */}
        <p className="animate-fade-up d-5 mt-7 text-center text-[0.82rem] text-ink-500">
          New to NutriSync?{" "}
          <a
            href="#"
            className="font-semibold text-ink-900 underline decoration-brand-500/40 decoration-2 underline-offset-[3px] transition-colors hover:decoration-brand-600"
          >
            Create your free account
          </a>
        </p>
      </main>

      {/* Ticker */}
      <div className="animate-fade-in d-6 relative z-10 shrink-0">
        <FeatureTicker />
      </div>
    </div>
  );
}

