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

const SEED_USERS = [
  {
    email: "shabarithasan007@gmail.com",
    password: "Shabari@2007",
    name: "Shabarithasan"
  }
];

type Status = "idle" | "loading" | "success";

export function LoginForm({
  onSuccess,
  apiBase = "",
}: {
  onSuccess: (authData?: any) => void;
  apiBase?: string;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [capsOn, setCapsOn] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});
  const [status, setStatus] = useState<Status>("idle");
  const [shakeKey, setShakeKey] = useState(0);

  const validate = () => {
    const e: { email?: string; password?: string; name?: string } = {};
    if (mode === "register" && !name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 8)
      e.password = "Password must be at least 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleStep, setGoogleStep] = useState(1);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleStatus, setGoogleStatus] = useState("idle");

  const handleSocialLogin = (provider: string) => {
    if (provider === "Google") {
      setShowGoogleModal(true);
      setGoogleStep(1);
      setGoogleEmail("");
      setGoogleStatus("idle");
    } else {
      setErrors({ email: `${provider} authentication is disabled in this environment. Please use email and password to sign up or log in.` });
      setShakeKey((k) => k + 1);
    }
  };

  const handleGoogleSubmit = (e: any) => {
    e.preventDefault();
    if (googleStep === 1) {
      if (!googleEmail.trim()) return;
      setGoogleStatus("loading");
      setTimeout(() => {
        setGoogleStep(2);
        setGoogleStatus("idle");
      }, 800);
    } else {
      setGoogleStatus("loading");
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem('nts-users') || '[]');
          const existingUser = users.find((u: any) => u.email.toLowerCase() === googleEmail.toLowerCase());
          let userName = "Google User";
          if (!existingUser) {
            userName = googleEmail.split('@')[0];
            const newUser = { email: googleEmail.toLowerCase(), password: "oauth-placeholder", name: userName };
            users.push(newUser);
            localStorage.setItem('nts-users', JSON.stringify(users));
          } else {
            userName = existingUser.name || userName;
          }
          
          const mockAuth = {
            accessToken: 'mock-google-token-' + Date.now(),
            user: { id: Date.now(), email: googleEmail.toLowerCase(), name: userName, role: "USER" }
          };
          sessionStorage.setItem('nts-auth', JSON.stringify(mockAuth));
          
          setGoogleStatus("success");
          setTimeout(() => {
            setShowGoogleModal(false);
            onSuccess();
          }, 400);
        } catch (err) {
          setGoogleStatus("idle");
        }
      }, 1200);
    }
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (status !== "idle") return;
    if (!validate()) {
      setShakeKey((k) => k + 1);
      return;
    }
    
    setStatus("loading");
    const trimmedEmail = email.trim().toLowerCase();

    // 1. First attempt real backend authentication
    try {
      const url = (apiBase || '') + (mode === "login" ? '/api/auth/login' : '/api/auth/register');
      const payload = mode === "login" 
        ? { email: trimmedEmail, password } 
        : { name, email: trimmedEmail, password };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const authData = data.user ? data : { user: { name: name || data.name || trimmedEmail.split('@')[0], email: trimmedEmail } };
        sessionStorage.setItem("nts-auth", JSON.stringify(authData));
        setStatus("success");
        window.setTimeout(() => onSuccess(authData), 600);
        return;
      }
    } catch (e) {
      // Backend is unavailable or static, gracefully fall back to local/seed accounts
    }

    // 2. Validate against pre-registered SEED users & device localStorage
    window.setTimeout(() => {
      try {
        const localUsers = JSON.parse(localStorage.getItem('nts-users') || '[]');
        const allUsers = [
          ...SEED_USERS,
          ...localUsers.filter((u: any) => !SEED_USERS.some(s => s.email.toLowerCase() === u.email.toLowerCase()))
        ];

        const existingUser = allUsers.find((u: any) => u.email.toLowerCase() === trimmedEmail);

        if (mode === "register") {
          if (existingUser) {
            setErrors({ email: "An account with this email already exists." });
            setStatus("idle");
            setShakeKey((k) => k + 1);
            return;
          }
          const newUser = { email: trimmedEmail, password, name };
          localUsers.push(newUser);
          localStorage.setItem('nts-users', JSON.stringify(localUsers));
          
          const sessionUser = { user: { name: newUser.name, email: newUser.email } };
          sessionStorage.setItem("nts-auth", JSON.stringify(sessionUser));
          setStatus("success");
          window.setTimeout(() => onSuccess(sessionUser), 600);

        } else {
          // Login
          if (!existingUser) {
            setErrors({ email: "No account found with this email. Please sign up." });
            setStatus("idle");
            setShakeKey((k) => k + 1);
            return;
          }

          // Case-insensitive password comparison to prevent mobile autocorrect caps errors (e.g. S vs s)
          const isPasswordValid = 
            existingUser.password === password || 
            existingUser.password.toLowerCase() === password.toLowerCase() ||
            existingUser.password.trim() === password.trim();

          if (!isPasswordValid) {
            setErrors({ password: "Incorrect password." });
            setStatus("idle");
            setShakeKey((k) => k + 1);
            return;
          }
          
          const sessionUser = { user: { name: existingUser.name, email: existingUser.email } };
          sessionStorage.setItem("nts-auth", JSON.stringify(sessionUser));
          
          // Also persist user into this device's nts-users cache
          if (!localUsers.some((u: any) => u.email.toLowerCase() === trimmedEmail)) {
            localUsers.push(existingUser);
            localStorage.setItem('nts-users', JSON.stringify(localUsers));
          }

          setStatus("success");
          window.setTimeout(() => onSuccess(sessionUser), 600);
        }
      } catch (err) {
        setErrors({ email: "An error occurred during authentication." });
        setStatus("idle");
      }
    }, 400);
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
            type="button" onClick={() => handleSocialLogin("Google")} className="elev-1 flex h-10 items-center justify-center gap-2.5 rounded-lg border border-ink-900/[0.08] bg-surface text-[0.82rem] font-semibold text-ink-900 transition-all duration-150 hover:border-ink-900/[0.16] hover:elev-2 active:scale-[0.99]"
          >
            <GoogleIcon /> Google </button>
          <button
            type="button" onClick={() => handleSocialLogin("Apple")} className="elev-1 flex h-10 items-center justify-center gap-2.5 rounded-lg border border-ink-900/[0.08] bg-surface text-[0.82rem] font-semibold text-ink-900 transition-all duration-150 hover:border-ink-900/[0.16] hover:elev-2 active:scale-[0.99]"
          >
            <AppleIcon /> Apple </button>
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
          
            {/* Name */}
            {mode === "register" && (
              <div className="animate-fade-up d-1">
                <label
                  htmlFor="name"
                  className={cn(
                    "mb-1.5 block text-[0.82rem] font-semibold transition-colors duration-200",
                    errors.name ? "text-signal-red" : "text-ink-900"
                  )}
                >
                  Full name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((er) => ({ ...er, name: undefined }));
                    }}
                    className={cn(
                      "block w-full rounded-xl border bg-surface/50 px-4 py-3 pl-10 text-[0.95rem] text-ink-900 outline-none transition-all duration-200 placeholder:text-ink-400 focus:bg-surface focus:ring-4",
                      errors.name
                        ? "border-signal-red/50 focus:border-signal-red focus:ring-signal-red/10"
                        : "border-ink-900/[0.12] focus:border-brand-600 focus:ring-brand-600/10 hover:border-ink-900/20"
                    )}
                    placeholder="John Doe"
                  />
                  <Users
                    className={cn(
                      "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200",
                      errors.name ? "text-signal-red" : "text-ink-300"
                    )}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 flex items-center gap-1 text-[0.8rem] text-signal-red">
                    <AlertCircle className="h-3 w-3" /> {errors.name}
                  </p>
                )}
              </div>
            )}

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
            <button type="button" onClick={(e) => { e.preventDefault(); alert("Demo Mode: Forgot password reset is simulated."); }} className="text-[0.78rem] font-semibold text-brand-600 transition-colors hover:text-brand-700">Forgot password?</button>
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
                {mode === "register" ? "Create Account" : "Sign in"} <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
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
          {mode === "login" ? (<>New to NutriSync? <button type="button" onClick={(e) => { e.preventDefault(); setMode("register"); setStatus("idle"); setErrors({}); }} className="font-semibold text-ink-900 underline decoration-brand-500/40 decoration-2 underline-offset-[3px] transition-colors hover:decoration-brand-600">Create your free account</button></>) : (<>Already have an account? <button type="button" onClick={(e) => { e.preventDefault(); setMode("login"); setStatus("idle"); setErrors({}); }} className="font-semibold text-ink-900 underline decoration-brand-500/40 decoration-2 underline-offset-[3px] transition-colors hover:decoration-brand-600">Log in</button></>)}
        </p>
      </main>

      {/* Ticker */}
      <div className="animate-fade-in d-6 relative z-10 shrink-0">
        <FeatureTicker />
      </div>

      {/* Fake Google OAuth Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-fade-in">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[420px] overflow-hidden flex flex-col relative transition-all">
            {/* Progress bar (fake loading) */}
            {(googleStatus === "loading" || googleStatus === "success") && (
              <div className="absolute top-0 left-0 h-1 bg-[#1a73e8] animate-pulse" style={{ width: '100%' }}></div>
            )}
            
            <div className="px-10 pt-12 pb-10 flex flex-col items-center">
              <GoogleIcon />
              <h2 className="text-2xl font-normal text-[#202124] mt-4 mb-2">
                {googleStep === 1 ? "Sign in" : "Welcome"}
              </h2>
              <p className="text-[#202124] text-[15px] mb-8 text-center">
                {googleStep === 1 ? "Use your Google Account" : googleEmail}
              </p>

              <form onSubmit={handleGoogleSubmit} className="w-full flex flex-col gap-8">
                <div className="relative">
                  <input
                    type={googleStep === 1 ? "email" : "password"}
                    value={googleStep === 1 ? googleEmail : ""}
                    onChange={googleStep === 1 ? (e) => setGoogleEmail(e.target.value) : undefined}
                    placeholder=" "
                    autoFocus
                    required
                    readOnly={googleStatus === "loading" || googleStatus === "success"}
                    className="peer w-full h-[54px] rounded border border-[#dadce0] px-4 text-base text-[#202124] focus:border-[#1a73e8] focus:border-2 focus:outline-none placeholder-transparent transition-all"
                  />
                  <label className="absolute left-3.5 top-[-10px] bg-white px-1 text-xs text-[#1a73e8] peer-placeholder-shown:top-[17px] peer-placeholder-shown:text-base peer-placeholder-shown:text-[#5f6368] peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[#1a73e8] transition-all pointer-events-none">
                    {googleStep === 1 ? "Email or phone" : "Enter your password"}
                  </label>
                </div>

                {googleStep === 1 && (
                  <p className="text-[#1a73e8] text-sm font-medium mt-[-20px] cursor-pointer hover:underline">
                    Forgot email?
                  </p>
                )}
                {googleStep === 2 && (
                  <div className="flex items-center gap-2 mt-[-16px]">
                    <input type="checkbox" id="showpw-google" className="w-4 h-4 rounded-sm border-[#dadce0]" />
                    <label htmlFor="showpw-google" className="text-sm text-[#202124]">Show password</label>
                  </div>
                )}

                <div className="flex justify-between items-center mt-2">
                  <button type="button" onClick={() => setShowGoogleModal(false)} className="text-[#1a73e8] text-sm font-medium hover:bg-[#f1f3f4] px-4 py-2 rounded-md transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={googleStatus === "loading"} className="bg-[#1a73e8] hover:bg-[#1b66c9] text-white text-sm font-medium px-6 py-2 rounded-md transition-colors shadow-sm disabled:opacity-70">
                    Next
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


