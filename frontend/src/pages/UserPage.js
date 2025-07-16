import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import RepairRequest from "../components/RepairRequest";
import RequestHistory from "../components/RequestHistory";
import { jwtDecode } from "jwt-decode";

function UserPage() {
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
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
      navigate("/"); // Invalid token
      return;
    }

    // ✅ Update page label
    const pathToLabelMap = {
      "/user/repair": "Repair Request",
      "/user/history": "History",
    };

    const label = pathToLabelMap[location.pathname];
    if (label) setActivePage(label);
  }, [location.pathname, navigate]);

  const renderComponent = () => {
    switch (activePage) {
      case "Repair Request":
        return <RepairRequest />;
      case "History":
        return <RequestHistory />;
      default:
        return <RepairRequest />;
    }
  };

  return (
    <DashboardLayout onMenuSelect={setActivePage}>
      {renderComponent()}
    </DashboardLayout>
  );
}

export default UserPage;
