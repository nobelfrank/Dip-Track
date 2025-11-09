import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/api-auth'
import { PERMISSIONS } from '@/lib/rbac'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requirePermission(request, PERMISSIONS.VIEW_BATCHES)
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    // Use existing batch system for glove batches
    const batches = await prisma.batch.findMany({
      where: {
        productType: { in: ['Surgical Glove', 'Examination Glove'] }
      },
      include: {
        operator: {
          select: { id: true, fullName: true, email: true }
        },
        batchStages: true,
        qcResults: true
      },
      orderBy: { createdAt: 'desc' }
    })

    const gloveBatches = batches.map(batch => {
      const gloveData = batch.batchStages.find(s => s.stage === 1)
      const data = gloveData ? JSON.parse(gloveData.data || '{}') : {}
      
      return {
        id: batch.id,
        gloveBatchId: batch.batchId,
        latexBatchId: data.latexBatchId || '',
        productType: batch.productType,
        manufacturingDate: batch.startDate,
        status: batch.status,
        continuousData: JSON.stringify(data.continuousData || {}),
        processData: JSON.stringify(data.processData || {}),
        qcData: JSON.stringify(data.qcData || {}),
        latexBatch: {
          batchId: data.latexBatchId || 'N/A',
          productType: batch.productType
        },
        gloveQcResults: batch.qcResults || []
      }
    })

    return NextResponse.json(gloveBatches)
  } catch (error) {
    console.error('Error fetching glove batches:', error)
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
    const {
      gloveBatchId,
      latexBatchId,
      productType,
      continuousData,
      processData,
      qcData
    } = body

    const { session } = authResult

    // Create batch for glove manufacturing
    const batch = await prisma.batch.create({
      data: {
        batchId: gloveBatchId,
        productType,
        startDate: new Date(),
        shift: 'Day',
        operatorId: session.user.id,
        status: 'in_progress'
      },
      include: {
        operator: {
          select: { id: true, fullName: true, email: true }
        }
      }
    })

    // Store glove data in batch stage
    await prisma.batchStage.create({
      data: {
        batchId: batch.id,
        stage: 1,
        data: JSON.stringify({
          latexBatchId,
          continuousData,
          processData,
          qcData
        })
      }
    })

    return NextResponse.json({
      id: batch.id,
      gloveBatchId: batch.batchId,
      latexBatchId,
      productType: batch.productType,
      manufacturingDate: batch.startDate,
      status: batch.status,
      continuousData: JSON.stringify(continuousData || {}),
      processData: JSON.stringify(processData || {}),
      qcData: JSON.stringify(qcData || {}),
      latexBatch: {
        batchId: latexBatchId,
        productType: batch.productType
      },
      gloveQcResults: []
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating glove batch:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}