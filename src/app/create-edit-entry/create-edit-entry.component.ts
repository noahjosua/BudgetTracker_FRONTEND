import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Constants} from "../constants";
import {ExpenseService} from "../services/expense.service";
import {map, Subscription} from "rxjs";
import {IncomeService} from "../services/income.service";
import {Entry} from "../model/entry.model";
import {TranslateService} from "@ngx-translate/core";
import {NotificationMessageModel} from "../model/notification-message.model";
import {MessageService} from "primeng/api";


@Component({
  selector: 'app-create-edit-entry',
  templateUrl: './create-edit-entry.component.html',
  styleUrl: './create-edit-entry.component.css'
})
export class CreateEditEntryComponent implements OnInit, OnDestroy, OnChanges {

  /* Subscriptions */
  private expenseCategorySubscription: Subscription | undefined;
  private incomeCategorySubscription: Subscription | undefined;
  private showMessageToUserSubscription: Subscription | undefined;
  private notification: NotificationMessageModel = {severity: '', summary: '', detail: ''};

  /* Inputs from RevenueListComponent */
  @Input() title: any;
  @Input() currentDate: any;
  @Input() entry: Entry = {
    dateCreated: new Date(),
    datePlanned: new Date(),
    category: '',
    description: '',
    amount: 0.0
  };
  @Input() isUpdating: any;
  @Input() isDialogVisible: boolean = false;

  /* Output to RevenueListComponent */
  @Output() visibilityChanged = new EventEmitter<boolean>();

  /* holds the value of the currentDate from the RevenueListComponent */
  selectedDate: any;

  /* Dialog models for data binding */
  expenseCategories: any = [];
  translatedExpenseCategories: any = [];
  incomeCategories: any = [];
  translatedIncomeCategories: any = [];
  types: any = [];
  newEntry: Entry = {
    dateCreated: new Date(),
    datePlanned: new Date(),
    category: '',
    description: '',
    amount: 0.0
  };
  type: any;

  /* Validation */
  validation: any = {
    isTypeChosen: false,
    isDesValid: false,
    isCategoryChosen: false,
    isAmountValid: false,
    isTypeUpdating: false
  }

  constructor(public incomeService: IncomeService,
              public expenseService: ExpenseService,
              private translate: TranslateService,
              private messageService: MessageService) {
  }

  /**
   * Initializes the component.
   * Calls functions to initialize income and expense categories.
   * Translates income and expense types and adds them to the 'types' list.
   * Subscribes to notifications for messages (which will be shown to the user) from income and expense services.
   */
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

  /**
   * Responds to changes in input properties.
   * Calls specific handler methods for 'entry' and 'isUpdating' state changes.
   * Updates the 'selectedDate' if 'currentDate' input changes.
   *
   * @param changes - Object containing the changed properties mapped by property name.
   */
  ngOnChanges(changes: SimpleChanges) {
    this.onEntryChanges(changes);
    if (changes['currentDate']) {
      this.selectedDate = changes['currentDate'].currentValue;
    }
  }

  /**
   * Saves the new entry with the current date and notifies the corresponding service.
   * Resets the form and displays a notification message after a delay.
   */
  onSave() {
    this.newEntry.dateCreated = new Date();

    if (this.type == Constants.EXPENSE) {
      this.expenseService.addExpense(this.newEntry, this.selectedDate);
    }
    if (this.type == Constants.INCOME) {
      this.incomeService.addIncome(this.newEntry, this.selectedDate);
    }
    this.reset();
    setTimeout(() => {
      this.messageService.add(this.notification);
    }, 1000);
  }

  onCancel() {
    this.reset();
  }

  /**
   * Validates if the entry meets all necessary criteria.
   * @returns true if all validation criteria are met, otherwise false.
   */
  entryValidator(): boolean {
    if (this.isUpdating && !this.validation.isTypeUpdating) {
      return true;
    }
    return this.validation.isTypeChosen && this.validation.isAmountValid && this.validation.isDesValid && this.validation.isCategoryChosen;
  }

