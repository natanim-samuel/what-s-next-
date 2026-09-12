import pool from "../config/db.js";
import { suggestDistribution, confirmDistribution } from "../services/distributionService.js";

export async function runDistribution(req, res) {
  const { choreIds } = req.body;
  let ids = choreIds;
  if (!ids || ids.length === 0) {
    // default: all chores that currently have no pending assignment
    const { rows } = await pool.query(
      `SELECT c.id FROM chores c
       WHERE c.household_id = $1
       AND NOT EXISTS (
         SELECT 1 FROM assignments a WHERE a.chore_id = c.id AND a.status = 'pending'
       )`,
      [req.params.householdId]
    );
    ids = rows.map((r) => r.id);
  }
  if (ids.length === 0) {
    return res.status(400).json({ error: "No open chores to distribute right now." });
  }

  const result = await suggestDistribution(req.params.householdId, ids);
  res.json(result);
}

export async function confirmDistributionRoute(req, res) {
  const { assignments, roundLabel } = req.body;
  if (!assignments || assignments.length === 0) {
    return res.status(400).json({ error: "Nothing to confirm." });
  }
  const created = await confirmDistribution(
    req.params.householdId,
    assignments,
    roundLabel || `Week of ${new Date().toLocaleDateString()}`
  );
  res.status(201).json({ assignments: created });
}