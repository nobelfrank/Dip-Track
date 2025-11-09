# Role-Based Access Control (RBAC) Implementation

## 🔐 Overview

The application implements a comprehensive RBAC system with four distinct roles and granular permissions for secure access control.

## 👥 Roles & Permissions

### **Admin**
- **Full System Access**: Complete control over all features
- **Permissions**:
  - View Dashboard, Batches, Alerts, QC
  - Create, Edit, Delete Batches
  - Acknowledge & Assign Alerts
  - Perform QC Operations
  - Manage Users & System Configuration

### **Supervisor** 
- **Management Level Access**: Oversight and coordination
- **Permissions**:
  - View Dashboard, Batches, Alerts, QC
  - Edit Batches (no creation/deletion)
  - Acknowledge & Assign Alerts
  - Perform QC Operations

### **Operator**
- **Production Focus**: Batch creation and management
- **Permissions**:
  - View Dashboard & Batches
  - Create & Edit Batches
  - Limited alert visibility

### **QC Officer**
- **Quality Control Focus**: Testing and quality assurance
- **Permissions**:
  - View Dashboard, Alerts, QC
  - Acknowledge Alerts
  - Perform QC Operations

## 🛡️ Security Implementation

### **Frontend Protection**
```typescript
// Route Protection
<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR]}>
  <ComponentName />
</ProtectedRoute>

// Permission Checks
const { hasPermission, isAdmin } = usePermissions()
{hasPermission(PERMISSIONS.CREATE_BATCH) && <CreateButton />}
```

### **API Protection**
```typescript
// API Route Protection
const authResult = await requirePermission(request, PERMISSIONS.VIEW_BATCHES)
if ('error' in authResult) {
  return NextResponse.json({ error: authResult.error }, { status: authResult.status })
}
```

### **Navigation Control**
- **Dynamic Menus**: Navigation items appear based on user permissions
- **Role-based Visibility**: Admin-only features hidden from other roles
- **Unauthorized Redirect**: Automatic redirect to appropriate pages

## 📋 Permission Matrix

| Feature | Admin | Supervisor | Operator | QC Officer |
|---------|-------|------------|----------|------------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| View Batches | ✅ | ✅ | ✅ | ❌ |
| Create Batches | ✅ | ❌ | ✅ | ❌ |
| Edit Batches | ✅ | ✅ | ✅ | ❌ |
| Delete Batches | ✅ | ❌ | ❌ | ❌ |
| View Alerts | ✅ | ✅ | ❌ | ✅ |
| Acknowledge Alerts | ✅ | ✅ | ❌ | ✅ |
| Assign Alerts | ✅ | ✅ | ❌ | ❌ |
| QC Operations | ✅ | ✅ | ❌ | ✅ |
| User Management | ✅ | ❌ | ❌ | ❌ |
| System Config | ✅ | ❌ | ❌ | ❌ |

## 🔧 Implementation Details

### **Core Files**
- `src/lib/rbac.ts` - Role definitions and permission logic
- `src/components/ProtectedRoute.tsx` - Route protection component
- `src/hooks/usePermissions.ts` - Permission checking hook
- `src/lib/api-auth.ts` - API authentication middleware

### **Database Schema**
```sql
-- User roles are stored in user_roles table
-- Multiple roles per user supported
-- Role-based queries for data access
```

### **Session Management**
- JWT tokens include user roles
- Server-side session validation
- Automatic role refresh on login

## 🚀 Usage Examples

### **Protecting Pages**
```typescript
export default function BatchesPage() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.OPERATOR]}>
      <BatchesContent />
    </ProtectedRoute>
  )
}
```

### **Conditional Rendering**
```typescript
const { hasPermission, isAdmin } = usePermissions()

return (
  <div>
    {hasPermission(PERMISSIONS.CREATE_BATCH) && <CreateBatchButton />}
    {isAdmin && <AdminPanel />}
  </div>
)
```

### **API Protection**
```typescript
export async function POST(request: NextRequest) {
  const authResult = await requirePermission(request, PERMISSIONS.CREATE_BATCH)
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status })
  }
  // Protected logic here
}
```

## 🔄 Role Assignment

### **Default Assignment**
- New users automatically get **Admin** role (configurable)
- Role assignment through admin interface
- Multiple roles per user supported

### **Role Management**
- Admin can assign/revoke roles
- Real-time permission updates
- Audit trail for role changes

## 🛠️ Customization

### **Adding New Roles**
1. Update `ROLES` constant in `rbac.ts`
2. Define permissions in `ROLE_PERMISSIONS`
3. Update database schema if needed
4. Add role to UI components

### **Adding New Permissions**
1. Add to `PERMISSIONS` constant
2. Update `ROLE_PERMISSIONS` mapping
3. Implement permission checks in components
4. Add API route protection

## 🔍 Testing RBAC

### **Test Scenarios**
1. **Role Switching**: Test different user roles
2. **Permission Boundaries**: Verify access restrictions
3. **API Security**: Test unauthorized API access
4. **Navigation**: Verify menu visibility
5. **Route Protection**: Test direct URL access

### **Test Users**
Create test users with different roles to verify:
- Admin: Full access to all features
- Supervisor: Management-level access
- Operator: Production-focused access  
- QC Officer: Quality control access

## 📈 Benefits

- **Security**: Granular access control
- **Scalability**: Easy to add new roles/permissions
- **Maintainability**: Centralized permission logic
- **User Experience**: Role-appropriate interfaces
- **Compliance**: Audit trail and access logging

The RBAC system ensures secure, role-appropriate access while maintaining a seamless user experience across all manufacturing system functions.