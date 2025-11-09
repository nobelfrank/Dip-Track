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
import { Plus, Loader2, Activity, TestTube, Package } from "lucide-react";
import Header from "@/components/Header";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useGloves } from "@/hooks/useGloves";
import { useBatches } from "@/hooks/useBatches";

export default function Gloves() {
  const { gloveBatches, loading, error, createGloveBatch } = useGloves();
  const { batches } = useBatches();
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('continuous');
  const [formData, setFormData] = useState({
    gloveBatchId: '',
    latexBatchId: '',
    productType: 'Surgical Glove',
    continuousData: {
      compoundingViscosity: '',
      coagulantConcentration: '',
      latexDipLevel: '',
      curingTemp: '',
      formerSpeed: ''
    },
    processData: {
      latexVolume: '',
      sulfurDosage: '',
      zincOxideDosage: '',
      acceleratorDosage: '',
      stabilizerDosage: '',
      compoundingDuration: '',
      dippingSpeed: '',
      dwellTime: '',
      leachTemp1: '',
      leachTemp2: '',
      curingTime: ''
    },
    qcData: {
      sampleCount: '',
      avgLength: '',
      avgWidth: '',
      avgThickness: '',
      tensileStrength: '',
      elongation: '',
      aqlSampleSize: '',
      aqlFailures: '',
      proteinContent: ''
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      await createGloveBatch({
        gloveBatchId: formData.gloveBatchId,
        latexBatchId: formData.latexBatchId,
        productType: formData.productType,
        continuousData: formData.continuousData,
        processData: formData.processData,
        qcData: formData.qcData
      });
      
      // Reset form
      setFormData({
        gloveBatchId: '',
        latexBatchId: '',
        productType: 'Surgical Glove',
        continuousData: {
          compoundingViscosity: '',
          coagulantConcentration: '',
          latexDipLevel: '',
          curingTemp: '',
          formerSpeed: ''
        },
        processData: {
          latexVolume: '',
          sulfurDosage: '',
          zincOxideDosage: '',
          acceleratorDosage: '',
          stabilizerDosage: '',
          compoundingDuration: '',
          dippingSpeed: '',
          dwellTime: '',
          leachTemp1: '',
          leachTemp2: '',
          curingTime: ''
        },
        qcData: {
          sampleCount: '',
          avgLength: '',
          avgWidth: '',
          avgThickness: '',
          tensileStrength: '',
          elongation: '',
          aqlSampleSize: '',
          aqlFailures: '',
          proteinContent: ''
        }
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to create glove batch:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'supervisor', 'operator', 'qc_officer']}>
      <DesktopSidebar />
      <div className="min-h-screen bg-background pb-20 md:pb-8 md:ml-64">
        <Header title="Glove Manufacturing" />

        <div className="p-4 sm:p-6 lg:p-8 space-y-4 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Glove Manufacturing</h2>
              <p className="text-sm text-muted-foreground mt-1">Surgical and examination glove production</p>
            </div>
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Glove Batch
            </Button>
          </div>

          {/* Add Glove Batch Form */}
          {showAddForm && (
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Create Glove Batch</h3>
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Glove Batch ID</Label>
                    <Input
                      placeholder="GB823-20250924-Surgical"
                      value={formData.gloveBatchId}
                      onChange={(e) => setFormData({...formData, gloveBatchId: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Latex Batch</Label>
                    <Select onValueChange={(value) => setFormData({...formData, latexBatchId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select latex batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {batches.map((batch) => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.batchId}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Product Type</Label>
                    <Select onValueChange={(value) => setFormData({...formData, productType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Surgical Glove">Surgical Glove</SelectItem>
                        <SelectItem value="Examination Glove">Examination Glove</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="continuous">Continuous Monitoring</TabsTrigger>
                  <TabsTrigger value="process">Process Data</TabsTrigger>
                  <TabsTrigger value="qc">QC Results</TabsTrigger>
                </TabsList>

                <TabsContent value="continuous" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Compounding Viscosity (cP)</Label>
                      <Input
                        type="number"
                        value={formData.continuousData.compoundingViscosity}
                        onChange={(e) => setFormData({
                          ...formData,
                          continuousData: {...formData.continuousData, compoundingViscosity: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Coagulant Concentration (%wt)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.continuousData.coagulantConcentration}
                        onChange={(e) => setFormData({
                          ...formData,
                          continuousData: {...formData.continuousData, coagulantConcentration: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Latex Dip Bath Level (cm)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.continuousData.latexDipLevel}
                        onChange={(e) => setFormData({
                          ...formData,
                          continuousData: {...formData.continuousData, latexDipLevel: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Curing Oven Temperature (°C)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.continuousData.curingTemp}
                        onChange={(e) => setFormData({
                          ...formData,
                          continuousData: {...formData.continuousData, curingTemp: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Former Speed (m/min)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.continuousData.formerSpeed}
                        onChange={(e) => setFormData({
                          ...formData,
                          continuousData: {...formData.continuousData, formerSpeed: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="process" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Latex Input Volume (L)</Label>
                      <Input
                        type="number"
                        value={formData.processData.latexVolume}
                        onChange={(e) => setFormData({
                          ...formData,
                          processData: {...formData.processData, latexVolume: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Sulfur Dosage (kg)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.processData.sulfurDosage}
                        onChange={(e) => setFormData({
                          ...formData,
                          processData: {...formData.processData, sulfurDosage: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Zinc Oxide Dosage (kg)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.processData.zincOxideDosage}
                        onChange={(e) => setFormData({
                          ...formData,
                          processData: {...formData.processData, zincOxideDosage: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Dipping Speed (m/min)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.processData.dippingSpeed}
                        onChange={(e) => setFormData({
                          ...formData,
                          processData: {...formData.processData, dippingSpeed: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Curing Time (minutes)</Label>
                      <Input
                        type="number"
                        value={formData.processData.curingTime}
                        onChange={(e) => setFormData({
                          ...formData,
                          processData: {...formData.processData, curingTime: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="qc" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Sample Count</Label>
                      <Input
                        type="number"
                        value={formData.qcData.sampleCount}
                        onChange={(e) => setFormData({
                          ...formData,
                          qcData: {...formData.qcData, sampleCount: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Average Length (mm)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.qcData.avgLength}
                        onChange={(e) => setFormData({
                          ...formData,
                          qcData: {...formData.qcData, avgLength: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Average Thickness (mm)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.qcData.avgThickness}
                        onChange={(e) => setFormData({
                          ...formData,
                          qcData: {...formData.qcData, avgThickness: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tensile Strength (MPa)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.qcData.tensileStrength}
                        onChange={(e) => setFormData({
                          ...formData,
                          qcData: {...formData.qcData, tensileStrength: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>AQL Sample Size</Label>
                      <Input
                        type="number"
                        value={formData.qcData.aqlSampleSize}
                        onChange={(e) => setFormData({
                          ...formData,
                          qcData: {...formData.qcData, aqlSampleSize: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Protein Content (μg/g)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.qcData.proteinContent}
                        onChange={(e) => setFormData({
                          ...formData,
                          qcData: {...formData.qcData, proteinContent: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

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
                  onClick={handleSubmit}
                  className="flex-1"
                  disabled={submitting || !formData.gloveBatchId || !formData.latexBatchId}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Batch'
                  )}
                </Button>
              </div>
            </Card>
          )}

          {/* Glove Batches */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading glove batches...</span>
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
              {gloveBatches.length > 0 ? (
                gloveBatches.map((batch) => (
                  <Card key={batch.id} className="p-4 bg-card border-border">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold">{batch.gloveBatchId}</h3>
                        </div>
                        <StatusBadge status="info">{batch.status}</StatusBadge>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Product:</span>
                          <span className="font-medium">{batch.productType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Latex Batch:</span>
                          <span className="font-medium">{batch.latexBatch.batchId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">QC Tests:</span>
                          <span className="font-medium">{batch.gloveQcResults.length}</span>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Manufacturing: {new Date(batch.manufacturingDate).toLocaleString()}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 col-span-full">
                  <p className="text-muted-foreground">No glove batches found</p>
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