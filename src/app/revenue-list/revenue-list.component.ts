import { mock_income_and_expenses } from "../mock-data-income-and-expenses";
import { ExpenseService } from '../services/expense.service';
import { IncomeService } from '../services/income.service';
import { Expense } from '../model/expense.model';
import { EXPENSE, INCOME } from '../constants';
import {Component, OnInit} from '@angular/core';
import {Income} from "../model/income.model";
import {Subscription} from "rxjs";
import {formatDate} from "../helper";

@Component({
  selector: 'app-revenue-list',
  templateUrl: './revenue-list.component.html',
  styleUrl: './revenue-list.component.css'
})
export class RevenueListComponent implements OnInit {

  private incomeSubscription: Subscription | undefined;
  private expenseSubscription: Subscription | undefined;
  incomes: Income[] = [];
  expenses: Expense[] = [];
  incomes_and_expenses: any[] = [];


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


  ngOnInit() {
    this.incomeService.fetchIncomes();
    this.incomeSubscription = this.incomeService.getIncomesUpdatedListener().subscribe((incomes: Income[]) => {
      this.incomes = incomes;
      for (const income of this.incomes) {
        income.type = INCOME;
      }
      this.incomes_and_expenses = this.incomes.concat(this.expenses);
    });

    this.expenseService.fetchExpenses();
    this.expenseSubscription = this.expenseService.getExpensesUpdatedListener().subscribe((expenses: Expense[]) => {
      this.expenses = expenses;
      for (const expense of this.expenses) {
        expense.type = EXPENSE;
      }
      this.incomes_and_expenses = this.incomes.concat(this.expenses);
    });
  }

  onDelete(entry: any) {
  }

  protected readonly EXPENSE = EXPENSE;
}
