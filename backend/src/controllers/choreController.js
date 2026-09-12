import pool from "../config/db.js";

export async function listChores(req, res) {
  const { rows } = await pool.query(
    `SELECT c.*,
       (SELECT json_build_object('id', a.id, 'user_id', a.user_id, 'status', a.status, 'due_date', a.due_date)
        FROM assignments a WHERE a.chore_id = c.id ORDER BY a.created_at DESC LIMIT 1) AS latest_assignment
     FROM chores c
     WHERE c.household_id = $1
     ORDER BY c.created_at DESC`,
    [req.params.householdId]
  );
  res.json({ chores: rows });
}

export async function createChore(req, res) {
  const { title, description, category, difficulty, priority, frequency, estMinutes } = req.body;
  if (!title) return res.status(400).json({ error: "Give the chore a title." });

  const { rows } = await pool.query(
    `INSERT INTO chores (household_id, title, description, category, difficulty, priority, frequency, est_minutes, created_by)
     VALUES ($1, $2, $3, $4, COALESCE($5, 'medium'), COALESCE($6, 'medium'), COALESCE($7, 'weekly'), COALESCE($8, 30), $9)
     RETURNING *`,
    [
      req.params.householdId,
      title,
      description || null,
      category || null,
      difficulty,
      priority,
      frequency,
      estMinutes,
      req.user.id,
    ]
  );
  res.status(201).json({ chore: rows[0] });
}

export async function getChore(req, res) {
  const { rows } = await pool.query(`SELECT * FROM chores WHERE id = $1`, [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: "Chore not found." });
  res.json({ chore: rows[0] });
}

export async function updateChore(req, res) {
  const { title, description, category, difficulty, priority, frequency, estMinutes } = req.body;
  const { rows } = await pool.query(
    `UPDATE chores SET
       title = COALESCE($1, title),
       description = COALESCE($2, description),
       category = COALESCE($3, category),
       difficulty = COALESCE($4, difficulty),
       priority = COALESCE($5, priority),
       frequency = COALESCE($6, frequency),
       est_minutes = COALESCE($7, est_minutes)
     WHERE id = $8
     RETURNING *`,
    [title, description, category, difficulty, priority, frequency, estMinutes, req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: "Chore not found." });
  res.json({ chore: rows[0] });
}

export async function deleteChore(req, res) {
  await pool.query(`DELETE FROM chores WHERE id = $1`, [req.params.id]);
  res.status(204).end();
}