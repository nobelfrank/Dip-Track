import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/api-auth'
import { PERMISSIONS } from '@/lib/rbac'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requirePermission(request, PERMISSIONS.ACKNOWLEDGE_ALERTS)
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    const body = await request.json()
    const { status, assignedTo } = body

    const alert = await prisma.alert.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(assignedTo && { assignedTo }),
        updatedAt: new Date()
      },
      include: {
        batch: {
          select: { batchId: true, productType: true }
        },
        assignedUser: {
          select: { id: true, fullName: true, email: true }
        }
      }
    })

    return NextResponse.json(alert)
  } catch (error) {
    console.error('Error updating alert:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}