import { Router } from "express";
import pool from "../config/db.js";
import { requireAuth, requireHouseholdMember } from "../middleware/auth.js";
import {
  listChores,
  createChore,
  getChore,
  updateChore,
  deleteChore,
} from "../controllers/choreController.js";

const router = Router();
router.use(requireAuth);

// Nested under households
router.get("/households/:householdId/chores", requireHouseholdMember, listChores);
router.post("/households/:householdId/chores", requireHouseholdMember, createChore);

// Standalone chore access - resolve household membership from the chore itself
async function requireChoreAccess(req, res, next) {
  const { rows } = await pool.query(`SELECT household_id FROM chores WHERE id = $1`, [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: "Chore not found." });
  req.params.householdId = rows[0].household_id;
  requireHouseholdMember(req, res, next);
}

router.get("/chores/:id", requireChoreAccess, getChore);
router.put("/chores/:id", requireChoreAccess, updateChore);
router.delete("/chores/:id", requireChoreAccess, deleteChore);

export default router;