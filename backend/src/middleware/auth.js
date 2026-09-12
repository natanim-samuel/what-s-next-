import { verifyToken } from "../utils/jwt.js";
import pool from "../config/db.js";

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authenticated. Log in and try again." });
  }
  try {
    const token = header.slice(7);
    const payload = verifyToken(token);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: "Your session expired. Log in again." });
  }
}

// Attaches req.membership for the household in the route param :householdId
export async function requireHouseholdMember(req, res, next) {
  const householdId = req.params.householdId || req.params.id || req.body.householdId;
  if (!householdId) return res.status(400).json({ error: "Missing household." });
  const { rows } = await pool.query(
    `SELECT * FROM household_members WHERE household_id = $1 AND user_id = $2`,
    [householdId, req.user.id]
  );
  if (rows.length === 0) {
    return res.status(403).json({ error: "You're not a member of this household." });
  }
  req.membership = rows[0];
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.membership || !roles.includes(req.membership.role)) {
      return res.status(403).json({ error: "You don't have permission to do that." });
    }
    next();
  };
}