import { useEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import {
  Sparkles,
  Star,
  Users,
  ScanBarcode,
  Clock,
  Flame,
  ArrowUpRight,
} from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "../utils/cn";

/* ------------------------------------------------------------------ */
/*  Floating glass card wrapper (parallax depth + gentle float)        */
/* ------------------------------------------------------------------ */
function FloatCard({
  depth = 1,
  floatClass = "animate-float-slow",
  enterDelay = "",
  className,
  children,
  parallaxRefs,
}: {
  depth?: number;
  floatClass?: string;
  enterDelay?: string;
  className?: string;
  children: ReactNode;
  parallaxRefs: RefObject<{ el: HTMLDivElement | null; depth: number }[]>;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const entry = { el: ref.current, depth };
    parallaxRefs.current.push(entry);
    return () => {
      parallaxRefs.current = parallaxRefs.current.filter((e) => e !== entry);
    };
  }, [depth, parallaxRefs]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {/* Entrance layer (fills to identity, so it never fights the layers around it) */}
      <div className={cn("animate-fade-up", enterDelay)}>
        {/* Infinite float layer */}
        <div className={floatClass}>{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated calorie ring                                              */
/* ------------------------------------------------------------------ */
function CalorieRing() {
  const pct = 0.76;
  const C = 2 * Math.PI * 50;
  return (
    <div className="relative h-[104px] w-[104px]">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="rgba(247,248,242,0.14)"
          strokeWidth="9"
        />
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - pct)}
          className="ring-anim"
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#C9F169" />
            <stop offset="100%" stopColor="#1FA45F" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[1.35rem] font-semibold leading-none text-cream">
          1,840
        </span>
        <span className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.14em] text-cream/60">
          kcal today
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Macro bars                                                         */
/* ------------------------------------------------------------------ */
function MacroBars() {
  const macros = [
    { label: "Protein", value: "124g", pct: 0.78, color: "#C9F169" },
    { label: "Carbs", value: "210g", pct: 0.64, color: "#34C37D" },
    { label: "Fat", value: "62g", pct: 0.46, color: "#9DB8A6" },
  ];
  return (
    <div className="space-y-3">
      {macros.map((m, i) => (
        <div key={m.label} className="w-36">
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.12em] text-cream/60">
              {m.label}
            </span>
            <span className="text-xs font-semibold text-cream">{m.value}</span>
          </div>
          <div className="h-[5px] overflow-hidden rounded-full bg-white/10">
            <div
              className="bar-anim h-full rounded-full"
              style={{
                width: `${m.pct * 100}%`,
                background: m.color,
                animationDelay: `${700 + i * 150}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Rotating testimonials                                              */
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
    const t = setInterval(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), 5200);
    return () => clearInterval(t);
  }, []);
  const item = TESTIMONIALS[idx];
  return (
    <div className="max-w-md">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-lime-glow text-lime-glow" />
        ))}
        <span className="ml-2 text-xs font-medium text-cream/60">4.9 · 12,400 reviews</span>
      </div>
      <div key={idx} className="animate-fade-in mt-4">
        <p className="font-display text-[1.05rem] font-light italic leading-relaxed text-cream/90">
          “{item.quote}”
        </p>
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-cream/50">
          {item.name} — {item.role}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Brand panel                                                        */
/* ------------------------------------------------------------------ */
export function BrandPanel() {
  const parallaxRefs = useRef<{ el: HTMLDivElement | null; depth: number }[]>([]);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const panel = document.getElementById("brand-panel");
    if (!panel) return;

    let enabled = window.matchMedia("(pointer: fine)").matches;

    const onMove = (e: MouseEvent) => {
      if (!enabled) return;
      const rect = panel.getBoundingClientRect();
      target.current.x = (e.clientX - rect.left) / rect.width - 0.5;
      target.current.y = (e.clientY - rect.top) / rect.height - 0.5;
    };

    const loop = () => {
      // Lerp toward target for buttery motion
      current.current.x += (target.current.x - current.current.x) * 0.06;
      current.current.y += (target.current.y - current.current.y) * 0.06;
      for (const { el, depth } of parallaxRefs.current) {
        if (!el) continue;
        const tx = current.current.x * 18 * depth;
        const ty = current.current.y * 14 * depth;
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      }
      raf.current = requestAnimationFrame(loop);
    };

    const onResize = () => {
      enabled = window.matchMedia("(pointer: fine)").matches;
    };

    panel.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);
    raf.current = requestAnimationFrame(loop);
    return () => {
      panel?.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      id="brand-panel"
      className="grain relative flex h-full flex-col overflow-hidden bg-forest-950"
    >
      {/* Photography */}
      <img
        src="/images/hero-bowl.jpg"
        alt="Fresh green nourish bowl"
        className="animate-fade-in absolute inset-0 h-full w-full scale-105 object-cover object-center"
      />
      {/* Legibility gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/80 via-forest-950/35 to-forest-950/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-950/55 via-transparent to-forest-950/25" />
      {/* Soft vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 70% 20%, transparent 40%, rgba(5,26,18,0.55) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-10 lg:min-h-[620px] lg:p-12">
        {/* Top bar */}
        <div className="animate-fade-up flex items-center justify-between">
          <Logo dark />
          <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 backdrop-blur-md sm:flex">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-lime-glow" />
            <span className="text-[0.7rem] font-medium tracking-wide text-cream/80">
              v2.0 — AI Coach is live
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="animate-fade-up delay-100 mt-8 lg:mt-0">
          <p className="mb-3 hidden items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-lime-glow sm:flex">
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered nutrition
          </p>
          <h1 className="font-display text-[2rem] font-medium leading-[1.04] tracking-tight text-cream sm:text-[2.9rem] lg:text-[3.4rem]">
            Eat smarter.
            <br />
            <span className="font-light italic text-lime-glow">Live brighter.</span>
          </h1>
          <p className="mt-4 hidden max-w-sm text-sm leading-relaxed text-cream/65 sm:block sm:text-[0.95rem]">
            Meal plans, pantry intelligence and progress — perfectly in sync,
            for you and everyone at your table.
          </p>
        </div>

        {/* Floating cards — desktop only */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          {/* Calorie ring card */}
          <FloatCard
            depth={1.4}
            floatClass="animate-float-slow"
            className="animate-fade-up delay-300 absolute right-14 top-[16%]"
            parallaxRefs={parallaxRefs}
          >
            <div className="pointer-events-auto rounded-2xl border border-white/12 bg-white/[0.07] p-5 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="mb-3 flex items-center gap-2">
                <Flame className="h-3.5 w-3.5 text-lime-glow" />
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-cream/70">
                  Today
                </span>
              </div>
              <CalorieRing />
              <p className="mt-3 text-center text-[0.65rem] font-medium tracking-wide text-cream/50">
                76% of 2,400 kcal goal
              </p>
            </div>
          </FloatCard>

          {/* Macros card */}
          <FloatCard
            depth={0.9}
            floatClass="animate-float-med"
            enterDelay="delay-500"
            className="absolute left-12 top-[42%]"
            parallaxRefs={parallaxRefs}
          >
            <div className="pointer-events-auto rounded-2xl border border-white/12 bg-white/[0.07] p-5 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-cream/70">
                Macros · balanced
              </p>
              <MacroBars />
            </div>
          </FloatCard>

          {/* AI suggestion card */}
          <FloatCard
            depth={1.8}
            floatClass="animate-float-fast"
            className="animate-fade-up delay-400 absolute bottom-[19%] right-16"
            parallaxRefs={parallaxRefs}
          >
            <div className="pointer-events-auto w-64 rounded-2xl border border-white/12 bg-white/[0.07] p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <img
                  src="/images/meal-thumb.jpg"
                  alt="Pesto salmon bowl"
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-lime-glow">
                    <Sparkles className="h-3 w-3" /> AI suggests
                  </p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-cream">
                    Pesto Salmon Bowl
                  </p>
                  <p className="flex items-center gap-1 text-[0.7rem] text-cream/55">
                    <Clock className="h-3 w-3" /> 25 min · 520 kcal
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-forest-900/70 px-3 py-2">
                <span className="text-[0.7rem] font-medium text-cream/75">
                  Pantry match
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-lime-glow">
                  92% <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </FloatCard>

          {/* Scan pill */}
          <FloatCard
            depth={1.1}
            floatClass="animate-float-med"
            enterDelay="delay-600"
            className="absolute bottom-[13%] left-14"
            parallaxRefs={parallaxRefs}
          >
            <div className="pointer-events-auto relative flex items-center gap-3 overflow-hidden rounded-full border border-white/12 bg-white/[0.07] py-2.5 pl-3 pr-5 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-lime-glow/15">
                <ScanBarcode className="h-4.5 w-4.5 text-lime-glow" />
                <span className="scan-anim absolute left-1 right-1 h-px bg-lime-glow/80" />
              </div>
              <div>
                <p className="text-xs font-semibold text-cream">Greek Yogurt</p>
                <p className="text-[0.65rem] text-cream/55">130 kcal · scanned just now</p>
              </div>
            </div>
          </FloatCard>
        </div>

        {/* Testimonial + stats */}
        <div className="animate-fade-up delay-200 relative z-10 mt-6 lg:mt-0">
          <div className="hidden lg:block">
            <Testimonial />
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-4 lg:mt-8 lg:gap-x-8 lg:gap-y-3 lg:pt-6">
            <span className="flex items-center gap-2 text-cream/70">
              <Users className="h-4 w-4 text-lime-glow" />
              <span className="text-sm font-semibold text-cream">180k+</span>
              <span className="text-xs">families</span>
            </span>
            <span className="flex items-center gap-2 text-cream/70">
              <Star className="h-4 w-4 fill-lime-glow text-lime-glow" />
              <span className="text-sm font-semibold text-cream">4.9</span>
              <span className="text-xs">app rating</span>
            </span>
            <span className="flex items-center gap-2 text-cream/70">
              <ScanBarcode className="h-4 w-4 text-lime-glow" />
              <span className="text-sm font-semibold text-cream">12M+</span>
              <span className="text-xs">foods scanned</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
