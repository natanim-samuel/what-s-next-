import { Router } from "express";
import { requireAuth, requireHouseholdMember } from "../middleware/auth.js";
import {
  listAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignmentController.js";
import {
  runDistribution,
  confirmDistributionRoute,
} from "../controllers/distributionController.js";
import { householdStatistics, myStatistics } from "../controllers/statisticsController.js";

const router = Router();
router.use(requireAuth);

router.get("/households/:householdId/assignments", requireHouseholdMember, listAssignments);
router.post("/households/:householdId/assignments", requireHouseholdMember, createAssignment);
router.put("/assignments/:id", updateAssignment);
router.delete("/assignments/:id", deleteAssignment);

router.post("/households/:householdId/distribute", requireHouseholdMember, runDistribution);
router.post(
  "/households/:householdId/distribute/confirm",
  requireHouseholdMember,
  confirmDistributionRoute
);

router.get("/households/:householdId/statistics", requireHouseholdMember, householdStatistics);
router.get("/users/me/statistics", myStatistics);

export default router;