import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

import {
  Search,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

import { userStore, sidebarStore } from "../store/userStore";

const RequestHistory = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const { activeUser, clearUser } = userStore();
  const { open } = sidebarStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [complaints, setComplaints] = useState([]);
  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem("token");
      console.log("Using token:", token);

      if (!token) {
        console.error("Token missing. Login again.");
        return;
      }

      try {
        const response = await fetch(
          `${BASE_URL}/complaints/${activeUser.infoid}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorResponse = await response.json();
          console.error("API returned:", errorResponse);
          throw new Error(
            errorResponse.message || "Failed to fetch complaints"
          );
        }

        const data = await response.json();
        setComplaints(data.complaints);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    if (activeUser.infoid) {
      fetchComplaints();
    }
  }, [activeUser.infoid]);
  
  
  
  const filteredComplaints = complaints.filter((complaint) => {
    const searchFields = [
      complaint.id,
      complaint.userId,
      complaint.name,
      complaint.rollno,
      complaint.mailid,
      complaint.role,
      complaint.department,
      complaint.batch,
      complaint.systemType,
      complaint.serialNumber,
      complaint.rdepartment,
      complaint.lab,
      complaint.problemType,
      complaint.details,
      complaint.technicianInfo,
    ];

    const matchesSearch = searchFields.some((field) =>
      field?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesStatus =
      statusFilter === "all" || complaint.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div
      className={`relative mb-8 transform transition-all duration-500 gap-y-4 ease-in-out
    ${!open ? "md:ml-16" : "md:ml-4"} ml-4
    w-[45%] sm:w-[80%] md:w-[100%] lg:w-[100%] mx-auto px-2`}
    >
      <div
        className={`${
          open
            ? "md:max-w-2xl sm:max-w-xl lg:max-w-5xl"
            : "w-full sm:w-[10%] md:w-[900px]"
        } mx-auto`}
      >
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-base sm:text-xl font-bold text-hardColor  sm:text-left">
            Technical Faults Management
          </h1>
        </div>

        {/* Filters + Search */}
        <div className="bg-white rounded shadow p-3 sm:p-6 mb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search faults or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm w-full sm:w-auto"
              >
                <option value="Pending">Pending</option>
                <option value="Ongoing">In Progress</option>
                <option value="Completed">Resolved</option>
                <option value="all">All</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Section */}
        {/* Table Section */}
        <div className="bg-white rounded shadow mb-4 overflow-auto  max-h-[320px] scrollbar-thin">
          <div className="w-[750px] sm:w-full">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  {[
                    "Fault ID",
                    "System Type",
                    "Serial Number",
                    "Department",
                    "Lab",
                    "Problem",
                    "Date",
                    "Acceptance",
                    "Remarks",
                    "Technician",
                    "Status",
                  ].map((head) => (
                    <th
                      key={head}
                      className="text-left px-2 sm:px-4 py-2 text-gray-700 font-medium whitespace-nowrap"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((fault) => (
                  <tr
                    key={fault.id}
                    className="border-t text-center hover:bg-gray-50"
                  >
                    <td className="px-2 sm:px-4 py-2 text-blue-600 font-medium">
                      {fault.id}
                    </td>
                    <td className="px-2 sm:px-4 py-2">{fault.systemType}</td>
                    <td className="px-2 sm:px-4 py-2">{fault.serialNumber}</td>
                    <td className="px-2 sm:px-4 py-2">{fault.rdepartment}</td>
                    <td className="px-2 sm:px-4 py-2">{fault.lab}</td>
                    <td className="px-2 sm:px-4 py-2">{fault.problemType}</td>
                    <td className="px-2 sm:px-2 py-2 whitespace-nowrap">
                      {dayjs(fault.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                    </td>
                    <td className="px-2 sm:px-4 py-2">{fault.Acceptance}</td>
                    <td className="px-2 sm:px-2 py-2">
                      {fault.Remarks ? fault.Remarks : " - "}
                    </td>
                    <td className="px-2 sm:px-2 py-2">
                      {fault.technicianInfo}
                    </td>
                    <td className="px-2 sm:px-4 py-2">{fault.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredComplaints.length === 0 && (
                      <div className="text-center py-12">
                        <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No faults found
                        </h3>
                        <p className="text-gray-500">
                          Try adjusting your search or filter criteria
                        </p>
                      </div>
                    )}
        </div>
      </div>
    </div>
  );
};

export default RequestHistory;
