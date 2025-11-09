export const ROLES = {
  ADMIN: 'admin',
  SUPERVISOR: 'supervisor', 
  OPERATOR: 'operator',
  QC_OFFICER: 'qc_officer'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: 'view_dashboard',
  
  // Batches
  VIEW_BATCHES: 'view_batches',
  CREATE_BATCH: 'create_batch',
  EDIT_BATCH: 'edit_batch',
  DELETE_BATCH: 'delete_batch',
  
  // Alerts
  VIEW_ALERTS: 'view_alerts',
  ACKNOWLEDGE_ALERTS: 'acknowledge_alerts',
  ASSIGN_ALERTS: 'assign_alerts',
  
  // QC
  VIEW_QC: 'view_qc',
  VIEW_QC_RESULTS: 'view_qc_results',
  CREATE_QC_RESULT: 'create_qc_result',
  PERFORM_QC: 'perform_qc',
  
  // Latex Manufacturing
  VIEW_FIELD_LATEX: 'view_field_latex',
  CREATE_FIELD_LATEX: 'create_field_latex',
  VIEW_LATEX_PROCESS: 'view_latex_process',
  CREATE_LATEX_PROCESS: 'create_latex_process',
  VIEW_GLOVES: 'view_gloves',
  CREATE_GLOVES: 'create_gloves',
  
  // Admin
  VIEW_ADMIN: 'view_admin',
  MANAGE_USERS: 'manage_users',
  SYSTEM_CONFIG: 'system_config'
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_BATCHES,
    PERMISSIONS.CREATE_BATCH,
    PERMISSIONS.EDIT_BATCH,
    PERMISSIONS.DELETE_BATCH,
    PERMISSIONS.VIEW_ALERTS,
    PERMISSIONS.ACKNOWLEDGE_ALERTS,
    PERMISSIONS.ASSIGN_ALERTS,
    PERMISSIONS.VIEW_QC,
    PERMISSIONS.VIEW_QC_RESULTS,
    PERMISSIONS.CREATE_QC_RESULT,
    PERMISSIONS.PERFORM_QC,
    PERMISSIONS.VIEW_FIELD_LATEX,
    PERMISSIONS.CREATE_FIELD_LATEX,
    PERMISSIONS.VIEW_LATEX_PROCESS,
    PERMISSIONS.CREATE_LATEX_PROCESS,
    PERMISSIONS.VIEW_GLOVES,
    PERMISSIONS.CREATE_GLOVES,
    PERMISSIONS.VIEW_ADMIN,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.SYSTEM_CONFIG
  ],
  [ROLES.SUPERVISOR]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_BATCHES,
    PERMISSIONS.EDIT_BATCH,
    PERMISSIONS.VIEW_ALERTS,
    PERMISSIONS.ACKNOWLEDGE_ALERTS,
    PERMISSIONS.ASSIGN_ALERTS,
    PERMISSIONS.VIEW_QC,
    PERMISSIONS.VIEW_QC_RESULTS,
    PERMISSIONS.CREATE_QC_RESULT,
    PERMISSIONS.PERFORM_QC,
    PERMISSIONS.VIEW_FIELD_LATEX,
    PERMISSIONS.CREATE_FIELD_LATEX,
    PERMISSIONS.VIEW_LATEX_PROCESS,
    PERMISSIONS.CREATE_LATEX_PROCESS,
    PERMISSIONS.VIEW_GLOVES,
    PERMISSIONS.CREATE_GLOVES
  ],
  [ROLES.OPERATOR]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_BATCHES,
    PERMISSIONS.CREATE_BATCH,
    PERMISSIONS.EDIT_BATCH,
    PERMISSIONS.VIEW_FIELD_LATEX,
    PERMISSIONS.CREATE_FIELD_LATEX,
    PERMISSIONS.VIEW_LATEX_PROCESS,
    PERMISSIONS.CREATE_LATEX_PROCESS,
    PERMISSIONS.VIEW_GLOVES,
    PERMISSIONS.CREATE_GLOVES
  ],
  [ROLES.QC_OFFICER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ALERTS,
    PERMISSIONS.ACKNOWLEDGE_ALERTS,
    PERMISSIONS.VIEW_QC,
    PERMISSIONS.VIEW_QC_RESULTS,
    PERMISSIONS.CREATE_QC_RESULT,
    PERMISSIONS.PERFORM_QC
  ]
};

export function hasPermission(userRoles: string[], permission: Permission): boolean {
  return userRoles.some(role => 
    ROLE_PERMISSIONS[role as Role]?.includes(permission)
  );
}

export function hasRole(userRoles: string[], role: Role): boolean {
  return userRoles.includes(role);
}

export function canAccessRoute(userRoles: string[], route: string): boolean {
  const routePermissions: Record<string, Permission> = {
    '/': PERMISSIONS.VIEW_DASHBOARD,
    '/dashboard': PERMISSIONS.VIEW_DASHBOARD,
    '/batches': PERMISSIONS.VIEW_BATCHES,
    '/batches/create': PERMISSIONS.CREATE_BATCH,
    '/alerts': PERMISSIONS.VIEW_ALERTS,
    '/qc': PERMISSIONS.VIEW_QC,
    '/latex/field': PERMISSIONS.VIEW_FIELD_LATEX,
    '/latex/process': PERMISSIONS.VIEW_LATEX_PROCESS,
    '/gloves': PERMISSIONS.VIEW_GLOVES,
    '/admin': PERMISSIONS.VIEW_ADMIN
  };

  const requiredPermission = routePermissions[route];
  return requiredPermission ? hasPermission(userRoles, requiredPermission) : false;
}