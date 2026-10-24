import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import {
  addLoan,
  getLoans,
  markRepaid,
  getSummary
} from "./loan.controller";

const router = Router();

router.use(requireAuth);

router.get("/", getLoans);
router.post("/", addLoan);
router.get("/summary", getSummary);
router.patch("/:id/repay", markRepaid);

export default router;