# PMS - Authentication & Access Control System

## Overview

The PMS (Production Management System) implements a complete authentication and role-based access control (RBAC) system designed for multi-user enterprise operations with security, auditability, and compliance requirements.

## Authentication Architecture

### Login Flow

1. **Initial Access**: User navigates to `/login` (unauthenticated access redirects here)
2. **Credentials**: User enters email and password
3. **Validation**: System validates against registered user accounts
4. **Session Creation**: Upon successful authentication, session is stored in localStorage
5. **Dashboard Access**: User is redirected to main dashboard with role-based UI

### Session Management

- **Session Storage**: localStorage with `auth_session` key
- **Session Data Structure**:
  ```json
  {
    "email": "user@pms.com",
    "role": "admin",
    "loginTime": "2024-01-14T14:32:00Z"
  }
  ```
- **Auto-Logout**: Clear session data on logout
- **Session Validation**: Checked on app mount in AuthProvider

### Demo Credentials

For testing, the following accounts are available:

| Email | Password | Role | Access |
|-------|----------|------|--------|
| admin@pms.com | admin123 | Admin | Full system access |
| supervisor@pms.com | supervisor123 | Supervisor | Production control |
| qa@pms.com | qa123 | QA Manager | Quality operations |
| sales@pms.com | sales123 | Sales Manager | Order & invoice management |
| operator@pms.com | operator123 | Operator | Shop floor operations |

## Role-Based Access Control (RBAC)

### User Roles

#### 1. **Admin** (`admin`)
- **Full system access**
- User management and account creation
- System configuration
- Audit log review
- All module access
- **Accessible Routes**:
  - Dashboard, all production/inventory/quality/sales modules
  - User Management (`/admin/users`)
  - Audit Logs (`/admin/audit-logs`)

#### 2. **Supervisor** (`supervisor`)
- **Production oversight**
- Batch scheduling and process routing
- Shop floor equipment monitoring
- Recipe management
- Raw material inventory
- **Accessible Routes**:
  - Dashboard
  - Batch Scheduling, Shop Floor Control, Recipes
  - Raw Materials, Finished Goods

#### 3. **QA Manager** (`qa_manager`)
- **Quality assurance operations**
- Lab testing and result documentation
- HACCP compliance logging
- Batch quality release
- Finished goods QC verification
- **Accessible Routes**:
  - Dashboard
  - Lab Tests, HACCP Logs
  - Finished Goods QC status

#### 4. **Sales Manager** (`sales_manager`)
- **Commercial operations**
- Order management and fulfillment
- Contract and pricing management
- Tax invoicing
- FEFO inventory allocation
- **Accessible Routes**:
  - Dashboard
  - Orders, Contracts, Invoicing
  - FEFO Rotation

#### 5. **Operator** (`operator`)
- **Shop floor operations**
- Equipment operation and monitoring
- Batch processing execution
- Critical control point monitoring
- **Accessible Routes**:
  - Dashboard
  - Shop Floor Control (limited to equipment status)

## Architecture Components

### 1. **AuthContext** (`client/contexts/AuthContext.tsx`)

Global state management for authentication:

```typescript
interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}
```

**Key Methods**:
- `useAuth()`: Hook to access auth context in components
- `hasPermission()`: Check if user has required role(s)
- `login()`: Persist authenticated user
- `logout()`: Clear session and user state

### 2. **ProtectedRoute** (`client/components/ProtectedRoute.tsx`)

Route-level access control component:

```typescript
<ProtectedRoute requiredRoles={["admin", "supervisor"]}>
  <BatchScheduling />
</ProtectedRoute>
```

**Behavior**:
- Redirects unauthenticated users to `/login`
- Shows access denied message if role not permitted
- Displays loading spinner while auth status is being determined
- Supports single role or array of roles

### 3. **Login Page** (`client/pages/Login.tsx`)

User authentication interface:
- Email and password fields
- Demo account quick-fill buttons
- Error messaging
- Loading state handling
- Session persistence on successful login

### 4. **User Management** (`client/pages/AdminUsers.tsx`)

Admin dashboard for user administration:
- View all users with status filters
- User profile viewing
- Role and permission display
- User activation/deactivation
- User deletion
- Department and join date tracking
- Last login timestamp

### 5. **Audit Logs** (`client/pages/AuditLogs.tsx`)

System activity and security tracking:
- Log all user actions by timestamp
- Track action type, module, and details
- Record IP address for security
- Success/failure status indication
- Filterable by action and status
- Compliance-ready for HACCP audits

## Implementation in Routes

All protected routes follow this pattern:

