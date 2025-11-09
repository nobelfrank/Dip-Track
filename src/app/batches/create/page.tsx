'use client'

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useBatches } from "@/hooks/useBatches";

export default function CreateBatch() {
  const router = useRouter();
  const { createBatch } = useBatches();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    productType: '',
    latexBatchId: '',
    shift: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productType || !formData.latexBatchId || !formData.shift) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await createBatch(formData);
      router.push('/batches');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create batch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'operator']}>
      <DesktopSidebar />
      <div className="min-h-screen bg-background pb-20 md:pb-8 md:ml-64">
        <Header title="Create Batch" />

        <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Create New Batch</h2>
              <p className="text-sm text-muted-foreground">Set up a new production batch</p>
            </div>
          </div>

          <Card className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="productType">Product Type</Label>
                <Select onValueChange={(value) => setFormData({...formData, productType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Surgical Glove">Surgical Glove</SelectItem>
                    <SelectItem value="Examination Glove">Examination Glove</SelectItem>
                    <SelectItem value="Industrial Glove">Industrial Glove</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="latexBatchId">Latex Batch ID</Label>
                <Input
                  id="latexBatchId"
                  placeholder="Enter latex batch ID"
                  value={formData.latexBatchId}
                  onChange={(e) => setFormData({...formData, latexBatchId: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shift">Shift</Label>
                <Select onValueChange={(value) => setFormData({...formData, shift: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning">Morning (6AM - 2PM)</SelectItem>
                    <SelectItem value="Afternoon">Afternoon (2PM - 10PM)</SelectItem>
                    <SelectItem value="Night">Night (10PM - 6AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>



              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Batch'
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}