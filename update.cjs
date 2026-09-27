const fs = require('fs');
let code = fs.readFileSync('src/components/LoginForm.tsx', 'utf8');

const fetchLogic = `
  const handleSocialLogin = () => {
    setStatus("loading");
    window.setTimeout(() => {
      setStatus("success");
      const fakeUser = { user: { name: "Demo User", email: "demo@nutrisync.app" } };
      sessionStorage.setItem("nts-auth", JSON.stringify(fakeUser));
      onSuccess(fakeUser);
    }, 900);
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
      let res = await fetch((apiBase || "") + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      if (res.status === 401) {
        const regRes = await fetch((apiBase || "") + "/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name: "Demo User" })
        });
        if (regRes.ok) {
           res = await fetch((apiBase || "") + "/api/auth/login", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ email, password })
           });
        }
      }
      
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
`;

const startIdx = code.indexOf('const onSubmit =');
const endString = 'setStatus("idle");\r\n    }\r\n  };';
const altEndString = 'setStatus("idle");\n    }\n  };';
let endIdx = code.indexOf(endString, startIdx);
if (endIdx === -1) endIdx = code.indexOf(altEndString, startIdx);
if (endIdx !== -1) {
    endIdx += (endIdx === code.indexOf(endString, startIdx) ? endString.length : altEndString.length);
    code = code.substring(0, startIdx) + fetchLogic + code.substring(endIdx);
}

code = code.replace(/type="button"\s+className="elev-1/g, 'type="button" onClick={handleSocialLogin} className="elev-1');

fs.writeFileSync('src/components/LoginForm.tsx', code);