```typescript
<Route
  path="/batch-scheduling"
  element={
    <ProtectedRoute requiredRoles={["admin", "supervisor"]}>
      <BatchScheduling />
    </ProtectedRoute>
  }
/>
```

### Route Access Matrix

| Route | Admin | Supervisor | QA Mgr | Sales Mgr | Operator |
|-------|-------|-----------|--------|-----------|----------|
| Dashboard | ✓ | ✓ | ✓ | ✓ | ✓ |
| Batch Scheduling | ✓ | ✓ | ✗ | ✗ | ✗ |
| Shop Floor | ✓ | ✓ | ✗ | ✗ | ✓ |
| Recipes | ✓ | ✓ | ✗ | ✗ | ✗ |
| Raw Materials | ✓ | ✓ | ✗ | ✗ | ✗ |
| Finished Goods | ✓ | ✓ | ✓ | ✗ | ✗ |
| FEFO Rotation | ✓ | ✓ | ✗ | ✓ | ✗ |
| Lab Tests | ✓ | ✗ | ✓ | ✗ | ✗ |
| HACCP Logs | ✓ | ✗ | ✓ | ✗ | ✗ |
| Orders | ✓ | ✗ | ✗ | ✓ | ✗ |
| Contracts | ✓ | ✗ | ✗ | ✓ | ✗ |
| Invoicing | ✓ | ✗ | ✗ | ✓ | ✗ |
| User Management | ✓ | ✗ | ✗ | ✗ | ✗ |
| Audit Logs | ✓ | ✗ | ✗ | ✗ | ✗ |

## UI Integration

### User Profile Menu

In the dashboard header, authenticated users see:
- User avatar with initials
- Email address
- Current role display
- Admin-only: User Management link
- Admin-only: Audit Logs link
- Sign Out button

### Role-Based Navigation

The left sidebar dynamically shows/hides navigation items based on user role:
- Supervisors see production modules
- QA Managers see quality modules
- Sales Managers see order/contract modules
- Operators see shop floor controls

## Security Features

### 1. **Session Security**
- Session stored in localStorage (not exposed to server)
- Token-less authentication (session-based)
- Automatic clearing on logout
- No sensitive data in localStorage

### 2. **Route Protection**
- All authenticated routes wrapped in ProtectedRoute
- Unauthenticated access redirects to login
- Role mismatches show error message
- Loading state prevents flash of content

### 3. **Audit Trail**
- Every user action logged with timestamp
- User email recorded with action
- IP address tracking
- Success/failure status
- Filterable by action type and status

### 4. **HACCP Compliance**
- User actions auditable for food safety
- Critical operations logged
- Batch modifications tracked
- User attribution for all changes

## Frontend Integration

### Using Authentication in Components

```typescript
import { useAuth } from "@/contexts/AuthContext";

export default function MyComponent() {
  const { user, logout, hasPermission } = useAuth();

  // Check role
  if (!hasPermission("admin")) {
    return <div>Access Denied</div>;
  }

  // Use user data
  return <div>Welcome, {user?.email}</div>;
}
```

### Conditional Rendering by Role

```typescript
{user?.role === "admin" && (
  <a href="/admin/users">User Management</a>
)}
```

## Testing

### Admin Functions
1. Login as `admin@pms.com` / `admin123`
2. Click user avatar in top right
3. Click "User Management"
4. View all users, filter by status
5. Select user to see details and modify status
6. Click "Audit Logs" to view system activity

### Role-Based Access
1. Login as different user roles
2. Note which modules are accessible
3. Try accessing restricted routes (e.g., `/admin/users` as non-admin)
4. Verify access denied message appears

### Session Management
1. Login and refresh page - session persists
2. Click "Sign Out" - redirected to login page
3. Try accessing protected route - redirected to login
4. Different role login - UI updates accordingly

## Future Enhancements

### Phase 2
- Password reset functionality
- Two-factor authentication
- API token-based auth
- OAuth2/SSO integration
- Email verification on signup

### Phase 3
- Fine-grained permissions (feature-level)
- Custom role creation
- Department-based access groups
- Time-based access restrictions
- Geo-IP blocking

### Phase 4
- Biometric authentication
- Hardware key support
- Single sign-on with enterprise directories
- Advanced audit analytics
- Compliance report generation

## Compliance

This authentication system supports:
- **HACCP**: User attribution for all production operations
- **FTA VAT**: Audit trail for financial transactions
- **Food Safety**: Documented user access controls
- **ISO Standards**: Role-based responsibility tracking

## Support

For authentication issues:
1. Clear localStorage and refresh
2. Verify user email in demo accounts list
3. Check browser console for errors
4. Review audit logs for failed login attempts
