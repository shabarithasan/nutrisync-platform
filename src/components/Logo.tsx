import { cn } from "../utils/cn";

/**
 * NutriSync mark — solid emerald tile with a crisp leaf glyph.
 * Reads cleanly on both dark and light surfaces.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("h-7 w-7", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="9" className="fill-brand-600" />
      {/* Leaf */}
      <path
        d="M16 23.5c0-4.9 2.4-8.6 7.2-10.2-.3 5.8-2.7 9.4-7.2 10.2Z"
        className="fill-white"
      />
      <path
        d="M16 23.5c-4.6-.8-7.1-4.3-7.4-10.1 4.9 1.6 7.4 5.3 7.4 10.1Z"
        className="fill-white/55"
      />
      {/* Stem */}
      <path
        d="M16 24V11"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
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
      <LogoMark className="h-8 w-8 transition-transform duration-300 group-hover:rotate-[6deg]" />
      <span
        className={cn(
          "font-display font-semibold tracking-tight",
          compact ? "text-lg" : "text-[1.3rem]",
          dark ? "text-white" : "text-ink-900"
        )}
      >
        Nutri<span className={dark ? "text-brand-500" : "text-brand-700"}>Sync</span>
      </span>
    </a>
  );
}
