import { useState } from "react";
import { BrandPanel } from "./components/BrandPanel";
import { LoginForm } from "./components/LoginForm";
import { DashboardView } from "./components/dashboard/DashboardView";

export default function App() {
  const [authed, setAuthed] = useState(false);

  /* ---------- Unauthenticated: split-screen sign-in ---------- */
  if (!authed) {
    return (
      <div className="min-h-screen bg-canvas lg:h-screen lg:overflow-hidden">
        <div className="grid min-h-screen grid-cols-1 lg:h-screen lg:grid-cols-[minmax(0,57fr)_minmax(0,43fr)] xl:grid-cols-[minmax(0,54fr)_minmax(0,46fr)]">
          <div className="relative h-[300px] sm:h-[380px] lg:h-full lg:min-h-0">
            <BrandPanel />
          </div>
          <div className="min-h-0 min-w-0 lg:h-full">
            <LoginForm onSuccess={() => setAuthed(true)} apiBase={import.meta.env.PROD ? '' : 'http://localhost:4000'} />
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Authenticated: dashboard ---------- */
  return <DashboardView onSignOut={() => setAuthed(false)} />;
}

