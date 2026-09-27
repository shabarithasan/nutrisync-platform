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
  }, [connectedIds]);

  // Handle device motion for pedometer
  useEffect(() => {
    if (!connectedIds.includes('device_pedometer')) return;

    const handleMotion = (event) => {
      if (!event.accelerationIncludingGravity) return;
      
      const { x, y, z } = event.accelerationIncludingGravity;
      if (x === null || y === null || z === null) return;
      
      const acceleration = Math.sqrt(x * x + y * y + z * z);
      // Basic threshold for step detection (gravity ~ 9.8, so values > 12 indicate significant movement)
      if (acceleration > 12) {
        setLiveSteps((prev) => prev + 1);
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [connectedIds]);

  // Simulate daily step count for cloud integrations
  useEffect(() => {
    const hasCloud = connectedIds.some(id => 
      INTEGRATIONS.find(int => int.id === id)?.type === 'cloud'
    );
    
    if (hasCloud) {
      const currentHour = new Date().getHours();
      const baseSteps = currentHour * 500;
      const jitter = Math.floor(Math.random() * 1000);
      setLiveSteps(baseSteps + jitter);
    } else if (!connectedIds.includes('device_pedometer')) {
      setLiveSteps(0);
    }
  }, [connectedIds]);

  const toggleConnection = (id) => {
    if (connectedIds.includes(id)) {
      setConnectedIds(prev => prev.filter(item => item !== id));
    } else {
      setConnectingId(id);
      setTimeout(() => {
        setConnectedIds(prev => [...prev, id]);
        setConnectingId(null);
      }, 2000);
    }
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
