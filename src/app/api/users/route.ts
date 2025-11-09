import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/api-auth'
import { PERMISSIONS } from '@/lib/rbac'

export async function GET(request: NextRequest) {
  const authResult = await requirePermission(request, PERMISSIONS.MANAGE_USERS)
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status })
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        profile: {
          select: {
            primaryFunction: true,
            department: {
              select: { name: true }
            }
          }
        },
        userRoles: {
          select: { role: true }
        }
      },
      orderBy: { fullName: 'asc' }
    })

    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      primaryFunction: user.profile?.primaryFunction || '',
      department: user.profile?.department,
      userRoles: user.userRoles
    }))

    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}