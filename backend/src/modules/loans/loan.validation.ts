import { z } from "zod";

export const createLoanSchema = z.object({
  friendName: z.string().trim().min(1).max(100),
  amount: z.number().finite().positive().max(1000000.99),
  dueDate: z.string().regex(
    /^\d{4}-\d{2}-\d{2}$/,
    "Due date must use YYYY-MM-DD format"
  ).refine((date) => {
    const parsed = new Date(`${date}T00:00:00.000Z`);

    return !Number.isNaN(parsed.getTime()) &&
      parsed.toISOString().slice(0, 10) === date;
  }, "Invalid calendar date")
});