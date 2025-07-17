import { Routes, Route, Navigate } from "react-router-dom";
import AdminPage from "../pages/AdminPage";
import UserPage from "../pages/UserPage";
import TechnicianPage from "../pages/TechnicianPage";
import RepairRequest from "../components/RepairRequest";
import RequestHistory from "../components/RequestHistory";
import AdminRequest from "../components/AdminRequest";
import Reports from "../components/Reports";
import Enrollment from "../components/Enrollment";
import TechnicianReport from "../components/TechnicianReport";
import VenueAdding from "../components/VenueAdding";
import { jwtDecode } from "jwt-decode";

function AppRoutes() {
  const token = localStorage.getItem("token");
  let role = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role; // Ensure backend includes `role` when generating JWT
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  return (
    <Routes>
      {/* Admin Routes */}
      <Route
        path="/admin"
        element={role === "admin" ? <AdminPage /> : <Navigate to="/" replace />}
      >
        <Route path="adminrequests" element={<AdminRequest />} />
        <Route path="Report" element={<Reports />} />
        <Route path="enrollment" element={<Enrollment />} />
        <Route path="venueAdding" element={<VenueAdding />} />
      </Route>

      {/* Technician Routes */}
      <Route
        path="/technician"
        element={
          role === "technician" ? (
            <TechnicianPage />
          ) : (
            <Navigate to="/" replace />
          )
        }
      >
        <Route path="techreport" element={<TechnicianReport />} />
        <Route index element={<TechnicianReport />} />
      </Route>

      {/* User Routes */}
      <Route
        path="/user"
        element={role === "user" ? <UserPage /> : <Navigate to="/" replace />}
      >
        <Route path="repair" element={<RepairRequest />} />
        <Route path="history" element={<RequestHistory />} />
        <Route index element={<RepairRequest />} />
      </Route>

      {/* Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
