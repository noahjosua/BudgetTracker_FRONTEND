import {Category} from "./category";

export interface Income {
  id?: number;
  datePlanned: string;
  category: Category;
  description: string;
  amount: number;
  type?: string;
}
