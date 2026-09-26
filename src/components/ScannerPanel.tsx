import React, { useRef, useState, useEffect } from "react";
import {
  Camera,
  ImagePlus,
  ScanBarcode,
  Loader2,
  Check,
  RotateCcw,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Card, CardHead } from "./Charts";
import { cn } from "../utils/cn";

export function ScannerPanel({ m, upd, todayKey, apiBase }) {
  const [stage, setStage] = useState("ready"); // 'ready', 'captured', 'analyzing', 'done', 'error'
  const [img, setImg] = useState("");
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [savedMeals, setSavedMeals] = useState([]);
  const [saving, setSaving] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const inputRef = useRef(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => () => stopCamera(), []);

  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      setCameraActive(true);
      setStage('ready');
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch (e) {
      setCameraError('Could not access camera: ' + e.message);
      setStage('error');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth || v.clientWidth;
    c.height = v.videoHeight || v.clientHeight;
    c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
    const dataUrl = c.toDataURL('image/jpeg', 0.9);
    stopCamera();
    setImg(dataUrl);
    setFoods([]);
    setSavedMeals([]);
    setError('');
    setNote('');
    setStage('captured');
  };

  const retake = () => {
    setImg('');
    setFoods([]);
    setSavedMeals([]);
    setStage('ready');
  };

  const pick = e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      const orig = rd.result;
      setImg(orig);
      setError('');
      setNote('');
      setFoods([]);
      setSavedMeals([]);
      setStage('captured');
      
      const i = new Image();
      i.onload = () => {
        const MAX = 1600;
        const sc = Math.min(1, MAX / Math.max(i.naturalWidth, i.naturalHeight));
        if (sc >= 1) return;
        const cv = document.createElement('canvas');
        cv.width = Math.round(i.naturalWidth * sc);
        cv.height = Math.round(i.naturalHeight * sc);
        cv.getContext('2d').drawImage(i, 0, 0, cv.width, cv.height);
        setImg(cv.toDataURL('image/jpeg', 0.9));
      };
      i.src = orig;
    };
    rd.readAsDataURL(f);
  };

  const authFetch = async (path, opts = {}) => {
    const t = JSON.parse(sessionStorage.getItem('nts-auth') || '{}').accessToken || '';
    let r = await fetch(apiBase + path, {
      ...opts,
      headers: { ...opts.headers, 'Authorization': 'Bearer ' + t },
      credentials: 'include'
    });
    if (r.status === 401) {
      const rf = await fetch(apiBase + '/api/auth/refresh', { method: 'POST', credentials: 'include' });
      const d = await rf.json().catch(() => ({}));
      if (rf.ok && d.accessToken) {
        sessionStorage.setItem('nts-auth', JSON.stringify({ accessToken: d.accessToken, user: d.user }));
        r = await fetch(apiBase + path, {
          ...opts,
          headers: { ...opts.headers, 'Authorization': 'Bearer ' + d.accessToken },
          credentials: 'include'
        });
      }
    }
    return r;
  };

  const analyze = async () => {
    if (!img) return;
    setStage('analyzing');
    setError('');
    setNote('');
    try {
      const r = await authFetch('/api/food/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: img })
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        setError(d.error || 'Analysis failed.');
        setStage('error');
        return;
      }
      if (d.quality && (d.quality.blurry || d.quality.noFoodDetected)) {
        setNote(d.quality.blurry ? 'Image blurry - results may be inaccurate.' : 'No food detected.');
        if (!d.foods || !d.foods.length) {
          setStage('error');
          return;
        }
      }
      setFoods((d.foods || []).slice(0, 5));
      setStage('done');
    } catch {
      setError('Could not analyze the image. Check connection.');
      setStage('error');
    }
  };

  const saveMeal = async (food, idx) => {
    if (savedMeals.includes(idx)) return;
    setSaving(true);
    try {
      const r = await authFetch('/api/food/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealType: 'scanned',
          foodName: food.name,
          serving: food.serving,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          fiber: food.fiber || 0,
          sugar: food.sugar || 0,
          confidence: food.confidence || 0,
          imageUrl: null,
          loggedAt: new Date().toISOString()
        })
      });
      if (r.ok) {
        setSavedMeals([...savedMeals, idx]);
        const tk2 = todayKey();
        const day = m[tk2] || {};
        upd(tk2, {
          kcal: (+day.kcal || 0) + food.calories,
          protein: (+day.protein || 0) + food.protein,
          carbs: (+day.carbs || 0) + food.carbs,
          fat: (+day.fat || 0) + food.fat,
          water: (+day.water || 0)
        });
      }
    } catch {}
    setSaving(false);
  };

  const total = foods.reduce((s, d) => s + (d.calories || 0), 0);
  const totalProtein = foods.reduce((s, d) => s + (d.protein || 0), 0);

  return (
    <Card className="overflow-hidden">
      <CardHead
        eyebrow="Food scanner"
        title="Scan your food"
        hint="Open your camera or upload a photo to identify items"
        right={
          <span className="flex items-center gap-1.5 rounded-full bg-cream-dark px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-ink-soft">
            <ScanBarcode className="h-3 w-3" /> AI vision
          </span>
        }
      />

      {/* Viewfinder */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-forest-950">
        <canvas ref={canvasRef} className="hidden" />
        
        {cameraActive && stage === 'ready' && (
          <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
        )}
        
        {img && (
          <img
            src={img}
            alt="Captured food"
            className={cn(
              "h-full w-full object-cover transition-all duration-700",
              stage === "analyzing" && "scale-105 blur-[3px] brightness-75",
              stage === "done" && "blur-0"
            )}
          />
        )}

        {/* scan frame corners */}
        <div className="pointer-events-none absolute inset-5">
          {[
            "left-0 top-0 border-l-2 border-t-2 rounded-tl-lg",
            "right-0 top-0 border-r-2 border-t-2 rounded-tr-lg",
            "left-0 bottom-0 border-l-2 border-b-2 rounded-bl-lg",
            "right-0 bottom-0 border-r-2 border-b-2 rounded-br-lg",
          ].map((c) => (
            <span key={c} className={cn("absolute h-7 w-7 border-lime-glow/80", c)} />
          ))}
        </div>

        {/* scanning line */}
        {stage === "analyzing" && (
          <span className="scan-anim absolute left-5 right-5 h-0.5 bg-lime-glow shadow-[0_0_16px_4px_rgba(201,241,105,0.5)]" />
        )}

        {/* ready overlay */}
        {stage === "ready" && !cameraActive && !img && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-forest-950/55 backdrop-blur-[2px]">
            <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md">
              <Camera className="h-6 w-6 text-lime-glow" />
            </span>
            <p className="mt-4 font-display text-lg font-medium text-cream">
              Ready to scan
            </p>
            <p className="mt-1 text-xs text-cream/60">
              Take a photo or upload an image to identify your meal
            </p>
          </div>
        )}

        {/* analyzing overlay */}
        {stage === "analyzing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-lime-glow" />
            <p className="mt-3 text-sm font-medium text-cream">
              Analyzing your food...
            </p>
            <p className="mt-1 text-xs text-cream/55">
              Our AI is identifying the items in your photo
            </p>
          </div>
        )}

        {/* done badge */}
        {stage === "done" && (
          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-forest-950/80 px-3 py-1.5 backdrop-blur-md">
            <span className="grid h-4 w-4 place-items-center rounded-full bg-lime-glow">
              <Check className="h-2.5 w-2.5 text-forest-950" />
            </span>
            <span className="text-xs font-semibold text-cream">
              {foods.length} items detected
            </span>
          </div>
        )}

        {/* error state */}
        {stage === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-forest-950/70 p-4 text-center">
            <AlertCircle className="h-8 w-8 text-[#F0B366]" />
            <p className="mt-3 text-sm font-medium text-cream">{error || 'No food detected'}</p>
            <p className="mt-1 text-xs text-cream/55">
              {note || 'Try a clearer photo or a different angle'}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2.5">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={pick}
        />
        {stage === "ready" && !cameraActive && !img && (
          <button
            onClick={startCamera}
            className="btn-shine flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white bg-forest-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-800 hover:shadow-lg hover:shadow-forest-900/25"
          >
            <Camera className="h-4 w-4" /> Open Camera
          </button>
        )}
        {cameraActive && (
          <button
            onClick={capturePhoto}
            className="btn-shine flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white bg-forest-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-800 hover:shadow-lg hover:shadow-forest-900/25"
          >
            <Camera className="h-4 w-4" /> Capture Photo
          </button>
        )}
        {stage === "captured" && img && (
          <button
            onClick={analyze}
            className="btn-shine flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white bg-forest-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-800 hover:shadow-lg hover:shadow-forest-900/25"
          >
            <Sparkles className="h-4 w-4" /> Analyze Food
          </button>
        )}

        <button
          onClick={() => inputRef.current?.click()}
          disabled={stage === "analyzing"}
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-ink/10 bg-white px-4 text-sm font-semibold text-ink transition-all hover:border-ink/25 hover:shadow-md"
        >
          <ImagePlus className="h-4 w-4 text-ink-soft" />
          <span className="hidden sm:inline">Upload</span>
        </button>
        {(stage === "done" || stage === "error" || stage === "captured") && (
          <button
            onClick={retake}
            className="grid h-11 w-11 place-items-center rounded-xl border border-ink/10 bg-white text-ink-soft transition-all hover:border-ink/25 hover:text-ink"
            aria-label="Retake"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results */}
      {stage === "done" && (
        <div className="animate-fade-up mt-4 space-y-2">
          {foods.map((d, idx) => {
            const isSaved = savedMeals.includes(idx);
            return (
              <div
                key={idx}
                className={cn("flex items-center gap-3 rounded-xl bg-cream px-3.5 py-2.5", isSaved && "opacity-75")}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-leaf-500/12">
                  <Sparkles className="h-3.5 w-3.5 text-leaf-600" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{d.name}</p>
                  <p className="text-[0.68rem] text-ink-soft/75">
                    {d.serving} • {Math.round((d.confidence || 0) * 100)}% confident
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-ink">{d.calories}</p>
                  <p className="text-[0.62rem] text-ink-soft/70">{d.protein}g prot</p>
                </div>
                <button
                  onClick={() => saveMeal(d, idx)}
                  disabled={saving || isSaved}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.65rem] font-semibold transition-all duration-300",
                    isSaved
                      ? "bg-leaf-600 text-white"
                      : "bg-ink/5 text-ink hover:bg-ink/10"
                  )}
                >
                  {isSaved ? <Check className="h-3 w-3" /> : "Save"}
                </button>
              </div>
            );
          })}

          <div className="flex items-center justify-between rounded-xl border border-leaf-500/25 bg-leaf-500/[0.08] px-3.5 py-3 mt-4">
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-forest-800/70">
                Total
              </p>
              <p className="font-display text-lg font-semibold text-forest-800">
                {total} kcal • {totalProtein}g protein
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
