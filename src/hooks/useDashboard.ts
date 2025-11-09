import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface DashboardMetrics {
  oee: number;
  activeBatches: number;
  activeAlerts: number;
  criticalAlerts: number;
}

interface LineStatus {
  name: string;
  status: 'normal' | 'warning' | 'critical';
}

interface ActiveBatch {
  id: string;
  batchId: string;
  line: string;
  eta: string;
  progress: number;
  stages: string[];
}

export function useDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    oee: 0,
    activeBatches: 0,
    activeAlerts: 0,
    criticalAlerts: 0
  });
  const [lineStatus, setLineStatus] = useState<LineStatus[]>([]);
  const [activeBatch, setActiveBatch] = useState<ActiveBatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchDashboardData = async () => {
    if (!session) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Fetch dashboard metrics
      const metricsRes = await fetch('/api/dashboard/metrics');
      
      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData);
      } else {
        console.warn('Failed to fetch metrics:', metricsRes.status);
      }

      // Fetch active batches
      const batchesRes = await fetch('/api/batches');
      if (batchesRes.ok) {
        const batchesData = await batchesRes.json();
        const activeBatches = batchesData.filter((batch: any) => batch.status === 'active');
        if (activeBatches.length > 0) {
          const batch = activeBatches[0];
          setActiveBatch({
            id: batch.id,
            batchId: batch.batchId,
            line: 'Line 1',
            eta: 'ETA 2h 15m',
            progress: batch.progressPercentage || 40,
            stages: ['Compounding', 'Dipping', 'Curing', 'QA', 'Pack']
          });
        }
      }

      // Mock line status data - replace with real API
      setLineStatus([
        { name: 'Compounding', status: 'normal' },
        { name: 'Dipping', status: 'warning' },
        { name: 'Curing', status: 'critical' },
        { name: 'Leach & Dry', status: 'normal' }
      ]);

      setError(null);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time updates
    const interval = setInterval(fetchDashboardData, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [session]);

  return {
    metrics,
    lineStatus,
    activeBatch,
    loading,
    error,
    refetch: fetchDashboardData,
  };
}