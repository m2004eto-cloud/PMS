import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";

interface Recipe {
  id: string;
  name: string;
  type: "tahini" | "sweet_tahini";
  targetViscosity: number;
  particleFineness: string;
  oilStabilityIndex: number;
  yield: number;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
    lossCompensation: number;
  }>;
}

const recipes: Recipe[] = [
  {
    id: "RECIPE-001",
    name: "Tahini Premium",
    type: "tahini",
    targetViscosity: 2850,
    particleFineness: "< 6 microns",
    oilStabilityIndex: 15,
    yield: 95.2,
    ingredients: [
      {
        name: "Cleaned Sesame Seeds",
        quantity: 1000,
        unit: "kg",
        lossCompensation: 2.5,
      },
      { name: "Roasted Sesame", quantity: 950, unit: "kg", lossCompensation: 1.2 },
      {
        name: "Sesame Hulls (For Grinding)",
        quantity: 45,
        unit: "kg",
        lossCompensation: 0,
      },
    ],
  },
  {
    id: "RECIPE-002",
    name: "Sweet Tahini Pistachio",
    type: "sweet_tahini",
    targetViscosity: 3200,
    particleFineness: "< 7 microns",
    oilStabilityIndex: 12,
    yield: 92.8,
    ingredients: [
      { name: "Tahini Base", quantity: 700, unit: "kg", lossCompensation: 1.5 },
      {
        name: "Boiled Sugar Syrup (70° Brix)",
        quantity: 180,
        unit: "kg",
        lossCompensation: 2.0,
      },
      {
        name: "Saponin Extract (Halva Root)",
        quantity: 12,
        unit: "kg",
        lossCompensation: 1.0,
      },
      {
        name: "Pistachio Paste",
        quantity: 85,
        unit: "kg",
        lossCompensation: 0.8,
      },
    ],
  },
  {
    id: "RECIPE-003",
    name: "Tahini Organic",
    type: "tahini",
    targetViscosity: 2750,
    particleFineness: "< 5 microns",
    oilStabilityIndex: 18,
    yield: 94.5,
    ingredients: [
      {
        name: "Organic Cleaned Sesame",
        quantity: 1000,
        unit: "kg",
        lossCompensation: 3.0,
      },
      {
        name: "Organic Roasted Sesame",
        quantity: 950,
        unit: "kg",
        lossCompensation: 1.5,
      },
    ],
  },
  {
    id: "RECIPE-004",
    name: "Sweet Tahini Cocoa",
    type: "sweet_tahini",
    targetViscosity: 3400,
    particleFineness: "< 7 microns",
    oilStabilityIndex: 10,
    yield: 91.2,
    ingredients: [
      { name: "Tahini Base", quantity: 700, unit: "kg", lossCompensation: 1.5 },
      {
        name: "Boiled Sugar Syrup (70° Brix)",
        quantity: 175,
        unit: "kg",
        lossCompensation: 2.0,
      },
      {
        name: "Saponin Extract (Halva Root)",
        quantity: 12,
        unit: "kg",
        lossCompensation: 1.0,
      },
      { name: "Cocoa Powder", quantity: 65, unit: "kg", lossCompensation: 0.5 },
    ],
  },
];

