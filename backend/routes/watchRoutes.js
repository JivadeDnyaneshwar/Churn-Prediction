
// import express from "express";
// import db from "../db.js";

// const router = express.Router();

// // ✅ ADD WATCH HISTORY
// router.post("/add", (req, res) => {
//   const { user_id, video_title, genre, duration_minutes } = req.body;

//   if (!user_id)
//     return res.status(401).json({ success: false, message: "User not logged in" });

//   db.query(
//     "INSERT INTO watch_history (user_id, video_title, genre, duration_minutes) VALUES (?, ?, ?, ?)",
//     [user_id, video_title, genre, duration_minutes],
//     (err, result) => {
//       if (err) {
//         console.error("❌ DB Error:", err);
//         return res.status(500).json({ success: false, message: "DB error" });
//       }
//       res.json({ success: true });
//     }
//   );
// });

// // ✅ GET ALL WATCH HISTORY (for admin/dashboard)
// router.get("/all", (req, res) => {
//   const query = `
//     SELECT w.*, u.email AS user_email
//     FROM watch_history w
//     JOIN users u ON w.user_id = u.id
//     ORDER BY w.watched_at DESC
//   `;

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("❌ DB Error:", err);
//       return res.status(500).json({ success: false, message: "DB error" });
//     }
//     res.json({ success: true, data: results });
//   });
// });

// export default router;

// import express from "express";
// import db from "../db.js";

// const router = express.Router();

// /* --------------------------------------------
//    ✅ 1️⃣ Add Video Watch
// --------------------------------------------- */
// router.post("/add", (req, res) => {
//   const { user_id, video_title, genre, duration_minutes } = req.body;

//   if (!user_id || !video_title) {
//     return res.status(400).json({ message: "Missing video info" });
//   }

//   const query = `
//     INSERT INTO watch_history (user_id, video_title, genre, duration_minutes, watched_at)
//     VALUES (?, ?, ?, ?, NOW())
//   `;

//   db.query(query, [user_id, video_title, genre, duration_minutes], (err) => {
//     if (err) {
//       console.error("❌ Watch insert error:", err);
//       return res.status(500).json({ message: "Database insert error" });
//     }
//     console.log(`🎬 Watch added for user_id=${user_id}`);
//     res.json({ success: true, message: "Watch logged successfully!" });
//   });
// });

// /* --------------------------------------------
//    ✅ 2️⃣ Add App Screen Time (fixed version)
// --------------------------------------------- */
// router.post("/screen-time", (req, res) => {
//   const { user_id, screen_time_minutes } = req.body;

//   if (!user_id || screen_time_minutes == null) {
//     return res.status(400).json({ message: "Missing user_id or screen time" });
//   }

//   const query = `
//     INSERT INTO screen_time (user_id, screen_time_minutes, recorded_at)
//     VALUES (?, ?, NOW())
//   `;

//   db.query(query, [user_id, screen_time_minutes], (err) => {
//     if (err) {
//       console.error("❌ Screen time insert error:", err);
//       return res.status(500).json({ message: "Database insert error" });
//     }
//     console.log(`✅ Screen time ${screen_time_minutes} min saved for user_id=${user_id}`);
//     res.json({ success: true, message: "Screen time saved successfully" });
//   });
// });

// /* --------------------------------------------
//    ✅ 3️⃣ Get all Video Watch History
// --------------------------------------------- */
// router.get("/all", (req, res) => {
//   const query = `
//     SELECT 
//       w.id,
//       w.user_id,
//       u.email AS user_email,
//       w.video_title,
//       w.genre,
//       w.duration_minutes,
//       w.watched_at
//     FROM watch_history w
//     JOIN users u ON w.user_id = u.id
//     ORDER BY w.watched_at DESC
//   `;

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("❌ DB Error:", err);
//       return res.status(500).json({ success: false, message: "DB error" });
//     }
//     res.json({ success: true, data: results });
//   });
// });

