import {Category} from "./category";

export interface Expense {
  id?: number;
  datePlanned: Date;
  dateCreated: Date;
  category: Category;
  description: string;
  amount: number;
  type?: string;
}
