import { useLocation } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function Placeholder() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
          <a href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-2xl">
          <div className="flex justify-center mb-6">
            <div className="bg-warning bg-opacity-10 p-4 rounded-lg">
              <AlertCircle className="w-12 h-12 text-warning" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Module in Development
          </h1>
          <p className="text-lg text-text-secondary mb-6">
            {location.pathname === "/" 
              ? "Dashboard"
              : location.pathname.split("/").filter(Boolean).join(" > ") || "This page"}
          </p>
          <p className="text-foreground mb-8 leading-relaxed">
            This section of the PMS is currently being developed. 
            Continue prompting to build out the functionality you need.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/"
              className="btn-primary"
            >
              Return to Dashboard
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
