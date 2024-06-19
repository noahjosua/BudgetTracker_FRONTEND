import { ExpenseService } from '../services/expense.service';
import { IncomeService } from '../services/income.service';
import { DateConverterService } from "../services/date-converter.service";
import { Entry } from '../model/entry.model';
import { Constants } from "../constants";
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { NotificationMessageModel } from "../model/notification-message.model";

@Component({
  selector: 'app-revenue-list',
  templateUrl: './revenue-list.component.html'
})
export class RevenueListComponent implements OnInit, OnChanges, OnDestroy {

  /* Subscriptions */
  private showMessageToUserSubscription: Subscription | undefined;
  private notification: NotificationMessageModel = { severity: '', summary: '', detail: '' };

  /* Inputs from the AppComponent */
  @Input() income: any;
  @Input() expense: any;
  @Input() currentDate: any;
  @Input() showOnlyIncomes: any;
  @Input() showOnlyExpenses: any;
  @Input() showAllEntries: any;

  /* holds the value of the currentDate from the AppComponent */
  selectedDate: any;

  /* Data binding */
  values: any[] = [];

  /* Inputs for CreateEditEntryComponent */
  title = "Eintrag bearbeiten";
  entry: any;
  isUpdating: boolean = false;
  isDialogVisible: boolean = false;


  constructor(public incomeService: IncomeService,
    public expenseService: ExpenseService,
    private messageService: MessageService,
    public dateConverterService: DateConverterService) {
  }

  /**
   * Subscribes to notifications from income and expense services to display messages.
   *
   * Subscribes to notifications for messages (which will be shown to the user) from income and expense services.
   */
  ngOnInit() {
    this.showMessageToUserSubscription = this.incomeService.getShowMessageToUserSubject().subscribe(
      message => {
        this.notification = message;
      }
    );

    this.showMessageToUserSubscription = this.expenseService.getShowMessageToUserSubject().subscribe(
      message => {
        this.notification = message;
      }
    );
  }

  /**
   * Responds to changes in input properties.
   * Updates incomes and expenses based on changes.
   * Updates the displayed entries based on whether to show only incomes, expenses or both.
   * Updates the 'selectedDate' property if 'currentDate' input changes.
   *
   * @param changes - Object containing the changed properties mapped by property name.
   */
  ngOnChanges(changes: SimpleChanges) {
    this.onChangesIncomes(changes);
    this.onChangesExpenses(changes);
    this.onChangesShowOnlyIncomes(changes);
    if (changes['currentDate']) {
      this.selectedDate = changes['currentDate'].currentValue;
    }
    if (changes['showOnlyIncomes']) {
      if (changes['showOnlyIncomes'].currentValue == true) {
        this.values = this.income.concat(this.expense);
        this.values = this.values.filter((entry: any) => entry.type == Constants.INCOME);
      }
    }
    if (changes['showOnlyExpenses']) {
      if (changes['showOnlyExpenses'].currentValue == true) {
        this.values = this.income.concat(this.expense); //Gibt es einen anderen weg? sonst wird von switch von ausgaben zu einnahmen nichts angezeigt, weil values nur mit expenses gefüllt war, beovr es wieder neu gefiltet wird
        this.values = this.values.filter((entry: any) => entry.type == Constants.EXPENSE);
      }
    }
    if (changes['showAllEntries']) {
      if (changes['showAllEntries'].currentValue == true) {
        this.values = this.income.concat(this.expense);

      }
    }

  }

  /**
   * Updates the current entry being edited and prepares the dialog for update mode.
   *
   * @param entry - The entry object being updated.
   */
  onUpdate(entry: Entry) {

    this.entry = entry;
    this.isDialogVisible = true;
    this.isUpdating = true;
    if (entry.type == Constants.EXPENSE) {
      this.expenseService.updateExpense(entry);
    }
    if (entry.type == Constants.INCOME) {
      this.incomeService.updateIncome(entry);
    }

  }

  /**
   * Deletes the specified entry from either the income or expense service.
   * Displays a notification message after a delay.
   *
   * @param entry - The entry object to be deleted.
   */
  onDelete(entry: Entry) {
    if (entry.type == Constants.EXPENSE) {
      this.expenseService.deleteExpense(entry);
    }
    if (entry.type == Constants.INCOME) {
      this.incomeService.deleteIncome(entry);
    }
    setTimeout(() => {
      this.messageService.add(this.notification);
    }, 1000);
  }

  /**
   * Formats the given date string to European date format using DateConverterService.
   *
   * @param dateString - The date string to be formatted.
   * @returns The formatted date string.
   */
  formatDate(dateString: string) {
    return this.dateConverterService.convertToEUFormat(new Date(dateString));
  }

  /**
   * Handles changes to the 'income' property in input changes.
   * Sets type to 'income' for each income entry.
   */
  private onChangesIncomes(changes: SimpleChanges) {
    if (changes[Constants.INCOME]) {
      for (const income of this.income) {
        income.type = Constants.INCOME;
      }
      this.values = this.income.concat(this.expense);
    }
  }

  /**
   * Handles changes to the 'expense' property in input changes.
   * Sets type to 'expense' for each income entry.
   */
  private onChangesExpenses(changes: SimpleChanges) {
    if (changes[Constants.EXPENSE]) {
      for (const expense of this.expense) {
        expense.type = Constants.EXPENSE;
      }
      this.values = this.income.concat(this.expense);
    }
  }

  /**
   * Handles changes to the 'showOnlyIncomes' property in input changes.
   * Filters displayed entries to show only incomes if 'showOnlyIncomes' is true.
   */
  private onChangesShowOnlyIncomes(changes: SimpleChanges) {
    if (changes['showOnlyIncomes']) {
      if (changes['showOnlyIncomes'].currentValue == true) {
        this.values = this.values.filter((entry: any) => entry.type == Constants.INCOME);
      }
    }
  }

  private onChangesShowOnlyExpenses(changes: SimpleChanges) {
    if (changes['showOnlyExpenses']) {
      if (changes['showOnlyExpenses'].currentValue == true) {
        this.values = this.values.filter((entry: any) => entry.type == Constants.EXPENSE);
      }
    }
  }

  private onChangesShowAllEntries(changes: SimpleChanges) {
    if (changes['showAllEntries']) {
      if (changes['showAllEntries'].currentValue == true) {
        this.values = this.income.concat(this.expense);

      }
    }
  }

  /**
   * Unsubscribes from all subscriptions when the component is destroyed to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.showMessageToUserSubscription?.unsubscribe();
  }

  protected readonly Constants = Constants;
}
