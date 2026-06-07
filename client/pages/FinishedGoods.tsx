import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";

interface FinishedGood {
  id: string;
  batchId: string;
  product: string;
  quantity: number;
  unit: string;
  manufactured: string;
  expiry: string;
  storageLocation: string;
  qcStatus: "released" | "pending" | "rejected";
  viscosity: number;
  moisture: number;
}

const finishedGoodsInventory: FinishedGood[] = [
  {
    id: "FG-2024-0001",
    batchId: "BATCH-2024-0840",
    product: "Tahini Premium",
    quantity: 480,
    unit: "kg",
    manufactured: "2024-01-14",
    expiry: "2025-01-14",
    storageLocation: "Tank A1",
    qcStatus: "released",
    viscosity: 2856,
    moisture: 0.91,
  },
  {
    id: "FG-2024-0002",
    batchId: "BATCH-2024-0841",
    product: "Tahini Premium",
    quantity: 475,
    unit: "kg",
    manufactured: "2024-01-14",
    expiry: "2025-01-14",
    storageLocation: "Tank A2",
    qcStatus: "released",
    viscosity: 2840,
    moisture: 0.82,
  },
  {
    id: "FG-2024-0003",
    batchId: "BATCH-2024-0839",
    product: "Sweet Tahini Pistachio",
    quantity: 368,
    unit: "kg",
    manufactured: "2024-01-13",
    expiry: "2024-12-13",
    storageLocation: "Tank B1",
    qcStatus: "pending",
    viscosity: 3180,
    moisture: 1.15,
  },
  {
    id: "FG-2024-0004",
    batchId: "BATCH-2024-0838",
    product: "Tahini Organic",
    quantity: 285,
    unit: "kg",
    manufactured: "2024-01-13",
    expiry: "2025-01-13",
    storageLocation: "Tank C1",
    qcStatus: "released",
    viscosity: 2865,
    moisture: 0.78,
  },
  {
    id: "FG-2024-0005",
    batchId: "BATCH-2024-0837",
    product: "Sweet Tahini Cocoa",
    quantity: 322,
    unit: "kg",
    manufactured: "2024-01-12",
    expiry: "2024-12-12",
    storageLocation: "Tank B2",
    qcStatus: "released",
    viscosity: 3420,
    moisture: 0.95,
  },
  {
    id: "FG-2024-0006",
    batchId: "BATCH-2024-0836",
    product: "Tahini Premium",
    quantity: 490,
    unit: "kg",
    manufactured: "2024-01-12",
    expiry: "2025-01-12",
    storageLocation: "Tank A3",
    qcStatus: "released",
    viscosity: 2835,
    moisture: 0.88,
  },
];

