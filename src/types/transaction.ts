
export interface TransactionType {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: Date;
  bookId?: string;
  userId: string;
}
