import {ExpenseService} from '../services/expense.service';
import {IncomeService} from '../services/income.service';
import {Entry} from '../model/entry.model';
import {Constants} from "../constants";
import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {formatDate} from "../helper";

@Component({
  selector: 'app-revenue-list',
  templateUrl: './revenue-list.component.html',
  styleUrl: './revenue-list.component.css'
})
export class RevenueListComponent implements OnChanges {

  @Input() income: any;
  @Input() expense: any;
  incomes_and_expenses: any[] = [];

  constructor(public incomeService: IncomeService, public expenseService: ExpenseService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes[Constants.INCOME]) {
      for (const income of this.income) {
        income.type = Constants.INCOME;
      }
      this.incomes_and_expenses = this.income.concat(this.expense); // TODO Anzeigen, so wie so abgespeichert wurden --> wie werden sie aus der DB geholt? In der Reihenfolge, in der sie auch gespeichert werden?
    }
    if (changes[Constants.EXPENSE]) {
      for (const expense of this.expense) {
        expense.type = Constants.EXPENSE;
      }
      this.incomes_and_expenses = this.income.concat(this.expense);
    }
  }

  // TODO
  onUpdate(entry: Entry) {

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
