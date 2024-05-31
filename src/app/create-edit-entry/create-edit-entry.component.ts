import {Component, OnInit} from '@angular/core';
import {EXPENSE, INCOME} from "../constants";
import {ExpenseService} from "../services/expense.service";
import {map, Subscription} from "rxjs";
import {IncomeService} from "../services/income.service";

@Component({
  selector: 'app-create-edit-entry',
  templateUrl: './create-edit-entry.component.html',
  styleUrl: './create-edit-entry.component.css'
})
export class CreateEditEntryComponent implements OnInit {

  private expenseCategorySubscription: Subscription | undefined;
  private incomeCategorySubscription: Subscription | undefined;

  /* Dialog models for data binding */
  expenseCategories: any = [];
  incomeCategories: any = [];
  types: any = [{name: 'Einnahme', value: INCOME}, {name: 'Ausgabe', value: EXPENSE}];
  entry: any = {
    dateCreated: new Date(),
    datePlanned: new Date(),
    category: '',
    description: '',
    amount: 0.0
  };
  type: any = '';

  /* Dialog handling */
  visible: boolean = false;


  constructor(public incomeService: IncomeService, public expenseService: ExpenseService) {
  }

  ngOnInit() {
    this.expenseService.fetchCategories();
    this.expenseCategorySubscription = this.expenseService.getCategoriesUpdatedListener()
      .pipe(
        map((categories: string[]) => categories.map(c => ({name: c})))
      )
      .subscribe((mappedCategories) => {
        this.expenseCategories = mappedCategories;
      });

    this.incomeService.fetchCategories();
    this.incomeCategorySubscription = this.incomeService.getCategoriesUpdatedListener()
      .pipe(
        map((categories: string[]) => categories.map(c => ({name: c})))
      )
      .subscribe((mappedCategories) => {
        this.incomeCategories = mappedCategories;
      });
  }

  onOpenDialog() {
    this.visible = !this.visible;
  }

  onSave() {
    this.entry.datePlanned = '11.05.2024'; // TODO nicht hardgecoded
    this.entry.category = this.entry.category.name;

    // clear entry and validation
  }

  onCancel() {
    this.visible = false;
  }

  protected readonly INCOME = INCOME;
  protected readonly EXPENSE = EXPENSE;
}
