import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";

interface HACCPRecord {
  id: string;
  date: string;
  time: string;
  batchId: string;
  ccp: string;
  parameter: string;
  limit: string;
  measured: string;
  compliant: boolean;
  correctionAction?: string;
  verifiedBy: string;
}

const haccpLogs: HACCPRecord[] = [
  {
    id: "HACCP-2024-001",
    date: "2024-01-14",
    time: "08:15",
    batchId: "BATCH-2024-0847",
    ccp: "Roasting Kill-Step",
    parameter: "Temperature",
    limit: "≥100°C for 45 min",
    measured: "135°C × 47 min",
    compliant: true,
    verifiedBy: "Supervisor Ahmed",
  },
  {
    id: "HACCP-2024-002",
    date: "2024-01-14",
    time: "10:42",
    batchId: "BATCH-2024-0847",
    ccp: "Colloid Mill - Temperature Control",
    parameter: "Exit Temperature",
    limit: "≤68°C",
    measured: "52°C",
    compliant: true,
    verifiedBy: "QA Officer Layla",
  },
  {
    id: "HACCP-2024-003",
    date: "2024-01-14",
    time: "12:30",
    batchId: "BATCH-2024-0849",
    ccp: "Roasting Kill-Step",
    parameter: "Temperature",
    limit: "≥100°C for 45 min",
    measured: "145°C × 48 min",
    compliant: true,
    verifiedBy: "Supervisor Ahmed",
  },
  {
    id: "HACCP-2024-004",
    date: "2024-01-13",
    time: "14:15",
    batchId: "BATCH-2024-0848",
    ccp: "Colloid Mill - Temperature Control",
    parameter: "Exit Temperature",
    limit: "≤68°C",
    measured: "71°C",
    compliant: false,
    correctionAction:
      "Cooling jacket flow increased; batch reprocessed through secondary mill",
    verifiedBy: "QA Officer Layla",
  },
  {
    id: "HACCP-2024-005",
    date: "2024-01-13",
    time: "16:45",
    batchId: "BATCH-2024-0846",
    ccp: "Final Product Microbial Test",
    parameter: "Salmonella / E. coli",
    limit: "Negative",
    measured: "Negative",
    compliant: true,
    verifiedBy: "Dr. Aisha Ahmed",
  },
  {
    id: "HACCP-2024-006",
    date: "2024-01-12",
    time: "09:30",
    batchId: "BATCH-2024-0845",
    ccp: "Roasting Kill-Step",
    parameter: "Temperature",
    limit: "≥100°C for 45 min",
    measured: "132°C × 46 min",
    compliant: true,
    verifiedBy: "Supervisor Ahmed",
  },
];

