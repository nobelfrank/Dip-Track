import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/api-auth'
import { PERMISSIONS } from '@/lib/rbac'

function getStageNameByNumber(stage: number): string {
  const stageNames = {
    1: 'Field Latex Collection',
    2: 'Dilution and Stabilization', 
    3: 'Centrifugation',
    4: 'Final Stabilization',
    5: 'Storage & Dispatch'
  }
  return stageNames[stage as keyof typeof stageNames] || `Stage ${stage}`
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await requirePermission(request, PERMISSIONS.VIEW_BATCHES)
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { searchParams } = new URL(request.url)
    const batchId = searchParams.get('batchId')

    if (batchId) {
      const batchStages = await prisma.batchStage.findMany({
        where: { batchId },
        include: {
          batch: {
            select: { batchId: true, productType: true }
          }
        },
        orderBy: { stage: 'asc' }
      })
      
      const processStages = batchStages.map(stage => ({
        id: stage.id,
        batchId: stage.batchId,
        stageName: getStageNameByNumber(stage.stage),
        stageNumber: stage.stage,
        data: stage.data,
        status: 'completed',
        completedAt: stage.updatedAt,
        batch: stage.batch
      }))
      
      return NextResponse.json(processStages)
    }

    const batchStages = await prisma.batchStage.findMany({
      include: {
        batch: {
          select: { batchId: true, productType: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const processStages = batchStages.map(stage => ({
      id: stage.id,
      batchId: stage.batchId,
      stageName: getStageNameByNumber(stage.stage),
      stageNumber: stage.stage,
      data: stage.data,
      status: 'completed',
      completedAt: stage.updatedAt,
      batch: stage.batch
    }))

    return NextResponse.json(processStages)
  } catch (error) {
    console.error('Error fetching process stages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requirePermission(request, PERMISSIONS.CREATE_BATCH)
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const body = await request.json()
    const { batchId, stageName, stageNumber, data } = body

    const batchStage = await prisma.batchStage.create({
      data: {
        batchId,
        stage: stageNumber,
        data: JSON.stringify(data)
      }
    })

    // Update batch progress
    await prisma.batch.update({
      where: { id: batchId },
      data: {
        currentStage: stageNumber + 1,
        stagesCompleted: stageNumber,
        progressPercentage: Math.round((stageNumber / 5) * 100)
      }
    })

    return NextResponse.json({
      id: batchStage.id,
      batchId,
      stageName,
      stageNumber,
      data: batchStage.data,
      status: 'completed',
      completedAt: batchStage.updatedAt
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating process stage:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}