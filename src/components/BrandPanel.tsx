import { useEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import {
  Sparkles,
  Star,
  ScanBarcode,
  Clock,
  Flame,
  ArrowUpRight,
  Users,
} from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "../utils/cn";

/* ------------------------------------------------------------------ */
/*  Parallax layer stack: JS parallax → entrance → infinite float      */
/* ------------------------------------------------------------------ */

type Entry = { el: HTMLDivElement | null; depth: number };

function FloatCard({
  depth = 1,
  floatClass = "float-a",
  delay = "",
  className,
  children,
  registry,
}: {
  depth?: number;
  floatClass?: string;
  delay?: string;
  className?: string;
  children: ReactNode;
  registry: RefObject<Entry[]>;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const entry: Entry = { el: ref.current, depth };
    registry.current.push(entry);
    return () => {
      registry.current = registry.current.filter((e) => e !== entry);
    };
  }, [depth, registry]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      <div className={cn("animate-fade-up", delay)}>
        <div className={floatClass}>{children}</div>
      </div>
    </div>
  );
}

const glass =
  "rounded-xl border border-white/[0.11] bg-white/[0.055] shadow-2xl shadow-black/50 backdrop-blur-xl";

/* ------------------------------------------------------------------ */
/*  Calorie ring                                                        */
/* ------------------------------------------------------------------ */

