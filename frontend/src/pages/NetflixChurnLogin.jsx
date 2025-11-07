
// import React, { useState } from "react";
// import "../pages/NetflixChurnLogin.css";
// import { useNavigate, Link } from "react-router-dom";
// import loginData from "../pages/NetflixChurnLogin.json";

// export default function NetflixChurnLogin({ onLogin }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("email", email);
//         onLogin(data.userId); // ✅ Pass user ID to App
//         setMessage("✅ Login successful!");
//         setTimeout(() => navigate("/video"), 1000);
//       } else {
//         setMessage("❌ " + data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage("⚠️ Server error");
//     }
//   };

//   return (
//     <>
//       {/* ✅ Admin button at top (fixed position optional) */}
//       <div className="admin-header">
//         <Link to="/dashboard">
//           <button className="admin-btn">Admin</button>
//         </Link>
//       </div>

//       {/* ✅ Login form */}
//       <div className="login-container">
//         <form className="login-box" onSubmit={handleSubmit}>
//           <h2 className="login-title">{loginData.title}</h2>

//           <label className="input-label">{loginData.emailLabel}</label>
//           <input
//             className="input-box"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder={loginData.emailPlaceholder}
//             required
//           />

//           <label className="input-label">{loginData.passwordLabel}</label>
//           <input
//             className="input-box"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder={loginData.passwordPlaceholder}
//             required
//           />

//           <button type="submit" className="btn-login">
//             {loginData.loginButton}
//           </button>

//           {message && <p style={{ color: "white" }}>{message}</p>}

//           <Link to="/signup">
//             <button type="button" className="btn-account">
//               {loginData.createAccount}
//             </button>
//           </Link>
//         </form>
//       </div>
//     </>
//   );
// }

import React, { useState } from "react";
import "../pages/NetflixChurnLogin.css";
import { useNavigate, Link } from "react-router-dom";
import loginData from "../pages/NetflixChurnLogin.json";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2

export default function NetflixChurnLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
        onLogin(data.userId);

        // ✅ Success Alert
        Swal.fire({
          icon: "success",
          title: "Login Successful! 🎉",
          text: `Welcome back!`,
          showConfirmButton: false,
          timer: 1500,
        });

        setTimeout(() => navigate("/video"), 1600);
      } else {
        // ❌ Error Alert
        Swal.fire({
          icon: "error",
          title: "Login Failed ❌",
          text: data.message || "Invalid email or password.",
        });
      }
    } catch (err) {
      console.error(err);
      // ⚠️ Server Error Alert
      Swal.fire({
        icon: "error",
        title: "Server Error ⚠️",
        text: "Please try again later.",
      });
    }
  };

  return (
    <>
      {/* ✅ Admin button */}
      <div className="admin-header">
        <Link to="/admin-login">
          <button className="admin-btn">Admin</button>
        </Link>
      </div>

      <div className="login-container">
        <form className="login-box" onSubmit={handleSubmit}>
          <h2 className="login-title">{loginData.title}</h2>

          <label className="input-label">{loginData.emailLabel}</label>
          <input
            className="input-box"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={loginData.emailPlaceholder}
            required
          />

          <label className="input-label">{loginData.passwordLabel}</label>
          <input
            className="input-box"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={loginData.passwordPlaceholder}
            required
          />

          <button type="submit" className="btn-login">
            {loginData.loginButton}
          </button>

          <Link to="/signup">
            <button type="button" className="btn-account">
              {loginData.createAccount}
            </button>
          </Link>
        </form>
      </div>
    </>
  );
}
