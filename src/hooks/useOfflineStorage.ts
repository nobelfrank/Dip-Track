import { useState, useEffect } from 'react';

interface OfflineAction {
  id: string;
  url: string;
  method: string;
  data: any;
  timestamp: number;
}

export function useOfflineStorage() {
  const [offlineActions, setOfflineActions] = useState<OfflineAction[]>([]);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Load offline actions from localStorage
    const stored = localStorage.getItem('offline-actions');
    if (stored) {
      setOfflineActions(JSON.parse(stored));
    }

    // Monitor online status
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      if (online && offlineActions.length > 0) {
        syncOfflineActions();
      }
    };

    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [offlineActions.length]);

  const storeOfflineAction = (url: string, method: string, data: any) => {
    const action: OfflineAction = {
      id: Date.now().toString(),
      url,
      method,
      data,
      timestamp: Date.now()
    };

    const updated = [...offlineActions, action];
    setOfflineActions(updated);
    localStorage.setItem('offline-actions', JSON.stringify(updated));
  };

  const syncOfflineActions = async () => {
    const actions = [...offlineActions];
    const synced: string[] = [];

    for (const action of actions) {
      try {
        const response = await fetch(action.url, {
          method: action.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        });

        if (response.ok) {
          synced.push(action.id);
        }
      } catch (error) {
        console.log('Sync failed for action:', action.id);
      }
    }

    if (synced.length > 0) {
      const remaining = actions.filter(action => !synced.includes(action.id));
      setOfflineActions(remaining);
      localStorage.setItem('offline-actions', JSON.stringify(remaining));
    }
  };

  const clearOfflineActions = () => {
    setOfflineActions([]);
    localStorage.removeItem('offline-actions');
  };

  return {
    isOnline,
    offlineActions,
    storeOfflineAction,
    syncOfflineActions,
    clearOfflineActions
  };
}