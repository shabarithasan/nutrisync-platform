import { useEffect, useRef } from 'react';

const SYNC_KEYS = [
  'nutrisync-profile',
  'nts-meals',
  'nts-log',
  'nts-weight-history',
  'nts-gym-schedule',
  'nts-diet-plan',
  'nts-workouts',
  'nts-water-modern'
];

export function SyncManager({ session }) {
  const isInitialSyncDone = useRef(false);

  useEffect(() => {
    if (!session?.accessToken) return;

    // 1. Initial Pull (Download from Cloud)
    const pullFromCloud = async () => {
      try {
        const res = await fetch('/api/sync', {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          const cloudData = data.appData;
          
          if (cloudData && Object.keys(cloudData).length > 0) {
            let changesMade = false;
            
            for (const key of SYNC_KEYS) {
              if (cloudData[key]) {
                const cloudVal = JSON.stringify(cloudData[key]);
                const localVal = localStorage.getItem(key);
                
                // Keep the newer one? For simplicity now, Cloud wins on first load
                // unless local has data and cloud is empty
                if (cloudVal !== localVal) {
                  localStorage.setItem(key, cloudVal);
                  changesMade = true;
                }
              }
            }
            
            // Reload page if we just synced down new data for the first time
            if (changesMade && !isInitialSyncDone.current) {
               // We could reload, or just let React state handle what it can.
               // Since we are at the root level, many things won't auto-update without a refresh
               // if they read from localStorage initially. Let's force a reload for a clean state.
               console.log('Cloud sync downloaded new data.');
               window.location.reload();
            }
          }
        }
      } catch (err) {
        console.error('Failed to pull from cloud:', err);
      } finally {
        isInitialSyncDone.current = true;
      }
    };

    pullFromCloud();

    // 2. Periodic Push (Upload to Cloud)
    const pushToCloud = async () => {
      if (!isInitialSyncDone.current) return; // Don't push before we've pulled
      
      const appData = {};
      for (const key of SYNC_KEYS) {
        const val = localStorage.getItem(key);
        if (val) {
          try {
            appData[key] = JSON.parse(val);
          } catch {
            // Ignore parse errors
          }
        }
      }

      if (Object.keys(appData).length === 0) return;

      try {
        await fetch('/api/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.accessToken}`
          },
          body: JSON.stringify(appData)
        });
        console.log('Synced to cloud successfully.');
      } catch (err) {
        console.error('Failed to push to cloud:', err);
      }
    };

    // Push every 15 seconds
    const interval = setInterval(pushToCloud, 15000);

    // Push on window unload/hide
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        pushToCloud();
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [session]);

  return null;
}
