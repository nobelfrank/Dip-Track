import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { hasPermission, Permission } from './rbac'

export async function requireAuth(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return { error: 'Unauthorized', status: 401 }
  }
  
  return { session, user: session.user }
}

export async function requirePermission(request: NextRequest, permission: Permission) {
  const authResult = await requireAuth(request)
  
  if ('error' in authResult) {
    return authResult
  }
  
  const userRoles = authResult.user.roles || []
  
  if (!hasPermission(userRoles, permission)) {
    return { error: 'Forbidden', status: 403 }
  }
  
  return authResult
}