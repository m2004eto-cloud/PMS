import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  details: string;
  status: "success" | "failed" | "warning";
  ipAddress: string;
}

const auditLogs: AuditEntry[] = [
  {
    id: "AUD-001",
    timestamp: "2024-01-14 14:32:18",
    user: "admin@pms.com",
    action: "Dashboard Access",
    module: "System",
    details: "User logged in",
    status: "success",
    ipAddress: "192.168.1.100",
  },
  {
    id: "AUD-002",
    timestamp: "2024-01-14 14:15:42",
    user: "supervisor@pms.com",
    action: "Batch Update",
    module: "Production",
    details: "BATCH-2024-0847 status changed to In Progress",
    status: "success",
    ipAddress: "192.168.1.101",
  },
  {
    id: "AUD-003",
    timestamp: "2024-01-14 13:48:20",
    user: "qa@pms.com",
    action: "Lab Test Create",
    module: "Quality",
    details: "Created TEST-2024-0403 for BATCH-2024-0839",
    status: "success",
    ipAddress: "192.168.1.102",
  },
  {
    id: "AUD-004",
    timestamp: "2024-01-14 13:22:15",
    user: "sales@pms.com",
    action: "Order Create",
    module: "Sales",
    details: "Created ORD-2024-0821 for Premium Distributors LLC",
    status: "success",
    ipAddress: "192.168.1.103",
  },
  {
    id: "AUD-005",
    timestamp: "2024-01-14 12:45:33",
    user: "admin@pms.com",
    action: "User Role Changed",
    module: "Admin",
    details: "Changed USR-005 role from operator to supervisor",
    status: "success",
    ipAddress: "192.168.1.100",
  },
  {
    id: "AUD-006",
    timestamp: "2024-01-14 12:10:22",
    user: "unknown@pms.com",
    action: "Failed Login",
    module: "System",
    details: "Invalid credentials",
    status: "failed",
    ipAddress: "192.168.1.200",
  },
  {
    id: "AUD-007",
    timestamp: "2024-01-14 11:35:44",
    user: "supervisor@pms.com",
    action: "Equipment Configuration",
    module: "Shop Floor",
    details: "Updated Roasting Drum #1 temperature parameters",
    status: "success",
    ipAddress: "192.168.1.101",
  },
  {
    id: "AUD-008",
    timestamp: "2024-01-14 10:52:18",
    user: "admin@pms.com",
    action: "System Backup",
    module: "System",
    details: "Daily backup completed successfully",
    status: "success",
    ipAddress: "192.168.1.100",
  },
];

export default function AuditLogs() {
  const { user } = useAuth();
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "success" | "failed" | "warning">("all");

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-critical mb-2">Access Denied</h1>
          <p className="text-text-secondary">Only administrators can access this page.</p>
          <a href="/" className="mt-4 btn-primary inline-block">
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  const filteredLogs = auditLogs.filter((log) => {
    if (filterAction !== "all" && log.action !== filterAction) return false;
    if (filterStatus !== "all" && log.status !== filterStatus) return false;
    return true;
  });

  const actions = Array.from(new Set(auditLogs.map((l) => l.action)));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <a
            href="/"
            className="p-2 hover:bg-secondary hover:bg-opacity-50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
            <p className="text-sm text-text-secondary">
              System activity and security events tracking
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-ninja">
            <p className="data-label mb-2">Total Events</p>
            <p className="text-3xl font-bold text-foreground">
              {auditLogs.length}
            </p>
          </div>

          <div className="card-ninja">
            <p className="data-label mb-2">Successful</p>
            <p className="text-3xl font-bold text-success">
              {auditLogs.filter((l) => l.status === "success").length}
            </p>
          </div>

          <div className="card-ninja">
            <p className="data-label mb-2">Failed</p>
            <p className="text-3xl font-bold text-critical">
              {auditLogs.filter((l) => l.status === "failed").length}
            </p>
          </div>

          <div className="card-ninja">
            <p className="data-label mb-2">Today's Activity</p>
            <p className="text-3xl font-bold text-primary">
              {auditLogs.filter((l) => l.timestamp.includes("2024-01-14")).length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="card-ninja space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">
            Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Action
              </label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary bg-opacity-50 border border-border text-foreground"
              >
                <option value="all">All Actions</option>
                {actions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as "all" | "success" | "failed" | "warning")
                }
                className="w-full px-3 py-2 rounded-lg bg-secondary bg-opacity-50 border border-border text-foreground"
              >
                <option value="all">All</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="warning">Warning</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="card-ninja overflow-x-auto">
          <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
            Activity Log
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 data-label">Timestamp</th>
                <th className="text-left py-3 px-4 data-label">User</th>
                <th className="text-left py-3 px-4 data-label">Action</th>
                <th className="text-left py-3 px-4 data-label">Module</th>
                <th className="text-left py-3 px-4 data-label">Details</th>
                <th className="text-left py-3 px-4 data-label">IP Address</th>
                <th className="text-left py-3 px-4 data-label">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-border hover:bg-secondary hover:bg-opacity-30 transition-colors"
                >
                  <td className="py-3 px-4 font-mono text-foreground text-xs">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 text-foreground text-sm">
                    {log.user}
                  </td>
                  <td className="py-3 px-4 text-foreground font-medium">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-text-secondary text-sm">
                    {log.module}
                  </td>
                  <td className="py-3 px-4 text-foreground text-sm">
                    {log.details}
                  </td>
                  <td className="py-3 px-4 font-mono text-text-secondary text-xs">
                    {log.ipAddress}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded capitalize ${
                        log.status === "success"
                          ? "bg-success bg-opacity-10 text-success"
                          : log.status === "failed"
                            ? "bg-critical bg-opacity-10 text-critical"
                            : "bg-warning bg-opacity-10 text-warning"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Security Info */}
        <div className="card-ninja bg-secondary bg-opacity-20">
          <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">
            Security & Compliance
          </h3>
          <div className="space-y-2 text-sm text-foreground">
            <p>✓ All system activities logged for HACCP compliance</p>
            <p>✓ Failed login attempts tracked and alerted</p>
            <p>✓ User actions auditable by role and timestamp</p>
            <p>✓ Data changes attributed to individual users</p>
            <p>✓ IP address logging for security tracking</p>
          </div>
        </div>
      </main>
    </div>
  );
}
