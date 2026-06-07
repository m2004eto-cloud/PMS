import { useState, useEffect } from "react";
import { ArrowLeft, AlertTriangle, Zap } from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  stage: string;
  currentBatch: string;
  temperature?: number;
  targetTemp?: { min: number; max: number };
  flowRate?: number;
  status: "idle" | "running" | "warning" | "critical";
  lastAlert?: string;
}

export default function ShopFloor() {
  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: "roasting-01",
      name: "Roasting Drum #1",
      stage: "Roasting",
      currentBatch: "BATCH-2024-0847",
      temperature: 135,
      targetTemp: { min: 100, max: 150 },
      status: "running",
    },
    {
      id: "colloid-01",
      name: "Colloid Mill #1",
      stage: "Secondary Milling",
      currentBatch: "BATCH-2024-0847",
      temperature: 52,
      targetTemp: { min: 20, max: 68 },
      status: "running",
    },
    {
      id: "grinding-01",
      name: "Primary Mill #1",
      stage: "Grinding",
      currentBatch: "BATCH-2024-0848",
      temperature: 48,
      targetTemp: { min: 20, max: 65 },
      status: "running",
    },
    {
      id: "filling-01",
      name: "Filling Line #1",
      stage: "Filling & Sealing",
      currentBatch: "BATCH-2024-0846",
      flowRate: 120,
      status: "running",
    },
    {
      id: "roasting-02",
      name: "Roasting Drum #2",
      stage: "Roasting",
      currentBatch: "BATCH-2024-0849",
      temperature: 145,
      targetTemp: { min: 100, max: 150 },
      status: "running",
    },
    {
      id: "hulling-01",
      name: "Hulling Unit",
      stage: "Hulling & Drying",
      currentBatch: "BATCH-2024-0850",
      status: "idle",
      lastAlert: "Maintenance required tomorrow",
    },
  ]);

  const [telemetryLogs, setTelemetryLogs] = useState<
    { timestamp: string; equipment: string; event: string; type: string }[]
  >([
    {
      timestamp: "14:35:22",
      equipment: "Roasting Drum #1",
      event: "Temperature stable at 135°C",
      type: "info",
    },
    {
      timestamp: "14:34:15",
      equipment: "Colloid Mill #1",
      event: "Exit temperature 52°C - optimal range",
      type: "success",
    },
    {
      timestamp: "14:33:08",
      equipment: "Primary Mill #1",
      event: "Began processing BATCH-2024-0848",
      type: "info",
    },
    {
      timestamp: "14:31:45",
      equipment: "Roasting Drum #2",
      event: "Temperature reached target 145°C",
      type: "success",
    },
    {
      timestamp: "14:30:12",
      equipment: "Filling Line #1",
      event: "Batch BATCH-2024-0846 completed",
      type: "success",
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEquipment((prev) =>
        prev.map((eq) => {
          if (!eq.temperature) return eq;
          const drift = (Math.random() - 0.5) * 3;
          const newTemp = eq.temperature + drift;
          let status: Equipment["status"] = "running";

          if (eq.targetTemp) {
            if (newTemp < eq.targetTemp.min || newTemp > eq.targetTemp.max) {
              status = "warning";
            }
            if (
              newTemp < eq.targetTemp.min - 10 ||
              newTemp > eq.targetTemp.max + 10
            ) {
              status = "critical";
            }
          }

          return { ...eq, temperature: newTemp, status };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
            <h1 className="text-2xl font-bold text-foreground">
              Shop Floor Control
            </h1>
            <p className="text-sm text-text-secondary">
              Real-time equipment monitoring and process control
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Critical Control Points */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Roasting Kill-Step */}
          <div className="card-ninja border-l-4 border-l-critical">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                  Critical Control Point
                </p>
                <h3 className="text-lg font-bold text-foreground">
                  Roasting Kill-Step Verification
                </h3>
              </div>
              <AlertTriangle className="w-5 h-5 text-critical flex-shrink-0" />
            </div>
            <div className="space-y-3">
              {[
                { drum: "Roasting Drum #1", temp: 135, status: "compliant" },
                { drum: "Roasting Drum #2", temp: 145, status: "compliant" },
              ].map((item) => (
                <div
                  key={item.drum}
                  className="flex items-center justify-between bg-secondary bg-opacity-40 rounded-lg p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.drum}
                    </p>
                    <p className="text-xs text-text-secondary">
                      Pathogen lethality threshold: {item.temp}°C
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-success bg-opacity-10 text-success">
                    {item.status === "compliant" ? "✓ Compliant" : "Alert"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Colloid Mill Cooling */}
          <div className="card-ninja border-l-4 border-l-warning">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                  Critical Control Point
                </p>
                <h3 className="text-lg font-bold text-foreground">
                  Colloid Mill Temperature Control
                </h3>
              </div>
              <Zap className="w-5 h-5 text-warning flex-shrink-0" />
            </div>
            <div className="space-y-3">
              <div className="bg-secondary bg-opacity-40 rounded-lg p-3">
                <p className="text-sm font-medium text-foreground mb-2">
                  Colloid Mill #1
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Exit Temperature</span>
                    <span className="font-mono font-bold text-success">52°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Safety Limit</span>
                    <span className="font-mono font-bold">{"< 68°C"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Cooling Flow</span>
                    <span className="font-mono font-bold">Nominal</span>
                  </div>
                  <p className="text-text-secondary pt-2">
                    ⚠️ High exit temps cause rapid oil rancidity. Monitor jacket
                    water flow continuously.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Status Grid */}
        <div className="card-ninja">
          <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
            All Equipment Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.map((eq) => (
              <div
                key={eq.id}
                className={`border rounded-lg p-4 ${
                  eq.status === "critical"
                    ? "border-critical bg-critical bg-opacity-5"
                    : eq.status === "warning"
                      ? "border-warning bg-warning bg-opacity-5"
                      : "border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {eq.name}
                    </p>
                    <p className="text-xs text-text-secondary">{eq.stage}</p>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      eq.status === "critical"
                        ? "bg-critical animate-pulse"
                        : eq.status === "warning"
                          ? "bg-warning animate-pulse"
                          : eq.status === "running"
                            ? "bg-success"
                            : "bg-border"
                    }`}
                  />
                </div>

                <div className="space-y-2 text-xs mb-3">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Batch</span>
                    <span className="font-mono text-primary">{eq.currentBatch}</span>
                  </div>
                  {eq.temperature !== undefined && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Current Temp</span>
                        <span
                          className={`font-mono font-bold ${
                            eq.status === "critical"
                              ? "text-critical"
                              : eq.status === "warning"
                                ? "text-warning"
                                : "text-success"
                          }`}
                        >
                          {eq.temperature.toFixed(1)}°C
                        </span>
                      </div>
                      {eq.targetTemp && (
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Target</span>
                          <span className="font-mono">
                            {eq.targetTemp.min}–{eq.targetTemp.max}°C
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  {eq.flowRate && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Flow Rate</span>
                      <span className="font-mono">{eq.flowRate} L/min</span>
                    </div>
                  )}
                  {eq.status === "idle" && (
                    <p className="text-text-secondary">{eq.lastAlert}</p>
                  )}
                </div>

                <button className="text-xs text-primary hover:underline">
                  View Details →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Telemetry Feed */}
        <div className="card-ninja">
          <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
            Live Telemetry Feed
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {telemetryLogs.map((log, idx) => (
              <div
                key={idx}
                className={`border-l-2 pl-3 py-2 ${
                  log.type === "success"
                    ? "border-success"
                    : log.type === "warning"
                      ? "border-warning"
                      : "border-text-secondary"
                }`}
              >
                <p className="font-mono text-xs text-text-secondary mb-1">
                  {log.timestamp}
                </p>
                <p className="text-xs font-medium text-foreground mb-1">
                  {log.equipment}
                </p>
                <p className="text-sm text-foreground">{log.event}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