// /* --------------------------------------------
//    ✅ 4️⃣ Get all App Screen Times (Fixed)
// --------------------------------------------- */
// router.get("/screen-time/all", (req, res) => {
//   const query = `
//     SELECT 
//       s.id,
//       s.user_id,
//       u.email AS user_email,
//       s.screen_time_minutes,
//       s.recorded_at
//     FROM screen_time s
//     JOIN users u ON s.user_id = u.id
//     ORDER BY s.recorded_at DESC
//   `;

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("❌ DB Error:", err);
//       return res.status(500).json({ success: false, message: "DB error" });
//     }

//     // Aggregate total screen time per user
//     const totalScreenTimes = {};
//     results.forEach((row) => {
//       if (!totalScreenTimes[row.user_email]) totalScreenTimes[row.user_email] = 0;
//       totalScreenTimes[row.user_email] += parseFloat(row.screen_time_minutes || 0);
//     });

//     const data = Object.entries(totalScreenTimes).map(([email, total]) => ({
//       user_email: email,
//       screen_time_minutes: Number(total.toFixed(2)),
//       recorded_at: results.find((r) => r.user_email === email)?.recorded_at || null,
//     }));

//     res.json({ success: true, data });
//   });
// });

// export default router;
import express from "express";
import db from "../db.js";

const router = express.Router();

/* ================================
 📺 1️⃣ ADD WATCH HISTORY
================================ */
router.post("/add", (req, res) => {
  const { user_id, video_title, genre, duration_minutes } = req.body;

  if (!user_id || !video_title) {
    return res.status(400).json({
      success: false,
      message: "Missing user_id or video_title",
    });
  }

  const query = `
    INSERT INTO watch_history (user_id, video_title, genre, duration_minutes, watched_at)
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(
    query,
    [user_id, video_title, genre || "Unknown", duration_minutes || null],
    (err) => {
      if (err) {
        console.error("❌ Watch insert error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database insert error" });
      }

      res.json({ success: true, message: "Watch saved successfully!" });
    }
  );
});

/* ================================
 📜 2️⃣ GET ALL WATCH HISTORY
================================ */
router.get("/all", (req, res) => {
  const query = `
    SELECT 
      w.id,
      w.user_id,
      u.email AS user_email,
      w.video_title,
      w.genre,
      w.duration_minutes,
      w.watched_at
    FROM watch_history w
    LEFT JOIN users u ON w.user_id = u.id
    ORDER BY w.watched_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Fetch error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch history" });
    }

    res.json({ success: true, data: results });
  });
});

/* ================================
 🕒 3️⃣ ADD SCREEN TIME
  - Expects minutes (float). Frontend converts seconds->minutes before sending.
================================ */
router.post("/screen-time", (req, res) => {
  const { user_id, screen_time_minutes } = req.body;

  if (!user_id || screen_time_minutes == null) {
    return res.status(400).json({
      success: false,
      message: "Missing user_id or screen_time_minutes",
    });
  }

  const query = `
    INSERT INTO screen_time (user_id, screen_time_minutes, recorded_at)
    VALUES (?, ?, NOW())
  `;

  db.query(query, [user_id, screen_time_minutes], (err) => {
    if (err) {
      console.error("❌ Screen time insert error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Insert failed" });
    }

    res.json({ success: true, message: "Screen time saved!" });
  });
});

/* ================================
 📊 4️⃣ GET SCREEN TIME TOTAL (per user)
  - NOTE: returns field `screen_time_minutes` (SUM) to match frontend expectations
================================ */
router.get("/screen-time/all", (req, res) => {
  const query = `
    SELECT 
      s.user_id,
      u.email AS user_email,
      ROUND(SUM(s.screen_time_minutes), 2) AS screen_time_minutes
    FROM screen_time s
    LEFT JOIN users u ON s.user_id = u.id
    GROUP BY s.user_id
    ORDER BY screen_time_minutes DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Fetch error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Fetch failed" });
    }

    res.json({ success: true, data: results });
  });
});

export default router;
