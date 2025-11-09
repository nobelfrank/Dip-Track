'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldX, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Unauthorized() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <ShieldX className="h-16 w-16 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page.
        </p>
        <Button 
          onClick={() => router.push('/')}
          className="w-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go to Dashboard
        </Button>
      </Card>
    </div>
  )
}