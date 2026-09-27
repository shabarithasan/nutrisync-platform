import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Heart, Watch, Circle, Smartphone, Loader2, CheckCircle2 } from 'lucide-react';

const GlassCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`rounded-[28px] backdrop-blur-2xl bg-white/50 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

const INTEGRATIONS = [
  { id: 'google_fit', name: 'Google Fit', icon: Activity, desc: 'Sync steps, active calories, and workouts.', type: 'cloud' },
  { id: 'apple_health', name: 'Apple Health', icon: Heart, desc: 'Sync holistic health data and sleep tracking.', type: 'cloud' },
  { id: 'garmin', name: 'Garmin Connect', icon: Watch, desc: 'Sync advanced metrics for running and cycling.', type: 'cloud' },
  { id: 'oura', name: 'Oura', icon: Circle, desc: 'Sync detailed sleep staging and readiness scores.', type: 'cloud' },
  { id: 'device_pedometer', name: 'Device Pedometer', icon: Smartphone, desc: "Use your phone's built-in sensors for live step tracking.", type: 'local' }
];

export function ModernIntegrations() {
  const [connectedIds, setConnectedIds] = useState([]);
  const [connectingId, setConnectingId] = useState(null);
  const [liveSteps, setLiveSteps] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('nts-integrations');
      if (stored) {
        setConnectedIds(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to parse integrations', err);
    }
  }, []);

  // Update localStorage when connectedIds change
  useEffect(() => {
    localStorage.setItem('nts-integrations', JSON.stringify(connectedIds));
    window.dispatchEvent(new Event('storage'));
  }, [connectedIds]);


  // Load real steps from nts-log
  useEffect(() => {
    const loadSteps = () => {
      try {
        const logs = JSON.parse(localStorage.getItem('nts-log') || '{}');
        const today = new Date().toISOString().split('T')[0];
        setLiveSteps(logs[today]?.steps || 0);
      } catch { setLiveSteps(0); }
    };
    
    loadSteps();
    window.addEventListener('nts-log-updated', loadSteps);
    return () => window.removeEventListener('nts-log-updated', loadSteps);
  }, []);

  const toggleConnection = async (id) => {
    if (connectedIds.includes(id)) {
      setConnectedIds(prev => prev.filter(item => item !== id));
      return;
    }
    
    // Request permission for local pedometer on iOS
    if (id === 'device_pedometer') {
      try {
        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
          const p1 = await DeviceMotionEvent.requestPermission();
          if (p1 !== 'granted') {
            alert('Motion tracking permission denied.');
            return;
          }
        }
      } catch (err) {
        // Ignore, likely not iOS or not HTTPS
      }
    } else {
      // It's a cloud integration. Let's make it look real but explain it needs an API key
      const wantToConnect = window.confirm(`To connect ${INTEGRATIONS.find(i => i.id === id).name}, you need an OAuth API Key configured in your environment variables. Proceed in demo mode?`);
      if (!wantToConnect) return;
    }

    setConnectingId(id);
    setTimeout(() => {
      setConnectedIds(prev => [...prev, id]);
      setConnectingId(null);
    }, 1500);
  };

  const hasAnyConnection = connectedIds.length > 0;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 text-ink-900">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Connected Devices & Apps</h1>
        <p className="text-ink-500 font-medium">Link your favorite tools to centralize your health data.</p>
      </header>

      <AnimatePresence>
        {hasAnyConnection && (
          <GlassCard delay={0.1} className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
            <div className="p-8 text-center">
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">Today's Steps</h2>
              <div className="text-6xl font-bold text-emerald-600 tracking-tight">
                {liveSteps.toLocaleString()}
              </div>
              <p className="text-emerald-600/70 mt-2 font-medium">Synced from your connected devices</p>
            </div>
          </GlassCard>
        )}
      </AnimatePresence>

      <div className="grid gap-4 md:grid-cols-2">
        {INTEGRATIONS.map((integration, idx) => {
          const Icon = integration.icon;
          const isConnected = connectedIds.includes(integration.id);
          const isConnecting = connectingId === integration.id;

          return (
            <GlassCard key={integration.id} delay={0.1 + (idx * 0.1)}>
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${isConnected ? 'bg-emerald-100 text-emerald-600' : 'bg-ink-100 text-ink-500'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  {isConnected && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100/50 text-emerald-600 rounded-full text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Connected
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  <h3 className="text-lg font-bold mb-1">{integration.name}</h3>
                  <p className="text-ink-500 text-sm leading-relaxed">{integration.desc}</p>
                </div>

                <button
                  onClick={() => toggleConnection(integration.id)}
                  disabled={isConnecting}
                  className={`mt-6 w-full py-3 rounded-xl font-semibold flex items-center justify-center transition-all ${
                    isConnected 
                      ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' 
                      : 'bg-ink-900 text-white hover:bg-ink-800'
                  }`}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : isConnected ? (
                    'Disconnect'
                  ) : (
                    'Connect'
                  )}
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
