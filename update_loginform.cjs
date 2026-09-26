const fs = require('fs');
let code = fs.readFileSync('src/components/LoginForm.jsx', 'utf8');

code = code.replace(/useState<.*?>/g, 'useState');
code = code.replace(/const e: \{ email\?: string; password\?: string \} = \{\};/g, 'const e = {};');
code = code.replace(/const onSubmit = \(ev: FormEvent\) => \{/g, 'const onSubmit = async (ev) => {');

// We also want it to actually call the API.
// In LoginForm, we will add props `onAuth`.
code = code.replace(/export function LoginForm\(\) \{/g, "export function LoginForm({ onAuth, apiBase = '' }) {\n  const [mode, setMode] = useState('login');");

// The old login API code:
const apiCallCode = `
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
`;

// Replace `window.setTimeout(() => setStatus("success"), 1700);` with the API call.
code = code.replace(/window\.setTimeout\(\(\) => setStatus\("success"\), 1700\);/g, apiCallCode);

// There is a "Create your free account" link. We should make it toggle `mode` between 'login' and 'register'.
// Also the sign in button text should reflect the mode.
code = code.replace(/>\s*Sign in\s*</, '> {mode === "login" ? "Sign in" : "Create Account"} <');
code = code.replace(/Signing you in…/g, '{mode === "login" ? "Signing you in..." : "Creating account..."}');
code = code.replace(/>\s*Welcome back\s*</, '> {mode === "login" ? "Welcome back" : "Account created"} <');
code = code.replace(/New to NutriSync\?\{" "\}\s*<a[\s\S]*?href="#"[\s\S]*?>\s*Create your free account\s*<\/a>/, '{mode === "login" ? (<>New to NutriSync?{" "}<a href="#" onClick={(e)=>{e.preventDefault(); setMode("register");}} className="group font-semibold text-forest-900 underline decoration-leaf-500/40 decoration-2 underline-offset-4 transition-colors hover:decoration-leaf-500">Create your free account</a></>) : (<>Already have an account?{" "}<a href="#" onClick={(e)=>{e.preventDefault(); setMode("login");}} className="group font-semibold text-forest-900 underline decoration-leaf-500/40 decoration-2 underline-offset-4 transition-colors hover:decoration-leaf-500">Sign in to your account</a></>)}');

code = code.replace(/Sign in to NutriSync/g, '{mode === "login" ? "Sign in to NutriSync" : "Create your account"}');
code = code.replace(/Welcome back! Please enter your details/g, '{mode === "login" ? "Welcome back! Please enter your details." : "Join us to start your personalized nutrition plan."}');

fs.writeFileSync('src/components/LoginForm.jsx', code);
