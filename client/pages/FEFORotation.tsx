import { useState } from "react";
import { ArrowLeft, ArrowUp, ArrowDown } from "lucide-react";

interface InventoryLot {
  id: string;
  product: string;
  quantity: number;
  manufactured: string;
  expiry: string;
  daysLeft: number;
  priority: "urgent" | "high" | "normal";
}

const rotationQueue: InventoryLot[] = [
  {
    id: "FG-2024-0003",
    product: "Sweet Tahini Pistachio",
    quantity: 368,
    manufactured: "2024-01-13",
    expiry: "2024-12-13",
    daysLeft: 342,
    priority: "urgent",
  },
  {
    id: "FG-2024-0005",
    product: "Sweet Tahini Cocoa",
    quantity: 322,
    manufactured: "2024-01-12",
    expiry: "2024-12-12",
    daysLeft: 341,
    priority: "urgent",
  },
  {
    id: "FG-2024-0001",
    product: "Tahini Premium",
    quantity: 480,
    manufactured: "2024-01-14",
    expiry: "2025-01-14",
    daysLeft: 364,
    priority: "high",
  },
  {
    id: "FG-2024-0002",
    product: "Tahini Premium",
    quantity: 475,
    manufactured: "2024-01-14",
    expiry: "2025-01-14",
    daysLeft: 364,
    priority: "high",
  },
  {
    id: "FG-2024-0004",
    product: "Tahini Organic",
    quantity: 285,
    manufactured: "2024-01-13",
    expiry: "2025-01-13",
    daysLeft: 363,
    priority: "normal",
  },
  {
    id: "FG-2024-0006",
    product: "Tahini Premium",
    quantity: 490,
    manufactured: "2024-01-12",
    expiry: "2025-01-12",
    daysLeft: 362,
    priority: "normal",
  },
];

