import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {

    const alerts = await prisma.alert.findMany({
      include: {
        batch: {
          select: { batchId: true, productType: true }
        },
        assignedUser: {
          select: { id: true, fullName: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(alerts)
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, severity, source, batchId } = body

    const alert = await prisma.alert.create({
      data: {
        title,
        description,
        severity,
        source,
        batchId: batchId || null,
        status: 'active'
      },
      include: {
        batch: {
          select: { batchId: true, productType: true }
        }
      }
    })

    return NextResponse.json(alert, { status: 201 })
  } catch (error) {
    console.error('Error creating alert:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}