import { useState, useMemo, useCallback } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  Search,
  Download,
  Shield,
  Key,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,
  Check,
  Eye,
  EyeOff,
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: "active" | "inactive" | "suspended";
  joinDate: string;
  lastLogin?: string;
  lastModified?: string;
  loginCount: number;
  forcePasswordChange: boolean;
  phone?: string;
}

type SortField = "name" | "role" | "status" | "lastLogin" | "joinDate";
type SortDir = "asc" | "desc";
type ModalType = "create" | "edit" | "resetPassword" | "statusChange" | "delete" | "bulkAction" | null;

// ─── Constants ──────────────────────────────────────────────────────────────────

const ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: "admin", label: "Administrator", description: "Full system access, user management, configuration, audit logs" },
  { value: "supervisor", label: "Supervisor", description: "Production oversight, batch management, equipment control, inventory" },
  { value: "qa_manager", label: "QA Manager", description: "Quality testing, lab operations, HACCP compliance, batch release" },
  { value: "operator", label: "Operator", description: "Shop floor operations, equipment monitoring, batch processing" },
];

const DEPARTMENTS = ["Management", "Production", "Quality Assurance", "Shop Floor", "Engineering", "Logistics"];

const PERMISSION_MATRIX: { module: string; admin: boolean; supervisor: boolean; qa_manager: boolean; operator: boolean }[] = [
  { module: "Dashboard", admin: true, supervisor: true, qa_manager: true, operator: true },
  { module: "Batch Scheduling", admin: true, supervisor: true, qa_manager: false, operator: false },
  { module: "Shop Floor Control", admin: true, supervisor: true, qa_manager: false, operator: true },
  { module: "Recipe Management", admin: true, supervisor: true, qa_manager: false, operator: false },
  { module: "Raw Materials", admin: true, supervisor: true, qa_manager: false, operator: false },
  { module: "Finished Goods", admin: true, supervisor: true, qa_manager: true, operator: false },
  { module: "FEFO Rotation", admin: true, supervisor: true, qa_manager: false, operator: false },
  { module: "Lab Tests", admin: true, supervisor: false, qa_manager: true, operator: false },
  { module: "HACCP Logs", admin: true, supervisor: false, qa_manager: true, operator: false },
  { module: "User Management", admin: true, supervisor: false, qa_manager: false, operator: false },
  { module: "Audit Logs", admin: true, supervisor: false, qa_manager: false, operator: false },
];

const PAGE_SIZES = [5, 10, 25];

// ─── Seed Data ──────────────────────────────────────────────────────────────────

const seedUsers: User[] = [
  { id: "USR-001", name: "Ahmed Al-Mansouri", email: "admin@pms.com", role: "admin", department: "Management", status: "active", joinDate: "2024-01-01", lastLogin: "2024-01-14 14:32", lastModified: "2024-01-10", loginCount: 142, forcePasswordChange: false, phone: "+971 50 123 4567" },
  { id: "USR-002", name: "Fatima Al-Zahra", email: "supervisor@pms.com", role: "supervisor", department: "Production", status: "active", joinDate: "2024-01-05", lastLogin: "2024-01-14 12:15", lastModified: "2024-01-12", loginCount: 98, forcePasswordChange: false, phone: "+971 50 234 5678" },
  { id: "USR-003", name: "Dr. Aisha Ahmed", email: "qa@pms.com", role: "qa_manager", department: "Quality Assurance", status: "active", joinDate: "2024-01-08", lastLogin: "2024-01-14 10:42", lastModified: "2024-01-09", loginCount: 67, forcePasswordChange: false },
  { id: "USR-004", name: "Layla Al-Noor", email: "operator@pms.com", role: "operator", department: "Shop Floor", status: "active", joinDate: "2024-01-12", lastLogin: "2024-01-14 08:30", lastModified: "2024-01-13", loginCount: 45, forcePasswordChange: false },
  { id: "USR-005", name: "Hassan Al-Rashid", email: "hassan@pms.com", role: "operator", department: "Shop Floor", status: "inactive", joinDate: "2023-12-15", lastLogin: "2023-12-20 15:45", lastModified: "2024-01-02", loginCount: 12, forcePasswordChange: true },
  { id: "USR-006", name: "Omar Khalid", email: "omar@pms.com", role: "supervisor", department: "Production", status: "active", joinDate: "2024-01-03", lastLogin: "2024-01-13 16:20", lastModified: "2024-01-08", loginCount: 78, forcePasswordChange: false, phone: "+971 50 345 6789" },
  { id: "USR-007", name: "Sara Al-Amri", email: "sara@pms.com", role: "qa_manager", department: "Quality Assurance", status: "suspended", joinDate: "2023-11-20", lastLogin: "2024-01-05 09:15", lastModified: "2024-01-06", loginCount: 34, forcePasswordChange: true },
  { id: "USR-008", name: "Khalid Bin Saeed", email: "khalid@pms.com", role: "operator", department: "Engineering", status: "active", joinDate: "2024-01-10", lastLogin: "2024-01-14 07:00", lastModified: "2024-01-11", loginCount: 22, forcePasswordChange: false },
];

