import React, { useState, useEffect } from "react";
import { userStore, sidebarStore } from "../store/userStore";
import { User } from "lucide-react";
function RepairRequest() {
  const { activeUser, clearUser } = userStore();
  const { open } = sidebarStore();
  const [systemType, setSystemType] = useState("");
  const [otherSystemType, setOtherSystemType] = useState("");
  const [problemType, setProblemType] = useState("");
  const [otherProblem, setOtherProblem] = useState("");
  const [otherLab, setOtherLab] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      userId: activeUser.infoid,
      rdepartment: selectedDepartmentName,
      systemType: systemType === "Others" ? otherSystemType : systemType,
      problemType: problemType === "Others" ? otherProblem : problemType,
      lab: selectedLab === "Others" ? otherLab : selectedVenue,
      serialNumber,
      details,
    };

    try {
      const token = localStorage.getItem("token"); // ✅ Get token from localStorage

      const response = await fetch(
        "http://localhost:5000/api/requestComplaint",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Send token in Authorization header
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Complaint submitted successfully!");
        setSystemType("");
        setSelectedDepartment("");
        setSelectedVenue("");
        setOtherSystemType("");
        setProblemType("");
        setOtherProblem("");
        setOtherLab("");
        setSerialNumber("");
        setDetails("");
      } else {
        alert("Failed to submit complaint: " + result.message);
        console.error("Error response:", result);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("An error occurred while submitting the complaint.");
    }
  };
  const [departmentList, setDepartmentList] = useState([]);
  const [venueList, setVenueList] = useState([]);
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          "http://localhost:5000/api/getDepartments",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          setDepartmentList(data); // ✅ Set only if it's an array
        } else {
          console.error("Expected departments as array, received:", data);
          setDepartmentList([]); // ✅ Default to empty array
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartmentList([]); // ✅ Prevent UI break
      }
    };

    const fetchVenues = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://localhost:5000/api/getVenues", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (Array.isArray(data)) {
          setVenueList(data);
        } else {
          console.error("Expected venues as array, received:", data);
          setVenueList([]); // ✅ Default to empty array
        }
      } catch (error) {
        console.error("Error fetching venues:", error);
        setVenueList([]); // ✅ Prevent UI break
      }
    };

    fetchDepartments();
    fetchVenues();
  }, []);

  //   const departmentList = [
  //     { name: "Biomedical Engineering", code: "BME" },
  //     { name: "Civil Engineering", code: "CE" },
  //     { name: "Computer Science & Design", code: "CSD" },
  //     { name: "Computer Science & Engineering", code: "CSE" },
  //     { name: "Electrical & Electronics Engineering", code: "EEE" },
  //     { name: "Electronics & Communication Engineering", code: "ECE" },
  //     { name: "Electronics & Instrumentation Engineering", code: "EIE" },
  //     { name: "Information Science & Engineering", code: "ISE" },
  //     { name: "Mechanical Engineering", code: "ME" },
  //     { name: "Mechatronics Engineering", code: "MCT" },
  //     { name: "Agricultural Engineering", code: "AGE" },
  //     { name: "Artificial Intelligence and Data Science", code: "AIDS" },
  //     { name: "Artificial Intelligence and Machine Learning", code: "AIML" },
  //     { name: "Biotechnology", code: "BT" },
  //     { name: "Computer Science & Business Systems", code: "CSBS" },
  //     { name: "Computer Technology", code: "CT" },
  //     { name: "Food Technology", code: "FT" },
  //     { name: "Fashion Technology", code: "FAT" },
  //     { name: "Information Technology", code: "IT" },
  //     { name: "Textile Technology", code: "TT" },
  // ];
  // const departmentLabMap = {
  //   BME: ["Biomedical Lab 1", "Biomedical Lab 2"],
  //   CE: ["Civil Structures Lab", "Environmental Lab"],
  //   CSD: ["Design Thinking Lab", "UI/UX Lab"],
  //   CSE: ["CSE Programming Lab", "CSE Networking Lab"],
  //   EEE: ["Power Systems Lab", "Electrical Machines Lab"],
  //   ECE: ["ECE Hardware Lab", "ECE VLSI Lab"],
  //   EIE: ["Instrumentation Lab", "Process Control Lab"],
  //   ISE: ["Information Systems Lab", "Database Lab"],
  //   ME: ["Mechanical CAD Lab", "Thermal Lab1"],
  //   MCT: ["Mechatronics Lab 1", "Mechatronics Lab 2"],
  //   AGE: ["Agriculture Machinery Lab", "Soil & Water Lab"],
  //   AIDS: ["AI & DS Lab 1", "AI & DS Lab 2"],
  //   AIML: ["Machine Learning Lab", "AI Lab"],
  //   BT: ["Biotech Lab 1", "Biotech Lab 2"],
  //   CSBS: ["CSBS Lab 1", "CSBS Lab 2"],
  //   CT: ["Computer Technology Lab 1", "Computer Technology Lab 2"],
  //   FT: ["Food Processing Lab", "Food Analysis Lab"],
  //   FAT: ["Fashion Design Studio", "Textile Lab"],
  //   IT: ["IT Lab 1", "IT Lab 2"],
  //   TT: ["Textile Lab 1", "Fabric Manufacturing Lab"],
  // };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDepartmentName, setSelectedDepartmentName] = useState("");

  const [filteredVenues, setFilteredVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState("");
  const [selectedLab, setSelectedLab] = useState("");
  const handleDepartmentSelect = (deptId) => {
    setSelectedDepartment(deptId);
    const selectedDept = departmentList.find((dept) => dept.id === deptId);
    setSelectedDepartmentName(selectedDept ? selectedDept.departmentName : "");
    setIsOpen(false);

    // Filter venues based on selected department_id
    const filtered = venueList.filter(
      (venue) => venue.department_id === deptId
    );
    setFilteredVenues(filtered);
    console.log("Selected Department:", filtered);
  };

  // const handleDepartmentChange = (deptCode) => {
  //   setSelectedDepartment(""); // set department code
  //   setIsOpen(!isOpen); // close dropdown
  //   setSelectedLab(""); // reset lab selection
  //   const labs = departmentLabMap[deptCode] || [];
  //   setLabOptions(labs); // update lab options
  // };

  return (
    <div
      className={`relative mb-8 flex flex-col transform transition-all duration-500 ease-in-out
      ${!open ? "md:left-32" : "md:left-12 md:w-auto "} ml-4
      w-[120%] sm:w-[90%] `}
    >
      <div className="flex items-center justify-end rounded-lg mb-4 mr-24 gap-2 text-darkColor text-sm">
        <span>{activeUser.infoid.toUpperCase()}</span> <User className="mr-2" />
      </div>

      <div className="w-full px-2 sm:px-4 overflow-y-auto max-h-[80vh] sm:max-h-[400px] md:max-h-[500px] transparent-scrollbar">
        <div
          className={`
                  ${!open ? "mr-8 " : "mr-20"}
         bg-white  px-10  mb-4 rounded-3xl shadow-lg`}
        >
          {/* form  */}
          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-bold text-center pt-3 text-blue-800 mb-5">
              System Repair Complaint Form
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6   ">
              {" "}
              {/* Department Dropdown */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1 text-md">
                  Department
                </label>
                <div
                  className="border border-gray-300 rounded-lg p-2 cursor-pointer bg-white"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {selectedDepartment
                    ? departmentList.find((d) => d.id === selectedDepartment)
                        ?.departmentName
                    : "-- Select Department --"}
                </div>

                {isOpen && (
                  <div className="absolute z-10 mt-1 w-[420px] max-h-40 overflow-y-auto border border-gray-300 bg-white rounded-lg shadow-md text-sm">
                    {departmentList.map((dept) => (
                      <div
                        key={dept.id}
                        onClick={() => handleDepartmentSelect(dept.id)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {dept.departmentName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Venue Dropdown */}
              <div className="">
                <label className="block font-semibold text-gray-700 mb-1">
                  Venue
                </label>
                <select
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
                  required
                >
                  <option value="">-- Select Venue --</option>
                  {filteredVenues.map((venue) => (
                    <option key={venue.venueId} value={venue.venueName}>
                      {venue.venueName}
                    </option>
                  ))}
                </select>
              </div>
              {/* System Type */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1 text-md">
                  System Type
                </label>
                <select
                  value={systemType}
                  onChange={(e) => setSystemType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                >
                  <option value="">-- Select System Type --</option>
                  <option value="Desktop">Desktop</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Projector">Projector</option>
                  <option value="Printer">Printer</option>
                  <option value="Speaker">Speaker</option>
                  <option value="TV">TV</option>
                </select>
              </div>
              {/* Serial Number */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1 text-md">
                  System Number
                </label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="-- Enter serial number --"
                  required
                />
              </div>
              {/* Lab */}
              {/* Problem Description */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1 text-md">
                  Problem Description
                </label>

                {problemType !== "Others" ? (
                  <select
                    value={problemType}
                    onChange={(e) => setProblemType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    required
                  >
                    <option value="">-- Select Problem --</option>
                    <option value="No Display">No Display</option>
                    <option value="Booting Issue">Booting Issue</option>
                    <option value="Keyboard/Mouse Issue">
                      Keyboard/Mouse Issue
                    </option>
                    <option value="Software Installation">
                      Software Installation
                    </option>
                    <option value="Network Problem">Network Problem</option>
                    <option value="Others">Others</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter problem description"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={otherProblem}
                    onChange={(e) => setOtherProblem(e.target.value)}
                    onBlur={(e) => {
                      if (!e.target.value.trim()) setProblemType("");
                    }}
                    required
                  />
                )}
              </div>
              <div>
                {" "}
                <label className="block font-semibold text-gray-700 mb-2 text-md">
                  Detailed Description
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  rows="3"
                  placeholder="Provide detailed description of the issue"
                  required
                />
              </div>
            </div>
            {/* Detailed Description */}
            <div className="md:col-span-2"></div>

            {/* Submit Button */}
            <div className="text-center pb-2">
              <button
                type="submit"
                className="bg-blue-600 text-white text-lg px-10 py-2 rounded-full hover:bg-blue-700 transition duration-300"
              >
                Submit Complaint
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RepairRequest;
