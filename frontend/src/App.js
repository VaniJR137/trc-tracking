import {
  
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
// import React from 'react'
import AppRoutes from "./routes/AppRoutes";
import LoginPage from "./pages/LoginPage";


function App() {
  return (
    <div >
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </div>
  );
}

export default App;
