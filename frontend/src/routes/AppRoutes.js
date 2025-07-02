// AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminPage from "../pages/AdminPage";
import UserPage from "../pages/UserPage";
import TechnicianPage from "../pages/TechnicianPage";
import { userStore } from "../store/userStore";
import  RepairRequest  from "../components/RepairRequest"; // assume you have this
import RequestHistory from "../components/RequestHistory"; // assume you have this
import AdminRequest from "../components/AdminRequest";
import Reports from "../components/Reports";

import Enrollment from "../components/Enrollment";
import TechnicianReport from "../components/TechnicianReport";

function AppRoutes() {
  const activeUser = userStore((state) => state.activeUser); 

  return (
    <Routes>
      {/* Admin Route */}
      <Route
        path="/admin"
        element={
          activeUser?.role === "admin" ? (
            <AdminPage />
          ) : (
            <Navigate to="/" replace />
          )
        }
      >
        <Route path="adminrequests" element={<AdminRequest />} />
        <Route path="Report" element={<Reports />} />

        <Route path="enrollment" element={<Enrollment />} />
      </Route>
      {/* Technician Route */}
      <Route
        path="/technician"
        element={
          activeUser?.role === "technician" ? (
            <TechnicianPage />
          ) : (
            <Navigate to="/" replace />
          )
        }
      >
        <Route path="techreport" element={<TechnicianReport />} />
        <Route index element={<TechnicianReport />} />
      </Route>

      {/* User Route */}
      <Route
        path="/user"
        element={
          activeUser?.role === "user" ? (
            <UserPage />
          ) : (
            <Navigate to="/" replace />
          )
        }
      >
        <Route path="repair" element={<RepairRequest />} />
        <Route path="history" element={<RequestHistory />} />
        {/* Optionally, default to repair page */}
        <Route index element={<RepairRequest />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
