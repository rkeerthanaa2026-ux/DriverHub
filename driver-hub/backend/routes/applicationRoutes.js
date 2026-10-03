import { Router } from "express";
import { protect, requireRole } from "../middleware/auth.js";
import { apply, mine, forEmployer, withdraw, listAll, setStatus } from "../controllers/applicationController.js";

const router = Router();

router.get("/mine", protect, requireRole("candidate"), mine);
router.get("/employer", protect, requireRole("employer"), forEmployer);
router.post("/", protect, requireRole("candidate"), apply);
router.delete("/:id", protect, requireRole("candidate"), withdraw);

router.get("/", protect, requireRole("admin"), listAll);
router.patch("/:id/status", protect, requireRole("admin", "employer"), setStatus);

export default router;