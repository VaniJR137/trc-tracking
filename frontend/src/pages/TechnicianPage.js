import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import TechnicianReport from "../components/TechnicianReport";
import { jwtDecode } from "jwt-decode";

function TechnicianPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("");

  useEffect(() => {
    // ✅ Check token validity
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect to login if no token
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        navigate("/"); // Token expired
        return;
      }

      // ✅ Optional: Role check for technician access only
      if (decoded.role !== "technician") {
        alert("Access denied. Only technicians can access this page.");
        navigate("/");
        return;
      }
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
      navigate("/"); // Invalid token
      return;
    }

    // ✅ Update page label
    const pathToLabelMap = {
      "/technician/techreport": "Reports",
    };

    const label = pathToLabelMap[location.pathname];
    if (label) setActivePage(label);
  }, [location.pathname, navigate]);

  const renderComponent = () => {
    switch (activePage) {
      case "Reports":
        return <TechnicianReport />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout onMenuSelect={setActivePage}>
      {renderComponent()}
    </DashboardLayout>
  );
}

export default TechnicianPage;