export default function FEFORotation() {
  const [lots, setLots] = useState(rotationQueue);
  const [allocations, setAllocations] = useState<
    Array<{ lotId: string; orderId: string; quantity: number }>
  >([
    { lotId: "FG-2024-0003", orderId: "ORD-2024-0821", quantity: 200 },
  ]);

  const totalInventory = lots.reduce((sum, lot) => sum + lot.quantity, 0);
  const urgentQuantity = lots
    .filter((l) => l.priority === "urgent")
    .reduce((sum, lot) => sum + lot.quantity, 0);

  const handleAllocate = (lotId: string) => {
    const lot = lots.find((l) => l.id === lotId);
    if (lot && confirm(`Allocate ${lot.quantity}kg to next order?`)) {
      const newAllocation = {
        lotId,
        orderId: `ORD-2024-${Math.floor(Math.random() * 10000)}`,
        quantity: lot.quantity,
      };
      setAllocations([...allocations, newAllocation]);
      setLots(lots.filter((l) => l.id !== lotId));
    }
  };

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
              FEFO Rotation Management
            </h1>
            <p className="text-sm text-text-secondary">
              First-Expired, First-Out automated stock allocation
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Rotation Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-ninja">
            <p className="data-label mb-2">Total Inventory</p>
            <p className="text-3xl font-bold text-foreground">{totalInventory}</p>
            <p className="text-xs text-text-secondary mt-1">kg</p>
          </div>

          <div className="card-ninja border-l-4 border-l-critical">
            <p className="data-label mb-2">Urgent (Expiring &lt; 1yr)</p>
            <p className="text-3xl font-bold text-critical">
              {urgentQuantity}
            </p>
            <p className="text-xs text-text-secondary mt-1">kg</p>
          </div>

          <div className="card-ninja">
            <p className="data-label mb-2">Allocated This Week</p>
            <p className="text-3xl font-bold text-primary">
              {allocations.reduce((sum, a) => sum + a.quantity, 0)}
            </p>
            <p className="text-xs text-text-secondary mt-1">kg</p>
          </div>

          <div className="card-ninja">
            <p className="data-label mb-2">Avg Days to Expiry</p>
            <p className="text-3xl font-bold text-foreground">
              {Math.round(
                lots.reduce((sum, l) => sum + l.daysLeft, 0) / lots.length
              )}
            </p>
            <p className="text-xs text-text-secondary mt-1">days</p>
          </div>
        </div>

        {/* FEFO Queue - Priority Sorted */}
        <div className="card-ninja">
          <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
            Rotation Queue (Priority Order)
          </h3>
          <div className="space-y-3">
            {lots.map((lot, idx) => (
              <div
                key={lot.id}
                className={`border rounded-lg p-4 ${
                  lot.priority === "urgent"
                    ? "border-critical bg-critical bg-opacity-5"
                    : lot.priority === "high"
                      ? "border-warning bg-warning bg-opacity-5"
                      : "border-border"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-mono text-primary font-bold">{idx + 1}.</p>
                      <div>
                        <p className="font-semibold text-foreground">
                          {lot.product}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {lot.id} | Mfg: {lot.manufactured}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm mt-2">
                      <div>
                        <p className="text-text-secondary">Quantity</p>
                        <p className="font-mono text-lg font-bold text-foreground">
                          {lot.quantity} kg
                        </p>
                      </div>
                      <div>
                        <p className="text-text-secondary">Expiry</p>
                        <p className="font-mono font-bold text-foreground">
                          {lot.expiry}
                        </p>
                      </div>
                      <div>
                        <p className="text-text-secondary">Days Until Expiry</p>
                        <p
                          className={`font-mono text-lg font-bold ${
                            lot.daysLeft < 90
                              ? "text-critical"
                              : lot.daysLeft < 180
                                ? "text-warning"
                                : "text-success"
                          }`}
                        >
                          {lot.daysLeft} days
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded whitespace-nowrap ${
                        lot.priority === "urgent"
                          ? "bg-critical bg-opacity-10 text-critical"
                          : lot.priority === "high"
                            ? "bg-warning bg-opacity-10 text-warning"
                            : "bg-success bg-opacity-10 text-success"
                      }`}
                    >
                      {lot.priority.toUpperCase()}
                    </span>
                    <button
                      onClick={() => handleAllocate(lot.id)}
                      className="text-xs px-3 py-1 rounded border border-primary text-primary hover:bg-primary hover:bg-opacity-10 transition-colors"
                    >
                      Allocate
                    </button>
                  </div>
                </div>

                <div className="mt-3 w-full bg-border rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      lot.daysLeft < 90
                        ? "bg-critical"
                        : lot.daysLeft < 180
                          ? "bg-warning"
                          : "bg-success"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (lot.daysLeft / 365) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Allocations */}
        <div className="card-ninja">
          <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
            Recent Allocations
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 data-label">Lot ID</th>
                  <th className="text-left py-3 px-4 data-label">Product</th>
                  <th className="text-left py-3 px-4 data-label">
                    Quantity (kg)
                  </th>
                  <th className="text-left py-3 px-4 data-label">Order ID</th>
                  <th className="text-left py-3 px-4 data-label">Status</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((allocation) => {
                  const originalLot = rotationQueue.find(
                    (l) => l.id === allocation.lotId
                  );
                  return (
                    <tr
                      key={`${allocation.lotId}-${allocation.orderId}`}
                      className="border-b border-border hover:bg-secondary hover:bg-opacity-30 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-primary text-xs">
                        {allocation.lotId}
                      </td>
                      <td className="py-3 px-4 text-foreground">
                        {originalLot?.product}
                      </td>
                      <td className="py-3 px-4 font-mono text-foreground">
                        {allocation.quantity}
                      </td>
                      <td className="py-3 px-4 font-mono text-primary">
                        {allocation.orderId}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs font-medium px-2 py-1 rounded bg-primary bg-opacity-10 text-primary">
                          Allocated
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* FEFO Rules */}
        <div className="card-ninja bg-secondary bg-opacity-20">
          <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">
            FEFO System Rules
          </h3>
          <div className="space-y-2 text-sm text-foreground">
            <p>✓ All allocations respect expiry date order (earliest first)</p>
            <p>✓ Lots expiring within 90 days flagged as URGENT</p>
            <p>✓ Sweet Tahini products prioritized (shorter shelf life)</p>
            <p>✓ Automatic allocation suggestions at order confirmation</p>
            <p>✓ Segregated storage prevents stock commingling</p>
          </div>
        </div>
      </main>
    </div>
  );
}
