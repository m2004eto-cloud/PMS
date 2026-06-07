import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Index from "./pages/Index";
import BatchScheduling from "./pages/BatchScheduling";
import ShopFloor from "./pages/ShopFloor";
import Recipes from "./pages/Recipes";
import RawMaterials from "./pages/RawMaterials";
import FinishedGoods from "./pages/FinishedGoods";
import FEFORotation from "./pages/FEFORotation";
import LabTests from "./pages/LabTests";
import HACCPLogs from "./pages/HACCPLogs";

import AdminUsers from "./pages/AdminUsers";
import AuditLogs from "./pages/AuditLogs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />

            {/* Production Routes */}
            <Route
              path="/batch-scheduling"
              element={
                <ProtectedRoute requiredRoles={["admin", "supervisor"]}>
                  <BatchScheduling />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shop-floor"
              element={
                <ProtectedRoute requiredRoles={["admin", "supervisor", "operator"]}>
                  <ShopFloor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recipes"
              element={
                <ProtectedRoute requiredRoles={["admin", "supervisor"]}>
                  <Recipes />
                </ProtectedRoute>
              }
            />

            {/* Inventory Routes */}
            <Route
              path="/raw-materials"
              element={
                <ProtectedRoute requiredRoles={["admin", "supervisor"]}>
                  <RawMaterials />
                </ProtectedRoute>
              }
            />
            <Route
              path="/finished-goods"
              element={
                <ProtectedRoute requiredRoles={["admin", "supervisor", "qa_manager"]}>
                  <FinishedGoods />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fefo-rotation"
              element={
                <ProtectedRoute requiredRoles={["admin", "supervisor"]}>
                  <FEFORotation />
                </ProtectedRoute>
              }
            />

            {/* Quality Routes */}
            <Route
              path="/lab-tests"
              element={
                <ProtectedRoute requiredRoles={["admin", "qa_manager"]}>
                  <LabTests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/haccp-logs"
              element={
                <ProtectedRoute requiredRoles={["admin", "qa_manager"]}>
                  <HACCPLogs />
                </ProtectedRoute>
              }
            />


            {/* Admin Routes */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRoles="admin">
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/audit-logs"
              element={
                <ProtectedRoute requiredRoles="admin">
                  <AuditLogs />
                </ProtectedRoute>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
