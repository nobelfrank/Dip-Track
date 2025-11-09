import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { requirePermission } from '@/lib/api-auth'
import { PERMISSIONS } from '@/lib/rbac'

export async function POST(request: NextRequest) {
  const authResult = await requirePermission(request, PERMISSIONS.MANAGE_USERS)
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status })
  }

  try {
    const body = await request.json()
    const { email, password, fullName, departmentId, primaryFunction, role } = body

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        userRoles: {
          create: { role }
        },
        profile: {
          create: {
            email,
            fullName,
            departmentId: departmentId || null,
            primaryFunction
          }
        }
      }
    })

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}