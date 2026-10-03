import { Router } from "express";
import { protect, requireRole } from "../middleware/auth.js";
import { createJob, listJobs, getJob, myJobs, setJobStatus, deleteJob } from "../controllers/jobController.js";

const router = Router();

router.get("/", listJobs);
router.get("/mine", protect, requireRole("employer"), myJobs);
router.get("/:id", getJob);

router.post("/", protect, requireRole("employer"), createJob);
router.patch("/:id/status", protect, requireRole("employer"), setJobStatus);
router.delete("/:id", protect, requireRole("employer"), deleteJob);

export default router;