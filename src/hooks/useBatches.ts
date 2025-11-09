import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Batch {
  id: string;
  batchId: string;
  productType: string;
  latexBatchId: string;
  startDate: string;
  shift: string;
  status: 'active' | 'completed' | 'draft' | 'cancelled';
  currentStage: number;
  stagesCompleted: number;
  progressPercentage: number;
  operator: {
    id: string;
    fullName: string;
    email: string;
  };
  _count: {
    alerts: number;
    qcResults: number;
  };
}

export function useBatches() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchBatches = async () => {
    if (!session) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('/api/batches');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        
        // Check if offline
        if (errorData.offline) {
          // Try to load from localStorage cache
          const cached = localStorage.getItem('batches-cache');
          if (cached) {
            setBatches(JSON.parse(cached));
            setError('Showing cached data (offline)');
            return;
          }
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setBatches(data);
      
      // Cache data for offline use
      localStorage.setItem('batches-cache', JSON.stringify(data));
      localStorage.setItem('batches-cache-timestamp', Date.now().toString());
      
      setError(null);
    } catch (err) {
      console.error('Fetch batches error:', err);
      
      // Try cached data on error
      const cached = localStorage.getItem('batches-cache');
      if (cached) {
        setBatches(JSON.parse(cached));
        setError('Showing cached data (offline)');
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const createBatch = async (batchData: {
    productType: string;
    latexBatchId: string;
    shift: string;
  }) => {
    try {
      const response = await fetch('/api/batches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batchData),
      });

      if (!response.ok) {
        // Store for offline sync if network error
        if (!navigator.onLine) {
          const offlineAction = {
            id: Date.now().toString(),
            url: '/api/batches',
            method: 'POST',
            data: batchData,
            timestamp: Date.now()
          };
          
          const stored = localStorage.getItem('offline-actions') || '[]';
          const actions = JSON.parse(stored);
          actions.push(offlineAction);
          localStorage.setItem('offline-actions', JSON.stringify(actions));
          
          throw new Error('Saved for sync when online');
        }
        
        throw new Error('Failed to create batch');
      }

      const newBatch = await response.json();
      setBatches(prev => [newBatch, ...prev]);
      
      // Update cache
      const updated = [newBatch, ...batches];
      localStorage.setItem('batches-cache', JSON.stringify(updated));
      
      return newBatch;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create batch');
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [session]);

  return {
    batches,
    loading,
    error,
    refetch: fetchBatches,
    createBatch,
  };
}