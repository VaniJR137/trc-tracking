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
  User,
} from "lucide-react";

import { userStore, sidebarStore } from "../store/userStore";
import RemarksPopup from "./RemarksPopup";

const AdminRequest = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const { activeUser, clearUser } = userStore();
  const { open } = sidebarStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isEditing, setIsEditing] = useState({});
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [showFaultForm, setShowFaultForm] = useState(false);
  const [systemType, setSystemType] = useState("");
  const [systemFault, setSystemFault] = useState("");
  const [remarkPopup, setRemarkPopup] = useState({
    open: false,
    faultId: null,
  });
  const [remarkText, setRemarkText] = useState("");
  const [complaints, setComplaints] = useState([]);
  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem("token"); // 🔑 Get JWT token

      try {
        const response = await fetch(
          `${BASE_URL}/complaintsAdmin`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // ✅ Send token
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
    const fetchComplaints = async () => {
      const token = localStorage.getItem("token"); // 🔑 Get JWT token

      try {
        const response = await fetch(`${BASE_URL}/technician`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Attach token
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch complaints");
        }

        const data = await response.json();
        setTechnicians(data.technicians);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, []);



  const handleFieldChange = (id, field, value) => {
    setUpdatedComplaints((prev) => {
      const newUpdate = { ...prev[id], [field]: value };

      if (field === "technicianId") {
        const tech = technicians.find((t) => t.id === Number(value));
        newUpdate.technicianPhone = tech?.phone || "";
        newUpdate.status = "Ongoing";
      }

      return { ...prev, [id]: newUpdate };
    });
  };

  // const handleSaveUpdate = async (id) => {
  //   const payload = updatedComplaints[id];

  //   try {
  //     const res = await fetch(`http://localhost:5000/api/complaints/${id}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     if (res.ok) {
  //       alert("Updated successfully!");
  //     } else {
  //       alert("Failed to update.");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert("Error saving update.");
  //   }
  // };


  const handleSavebuttonUpdate = async (id) => {
    const token = localStorage.getItem("token"); // 🔑 Get JWT token

    const updated = updatedComplaints[id];
    const name = updated?.technicianName || "";
    const phone = updated?.technicianPhone || "";
    const technicianInfo = `${name} - ${phone}`;

    try {
      const response = await fetch(
        `${BASE_URL}/complaints/${id}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Include token
          },
          body: JSON.stringify({
            technicianId: updated?.technicianId,
            technicianInfo,
            status: updated?.status || "Ongoing",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Server responded with an error");
      }

      setComplaints((prev) =>
        prev.map((fault) =>
          fault.id === id
            ? {
              ...fault,
              technicianId: updated?.technicianId,
              technicianInfo,
              status: updated?.status || "Ongoing",
            }
            : fault
        )
      );

      setIsEditing((prev) => ({ ...prev, [id]: false }));

      setUpdatedComplaints((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });

      alert("✅ Technician details successfully updated.");
    } catch (err) {
      console.error("❌ Failed to save update:", err);
      alert("Failed to update technician info. Please try again.");
    }
  };





  const handleComplete = async (id) => {
    const token = localStorage.getItem("token"); // 🔑 Get token

    try {
      const response = await fetch(
        `${BASE_URL}/complaints/${id}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Attach token
          },
          body: JSON.stringify({
            status: "Completed",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Server error");
      }

      setComplaints((prev) =>
        prev.map((fault) =>
          fault.id === id ? { ...fault, status: "Completed" } : fault
        )
      );

      alert("Complaint marked as completed.");
    } catch (err) {
      console.error("Failed to complete complaint", err);
      alert("Failed to mark complaint as completed. Please try again.");
    }
  };


  const handleRemarkSubmit = async () => {
    const { faultId } = remarkPopup;
    await updateAcceptanceInDB(faultId, "Rejected", remarkText);
    handleFieldChange(faultId, "Acceptance", "Rejected");
    setUpdatedComplaints((prev) => {
      const newData = { ...prev };
      delete newData[faultId];
      return newData;
    });
    setRemarkPopup({ open: false, faultId: null });
    setRemarkText("");
  };

  const updateAcceptanceInDB = async (id, acceptance, remarks = "") => {
    const token = localStorage.getItem("token"); // 🔑 Get token

    try {
      const response = await fetch(
        `${BASE_URL}/complaints/${id}/acceptance`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Add token here
          },
          body: JSON.stringify({ Acceptance: acceptance, Remarks: remarks }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update");
      alert("Update successfully");
    } catch (error) {
      console.error("Error updating acceptance:", error);
      alert("Error updating acceptance:", error);
    }
  };

  
  const handleTypeSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BASE_URL}/add-system-type`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ typeName: systemType }),
      });

      if (!response.ok) {
        throw new Error("Server error while adding system type");
      }

      alert("System type added successfully.");
      setSystemType("");
      setShowTypeForm(false);
    } catch (error) {
      console.error("Failed to add system type:", error);
      alert("Failed to add system type. Please try again.");
    }
  };


  const handleFaultSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BASE_URL}/add-system-fault`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ faultName: systemFault }),
      });

      if (!response.ok) {
        throw new Error("Server error while adding system fault");
      }

      alert("System fault added successfully.");
      setSystemFault("");
      setShowFaultForm(false);
    } catch (error) {
      console.error("Failed to add system fault:", error);
      alert("Failed to add system fault. Please try again.");
    }
  };




  return (
    <div
      className={`relative mb-8 transform transition-all duration-500 ease-in-out
  ${!open ? "md:ml-16" : "md:ml-4"} ml-4
  w-[20%] sm:w-[80%] md:w-[100%] lg:w-[100%] mx-auto px-2`}
    >
      <div
        className={`${open ? "md:max-w-2xl sm:max-w-xl  lg:max-w-5xl" : "w-[900px]  "
          } mx-auto`}
      >
        <div className="mb-4 flex items-center justify-between  ">
          <h1 className="text-xl font-bold text-hardColor ">
            Technical Faults Management
          </h1>
          <div className="flex items-center justify-end rounded-lg mb-4 underline   gap-2 text-darkColor text-sm">
            <span>{activeUser.infoid.toUpperCase()}</span>{" "}
            <User className="mr-2" />
          </div>
        </div>

        <div className="bg-white rounded shadow p-3 sm:p-6 mb-4">
          <div className="flex flex-col md:flex-row gap-4  justify-between">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
  {/* Left side: Search + Filter */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-grow">
    {/* Search Input */}
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

    {/* Status Filter */}
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

  {/* Right side: Buttons */}
  <div className="flex gap-2 mt-2 sm:mt-0">
    <button
      onClick={() => setShowTypeForm(!showTypeForm)}
      className="bg-blue-600 text-white text-lg py-1 px-4 rounded-md hover:bg-blue-700 transition duration-300"
    >
      System Type +
    </button>
    <button
      onClick={() => setShowFaultForm(true)}
      className="bg-blue-600 text-white text-lg py-1 px-4 rounded-md hover:bg-blue-700 transition duration-300"
    >
      System Fault +
    </button>
  </div>
</div>

           
            {showTypeForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-md shadow-lg w-96 relative">
                  <h2 className="text-lg font-semibold mb-4">Add System Type</h2>

                  <form onSubmit={handleTypeSubmit}>
                    <input
                      type="text"
                      value={systemType}
                      onChange={(e) => setSystemType(e.target.value)}
                      placeholder="Enter system type"
                      className="w-full border px-3 py-2 rounded-md mb-4"
                      required
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowTypeForm(false)}
                        className="bg-gray-400 text-white px-4 py-1 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-700 text-white px-4 py-1 rounded-md"
                      >
                        Submit
                      </button>
                    </div>
                  </form>

                </div>
              </div>
            )}


              {showFaultForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-md shadow-lg w-96 relative">
                    <h2 className="text-lg font-semibold mb-4">Add System Fault</h2>
                    <form onSubmit={handleFaultSubmit}>
                      <input
                        type="text"
                        value={systemFault}
                        onChange={(e) => setSystemFault(e.target.value)}
                        placeholder="Enter fault"
                        className="w-full border px-3 py-2 rounded-md mb-4"
                        required
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowFaultForm(false)}
                          className="bg-gray-400 text-white px-4 py-1 rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-700 text-white px-4 py-1 rounded-md"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            
          </div>
        </div>

        {/* Table */}
        <div className="bg-white  rounded shadow overflow-x-auto max-h-[320px] overflow-y-auto p-2 scrollbar-thin">
          <table className=" text-sm text-left">
            <thead className="bg-gray-100 sticky top-0 z-10">
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
                  "Acceptance",
                  "Technician Select",
                  "Technician Info",
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

                  {/* Acceptance */}
                  <td className="px-4 py-2">
                    {editAcceptance[fault.id] ? (
                      <select
                        className="border p-1 rounded"
                        value={
                          updatedComplaints[fault.id]?.Acceptance ||
                          fault.Acceptance ||
                          ""
                        }
                        onChange={async (e) => {
                          const selectedValue = e.target.value;
                          if (selectedValue === "Rejected") {
                            setRemarkPopup({ open: true, faultId: fault.id });
                            return;
                          }
                          handleFieldChange(
                            fault.id,
                            "Acceptance",
                            selectedValue
                          );
                          await updateAcceptanceInDB(fault.id, selectedValue);
                          setEditAcceptance((prev) => ({
                            ...prev,
                            [fault.id]: false,
                          }));
                        }}
                      >
                        <option value="">-- Select --</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    ) : (
                      <button
                        onClick={() =>
                          setEditAcceptance((prev) => ({
                            ...prev,
                            [fault.id]: true,
                          }))
                        }
                        className={`px-3 py-1 rounded text-white ${(updatedComplaints[fault.id]?.Acceptance ||
                            fault.Acceptance) === "Approved"
                            ? "bg-green-600"
                            : (updatedComplaints[fault.id]?.Acceptance ||
                              fault.Acceptance) === "Rejected"
                              ? "bg-red-600"
                              : "bg-yellow-500"
                          }`}
                      >
                        {updatedComplaints[fault.id]?.Acceptance ||
                          fault.Acceptance ||
                          "Pending"}
                      </button>
                    )}
                  </td>

                  <td className="px-4 py-2">
                    {(updatedComplaints[fault.id]?.Acceptance ||
                      fault.Acceptance) === "Approved" ? (
                      isEditing[fault.id] || !fault.technicianId ? (
                        <select
                          className="border p-1 rounded w-full"
                          value={
                            updatedComplaints[fault.id]?.technicianId || ""
                          }
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            const selectedTech = technicians.find(
                              (t) => t.Id === selectedId
                            ); // capital I here
                            handleFieldChange(
                              fault.id,
                              "technicianId",
                              selectedId
                            );
                            handleFieldChange(
                              fault.id,
                              "technicianPhone",
                              selectedTech?.phone || ""
                            );
                            handleFieldChange(
                              fault.id,
                              "technicianName",
                              selectedTech?.name || ""
                            );
                          }}
                        >
                          <option value="">-- Select Technician --</option>
                          {technicians.map((tech) => (
                            <option key={tech.Id} value={tech.Id}>
                              {" "}
                              {/* Use Id here */}
                              {tech.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-gray-500 italic">--</span>
                      )
                    ) : (
                      <span className="text-gray-400 italic">--</span>
                    )}
                  </td>

                  {/* Technician Info Column: Name - Phone */}
                  <td className="px-4 py-2">
                    {updatedComplaints[fault.id]?.technicianName &&
                      updatedComplaints[fault.id]?.technicianPhone ? (
                      <span className="text-gray-700 font-medium">
                        {`${updatedComplaints[fault.id].technicianName} - ${updatedComplaints[fault.id].technicianPhone
                          }`}
                      </span>
                    ) : fault.technicianInfo ? (
                      <span className="text-gray-700 font-medium">
                        {fault.technicianInfo}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">--</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-2 text-center">
                    {(updatedComplaints[fault.id]?.Acceptance ||
                      fault.Acceptance) === "Approved" ? (
                      <span className="text-gray-800 font-semibold">
                        {updatedComplaints[fault.id]?.status ||
                          fault.status ||
                          "--"}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">--</span>
                    )}
                  </td>

                  {/* Created Date */}
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {fault.createdAt
                      ? dayjs(fault.createdAt).format("YYYY-MM-DD HH:mm")
                      : "--"}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-2 space-x-2">
                    {(updatedComplaints[fault.id]?.Acceptance === "Approved" ||
                      fault.Acceptance === "Approved") &&
                      updatedComplaints[fault.id]?.status !== "Completed" &&
                      fault.status !== "Completed" ? (
                      <>
                        {isEditing[fault.id] || !fault.technicianId ? (
                          <button
                            onClick={() => handleSavebuttonUpdate(fault.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded"
                          >
                            Save
                          </button>
                        ) : (
                          <div div className="flex space-x-2">
                            <button
                              onClick={() =>
                                setIsEditing((prev) => ({
                                  ...prev,
                                  [fault.id]: true,
                                }))
                              }
                              className="px-3 py-1 bg-blue-800 text-white rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleComplete(fault.id)}
                              className="px-3 py-1 bg-blue-800 text-white rounded"
                            >
                              Complete
                            </button>
                          </div>
                        )}
                      </>
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

export default AdminRequest;