export default function Recipes() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(recipes[0]);

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
                Recipe & Formulation Management
              </h1>
              <p className="text-sm text-text-secondary">
                Bill of Materials with loss compensation and viscosity targets
              </p>
            </div>
          </div>
          <button className="btn-primary gap-2">
            <Plus className="w-4 h-4" />
            Create Recipe
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recipe List */}
          <div className="card-ninja lg:col-span-1">
            <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
              Recipes
            </h3>
            <div className="space-y-2">
              {recipes.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className={`w-full text-left px-3 py-3 rounded-lg transition-colors text-sm ${
                    selectedRecipe?.id === recipe.id
                      ? "bg-primary bg-opacity-10 text-primary font-medium"
                      : "text-foreground hover:bg-secondary hover:bg-opacity-50"
                  }`}
                >
                  <p className="font-medium">{recipe.name}</p>
                  <p className="text-xs text-text-secondary mt-1">
                    {recipe.type === "tahini" ? "Tahini" : "Sweet Tahini"}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Recipe Details */}
          {selectedRecipe && (
            <div className="lg:col-span-2 space-y-6">
              {/* Recipe Header */}
              <div className="card-ninja">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                      {selectedRecipe.type === "tahini" ? "Tahini" : "Sweet Tahini"}{" "}
                      Recipe
                    </p>
                    <h2 className="text-2xl font-bold text-foreground">
                      {selectedRecipe.name}
                    </h2>
                  </div>
                  <p className="text-3xl font-bold text-primary">
                    {selectedRecipe.id}
                  </p>
                </div>
              </div>

              {/* Quality Specifications */}
              <div className="card-ninja">
                <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
                  Quality Specifications
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border border-border rounded-lg p-4">
                    <p className="text-xs font-semibold text-text-secondary mb-2">
                      Target Viscosity
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {selectedRecipe.targetViscosity}
                    </p>
                    <p className="text-xs text-text-secondary mt-1">mPa·s</p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <p className="text-xs font-semibold text-text-secondary mb-2">
                      Particle Fineness
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {selectedRecipe.particleFineness}
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <p className="text-xs font-semibold text-text-secondary mb-2">
                      Oil Stability Index
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {selectedRecipe.oilStabilityIndex} hrs
                    </p>
                  </div>
                </div>
              </div>

              {/* Bill of Materials */}
              <div className="card-ninja">
                <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
                  Bill of Materials
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-3 data-label">
                          Ingredient
                        </th>
                        <th className="text-left py-3 px-3 data-label">
                          Quantity
                        </th>
                        <th className="text-left py-3 px-3 data-label">
                          Loss Compensation
                        </th>
                        <th className="text-left py-3 px-3 data-label">
                          Adjusted Qty
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRecipe.ingredients.map((ingredient, idx) => {
                        const adjustedQty =
                          ingredient.quantity +
                          (ingredient.quantity *
                            ingredient.lossCompensation) /
                            100;
                        return (
                          <tr
                            key={idx}
                            className="border-b border-border hover:bg-secondary hover:bg-opacity-30 transition-colors"
                          >
                            <td className="py-3 px-3 data-cell">
                              {ingredient.name}
                            </td>
                            <td className="py-3 px-3 text-foreground font-mono">
                              {ingredient.quantity} {ingredient.unit}
                            </td>
                            <td className="py-3 px-3 text-text-secondary">
                              +{ingredient.lossCompensation}%
                            </td>
                            <td className="py-3 px-3 text-primary font-mono">
                              {adjustedQty.toFixed(1)} {ingredient.unit}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                  <p className="text-sm font-semibold text-foreground">
                    Overall Process Yield
                  </p>
                  <p className="text-2xl font-bold text-success">
                    {selectedRecipe.yield}%
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div className="card-ninja">
                <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">
                  Production Notes
                </h3>
                <div className="bg-secondary bg-opacity-30 rounded-lg p-4 text-sm text-foreground space-y-2">
                  {selectedRecipe.type === "sweet_tahini" ? (
                    <>
                      <p>
                        • Maintain sugar syrup brix level at 70° ± 2° before
                        mixing
                      </p>
                      <p>
                        • Saponin extract acts as emulsifier - distribute evenly
                        throughout kneading phase
                      </p>
                      <p>
                        • Monitor crystallization during cooling to prevent
                        grittiness
                      </p>
                      <p>• Extended shelf life: 18 months in sealed containers</p>
                    </>
                  ) : (
                    <>
                      <p>
                        • Sesame hulling moisture loss varies by lot - adjust
                        intake quantity accordingly
                      </p>
                      <p>
                        • Roasting temperature critical for flavor profile and
                        microbial kill-step
                      </p>
                      <p>
                        • Target viscosity achievable with dual-stage grinding
                        (pre-mill + colloid mill)
                      </p>
                      <p>• Extended shelf life: 12 months in cool, dark storage</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
