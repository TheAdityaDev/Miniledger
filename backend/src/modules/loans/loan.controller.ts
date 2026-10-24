import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  createLoan,
  listLoans,
  repayLoan,
  getLoanSummary,
} from "./loan.service";
import { createLoanSchema } from "./loan.validation";

const idSchema = z.string().uuid();

export async function addLoan(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createLoanSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        message: parsed.error.issues[0].message,
      });
      return;
    }

    const loan = await createLoan(req.user!.userId, parsed.data);
    res.status(201).json(loan);
  } catch (error) {
    next(error);
  }
}

export async function getLoans(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.json(await listLoans(req.user!.userId));
  } catch (error) {
    next(error);
  }
}

export async function markRepaid(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsedId = idSchema.safeParse(req.params.id);

    if (!parsedId.success) {
      res.status(400).json({ message: "Invalid loan ID" });
      return;
    }

    const loan = await repayLoan(req.user!.userId, parsedId.data);

    if (!loan) {
      res.status(404).json({
        message: "Loan not found or already repaid",
      });
      return;
    }

    res.json(loan);
  } catch (error) {
    next(error);
  }
}

export async function getSummary(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.json(await getLoanSummary(req.user!.userId));
  } catch (error) {
    next(error);
  }
}
