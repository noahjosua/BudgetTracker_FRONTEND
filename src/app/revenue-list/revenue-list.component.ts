import {Component, OnInit} from '@angular/core';
import {IncomeService} from "../services/income.service";
import {Subscription} from "rxjs";
import {Income} from "../model/income.model";
import {Expense} from "../model/expense.model";
import {ExpenseService} from "../services/expense.service";

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

  constructor(public incomeService: IncomeService, public expenseService: ExpenseService) {
  }

  ngOnInit(): void {
    this.incomeService.fetchIncomes();
    this.incomeSubscription = this.incomeService.getIncomesUpdatedListener().subscribe((incomes: Income[]) => {
      this.incomes = incomes;
      for (const income of this.incomes) {
        income.type = 'income';
      }
      this.incomes_and_expenses = this.incomes.concat(this.expenses);
    });

    this.expenseService.fetchExpenses();
    this.expenseSubscription = this.expenseService.getExpensesUpdatedListener().subscribe((expenses: Expense[]) => {
      this.expenses = expenses;
      for (const expense of this.expenses) {
        expense.type = 'expense';
      }
      this.incomes_and_expenses = this.incomes.concat(this.expenses);
    });
  }

  onDelete(entry: any) {
    if(entry.type == 'income') {
      this.incomeService.deleteIncome(entry.id);
    }

    if(entry.type == 'expense') {

    }
  }
}
