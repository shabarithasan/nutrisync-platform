import { useEffect, useRef } from 'react';

const SYNC_KEYS = [
  'nutrisync-profile',
  'nts-meals',
  'nts-log',
  'nts-weight-history',
  'nts-gym-schedule',
  'nts-diet-plan',
  'nts-workouts',
  'nts-water-modern',
  'nts-integrations'
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
                const localVal = localStorage.getItem(key);
                let shouldOverwrite = true;
                
                // Prevent overwriting a completed local profile with an incomplete cloud profile
                if (key === 'nutrisync-profile') {
                  const localProfile = localVal ? JSON.parse(localVal) : {};
                  if (localProfile.activity && !cloudData[key].activity) {
                    shouldOverwrite = false;
                  }
                }

                if (shouldOverwrite) {
                  const cloudVal = JSON.stringify(cloudData[key]);
                  
                  if (cloudVal !== localVal) {
                    localStorage.setItem(key, cloudVal);
                    changesMade = true;
                  }
                }
              }
            }
            
            // Dispatch storage event so React components update when cloud data is pulled
            if (changesMade) {
               console.log('Cloud sync downloaded new data.');
               window.dispatchEvent(new Event('storage'));
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

    // 3. Periodic Sync Loop (Pull then Push)
    const syncLoop = async () => {
      if (document.visibilityState === 'hidden') return;
      await pullFromCloud();
      await pushToCloud();
    };

    // Sync every 10 seconds
    const interval = setInterval(syncLoop, 10000);

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