// ─── Helpers ────────────────────────────────────────────────────────────────────

function generateId(users: User[]) {
  const max = users.reduce((m, u) => {
    const n = parseInt(u.id.replace("USR-", ""), 10);
    return n > m ? n : m;
  }, 0);
  return `USR-${String(max + 1).padStart(3, "0")}`;
}

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 2) return { score, label: "Weak", color: "text-critical" };
  if (score <= 4) return { score, label: "Fair", color: "text-warning" };
  return { score, label: "Strong", color: "text-success" };
}

function passwordErrors(pw: string): string[] {
  const errs: string[] = [];
  if (pw.length < 8) errs.push("Minimum 8 characters");
  if (!/[A-Z]/.test(pw)) errs.push("At least one uppercase letter");
  if (!/[a-z]/.test(pw)) errs.push("At least one lowercase letter");
  if (!/[0-9]/.test(pw)) errs.push("At least one number");
  if (!/[^A-Za-z0-9]/.test(pw)) errs.push("At least one special character");
  return errs;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export default function AdminUsers() {
  const { user: currentUser } = useAuth();

  // ── State ───
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<UserRole | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "suspended">("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState<"details" | "permissions" | "security">("details");

  // ── Modal State ───
  const [modal, setModal] = useState<ModalType>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form state for create/edit
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<UserRole>("operator");
  const [formDept, setFormDept] = useState(DEPARTMENTS[0]);
  const [formPhone, setFormPhone] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formConfirmPassword, setFormConfirmPassword] = useState("");
  const [formShowPassword, setFormShowPassword] = useState(false);
  const [formForceChange, setFormForceChange] = useState(false);

  // Status change
  const [statusChangeTarget, setStatusChangeTarget] = useState<User | null>(null);
  const [statusChangeAction, setStatusChangeAction] = useState<"active" | "inactive" | "suspended">("inactive");
  const [statusChangeReason, setStatusChangeReason] = useState("");

  // Bulk
  const [bulkAction, setBulkAction] = useState<"activate" | "deactivate" | "changeRole">("activate");
  const [bulkRole, setBulkRole] = useState<UserRole>("operator");

  // ── Toast helper ───
  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Filtered & Sorted Data ───
  const filtered = useMemo(() => {
    let result = [...users];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.department.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q)
      );
    }
    if (filterRole !== "all") result = result.filter((u) => u.role === filterRole);
    if (filterStatus !== "all") result = result.filter((u) => u.status === filterStatus);

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === "name") cmp = a.name.localeCompare(b.name);
      else if (sortField === "role") cmp = a.role.localeCompare(b.role);
      else if (sortField === "status") cmp = a.status.localeCompare(b.status);
      else if (sortField === "lastLogin") cmp = (a.lastLogin || "").localeCompare(b.lastLogin || "");
      else if (sortField === "joinDate") cmp = a.joinDate.localeCompare(b.joinDate);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [users, searchQuery, filterRole, filterStatus, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // ── Handlers ───

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginated.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(paginated.map((u) => u.id)));
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  // ── Create User ───
  const openCreate = () => {
    setFormName(""); setFormEmail(""); setFormRole("operator"); setFormDept(DEPARTMENTS[0]);
    setFormPhone(""); setFormPassword(""); setFormConfirmPassword(""); setFormShowPassword(false);
    setFormForceChange(false);
    setModal("create");
  };

  const submitCreate = () => {
    if (!formName.trim() || !formEmail.trim()) { showToast("Name and email are required", "error"); return; }
    if (users.some((u) => u.email.toLowerCase() === formEmail.toLowerCase())) { showToast("Email already exists", "error"); return; }
    const pwErrors = passwordErrors(formPassword);
    if (pwErrors.length) { showToast("Password does not meet requirements", "error"); return; }
    if (formPassword !== formConfirmPassword) { showToast("Passwords do not match", "error"); return; }

    const newUser: User = {
      id: generateId(users),
      name: formName.trim(),
      email: formEmail.trim().toLowerCase(),
      role: formRole,
      department: formDept,
      status: "active",
      joinDate: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
      loginCount: 0,
      forcePasswordChange: formForceChange,
      phone: formPhone || undefined,
    };
    setUsers((prev) => [...prev, newUser]);
    setModal(null);
    showToast(`User ${newUser.name} created successfully`);
  };

  // ── Edit User ───
  const openEdit = (u: User) => {
    setFormName(u.name); setFormEmail(u.email); setFormRole(u.role); setFormDept(u.department);
    setFormPhone(u.phone || "");
    setSelectedUser(u);
    setModal("edit");
  };

  const submitEdit = () => {
    if (!selectedUser) return;
    if (!formName.trim() || !formEmail.trim()) { showToast("Name and email are required", "error"); return; }
    const dup = users.find((u) => u.email.toLowerCase() === formEmail.toLowerCase() && u.id !== selectedUser.id);
    if (dup) { showToast("Email already exists", "error"); return; }

    // Prevent self-demotion
    if (selectedUser.email === currentUser?.email && formRole !== "admin") {
      showToast("Cannot change your own admin role", "error");
      return;
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? { ...u, name: formName.trim(), email: formEmail.trim().toLowerCase(), role: formRole, department: formDept, phone: formPhone || undefined, lastModified: new Date().toISOString().split("T")[0] }
          : u
      )
    );
    // Update selected if viewing
    if (selectedUser) {
      setSelectedUser((prev) => prev ? { ...prev, name: formName.trim(), email: formEmail.trim().toLowerCase(), role: formRole, department: formDept, phone: formPhone || undefined, lastModified: new Date().toISOString().split("T")[0] } : null);
    }
    setModal(null);
    showToast(`User ${formName.trim()} updated successfully`);
  };

  // ── Status Change ───
  const openStatusChange = (u: User, action: "active" | "inactive" | "suspended") => {
    // Prevent self-deactivation
    if (u.email === currentUser?.email) { showToast("Cannot change your own account status", "error"); return; }
    setStatusChangeTarget(u);
    setStatusChangeAction(action);
    setStatusChangeReason("");
    setModal("statusChange");
  };

  const submitStatusChange = () => {
    if (!statusChangeTarget) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === statusChangeTarget.id
          ? { ...u, status: statusChangeAction, lastModified: new Date().toISOString().split("T")[0] }
          : u
      )
    );
    if (selectedUser?.id === statusChangeTarget.id) {
      setSelectedUser((prev) => prev ? { ...prev, status: statusChangeAction, lastModified: new Date().toISOString().split("T")[0] } : null);
    }
    setModal(null);
    showToast(`User ${statusChangeTarget.name} ${statusChangeAction === "active" ? "activated" : statusChangeAction === "suspended" ? "suspended" : "deactivated"}`);
  };

  // ── Delete ───
  const openDelete = (u: User) => {
    if (u.email === currentUser?.email) { showToast("Cannot delete your own account", "error"); return; }
    setStatusChangeTarget(u);
    setModal("delete");
  };

  const submitDelete = () => {
    if (!statusChangeTarget) return;
    setUsers((prev) => prev.filter((u) => u.id !== statusChangeTarget.id));
    if (selectedUser?.id === statusChangeTarget.id) setSelectedUser(null);
    selectedIds.delete(statusChangeTarget.id);
    setSelectedIds(new Set(selectedIds));
    setModal(null);
    showToast(`User ${statusChangeTarget.name} deleted`);
  };

  // ── Password Reset ───
  const openResetPassword = (u: User) => {
    setStatusChangeTarget(u);
    setFormPassword(""); setFormConfirmPassword(""); setFormShowPassword(false); setFormForceChange(true);
    setModal("resetPassword");
  };

  const submitResetPassword = () => {
    if (!statusChangeTarget) return;
    const pwErrors = passwordErrors(formPassword);
    if (pwErrors.length) { showToast("Password does not meet requirements", "error"); return; }
    if (formPassword !== formConfirmPassword) { showToast("Passwords do not match", "error"); return; }
    setUsers((prev) =>
      prev.map((u) =>
        u.id === statusChangeTarget.id
          ? { ...u, forcePasswordChange: formForceChange, lastModified: new Date().toISOString().split("T")[0] }
          : u
      )
    );
    setModal(null);
    showToast(`Password reset for ${statusChangeTarget.name}`);
  };

  // ── Bulk Ops ───
  const openBulk = () => {
    if (selectedIds.size === 0) { showToast("No users selected", "error"); return; }
    // Prevent bulk on self
    const selfSelected = [...selectedIds].some((id) => users.find((u) => u.id === id)?.email === currentUser?.email);
    if (selfSelected) { showToast("Cannot perform bulk action on your own account", "error"); return; }
    setBulkAction("activate");
    setBulkRole("operator");
    setModal("bulkAction");
  };

  const submitBulk = () => {
    setUsers((prev) =>
      prev.map((u) => {
        if (!selectedIds.has(u.id)) return u;
        if (bulkAction === "activate") return { ...u, status: "active" as const, lastModified: new Date().toISOString().split("T")[0] };
        if (bulkAction === "deactivate") return { ...u, status: "inactive" as const, lastModified: new Date().toISOString().split("T")[0] };
        if (bulkAction === "changeRole") return { ...u, role: bulkRole, lastModified: new Date().toISOString().split("T")[0] };
        return u;
      })
    );
    setModal(null);
    setSelectedIds(new Set());
    showToast(`Bulk action applied to ${selectedIds.size} user(s)`);
  };

  // ── CSV Export ───
  const exportCSV = () => {
    const header = "ID,Name,Email,Role,Department,Status,Join Date,Last Login,Login Count,Force Password Change\n";
    const rows = filtered.map((u) =>
      `"${u.id}","${u.name}","${u.email}","${u.role}","${u.department}","${u.status}","${u.joinDate}","${u.lastLogin || ""}","${u.loginCount}","${u.forcePasswordChange}"`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `pms-users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${filtered.length} user(s) to CSV`);
  };

  // ── Access Check ───
  if (currentUser?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-critical mb-2">Access Denied</h1>
          <p className="text-text-secondary">Only administrators can access User Management.</p>
          <a href="/" className="mt-4 btn-primary inline-block">Return to Dashboard</a>
        </div>
      </div>
    );
  }

  // ── Stat calculations ───
  const activeCount = users.filter((u) => u.status === "active").length;
  const suspendedCount = users.filter((u) => u.status === "suspended").length;
  const forceChangeCount = users.filter((u) => u.forcePasswordChange).length;

  const statusBadge = (s: string) => {
    if (s === "active") return "bg-success bg-opacity-10 text-success";
    if (s === "suspended") return "bg-warning bg-opacity-10 text-warning";
    return "bg-border text-text-secondary";
  };

  const roleBadge = (r: string) => {
    if (r === "admin") return "bg-primary bg-opacity-15 text-primary";
    if (r === "supervisor") return "bg-blue-500 bg-opacity-15 text-blue-400";
    if (r === "qa_manager") return "bg-emerald-500 bg-opacity-15 text-emerald-400";
    return "bg-border text-text-secondary";
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-background">
      {/* ── Toast Notification ── */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-lg shadow-lg border flex items-center gap-3 animate-in slide-in-from-right ${
          toast.type === "success" ? "bg-card border-success text-success" : "bg-card border-critical text-critical"
        }`}>
          {toast.type === "success" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* ── Header ── */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="p-2 hover:bg-secondary hover:bg-opacity-50 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 className="text-2xl font-bold text-foreground">User Management</h1>
              <p className="text-sm text-text-secondary">Enterprise identity & access control — ISO 27001 compliant</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-secondary hover:bg-opacity-50 transition-colors">
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button onClick={openCreate} className="btn-primary gap-2">
              <Plus className="w-4 h-4" /> Add User
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-ninja">
            <div className="flex items-start justify-between">
              <div>
                <p className="data-label mb-1">Total Users</p>
                <p className="text-3xl font-bold text-foreground">{users.length}</p>
              </div>
              <Users className="w-5 h-5 text-text-secondary" />
            </div>
          </div>
          <div className="card-ninja">
            <div className="flex items-start justify-between">
              <div>
                <p className="data-label mb-1">Active</p>
                <p className="text-3xl font-bold text-success">{activeCount}</p>
              </div>
              <UserCheck className="w-5 h-5 text-success" />
            </div>
          </div>
          <div className="card-ninja">
            <div className="flex items-start justify-between">
              <div>
                <p className="data-label mb-1">Suspended</p>
                <p className="text-3xl font-bold text-warning">{suspendedCount}</p>
              </div>
              <UserX className="w-5 h-5 text-warning" />
            </div>
          </div>
          <div className="card-ninja">
            <div className="flex items-start justify-between">
              <div>
                <p className="data-label mb-1">Pending Password Reset</p>
                <p className="text-3xl font-bold text-primary">{forceChangeCount}</p>
              </div>
              <Key className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>

        {/* ── Search, Filter & Bulk Bar ── */}
        <div className="card-ninja">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center flex-1">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                  placeholder="Search by name, email, ID, department..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-secondary bg-opacity-50 border border-border text-sm text-foreground placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              {/* Role filter */}
              <select
                value={filterRole}
                onChange={(e) => { setFilterRole(e.target.value as UserRole | "all"); setPage(1); }}
                className="px-3 py-2 rounded-lg bg-secondary bg-opacity-50 border border-border text-sm text-foreground"
              >
                <option value="all">All Roles</option>
                {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
              {/* Status filter */}
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value as typeof filterStatus); setPage(1); }}
                className="px-3 py-2 rounded-lg bg-secondary bg-opacity-50 border border-border text-sm text-foreground"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            {/* Bulk actions */}
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-primary font-medium">{selectedIds.size} selected</span>
                <button onClick={openBulk} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary bg-opacity-10 text-primary text-sm font-medium hover:bg-opacity-20 transition-colors">
                  <Shield className="w-4 h-4" /> Bulk Actions
                </button>
                <button onClick={() => setSelectedIds(new Set())} className="text-xs text-text-secondary hover:text-foreground transition-colors">Clear</button>
              </div>
            )}
          </div>
        </div>

        {/* ── Main Content: Table + Detail Panel ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ── Users Table ── */}
          <div className="xl:col-span-2 card-ninja overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-3 w-10">
                      <button onClick={toggleSelectAll} className="text-text-secondary hover:text-foreground">
                        {selectedIds.size === paginated.length && paginated.length > 0
                          ? <CheckSquare className="w-4 h-4 text-primary" />
                          : <Square className="w-4 h-4" />}
                      </button>
                    </th>
                    {([
                      { field: "name" as SortField, label: "User" },
                      { field: "role" as SortField, label: "Role" },
                      { field: "status" as SortField, label: "Status" },
                      { field: "lastLogin" as SortField, label: "Last Login" },
                    ]).map(({ field, label }) => (
                      <th key={field} className="text-left py-3 px-3">
                        <button onClick={() => toggleSort(field)} className="flex items-center gap-1 data-label hover:text-foreground transition-colors">
                          {label}
                          <ArrowUpDown className={`w-3 h-3 ${sortField === field ? "text-primary" : ""}`} />
                        </button>
                      </th>
                    ))}
                    <th className="text-right py-3 px-3 data-label">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={6} className="py-12 text-center text-text-secondary">No users match your filters</td></tr>
                  ) : paginated.map((u) => (
                    <tr
                      key={u.id}
                      onClick={() => setSelectedUser(u)}
                      className={`border-b border-border cursor-pointer transition-colors ${
                        selectedUser?.id === u.id ? "bg-primary bg-opacity-5" : "hover:bg-secondary hover:bg-opacity-30"
                      }`}
                    >
                      <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => toggleSelect(u.id)} className="text-text-secondary hover:text-foreground">
                          {selectedIds.has(u.id)
                            ? <CheckSquare className="w-4 h-4 text-primary" />
                            : <Square className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <div>
                          <p className="font-medium text-foreground">{u.name}</p>
                          <p className="text-xs text-text-secondary font-mono">{u.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded capitalize ${roleBadge(u.role)}`}>
                          {u.role.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded capitalize ${statusBadge(u.status)}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-xs text-text-secondary font-mono">
                        {u.lastLogin || "Never"}
                      </td>
                      <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(u)} title="Edit" className="p-1.5 rounded hover:bg-secondary hover:bg-opacity-50 text-text-secondary hover:text-foreground transition-colors">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => openResetPassword(u)} title="Reset Password" className="p-1.5 rounded hover:bg-secondary hover:bg-opacity-50 text-text-secondary hover:text-foreground transition-colors">
                            <Key className="w-3.5 h-3.5" />
                          </button>
                          {u.status === "active" ? (
                            <button onClick={() => openStatusChange(u, "suspended")} title="Suspend" className="p-1.5 rounded hover:bg-warning hover:bg-opacity-10 text-text-secondary hover:text-warning transition-colors">
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button onClick={() => openStatusChange(u, "active")} title="Activate" className="p-1.5 rounded hover:bg-success hover:bg-opacity-10 text-text-secondary hover:text-success transition-colors">
                              <Unlock className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button onClick={() => openDelete(u)} title="Delete" className="p-1.5 rounded hover:bg-critical hover:bg-opacity-10 text-text-secondary hover:text-critical transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-border pt-4 mt-2 px-3 pb-1">
              <div className="flex items-center gap-3 text-xs text-text-secondary">
                <span>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}</span>
                <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="px-2 py-1 rounded bg-secondary bg-opacity-50 border border-border text-foreground">
                  {PAGE_SIZES.map((s) => <option key={s} value={s}>{s} per page</option>)}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded hover:bg-secondary hover:bg-opacity-50 disabled:opacity-30 text-text-secondary">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded text-xs font-medium ${p === page ? "bg-primary text-white" : "text-text-secondary hover:text-foreground"}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded hover:bg-secondary hover:bg-opacity-50 disabled:opacity-30 text-text-secondary">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ── Detail Panel ── */}
          <div className="xl:col-span-1 space-y-4">
            {selectedUser ? (
              <>
                {/* Profile Card */}
                <div className="card-ninja">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary bg-opacity-20 flex items-center justify-center text-lg font-bold text-primary">
                        {selectedUser.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-foreground">{selectedUser.name}</h2>
                        <p className="text-xs text-text-secondary font-mono">{selectedUser.id}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded capitalize ${statusBadge(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-1 border-b border-border mb-4">
                    {(["details", "permissions", "security"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-2 text-xs font-medium capitalize transition-colors border-b-2 ${
                          activeTab === tab ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-foreground"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* ─ Details Tab ─ */}
                  {activeTab === "details" && (
                    <div className="space-y-4 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div><p className="data-label mb-1">Email</p><p className="text-foreground font-mono text-xs">{selectedUser.email}</p></div>
                        <div><p className="data-label mb-1">Phone</p><p className="text-foreground text-xs">{selectedUser.phone || "—"}</p></div>
                        <div><p className="data-label mb-1">Department</p><p className="text-foreground">{selectedUser.department}</p></div>
                        <div>
                          <p className="data-label mb-1">Role</p>
                          <span className={`text-xs font-medium px-2 py-1 rounded capitalize ${roleBadge(selectedUser.role)}`}>
                            {selectedUser.role.replace(/_/g, " ")}
                          </span>
                        </div>
                        <div><p className="data-label mb-1">Join Date</p><p className="text-foreground font-mono text-xs">{selectedUser.joinDate}</p></div>
                        <div><p className="data-label mb-1">Last Login</p><p className="text-foreground font-mono text-xs">{selectedUser.lastLogin || "Never"}</p></div>
                        <div><p className="data-label mb-1">Login Count</p><p className="text-foreground font-mono text-xs">{selectedUser.loginCount}</p></div>
                        <div><p className="data-label mb-1">Last Modified</p><p className="text-foreground font-mono text-xs">{selectedUser.lastModified || "—"}</p></div>
                      </div>
                      {selectedUser.forcePasswordChange && (
                        <div className="flex items-center gap-2 bg-warning bg-opacity-10 border border-warning border-opacity-30 rounded-lg p-3 text-warning text-xs">
                          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                          Password change required on next login
                        </div>
                      )}
                    </div>
                  )}

                  {/* ─ Permissions Tab ─ */}
                  {activeTab === "permissions" && (
                    <div className="space-y-3">
                      <div className="bg-primary bg-opacity-10 rounded-lg p-3 border-l-4 border-l-primary">
                        <p className="text-xs font-bold text-primary capitalize mb-1">{selectedUser.role.replace(/_/g, " ")}</p>
                        <p className="text-xs text-foreground">{ROLES.find(r => r.value === selectedUser.role)?.description}</p>
                      </div>
                      <p className="data-label">Module Access</p>
                      <div className="space-y-1">
                        {PERMISSION_MATRIX.map((pm) => {
                          const hasAccess = pm[selectedUser.role as keyof typeof pm] as boolean;
                          return (
                            <div key={pm.module} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-secondary hover:bg-opacity-20">
                              <span className="text-xs text-foreground">{pm.module}</span>
                              {hasAccess
                                ? <Check className="w-3.5 h-3.5 text-success" />
                                : <X className="w-3.5 h-3.5 text-text-secondary opacity-30" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ─ Security Tab ─ */}
                  {activeTab === "security" && (
                    <div className="space-y-4 text-sm">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-border">
                          <span className="text-xs text-text-secondary">Account Status</span>
                          <span className={`text-xs font-medium px-2 py-1 rounded capitalize ${statusBadge(selectedUser.status)}`}>{selectedUser.status}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-border">
                          <span className="text-xs text-text-secondary">Password Change Required</span>
                          <span className={`text-xs font-medium ${selectedUser.forcePasswordChange ? "text-warning" : "text-success"}`}>
                            {selectedUser.forcePasswordChange ? "Yes" : "No"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-border">
                          <span className="text-xs text-text-secondary">Total Logins</span>
                          <span className="text-xs text-foreground font-mono">{selectedUser.loginCount}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-border">
                          <span className="text-xs text-text-secondary">Last Modified</span>
                          <span className="text-xs text-foreground font-mono">{selectedUser.lastModified || "—"}</span>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="space-y-2 pt-2">
                        <p className="data-label">Quick Actions</p>
                        <button onClick={() => openResetPassword(selectedUser)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-xs text-foreground hover:bg-secondary hover:bg-opacity-50 transition-colors">
                          <RotateCcw className="w-3.5 h-3.5" /> Reset Password
                        </button>
                        {selectedUser.status === "active" ? (
                          <button onClick={() => openStatusChange(selectedUser, "suspended")} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-warning border-opacity-30 text-xs text-warning hover:bg-warning hover:bg-opacity-10 transition-colors">
                            <Lock className="w-3.5 h-3.5" /> Suspend Account
                          </button>
                        ) : (
                          <button onClick={() => openStatusChange(selectedUser, "active")} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-success border-opacity-30 text-xs text-success hover:bg-success hover:bg-opacity-10 transition-colors">
                            <Unlock className="w-3.5 h-3.5" /> Activate Account
                          </button>
                        )}
                        <button onClick={() => openDelete(selectedUser)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-critical border-opacity-30 text-xs text-critical hover:bg-critical hover:bg-opacity-10 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" /> Delete Account
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="card-ninja flex flex-col items-center justify-center py-16 text-center">
                <Users className="w-10 h-10 text-text-secondary mb-3 opacity-40" />
                <p className="text-sm text-text-secondary">Select a user from the table to view details</p>
              </div>
            )}

            {/* ── RBAC Permission Matrix ── */}
            <div className="card-ninja">
              <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Permission Matrix
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 data-label">Module</th>
                      <th className="text-center py-2 px-1 data-label">ADM</th>
                      <th className="text-center py-2 px-1 data-label">SUP</th>
                      <th className="text-center py-2 px-1 data-label">QA</th>
                      <th className="text-center py-2 px-1 data-label">OPR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PERMISSION_MATRIX.map((pm) => (
                      <tr key={pm.module} className="border-b border-border">
                        <td className="py-1.5 px-2 text-foreground">{pm.module}</td>
                        <td className="text-center py-1.5 px-1">{pm.admin ? <Check className="w-3 h-3 text-success mx-auto" /> : <X className="w-3 h-3 text-text-secondary opacity-20 mx-auto" />}</td>
                        <td className="text-center py-1.5 px-1">{pm.supervisor ? <Check className="w-3 h-3 text-success mx-auto" /> : <X className="w-3 h-3 text-text-secondary opacity-20 mx-auto" />}</td>
                        <td className="text-center py-1.5 px-1">{pm.qa_manager ? <Check className="w-3 h-3 text-success mx-auto" /> : <X className="w-3 h-3 text-text-secondary opacity-20 mx-auto" />}</td>
                        <td className="text-center py-1.5 px-1">{pm.operator ? <Check className="w-3 h-3 text-success mx-auto" /> : <X className="w-3 h-3 text-text-secondary opacity-20 mx-auto" />}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Password Policy ── */}
            <div className="card-ninja bg-secondary bg-opacity-20">
              <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Password Policy (NIST SP 800-63B)
              </h3>
              <div className="space-y-2 text-xs text-foreground">
                <p>✓ Minimum 8 characters</p>
                <p>✓ Uppercase and lowercase letters</p>
                <p>✓ At least one number</p>
                <p>✓ At least one special character</p>
                <p>✓ Admin-initiated reset available</p>
                <p>✓ Force change on next login option</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════════════
          MODALS
         ═══════════════════════════════════════════════════════════════════════════ */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[80] flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

            {/* ── Create / Edit Modal ── */}
            {(modal === "create" || modal === "edit") && (
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">{modal === "create" ? "Create New User" : "Edit User"}</h2>
                  <button onClick={() => setModal(null)} className="p-1 hover:bg-secondary rounded"><X className="w-5 h-5 text-text-secondary" /></button>
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Full Name *</label>
                    <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-secondary bg-opacity-50 border border-border text-sm text-foreground placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Enter full name" />
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Email Address *</label>
                    <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-secondary bg-opacity-50 border border-border text-sm text-foreground placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="user@pms.com" />
                  </div>
                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Phone Number</label>
                    <input type="tel" value={formPhone} onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-secondary bg-opacity-50 border border-border text-sm text-foreground placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="+971 50 XXX XXXX" />
                  </div>
                  {/* Role & Dept */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">Role *</label>
                      <select value={formRole} onChange={(e) => setFormRole(e.target.value as UserRole)}
                        className="w-full px-3 py-2 rounded-lg bg-secondary bg-opacity-50 border border-border text-sm text-foreground">
                        {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">Department *</label>
                      <select value={formDept} onChange={(e) => setFormDept(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-secondary bg-opacity-50 border border-border text-sm text-foreground">
                        {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Password — only for create */}
                  {modal === "create" && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">Password *</label>
                        <div className="relative">
                          <input type={formShowPassword ? "text" : "password"} value={formPassword} onChange={(e) => setFormPassword(e.target.value)}
                            className="w-full px-3 py-2 pr-10 rounded-lg bg-secondary bg-opacity-50 border border-border text-sm text-foreground placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            placeholder="Min 8 characters" />
                          <button type="button" onClick={() => setFormShowPassword(!formShowPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-foreground">
                            {formShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {/* Strength meter */}
                        {formPassword && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all ${
                                  passwordStrength(formPassword).score <= 2 ? "bg-critical" : passwordStrength(formPassword).score <= 4 ? "bg-warning" : "bg-success"
                                }`} style={{ width: `${(passwordStrength(formPassword).score / 6) * 100}%` }} />
                              </div>
                              <span className={`text-xs font-medium ${passwordStrength(formPassword).color}`}>{passwordStrength(formPassword).label}</span>
                            </div>
                            {passwordErrors(formPassword).length > 0 && (
                              <ul className="space-y-0.5">
                                {passwordErrors(formPassword).map((err) => (
                                  <li key={err} className="text-xs text-critical flex items-center gap-1"><X className="w-3 h-3" />{err}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">Confirm Password *</label>
                        <input type={formShowPassword ? "text" : "password"} value={formConfirmPassword} onChange={(e) => setFormConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-secondary bg-opacity-50 border border-border text-sm text-foreground placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          placeholder="Re-enter password" />
                        {formConfirmPassword && formPassword !== formConfirmPassword && (
                          <p className="text-xs text-critical mt-1 flex items-center gap-1"><X className="w-3 h-3" />Passwords do not match</p>
                        )}
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formForceChange} onChange={(e) => setFormForceChange(e.target.checked)}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                        <span className="text-xs text-foreground">Require password change on first login</span>
                      </label>
                    </>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setModal(null)} className="flex-1 px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-secondary hover:bg-opacity-50 transition-colors">
                    Cancel
                  </button>
                  <button onClick={modal === "create" ? submitCreate : submitEdit} className="flex-1 btn-primary py-2">
                    {modal === "create" ? "Create User" : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* ── Reset Password Modal ── */}
            {modal === "resetPassword" && statusChangeTarget && (
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">Reset Password</h2>
                  <button onClick={() => setModal(null)} className="p-1 hover:bg-secondary rounded"><X className="w-5 h-5 text-text-secondary" /></button>
                </div>
                <p className="text-sm text-text-secondary">Setting a new password for <span className="text-foreground font-medium">{statusChangeTarget.name}</span></p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">New Password *</label>
                    <div className="relative">
                      <input type={formShowPassword ? "text" : "password"} value={formPassword} onChange={(e) => setFormPassword(e.target.value)}
                        className="w-full px-3 py-2 pr-10 rounded-lg bg-secondary bg-opacity-50 border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="Enter new password" />
                      <button type="button" onClick={() => setFormShowPassword(!formShowPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-foreground">
                        {formShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formPassword && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${
                              passwordStrength(formPassword).score <= 2 ? "bg-critical" : passwordStrength(formPassword).score <= 4 ? "bg-warning" : "bg-success"
                            }`} style={{ width: `${(passwordStrength(formPassword).score / 6) * 100}%` }} />
                          </div>
                          <span className={`text-xs font-medium ${passwordStrength(formPassword).color}`}>{passwordStrength(formPassword).label}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Confirm Password *</label>
                    <input type={formShowPassword ? "text" : "password"} value={formConfirmPassword} onChange={(e) => setFormConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-secondary bg-opacity-50 border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Re-enter password" />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formForceChange} onChange={(e) => setFormForceChange(e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                    <span className="text-xs text-foreground">Require password change on next login</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setModal(null)} className="flex-1 px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-secondary hover:bg-opacity-50 transition-colors">Cancel</button>
                  <button onClick={submitResetPassword} className="flex-1 btn-primary py-2">Reset Password</button>
                </div>
              </div>
            )}

            {/* ── Status Change Modal ── */}
            {modal === "statusChange" && statusChangeTarget && (
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">Change Account Status</h2>
                  <button onClick={() => setModal(null)} className="p-1 hover:bg-secondary rounded"><X className="w-5 h-5 text-text-secondary" /></button>
                </div>
                <div className={`flex items-start gap-3 p-4 rounded-lg border ${
                  statusChangeAction === "suspended" ? "bg-warning bg-opacity-10 border-warning border-opacity-30" : statusChangeAction === "active" ? "bg-success bg-opacity-10 border-success border-opacity-30" : "bg-border border-border"
                }`}>
                  <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${statusChangeAction === "suspended" ? "text-warning" : statusChangeAction === "active" ? "text-success" : "text-text-secondary"}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {statusChangeAction === "active" ? "Activate" : statusChangeAction === "suspended" ? "Suspend" : "Deactivate"} user <span className="font-bold">{statusChangeTarget.name}</span>?
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      {statusChangeAction === "suspended" ? "User will be locked out and unable to access the system." : statusChangeAction === "active" ? "User will regain access to the system." : "User account will be disabled."}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Reason (for audit trail)</label>
                  <textarea value={statusChangeReason} onChange={(e) => setStatusChangeReason(e.target.value)} rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-secondary bg-opacity-50 border border-border text-sm text-foreground placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                    placeholder="Provide a reason for this action..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setModal(null)} className="flex-1 px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-secondary hover:bg-opacity-50 transition-colors">Cancel</button>
                  <button onClick={submitStatusChange} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusChangeAction === "suspended" ? "bg-warning text-white hover:bg-opacity-90" : statusChangeAction === "active" ? "bg-success text-white hover:bg-opacity-90" : "bg-border text-foreground hover:bg-opacity-80"
                  }`}>
                    Confirm {statusChangeAction === "active" ? "Activation" : statusChangeAction === "suspended" ? "Suspension" : "Deactivation"}
                  </button>
                </div>
              </div>
            )}

            {/* ── Delete Confirmation Modal ── */}
            {modal === "delete" && statusChangeTarget && (
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-critical">Delete User</h2>
                  <button onClick={() => setModal(null)} className="p-1 hover:bg-secondary rounded"><X className="w-5 h-5 text-text-secondary" /></button>
                </div>
                <div className="bg-critical bg-opacity-10 border border-critical border-opacity-30 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-critical flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">This action is permanent and cannot be undone.</p>
                    <p className="text-xs text-text-secondary mt-1">User <span className="font-bold text-foreground">{statusChangeTarget.name}</span> ({statusChangeTarget.email}) will be permanently removed from the system.</p>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setModal(null)} className="flex-1 px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-secondary hover:bg-opacity-50 transition-colors">Cancel</button>
                  <button onClick={submitDelete} className="flex-1 py-2 rounded-lg bg-critical text-white text-sm font-medium hover:bg-opacity-90 transition-colors">
                    Delete User
                  </button>
                </div>
              </div>
            )}

            {/* ── Bulk Action Modal ── */}
            {modal === "bulkAction" && (
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">Bulk Action — {selectedIds.size} User(s)</h2>
                  <button onClick={() => setModal(null)} className="p-1 hover:bg-secondary rounded"><X className="w-5 h-5 text-text-secondary" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Action</label>
                    <select value={bulkAction} onChange={(e) => setBulkAction(e.target.value as typeof bulkAction)}
                      className="w-full px-3 py-2 rounded-lg bg-secondary bg-opacity-50 border border-border text-sm text-foreground">
                      <option value="activate">Activate Users</option>
                      <option value="deactivate">Deactivate Users</option>
                      <option value="changeRole">Change Role</option>
                    </select>
                  </div>
                  {bulkAction === "changeRole" && (
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">New Role</label>
                      <select value={bulkRole} onChange={(e) => setBulkRole(e.target.value as UserRole)}
                        className="w-full px-3 py-2 rounded-lg bg-secondary bg-opacity-50 border border-border text-sm text-foreground">
                        {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setModal(null)} className="flex-1 px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-secondary hover:bg-opacity-50 transition-colors">Cancel</button>
                  <button onClick={submitBulk} className="flex-1 btn-primary py-2">Apply to {selectedIds.size} User(s)</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
