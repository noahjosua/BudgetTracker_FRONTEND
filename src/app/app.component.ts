import { Component, OnDestroy, OnInit } from '@angular/core';
import { Entry } from "./model/entry.model";
import { Constants } from "./constants";
import { IncomeService } from "./services/income.service";
import { ExpenseService } from "./services/expense.service";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {

  /* Subscriptions */
  private incomeSubscription: Subscription | undefined;
  private expenseSubscription: Subscription | undefined;

  income: Entry[] = [];
  expense: Entry[] = [];

  /* holds the value that was outputted by the OverviewComponent */
  showOnlyIncomes: boolean = false;
  showOnlyExpenses: boolean = false;
  showAllEntries: boolean = false;

  total_income: any;
  total_expense: any;
  total: any;

  /* holds the date that was emitted by the ToolbarComponent */
  selectedDate: Date = new Date();



  constructor(public incomeService: IncomeService,
    public expenseService: ExpenseService,
    private translate: TranslateService) {
    this.translate.setDefaultLang('de');
  }

  /**
   * Initializes the component by fetching incomes and expenses for the current date.
   * Subscribes to income and expense updates to refresh data when changes occur.
   */
  ngOnInit() {
    this.fetchIncomesByDate();
    this.fetchExpensesByDate();
  }

  /**
   * Updates the selected date and fetches incomes and expenses for the new date.
   * @param date - The new selected date.
   */
  onDateChanged(date: Date) {
    this.selectedDate = date;
    this.expenseService.fetchExpensesByDate(date);
    this.incomeService.fetchIncomesByDate(date);
  }

  /**
   * Sets whether to show only incomes.
   * @param showIncomes - True to show only incomes.
   */
  showIncomes(showIncomes: boolean) {
    this.showOnlyIncomes = showIncomes;
    this.showAllEntries = false;
    this.showOnlyExpenses = false;
  }

  showExpenses(showExpenses: boolean) {
    this.showOnlyExpenses = showExpenses;
    this.showAllEntries = false;
    this.showOnlyIncomes = false;
  }

  showEntries(showEntries: boolean) {
    this.showAllEntries = showEntries;
    this.showOnlyIncomes = false;
    this.showOnlyExpenses = false;
  }

  /**
   * Fetches expenses for the current date and subscribes to updates.
   * Updates 'expense' and calculates 'total_expense' based on fetched data.
   */
  private fetchExpensesByDate() {
    this.expenseService.fetchExpensesByDate(new Date());
    this.expenseSubscription = this.expenseService.getExpensesUpdatedListener().subscribe((expenses: Entry[]) => {
      this.expense = expenses;
      this.total_expense = 0;
      for (const expense of this.expense) {
        expense.type = Constants.EXPENSE;
        this.total_expense += expense.amount;
      }
      this.updateTotal();
    });
  }

  /**
   * Fetches incomes for the current date and subscribes to updates.
   * Updates 'income' and calculates 'total_income' based on fetched data.
   */
  private fetchIncomesByDate() {
    this.incomeService.fetchIncomesByDate(new Date());
    this.incomeSubscription = this.incomeService.getIncomesUpdatedListener().subscribe((incomes: Entry[]) => {
      this.income = incomes;
      this.total_income = 0;
      for (const income of this.income) {
        income.type = Constants.INCOME;
        this.total_income += income.amount;
      }
      this.updateTotal();
    });
  }

  private updateTotal() {
    this.total = this.total_income - this.total_expense;
  }

  /**
   * Unsubscribes from income and expense subscriptions when the component is destroyed to prevent memory leaks.
   */
  ngOnDestroy() {
    this.incomeSubscription?.unsubscribe();
    this.expenseSubscription?.unsubscribe();
  }
}
