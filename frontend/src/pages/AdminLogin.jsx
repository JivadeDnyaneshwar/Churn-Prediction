// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../pages/AdminLogin.css";

// export default function AdminLogin() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState(""); // success or error
//   const navigate = useNavigate();

//   const handleLogin = (e) => {
//     e.preventDefault();

//     if (username === "admin" && password === "admin123") {
//       localStorage.setItem("isAdmin", "true");
//       setMessageType("success");
//       setMessage("✅ Login successful!");
//       setTimeout(() => navigate("/dashboard"), 1200);
//     } else {
//       setMessageType("error");
//       setMessage("❌ Invalid credentials");
//     }

//     setTimeout(() => setMessage(""), 3000);
//   };

//   return (
//     <div className="admin-login-container">
//       {message && (
//         <div className={`admin-login-message ${messageType}`}>
//           {message}
//         </div>
//       )}

//       <form onSubmit={handleLogin} className="admin-login-form">
//         <h2>🔐 Admin Login</h2>

//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/AdminLogin.css";
import Swal from "sweetalert2";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isAdmin", "true");

      Swal.fire({
        icon: "success",
        title: "Login Successful! 🎉",
        text: "Welcome Admin!",
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => navigate("/dashboard"), 1600);
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Failed ❌",
        text: "Invalid credentials",
      });
    }
  };

  return (
    <div className="admin-login-container">
      <form onSubmit={handleLogin} className="admin-login-form">
        <h2>🔐 Admin Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
