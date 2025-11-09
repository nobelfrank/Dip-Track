'use client'

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { BottomNav } from "@/components/BottomNav";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Loader2, Beaker, Gauge, Thermometer } from "lucide-react";
import Header from "@/components/Header";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useLatexProcess } from "@/hooks/useLatexProcess";
import { useBatches } from "@/hooks/useBatches";

const PROCESS_STAGES = [
  { number: 1, name: "Field Latex Collection", icon: Beaker },
  { number: 2, name: "Dilution and Stabilization", icon: Gauge },
  { number: 3, name: "Centrifugation", icon: Gauge },
  { number: 4, name: "Final Stabilization", icon: Thermometer },
  { number: 5, name: "Storage & Dispatch", icon: Beaker }
];

export default function LatexProcess() {
  const { processStages, loading, error, createProcessStage } = useLatexProcess();
  const { batches } = useBatches();
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedStage, setSelectedStage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stageData, setStageData] = useState<any>({});

  const handleStageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBatch) return;

    try {
      setSubmitting(true);
      await createProcessStage({
        batchId: selectedBatch,
        stageName: PROCESS_STAGES[selectedStage - 1].name,
        stageNumber: selectedStage,
        data: stageData
      });
      
      setStageData({});
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to create process stage:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStageForm = () => {
    switch (selectedStage) {
      case 1:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Source Lot ID</Label>
              <Input
                placeholder="FARM-A-0924-01"
                value={stageData.sourceLotId || ''}
                onChange={(e) => setStageData({...stageData, sourceLotId: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Ambient Temperature (°C)</Label>
              <Input
                type="number"
                step="0.1"
                value={stageData.ambientTemp || ''}
                onChange={(e) => setStageData({...stageData, ambientTemp: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Time Since Tapping (hours)</Label>
              <Input
                type="number"
                step="0.1"
                value={stageData.timeSinceTapping || ''}
                onChange={(e) => setStageData({...stageData, timeSinceTapping: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Preservative Dosage (L)</Label>
              <Input
                type="number"
                step="0.1"
                value={stageData.preservativeDosage || ''}
                onChange={(e) => setStageData({...stageData, preservativeDosage: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Initial pH</Label>
              <Input
                type="number"
                step="0.1"
                value={stageData.initialPh || ''}
                onChange={(e) => setStageData({...stageData, initialPh: e.target.value})}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Field Latex Input Weight (kg)</Label>
              <Input
                type="number"
                step="0.1"
                value={stageData.inputWeight || ''}
                onChange={(e) => setStageData({...stageData, inputWeight: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Dilution Water Volume (L)</Label>
              <Input
                type="number"
                step="0.1"
                value={stageData.dilutionWater || ''}
                onChange={(e) => setStageData({...stageData, dilutionWater: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Stabilizer Dosage (kg)</Label>
              <Input
                type="number"
                step="0.1"
                value={stageData.stabilizerDosage || ''}
                onChange={(e) => setStageData({...stageData, stabilizerDosage: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Mixture Temperature (°C)</Label>
              <Input
                type="number"
                step="0.1"
                value={stageData.mixtureTemp || ''}
                onChange={(e) => setStageData({...stageData, mixtureTemp: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Agitation Speed (rpm)</Label>
              <Input
                type="number"
                value={stageData.agitationSpeed || ''}
                onChange={(e) => setStageData({...stageData, agitationSpeed: e.target.value})}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Feed Flow Rate (L/hr)</Label>
              <Input
                type="number"
                step="0.1"
                value={stageData.feedFlowRate || ''}
                onChange={(e) => setStageData({...stageData, feedFlowRate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Centrifuge Speed (rpm)</Label>
              <Input
                type="number"
                value={stageData.centrifugeSpeed || ''}
                onChange={(e) => setStageData({...stageData, centrifugeSpeed: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Concentrate Flow Rate (L/hr)</Label>
              <Input
                type="number"
                step="0.1"
                value={stageData.concentrateFlowRate || ''}
                onChange={(e) => setStageData({...stageData, concentrateFlowRate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Skim Flow Rate (L/hr)</Label>
              <Input
                type="number"
                step="0.1"
                value={stageData.skimFlowRate || ''}
                onChange={(e) => setStageData({...stageData, skimFlowRate: e.target.value})}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Secondary Stabilizer Dosage (L)</Label>
              <Input
                type="number"
                step="0.1"
                value={stageData.secondaryStabilizer || ''}
                onChange={(e) => setStageData({...stageData, secondaryStabilizer: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Homogenization Time (minutes)</Label>
              <Input
                type="number"
                value={stageData.homogenizationTime || ''}
                onChange={(e) => setStageData({...stageData, homogenizationTime: e.target.value})}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Final Batch Volume (L)</Label>
              <Input
                type="number"
                step="0.1"
                value={stageData.finalVolume || ''}
                onChange={(e) => setStageData({...stageData, finalVolume: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Storage Tank ID</Label>
              <Input
                placeholder="TANK-001"
                value={stageData.storageTankId || ''}
                onChange={(e) => setStageData({...stageData, storageTankId: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Dispatch Order ID</Label>
              <Input
                placeholder="DO-2024-001"
                value={stageData.dispatchOrderId || ''}
                onChange={(e) => setStageData({...stageData, dispatchOrderId: e.target.value})}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'supervisor', 'operator']}>
      <DesktopSidebar />
      <div className="min-h-screen bg-background pb-20 md:pb-8 md:ml-64">
        <Header title="Latex Process" />

        <div className="p-4 sm:p-6 lg:p-8 space-y-4 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Latex Manufacturing Process</h2>
              <p className="text-sm text-muted-foreground mt-1">Monitor and record process stages</p>
            </div>
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Process Data
            </Button>
          </div>

          {/* Add Process Form */}
          {showAddForm && (
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Record Process Stage</h3>
              
              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label>Select Batch</Label>
                  <Select onValueChange={setSelectedBatch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {batches.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id}>
                          {batch.batchId} - {batch.productType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Process Stage</Label>
                  <Tabs value={selectedStage.toString()} onValueChange={(value) => setSelectedStage(parseInt(value))}>
                    <TabsList className="grid w-full grid-cols-5">
                      {PROCESS_STAGES.map((stage) => (
                        <TabsTrigger key={stage.number} value={stage.number.toString()}>
                          {stage.number}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              <form onSubmit={handleStageSubmit} className="space-y-4">
                <div className="mb-4">
                  <h4 className="font-medium mb-2">{PROCESS_STAGES[selectedStage - 1].name}</h4>
                  {renderStageForm()}
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
                    disabled={submitting || !selectedBatch}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Recording...
                      </>
                    ) : (
                      'Record Stage'
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Process Records */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading process records...</span>
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
              {processStages.length > 0 ? (
                processStages.map((stage) => {
                  const stageInfo = PROCESS_STAGES.find(s => s.number === stage.stageNumber);
                  const Icon = stageInfo?.icon || Beaker;
                  
                  return (
                    <Card key={stage.id} className="p-4 bg-card border-border">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold">Stage {stage.stageNumber}</h3>
                          </div>
                          <StatusBadge status="normal">{stage.status}</StatusBadge>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{stage.stageName}</p>
                          <p className="text-xs text-muted-foreground">
                            Batch: {stage.batchId}
                          </p>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          {stage.completedAt && `Completed: ${new Date(stage.completedAt).toLocaleString()}`}
                        </div>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-12 col-span-full">
                  <p className="text-muted-foreground">No process records found</p>
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