import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Constants} from "../constants";
import {ExpenseService} from "../services/expense.service";
import {map, Subscription} from "rxjs";
import {IncomeService} from "../services/income.service";
import {Entry} from "../model/entry.model";
import {TranslateService} from "@ngx-translate/core";
import {NotificationMessage} from "../model/NotificationMessage";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-create-edit-entry',
  templateUrl: './create-edit-entry.component.html',
  styleUrl: './create-edit-entry.component.css'
})
export class CreateEditEntryComponent implements OnInit, OnDestroy, OnChanges {

  private expenseCategorySubscription: Subscription | undefined;
  private incomeCategorySubscription: Subscription | undefined;
  private showMessageToUserSubscription: Subscription | undefined ;
  private notification: NotificationMessage = { severity: '', summary: '', detail: '' };

  @Input() title: any;
  @Input() currentDate: any;
  selectedDate: any;

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
              private translate: TranslateService,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.initializeIncomeCategories();
    this.initializeExpenseCategories();

    this.translate.get([Constants.TYPE_INCOME_KEY, Constants.TYPE_EXPENSE_KEY]).subscribe(translations => {
      this.types.push({name: translations[Constants.TYPE_INCOME_KEY], value: Constants.INCOME});
      this.types.push({name: translations[Constants.TYPE_EXPENSE_KEY], value: Constants.EXPENSE});
    });

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

    if (changes['currentDate']) {
      this.selectedDate = changes['currentDate'].currentValue;
    }
  }

  onSave() {
    this.entry.dateCreated = new Date();

    if (this.type == Constants.EXPENSE) {
      this.expenseService.addExpense(this.entry, this.selectedDate);
    }
    if (this.type == Constants.INCOME) {
      this.incomeService.addIncome(this.entry, this.selectedDate);
    }
    this.reset();
    setTimeout(() => {
      this.messageService.add(this.notification);
    }, 1000);
  }

  onCancel() {
    this.reset();
  }

  validateType() {
    this.validation.isTypeChosen = this.type == Constants.INCOME || this.type == Constants.EXPENSE;
  }

  validateDescription() {
    this.validation.description = this.entry.description.length >= 5 && this.entry.description.length <= 50;
  }

  validateCategory() {
    if (this.type == Constants.INCOME) {
      this.validation.isCategoryChosen = this.translatedIncomeCategories.some((category: any) => category.value === this.entry.category);
      console.log(this.validation.isCategoryChosen);
    }
    if (this.type == Constants.EXPENSE) {
      this.validation.isCategoryChosen = this.translatedExpenseCategories.some((category: any) => category.value === this.entry.category);
    }
  }

  validateAmount() {
    this.validation.isAmountValid = this.entry.amount > 0;
  }

  private initializeExpenseCategories() {
    this.expenseService.fetchCategories();
    this.expenseCategorySubscription = this.expenseService.getCategoriesUpdatedListener()
      .pipe(
        map((categories: string[]) => categories.map(c => ({name: c})))
      )
      .subscribe((mappedCategories) => {
        this.expenseCategories = mappedCategories;
        this.translatedExpenseCategories = this.translateCategories(this.expenseCategories, this.translatedExpenseCategories, this.translate);
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
        this.translatedIncomeCategories = this.translateCategories(this.incomeCategories, this.translatedIncomeCategories, this.translate);
      });
  }

  private translateCategories(categories: any[], translatedCategories: any[], translate: TranslateService) {
    const categoryNames = categories.map(c => c.name.toLowerCase());
    for (const category of categoryNames) {
      translate.get(Constants.CATEGORIES_KEY + category).subscribe(translations => {
        translatedCategories.push({name: translations, value: category.toUpperCase()});
      });
    }
    return translatedCategories;
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
    this.showMessageToUserSubscription?.unsubscribe();
  }

  protected readonly Constants = Constants;
}
