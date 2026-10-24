
import path from "path";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export function validateImageFile(
  file: Express.Multer.File
): boolean {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  return (
    ALLOWED_MIME_TYPES.includes(file.mimetype) &&
    ALLOWED_EXTENSIONS.includes(extension)
  );
}
