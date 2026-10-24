import type { Request, Response, NextFunction } from "express";
import { getUploadedImage } from "../file/file.service";

export function uploadImage(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("Uploaded file:", req.file);
    console.log("Request body:", req.body);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image to upload",
      });
    }

    const file = getUploadedImage(req.file);

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: file,
    });
  } catch (error) {
    next(error);
  }
}
