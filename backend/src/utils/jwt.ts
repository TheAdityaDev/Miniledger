import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthTokenPayload {
  userId: string;
  phone: string;
}

export function createToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "1d"
  });
}

export function verifyToken(token: string): AuthTokenPayload {
  const payload = jwt.verify(token, env.JWT_SECRET);

  if (
    typeof payload === "string" ||
    typeof payload.userId !== "string" ||
    typeof payload.phone !== "string"
  ) {
    throw new Error("Invalid authentication token");
  }

  return {
    userId: payload.userId,
    phone: payload.phone
  };
}