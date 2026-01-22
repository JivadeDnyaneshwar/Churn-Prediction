// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import db from "./db.js";

// import authRoutes from "./routes/authRoutes.js";
// import watchRoutes from "./routes/watchRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// // ✅ Register all routes
// app.use("/api/auth", authRoutes);
// app.use("/api/watch", watchRoutes);
// app.use("/api/admin", adminRoutes);

// // ✅ Simple health route
// app.get("/", (req, res) => {
//   res.send("Backend running successfully ✅");
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   db.connect((err) => {
//     if (err) console.error("❌ MySQL Connection Failed:", err);
//     else console.log("✅ Connected to MySQL");
//   });
// });


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";

import authRoutes from "./routes/authRoutes.js";
import watchRoutes from "./routes/watchRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Backend running successfully ✅");
});

// ✅ Connect to MySQL first
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err);
    process.exit(1); // Stop server if DB connection fails
  }
  console.log("✅ Connected to MySQL");

  // ✅ Register all routes AFTER DB connected
  app.use("/api/auth", authRoutes);
  app.use("/api/watch", watchRoutes);
  app.use("/api/admin", adminRoutes);

  // ✅ Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
