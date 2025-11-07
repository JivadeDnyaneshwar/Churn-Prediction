
// import React, { useState } from "react";
// import data from "./signupData.json";
// import "./SignUpForm.css";
// import { useNavigate } from "react-router-dom";

// export default function SignUpForm({ onSignup }) {
//   const [formData, setFormData] = useState({
//     full_name: "",
//     email: "",
//     password: "",
//   });
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const dataResp = await res.json();

//       if (res.ok) {
//         localStorage.setItem("email", formData.email);
//         localStorage.setItem("token", dataResp.token);
//         onSignup(dataResp.userId); // ✅ Pass user ID to App
//         setMessage(`✅ Signup successful! Welcome, ${formData.full_name}`);
//         setTimeout(() => navigate("/video"), 2000);
//       } else {
//         setMessage("❌ " + dataResp.message);
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage("⚠️ Server error");
//     }
//   };

//   return (
//     <div className="signup-container">
//       <div className="signup-card">
//         <h2 className="signup-title">{data.title}</h2>
//         <form className="signup-form" onSubmit={handleSubmit}>
//           <label className="form-label">{data.fullNameLabel}</label>
//           <input
//             className="form-input"
//             type="text"
//             name="full_name"
//             placeholder={data.fullNamePlaceholder}
//             value={formData.full_name}
//             onChange={handleChange}
//             required
//           />

//           <label className="form-label">{data.emailLabel}</label>
//           <input
//             className="form-input"
//             type="email"
//             name="email"
//             placeholder={data.emailPlaceholder}
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />

//           <label className="form-label">{data.passwordLabel}</label>
//           <input
//             className="form-input"
//             type="password"
//             name="password"
//             placeholder={data.passwordPlaceholder}
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />

//           <button type="submit" className="btn-primary">
//             {data.buttonText}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import data from "./signupData.json";
import "./SignUpForm.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2

export default function SignUpForm({ onSignup }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const dataResp = await res.json();

      if (res.ok) {
        localStorage.setItem("email", formData.email);
        localStorage.setItem("token", dataResp.token);
        onSignup(dataResp.userId);

        // ✅ Success Alert
        Swal.fire({
          icon: "success",
          title: `Welcome, ${formData.full_name}! 🎉`,
          text: "Signup successful!",
          showConfirmButton: false,
          timer: 1500,
        });

        setTimeout(() => navigate("/video"), 1600);
      } else {
        // ❌ Error Alert
        Swal.fire({
          icon: "error",
          title: "Signup Failed ❌",
          text: dataResp.message || "Something went wrong.",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Server Error ⚠️",
        text: "Please try again later.",
      });
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">{data.title}</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <label className="form-label">{data.fullNameLabel}</label>
          <input
            className="form-input"
            type="text"
            name="full_name"
            placeholder={data.fullNamePlaceholder}
            value={formData.full_name}
            onChange={handleChange}
            required
          />

          <label className="form-label">{data.emailLabel}</label>
          <input
            className="form-input"
            type="email"
            name="email"
            placeholder={data.emailPlaceholder}
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label className="form-label">{data.passwordLabel}</label>
          <input
            className="form-input"
            type="password"
            name="password"
            placeholder={data.passwordPlaceholder}
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn-primary">
            {data.buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
