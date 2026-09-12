import pool from "../config/db.js";

const DIFFICULTY_WEIGHT = { easy: 1, medium: 2, hard: 3 };

/**
 * Suggests assignments for a household's open chores, balancing:
 *  - current workload (sum of difficulty points already assigned & pending)
 *  - rotation (avoid the same person doing the same chore as last time)
 *  - difficulty (heavier chores nudge toward whoever is currently lighter-loaded)
 * Pure function against DB snapshots - does not write anything.
 */
export async function suggestDistribution(householdId, choreIds) {
  const membersRes = await pool.query(
    `SELECT u.id, u.name FROM household_members m JOIN users u ON u.id = m.user_id
     WHERE m.household_id = $1`,
    [householdId]
  );
  const members = membersRes.rows;
  if (members.length === 0) {
    const err = new Error("no members");
    err.publicMessage = "Add household members before distributing chores.";
    err.status = 400;
    throw err;
  }

  const choresRes = await pool.query(
    `SELECT * FROM chores WHERE household_id = $1 AND id = ANY($2::int[])`,
    [householdId, choreIds]
  );
  const chores = choresRes.rows;

  // current workload: sum of difficulty points on pending assignments
  const workloadRes = await pool.query(
    `SELECT a.user_id, COALESCE(SUM(
        CASE c.difficulty WHEN 'easy' THEN 1 WHEN 'medium' THEN 2 WHEN 'hard' THEN 3 ELSE 2 END
      ), 0) AS points
     FROM assignments a
     JOIN chores c ON c.id = a.chore_id
     WHERE a.household_id = $1 AND a.status = 'pending'
     GROUP BY a.user_id`,
    [householdId]
  );
  const workload = {};
  members.forEach((m) => (workload[m.id] = 0));
  workloadRes.rows.forEach((r) => (workload[r.user_id] = Number(r.points)));

  // last assignee per chore, to avoid repeats
  const lastAssigneeRes = await pool.query(
    `SELECT DISTINCT ON (chore_id) chore_id, user_id
     FROM assignments
     WHERE household_id = $1
     ORDER BY chore_id, created_at DESC`,
    [householdId]
  );
  const lastAssignee = {};
  lastAssigneeRes.rows.forEach((r) => (lastAssignee[r.chore_id] = r.user_id));

  // heavier chores first, so they land on whoever is currently least loaded
  const sortedChores = [...chores].sort(
    (a, b) => DIFFICULTY_WEIGHT[b.difficulty] - DIFFICULTY_WEIGHT[a.difficulty]
  );

  const runningLoad = { ...workload };
  const assignments = [];

  for (const chore of sortedChores) {
    const points = DIFFICULTY_WEIGHT[chore.difficulty] || 2;
    let candidates = members.filter((m) => m.id !== lastAssignee[chore.id]);
    if (candidates.length === 0) candidates = members;

    candidates.sort((a, b) => runningLoad[a.id] - runningLoad[b.id]);
    const chosen = candidates[0];
    runningLoad[chosen.id] += points;

    assignments.push({
      choreId: chore.id,
      choreTitle: chore.title,
      difficulty: chore.difficulty,
      userId: chosen.id,
      userName: chosen.name,
    });
  }

  return { assignments, finalLoad: runningLoad, members };
}

export async function confirmDistribution(householdId, assignments, roundLabel) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const created = [];
    for (const a of assignments) {
      const { rows } = await client.query(
        `INSERT INTO assignments (household_id, chore_id, user_id, round_label)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [householdId, a.choreId, a.userId, roundLabel]
      );
      created.push(rows[0]);
    }
    await client.query("COMMIT");
    return created;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}