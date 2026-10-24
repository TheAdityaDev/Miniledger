import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { uploadImage } from "./file.controller";
import { imageUpload } from "./file.service";

const router = Router();

router.use(requireAuth);

router.post("/upload", imageUpload.single("image"), uploadImage);

export default router;