export default function HACCPLogs() {
  const [selectedLog, setSelectedLog] = useState<HACCPRecord | null>(null);
  const compliantCount = haccpLogs.filter((l) => l.compliant).length;
  const nonCompliantCount = haccpLogs.filter((l) => !l.compliant).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="p-2 hover:bg-secondary hover:bg-opacity-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                HACCP Compliance Logs
              </h1>
              <p className="text-sm text-text-secondary">
                Hazard Analysis & Critical Control Points documentation
              </p>
            </div>
          </div>
          <button className="btn-primary gap-2">
            <Plus className="w-4 h-4" />
            New Record
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Compliance Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-ninja">
            <p className="data-label mb-2">Total Records</p>
            <p className="text-3xl font-bold text-foreground">
              {haccpLogs.length}
            </p>
            <p className="text-xs text-text-secondary mt-1">this month</p>
          </div>

          <div className="card-ninja">
            <p className="data-label mb-2">Compliant</p>
            <p className="text-3xl font-bold text-success">{compliantCount}</p>
            <p className="text-xs text-text-secondary mt-1">
              {((compliantCount / haccpLogs.length) * 100).toFixed(0)}% compliance
            </p>
          </div>

          <div className="card-ninja border-l-4 border-l-critical">
            <p className="data-label mb-2">Non-Compliant</p>
            <p className="text-3xl font-bold text-critical">
              {nonCompliantCount}
            </p>
            <p className="text-xs text-text-secondary mt-1">requires action</p>
          </div>

          <div className="card-ninja">
            <p className="data-label mb-2">Audit Status</p>
            <p className="text-3xl font-bold text-primary">✓</p>
            <p className="text-xs text-text-secondary mt-1">last audit passed</p>
          </div>
        </div>

        {/* HACCP Records */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Records List */}
          <div className="card-ninja lg:col-span-1 max-h-[600px] overflow-y-auto">
            <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
              Record Log
            </h3>
            <div className="space-y-2">
              {haccpLogs.map((log) => (
                <button
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`w-full text-left px-3 py-3 rounded-lg transition-colors text-sm border ${
                    selectedLog?.id === log.id
                      ? "bg-primary bg-opacity-10 border-primary text-primary"
                      : log.compliant
                        ? "border-border hover:border-success hover:bg-secondary hover:bg-opacity-30"
                        : "border-critical bg-critical bg-opacity-5 hover:bg-opacity-10"
                  }`}
                >
                  <p className="font-mono font-bold text-xs mb-1">{log.id}</p>
                  <p className="font-medium line-clamp-2">{log.ccp}</p>
                  <p className="text-xs text-text-secondary mt-1">
                    {log.date} {log.time}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Log Details */}
          {selectedLog && (
            <div className="lg:col-span-2 space-y-4">
              <div className="card-ninja">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                      HACCP Record
                    </p>
                    <h2 className="text-2xl font-bold text-foreground">
                      {selectedLog.ccp}
                    </h2>
                  </div>
                  <span
                    className={`text-xl font-bold px-4 py-2 rounded ${
                      selectedLog.compliant
                        ? "bg-success bg-opacity-10 text-success"
                        : "bg-critical bg-opacity-10 text-critical"
                    }`}
                  >
                    {selectedLog.compliant ? "✓ Compliant" : "⚠ Non-Compliant"}
                  </span>
                </div>
              </div>

              <div className="card-ninja">
                <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
                  Record Details
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-text-secondary mb-1">
                        Record ID
                      </p>
                      <p className="font-mono text-foreground">
                        {selectedLog.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-secondary mb-1">
                        Date & Time
                      </p>
                      <p className="font-mono text-foreground">
                        {selectedLog.date} {selectedLog.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-secondary mb-1">
                        Batch ID
                      </p>
                      <p className="font-mono text-primary">
                        {selectedLog.batchId}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-secondary mb-1">
                        Verified By
                      </p>
                      <p className="text-foreground">{selectedLog.verifiedBy}</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-xs font-semibold text-text-secondary mb-3 uppercase">
                      Control Point Measurement
                    </p>
                    <div className="space-y-3 bg-secondary bg-opacity-30 rounded-lg p-4">
                      <div>
                        <p className="text-sm text-text-secondary mb-1">
                          Parameter
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {selectedLog.parameter}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary mb-1">
                          Critical Limit
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {selectedLog.limit}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary mb-1">
                          Measured Value
                        </p>
                        <p
                          className={`text-lg font-bold ${
                            selectedLog.compliant
                              ? "text-success"
                              : "text-critical"
                          }`}
                        >
                          {selectedLog.measured}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedLog.correctionAction && (
                    <div className="border-t border-border pt-4 bg-warning bg-opacity-10 rounded-lg p-4">
                      <p className="text-xs font-semibold text-warning mb-2 uppercase">
                        ⚠ Corrective Action Taken
                      </p>
                      <p className="text-foreground">
                        {selectedLog.correctionAction}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* HACCP System Reference */}
        <div className="card-ninja bg-secondary bg-opacity-20">
          <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">
            Monitored Critical Control Points (CCPs)
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex gap-2">
              <div className="text-primary font-bold">1.</div>
              <div>
                <p className="font-semibold text-foreground">
                  Roasting Kill-Step
                </p>
                <p className="text-text-secondary">
                  Temperature ≥100°C for ≥45 min to eliminate pathogens
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="text-primary font-bold">2.</div>
              <div>
                <p className="font-semibold text-foreground">
                  Colloid Mill Exit Temperature
                </p>
                <p className="text-text-secondary">
                  Must remain ≤68°C to prevent oil rancidity
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="text-primary font-bold">3.</div>
              <div>
                <p className="font-semibold text-foreground">
                  Final Product Microbiological
                </p>
                <p className="text-text-secondary">
                  Salmonella & E. coli must be negative
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
