import {
  LayoutDashboard,
  ScanBarcode,
  Calculator,
  Sparkles,
  Utensils,
  ChartNoAxesColumn,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  Bell,
  Search,
  Flame,
  Settings,
} from "lucide-react";
import { LogoMark } from "../Logo";
import { NAV_GROUPS, USER, type NavId } from "../../data/dashboardData";
import { cn } from "../../utils/cn";

const ICONS: Record<string, typeof LayoutDashboard> = {
  LayoutDashboard,
  ScanBarcode,
  Calculator,
  Sparkles,
  Utensils,
  ChartNoAxesColumn,
};

/* ------------------------------------------------------------------ */
/*  Sidebar                                                            */
/* ------------------------------------------------------------------ */

export function Sidebar({
  active,
  onChange,
  collapsed,
  onToggle,
  onSignOut,
}: {
  active: NavId;
  onChange: (id: NavId) => void;
  collapsed: boolean;
  onToggle: () => void;
  onSignOut: () => void;
}) {
  return (
    <aside
      className={cn(
        "relative z-30 hidden flex-shrink-0 flex-col bg-nav-950 transition-[width] duration-200 ease-out md:flex",
        collapsed ? "w-[68px]" : "w-[236px]"
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          "flex h-14 shrink-0 items-center gap-2.5 border-b border-white/[0.07] px-4",
          collapsed && "justify-center px-0"
        )}
      >
        <LogoMark className="h-7 w-7 shrink-0" />
        {!collapsed && (
          <span className="text-[0.95rem] font-semibold tracking-[-0.01em] text-white">
            Nutri<span className="text-brand-500">Sync</span>
          </span>
        )}
      </div>

      {/* Nav groups */}
      <nav className="hide-scroll flex-1 overflow-y-auto px-2.5 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-5 last:mb-0">
            {!collapsed && (
              <p className="px-2.5 pb-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-white/30">
                {group.label}
              </p>
            )}
            {collapsed && <div className="mx-2 mb-3 h-px bg-white/[0.07]" />}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = ICONS[item.icon];
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onChange(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "group relative flex w-full items-center gap-2.5 rounded-lg py-2 text-left text-[0.8rem] font-medium transition-colors duration-150",
                      collapsed ? "justify-center px-0" : "px-2.5",
                      isActive
                        ? "bg-white/[0.08] text-white"
                        : "text-white/50 hover:bg-white/[0.04] hover:text-white/85"
                    )}
                  >
                    {/* active rail */}
                    <span
                      className={cn(
                        "absolute left-0 h-4 w-[2px] rounded-r-full bg-brand-500 transition-opacity duration-150",
                        isActive ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isActive ? "text-brand-500" : "text-white/45"
                      )}
                    />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className="tnum rounded bg-white/[0.09] px-1.5 py-px text-[0.62rem] font-semibold text-white/60">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Streak */}
      {!collapsed && (
        <div className="mx-2.5 mb-2.5 rounded-lg border border-white/[0.07] bg-white/[0.03] p-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-white/35">
              <Flame className="h-3 w-3" /> Streak
            </span>
            <span className="tnum text-[0.72rem] font-semibold text-white">
              14d
            </span>
          </div>
          <div className="mt-2.5 flex gap-1">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span
                key={i}
                className={cn(
                  "grid h-4 flex-1 place-items-center rounded-[3px] text-[0.52rem] font-semibold",
                  i < 6
                    ? "bg-brand-500/85 text-white"
                    : "bg-white/[0.08] text-white/35"
                )}
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer actions */}
      <div className="border-t border-white/[0.07] p-2.5">
        <button
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg py-2 text-[0.8rem] font-medium text-white/40 transition-colors hover:bg-white/[0.04] hover:text-white/80",
            collapsed ? "justify-center px-0" : "px-2.5"
          )}
          title="Settings"
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!collapsed && "Settings"}
        </button>

        <div
          className={cn(
            "mt-1.5 flex items-center gap-2.5 rounded-lg py-1.5 transition-colors hover:bg-white/[0.04]",
            collapsed ? "justify-center px-0" : "px-2.5"
          )}
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-600 text-[0.68rem] font-bold text-white">
            {USER.initials}
          </span>
          {!collapsed && (
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.78rem] font-semibold text-white">
                {USER.name}
              </span>
              <span className="block truncate text-[0.62rem] text-white/40">
                {USER.plan} plan
              </span>
            </span>
          )}
        </div>

        <button
          onClick={onSignOut}
          className={cn(
            "mt-0.5 flex w-full items-center gap-2.5 rounded-lg py-2 text-[0.8rem] font-medium text-white/40 transition-colors hover:bg-white/[0.04] hover:text-white/80",
            collapsed ? "justify-center px-0" : "px-2.5"
          )}
          title="Sign out"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && "Sign out"}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-16 hidden h-6 w-6 place-items-center rounded-full border border-ink-900/[0.08] bg-surface text-ink-400 shadow-sm transition-colors hover:text-ink-900 lg:grid"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronsRight className="h-3 w-3" />
        ) : (
          <ChevronsLeft className="h-3 w-3" />
        )}
      </button>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile nav                                                         */
