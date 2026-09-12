import pool from "../config/db.js";
import { generateInviteCode } from "../utils/inviteCode.js";

export async function createHousehold(req, res) {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Give your household a name." });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const inviteCode = generateInviteCode();
    const { rows } = await client.query(
      `INSERT INTO households (name, invite_code, owner_id) VALUES ($1, $2, $3) RETURNING *`,
      [name, inviteCode, req.user.id]
    );
    const household = rows[0];
    await client.query(
      `INSERT INTO household_members (household_id, user_id, role) VALUES ($1, $2, 'owner')`,
      [household.id, req.user.id]
    );
    await client.query("COMMIT");
    res.status(201).json({ household });
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function listMyHouseholds(req, res) {
  const { rows } = await pool.query(
    `SELECT h.*, m.role FROM households h
     JOIN household_members m ON m.household_id = h.id
     WHERE m.user_id = $1
     ORDER BY h.created_at DESC`,
    [req.user.id]
  );
  res.json({ households: rows });
}

export async function getHousehold(req, res) {
  const { rows } = await pool.query(`SELECT * FROM households WHERE id = $1`, [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: "Household not found." });
  res.json({ household: rows[0] });
}

export async function updateHousehold(req, res) {
  const { name } = req.body;
  const { rows } = await pool.query(
    `UPDATE households SET name = COALESCE($1, name) WHERE id = $2 RETURNING *`,
    [name, req.params.id]
  );
  res.json({ household: rows[0] });
}

export async function deleteHousehold(req, res) {
  await pool.query(`DELETE FROM households WHERE id = $1`, [req.params.id]);
  res.status(204).end();
}

export async function joinHousehold(req, res) {
  const { inviteCode } = req.body;
  if (!inviteCode) return res.status(400).json({ error: "Enter an invitation code." });

  const { rows } = await pool.query(`SELECT * FROM households WHERE invite_code = $1`, [inviteCode]);
  const household = rows[0];
  if (!household) return res.status(404).json({ error: "That code doesn't match a household." });

  const existing = await pool.query(
    `SELECT id FROM household_members WHERE household_id = $1 AND user_id = $2`,
    [household.id, req.user.id]
  );
  if (existing.rows.length > 0) {
    return res.status(409).json({ error: "You're already in this household." });
  }

  await pool.query(
    `INSERT INTO household_members (household_id, user_id, role) VALUES ($1, $2, 'member')`,
    [household.id, req.user.id]
  );
  res.status(201).json({ household });
}

export async function listMembers(req, res) {
  const { rows } = await pool.query(
    `SELECT u.id, u.name, u.email, m.role, m.joined_at,
       COUNT(a.id) FILTER (WHERE a.status = 'done') AS completed_chores
     FROM household_members m
     JOIN users u ON u.id = m.user_id
     LEFT JOIN assignments a ON a.user_id = u.id AND a.household_id = m.household_id
     WHERE m.household_id = $1
     GROUP BY u.id, m.role, m.joined_at
     ORDER BY m.joined_at ASC`,
    [req.params.householdId]
  );
  res.json({ members: rows });
}

export async function updateMemberRole(req, res) {
  const { role } = req.body;
  if (!["admin", "member"].includes(role)) {
    return res.status(400).json({ error: "Role must be admin or member." });
  }
  const { rows } = await pool.query(
    `UPDATE household_members SET role = $1 WHERE household_id = $2 AND user_id = $3 RETURNING *`,
    [role, req.params.householdId, req.params.userId]
  );
  res.json({ member: rows[0] });
}

export async function removeMember(req, res) {
  await pool.query(
    `DELETE FROM household_members WHERE household_id = $1 AND user_id = $2`,
    [req.params.householdId, req.params.userId]
  );
  res.status(204).end();
}