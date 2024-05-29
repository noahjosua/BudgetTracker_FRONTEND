import {Expense} from './model/expense.model';
import {Income} from './model/income.model';
import {Category} from "./model/category";
import {EXPENSE, INCOME} from "./constants";

const mockExpenses: Expense[] = [
  {
    id: 1,
    datePlanned: parseDate("22.05.2024"),
    dateCreated: parseDate("29.05.2024"),
    category: Category.FREE_TIME,
    description: "Bubble-tea",
    amount: 5.0,
    type: EXPENSE
  },
  {
    id: 2,
    datePlanned: parseDate("01.06.2024"),
    dateCreated: parseDate("29.05.2024"),
    category: Category.RENT,
    description: "",
    amount: 300.0,
    type: EXPENSE
  },
  {
    id: 1,
    datePlanned: parseDate("05.06.2024"),
    dateCreated: parseDate("29.05.2024"),
    category: Category.SUBSCRIPTIONS,
    description: "Netflix",
    amount: 6.99,
    type: EXPENSE
  }
];

const mockIncome: Income[] = [
  {
    id: 3,
    datePlanned: parseDate("02.06.2024"),
    dateCreated: parseDate("29.05.2024"),
    category: Category.SALARY,
    description: "Salary for the Month of May",
    amount: 538.0,
    type: INCOME
  },
  {
    id: 1,
    datePlanned: parseDate("18.05.2024"),
    dateCreated: parseDate("29.05.2024"),
    category: Category.POCKET_MONEY,
    description: "",
    amount: 200.0,
    type: INCOME
  }
];

function parseDate(date: string): Date {
  const [day, month, year] = date.split('.').map(Number);
  return new Date(year, month - 1, day);
}

export const mock_income_and_expenses = [...mockExpenses, ...mockIncome];
