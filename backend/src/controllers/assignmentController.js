import pool from "../config/db.js";

export async function listAssignments(req, res) {
  const { status, userId, mine } = req.query;
  const conditions = [`a.household_id = $1`];
  const params = [req.params.householdId];

  if (status) {
    params.push(status);
    conditions.push(`a.status = $${params.length}`);
  }
  const effectiveUserId = mine === "true" ? req.user.id : userId;
  if (effectiveUserId) {
    params.push(effectiveUserId);
    conditions.push(`a.user_id = $${params.length}`);
  }

  const { rows } = await pool.query(
    `SELECT a.*, c.title AS chore_title, c.category, c.difficulty, c.priority, c.est_minutes,
            u.name AS assignee_name
     FROM assignments a
     JOIN chores c ON c.id = a.chore_id
     JOIN users u ON u.id = a.user_id
     WHERE ${conditions.join(" AND ")}
     ORDER BY a.due_date NULLS LAST, a.created_at DESC`,
    params
  );
  res.json({ assignments: rows });
}

export async function createAssignment(req, res) {
  const { choreId, userId, dueDate, roundLabel } = req.body;
  if (!choreId || !userId) {
    return res.status(400).json({ error: "Pick a chore and a person to assign it to." });
  }
  const { rows } = await pool.query(
    `INSERT INTO assignments (household_id, chore_id, user_id, due_date, round_label)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [req.params.householdId, choreId, userId, dueDate || null, roundLabel || null]
  );
  res.status(201).json({ assignment: rows[0] });
}

export async function updateAssignment(req, res) {
  const { status, dueDate } = req.body;
  const { rows } = await pool.query(
    `UPDATE assignments SET
       status = COALESCE($1, status),
       due_date = COALESCE($2, due_date),
       completed_at = CASE WHEN $1 = 'done' THEN now() ELSE completed_at END
     WHERE id = $3
     RETURNING *`,
    [status, dueDate, req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: "Assignment not found." });
  res.json({ assignment: rows[0] });
}

export async function deleteAssignment(req, res) {
  await pool.query(`DELETE FROM assignments WHERE id = $1`, [req.params.id]);
  res.status(204).end();
}