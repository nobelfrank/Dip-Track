import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/api-auth'
import { PERMISSIONS } from '@/lib/rbac'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requirePermission(request, PERMISSIONS.VIEW_BATCHES)
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const batch = await prisma.batch.findUnique({
      where: { id: params.id },
      include: {
        operator: {
          select: { id: true, fullName: true, email: true }
        },
        batchStages: {
          orderBy: { stage: 'asc' }
        },
        qcResults: {
          orderBy: { testedAt: 'desc' }
        }
      }
    })

    if (!batch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 })
    }

    return NextResponse.json(batch)
  } catch (error) {
    console.error('Error fetching batch details:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}