export type Expense = {
  id?: string
  uid: string
  amount: number
  category: string
  description: string
  createdAt: any // Can be Timestamp (from Firestore) or Date
  isRecurring?: boolean
  receiptUrl?: string
}
