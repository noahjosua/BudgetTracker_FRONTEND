import {Expense} from './model/expense.model';
import {Income} from './model/income.model';
import {Category} from "./model/category";
import {EXPENSE, INCOME} from "./constants";

const mockExpenses: Expense[] = [
  {
    id: 1,
    datePlanned: "22.05.2024",
    category: Category.FREE_TIME,
    description: "Bubble-tea",
    amount: 5.0,
    type: EXPENSE
  },
  {
    id: 2,
    datePlanned: "01.06.2024",
    category: Category.RENT,
    description: "",
    amount: 300.0,
    type: EXPENSE
  },
  {
    id: 1,
    datePlanned: "05.06.2024",
    category: Category.SUBSCRIPTIONS,
    description: "Netflix",
    amount: 6.99,
    type: EXPENSE
  }
];

const mockIncome: Income[] = [
  {
    id: 3,
    datePlanned: "02.06.2024",
    category: Category.SALARY,
    description: "Salary for the Month of May",
    amount: 538.0,
    type: INCOME
  },
  {
    id: 1,
    datePlanned: "18.05.2024",
    category: Category.POCKET_MONEY,
    description: "",
    amount: 200.0,
    type: INCOME
  }
];

export const mock_income_and_expenses = [...mockExpenses, ...mockIncome];
