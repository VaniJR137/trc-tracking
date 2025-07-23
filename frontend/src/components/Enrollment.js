import React, { useState } from "react";
import { userStore, sidebarStore } from "../store/userStore";
import { Eye, EyeOff } from "lucide-react"; 
function Enrollment() {
  const [Id, setId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("admin");

     const { activeUser, clearUser } = userStore();
    const { open } = sidebarStore();
    const handleSubmit = async (e) => {
      e.preventDefault();
      const adminData = { Id, name, phone, password, role };

      try {
        const token = localStorage.getItem("token"); // 🔑 Get token

        const response = await fetch("http://localhost:5000/api/addByAdmin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Include JWT token here
          },
          body: JSON.stringify(adminData),
        });

        const result = await response.json();
        if (response.ok) {
          alert("Registration successfully!");
          setId("");
          setName("");
          setPhone("");
          setPassword("");
          setRole("admin");
        } else {
          alert("Failed: " + result.message);
        }
      } catch (err) {
        alert("Error submitting admin details");
        console.error(err);
      }
    };
    

  return (
    <div
      className={`relative mb-8 flex flex-col transform transition-all mt-8 duration-500 ease-in-out
    ${!open ? "md:left-32" : "md:left-12 md:w-auto "} ml-4
    w-[120%] sm:w-[100%] `}
    >
      <div className="min-h-screen   w-full px-4 overflow-y-scroll transparent-scrollbar md:overflow-y-auto md:max-h-[500px]  max-h-[400px] ">
        <div
          className={`
                  ${!open ? "mr-48 " : "mr-24"}
         bg-white py-4 px-10  mb-8 rounded-3xl shadow-lg`}
        >
          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-bold text-center text-blue-800 mb-5">
              Enrollment Form
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block font-semibold text-gray-700 mb-1 text-md">
                  User ID
                </label>
                <input
                  type="text"
                  value={Id}
                  onChange={(e) => setId(e.target.value.toUpperCase())}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="-- Enter ID --"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1 text-md">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    const input = e.target.value;
                    const titleCased = input
                      .toLowerCase()
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ");
                    setName(titleCased);
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="-- Enter Name --"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1 text-md">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  maxLength={10}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="-- Enter Phone Number --"
                  required
                />
              </div>

              <div className="relative">
                <label className="block font-semibold text-gray-700 mb-1 text-md">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 pr-10"
                  placeholder="-- Enter Password --"
                  required
                />
                <div
                  className="absolute top-9 right-3 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1 text-md">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="technician">Technician</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                type="submit"
                className="bg-blue-600 text-white text-lg px-10 py-2 rounded-full hover:bg-blue-700 transition duration-300"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Enrollment;
