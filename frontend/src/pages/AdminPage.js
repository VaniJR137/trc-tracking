import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import AdminRequest from "../components/AdminRequest";
import Enrollment from "../components/Enrollment";
import Reports from "../components/Reports";

// Icon imports for use in DashboardLayout
import {
  FilePen,
  UserPlus,
  FileText,
  BarChart2,
  Users,
  Building2,
} from "lucide-react";

function AdminPage() {
  const location = useLocation();
  const [activePage, setActivePage] = useState("");

  useEffect(() => {
    // Match the path to a label
    const pathToLabelMap = {
      "/admin/adminrequests": "Requests",
      "/admin/enrollment": "Enrollment",
      "/admin/Report": "Reports",
      // "/admin/technicReport": "Technician",
      // "/admin/departmentReport": "Department",
    };

    const label = pathToLabelMap[location.pathname];
    if (label) setActivePage(label);
  }, [location.pathname]);

  const renderComponent = () => {
    switch (activePage) {
      case "Requests":
        return <AdminRequest />;
      case "Enrollment":
        return <Enrollment />;
      case "Reports":
        return <Reports />;
      
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

export default AdminPage;
