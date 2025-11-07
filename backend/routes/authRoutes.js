
import express from "express";
import db from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { exec } from "child_process";

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)`;

    db.query(query, [full_name, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY")
          return res.status(400).json({ message: "Email already registered" });
        return res.status(500).json({ message: "Database error" });
      }

      // Auto-run churn
      exec("curl http://localhost:5000/api/admin/run-churn", (err, stdout, stderr) => {
        if (err) console.error("⚠️ Auto churn update failed:", stderr || err.message);
      });

      const token = jwt.sign({ id: result.insertId, email }, "secretkey123");

      res.json({ success: true, token, userId: result.insertId });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id, email: user.email }, "secretkey123");
    res.json({ success: true, token, userId: user.id });
  });
});

export default router;
