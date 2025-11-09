'use client'

import { useSession } from 'next-auth/react'
import { hasPermission, hasRole, Permission, Role } from '@/lib/rbac'

export function usePermissions() {
  const { data: session } = useSession()
  const userRoles = session?.user?.roles || []

  return {
    hasPermission: (permission: Permission) => hasPermission(userRoles, permission),
    hasRole: (role: Role) => hasRole(userRoles, role),
    hasAnyRole: (roles: Role[]) => roles.some(role => hasRole(userRoles, role)),
    userRoles,
    isAdmin: hasRole(userRoles, 'admin'),
    isSupervisor: hasRole(userRoles, 'supervisor'),
    isOperator: hasRole(userRoles, 'operator'),
    isQCOfficer: hasRole(userRoles, 'qc_officer')
  }
}