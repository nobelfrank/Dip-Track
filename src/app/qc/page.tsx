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
import { Search, Plus, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useQC } from "@/hooks/useQC";
import { useBatches } from "@/hooks/useBatches";

export default function QC() {
  const { qcResults, loading, error, createQCResult } = useQC();
  const { batches } = useBatches();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    batchId: '',
    testType: '',
    result: '',
    passed: false,
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.batchId || !formData.testType || !formData.result) {
      return;
    }

    try {
      setSubmitting(true);
      await createQCResult(formData);
      setFormData({ batchId: '', testType: '', result: '', passed: false, notes: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to create QC result:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredResults = qcResults.filter(result => {
    if (!searchQuery) return true;
    return (
      result.batch.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.testType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.batch.productType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <ProtectedRoute allowedRoles={['admin', 'supervisor', 'qc_officer']}>
      <DesktopSidebar />
      <div className="min-h-screen bg-background pb-20 md:pb-8 md:ml-64">
        <Header title="QC" />

        <div className="p-4 sm:p-6 lg:p-8 space-y-4 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Quality Control</h2>
              <p className="text-sm text-muted-foreground mt-1">Test results and quality monitoring</p>
            </div>
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Test Result
            </Button>
          </div>

          {/* Add Test Form */}
          {showAddForm && (
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Add Test Result</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="batchId">Batch</Label>
                    <Select onValueChange={(value) => setFormData({...formData, batchId: value})}>
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
                    <Label htmlFor="testType">Test Type</Label>
                    <Select onValueChange={(value) => setFormData({...formData, testType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select test type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tensile Strength">Tensile Strength</SelectItem>
                        <SelectItem value="Elongation">Elongation</SelectItem>
                        <SelectItem value="Pinhole Test">Pinhole Test</SelectItem>
                        <SelectItem value="Thickness">Thickness</SelectItem>
                        <SelectItem value="Visual Inspection">Visual Inspection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="result">Result</Label>
                    <Input
                      id="result"
                      placeholder="Enter test result"
                      value={formData.result}
                      onChange={(e) => setFormData({...formData, result: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passed">Status</Label>
                    <Select onValueChange={(value) => setFormData({...formData, passed: value === 'true'})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Passed</SelectItem>
                        <SelectItem value="false">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    placeholder="Additional notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
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
                      'Add Result'
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by batch ID, test type, or product" 
              className="pl-10 bg-input border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading QC results...</span>
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
              {filteredResults.length > 0 ? (
                filteredResults.map((result) => (
                  <Card key={result.id} className="p-4 bg-card border-border">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{result.testType}</h3>
                        <StatusBadge status={result.passed ? 'normal' : 'critical'}>
                          {result.passed ? 'Passed' : 'Failed'}
                        </StatusBadge>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Batch: {result.batch.batchId}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Product: {result.batch.productType}
                        </p>
                        <p className="text-sm font-medium">
                          Result: {result.result}
                        </p>
                        {result.notes && (
                          <p className="text-xs text-muted-foreground">
                            Notes: {result.notes}
                          </p>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Tested: {new Date(result.testedAt).toLocaleString()}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 col-span-full">
                  <p className="text-muted-foreground">No QC results found</p>
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