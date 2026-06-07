import { useState, useEffect } from "react";
import { AlertCircle, TrendingUp, Activity, Zap, Package, LogOut, Settings, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface SensorData {
  roastingTemp: number;
  colloidMillTemp: number;
  roastingStatus: "idle" | "active" | "warning" | "critical";
  colloidMillStatus: "idle" | "active" | "warning" | "critical";
  activeBatches: number;
  readyInventory: number;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [sensorData, setSensorData] = useState<SensorData>({
    roastingTemp: 132,
    colloidMillTemp: 52,
    roastingStatus: "active",
    colloidMillStatus: "active",
    activeBatches: 8,
    readyInventory: 2400,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData((prev) => ({
        ...prev,
        roastingTemp: Math.max(
          100,
          Math.min(160, prev.roastingTemp + (Math.random() - 0.5) * 4)
        ),
        colloidMillTemp: Math.max(
          30,
          Math.min(70, prev.colloidMillTemp + (Math.random() - 0.5) * 2)
        ),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const isRoastingCritical = sensorData.roastingTemp < 100;
  const isColloidMillCritical = sensorData.colloidMillTemp > 68;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              PMS
            </h1>
            <p className="text-sm text-text-secondary">
              Production Management System
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-sm">
              <p className="text-foreground font-medium">
                {new Date().toLocaleDateString()}
              </p>
              <p className="text-text-secondary">{new Date().toLocaleTimeString()}</p>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-secondary hover:bg-opacity-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary bg-opacity-20 flex items-center justify-center text-xs font-bold text-primary">
                  {user?.email.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-foreground">
                    {user?.email.split("@")[0]}
                  </p>
                  <p className="text-xs text-text-secondary capitalize">
                    {user?.role.replace(/_/g, " ")}
                  </p>
                </div>
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-foreground">
                      {user?.email}
                    </p>
                    <p className="text-xs text-text-secondary mt-1 capitalize">
                      {user?.role.replace(/_/g, " ")}
                    </p>
                  </div>

                  {user?.role === "admin" && (
                    <>
                      <a
                        href="/admin/users"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-secondary hover:bg-opacity-50 transition-colors"
                      >
                        <Users className="w-4 h-4" />
                        User Management
                      </a>
                      <a
                        href="/admin/audit-logs"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-secondary hover:bg-opacity-50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Audit Logs
                      </a>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-critical hover:bg-critical hover:bg-opacity-10 transition-colors border-t border-border"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout: 3-Column Dashboard */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar Navigation */}
        <aside className="w-64 border-r border-border bg-card overflow-y-auto">
          <nav className="p-4 space-y-2">
            <div className="px-3 py-2">
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
                Production
              </p>
              <ul className="space-y-1">
                <li>
                  <a
                    href="/"
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-primary bg-primary bg-opacity-10 hover:bg-opacity-20 transition-colors"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/batch-scheduling"
                    className="block px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary hover:bg-opacity-50 transition-colors"
                  >
                    Batch Scheduling
                  </a>
                </li>
                <li>
                  <a
                    href="/shop-floor"
                    className="block px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary hover:bg-opacity-50 transition-colors"
                  >
                    Shop Floor Control
                  </a>
                </li>
                <li>
                  <a
                    href="/recipes"
                    className="block px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary hover:bg-opacity-50 transition-colors"
                  >
                    Recipe Management
                  </a>
                </li>
              </ul>
            </div>

            <div className="px-3 py-2">
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
                Inventory
              </p>
              <ul className="space-y-1">
                <li>
                  <a
                    href="/raw-materials"
                    className="block px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary hover:bg-opacity-50 transition-colors"
                  >
                    Raw Materials
                  </a>
                </li>
                <li>
                  <a
                    href="/finished-goods"
                    className="block px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary hover:bg-opacity-50 transition-colors"
                  >
                    Finished Goods
                  </a>
                </li>
                <li>
                  <a
                    href="/fefo-rotation"
                    className="block px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary hover:bg-opacity-50 transition-colors"
                  >
                    FEFO Rotation
                  </a>
                </li>
              </ul>
            </div>

            <div className="px-3 py-2">
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
                Quality
              </p>
              <ul className="space-y-1">
                <li>
                  <a
                    href="/lab-tests"
                    className="block px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary hover:bg-opacity-50 transition-colors"
                  >
                    Lab Tests
                  </a>
                </li>
                <li>
                  <a
                    href="/haccp-logs"
                    className="block px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary hover:bg-opacity-50 transition-colors"
                  >
                    HACCP Logs
                  </a>
                </li>
              </ul>
            </div>


          </nav>
        </aside>

        {/* Center Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Critical Alerts Banner */}
            {(isRoastingCritical || isColloidMillCritical) && (
              <div className="bg-critical bg-opacity-10 border border-critical border-opacity-30 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-critical flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-critical mb-1">
                    Critical Equipment Alert
                  </h3>
                  <p className="text-sm text-foreground">
                    {isRoastingCritical &&
                      "Roasting drum temperature below target. "}
                    {isColloidMillCritical &&
                      "Colloid mill exit temperature exceeding safe limit. "}
                    Immediate action required.
                  </p>
                </div>
              </div>
            )}

            {/* KPI Cards - High Density */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card-ninja">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="data-label mb-1">Active Batches</p>
                    <p className="text-2xl font-bold text-foreground">
                      {sensorData.activeBatches}
                    </p>
                  </div>
                  <Activity className="w-5 h-5 text-text-secondary" />
                </div>
                <p className="text-xs text-text-secondary">Scheduled today</p>
              </div>

              <div className="card-ninja">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="data-label mb-1">Ready to Ship</p>
                    <p className="text-2xl font-bold text-foreground">
                      {sensorData.readyInventory}
                      <span className="text-sm text-text-secondary font-normal">
                        {" "}
                        kg
                      </span>
                    </p>
                  </div>
                  <Package className="w-5 h-5 text-text-secondary" />
                </div>
                <p className="text-xs text-text-secondary">Finished goods</p>
              </div>

              <div className="card-ninja">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="data-label mb-1">Avg Viscosity</p>
                    <p className="text-2xl font-bold text-foreground">
                      2,840
                      <span className="text-sm text-text-secondary font-normal">
                        {" "}
                        mPa·s
                      </span>
                    </p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-text-secondary" />
                </div>
                <p className="text-xs text-text-secondary">Product quality</p>
              </div>

              <div className="card-ninja">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="data-label mb-1">Equipment Uptime</p>
                    <p className="text-2xl font-bold text-success">
                      98.2<span className="text-sm font-normal">%</span>
                    </p>
                  </div>
                  <Zap className="w-5 h-5 text-text-secondary" />
                </div>
                <p className="text-xs text-text-secondary">Last 24 hours</p>
              </div>
            </div>

            {/* Production Schedule & Equipment Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Production Schedule */}
              <div className="card-ninja">
                <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
                  Today's Production Schedule
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      batch: "BATCH-2024-0847",
                      product: "Tahini Premium",
                      status: "In Progress",
                      completion: 65,
                    },
                    {
                      batch: "BATCH-2024-0848",
                      product: "Sweet Tahini Pistachio",
                      status: "Queued",
                      completion: 0,
                    },
                    {
                      batch: "BATCH-2024-0849",
                      product: "Tahini Organic",
                      status: "Scheduled",
                      completion: 0,
                    },
                    {
                      batch: "BATCH-2024-0850",
                      product: "Tahini Premium",
                      status: "Scheduled",
                      completion: 0,
                    },
                  ].map((item) => (
                    <div key={item.batch} className="border-b border-border pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-primary">
                          {item.batch}
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            item.status === "In Progress"
                              ? "bg-success bg-opacity-10 text-success"
                              : item.status === "Queued"
                                ? "bg-warning bg-opacity-10 text-warning"
                                : "bg-border text-text-secondary"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mb-2">{item.product}</p>
                      {item.completion > 0 && (
                        <div className="w-full bg-border rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full transition-all"
                            style={{ width: `${item.completion}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipment Status */}
              <div className="card-ninja">
                <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
                  Critical Equipment Status
                </h3>
                <div className="space-y-4">
                  {/* Roasting Drum */}
                  <div className="border border-border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Roasting Drum
                        </p>
                        <p className="text-xs text-text-secondary">
                          Continuous gas-fired
                        </p>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full animate-pulse ${
                          isRoastingCritical ? "bg-critical" : "bg-success"
                        }`}
                      />
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Current Temp</span>
                        <span
                          className={`font-mono font-bold ${
                            isRoastingCritical ? "text-critical" : "text-success"
                          }`}
                        >
                          {sensorData.roastingTemp.toFixed(1)}°C
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Target Range</span>
                        <span className="font-mono">100–150°C</span>
                      </div>
                      <div className="flex justify-between text-text-secondary">
                        <span>Status:</span>
                        <span className="capitalize">{sensorData.roastingStatus}</span>
                      </div>
                    </div>
                  </div>

                  {/* Colloid Mill */}
                  <div className="border border-border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Colloid Mill
                        </p>
                        <p className="text-xs text-text-secondary">
                          Secondary grinding & cooling
                        </p>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full animate-pulse ${
                          isColloidMillCritical ? "bg-critical" : "bg-success"
                        }`}
                      />
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Exit Temp</span>
                        <span
                          className={`font-mono font-bold ${
                            isColloidMillCritical ? "text-critical" : "text-success"
                          }`}
                        >
                          {sensorData.colloidMillTemp.toFixed(1)}°C
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Safe Limit</span>
                        <span className="font-mono">&lt; 68°C</span>
                      </div>
                      <div className="flex justify-between text-text-secondary">
                        <span>Status:</span>
                        <span className="capitalize">
                          {sensorData.colloidMillStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Metrics */}
            <div className="card-ninja">
              <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
                Batch Quality Summary (Last 10 Batches)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 data-label">Batch ID</th>
                      <th className="text-left py-2 px-3 data-label">Moisture</th>
                      <th className="text-left py-2 px-3 data-label">Viscosity</th>
                      <th className="text-left py-2 px-3 data-label">PV Index</th>
                      <th className="text-left py-2 px-3 data-label">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        id: "BATCH-2024-0841",
                        moisture: "0.82%",
                        viscosity: "2,840 mPa·s",
                        pv: "4.2",
                        status: "Released",
                      },
                      {
                        id: "BATCH-2024-0840",
                        moisture: "0.91%",
                        viscosity: "2,856 mPa·s",
                        pv: "3.8",
                        status: "Released",
                      },
                      {
                        id: "BATCH-2024-0839",
                        moisture: "1.15%",
                        viscosity: "2,720 mPa·s",
                        pv: "5.1",
                        status: "Pending QC",
                      },
                      {
                        id: "BATCH-2024-0838",
                        moisture: "0.78%",
                        viscosity: "2,865 mPa·s",
                        pv: "3.5",
                        status: "Released",
                      },
                      {
                        id: "BATCH-2024-0837",
                        moisture: "0.88%",
                        viscosity: "2,835 mPa·s",
                        pv: "4.0",
                        status: "Released",
                      },
                    ].map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-border hover:bg-secondary hover:bg-opacity-30 transition-colors"
                      >
                        <td className="py-3 px-3 font-mono text-primary text-xs">
                          {row.id}
                        </td>
                        <td className="py-3 px-3 data-cell">{row.moisture}</td>
                        <td className="py-3 px-3 data-cell">{row.viscosity}</td>
                        <td className="py-3 px-3 data-cell">{row.pv}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded ${
                              row.status === "Released"
                                ? "bg-success bg-opacity-10 text-success"
                                : "bg-warning bg-opacity-10 text-warning"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Live Telemetry Logs */}
        <aside className="w-72 border-l border-border bg-card overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
              Live Telemetry
            </h3>

            <div className="space-y-3 text-xs">
              {[
                {
                  time: "14:32:18",
                  source: "Roasting Drum",
                  event: "Temperature stable at 132°C",
                  type: "info",
                },
                {
                  time: "14:31:05",
                  source: "Colloid Mill",
                  event: "Exit temperature 52°C (nominal)",
                  type: "info",
                },
                {
                  time: "14:29:42",
                  source: "BATCH-2024-0847",
                  event: "Entered grinding phase",
                  type: "success",
                },
                {
                  time: "14:28:15",
                  source: "Roasting Drum",
                  event: "Temperature reached target",
                  type: "success",
                },
                {
                  time: "14:26:33",
                  source: "Shop Floor",
                  event: "BATCH-2024-0847 started production",
                  type: "info",
                },
                {
                  time: "14:25:01",
                  source: "QA Lab",
                  event: "BATCH-2024-0840 released to packaging",
                  type: "success",
                },
                {
                  time: "14:22:47",
                  source: "Inventory",
                  event: "Raw material lot RM-2024-0156 received",
                  type: "info",
                },
                {
                  time: "14:20:19",
                  source: "Colloid Mill",
                  event: "Cooling jacket flow nominal",
                  type: "info",
                },
              ].map((log, idx) => (
                <div
                  key={idx}
                  className={`border-l-2 pl-2 py-1 ${
                    log.type === "success"
                      ? "border-success"
                      : log.type === "warning"
                        ? "border-warning"
                        : "border-text-secondary"
                  }`}
                >
                  <p className="font-mono text-text-secondary">{log.time}</p>
                  <p className="text-text-secondary font-medium">{log.source}</p>
                  <p className="text-foreground">{log.event}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