export default function FinishedGoods() {
  const totalInventory = finishedGoodsInventory.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const readyToShip = finishedGoodsInventory
    .filter((item) => item.qcStatus === "released")
    .reduce((sum, item) => sum + item.quantity, 0);

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
                Finished Goods Inventory
              </h1>
              <p className="text-sm text-text-secondary">
                QC-released bulk tanks and FEFO-managed stock
              </p>
            </div>
          </div>
          <button className="btn-primary gap-2">
            <Plus className="w-4 h-4" />
            New Stock
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Inventory Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-ninja">
            <p className="data-label mb-2">Total Inventory</p>
            <p className="text-3xl font-bold text-foreground">
              {totalInventory}
            </p>
            <p className="text-xs text-text-secondary mt-1">kg</p>
          </div>

          <div className="card-ninja">
            <p className="data-label mb-2">Ready to Ship</p>
            <p className="text-3xl font-bold text-success">{readyToShip}</p>
            <p className="text-xs text-text-secondary mt-1">QC Released</p>
          </div>

          <div className="card-ninja">
            <p className="data-label mb-2">Pending QC</p>
            <p className="text-3xl font-bold text-warning">
              {finishedGoodsInventory
                .filter((item) => item.qcStatus === "pending")
                .reduce((sum, item) => sum + item.quantity, 0)}
            </p>
            <p className="text-xs text-text-secondary mt-1">in lab</p>
          </div>

          <div className="card-ninja">
            <p className="data-label mb-2">Product Lines</p>
            <p className="text-3xl font-bold text-foreground">
              {new Set(finishedGoodsInventory.map((item) => item.product)).size}
            </p>
            <p className="text-xs text-text-secondary mt-1">active SKUs</p>
          </div>
        </div>

        {/* Finished Goods by Product */}
        <div className="card-ninja">
          <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
            Inventory by Product (FEFO Rotation)
          </h3>
          <div className="space-y-4">
            {Array.from(
              new Set(finishedGoodsInventory.map((item) => item.product))
            ).map((product) => {
              const lots = finishedGoodsInventory
                .filter((item) => item.product === product)
                .sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());

              const productQuantity = lots.reduce(
                (sum, item) => sum + item.quantity,
                0
              );

              return (
                <div key={product} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground">{product}</h4>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {productQuantity}
                      </p>
                      <p className="text-xs text-text-secondary">kg total</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {lots.map((lot) => {
                      const daysUntilExpiry = Math.ceil(
                        (new Date(lot.expiry).getTime() - Date.now()) /
                          (1000 * 60 * 60 * 24)
                      );

                      return (
                        <div
                          key={lot.id}
                          className="flex items-center justify-between bg-secondary bg-opacity-30 rounded-lg px-3 py-2 text-xs"
                        >
                          <div className="flex-1">
                            <p className="font-mono text-primary">{lot.id}</p>
                            <p className="text-text-secondary">
                              Mfg: {lot.manufactured} | Exp: {lot.expiry}
                            </p>
                          </div>
                          <div className="text-right mr-4">
                            <p className="font-mono font-bold text-foreground">
                              {lot.quantity} kg
                            </p>
                            <p
                              className={`text-xs ${
                                daysUntilExpiry < 30
                                  ? "text-warning"
                                  : "text-success"
                              }`}
                            >
                              {daysUntilExpiry}d left
                            </p>
                          </div>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${
                              lot.qcStatus === "released"
                                ? "bg-success bg-opacity-10 text-success"
                                : lot.qcStatus === "pending"
                                  ? "bg-warning bg-opacity-10 text-warning"
                                  : "bg-critical bg-opacity-10 text-critical"
                            }`}
                          >
                            {lot.qcStatus === "released"
                              ? "Ready"
                              : "Pending"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All Finished Goods Table */}
        <div className="card-ninja">
          <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
            Complete Inventory (All Lots)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 data-label">FG ID</th>
                  <th className="text-left py-3 px-4 data-label">Batch ID</th>
                  <th className="text-left py-3 px-4 data-label">Product</th>
                  <th className="text-right py-3 px-4 data-label">Quantity</th>
                  <th className="text-left py-3 px-4 data-label">Viscosity</th>
                  <th className="text-left py-3 px-4 data-label">Moisture</th>
                  <th className="text-left py-3 px-4 data-label">Expiry</th>
                  <th className="text-left py-3 px-4 data-label">Location</th>
                  <th className="text-left py-3 px-4 data-label">QC Status</th>
                </tr>
              </thead>
              <tbody>
                {finishedGoodsInventory
                  .sort(
                    (a, b) =>
                      new Date(a.expiry).getTime() -
                      new Date(b.expiry).getTime()
                  )
                  .map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-border hover:bg-secondary hover:bg-opacity-30 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-primary text-xs">
                        {item.id}
                      </td>
                      <td className="py-3 px-4 font-mono text-primary text-xs">
                        {item.batchId}
                      </td>
                      <td className="py-3 px-4 text-foreground">{item.product}</td>
                      <td className="py-3 px-4 text-right font-mono text-foreground">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-4 font-mono text-foreground text-xs">
                        {item.viscosity} mPa·s
                      </td>
                      <td className="py-3 px-4 font-mono text-foreground text-xs">
                        {item.moisture}%
                      </td>
                      <td className="py-3 px-4 text-xs text-text-secondary">
                        {item.expiry}
                      </td>
                      <td className="py-3 px-4 font-mono text-primary text-xs">
                        {item.storageLocation}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded capitalize ${
                            item.qcStatus === "released"
                              ? "bg-success bg-opacity-10 text-success"
                              : item.qcStatus === "pending"
                                ? "bg-warning bg-opacity-10 text-warning"
                                : "bg-critical bg-opacity-10 text-critical"
                          }`}
                        >
                          {item.qcStatus === "released"
                            ? "Released"
                            : item.qcStatus === "pending"
                              ? "Pending"
                              : "Rejected"}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
