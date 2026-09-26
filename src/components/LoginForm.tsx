import { useState } from "react";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Check,
  CircleAlert,
  ArrowLeft,
  CircleHelp,
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

/* ---------------- Google / Apple icons ---------------- */

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
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
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden="true">
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
            <f.icon className="h-3.5 w-3.5 text-leaf-600" />
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-ink-soft/80">
              {f.label}
            </span>
          </span>
          <span className="h-1 w-1 rounded-full bg-leaf-600/40" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative border-t border-ink/8 bg-cream-dark/60 py-3.5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-cream to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-cream to-transparent" />
      <div className="flex overflow-hidden">
        <div className="marquee-track flex">
          {row("a")}
          {row("b")}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Form ---------------- */

type Status = "idle" | "loading" | "success";

export function LoginForm({ onAuth, apiBase = '' }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [capsOn, setCapsOn] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [errorShake, setErrorShake] = useState(0);

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Password must be at least 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (status !== "idle") return;
    if (!validate()) {
      setErrorShake((s) => s + 1);
      return;
    }
    setStatus("loading");
    
    const post = async (path, body) => {
      try {
        const r = await fetch(apiBase + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), credentials: 'include' });
        const d = await r.json().catch(() => ({}));
        return { ok: r.ok, d };
      } catch {
        return { ok: false, d: { error: 'Could not reach the API server. Make sure it is running.' } };
      }
    };
    try {
      let r = await post('/api/auth/login', { email, password });
      if (mode === 'register') {
        const reg = await post('/api/auth/register', { name: email.split('@')[0], email, password });
        if (!reg.ok) {
          setErrors({ email: reg.d.error || 'Registration failed.' });
          setStatus("idle");
          return;
        }
        r = await post('/api/auth/login', { email, password });
      }
      
      if (!r.ok) {
        setErrors({ email: r.d.error || 'Sign in failed.' });
        setStatus("idle");
        return;
      }
      
      setStatus("success");
      setTimeout(() => {
        const a = { user: r.d.user, accessToken: r.d.accessToken };
        sessionStorage.setItem('nts-auth', JSON.stringify(a));
        if (onAuth) onAuth(a);
      }, 800);

    } catch {
      setErrors({ email: 'Something went wrong while signing in. Please try again.' });
      setStatus("idle");
    }

  };

  const fieldBase =
    "h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm text-ink placeholder:text-ink-soft/50 outline-none transition-all duration-200";

  return (
    <div className="form-scroll relative flex h-full flex-col overflow-y-auto bg-cream">
      {/* Ambient blob */}
      <div
        className="pointer-events-none absolute -top-40 right-0 h-[420px] w-[420px] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(201,241,105,0.20), rgba(31,164,95,0.08), transparent)",
        }}
      />

      {/* Top bar */}
      <header className="animate-fade-up relative z-10 flex items-center justify-between px-6 pt-6 sm:px-10 lg:px-12">
        <div className="lg:hidden">
          <Logo compact />
        </div>
        <a
          href="#"
          className="group hidden items-center gap-1.5 text-xs font-medium text-ink-soft transition-colors hover:text-ink lg:flex"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Back to website
        </a>
        <a
          href="#"
          className="flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-xs font-medium text-ink-soft transition-all hover:border-ink/25 hover:text-ink"
        >
          <CircleHelp className="h-3.5 w-3.5" />
          Need help?
        </a>
      </header>

      {/* Form body */}
      <main className="relative z-10 mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center px-6 py-12 sm:px-10 lg:px-12">
        <div className="animate-fade-up delay-100">
          <h2 className="font-display text-[2.5rem] font-medium leading-[1.05] tracking-tight text-ink">
            Welcome <span className="font-light italic text-leaf-600">back</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Sign in to sync your meals, pantry and progress — picked up right
            where you left off.
          </p>
        </div>

        {/* Social auth */}
        <div className="animate-fade-up delay-200 mt-8 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex h-11 items-center justify-center gap-2.5 rounded-xl border border-ink/10 bg-white text-sm font-medium text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-lg hover:shadow-ink/5 active:translate-y-0"
          >
            <GoogleIcon />
            Google
          </button>
          <button
            type="button"
            className="flex h-11 items-center justify-center gap-2.5 rounded-xl border border-ink/10 bg-white text-sm font-medium text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-lg hover:shadow-ink/5 active:translate-y-0"
          >
            <AppleIcon />
            Apple
          </button>
        </div>

        {/* Divider */}
        <div className="animate-fade-up delay-300 mt-7 flex items-center gap-4">
          <span className="h-px flex-1 bg-ink/10" />
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-ink-soft/70">
            or with email
          </span>
          <span className="h-px flex-1 bg-ink/10" />
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} noValidate className="animate-fade-up delay-400 mt-6 space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-[0.8rem] font-semibold text-ink"
            >
              Email address
            </label>
            <div className="relative">
              <Mail
                className={cn(
                  "pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 transition-colors duration-200",
                  errors.email ? "text-red-500" : "text-ink-soft/60"
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
                  if (errors.email) setErrors((er) => ({ ...er, email: undefined }));
                }}
                className={cn(
                  fieldBase,
                  errors.email
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    : "border-ink/10 focus:border-forest-800 focus:ring-4 focus:ring-forest-900/[0.07] hover:border-ink/20"
                )}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                <CircleAlert className="h-3.5 w-3.5" /> {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-[0.8rem] font-semibold text-ink"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className={cn(
                  "pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 transition-colors duration-200",
                  errors.password ? "text-red-500" : "text-ink-soft/60"
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
                  if (errors.password) setErrors((er) => ({ ...er, password: undefined }));
                }}
                onKeyUp={(e) => setCapsOn(e.getModifierState?.("CapsLock") ?? false)}
                onKeyDown={(e) => setCapsOn(e.getModifierState?.("CapsLock") ?? false)}
                className={cn(
                  fieldBase,
                  "pr-12",
                  errors.password
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    : "border-ink/10 focus:border-forest-800 focus:ring-4 focus:ring-forest-900/[0.07] hover:border-ink/20"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-ink-soft/70 transition-colors hover:bg-ink/5 hover:text-ink"
              >
                {showPw ? <EyeOff className="h-[17px] w-[17px]" /> : <Eye className="h-[17px] w-[17px]" />}
              </button>
            </div>
            {errors.password ? (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                <CircleAlert className="h-3.5 w-3.5" /> {errors.password}
              </p>
            ) : (
              capsOn && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-amber-600">
                  <CircleAlert className="h-3.5 w-3.5" /> Caps Lock is on
                </p>
              )
            )}
          </div>

          {/* Remember / forgot */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex cursor-pointer select-none items-center gap-2.5">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="grid h-[18px] w-[18px] place-items-center rounded-[6px] border border-ink/20 bg-white transition-all duration-200 peer-checked:border-forest-900 peer-checked:bg-forest-900 peer-focus-visible:ring-4 peer-focus-visible:ring-forest-900/15 [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
                <Check className="h-3 w-3 text-lime-glow transition-opacity duration-150" />
              </span>
              <span className="text-[0.8rem] font-medium text-ink-soft">Keep me signed in</span>
            </label>
            <a
              href="#"
              className="group text-[0.8rem] font-semibold text-leaf-600 transition-colors hover:text-forest-800"
            >
              Forgot password?
            </a>
          </div>

          {/* Error banner */}
          {(errors.email || errors.password) && (
            <div
              key={errorShake}
              className="shake flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
            >
              <CircleAlert className="h-4 w-4 shrink-0 text-red-500" />
              <p className="text-xs font-medium text-red-700">
                Please fix the highlighted fields to continue.
              </p>
            </div>
          )}

          {/* Success banner */}
          {status === "success" && (
            <div className="animate-fade-up flex items-center gap-2.5 rounded-xl border border-leaf-500/30 bg-leaf-500/10 px-4 py-3">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-leaf-600">
                <Check className="h-3 w-3 text-white" />
              </span>
              <p className="text-xs font-medium text-forest-800">
                Signed in — redirecting to your dashboard…
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status !== "idle"}
            className={cn(
              "btn-shine group relative mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition-all duration-300",
              status === "idle" &&
                "bg-forest-900 hover:-translate-y-0.5 hover:bg-forest-800 hover:shadow-xl hover:shadow-forest-900/25 active:translate-y-0",
              status === "loading" && "cursor-wait bg-forest-800",
              status === "success" && "cursor-default bg-leaf-600"
            )}
          >
            {status === "idle" && (
              <> {mode === "login" ? "Sign in" : "Create Account"} <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
            {status === "loading" && (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {mode === "login" ? "Signing you in..." : "Creating account..."}
              </>
            )}
            {status === "success" && (
              <>
                <Check className="h-4 w-4" /> {mode === "login" ? "Welcome back" : "Account created"} </>
            )}
          </button>
        </form>

        {/* Sign up */}
        <p className="animate-fade-up delay-500 mt-8 text-center text-sm text-ink-soft">
          {mode === "login" ? (<>New to NutriSync?{" "}<a href="#" onClick={(e)=>{e.preventDefault(); setMode("register");}} className="group font-semibold text-forest-900 underline decoration-leaf-500/40 decoration-2 underline-offset-4 transition-colors hover:decoration-leaf-500">Create your free account</a></>) : (<>Already have an account?{" "}<a href="#" onClick={(e)=>{e.preventDefault(); setMode("login");}} className="group font-semibold text-forest-900 underline decoration-leaf-500/40 decoration-2 underline-offset-4 transition-colors hover:decoration-leaf-500">Sign in to your account</a></>)}
        </p>
      </main>

      {/* Feature ticker */}
      <div className="animate-fade-in delay-600 relative z-10">
        <FeatureTicker />
      </div>
    </div>
  );
}
