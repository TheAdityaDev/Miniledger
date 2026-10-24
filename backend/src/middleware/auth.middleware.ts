import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        phone: string;
      };
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization?.trim();
  const cookieToken = req.headers.cookie
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("token="))
    ?.slice("token=".length);
  const suppliedToken = authorization
    ? authorization.startsWith("Bearer ")
      ? authorization.slice("Bearer ".length).trim()
      : null
    : cookieToken
      ? decodeURIComponent(cookieToken)
      : null;

  if (!suppliedToken) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  try {
    req.user = verifyToken(suppliedToken);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
