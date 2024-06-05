import {Component, OnInit} from '@angular/core';
import {CATEGORIES_KEY, EXPENSE, INCOME, TYPE_EXPENSE_KEY, TYPE_INCOME_KEY} from "../constants";
import {ExpenseService} from "../services/expense.service";
import {map, Subscription} from "rxjs";
import {IncomeService} from "../services/income.service";
import {Entry} from "../model/entry.model";
import {TranslateService} from "@ngx-translate/core";

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
  translatedExpenseCategories: any = [];
  incomeCategories: any = [];
  translatedIncomeCategories: any = [];
  types: any = [];
  entry: Entry = {
    dateCreated: new Date(),
    datePlanned: new Date(),
    category: '',
    description: '',
    amount: 0.0
  };
  type: any = '';

  /* Dialog handling */
  isVisible: boolean = false;

  /* Validation */
  validation: any = {
    isTypeChosen: false,
    isDesValid: false,
    isCategoryChosen: false,
    isAmountValid: false,
    isDateValid: false,
  }

  constructor(public incomeService: IncomeService, public expenseService: ExpenseService, private translate: TranslateService) {
  }

  ngOnInit() {
    this.expenseService.fetchCategories();
    this.expenseCategorySubscription = this.expenseService.getCategoriesUpdatedListener()
      .pipe(
        map((categories: string[]) => categories.map(c => ({name: c})))
      )
      .subscribe((mappedCategories) => {
        this.expenseCategories = mappedCategories;
        this.translatedExpenseCategories = this.translateCategories(this.expenseCategories, this.translatedExpenseCategories);
      });

    this.incomeService.fetchCategories();
    this.incomeCategorySubscription = this.incomeService.getCategoriesUpdatedListener()
      .pipe(
        map((categories: string[]) => categories.map(c => ({name: c})))
      )
      .subscribe((mappedCategories) => {
        this.incomeCategories = mappedCategories;
        this.translatedIncomeCategories = this.translateCategories(this.incomeCategories, this.translatedIncomeCategories);
      });

    this.translate.get([TYPE_INCOME_KEY, TYPE_EXPENSE_KEY]).subscribe(translations => {
      this.types.push({name: translations[TYPE_INCOME_KEY], value: INCOME});
      this.types.push({name: translations[TYPE_EXPENSE_KEY], value: EXPENSE});
    });
  }

  translateCategories(categories: any[], translatedCategories: any[]) {
    const categoryNames = categories.map(c => c.name.toLowerCase());
    for (const category of categoryNames) {
      this.translate.get(CATEGORIES_KEY + category).subscribe(translations => {
        translatedCategories.push({name: translations, value: category.toUpperCase()});
      });
    }
    return translatedCategories;
  }

  onOpenDialog() {
    this.isVisible = !this.isVisible;
  }

  onSave() {
    this.entry.dateCreated = new Date();
    this.entry.category = this.entry.category.value;

    if (this.type == EXPENSE) {
      this.expenseService.addExpense(this.entry);
    }
    if (this.type == INCOME) {
      this.incomeService.addIncome(this.entry);
    }

    this.clearEntry();
    this.clearValidation();
    this.isVisible = false;
  }

  onCancel() {
    this.isVisible = false;
    this.clearEntry();
    this.clearValidation();
  }

  /*
  TODO
  Validation implementieren
   */

  clearEntry() {
    this.entry = {
      dateCreated: new Date(),
      datePlanned: new Date(),
      category: '',
      description: '',
      amount: 0.0
    }
  }

  clearValidation() {
    this.validation = {
      isTypeChosen: false,
      isDesValid: false,
      isCategoryChosen: false,
      isAmountValid: false,
      isDateValid: false,
    }
  }

  protected readonly INCOME = INCOME;
  protected readonly EXPENSE = EXPENSE;
}
