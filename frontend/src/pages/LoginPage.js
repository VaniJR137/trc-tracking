import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/bit.png";
import { userStore } from "../store/userStore";
import { jwtDecode } from "jwt-decode";
import DOMPurify from "dompurify";

const clientId =
  "33140679138-lp44646717dfk1vpor9gdbhb17thq3kf.apps.googleusercontent.com";

export default function LoginPage() {
  const navigate = useNavigate();
  const [userid, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const setUser = userStore((state) => state.setUser);

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await res.json();
      const { token } = data;

      if (token) {
        localStorage.setItem("token", token);

        const decoded = jwtDecode(token);
        const role = decoded.role || "user";

        setUser({ infoid: userid, role });

        if (role === "admin") navigate("/admin");
        else if (role === "technician") navigate("/technician");
        else navigate("/user");
      } else {
        alert("Token missing in response");
      }
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white px-6 rounded-2xl shadow-lg w-[400px] h-[450px]">
        <div className="flex flex-col items-center justify-center">
          <img src={logo} className="w-40 h-32" alt="BIT Logo" />
        </div>

        <h2 className="text-center text-2xl font-semibold text-blue-900 mt-3 mb-2">
          Tracking System
        </h2>

        <input
          type="text"
          placeholder="User Id"
          className="w-full px-4 py-2 border rounded-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={userid}
          onChange={(e) => {
            const sanitized = DOMPurify.sanitize(e.target.value);
            setUserId(sanitized);
          }}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={password}
          onChange={(e) => {
            const sanitized = DOMPurify.sanitize(e.target.value);
            setPassword(sanitized);
          }}
        />

        <button
          className="w-full bg-blue-800 text-white py-2 rounded-sm hover:bg-blue-700 transition"
          onClick={handleLogin}
        >
          Sign In
        </button>

        <div className="flex justify-center items-center my-4">
          <span className="mx-4 text-gray-500">or</span>
        </div>

        <div className="mb-4">
          <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
              onSuccess={async (response) => {
                try {
                  const decodedGoogle = jwtDecode(response.credential);
                  const emailid = DOMPurify.sanitize(decodedGoogle.email);

                  const res = await fetch("http://localhost:5000/api/auth/google", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ emailid }),
                  });

                  if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Server error: ${res.status} - ${errorText}`);
                  }

                  const data = await res.json();

                  if (data?.token) {
                    localStorage.setItem("token", data.token);

                    const decoded = jwtDecode(data.token);
                    const role = decoded.role || "user";

                    setUser({ infoid: emailid, role });

                    if (role === "admin") navigate("/admin");
                    else if (role === "technician") navigate("/technician");
                    else navigate("/user");
                  } else {
                    alert("Login failed: Missing token from server.");
                  }
                } catch (err) {
                  console.error("Login Error:", err);
                  alert("Google login failed. Please try again.");
                }
              }}
              onError={() => {
                console.log("Login Failed");
                alert("Google login failed. Please try again.");
              }}
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
}
