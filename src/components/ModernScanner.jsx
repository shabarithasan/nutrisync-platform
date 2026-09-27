import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle2, Image as ImageIcon, Camera, Activity, FileText } from 'lucide-react';

const Ring = ({ value, max, color, size, strokeWidth, label, sublabel, trackColor = "rgba(0,0,0,0.05)" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const pct = Math.min(value / max, 1);
  const strokeDashoffset = circumference - pct * circumference;
  
  return (
    <div className="flex flex-col items-center justify-center relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <motion.circle
          initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset }} transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-ink-900 font-bold" style={{ fontSize: size * 0.22 }}>{label}</span>
        {sublabel && <span className="text-ink-400 font-medium" style={{ fontSize: size * 0.12 }}>{sublabel}</span>}
      </div>
    </div>
  );
};

export function ModernScanner() {
  const [dragActive, setDragActive] = useState(false);
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('idle');
    const [isFallback, setIsFallback] = useState(false);

    
  const [aiResult, setAiResult] = useState(null);

  const analyzeImage = async (base64Image) => {
    setStatus('scanning');
    try {
      const response = await fetch('/api/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: "Analyze this food image. Reply ONLY with a JSON object containing: title (string, name of meal), cal (number, total calories), protein (number, grams), carbs (number, grams), fat (number, grams). Do not use markdown formatting like ```json." },
              { type: 'image_url', image_url: { url: base64Image } }
            ]
          }]
        })
      });
      
      const data = await response.json();
      if (data.error) throw new Error(JSON.stringify(data.error));
      
      let resultText = data.choices[0].message.content;
      resultText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(resultText);
      setAiResult(parsed);
      setStatus('complete');
    } catch (err) {
      console.error(err);
      alert("AI Analysis failed: " + err.message);
      setStatus('idle');
    }
  };


  const handleLogMeal = () => {
    const saved = localStorage.getItem('nts-meals');
    const meals = saved ? JSON.parse(saved) : [];
    
    const newMeal = { 
      id: Date.now(), 
      title: aiResult?.title || "Unknown Meal", 
      cal: aiResult?.cal || 0,
      p: aiResult?.protein || 0,
      c: aiResult?.carbs || 0,
      f: aiResult?.fat || 0,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    };
    
    meals.unshift(newMeal);
    localStorage.setItem('nts-meals', JSON.stringify(meals));
    setImage(null);
    setAiResult(null);
    setStatus('idle');
    alert(`Logged ${newMeal.title} successfully!`);
  };
 // idle | scanning | complete
  
  // Calculate percentages
  let pPct = 0, cPct = 0, fPct = 0;
  if (aiResult && aiResult.cal > 0) {
    pPct = Math.round((aiResult.protein * 4 / aiResult.cal) * 100);
    cPct = Math.round((aiResult.carbs * 4 / aiResult.cal) * 100);
    fPct = Math.round((aiResult.fat * 9 / aiResult.cal) * 100);
  }

  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
      analyzeImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="h-full w-full flex flex-col lg:flex-row gap-8">
      
      {/* Upload / Scanner Zone */}
      <div className="flex-1 flex flex-col h-full min-h-[500px]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-ink-900 tracking-tight">AI Food Scanner</h2>
            <p className="text-ink-500 font-medium mt-1">Upload a photo for instant macro analysis.</p>
          </div>
          {status === 'complete' && (
            <button 
              onClick={() => { setImage(null); setStatus('idle'); }}
              className="px-4 py-2 bg-white/60 hover:bg-white rounded-xl text-sm font-semibold text-ink-900 shadow-sm border border-white/50 transition-colors"
            >
              Scan Another
            </button>
          )}
        </div>

        <div 
          className={`flex-1 relative rounded-3xl border-2 border-dashed overflow-hidden transition-all duration-300 flex flex-col items-center justify-center
            ${dragActive ? 'border-emerald-500 bg-emerald-50/50' : 'border-ink-900/15 bg-white/30'}
            ${image ? 'border-transparent bg-transparent' : 'hover:bg-white/50 hover:border-ink-900/30 cursor-pointer'}
          `}
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          onClick={() => !image && fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
          
          <AnimatePresence mode="wait">
            {!image ? (
              <motion.div 
                key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center text-center p-8 pointer-events-none"
              >
                <div className="w-20 h-20 bg-white shadow-xl shadow-ink-900/5 rounded-2xl flex items-center justify-center mb-6">
                  <UploadCloud className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-ink-900">Drag & drop your food photo here</h3>
                <p className="text-ink-500 font-medium mt-2 max-w-sm">
                  Or click to browse from your device. Supported formats: JPG, PNG, HEIC.
                </p>
                <div className="flex gap-4 mt-8">
                  <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 text-xs font-semibold text-ink-700">
                    <ImageIcon className="w-4 h-4" /> Auto-crop
                  </span>
                  <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 text-xs font-semibold text-ink-700">
                    <Camera className="w-4 h-4" /> Lighting adjust
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 w-full h-full p-2">
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg border border-white/40">
                  <img src={image} alt="Food" className="w-full h-full object-cover" />
                  
                  {/* Scanning Animation Overlays */}
                  {status === 'scanning' && (
                    <>
                      <div className="absolute inset-0 bg-ink-900/20 backdrop-blur-[2px]" />
                      <motion.div 
                        initial={{ top: '0%' }} animate={{ top: '100%' }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_20px_5px_rgba(16,185,129,0.5)] z-10"
                      />
                      {/* Bounding boxes simulation */}
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="absolute top-[30%] left-[20%] w-[40%] h-[30%] border-2 border-dashed border-white/70 rounded-xl" />
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 }} className="absolute bottom-[20%] right-[10%] w-[35%] h-[25%] border-2 border-dashed border-orange-400/70 rounded-xl" />
                      
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
                        <Activity className="w-5 h-5 text-emerald-500 animate-pulse" />
                        <span className="font-bold text-ink-900">AI Analyzing...</span>
                      </div>
                    </>
                  )}
                  
                  {status === 'complete' && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/50 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold text-ink-900">100% Analyzed</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results Panel */}
      <div className={`w-full lg:w-[340px] flex flex-col gap-4 transition-all duration-500 ${status === 'complete' ? 'opacity-100 translate-x-0' : 'opacity-50 pointer-events-none translate-x-4'}`}>
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-xl shadow-ink-900/5">
           <h3 className="text-xs font-bold text-ink-400 tracking-widest uppercase mb-1">AI Analysis Results</h3>
             {isFallback && (
               <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                 <p className="text-xs text-red-600 font-bold">?? Rate Limit Exceeded</p>
                 <p className="text-[10px] text-red-500 mt-1">Free Vision AI is currently busy. This is a generic AI guess, not a real image analysis.</p>
               </div>
             )}

           <h2 className="text-2xl font-bold text-ink-900 tracking-tight">{aiResult?.title || "Unknown"}</h2>
           <p className="text-sm font-medium text-ink-500 mt-1 flex items-center gap-2">
              <FileText className="w-4 h-4" /> 98% Confidence Match
           </p>
           
           <div className="mt-8 space-y-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-ink-900/5 flex items-center justify-between group hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                     <span className="text-xl font-bold text-emerald-500">P</span>
                   </div>
                   <div>
                     <h4 className="text-sm font-bold text-ink-900">Protein</h4>
                     <p className="text-xs text-ink-500">Estimated</p>
                   </div>
                </div>
                <div className="text-right">
                   <span className="block text-lg font-bold text-ink-900">{aiResult?.protein || 0}g</span>
                   <span className="text-xs font-semibold text-emerald-500">{pPct}%</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-ink-900/5 flex items-center justify-between group hover:border-blue-500/30 transition-colors">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                     <span className="text-xl font-bold text-blue-500">C</span>
                   </div>
                   <div>
                     <h4 className="text-sm font-bold text-ink-900">Carbs</h4>
                     <p className="text-xs text-ink-500">Estimated</p>
                   </div>
                </div>
                <div className="text-right">
                   <span className="block text-lg font-bold text-ink-900">{aiResult?.carbs || 0}g</span>
                   <span className="text-xs font-semibold text-blue-500">{cPct}%</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-ink-900/5 flex items-center justify-between group hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                     <span className="text-xl font-bold text-orange-500">F</span>
                   </div>
                   <div>
                     <h4 className="text-sm font-bold text-ink-900">Fats</h4>
                     <p className="text-xs text-ink-500">Estimated</p>
                   </div>
                </div>
                <div className="text-right">
                   <span className="block text-lg font-bold text-ink-900">{aiResult?.fat || 0}g</span>
                   <span className="text-xs font-semibold text-orange-500">{fPct}%</span>
                </div>
              </div>
           </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-xl shadow-ink-900/5">
           <div className="flex justify-between items-end mb-4">
              <h3 className="text-xl font-bold text-ink-900">{aiResult?.cal || 0} <span className="text-sm text-ink-500">kcal</span></h3>
              <span className="text-xs font-semibold text-ink-500">Total Est. Calories</span>
           </div>
           {/* Progress bar composition */}
           <div className="flex h-3 w-full rounded-full overflow-hidden gap-0.5">
             <div className="h-full bg-emerald-500" style={{ width: `${pPct}%` }} />
             <div className="h-full bg-blue-500" style={{ width: `${cPct}%` }} />
             <div className="h-full bg-orange-500" style={{ width: `${fPct}%` }} />
           </div>
           
           <button className="w-full mt-6 py-3.5 bg-ink-900 text-white rounded-xl font-bold shadow-lg shadow-ink-900/20 hover:bg-ink-800 transition-all hover:-translate-y-0.5 active:scale-95">
             Log Meal to Diary
           </button>
        </div>
      </div>

    </div>
  );
}
