import {ExpenseService} from '../services/expense.service';
import {IncomeService} from '../services/income.service';
import {Entry} from '../model/entry.model';
import {Constants} from "../constants";
import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {MessageService} from "primeng/api";
import {Subscription} from "rxjs";
import {NotificationMessage} from "../model/NotificationMessage";

@Component({
  selector: 'app-revenue-list',
  templateUrl: './revenue-list.component.html',
  styleUrl: './revenue-list.component.css'
})
export class RevenueListComponent implements OnInit, OnChanges, OnDestroy {

  @Input() income: any;
  @Input() expense: any;
  values: any[] = [];

  isDialogVisible: boolean = false;
  isUpdating: boolean = false;
  title = "Eintrag bearbeiten";
  entry: any;
  @Input() currentDate: any;
  selectedDate: any;

  @Input() showOnlyIncomes: any;

  private showMessageToUserSubscription: Subscription | undefined;
  private notification: NotificationMessage = {severity: '', summary: '', detail: ''};

  constructor(public incomeService: IncomeService, public expenseService: ExpenseService, private messageService: MessageService) {
  }

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes[Constants.INCOME]) {
      for (const income of this.income) {
        income.type = Constants.INCOME;
      }
      this.values = this.income.concat(this.expense);
    }
    if (changes[Constants.EXPENSE]) {
      for (const expense of this.expense) {
        expense.type = Constants.EXPENSE;
      }
      this.values = this.income.concat(this.expense);
    }

    if (changes['currentDate']) {
      this.selectedDate = changes['currentDate'].currentValue;
    }

    if (changes['showOnlyIncomes']) {
      if (changes['showOnlyIncomes'].currentValue == true) {
        this.values = this.values.filter((entry: any) => entry.type == Constants.INCOME);
      }
    }
  }

  onUpdate(entry: Entry) {
    this.entry = entry;
    this.isDialogVisible = true;
    this.isUpdating = true;
  }

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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  ngOnDestroy(): void {
    this.showMessageToUserSubscription?.unsubscribe();
  }

  protected readonly Constants = Constants;
}
