import {ExpenseService} from '../services/expense.service';
import {IncomeService} from '../services/income.service';
import {Entry} from '../model/entry.model';
import {Constants} from "../constants";
import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {formatDate} from "../helper";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-revenue-list',
  templateUrl: './revenue-list.component.html',
  styleUrl: './revenue-list.component.css'
})
export class RevenueListComponent implements OnChanges {

  @Input() income: any;
  @Input() expense: any;
  incomes_and_expenses: any[] = [];

  isDialogVisible: boolean = false;
  title = "Eintrag bearbeiten";
  entry: any;
  @Input() currentDate: any;
  selectedDate: any;


  constructor(public incomeService: IncomeService, public expenseService: ExpenseService, private translate: TranslateService) {
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes[Constants.INCOME]) {
      for (const income of this.income) {
        income.type = Constants.INCOME;
      }
      this.incomes_and_expenses = this.income.concat(this.expense);
    }
    if (changes[Constants.EXPENSE]) {
      for (const expense of this.expense) {
        expense.type = Constants.EXPENSE;
      }
      this.incomes_and_expenses = this.income.concat(this.expense);
    }

    if(changes['currentDate']) {
      this.selectedDate = changes['currentDate'].currentValue;
    }
  }

  onUpdate(entry: Entry) {
    this.entry = entry;
    this.isDialogVisible = true;
  }

  onDelete(entry: Entry) {
    if (entry.type == Constants.EXPENSE) {
      this.expenseService.deleteExpense(entry);
    }
    if (entry.type == Constants.INCOME) {
      this.incomeService.deleteIncome(entry);
    }
  }

  protected readonly formatDate = formatDate;
  protected readonly Constants = Constants;
}