function CalorieRing() {
  const pct = 0.76;
  const R = 44;
  const C = 2 * Math.PI * R;
  return (
    <div className="relative h-[104px] w-[104px]">
      <svg viewBox="0 0 104 104" className="h-full w-full -rotate-90">
        <circle
          cx="52"
          cy="52"
          r={R}
          fill="none"
          stroke="white"
          strokeOpacity="0.13"
          strokeWidth="7"
        />
        <circle
          cx="52"
          cy="52"
          r={R}
          fill="none"
          stroke="url(#loginRing)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - pct)}
          className="ring-draw"
          style={{ ["--dash-len" as string]: `${C}` }}
        />
        <defs>
          <linearGradient id="loginRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2FB98A" />
            <stop offset="100%" stopColor="#12A06C" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="tnum text-[1.4rem] font-semibold leading-none tracking-[-0.03em] text-white">
          1,840
        </span>
        <span className="mt-1 text-[0.58rem] font-medium text-white/45">
          of 2,400 kcal
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Macro bars                                                          */
/* ------------------------------------------------------------------ */

function MacroBars() {
  const macros = [
    { label: "Protein", value: "124g", pct: 0.78, color: "#2FB98A" },
    { label: "Carbs", value: "210g", pct: 0.64, color: "rgba(255,255,255,0.42)" },
    { label: "Fat", value: "62g", pct: 0.46, color: "#C08A4E" },
  ];
  return (
    <div className="w-[140px] space-y-2.5">
      {macros.map((m, i) => (
        <div key={m.label}>
          <div className="mb-1 flex items-baseline justify-between">
            <span className="text-[0.6rem] font-medium uppercase tracking-[0.08em] text-white/45">
              {m.label}
            </span>
            <span className="tnum text-[0.7rem] font-semibold text-white">
              {m.value}
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-white/[0.1]">
            <div
              className="bar-x h-full rounded-full"
              style={{
                width: `${m.pct * 100}%`,
                background: m.color,
                animationDelay: `${450 + i * 110}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Rotating testimonials                                               */
/* ------------------------------------------------------------------ */

const TESTIMONIALS = [
  {
    quote:
      "NutriSync turned my pantry into a personal chef. Zero food waste, zero guesswork.",
    name: "Maya Reyes",
    role: "Member since 2023",
  },
  {
    quote:
      "The barcode scan is sorcery — one beep and my entire week of meals rebalances.",
    name: "Daniel Okafor",
    role: "Pro member",
  },
  {
    quote:
      "Our whole family eats together now. The synced grocery list ended our Sunday chaos.",
    name: "Priya Sharma",
    role: "Family plan member",
  },
];

function Testimonial() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setIdx((i) => (i + 1) % TESTIMONIALS.length),
      5600
    );
    return () => clearInterval(t);
  }, []);
  const item = TESTIMONIALS[idx];

  return (
    <div className="max-w-[380px]">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3 w-3 fill-brand-500 text-brand-500" />
        ))}
        <span className="tnum ml-2 text-[0.68rem] font-medium text-white/40">
          4.9 · 12,400 reviews
        </span>
      </div>
      <div key={idx} className="animate-fade-in mt-3.5">
        <p className="font-display text-[1rem] font-light italic leading-relaxed text-white/85">
          “{item.quote}”
        </p>
        <p className="mt-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-white/35">
          {item.name} — {item.role}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Brand panel                                                         */
/* ------------------------------------------------------------------ */

export function BrandPanel() {
  const registry = useRef<Entry[]>([]);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const panel = document.getElementById("login-brand");
    if (!panel) return;
    let fine = window.matchMedia("(pointer: fine)").matches;

    const onMove = (e: MouseEvent) => {
      if (!fine) return;
      const r = panel.getBoundingClientRect();
      target.current.x = (e.clientX - r.left) / r.width - 0.5;
      target.current.y = (e.clientY - r.top) / r.height - 0.5;
    };
    const onResize = () => {
      fine = window.matchMedia("(pointer: fine)").matches;
    };
    const loop = () => {
      current.current.x += (target.current.x - current.current.x) * 0.055;
      current.current.y += (target.current.y - current.current.y) * 0.055;
      for (const { el, depth } of registry.current) {
        if (!el) continue;
        el.style.transform = `translate3d(${current.current.x * 14 * depth}px, ${
          current.current.y * 10 * depth
        }px, 0)`;
      }
      raf.current = requestAnimationFrame(loop);
    };

    panel.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);
    raf.current = requestAnimationFrame(loop);
    return () => {
      panel.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      id="login-brand"
      className="grain relative flex h-full flex-col overflow-hidden bg-nav-950"
    >
      <img
        src="/images/hero-bowl.jpg"
        alt=""
        className="animate-fade-in absolute inset-0 h-full w-full scale-105 object-cover object-center"
      />
      {/* Neutral legibility gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-nav-950/85 via-nav-950/45 to-nav-950/92" />
      <div className="absolute inset-0 bg-gradient-to-r from-nav-950/60 via-transparent to-nav-950/25" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 85% at 68% 18%, transparent 42%, rgba(9,15,13,0.6) 100%)",
        }}
      />

      <div className="relative z-10 flex h-full min-h-0 flex-col p-6 sm:p-8 lg:p-10 xl:p-12">
        {/* ---------------- Top bar ---------------- */}
        <div className="animate-fade-up flex shrink-0 items-center justify-between">
          <Logo dark />
          <div className="hidden items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.05] px-2.5 py-1.5 sm:flex">
            <span className="pulse-soft h-1.5 w-1.5 rounded-full bg-brand-500" />
            <span className="text-[0.68rem] font-medium text-white/60">
              v2.0 — AI Coach is live
            </span>
          </div>
        </div>

        {/* ---------------- Middle ---------------- */}
        <div className="flex min-h-0 flex-1 flex-col justify-end gap-5 pt-6 lg:flex-row lg:items-stretch lg:justify-between lg:gap-10 lg:pt-4 xl:gap-14">
          {/* Left: headline + social proof */}
          <div className="flex min-w-0 flex-1 flex-col justify-end gap-6 lg:justify-between lg:py-1">
            {/* Headline */}
            <div className="animate-fade-up d-1">
              <p className="mb-2.5 hidden items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-brand-500 sm:flex">
                <Sparkles className="h-3 w-3" />
                AI-powered nutrition
              </p>
              <h1 className="font-display text-[1.7rem] font-medium leading-[1.06] tracking-[-0.02em] text-white sm:text-[2.3rem] lg:text-[2.2rem] lg:leading-[1.04] xl:text-[2.7rem] 2xl:text-[3.1rem]">
                Eat smarter.
                <br />
                <span className="font-light italic text-brand-500">
                  Live brighter.
                </span>
              </h1>
              <p className="mt-3.5 hidden max-w-[320px] text-[0.82rem] leading-relaxed text-white/50 sm:block">
                Meal plans, pantry intelligence and progress — perfectly in sync,
                for you and everyone at your table.
              </p>
            </div>

            {/* Social proof */}
            <div className="animate-fade-up d-2">
              <div className="hidden lg:block">
                <Testimonial />
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.08] pt-4 lg:mt-6 lg:gap-x-7 lg:pt-5">
                {[
                  {
                    icon: Users,
                    value: "180k+",
                    label: "families",
                    hide: false,
                  },
                  {
                    icon: Star,
                    value: "4.9",
                    label: "rating",
                    fill: true,
                    hide: false,
                  },
                  {
                    icon: ScanBarcode,
                    value: "12M+",
                    label: "scans",
                    hide: true,
                  },
                ].map((s) => (
                  <span
                    key={s.label}
                    className={cn(
                      "flex items-center gap-1.5",
                      s.hide && "hidden sm:flex"
                    )}
                  >
                    <s.icon
                      className={cn(
                        "h-3.5 w-3.5 text-brand-500",
                        s.fill && "fill-brand-500"
                      )}
                    />
                    <span className="tnum text-[0.8rem] font-semibold text-white">
                      {s.value}
                    </span>
                    <span className="text-[0.7rem] text-white/40">
                      {s.label}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: bounded card rail — can never collide with the headline */}
          <div className="hidden w-[268px] shrink-0 flex-col justify-center gap-3.5 lg:flex xl:w-[296px] xl:gap-4">
            {/* Calorie ring */}
            <FloatCard
              depth={1.4}
              floatClass="float-a"
              delay="d-3"
              className="self-end"
              registry={registry}
            >
              <div className={cn(glass, "w-[152px] p-4")}>
                <div className="mb-2.5 flex items-center gap-1.5">
                  <Flame className="h-3 w-3 text-brand-500" />
                  <span className="text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-white/50">
                    Today
                  </span>
                </div>
                <CalorieRing />
                <p className="tnum mt-2.5 text-center text-[0.6rem] font-medium text-white/35">
                  76% of 2,400 kcal goal
                </p>
              </div>
            </FloatCard>

            {/* Macros */}
            <FloatCard
              depth={0.9}
              floatClass="float-b"
              delay="d-5"
              className="self-start"
              registry={registry}
            >
              <div className={cn(glass, "p-4")}>
                <p className="mb-3 text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-white/50">
                  Macros · balanced
                </p>
                <MacroBars />
              </div>
            </FloatCard>

            {/* AI suggestion */}
            <FloatCard
              depth={1.8}
              floatClass="float-c"
              delay="d-4"
              className="self-end"
              registry={registry}
            >
              <div className={cn(glass, "w-full p-3.5")}>
                <div className="flex items-center gap-3">
                  <img
                    src="/images/meal-thumb.jpg"
                    alt=""
                    className="h-11 w-11 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="flex items-center gap-1 text-[0.58rem] font-semibold uppercase tracking-[0.08em] text-brand-500">
                      <Sparkles className="h-2.5 w-2.5" /> AI suggests
                    </p>
                    <p className="mt-0.5 truncate text-[0.8rem] font-semibold text-white">
                      Pesto Salmon Bowl
                    </p>
                    <p className="tnum mt-0.5 flex items-center gap-1 text-[0.62rem] text-white/45">
                      <Clock className="h-2.5 w-2.5" /> 25 min · 520 kcal
                    </p>
                  </div>
                </div>
                <div className="mt-2.5 flex items-center justify-between rounded-lg bg-white/[0.05] px-3 py-1.5">
                  <span className="text-[0.66rem] font-medium text-white/55">
                    Pantry match
                  </span>
                  <span className="tnum flex items-center gap-0.5 text-[0.7rem] font-semibold text-brand-500">
                    92% <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </FloatCard>

            {/* Scan pill */}
            <FloatCard
              depth={1.1}
              floatClass="float-b"
              delay="d-6"
              className="self-start"
              registry={registry}
            >
              <div
                className={cn(
                  glass,
                  "relative flex items-center gap-3 overflow-hidden py-2 pl-2.5 pr-4"
                )}
              >
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-brand-500/15">
                  <ScanBarcode className="h-3.5 w-3.5 text-brand-500" />
                  <span className="scan-anim absolute left-1 right-1 h-px bg-brand-500/80" />
                </div>
                <div>
                  <p className="text-[0.72rem] font-semibold text-white">
                    Greek Yogurt
                  </p>
                  <p className="tnum text-[0.6rem] text-white/40">
                    130 kcal · scanned just now
                  </p>
                </div>
              </div>
            </FloatCard>
          </div>
        </div>
      </div>
    </div>
  );
}
