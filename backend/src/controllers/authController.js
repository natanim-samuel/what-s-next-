import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { signToken } from "../utils/jwt.js";

export async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are all required." });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }

  const existing = await pool.query(`SELECT id FROM users WHERE email = $1`, [email.toLowerCase()]);
  if (existing.rows.length > 0) {
    return res.status(409).json({ error: "That email's already registered." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name, email.toLowerCase(), passwordHash]
  );
  const user = rows[0];
  const token = signToken({ sub: user.id, email: user.email });
  res.status(201).json({ token, user });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Enter your email and password." });
  }

  const { rows } = await pool.query(`SELECT * FROM users WHERE email = $1`, [email.toLowerCase()]);
  const user = rows[0];
  if (!user) {
    return res.status(401).json({ error: "That email or password isn't right." });
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return res.status(401).json({ error: "That email or password isn't right." });
  }

  const token = signToken({ sub: user.id, email: user.email });
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, created_at: user.created_at },
  });
}

export async function me(req, res) {
  const { rows } = await pool.query(
    `SELECT id, name, email, created_at FROM users WHERE id = $1`,
    [req.user.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: "User not found." });
  res.json({ user: rows[0] });
}
