import React, { useState, useEffect,useRef } from "react";
import { userStore, sidebarStore } from "../store/userStore";

function VenueAdding() {
  const { open } = sidebarStore();
  const [mode, setMode] = useState("venue");
  const [venueId, setVenueId] = useState("");
  const [venueName, setVenueName] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
const [departmentCode, setDepartmentCode] = useState("");

  const fileInputRef = useRef(null);

  const handleBulkUpload = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
  };

const uploadCSV = async () => {
  if (!selectedFile) return alert("Please select a CSV file.");

  const formData = new FormData();
  formData.append("file", selectedFile); // field name must match backend's `upload.single("file")`

  try {
    const token = localStorage.getItem("token");

    const endpoint =
      mode === "venue"
        ? "http://localhost:5000/api/bulk-upload/venues"
        : "http://localhost:5000/api/bulk-upload/departments";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // DO NOT add 'Content-Type' manually here
      },
      body: formData,
    });

    const result = await res.json();

    if (res.ok) {
      alert(result.message || "CSV uploaded successfully!");
      setSelectedFile(null);
      fileInputRef.current.value = null;
    } else {
      alert("Upload failed: " + (result.message || "Unknown error"));
    }
  } catch (error) {
    console.error("Upload error:", error);
    alert("Upload error: " + error.message);
  }
};




  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/getDepartments",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data =
      mode === "venue"
        ? { venueId, department_id: department, venueName }
        : { departmentName: department,departmentCode: departmentCode };

    const endpoint =
      mode === "venue"
        ? "http://localhost:5000/api/addVenue"
        : "http://localhost:5000/api/addDepartment";

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        alert(
          `${mode === "venue" ? "Venue" : "Department"} added successfully!`
        );
        setVenueId("");
        setVenueName("");
        setDepartment("");
      } else {
        alert("Failed: " + result.message);
      }
    } catch (err) {
      alert("Error adding " + mode);
    }
  };

  return (
    <div
      className={`relative mb-8 flex flex-col transform transition-all duration-500 ease-in-out
    ${!open ? "md:left-32" : "md:left-12 md:w-auto "} ml-4 
    w-[120%] sm:w-[80%] `}
    >
      <div className="md:w-[900px]  md:mx-auto sm:w-[500px]  px-2  sm:px-4 overflow-y-auto max-h-[90vh] sm:max-h-[400px] md:max-h-[600px] transparent-scrollbar">
        <div
          className={`
                  ${!open ? "mr-8 " : "mr-20"}
         bg-white  px-10  mb-4 rounded-3xl shadow-lg`}
        >
          {" "}
          <div className="flex mb-2 justify-around border-b ">
            <button
              onClick={() => setMode("venue")}
              className={`font-medium px-4 py-2 ${
                mode === "venue"
                  ? "border-b-2 border-blue-600 text-blue-700"
                  : "text-gray-500"
              }`}
            >
              Venue
            </button>
            <button
              onClick={() => setMode("department")}
              className={`font-medium px-4 py-2 ${
                mode === "department"
                  ? "border-b-2 border-blue-600 text-blue-700"
                  : "text-gray-500"
              }`}
            >
              Department
            </button>
          </div>
          <form onSubmit={handleSubmit} className="">
            {mode === "venue" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2 font-medium text-gray-700">
                    Select Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                    required
                  >
                    <option value="">-- Select Department --</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.departmentName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Venue ID
                  </label>
                  <input
                    type="text"
                    value={venueId}
                    onChange={(e) => setVenueId(e.target.value.toUpperCase())}
                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="E.g., VENUE101"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 font-medium text-gray-700">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="E.g., Main Auditorium"
                    required
                  />
                </div>
              </div>
            )}

            {mode === "department" && (
              <div className="space-y-4">
                <label className="block text-sm font-medium mt-4 text-gray-700">
                  Department Code
                </label>
                <input
                  type="text"
                  value={departmentCode}
                  onChange={(e) => {
                    const input = e.target.value;
                    const codeFormatted = input.toUpperCase();
                    setDepartmentCode(codeFormatted);
                  }}
                  className="mt-1 mb-2 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="E.g., CSE"
                  required
                />

                <label className="block text-sm font-medium mb-4 text-gray-700">
                  Department Name
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => {
                    const input = e.target.value;
                    const titleCased = input
                      .toLowerCase()
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ");
                    setDepartment(titleCased);
                  }}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="E.g., Computer Science"
                  required
                />
              </div>
            )}

            <div className="pt-4 flex flex-col  mb-4 justify-center items-center">
              <button
                type="submit"
                className="w-[200px] flex justify-center items-center  bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {mode === "venue" ? "Add Venue" : "Add Department"}
              </button>
              <hr className="my-6 w-[100%]  border-gray-800 text-gray-800" />
              <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={handleBulkUpload}
                  className="bg-gray-200 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-300"
                >
                  Choose CSV File
                </button>

                {selectedFile && (
                  <span className="text-sm text-gray-600">
                    {selectedFile.name}
                  </span>
                )}

                <button
                  type="button"
                  onClick={uploadCSV}
                  className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                  Upload {mode === "venue" ? "Venues" : "Departments"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VenueAdding;
