import { pool } from "../../db/pool";

export interface CreateLoanInput {
  friendName: string;
  amount: number;
  dueDate: string;
}

export async function createLoan(
  userId: string,
  input: CreateLoanInput
) {
  const result = await pool.query(
    `INSERT INTO loans (user_id, friend_name, amount, due_date)
     VALUES ($1, $2, $3, $4)
     RETURNING id, friend_name AS "friendName",
       amount::numeric AS amount, due_date AS "dueDate",
       is_repaid AS "isRepaid", repaid_at AS "repaidAt",
       receipt_path AS "receiptPath", created_at AS "createdAt"`,
    [userId, input.friendName, input.amount, input.dueDate]
  );

  return result.rows[0];
}

export async function listLoans(userId: string) {
  const result = await pool.query(
    `SELECT id, friend_name AS "friendName",
       amount::numeric AS amount, due_date AS "dueDate",
       is_repaid AS "isRepaid", repaid_at AS "repaidAt",
       receipt_path AS "receiptPath", created_at AS "createdAt",
       (NOT is_repaid AND due_date < CURRENT_DATE) AS overdue
     FROM loans
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
}

export async function repayLoan(userId: string, loanId: string) {
  const result = await pool.query(
    `UPDATE loans
     SET is_repaid = TRUE, repaid_at = NOW()
     WHERE id = $1 AND user_id = $2 AND is_repaid = FALSE
     RETURNING id, friend_name AS "friendName",
       amount::numeric AS amount, due_date AS "dueDate",
       is_repaid AS "isRepaid", repaid_at AS "repaidAt"`,
    [loanId, userId]
  );

  return result.rows[0] ?? null;
}

export async function getLoanSummary(userId: string) {
  const result = await pool.query(
    `SELECT
       COALESCE(SUM(amount), 0)::numeric AS "totalLent",
       COALESCE(
         SUM(amount) FILTER (WHERE is_repaid = TRUE), 0
       )::numeric AS "totalRepaid",
       COALESCE(
         SUM(amount) FILTER (
           WHERE is_repaid = FALSE AND due_date < CURRENT_DATE
         ), 0
       )::numeric AS "overdueAmount",
       COALESCE(
         SUM(amount) FILTER (WHERE is_repaid = FALSE), 0
       )::numeric AS "outstandingAmount"
     FROM loans
     WHERE user_id = $1`,
    [userId]
  );

  return result.rows[0];
}