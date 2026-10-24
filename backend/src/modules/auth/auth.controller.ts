import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { requestOtp, verifyOtp } from "./auth.service";

const phoneSchema = z
  .string()
  .regex(
    /^\+[1-9]\d{7,14}$/,
    "Enter a phone number with country code, e.g. +919876543210",
  );

const verifySchema = z.object({
  phone: phoneSchema,
  otp: z.string().regex(/^\d{6}$/, "OTP must be six digits"),
});

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const parsedPhone = phoneSchema.safeParse(req.body.phone);

    if (!parsedPhone.success) {
      res.status(400).json({
        message: parsedPhone.error.issues[0].message,
      });
      return;
    }

    const result = await requestOtp(parsedPhone.data);

    res.json({result, message: result.message});
  } catch (error) {
    next(error);
  }
}

export async function verifyLogin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = verifySchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        message: parsed.error.issues[0].message,
      });
      return;
    }

    const result = await verifyOtp(parsed.data.phone, parsed.data.otp);

    const cookieToken = result.token.replace(/^Bearer\s+/i, "").trim();

    res.cookie("token", cookieToken, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict", 
      maxAge: 24 * 60 * 60 * 1000, 
    });

    res.json({ ...result, token: cookieToken });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("OTP") || error.message.includes("attempts"))
    ) {
      res.status(401).json({ message: error.message });
      return;
    }

    next(error);
  }
}
