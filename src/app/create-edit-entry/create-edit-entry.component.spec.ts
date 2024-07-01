import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {CreateEditEntryComponent} from './create-edit-entry.component';

import {CUSTOM_ELEMENTS_SCHEMA, SimpleChange, SimpleChanges} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateService, TranslateModule} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';

import {IncomeService} from '../services/income.service';
import {ExpenseService} from '../services/expense.service';
import {Constants} from "../constants";
import {of, Subject} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {Entry} from "../model/entry.model";


describe('testing CreateEditEntryComponent', () => {
  let createEditEntryComponent: CreateEditEntryComponent;
  let fixture: ComponentFixture<CreateEditEntryComponent>;
  let incomeService: IncomeService;
  let expenseService: ExpenseService;
  let testDate: Date;
  /*let translateServiceMock: jasmine.SpyObj<TranslateService>;
  let incomeServiceSpy: jasmine.SpyObj<IncomeService>;
  let expenseServiceSpy: jasmine.SpyObj<ExpenseService>;*/


  beforeEach(async () => {
    /* translateServiceMock = jasmine.createSpyObj('TranslateService', ['get']);
     translateServiceMock.get.and.returnValue(of({}));
     const incomeSpy = jasmine.createSpyObj('IncomeService', ['addIncome', 'updateIncome', 'getCategoriesUpdatedListener', 'fetchCategories']);
     const expenseSpy = jasmine.createSpyObj('ExpenseService', ['addExpense', 'updateExpense', 'getCategoriesUpdatedListener', 'fetchCategories']);

     incomeSpy.fetchCategories.and.returnValue(of(new HttpResponse({ body: JSON.stringify([]) })));
     expenseSpy.fetchCategories.and.returnValue(of(new HttpResponse({ body: JSON.stringify([]) })));


     incomeSpy.getCategoriesUpdatedListener.and.returnValue(new Subject().asObservable());
     expenseSpy.getCategoriesUpdatedListener.and.returnValue(new Subject().asObservable());*/
    testDate = new Date(2024, 6, 24);
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ],
      declarations: [CreateEditEntryComponent],
      providers: [
        IncomeService,
        ExpenseService,
        TranslateService,
        MessageService,
        /* {provide: TranslateService, useValue: translateServiceMock},
         {provide: IncomeService, useValue: incomeSpy},
         {provide: ExpenseService, useValue: expenseSpy},*/
      ],

      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    /*incomeServiceSpy = TestBed.inject(IncomeService) as jasmine.SpyObj<IncomeService>;
     expenseServiceSpy = TestBed.inject(ExpenseService) as jasmine.SpyObj<ExpenseService>;*/
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditEntryComponent);
    incomeService = TestBed.inject(IncomeService);
    expenseService = TestBed.inject(ExpenseService);
    createEditEntryComponent = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('Component created.', () => {
    expect(createEditEntryComponent).toBeTruthy();
  });

  it('Validation variables initialized to false.', () => {

    expect(createEditEntryComponent.validation.isTypeChosen).toBeFalsy();
    expect(createEditEntryComponent.validation.isAmountValid).toBeFalsy();
    expect(createEditEntryComponent.validation.isDesValid).toBeFalsy();
    expect(createEditEntryComponent.validation.isCategoryChosen).toBeFalsy();

  });

  /*it('should call onCancel when cancel button is clicked', () => {
    const cancelButton = fixture.nativeElement.querySelector('.p-button[label=\'Abbrechen\']');
    spyOn(createEditEntryComponent, 'onCancel');

    translateServiceMock.get.and.returnValue(of('Abbrechen'));

    cancelButton.click();

    expect(createEditEntryComponent.onCancel).toHaveBeenCalled();
  }); */


  it('should emit visibilityChanged event when onCancel() is called', () => {
    spyOn(createEditEntryComponent.visibilityChanged, 'emit');
    createEditEntryComponent.onCancel();
    expect(createEditEntryComponent.visibilityChanged.emit).toHaveBeenCalledWith(false);
  });


  it('reset() is called when onCancel() is called.', () => {
    spyOn(createEditEntryComponent as any, 'reset');


    createEditEntryComponent.onCancel();
    expect((createEditEntryComponent as any).reset).toHaveBeenCalled();
  });

  it('clearEntry() and clearValidation() are called when onCancel() is called.', () => {
    spyOn(createEditEntryComponent as any, 'clearEntry');
    spyOn(createEditEntryComponent as any, 'clearValidation');

    createEditEntryComponent.onCancel();

    expect((createEditEntryComponent as any).clearEntry).toHaveBeenCalled();
    expect((createEditEntryComponent as any).clearValidation).toHaveBeenCalled();
  });


  it('should call onSave for adding new income when isUpdating is false', () => {
    // Vorbereitung der Testumgebung
    createEditEntryComponent.isUpdating = false;
    createEditEntryComponent.type = 'income';
    createEditEntryComponent.newEntry = {
      dateCreated: testDate,
      datePlanned: testDate,
      category: 'test-category',
      description: 'test description',
      amount: 100
    };

    spyOn(incomeService, 'addIncome');
    createEditEntryComponent.onSave();

    expect(incomeService.addIncome).toHaveBeenCalled();
  });

  it('should call onSave for adding new expense when isUpdating is false', () => {
    // Vorbereitung der Testumgebung
    createEditEntryComponent.isUpdating = false;
    createEditEntryComponent.type = 'expense';
    createEditEntryComponent.newEntry = {
      dateCreated: testDate,
      datePlanned: testDate,
      category: 'Groceries',
      description: 'nom',
      amount: 100
    };

    spyOn(expenseService, 'addExpense');
    createEditEntryComponent.onSave();

    expect(expenseService.addExpense).toHaveBeenCalled();
  });

  /*
  it('should call onSave for updating existing expense when isUpdating is true', () => {
    // Set up test conditions
    createEditEntryComponent.isUpdating = true;
    createEditEntryComponent.type = Constants.EXPENSE;
    createEditEntryComponent.newEntry = {
      dateCreated: testDate,
      datePlanned: testDate,
      category: 'Groceries',
      description: 'nom',
      amount: 100
    };

    // Spy on the updateExpense method
    spyOn(expenseService, 'updateExpense').and.callThrough();

    // Call onSave
    createEditEntryComponent.onSave();

    // Ensure updateExpense was called
    expect(expenseService.updateExpense).toHaveBeenCalled();
    expect(expenseService.updateExpense).toHaveBeenCalledWith(createEditEntryComponent.newEntry, createEditEntryComponent.selectedDate);
  });
*/

});
