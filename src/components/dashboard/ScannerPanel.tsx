import { useRef, useState } from "react";
import {
  Camera,
  ImagePlus,
  Loader2,
  Check,
  RotateCcw,
  Sparkles,
  Info,
} from "lucide-react";
import { Card, CardHead, Chip } from "./Charts";
import { cn } from "../../utils/cn";

type Phase = "ready" | "analyzing" | "done";

const DETECTED = [
  { name: "Grilled chicken breast", portion: "140 g", kcal: 248, protein: 38, conf: 0.96 },
  { name: "Brown rice", portion: "1 cup", kcal: 178, protein: 4, conf: 0.91 },
  { name: "Steamed broccoli", portion: "1 cup", kcal: 55, protein: 4, conf: 0.88 },
];

export function ScannerPanel() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const analyze = () => {
    setPhase("analyzing");
    setSaved(false);
    window.setTimeout(() => setPhase("done"), 1900);
  };

  const totalKcal = DETECTED.reduce((s, d) => s + d.kcal, 0);
  const totalProtein = DETECTED.reduce((s, d) => s + d.protein, 0);
  const avgConf = DETECTED.reduce((s, d) => s + d.conf, 0) / DETECTED.length;

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHead
        title="Food scanner"
        meta="AI vision"
        hint="Capture or upload a photo to identify items"
        right={
          <Chip>
            <Info className="h-2.5 w-2.5" /> AI-estimated
          </Chip>
        }
      />

      {/* Viewfinder */}
      <div className="px-5 pt-4">
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-nav-950">
          <img
            src="/images/scan-preview.jpg"
            alt=""
            className={cn(
              "h-full w-full object-cover transition-all duration-500",
              phase === "analyzing" && "scale-[1.03] blur-[2px] brightness-[0.7]"
            )}
          />

          {/* Frame corners — thin */}
          <div className="pointer-events-none absolute inset-4">
            {[
              "left-0 top-0 border-l border-t rounded-tl",
              "right-0 top-0 border-r border-t rounded-tr",
              "left-0 bottom-0 border-l border-b rounded-bl",
              "right-0 bottom-0 border-r border-b rounded-br",
            ].map((c) => (
              <span
                key={c}
                className={cn(
                  "absolute h-5 w-5 border-white/45",
                  c,
                  phase === "analyzing" && "border-brand-500/80"
                )}
              />
            ))}
          </div>

          {/* Scan line */}
          {phase === "analyzing" && (
            <span className="scan-anim absolute left-4 right-4 h-px bg-brand-500 shadow-[0_0_12px_2px_rgba(18,160,108,0.45)]" />
          )}

          {/* Ready */}
          {phase === "ready" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-nav-950/45">
              <span className="grid h-12 w-12 place-items-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm">
                <Camera className="h-5 w-5 text-white" />
              </span>
              <p className="mt-3 text-[0.85rem] font-semibold text-white">
                Ready to scan
              </p>
              <p className="mt-1 text-[0.7rem] text-white/60">
                Position your plate within the frame
              </p>
            </div>
          )}

          {/* Analyzing */}
          {phase === "analyzing" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
              <p className="mt-2.5 text-[0.8rem] font-medium text-white">
                Identifying items…
              </p>
            </div>
          )}

          {/* Done badge */}
          {phase === "done" && (
            <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-md bg-nav-950/75 px-2 py-1 backdrop-blur-sm">
              <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-brand-500">
                <Check className="h-2 w-2 text-white" strokeWidth={3} />
              </span>
              <span className="tnum text-[0.7rem] font-semibold text-white">
                {DETECTED.length} items · {Math.round(avgConf * 100)}% confidence
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-5 pt-3.5">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={analyze}
        />
        <button
          onClick={analyze}
          disabled={phase === "analyzing"}
          className={cn(
            "flex h-10 flex-1 items-center justify-center gap-2 rounded-lg text-[0.8rem] font-semibold text-white transition-all duration-150",
            phase === "analyzing"
              ? "bg-brand-700"
              : "bg-brand-600 hover:bg-brand-700 active:scale-[0.99]"
          )}
        >
          {phase === "analyzing" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Camera className="h-3.5 w-3.5" />
          )}
          {phase === "analyzing" ? "Analyzing" : "Capture photo"}
        </button>

        <button
          onClick={() => inputRef.current?.click()}
          disabled={phase === "analyzing"}
          className="flex h-10 items-center gap-2 rounded-lg border border-ink-900/[0.09] bg-surface px-3.5 text-[0.8rem] font-semibold text-ink-700 transition-colors hover:border-ink-900/20 hover:text-ink-900"
        >
          <ImagePlus className="h-3.5 w-3.5 text-ink-500" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        {phase === "done" && (
          <button
            onClick={analyze}
            className="grid h-10 w-10 place-items-center rounded-lg border border-ink-900/[0.09] bg-surface text-ink-500 transition-colors hover:border-ink-900/20 hover:text-ink-900"
            aria-label="Scan again"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Results table */}
      {phase === "done" ? (
        <div className="animate-fade-up mt-4">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 border-b border-ink-900/[0.06] px-5 pb-2">
            {["Item", "Portion", "kcal", "Prot"].map((h, i) => (
              <span
                key={h}
                className={cn(
                  "text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-ink-400",
                  i === 0 ? "text-left" : "text-right"
                )}
              >
                {h}
              </span>
            ))}
          </div>

          {DETECTED.map((d) => (
            <div
              key={d.name}
              className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-3 border-b border-ink-900/[0.05] px-5 py-2.5"
            >
              <div className="flex min-w-0 items-center gap-2">
                <Sparkles className="h-3 w-3 shrink-0 text-brand-600" />
                <span className="truncate text-[0.8rem] font-medium text-ink-900">
                  {d.name}
                </span>
              </div>
              <span className="tnum w-14 text-right text-[0.72rem] text-ink-500">
                {d.portion}
              </span>
              <span className="tnum w-10 text-right text-[0.8rem] font-semibold text-ink-900">
                {d.kcal}
              </span>
              <span className="tnum w-10 text-right text-[0.72rem] text-ink-500">
                {d.protein}g
              </span>
            </div>
          ))}

          <div className="flex items-center justify-between px-5 py-3.5">
            <div>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-ink-400">
                Total
              </p>
              <p className="tnum mt-0.5 text-[1.1rem] font-semibold tracking-[-0.02em] text-ink-900">
                {totalKcal} kcal
                <span className="ml-1.5 text-[0.72rem] font-normal text-ink-400">
                  {totalProtein}g protein
                </span>
              </p>
            </div>
            <button
              onClick={() => setSaved(true)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.75rem] font-semibold transition-all duration-150 active:scale-[0.98]",
                saved
                  ? "bg-brand-100 text-brand-700"
                  : "bg-ink-900 text-white hover:bg-ink-800"
              )}
            >
              {saved ? (
                <>
                  <Check className="h-3 w-3" /> Saved
                </>
              ) : (
                "Save to meals"
              )}
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-3 px-5 pb-5 text-[0.68rem] leading-relaxed text-ink-400">
          Nutritional values are AI-estimated and may not be exact.
        </p>
      )}
    </Card>
  );
}
