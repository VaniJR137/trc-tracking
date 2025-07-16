import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

import {
  Search,
  Plus,
  AlertTriangle,
  User,
  Clock,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

import { userStore, sidebarStore } from "../store/userStore";
import RemarksPopup from "./RemarksPopup";

const TechnicianReport = () => {
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
  const [remarkText, setRemarkText] = useState("");
  const [complaints, setComplaints] = useState([]);
  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem("authToken"); // 🔑 Get token

      try {
        const response = await fetch(
          `http://localhost:5000/api/complainttechnician/${activeUser.infoid}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // ✅ Include token here
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

    return matchesSearch && matchesStatus;
  });
  const [updatedComplaints, setUpdatedComplaints] = useState({});
  const [editAcceptance, setEditAcceptance] = useState({});
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    // Ideally fetched from DB
    setTechnicians([
      { id: 1, name: "John Doe", phone: "1234567890" },
      { id: 2, name: "Jane Smith", phone: "9876543210" },
    ]);
  }, []);

//   const handleFieldChange = (id, field, value) => {
//     setUpdatedComplaints((prev) => {
//       const newUpdate = { ...prev[id], [field]: value };

//       if (field === "technicianId") {
//         const tech = technicians.find((t) => t.id === Number(value));
//         newUpdate.technicianPhone = tech?.phone || "";
//         newUpdate.status = "Ongoing";
//       }

//       return { ...prev, [id]: newUpdate };
//     });
//   };

 
//   const handleSavebuttonUpdate = async (id) => {
//     const updated = updatedComplaints[id];
//     const name = updated?.technicianName || "";
//     const phone = updated?.technicianPhone || "";
//     const technicianInfo = `${name} - ${phone}`;

//     try {
//       await fetch(`http://localhost:5000/api/complaints/${id}/update`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           technicianId: updated?.technicianId,
//           technicianInfo,
//           status: updated?.status || "Ongoing",
//         }),
//       });

//       // 🔁 Dynamically update the original row data
//       setComplaints((prev) =>
//         prev.map((fault) =>
//           fault.id === id
//             ? {
//                 ...fault,
//                 technicianId: updated?.technicianId,
//                 technicianInfo,
//                 status: updated?.status || "Ongoing",
//               }
//             : fault
//         )
//       );

//       // Exit edit mode
//       setIsEditing((prev) => ({ ...prev, [id]: false }));

//       // ✅ Optionally clear the update cache
//       setUpdatedComplaints((prev) => {
//         const copy = { ...prev };
//         delete copy[id];
//         return copy;
//       });
//     } catch (err) {
//       console.error("Failed to save update", err);
//     }
//   };

//   const handleComplete = async (id) => {
//     try {
//       await fetch(`http://localhost:5000/api/complaints/${id}/update`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           status: "Completed",
//         }),
//       });

//       // Optional: refresh data from backend
//     } catch (err) {
//       console.error("Failed to complete complaint", err);
//     }
//   };
const handleRemarkSubmit = async () => {
  const { faultId } = remarkPopup;

  await updateCommentsInDB(faultId, remarkText); // Call backend update

  // Dynamically update the local state to reflect the new comment
  setUpdatedComplaints((prev) => ({
    ...prev,
    [faultId]: {
      ...(prev[faultId] || {}),
      TechnicianComments: remarkText, // <-- add this line
    },
  }));

  // Close popup and clear input
  setRemarkPopup({ open: false, faultId: null });
  setRemarkText("");
};
  

const updateCommentsInDB = async (id, remarks) => {
  try {
    const token = localStorage.getItem("authToken"); // 🔑 Get token

    const response = await fetch(`http://localhost:5000/api/comments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Add token here
      },
      body: JSON.stringify({ TechnicianComments: remarks }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to update");
    alert("Update successfully");
  } catch (error) {
    alert("Error updating acceptance: " + error.message);
  }
};

  return (
    <div
      className={`relative mb-8 transform transition-all duration-500 ease-in-out
${!open ? "md:ml-16" : "md:ml-4"} ml-4
w-[32%] sm:w-[80%] md:w-[100%] lg:w-[100%] mx-auto px-2`}
    >
      <div
        className={`${
          open ? "md:max-w-2xl sm:max-w-xl  lg:max-w-5xl" : "w-[900px]  "
        } mx-auto`}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between  ">
          <h1 className="text-xl font-bold text-hardColor ">Task Reports</h1>
          <div className="flex items-center justify-end  rounded-lg mb-4 underline   gap-2 text-darkColor text-sm">
            <span>{activeUser.infoid.toUpperCase()}</span>{" "}
            <User className="mr-2" />
          </div>
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
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white  rounded shadow overflow-x-auto max-h-[320px] overflow-y-auto scrollbar-thin">
          <table className=" text-sm text-left">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {[
                  "Fault Id",
                  "System Type",
                  "Serial Number",
                  "Reporting Department",
                  "Lab",
                  "Problem Type",
                  "Details",
                  "Status",
                  "Created Date",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-4 py-2 text-gray-700 font-semibold whitespace-nowrap"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((fault) => (
                <tr key={fault.id} className="border-t hover:bg-gray-50">
                  {/* -- other td fields -- */}
                  <td className="px-4 py-2 text-blue-600 font-medium">
                    {fault.id}
                  </td>

                  <td className="px-4 py-2">{fault.systemType}</td>
                  <td className="px-4 py-2">{fault.serialNumber}</td>
                  <td className="px-4 py-2">{fault.rdepartment}</td>
                  <td className="px-4 py-2">{fault.lab}</td>
                  <td className="px-4 py-2">{fault.problemType}</td>
                  <td className="px-4 py-2">{fault.details}</td>
                  {/* Status */}
                  <td className="px-4 py-2 text-center">{fault.status}</td>

                  {/* Created Date */}
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {fault.createdAt
                      ? dayjs(fault.createdAt).format("YYYY-MM-DD HH:mm")
                      : "--"}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-2 space-x-2 text-center">
                    {(updatedComplaints[fault.id]?.Acceptance ||
                      fault.Acceptance) === "Approved" ? (
                      <button
                        onClick={() => {
                          const hasComment =
                            updatedComplaints[fault.id]?.TechnicianComments ||
                            fault.TechnicianComments;
                          if (!hasComment) {
                            setRemarkPopup({ open: true, faultId: fault.id });
                          }
                        }}
                        disabled={
                          !!updatedComplaints[fault.id]?.TechnicianComments ||
                          !!fault.TechnicianComments
                        }
                        className={`px-3 py-1 rounded text-white ${
                          updatedComplaints[fault.id]?.TechnicianComments ||
                          fault.TechnicianComments
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-800 hover:bg-blue-900"
                        }`}
                      >
                        {updatedComplaints[fault.id]?.TechnicianComments ||
                        fault.TechnicianComments
                          ? "Completed"
                          : "Complete"}
                      </button>
                    ) : (
                      <span className="text-gray-400 italic">--</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {remarkPopup.open && (
            <RemarksPopup
              onCancel={() => setRemarkPopup({ open: false, faultId: null })}
              onSubmit={handleRemarkSubmit}
              remarkText={remarkText}
              setRemarkText={setRemarkText}
            />
          )}
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

export default TechnicianReport;