  /**
   * Checks if a valid type (income or expense) has been chosen.
   * Adjusts category validation state when updating an entry.
   */
  typeChosen() {
    if(this.isUpdating){
      this.validation.isTypeUpdating = true
    }
    if(this.validation.isTypeUpdating){
      this.validation.isCategoryChosen = false;
    }

    this.validation.isTypeChosen = this.type == Constants.INCOME || this.type == Constants.EXPENSE;
    if (this.isUpdating) {
      this.newEntry.category = '';
      this.validation.isCategoryChosen = false;
    }
  }

  validateDes() {
    this.validation.isDesValid = this.newEntry.description.length > 0 && this.newEntry.description.length < 50;
  }

  /**
   * Checks if a valid category has been chosen based on the entry type (income or expense).
   */
  categoryChosen() {
    this.validation.isTypeUpdating = false;
    if (this.type == Constants.INCOME) {
      this.validation.isCategoryChosen = this.translatedIncomeCategories.some((category: any) => category.value == this.newEntry.category);
    } else if (this.type == Constants.EXPENSE) {
      this.validation.isCategoryChosen = this.translatedExpenseCategories.some((category: any) => category.value == this.newEntry.category);
    }
  }

  validateAmount() {
    this.validation.isAmountValid = this.newEntry.amount > 0;
  }

  /**
   * Fetches and initializes expense categories from the service, translating them if necessary.
   */
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

  /**
   * Fetches and initializes income categories from the service, translating them if necessary.
   */
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

  /**
   * Translates categories fetched from the service and stores them in the appropriate translated categories array.
   * @param categories - Original categories fetched from the service.
   * @param translatedCategories - Array where translated categories will be stored.
   * @param translate - Translation service instance used for translating category names.
   * @returns Translated categories array.
   */
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
    this.isDialogVisible = false;
    this.isUpdating = false;
    this.validation.isTypeUpdating = false;
    this.visibilityChanged.emit(this.isDialogVisible);
    this.clearEntry();
    this.clearValidation();
  }

  /**
   * Clears the new entry form, either restoring an existing entry or initializing a new one.
   */
  private clearEntry() {
    if (this.isUpdating) {
      this.newEntry = this.entry;
    } else {
      this.newEntry = {
        dateCreated: new Date(),
        datePlanned: new Date(),
        category: '',
        description: '',
        amount: 0.0
      }
      this.type = '';
    }
  }

  private clearValidation() {
    this.validation = {
      isTypeChosen: false,
      isDesValid: false,
      isCategoryChosen: false,
      isAmountValid: false
    }
  }

  /**
   * Handles changes to the 'entry' input property, updating the form fields accordingly.
   * @param changes - Object containing the changed properties mapped by property name.
   */
  private onEntryChanges(changes: SimpleChanges) {
    if (changes['entry']) {
      const changedEntry = changes['entry'].currentValue;
      if (changedEntry !== undefined) {
        this.newEntry.description = changedEntry.description;
        this.newEntry.amount = changedEntry.amount;
        this.type = this.types.find((type: any) => type.value === changedEntry.type)['value'];
        if (this.type === Constants.INCOME) {
          this.newEntry.category = this.translatedIncomeCategories.find((category: any) => category.value == changedEntry.category)['value'];
        }
        if (this.type === Constants.EXPENSE) {
          this.newEntry.category = this.translatedExpenseCategories.find((category: any) => category.value == changedEntry.category)['value'];
        }
        this.newEntry.datePlanned = new Date(changedEntry.datePlanned);
      }
    }
  }

  /**
   * Unsubscribes from all subscriptions when the component is destroyed to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.expenseCategorySubscription?.unsubscribe();
    this.incomeCategorySubscription?.unsubscribe();
    this.showMessageToUserSubscription?.unsubscribe();
  }

  protected readonly Constants = Constants;
}
