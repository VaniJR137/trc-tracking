import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import RepairRequest from "../components/RepairRequest";
import RequestHistory from "../components/RequestHistory";
import TechnicianReport from "../components/TechnicianReport";

function UserPage() {
  const location = useLocation();
  const [activePage, setActivePage] = useState("");

  // Map URL paths to corresponding labels
  useEffect(() => {
    const pathToLabelMap = {
      "/technician/techreport": "Reports",
     
    };

    const label = pathToLabelMap[location.pathname];
    if (label) {
      setActivePage(label);
    }
  }, [location.pathname]);

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

export default UserPage;
