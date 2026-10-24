import { randomInt } from "crypto";
import bcrypt from "bcryptjs";
import { pool } from "../../db/pool";
import { env } from "../../config/env";
import { createToken } from "../../utils/jwt";

interface OtpRecord {
  hash: string;
  expiresAt: number;
  attempts: number;
}

const otpStore = new Map<string, OtpRecord>();

export async function requestOtp(phone: string) {
  const otp = randomInt(0, 1_000_000).toString().padStart(6, "0");
  const hash = await bcrypt.hash(otp, 10);

  otpStore.set(phone, {
    hash,
    expiresAt: Date.now() + env.OTP_EXPIRY_MINUTES * 60_000,
    attempts: 0,
  });

  if (env.NODE_ENV !== "production") {
    console.log(`[MiniLedger] Mock OTP for ${phone}: ${otp}`);
  }

  return { message: `[MiniLedger] Mock OTP for ${phone}: ${otp}` };
}

export async function verifyOtp(phone: string, otp: string) {
  const record = otpStore.get(phone);

  if (!record || Date.now() > record.expiresAt) {
    otpStore.delete(phone);
    throw new Error("OTP is invalid or expired");
  }

  if (record.attempts >= 5) {
    otpStore.delete(phone);
    throw new Error("Too many OTP attempts. Request a new OTP.");
  }

  record.attempts += 1;

  if (!(await bcrypt.compare(otp, record.hash))) {
    throw new Error("OTP is invalid or expired");
  }

  otpStore.delete(phone);

  const result = await pool.query(
    `INSERT INTO users (phone)
     VALUES ($1)
     ON CONFLICT (phone)
     DO UPDATE SET phone = EXCLUDED.phone
     RETURNING id, phone`,
    [phone],
  );

  const user = result.rows[0];
  const token = createToken({
    userId: user.id,
    phone: user.phone,
  });

  return {
    token,
    user: {
      id: user.id,
      phone: user.phone,
    },
  };
}
