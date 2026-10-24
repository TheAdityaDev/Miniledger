import {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction
} from "express";

export const notFound = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.path}`
  });
};

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
) => {
  console.error(error);

  res.status(500).json({
    message: "Internal server error"
  });
};  