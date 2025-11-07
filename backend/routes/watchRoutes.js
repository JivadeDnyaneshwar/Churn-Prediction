// import express from "express";
// import db from "../db.js";
// import { exec } from "child_process";

// const router = express.Router();

// // ✅ Add watch record
// router.post("/add", (req, res) => {
//   const { user_id, video_title, genre, duration_minutes } = req.body;

//   if (!user_id || !video_title) {
//     return res.status(400).json({ message: "Missing watch info" });
//   }

//   const query = `
//     INSERT INTO watch_history (user_id, video_title, genre, duration_minutes, watched_at)
//     VALUES (?, ?, ?, ?, NOW())
//   `;

//   db.query(query, [user_id, video_title, genre, duration_minutes], (err) => {
//     if (err) {
//       console.error("❌ Watch insert error:", err);
//       return res.status(500).json({ message: "Database error" });
//     }

//     console.log(`🎬 Watch added for user_id=${user_id}`);

//     // Optional retraining (if ML model available)
//     exec("python ./ml/churn_predict.py", (error) => {
//       if (error) console.error("⚠️ ML model failed:", error);
//       else console.log("✅ Churn model auto-updated after watch event");
//     });

//     res.json({ success: true, message: "Watch logged successfully" });
//   });
// });

// router.get("/all", (req, res) => {
//   const query = `
//     SELECT 
//       w.id,
//       w.user_id,                -- ✅ user_id add केला
//       u.full_name AS user_name, -- ✅ full_name घेतलं
//       u.email AS user_email,    -- ✅ email घेतलं
//       w.video_title,
//       w.genre,
//       w.duration_minutes,
//       w.watched_at
//     FROM watch_history w
//     JOIN users u ON w.user_id = u.id
//     ORDER BY w.watched_at DESC;
//   `;

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("❌ Error fetching watch history:", err);
//       return res.status(500).json({ message: "Database error" });
//     }

//     res.json({ success: true, data: results });
//   });
// });

//// backend/routes/watchRoutes.js
import express from "express";
import db from "../db.js";

const router = express.Router();

// ✅ ADD WATCH HISTORY
router.post("/add", (req, res) => {
  const { user_id, video_title, genre, duration_minutes } = req.body;

  if (!user_id)
    return res.status(401).json({ success: false, message: "User not logged in" });

  db.query(
    "INSERT INTO watch_history (user_id, video_title, genre, duration_minutes) VALUES (?, ?, ?, ?)",
    [user_id, video_title, genre, duration_minutes],
    (err, result) => {
      if (err) {
        console.error("❌ DB Error:", err);
        return res.status(500).json({ success: false, message: "DB error" });
      }
      res.json({ success: true });
    }
  );
});

// ✅ GET ALL WATCH HISTORY (for admin/dashboard)
router.get("/all", (req, res) => {
  const query = `
    SELECT w.*, u.email AS user_email
    FROM watch_history w
    JOIN users u ON w.user_id = u.id
    ORDER BY w.watched_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.status(500).json({ success: false, message: "DB error" });
    }
    res.json({ success: true, data: results });
  });
});

export default router;