/* ------------------------------------------------------------------ */

export function MobileNav({
  active,
  onChange,
}: {
  active: NavId;
  onChange: (id: NavId) => void;
}) {
  return (
    <nav className="hide-scroll sticky top-14 z-20 flex gap-1.5 overflow-x-auto border-b border-ink-900/[0.06] bg-canvas/90 px-4 py-2 backdrop-blur-md md:hidden">
      {NAV_GROUPS.flatMap((g) => g.items).map((item) => {
        const Icon = ICONS[item.icon];
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.75rem] font-semibold transition-colors duration-150",
              isActive
                ? "bg-ink-900 text-white"
                : "border border-ink-900/[0.07] bg-surface text-ink-500"
            )}
          >
            <Icon
              className={cn("h-3.5 w-3.5", isActive && "text-brand-500")}
            />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Topbar                                                             */
/* ------------------------------------------------------------------ */

const PAGE_TITLES: Record<NavId, string> = {
  dashboard: "Dashboard",
  scanner: "Food Scanner",
  calculator: "Calculator",
  coach: "AI Coach",
  meals: "My Meals",
  reports: "Reports",
};

export function Topbar({ active }: { active: NavId }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-ink-900/[0.06] bg-canvas/85 px-4 backdrop-blur-md sm:px-6">
      {/* Mobile brand */}
      <div className="flex items-center gap-2 md:hidden">
        <LogoMark className="h-6 w-6" />
      </div>

      {/* Breadcrumb */}
      <div className="hidden items-center gap-2 md:flex">
        <span className="text-[0.78rem] text-ink-400">Workspace</span>
        <span className="text-ink-300">/</span>
        <span className="text-[0.78rem] font-semibold text-ink-900">
          {PAGE_TITLES[active]}
        </span>
      </div>

      {/* Search */}
      <div className="relative ml-auto hidden w-full max-w-[280px] sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-300" />
        <input
          placeholder="Search…"
          className="h-9 w-full rounded-lg border border-ink-900/[0.08] bg-surface pl-9 pr-12 text-[0.8rem] text-ink-900 placeholder:text-ink-300 outline-none transition-colors hover:border-ink-900/[0.16] focus:border-brand-600"
        />
        <kbd className="tnum pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-ink-900/[0.08] bg-surface-3 px-1.5 py-px text-[0.6rem] font-medium text-ink-400">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:ml-0">
        <button
          className="relative grid h-9 w-9 place-items-center rounded-lg border border-ink-900/[0.08] bg-surface text-ink-500 transition-colors hover:border-ink-900/[0.16] hover:text-ink-900"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand-600 ring-2 ring-canvas" />
        </button>

        <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-[0.75rem] font-bold text-white md:hidden">
          {USER.initials}
        </span>
      </div>
    </header>
  );
}
