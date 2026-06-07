import { useState } from "react";
import { ArrowLeft, Plus, CheckCircle, AlertCircle } from "lucide-react";

interface LabTest {
  id: string;
  batchId: string;
  testDate: string;
  testType: string;
  moisture: number;
  salmonella: string;
  ecoli: string;
  peroxideValue: number;
  viscosity: number;
  colorimeter: number;
  status: "passed" | "failed" | "pending";
  testedBy: string;
}

const labTests: LabTest[] = [
  {
    id: "TEST-2024-0401",
    batchId: "BATCH-2024-0841",
    testDate: "2024-01-14 10:30",
    testType: "Release Testing",
    moisture: 0.82,
    salmonella: "Negative",
    ecoli: "Negative",
    peroxideValue: 4.2,
    viscosity: 2840,
    colorimeter: 85,
    status: "passed",
    testedBy: "Dr. Aisha Ahmed",
  },
  {
    id: "TEST-2024-0402",
    batchId: "BATCH-2024-0840",
    testDate: "2024-01-14 11:15",
    testType: "Release Testing",
    moisture: 0.91,
    salmonella: "Negative",
    ecoli: "Negative",
    peroxideValue: 3.8,
    viscosity: 2856,
    colorimeter: 86,
    status: "passed",
    testedBy: "Dr. Aisha Ahmed",
  },
  {
    id: "TEST-2024-0403",
    batchId: "BATCH-2024-0839",
    testDate: "2024-01-14 09:45",
    testType: "Release Testing",
    moisture: 1.15,
    salmonella: "Negative",
    ecoli: "Negative",
    peroxideValue: 5.1,
    viscosity: 2720,
    colorimeter: 84,
    status: "pending",
    testedBy: "Pending Analysis",
  },
  {
    id: "TEST-2024-0404",
    batchId: "BATCH-2024-0838",
    testDate: "2024-01-13 14:20",
    testType: "Release Testing",
    moisture: 0.78,
    salmonella: "Negative",
    ecoli: "Negative",
    peroxideValue: 3.5,
    viscosity: 2865,
    colorimeter: 87,
    status: "passed",
    testedBy: "Dr. Aisha Ahmed",
  },
  {
    id: "TEST-2024-0405",
    batchId: "BATCH-2024-0837",
    testDate: "2024-01-13 13:10",
    testType: "Release Testing",
    moisture: 0.88,
    salmonella: "Negative",
    ecoli: "Negative",
    peroxideValue: 4.0,
    viscosity: 2835,
    colorimeter: 85,
    status: "passed",
    testedBy: "Dr. Aisha Ahmed",
  },
];

export default function LabTests() {
  const passedTests = labTests.filter((t) => t.status === "passed").length;
  const pendingTests = labTests.filter((t) => t.status === "pending").length;

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
              <h1 className="text-2xl font-bold text-foreground">QA/QC Lab Tests</h1>
              <p className="text-sm text-text-secondary">
                Mandatory batch testing before production release
              </p>
            </div>
          </div>
          <button className="btn-primary gap-2">
            <Plus className="w-4 h-4" />
            New Test
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Test Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-ninja">
            <p className="data-label mb-2">Total Tests</p>
            <p className="text-3xl font-bold text-foreground">
              {labTests.length}
            </p>
            <p className="text-xs text-text-secondary mt-1">this month</p>
          </div>

          <div className="card-ninja">
            <p className="data-label mb-2">Passed</p>
            <p className="text-3xl font-bold text-success">{passedTests}</p>
            <p className="text-xs text-text-secondary mt-1">
              {((passedTests / labTests.length) * 100).toFixed(0)}% pass rate
            </p>
          </div>

          <div className="card-ninja">
            <p className="data-label mb-2">Pending</p>
            <p className="text-3xl font-bold text-warning">{pendingTests}</p>
            <p className="text-xs text-text-secondary mt-1">in progress</p>
          </div>

          <div className="card-ninja">
            <p className="data-label mb-2">Avg Viscosity</p>
            <p className="text-3xl font-bold text-foreground">
              {(
                labTests
                  .filter((t) => t.status !== "pending")
                  .reduce((sum, t) => sum + t.viscosity, 0) /
                labTests.filter((t) => t.status !== "pending").length
              ).toFixed(0)}
            </p>
            <p className="text-xs text-text-secondary mt-1">mPa·s</p>
          </div>
        </div>

        {/* Test Results Table */}
        <div className="card-ninja">
          <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
            Lab Test Results
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 data-label">Test ID</th>
                  <th className="text-left py-3 px-4 data-label">Batch ID</th>
                  <th className="text-left py-3 px-4 data-label">Test Date</th>
                  <th className="text-left py-3 px-4 data-label">Moisture %</th>
                  <th className="text-left py-3 px-4 data-label">Salmonella</th>
                  <th className="text-left py-3 px-4 data-label">E. coli</th>
                  <th className="text-left py-3 px-4 data-label">PV</th>
                  <th className="text-left py-3 px-4 data-label">Viscosity</th>
                  <th className="text-left py-3 px-4 data-label">Color</th>
                  <th className="text-left py-3 px-4 data-label">Status</th>
                </tr>
              </thead>
              <tbody>
                {labTests.map((test) => (
                  <tr
                    key={test.id}
                    className="border-b border-border hover:bg-secondary hover:bg-opacity-30 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-primary text-xs">
                      {test.id}
                    </td>
                    <td className="py-3 px-4 font-mono text-primary text-xs">
                      {test.batchId}
                    </td>
                    <td className="py-3 px-4 text-xs text-text-secondary">
                      {test.testDate}
                    </td>
                    <td className="py-3 px-4 font-mono text-foreground">
                      {test.moisture}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-medium text-success">
                        {test.salmonella}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-medium text-success">
                        {test.ecoli}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-foreground">
                      {test.peroxideValue}
                    </td>
                    <td className="py-3 px-4 font-mono text-foreground">
                      {test.viscosity}
                    </td>
                    <td className="py-3 px-4 font-mono text-foreground">
                      {test.colorimeter}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded flex items-center gap-1 w-fit ${
                          test.status === "passed"
                            ? "bg-success bg-opacity-10 text-success"
                            : test.status === "pending"
                              ? "bg-warning bg-opacity-10 text-warning"
                              : "bg-critical bg-opacity-10 text-critical"
                        }`}
                      >
                        {test.status === "passed" && <CheckCircle className="w-3 h-3" />}
                        {test.status === "pending" && <AlertCircle className="w-3 h-3" />}
                        {test.status === "passed"
                          ? "Passed"
                          : test.status === "pending"
                            ? "Pending"
                            : "Failed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Specification Reference */}
        <div className="card-ninja bg-secondary bg-opacity-20">
          <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">
            QC Specifications & Tolerances
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold text-foreground mb-1">Moisture</p>
              <p className="text-text-secondary">Target: &lt; 1%</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Salmonella / E. coli</p>
              <p className="text-text-secondary">Must be negative</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Viscosity</p>
              <p className="text-text-secondary">2700–2900 mPa·s (Tahini)</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Peroxide Value</p>
              <p className="text-text-secondary">&lt; 6 meq/kg</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Colorimeter</p>
              <p className="text-text-secondary">80–90 (acceptance range)</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Oil Separation</p>
              <p className="text-text-secondary">Negligible (&lt; 1mm in 24h)</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
