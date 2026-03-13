import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Common
const Login = lazy(() => import("./pages/Login"));

// Admin
const Dashboard    = lazy(() => import("./pages/admin/Dashboard"));
const AdminMap     = lazy(() => import("./pages/admin/MapView"));
const Summary      = lazy(() => import("./pages/admin/Summary"));
const AddEngineer  = lazy(() => import("./pages/admin/AddEngineer"));

// Auth
const ChangePassword = lazy(() => import("./pages/auth/ChangePassword"));

// Engineer
const LeakageForm     = lazy(() => import("./pages/engineer/LeakageForm"));
const RecentLeakages  = lazy(() => import("./pages/engineer/RecentLeakages"));
const EngineerMap     = lazy(() => import("./pages/engineer/MapView"));
const Success         = lazy(() => import("./pages/engineer/Success"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* Common */}
          <Route path="/" element={<Login />} />

          {/* Admin */}
          <Route path="/admin/dashboard"     element={<Dashboard />} />
          <Route path="/admin/map"           element={<AdminMap />} />
          <Route path="/admin/summary"       element={<Summary />} />
          <Route path="/admin/add-engineer"  element={<AddEngineer />} />

          {/* Auth */}
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Engineer */}
          <Route path="/engineer/leakage-form"     element={<LeakageForm />} />
          <Route path="/engineer/map"              element={<EngineerMap />} />
          <Route path="/engineer/success"          element={<Success />} />
          <Route path="/engineer/recent-leakages"  element={<RecentLeakages />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// Simple full-screen loader shown while a chunk is downloading
function PageLoader() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "#0f2027",
      color: "#ffffff",
      fontSize: "1rem",
      letterSpacing: "0.05em",
      gap: "0.75rem",
    }}>
      <span style={{
        width: 18, height: 18,
        border: "2px solid #ffffff40",
        borderTop: "2px solid #ffffff",
        borderRadius: "50%",
        display: "inline-block",
        animation: "spin 0.7s linear infinite",
      }} />
      Loading…
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default App;