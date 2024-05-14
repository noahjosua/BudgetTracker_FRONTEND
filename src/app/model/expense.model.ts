export interface Expense {
  id?: number;
  datePlanned: string;
  category: string;
  description: string;
  amount: number;
  type?: string;
}
