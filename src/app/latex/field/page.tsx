'use client'

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { BottomNav } from "@/components/BottomNav";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, Thermometer, Clock, Beaker } from "lucide-react";
import Header from "@/components/Header";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useLatexProcess } from "@/hooks/useLatexProcess";

export default function FieldLatex() {
  const { fieldLatex, loading, error, createFieldLatex } = useLatexProcess();
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    supplierLotId: '',
    supplier: '',
    volume: '',
    preservativeAdded: '',
    initialPh: '',
    visualInspection: '',
    ambientTemp: '',
    timeSinceTapping: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      await createFieldLatex({
        supplierLotId: formData.supplierLotId,
        supplier: formData.supplier,
        volume: parseFloat(formData.volume),
        preservativeAdded: parseFloat(formData.preservativeAdded),
        initialPh: parseFloat(formData.initialPh),
        visualInspection: formData.visualInspection,
        ambientTemp: parseFloat(formData.ambientTemp),
        timeSinceTapping: parseFloat(formData.timeSinceTapping)
      });
      
      setFormData({
        supplierLotId: '',
        supplier: '',
        volume: '',
        preservativeAdded: '',
        initialPh: '',
        visualInspection: '',
        ambientTemp: '',
        timeSinceTapping: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to create field latex record:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'supervisor', 'operator']}>
      <DesktopSidebar />
      <div className="min-h-screen bg-background pb-20 md:pb-8 md:ml-64">
        <Header title="Field Latex Collection" />

        <div className="p-4 sm:p-6 lg:p-8 space-y-4 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Field Latex Reception</h2>
              <p className="text-sm text-muted-foreground mt-1">Raw latex collection and quality monitoring</p>
            </div>
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Reception
            </Button>
          </div>

          {/* Add Reception Form */}
          {showAddForm && (
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Field Latex Reception</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplierLotId">Supplier Lot ID</Label>
                    <Input
                      id="supplierLotId"
                      placeholder="FARM-A-0924-01"
                      value={formData.supplierLotId}
                      onChange={(e) => setFormData({...formData, supplierLotId: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input
                      id="supplier"
                      placeholder="Farm A"
                      value={formData.supplier}
                      onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="volume">Volume (L)</Label>
                    <Input
                      id="volume"
                      type="number"
                      step="0.1"
                      placeholder="10000"
                      value={formData.volume}
                      onChange={(e) => setFormData({...formData, volume: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preservativeAdded">Preservative Added (L)</Label>
                    <Input
                      id="preservativeAdded"
                      type="number"
                      step="0.1"
                      placeholder="150"
                      value={formData.preservativeAdded}
                      onChange={(e) => setFormData({...formData, preservativeAdded: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="initialPh">Initial pH</Label>
                    <Input
                      id="initialPh"
                      type="number"
                      step="0.1"
                      placeholder="10.5"
                      value={formData.initialPh}
                      onChange={(e) => setFormData({...formData, initialPh: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ambientTemp">Ambient Temperature (°C)</Label>
                    <Input
                      id="ambientTemp"
                      type="number"
                      step="0.1"
                      placeholder="28"
                      value={formData.ambientTemp}
                      onChange={(e) => setFormData({...formData, ambientTemp: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeSinceTapping">Time Since Tapping (hours)</Label>
                    <Input
                      id="timeSinceTapping"
                      type="number"
                      step="0.1"
                      placeholder="2.5"
                      value={formData.timeSinceTapping}
                      onChange={(e) => setFormData({...formData, timeSinceTapping: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visualInspection">Visual Inspection</Label>
                    <Input
                      id="visualInspection"
                      placeholder="Free of pre-coagulum, no contamination"
                      value={formData.visualInspection}
                      onChange={(e) => setFormData({...formData, visualInspection: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Reception'
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Reception Records */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading field latex records...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fieldLatex.length > 0 ? (
                fieldLatex.map((record) => (
                  <Card key={record.id} className="p-4 bg-card border-border">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{record.supplierLotId}</h3>
                        <StatusBadge status="normal">{record.status}</StatusBadge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Supplier:</span>
                          <span className="font-medium">{record.supplier}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Volume:</span>
                          <span className="font-medium">{record.volume} L</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Temp:</span>
                          <span className="font-medium">{record.ambientTemp}°C</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Beaker className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">pH:</span>
                          <span className="font-medium">{record.initialPh}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Since Tapping:</span>
                          <span className="font-medium">{record.timeSinceTapping}h</span>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Received: {new Date(record.receptionDate).toLocaleString()}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 col-span-full">
                  <p className="text-muted-foreground">No field latex records found</p>
                </div>
              )}
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}