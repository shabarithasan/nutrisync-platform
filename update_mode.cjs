const fs = require('fs');
let code = fs.readFileSync('src/components/LoginForm.tsx', 'utf8');

code = code.replace('const [email, setEmail] = useState("");', 'const [email, setEmail] = useState("");\n  const [name, setName] = useState("");\n  const [mode, setMode] = useState<"login" | "register">("login");');
code = code.replace('const [errors, setErrors] = useState<{ email?: string; password?: string }>({});', 'const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});');
code = code.replace('const e: { email?: string; password?: string } = {};', 'const e: { email?: string; password?: string; name?: string } = {};\n    if (mode === "register" && !name.trim()) e.name = "Name is required";');

const nameField = \
            {/* Name */}
            {mode === "register" && (
              <div className="animate-fade-up">
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
\;
code = code.replace('{/* Email */}', nameField + '\n            {/* Email */}');

code = code.replace(/<h1[^>]*>[\\s\\S]*?Log in to your account[\\s\\S]*?<\\/h1>/, '<h1 className="font-display text-[2.25rem] leading-[1.05] tracking-[-0.02em] text-ink-900">{mode === "register" ? "Create an account" : "Log in to your account"}</h1>');
code = code.replace(/Log in\\s*<ArrowRight/, '{mode === "register" ? "Sign up" : "Log in"} <ArrowRight');

const footerRegex = /Don't have an account\\?[\\s\\S]*?Create your free account[\\s\\S]*?<\\/a>/;
const newFooter = \{mode === "login" ? (<>Don't have an account? <button type="button" onClick={(e) => { e.preventDefault(); setMode("register"); setStatus("idle"); setErrors({}); }} className="font-semibold text-ink-900 underline decoration-brand-500/40 decoration-2 underline-offset-[3px] transition-colors hover:decoration-brand-600">Create your free account</button></>) : (<>Already have an account? <button type="button" onClick={(e) => { e.preventDefault(); setMode("login"); setStatus("idle"); setErrors({}); }} className="font-semibold text-ink-900 underline decoration-brand-500/40 decoration-2 underline-offset-[3px] transition-colors hover:decoration-brand-600">Log in</button></>)}\;
code = code.replace(footerRegex, newFooter);

const forgotRegex = /<a[^>]*>\\s*Forgot password\\?\\s*<\\/a>/;
const newForgot = '<button type="button" onClick={(e) => { e.preventDefault(); alert("Demo Mode: Forgot password disabled."); }} className="text-[0.78rem] font-semibold text-brand-600 transition-colors hover:text-brand-700">Forgot password?</button>';
code = code.replace(forgotRegex, newForgot);

fs.writeFileSync('src/components/LoginForm.tsx', code);
