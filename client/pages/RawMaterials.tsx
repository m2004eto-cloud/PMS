import { useState } from "react";
import { ArrowLeft, Plus, AlertCircle } from "lucide-react";

interface RawMaterialLot {
  id: string;
  supplier: string;
  material: string;
  quantity: number;
  receivedDate: string;
  expiryDate: string;
  peroxideValue: number;
  freefattyAcids: number;
  status: "active" | "reserved" | "expired";
}

const rawMaterialLots: RawMaterialLot[] = [
  {
    id: "RM-2024-0156",
    supplier: "Premium Seeds Co.",
    material: "Raw Sesame Seeds (Prime Grade)",
    quantity: 2400,
    receivedDate: "2024-01-10",
    expiryDate: "2024-04-10",
    peroxideValue: 3.2,
    freefattyAcids: 0.8,
    status: "active",
  },
  {
    id: "RM-2024-0157",
    supplier: "Global Agriculture Ltd",
    material: "Raw Sesame Seeds (Standard)",
    quantity: 1800,
    receivedDate: "2024-01-08",
    expiryDate: "2024-04-08",
    peroxideValue: 4.1,
    freefattyAcids: 1.2,
    status: "reserved",
  },
  {
    id: "RM-2024-0158",
    supplier: "Organic Harvest Inc",
    material: "Organic Raw Sesame",
    quantity: 950,
    receivedDate: "2024-01-05",
    expiryDate: "2024-04-05",
    peroxideValue: 2.8,
    freefattyAcids: 0.6,
    status: "active",
  },
  {
    id: "RM-2024-0159",
    supplier: "Premium Seeds Co.",
    material: "Raw Sesame Seeds (Prime Grade)",
    quantity: 3200,
    receivedDate: "2024-01-01",
    expiryDate: "2024-04-01",
    peroxideValue: 5.3,
    freefattyAcids: 1.5,
    status: "active",
  },
  {
    id: "RM-2024-0155",
    supplier: "Global Agriculture Ltd",
    material: "Raw Sesame Seeds (Standard)",
    quantity: 0,
    receivedDate: "2023-12-28",
    expiryDate: "2024-03-28",
    peroxideValue: 6.2,
    freefattyAcids: 2.0,
    status: "expired",
  },
];

export default function RawMaterials() {
  const totalInventory = rawMaterialLots
    .filter((l) => l.status !== "expired")
    .reduce((sum, l) => sum + l.quantity, 0);

  const getHealthColor = (pv: number) => {
    if (pv < 4) return "text-success";
    if (pv < 6) return "text-warning";
    return "text-critical";
  };

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
                Raw Materials Inventory
              </h1>
              <p className="text-sm text-text-secondary">
                Track sesame lots with chemical markers (PV & FFA)
              </p>
            </div>
          </div>
          <button className="btn-primary gap-2">
            <Plus className="w-4 h-4" />
            Receive Lot
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Inventory Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-ninja">
            <p className="data-label mb-2">Total Inventory</p>
            <p className="text-3xl font-bold text-foreground">{totalInventory}</p>
            <p className="text-xs text-text-secondary mt-1">kg</p>
          </div>

          <div className="card-ninja">
            <p className="data-label mb-2">Active Lots</p>
            <p className="text-3xl font-bold text-success">
              {rawMaterialLots.filter((l) => l.status === "active").length}
            </p>
            <p className="text-xs text-text-secondary mt-1">in stock</p>
          </div>

          <div className="card-ninja">
            <p className="data-label mb-2">Reserved Lots</p>
            <p className="text-3xl font-bold text-warning">
              {rawMaterialLots.filter((l) => l.status === "reserved").length}
            </p>
            <p className="text-xs text-text-secondary mt-1">allocated</p>
          </div>

          <div className="card-ninja">
            <p className="data-label mb-2">Avg Peroxide Value</p>
            <p className="text-3xl font-bold text-foreground">
              {(
                rawMaterialLots
                  .filter((l) => l.status !== "expired")
                  .reduce((sum, l) => sum + l.peroxideValue, 0) /
                rawMaterialLots.filter((l) => l.status !== "expired").length
              ).toFixed(1)}
            </p>
            <p className="text-xs text-text-secondary mt-1">meq/kg</p>
          </div>
        </div>

        {/* Raw Material Lots Table */}
        <div className="card-ninja">
          <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
            All Sesame Lots
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 data-label">Lot ID</th>
                  <th className="text-left py-3 px-4 data-label">Supplier</th>
                  <th className="text-left py-3 px-4 data-label">Material</th>
                  <th className="text-right py-3 px-4 data-label">Qty (kg)</th>
                  <th className="text-left py-3 px-4 data-label">
                    Peroxide Value
                  </th>
                  <th className="text-left py-3 px-4 data-label">FFA</th>
                  <th className="text-left py-3 px-4 data-label">Expiry</th>
                  <th className="text-left py-3 px-4 data-label">Status</th>
                </tr>
              </thead>
              <tbody>
                {rawMaterialLots.map((lot) => {
                  const daysUntilExpiry = Math.ceil(
                    (new Date(lot.expiryDate).getTime() - Date.now()) /
                      (1000 * 60 * 60 * 24)
                  );
                  return (
                    <tr
                      key={lot.id}
                      className={`border-b border-border hover:bg-secondary hover:bg-opacity-30 transition-colors ${
                        lot.status === "expired"
                          ? "opacity-50"
                          : ""
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-primary text-xs">
                        {lot.id}
                      </td>
                      <td className="py-3 px-4 text-foreground">{lot.supplier}</td>
                      <td className="py-3 px-4 text-foreground text-xs">
                        {lot.material}
                      </td>
                      <td className="py-3 px-4 text-foreground font-mono text-right">
                        {lot.quantity}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-mono font-bold ${getHealthColor(lot.peroxideValue)}`}>
                          {lot.peroxideValue} meq/kg
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-foreground">
                        {lot.freefattyAcids}%
                      </td>
                      <td className="py-3 px-4 text-xs text-text-secondary">
                        {lot.expiryDate}
                        <br />
                        <span
                          className={`font-medium ${
                            daysUntilExpiry < 0
                              ? "text-critical"
                              : daysUntilExpiry < 30
                                ? "text-warning"
                                : "text-success"
                          }`}
                        >
                          {daysUntilExpiry < 0
                            ? `Expired ${Math.abs(daysUntilExpiry)}d ago`
                            : `${daysUntilExpiry}d remaining`}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded capitalize ${
                            lot.status === "active"
                              ? "bg-success bg-opacity-10 text-success"
                              : lot.status === "reserved"
                                ? "bg-warning bg-opacity-10 text-warning"
                                : "bg-critical bg-opacity-10 text-critical"
                          }`}
                        >
                          {lot.status === "active"
                            ? "Active"
                            : lot.status === "reserved"
                              ? "Reserved"
                              : "Expired"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quality Notes */}
        <div className="card-ninja border-l-4 border-l-warning bg-warning bg-opacity-5">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">
                Quality Guidance
              </h3>
              <ul className="text-sm text-foreground space-y-1">
                <li>
                  • <strong>Peroxide Value (PV):</strong> Measure of oil oxidation.
                  Lower is better. Reject if &gt; 10 meq/kg
                </li>
                <li>
                  • <strong>Free Fatty Acids (FFA):</strong> Indicates hydrolysis.
                  Target &lt; 1.5% for premium grade
                </li>
                <li>
                  • High PV/FFA values suggest improper storage conditions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
