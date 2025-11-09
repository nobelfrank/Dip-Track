import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/api-auth'
import { PERMISSIONS } from '@/lib/rbac'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requirePermission(request, PERMISSIONS.VIEW_DASHBOARD)
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    // Get active batches count
    const activeBatchesCount = await prisma.batch.count({
      where: { status: 'active' }
    })

    // Get active alerts count
    const activeAlertsCount = await prisma.alert.count({
      where: { status: 'active' }
    })

    // Get critical alerts count
    const criticalAlertsCount = await prisma.alert.count({
      where: { 
        status: 'active',
        severity: 'critical'
      }
    })

    // Calculate OEE (mock calculation - replace with real logic)
    const oee = 87 // This should be calculated from actual production data

    const metrics = {
      oee,
      activeBatches: activeBatchesCount,
      activeAlerts: activeAlertsCount,
      criticalAlerts: criticalAlertsCount
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}