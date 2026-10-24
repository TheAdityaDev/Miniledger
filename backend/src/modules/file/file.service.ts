
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { MAX_FILE_SIZE, validateImageFile } from "../file/file.validation";

const uploadDir = path.resolve("uploads/receipts");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDir);
  },

  filename: (_req, file, callback) => {
    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    callback(null, `${crypto.randomUUID()}${extension}`);
  },
});

export const imageUpload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },

  fileFilter: (_req, file, callback) => {
    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    const allowed = validateImageFile({
      ...file,
      fieldname: file.fieldname,
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
    } as Express.Multer.File);

    if (!allowed) {
      return callback(
        new Error("Only JPG, PNG, and WEBP images are allowed")
      );
    }

    callback(null, true);
  },
});

export function getUploadedImage(file: Express.Multer.File) {
  return {
    filename: file.filename,
    path: `/uploads/receipts/${file.filename}`,
    size: file.size,
    mimeType: file.mimetype,
  };
}
