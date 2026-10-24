import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  OTP_EXPIRY_MINUTES: z.coerce.number().int().positive().default(5),
  NODE_ENV: z.enum([
    "development",
    "test",
    "production"
  ]).default("development")
});

export const env = envSchema.parse(process.env);