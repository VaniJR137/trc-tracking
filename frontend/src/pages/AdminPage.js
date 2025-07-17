import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import AdminRequest from "../components/AdminRequest";
import Enrollment from "../components/Enrollment";
import Reports from "../components/Reports";
import VenueAdding from "../components/VenueAdding"; // Assuming VenueAdding is imported
import { jwtDecode } from "jwt-decode";

function AdminPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // 🔒 Redirect to login if no token
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "admin") {
        navigate("/"); // 🔒 Redirect non-admin users
      }
    } catch (error) {
      console.error("Invalid token:", error);
      navigate("/"); // 🔒 Redirect if token invalid
    }
  }, [navigate]);

  useEffect(() => {
    const pathToLabelMap = {
      "/admin/adminrequests": "Requests",
      "/admin/enrollment": "Enrollment",
      "/admin/Report": "Reports",
      "/admin/venueAdding": "Venue",
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
      case "Venue":
        return <VenueAdding />; // Assuming VenueAdding is imported
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
