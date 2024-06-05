import {Component, OnInit} from '@angular/core';
import {Entry} from "./model/entry.model";
import {EXPENSE, INCOME} from "./constants";
import {IncomeService} from "./services/income.service";
import {ExpenseService} from "./services/expense.service";
import {Subscription} from "rxjs";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'budget-tracker-frontend';
  selectedDate: string = '';

  private incomeSubscription: Subscription | undefined;
  private expenseSubscription: Subscription | undefined;
  income: Entry[] = [];
  expense: Entry[] = [];

  total_income: any;
  total_expense: any;
  total: any;

  constructor(public incomeService: IncomeService, public expenseService: ExpenseService, private translate: TranslateService) {
    translate.setDefaultLang('de');
  }

  ngOnInit() {
    this.incomeService.fetchIncomes();
    this.incomeSubscription = this.incomeService.getIncomesUpdatedListener().subscribe((incomes: Entry[]) => {
      this.income = incomes;
      this.total_income = 0;
      for (const income of this.income) {
        income.type = INCOME;
        this.total_income += income.amount;
      }
      this.updateTotal();
    });

    this.expenseService.fetchExpenses();
    this.expenseSubscription = this.expenseService.getExpensesUpdatedListener().subscribe((expenses: Entry[]) => {
      this.expense = expenses;
      this.total_expense = 0;
      for (const expense of this.expense) {
        expense.type = EXPENSE;
        this.total_expense += expense.amount;
      }
      this.updateTotal();
    });
  }

  updateTotal() {
    this.total = this.total_income - this.total_expense;
  }

  onDateChanged(date: Date) {
    this.selectedDate = date.toLocaleString('default', {month: 'long', year: 'numeric'});
    this.expenseService.fetchExpensesByDate(date);
    // TODO Einträge für den jeweiligen Monat fetchen
  }
}
