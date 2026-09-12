import pool from "../config/db.js";

export async function householdStatistics(req, res) {
  const householdId = req.params.householdId;

  const summary = await pool.query(
    `SELECT
       COUNT(*) AS assigned,
       COUNT(*) FILTER (WHERE status = 'done') AS completed,
       COUNT(*) FILTER (WHERE status = 'pending') AS pending
     FROM assignments WHERE household_id = $1
       AND created_at > now() - interval '7 days'`,
    [householdId]
  );

  const byMember = await pool.query(
    `SELECT u.name,
       COUNT(a.id) AS total,
       COUNT(a.id) FILTER (WHERE a.status = 'done') AS completed
     FROM household_members m
     JOIN users u ON u.id = m.user_id
     LEFT JOIN assignments a ON a.user_id = u.id AND a.household_id = m.household_id
     WHERE m.household_id = $1
     GROUP BY u.name
     ORDER BY total DESC`,
    [householdId]
  );

  const byDay = await pool.query(
    `SELECT to_char(completed_at, 'Dy') AS day, COUNT(*) AS completed
     FROM assignments
     WHERE household_id = $1 AND status = 'done' AND completed_at > now() - interval '7 days'
     GROUP BY day, date_trunc('day', completed_at)
     ORDER BY date_trunc('day', completed_at)`,
    [householdId]
  );

  const row = summary.rows[0];
  const rate = row.assigned > 0 ? Math.round((row.completed / row.assigned) * 100) : 0;

  res.json({
    summary: { ...row, rate },
    byMember: byMember.rows,
    byDay: byDay.rows,
  });
}

export async function myStatistics(req, res) {
  const { rows } = await pool.query(
    `SELECT h.name AS household_name,
       COUNT(a.id) AS total,
       COUNT(a.id) FILTER (WHERE a.status = 'done') AS completed
     FROM assignments a
     JOIN households h ON h.id = a.household_id
     WHERE a.user_id = $1
     GROUP BY h.name`,
    [req.user.id]
  );
  res.json({ statistics: rows });
}