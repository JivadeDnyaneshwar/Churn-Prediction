
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NetflixChurnLogin from "./pages/NetflixChurnLogin";
import SignUpForm from "./pages/SignUpForm";
import Video from "./pages/video";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin"; // ✅ Admin login page

export default function App() {
  const [loggedInUserId, setLoggedInUserId] = useState(
    localStorage.getItem("loggedInUserId") || null
  );

  // ✅ Normal user login handler
  const handleLogin = (id) => {
    setLoggedInUserId(id);
    localStorage.setItem("loggedInUserId", id);
  };

  const handleLogout = () => {
    setLoggedInUserId(null);
    localStorage.removeItem("loggedInUserId");
  };

  return (
    <Routes>
      {/* --- 🧑‍💻 User Login --- */}
      <Route path="/" element={<NetflixChurnLogin onLogin={handleLogin} />} />

      {/* --- 🆕 Signup --- */}
      <Route path="/signup" element={<SignUpForm onSignup={handleLogin} />} />

      {/* --- 🎬 Video Page --- */}
      <Route path="/video" element={<Video currentUserId={loggedInUserId} />} />

      {/* --- 🔐 Admin Login --- */}
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* --- 🧭 Protected Dashboard (Admin Only) --- */}
      <Route
        path="/dashboard"
        element={
          localStorage.getItem("isAdmin") === "true" ? (
            <Dashboard />
          ) : (
            <Navigate to="/admin-login" />
          )
        }
      />

      {/* --- 🚫 404 Page --- */}
      <Route
        path="*"
        element={
          <div
            style={{
              color: "white",
              textAlign: "center",
              marginTop: "40px",
              fontSize: "20px",
            }}
          >
            <h2>404 - Page Not Found</h2>
          </div>
        }
      />
    </Routes>
  );
}
