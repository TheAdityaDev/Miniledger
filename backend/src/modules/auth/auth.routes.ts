import { Router } from "express";
import { login, verifyLogin } from "./auth.controller";

const router = Router();

router.post("/login", login);
router.post("/verify-otp", verifyLogin);

export default router;