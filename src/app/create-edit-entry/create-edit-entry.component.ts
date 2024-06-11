import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Constants} from "../constants";
import {ExpenseService} from "../services/expense.service";
import {map, Subscription} from "rxjs";
import {IncomeService} from "../services/income.service";
import {Entry} from "../model/entry.model";
import {TranslateService} from "@ngx-translate/core";
import {translateCategories} from "../helper";

@Component({
  selector: 'app-create-edit-entry',
  templateUrl: './create-edit-entry.component.html',
  styleUrl: './create-edit-entry.component.css'
})
export class CreateEditEntryComponent implements OnInit, OnDestroy, OnChanges {

  private expenseCategorySubscription: Subscription | undefined;
  private incomeCategorySubscription: Subscription | undefined;

  @Input() title: any;

  /* Dialog models for data binding */
  expenseCategories: any = [];
  translatedExpenseCategories: any = [];
  incomeCategories: any = [];
  translatedIncomeCategories: any = [];
  types: any = [];
  @Input() entry: Entry = {
    dateCreated: new Date(),
    datePlanned: new Date(),
    category: '',
    description: '',
    amount: 0.0
  };
  type: any;

  /* Dialog handling */
  @Input() isVisible: boolean = false;
  @Output() visibilityChanged = new EventEmitter<boolean>();

  /* Validation */
  validation: any = {
    isTypeChosen: false,
    isDesValid: false,
    isCategoryChosen: false,
    isAmountValid: false,
    isDateValid: false,
  }

  constructor(public incomeService: IncomeService,
              public expenseService: ExpenseService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.initializeIncomeCategories();
    this.initializeExpenseCategories();

    this.translate.get([Constants.TYPE_INCOME_KEY, Constants.TYPE_EXPENSE_KEY]).subscribe(translations => {
      this.types.push({name: translations[Constants.TYPE_INCOME_KEY], value: Constants.INCOME});
      this.types.push({name: translations[Constants.TYPE_EXPENSE_KEY], value: Constants.EXPENSE});
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['entry']) {
      const changedEntry = changes['entry'].currentValue;
      if (changedEntry !== undefined) {
        this.type = this.types.find((type: any) => type.value === changedEntry.type)['value'];
        if (this.type === Constants.INCOME) {
          this.entry.category = this.translatedIncomeCategories.find((category: any) => category.value == changedEntry.category)['value'];
        }
        if (this.type === Constants.EXPENSE) {
          this.entry.category = this.translatedExpenseCategories.find((category: any) => category.value == changedEntry.category)['value'];
        }
        this.entry.datePlanned = new Date(changedEntry.datePlanned);
      }
    }
  }

  onSave() {
    this.entry.dateCreated = new Date();

    if (this.type == Constants.EXPENSE) {
      this.expenseService.addExpense(this.entry);
    }
    if (this.type == Constants.INCOME) {
      this.incomeService.addIncome(this.entry);
    }
    this.reset();
  }

  onCancel() {
    this.reset();
  }

  /*
  TODO
  Validation implementieren
   */

  private initializeExpenseCategories() {
    this.expenseService.fetchCategories();
    this.expenseCategorySubscription = this.expenseService.getCategoriesUpdatedListener()
      .pipe(
        map((categories: string[]) => categories.map(c => ({name: c})))
      )
      .subscribe((mappedCategories) => {
        this.expenseCategories = mappedCategories;
        this.translatedExpenseCategories = translateCategories(this.expenseCategories, this.translatedExpenseCategories, this.translate);
      });
  }

  private initializeIncomeCategories() {
    this.incomeService.fetchCategories();
    this.incomeCategorySubscription = this.incomeService.getCategoriesUpdatedListener()
      .pipe(
        map((categories: string[]) => categories.map(c => ({name: c})))
      )
      .subscribe((mappedCategories) => {
        this.incomeCategories = mappedCategories;
        this.translatedIncomeCategories = translateCategories(this.incomeCategories, this.translatedIncomeCategories, this.translate);
      });
  }

  private reset() {
    this.isVisible = false;
    this.visibilityChanged.emit(this.isVisible);
    this.clearEntry();
    this.clearValidation();
  }

  private clearEntry() {
    this.entry = {
      dateCreated: new Date(),
      datePlanned: new Date(),
      category: '',
      description: '',
      amount: 0.0
    }
  }

  private clearValidation() {
    this.validation = {
      isTypeChosen: false,
      isDesValid: false,
      isCategoryChosen: false,
      isAmountValid: false,
      isDateValid: false,
    }
  }

  ngOnDestroy(): void {
    this.expenseCategorySubscription?.unsubscribe();
    this.incomeCategorySubscription?.unsubscribe();
  }

  protected readonly Constants = Constants;
}
