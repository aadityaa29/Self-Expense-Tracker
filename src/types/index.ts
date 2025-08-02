import { Timestamp } from "firebase/firestore";

export type Expense = {
  id?: string;
  uid: string;
  amount: number;
  category: string;
  description: string;
  createdAt: Timestamp;
  isRecurring?: boolean;
  receiptUrl?: string;
};
