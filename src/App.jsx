import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

// Admin
import Dashboard from "./pages/admin/Dashboard";
import AdminMap from "./pages/admin/MapView";
import Summary from "./pages/admin/Summary";
import AddEngineer from "./pages/admin/AddEngineer";

// Engineer
import LeakageForm from "./pages/engineer/LeakageForm";
import EngineerMap from "./pages/engineer/MapView";
import Success from "./pages/engineer/Success";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Common */}
        <Route path="/" element={<Login />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/map" element={<AdminMap />} />
        <Route path="/admin/summary" element={<Summary />} />
        <Route path="/admin/add-engineer" element={<AddEngineer />} />

        {/* Engineer */}
        <Route path="/engineer/leakage-form" element={<LeakageForm />} />
        <Route path="/engineer/map" element={<EngineerMap />} />
        <Route path="/engineer/success" element={<Success />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
