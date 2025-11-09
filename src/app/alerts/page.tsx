'use client'

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { BottomNav } from "@/components/BottomNav";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAlerts } from "@/hooks/useAlerts";
import { useSession } from "next-auth/react";

export default function Alerts() {
  const { alerts, loading, error, acknowledgeAlert, assignAlert } = useAlerts();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'critical' | 'warning' | 'acknowledged'>('all');

  const handleAcknowledge = async (alertId: string) => {
    try {
      await acknowledgeAlert(alertId);
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };

  const handleAssign = async (alertId: string) => {
    try {
      if (session?.user?.id) {
        await assignAlert(alertId, session.user.id);
      }
    } catch (error) {
      console.error('Failed to assign alert:', error);
    }
  };

  const filteredAlerts = alerts
    .filter(alert => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'acknowledged') return alert.status === 'acknowledged';
      return alert.severity === statusFilter;
    })
    .filter(alert => {
      if (!searchQuery) return true;
      return (
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.source.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  const activeAlertsCount = alerts.filter(alert => alert.status === 'active').length;

  return (
    <ProtectedRoute allowedRoles={['admin', 'supervisor', 'qc_officer']}>
      <DesktopSidebar />
      <div className="min-h-screen bg-background pb-20 md:pb-8 md:ml-64">
        <Header title="Alerts" />

        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-xl sm:text-lg font-semibold">Alerts</h2>
              <p className="text-sm text-muted-foreground">Review and act on live alerts</p>
            </div>
            <StatusBadge status="info">{activeAlertsCount} Active</StatusBadge>
          </div>

          <div className="flex gap-2 flex-col sm:flex-row">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search alerts, lines, batches" 
                className="pl-10 bg-input border-border w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0 h-10 w-10">
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>

          <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
            <TabsList className="grid w-full grid-cols-4 bg-secondary">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="critical">Critical</TabsTrigger>
              <TabsTrigger value="warning">Warning</TabsTrigger>
              <TabsTrigger value="acknowledged">Acknowledged</TabsTrigger>
            </TabsList>

            {['all', 'critical', 'warning', 'acknowledged'].map((tabValue) => (
              <TabsContent key={tabValue} value={tabValue} className="mt-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <span>Loading alerts...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()} variant="outline">
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    {filteredAlerts.length > 0 ? (
                      filteredAlerts.map((alert) => (
                        <Card key={alert.id} className="p-4 lg:p-5 bg-card border-border">
                          <h3 className="font-semibold mb-2">{alert.title}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <StatusBadge status={alert.severity}>
                              {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                            </StatusBadge>
                            <span className="text-xs text-muted-foreground">
                              {alert.source} • {new Date(alert.createdAt).toLocaleTimeString()}
                              {alert.batchId && ` • ${alert.batchId}`}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            {alert.description}
                          </p>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleAcknowledge(alert.id)}
                              disabled={alert.status === 'acknowledged'}
                            >
                              {alert.status === 'acknowledged' ? 'Acknowledged' : 'Acknowledge'}
                            </Button>
                            <Button 
                              size="sm" 
                              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                              onClick={() => handleAssign(alert.id)}
                              disabled={!!alert.assignedTo}
                            >
                              {alert.assignedTo ? 'Assigned' : 'Assign'}
                            </Button>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12 col-span-full">
                        <p className="text-muted-foreground">No alerts found</p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}