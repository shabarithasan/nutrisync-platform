import { cn } from "../utils/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={cn("h-9 w-9", className)}
      aria-hidden="true"
    >
      {/* Rounded square backdrop */}
      <rect
        x="1.5"
        y="1.5"
        width="37"
        height="37"
        rx="11"
        className="fill-forest-900"
      />
      <rect
        x="1.5"
        y="1.5"
        width="37"
        height="37"
        rx="11"
        stroke="url(#logoStroke)"
        strokeWidth="1.25"
      />
      {/* Leaf */}
      <path
        d="M20 29.5c0-6.5 3.2-11.4 9.5-13.5-.4 7.6-3.6 12.4-9.5 13.5Z"
        className="fill-lime-glow"
      />
      <path
        d="M20 29.5C13.9 28.4 10.6 23.7 10.2 16c6.4 2.1 9.8 7 9.8 13.5Z"
        className="fill-leaf-500"
      />
      {/* Stem */}
      <path
        d="M20 30V13.5"
        stroke="#F7F8F2"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="logoStroke"
          x1="2"
          y1="2"
          x2="38"
          y2="38"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C9F169" stopOpacity="0.9" />
          <stop offset="1" stopColor="#1FA45F" stopOpacity="0.9" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Logo({
  dark = false,
  compact = false,
}: {
  dark?: boolean;
  compact?: boolean;
}) {
  return (
    <a
      href="#"
      className="group inline-flex items-center gap-2.5"
      aria-label="NutriSync home"
    >
      <LogoMark className="h-9 w-9 transition-transform duration-500 group-hover:rotate-[8deg]" />
      <span
        className={cn(
          "font-display font-semibold tracking-tight",
          compact ? "text-lg" : "text-[1.35rem]",
          dark ? "text-cream" : "text-ink"
        )}
      >
        Nutri<span className={dark ? "text-lime-glow" : "text-leaf-600"}>Sync</span>
      </span>
    </a>
  );
}
