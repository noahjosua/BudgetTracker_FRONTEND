import {ExpenseService} from '../services/expense.service';
import {IncomeService} from '../services/income.service';
import {Entry} from '../model/entry.model';
import {EXPENSE, INCOME} from '../constants';
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
    if (changes[INCOME]) {
      for (const income of this.income) {
        income.type = INCOME;
      }
      this.incomes_and_expenses = this.income.concat(this.expense); // TODO Anzeigen, so wie so abgespeichert wurden --> wie werden sie aus der DB geholt? In der Reihenfolge, in der sie auch gespeichert werden?
    }
    if (changes[EXPENSE]) {
      for (const expense of this.expense) {
        expense.type = EXPENSE;
      }
      this.incomes_and_expenses = this.income.concat(this.expense);
    }
  }

  // TODO
  onUpdate(entry: Entry) {

  }

  onDelete(entry: Entry) {
    if (entry.type == EXPENSE) {
      this.expenseService.deleteExpense(entry);
    }
    if (entry.type == INCOME) {
      this.incomeService.deleteIncome(entry);
    }
  }

  protected readonly formatDate = formatDate;
  protected readonly EXPENSE = EXPENSE;
}
