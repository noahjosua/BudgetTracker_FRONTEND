import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Income} from "../model/income.model";
import {Expense} from "../model/expense.model";
import {IncomeService} from "../services/income.service";
import {ExpenseService} from "../services/expense.service";
import {EXPENSE, INCOME} from "../constants";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  total_income: number = 0;
  total_expense: number = 0;
  saldo: number = 0;

  private incomeSubscription: Subscription | undefined;
  private expenseSubscription: Subscription | undefined;
  incomes: Income[] = [];
  expenses: Expense[] = [];

  constructor(public incomeService: IncomeService, public expenseService: ExpenseService) {
  }

  ngOnInit() {
    this.incomeService.fetchIncomes();
    this.incomeSubscription = this.incomeService.getIncomesUpdatedListener().subscribe((incomes: Income[]) => {
      this.incomes = incomes;
      for (const income of this.incomes) {
        income.type = INCOME;
        this.total_income += income.amount;
      }
    });

    this.expenseService.fetchExpenses();
    this.expenseSubscription = this.expenseService.getExpensesUpdatedListener().subscribe((expenses: Expense[]) => {
      this.expenses = expenses;
      for (const expense of this.expenses) {
        expense.type = EXPENSE;
        this.total_expense += expense.amount;
      }
    });

    this.saldo = (this.total_income - this.total_expense);
  }
}
