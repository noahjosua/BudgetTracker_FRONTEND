export interface Expense {
  id?: number;
  datePlanned: Date;
  dateCreated: Date;
  category: string;
  description: string;
  amount: number;
  type?: string;
}
