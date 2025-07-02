import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import RepairRequest from "../components/RepairRequest";
import RequestHistory from "../components/RequestHistory";

function UserPage() {
  const location = useLocation();
  const [activePage, setActivePage] = useState("");

  // Map URL paths to corresponding labels
  useEffect(() => {
    const pathToLabelMap = {
      "/user/repair": "Repair Request",
      "/user/history": "History",
    };

    const label = pathToLabelMap[location.pathname];
    if (label) {
      setActivePage(label);
    }
  }, [location.pathname]);

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
