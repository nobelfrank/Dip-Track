'use client'

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { BottomNav } from "@/components/BottomNav";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Calendar, User, Beaker, Activity } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface BatchDetails {
  id: string;
  batchId: string;
  productType: string;
  latexBatchId?: string;
  startDate: string;
  endDate?: string;
  shift: string;
  status: string;
  currentStage: number;
  stagesCompleted: number;
  progressPercentage: number;
  operator: {
    fullName: string;
    email: string;
  };
  batchStages: Array<{
    id: string;
    stage: number;
    data: string;
    createdAt: string;
  }>;
  qcResults: Array<{
    id: string;
    testType: string;
    result: string;
    passed: boolean;
    testedAt: string;
  }>;
}

export default function BatchDetails() {
  const router = useRouter();
  const params = useParams();
  const [batch, setBatch] = useState<BatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/batches/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch batch details');
        }
        
        const data = await response.json();
        setBatch(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBatch();
    }
  }, [params.id]);

  const getStageNames = () => [
    'Field Latex Collection',
    'Dilution and Stabilization', 
    'Centrifugation',
    'Final Stabilization',
    'Storage & Dispatch'
  ];

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['admin', 'supervisor', 'operator']}>
        <DesktopSidebar />
        <div className="min-h-screen bg-background pb-20 md:pb-8 md:ml-64">
          <Header title="Batch Details" />
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading batch details...</span>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !batch) {
    return (
      <ProtectedRoute allowedRoles={['admin', 'supervisor', 'operator']}>
        <DesktopSidebar />
        <div className="min-h-screen bg-background pb-20 md:pb-8 md:ml-64">
          <Header title="Batch Details" />
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error || 'Batch not found'}</p>
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin', 'supervisor', 'operator']}>
      <DesktopSidebar />
      <div className="min-h-screen bg-background pb-20 md:pb-8 md:ml-64">
        <Header title="Batch Details" />

        <div className="p-4 sm:p-6 lg:p-8 space-y-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">{batch.batchId}</h2>
              <p className="text-sm text-muted-foreground">{batch.productType}</p>
            </div>
            <div className="ml-auto">
              <StatusBadge status={batch.status === 'completed' ? 'normal' : batch.status === 'active' ? 'info' : 'normal'}>
                {batch.status === 'completed' ? 'Completed' : batch.status === 'active' ? 'In Progress' : 'Draft'}
              </StatusBadge>
            </div>
          </div>

          {/* Batch Overview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Batch Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">{new Date(batch.startDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Operator</p>
                  <p className="font-medium">{batch.operator.fullName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Beaker className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Shift</p>
                  <p className="font-medium">{batch.shift}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="font-medium">{batch.progressPercentage}%</p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Stage {batch.currentStage} of 5
                </span>
                <span className="font-medium">
                  {batch.progressPercentage}%
                </span>
              </div>
              <Progress value={batch.progressPercentage} className="h-3" />
            </div>
          </Card>

          {/* Detailed Information */}
          <Tabs defaultValue="stages" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stages">Process Stages</TabsTrigger>
              <TabsTrigger value="qc">QC Results</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="stages" className="space-y-4">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Process Stages</h3>
                <div className="space-y-4">
                  {getStageNames().map((stageName, index) => {
                    const stageNumber = index + 1;
                    const stageData = batch.batchStages.find(s => s.stage === stageNumber);
                    const isCompleted = stageNumber <= batch.stagesCompleted;
                    const isCurrent = stageNumber === batch.currentStage;
                    
                    return (
                      <div key={stageNumber} className={`flex items-center gap-4 p-4 rounded-lg border ${
                        isCompleted ? 'bg-green-50 border-green-200' : 
                        isCurrent ? 'bg-blue-50 border-blue-200' : 
                        'bg-gray-50 border-gray-200'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          isCompleted ? 'bg-green-500 text-white' :
                          isCurrent ? 'bg-blue-500 text-white' :
                          'bg-gray-300 text-gray-600'
                        }`}>
                          {stageNumber}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{stageName}</h4>
                          {stageData && (
                            <p className="text-sm text-muted-foreground">
                              Completed: {new Date(stageData.createdAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <StatusBadge status={isCompleted ? 'normal' : isCurrent ? 'info' : 'normal'}>
                          {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                        </StatusBadge>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="qc" className="space-y-4">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quality Control Results</h3>
                {batch.qcResults.length > 0 ? (
                  <div className="space-y-4">
                    {batch.qcResults.map((result) => (
                      <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{result.testType}</h4>
                          <p className="text-sm text-muted-foreground">
                            Result: {result.result}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Tested: {new Date(result.testedAt).toLocaleString()}
                          </p>
                        </div>
                        <StatusBadge status={result.passed ? 'normal' : 'critical'}>
                          {result.passed ? 'Passed' : 'Failed'}
                        </StatusBadge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No QC results available</p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Batch Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 border-l-4 border-blue-500">
                    <div>
                      <h4 className="font-medium">Batch Created</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(batch.startDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {batch.batchStages.map((stage) => (
                    <div key={stage.id} className="flex items-center gap-4 p-4 border-l-4 border-green-500">
                      <div>
                        <h4 className="font-medium">
                          {getStageNames()[stage.stage - 1]} Completed
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(stage.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}