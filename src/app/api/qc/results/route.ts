import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/api-auth'
import { PERMISSIONS } from '@/lib/rbac'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requirePermission(request, PERMISSIONS.VIEW_QC_RESULTS)
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    const qcResults = await prisma.qCResult.findMany({
      include: {
        batch: {
          select: { batchId: true, productType: true }
        }
      },
      orderBy: { testedAt: 'desc' }
    })

    return NextResponse.json(qcResults)
  } catch (error) {
    console.error('Error fetching QC results:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requirePermission(request, PERMISSIONS.CREATE_QC_RESULT)
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    const body = await request.json()
    const { batchId, testType, result, passed, notes } = body

    const qcResult = await prisma.qCResult.create({
      data: {
        batchId,
        testType,
        result,
        passed,
        notes: notes || null,
        testedAt: new Date()
      },
      include: {
        batch: {
          select: { batchId: true, productType: true }
        }
      }
    })

    return NextResponse.json(qcResult, { status: 201 })
  } catch (error) {
    console.error('Error creating QC result:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}