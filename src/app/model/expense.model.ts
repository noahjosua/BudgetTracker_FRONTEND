import {Category} from "./category";

export interface Expense {
  id?: number;
  datePlanned: string;
  category: Category;
  description: string;
  amount: number;
  type?: string;
}
