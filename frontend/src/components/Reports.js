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
import RemarksPopup from "./RemarksPopup";

const MonthlyReports = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const { activeUser, clearUser } = userStore();
  const { open } = sidebarStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Ongoing");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isEditing, setIsEditing] = useState({});
  const [remarkPopup, setRemarkPopup] = useState({
    open: false,
    faultId: null,
  });
  const [fromMonth, setFromMonth] = useState("");
  const [toMonth, setToMonth] = useState("");

  const [remarkText, setRemarkText] = useState("");
  const [complaints, setComplaints] = useState([]);
  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem("token"); 

      try {
        const response = await fetch(
          `${BASE_URL}/complaintsAdmin`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch complaints");
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

    const createdAt = dayjs(complaint.createdAt);
    const isInMonthRange =
      (!fromMonth ||
        createdAt.isAfter(
          dayjs(fromMonth).startOf("month").subtract(1, "day")
        )) &&
      (!toMonth ||
        createdAt.isBefore(dayjs(toMonth).endOf("month").add(1, "day")));

    return matchesSearch && matchesStatus && isInMonthRange;
  });
  
  
 

  return (
    <div
      className={`relative mb-8 transform transition-all duration-500 ease-in-out
${!open ? "md:ml-16" : "md:ml-4"} ml-4
w-[17%] sm:w-[70%] md:w-[100%] lg:w-[100%] mx-auto px-2`}
    >
      <div
        className={`${
          open ? "md:max-w-2xl sm:max-w-xl  lg:max-w-5xl" : "w-[900px]  "
        } mx-auto`}
      >
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-hardColor "> Reports</h1>
        </div>

        {/* Filters + Search */}
        <div className="bg-white rounded shadow p-6 mb-2">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search faults or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filters */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
              >
                <option value="Ongoing">In Progress</option>
                <option value="Completed">Resolved</option>
                <option value="all">Both</option>
              </select>
              <input
                type="month"
                value={fromMonth}
                onChange={(e) => setFromMonth(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="From Month"
              />

              {/* To Month */}
              <input
                type="month"
                value={toMonth}
                onChange={(e) => setToMonth(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="To Month"
              />
              {/* <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
              >
                <option value="all">All Priority</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select> */}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white  rounded shadow-lg overflow-x-auto max-h-[320px] overflow-y-auto scrollbar-thin">
          <table className=" text-sm text-left">
            <thead className="bg-lightColor  text-darkColor sticky top-0 z-10">
              <tr>
                {[
                  "Fault ID",
                  "User ID",
                  "Name",
                  "Email",
                  "Role",
                  "Department",
                  "Batch",
                  "System Type",
                  "Serial Number",
                  "Reporting Department",
                  "Lab",
                  "Problem Type",
                  "Details",
                  "Technician Info",
                  "Status",
                  "Created Date",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-8 py-2 text-gray-700 font-semibold whitespace-nowrap"
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
                  {/* -- other td fields -- */}
                  <td className="px-4 py-2 text-blue-600 font-medium">
                    {fault.id}
                  </td>
                  <td className="px-4 py-2">{fault.userId}</td>
                  <td className="px-4 py-2">{fault.name}</td>
                  <td className="px-4 py-2">{fault.mailid}</td>
                  <td className="px-4 py-2">{fault.role}</td>
                  <td className="px-4 py-2">{fault.department}</td>
                  <td className="px-4 py-2">{fault.batch || "-"}</td>
                  <td className="px-4 py-2">{fault.systemType}</td>
                  <td className="px-4 py-2">{fault.serialNumber}</td>
                  <td className="px-4 py-2">{fault.rdepartment}</td>
                  <td className="px-4 py-2">{fault.lab}</td>
                  <td className="px-4 py-2">{fault.problemType}</td>
                  <td className="px-4 py-2">{fault.details}</td>

                  {/* Technician Info Column: Name - Phone */}
                  <td className="px-4 py-2">{fault.technicianInfo}</td>

                  {/* Status */}
                  <td className="px-4 py-2 text-center">{fault.status}</td>

                  {/* Created Date */}
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {fault.createdAt
                      ? dayjs(fault.createdAt).format("YYYY-MM-DD HH:mm")
                      : "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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

export default MonthlyReports;
