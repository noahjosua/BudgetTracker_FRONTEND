import { Component } from '@angular/core';
import { mock_income_and_expenses } from "../mock-data-income-and-expenses";
import { ExpenseService } from '../services/expense.service';
import { IncomeService } from '../services/income.service';
import { Expense } from '../model/expense.model';
import { EXPENSE, INCOME } from '../constants';


@Component({
  selector: 'app-revenue-list',
  templateUrl: './revenue-list.component.html',
  styleUrl: './revenue-list.component.css'
})
export class RevenueListComponent {

  incomes_and_expenses: any[] = mock_income_and_expenses;


  constructor(public expenseService: ExpenseService, public incomeService: IncomeService) {
  }

  onDelete(entry: Expense) {

    if (entry.type == EXPENSE) {
      this.expenseService.deleteExpense(entry);
    }
    if (entry.type == INCOME) {
      this.incomeService.deleteIncome(entry);
    }
  }


  formattedDate(date: Date) {
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  }
}
