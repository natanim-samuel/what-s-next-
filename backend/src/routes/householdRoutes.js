import { Router } from "express";
import { requireAuth, requireHouseholdMember, requireRole } from "../middleware/auth.js";
import {
  createHousehold,
  listMyHouseholds,
  getHousehold,
  updateHousehold,
  deleteHousehold,
  joinHousehold,
  listMembers,
  updateMemberRole,
  removeMember,
} from "../controllers/householdController.js";

const router = Router();

router.use(requireAuth);

router.post("/", createHousehold);
router.get("/", listMyHouseholds);
router.post("/join", joinHousehold);

router.get("/:id", requireHouseholdMember, getHousehold);
router.put("/:id", requireHouseholdMember, requireRole("owner", "admin"), updateHousehold);
router.delete("/:id", requireHouseholdMember, requireRole("owner"), deleteHousehold);

router.get("/:householdId/members", requireHouseholdMember, listMembers);
router.put(
  "/:householdId/members/:userId",
  requireHouseholdMember,
  requireRole("owner"),
  updateMemberRole
);
router.delete(
  "/:householdId/members/:userId",
  requireHouseholdMember,
  requireRole("owner", "admin"),
  removeMember
);

export default router;