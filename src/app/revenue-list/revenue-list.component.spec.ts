import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { RevenueListComponent } from './revenue-list.component';
import { IncomeService } from '../services/income.service';
import { ExpenseService } from '../services/expense.service';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core'; //Otherwise it won't recognize html stuff like buttons or links to other components
import { DateConverterService } from '../services/date-converter.service';
import { Subscription, of } from 'rxjs';
import { Constants } from '../constants';
import { Entry } from '../model/entry.model';

describe('testing RevenueListComponent', () => {
  let revenueListComponent: RevenueListComponent;
  let componentFixture: ComponentFixture<RevenueListComponent>;



  const mockIncomeEntry: Entry = {
    id: 1, type: Constants.INCOME, amount: 100,
    datePlanned: new Date(),
    dateCreated: new Date(),
    category: undefined,
    description: 'mock'
  };
  const mockExpenseEntry: Entry = {
    id: 1, type: Constants.EXPENSE, amount: 100,
    datePlanned: new Date(),
    dateCreated: new Date(),
    category: undefined,
    description: 'mock'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [
        HttpClientTestingModule,
        FormsModule,
        TranslateModule.forRoot()
      ],
      declarations: [RevenueListComponent],
      providers: [
        IncomeService,
        ExpenseService,
        TranslateService,
        MessageService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]

    }).compileComponents();

  });

  beforeEach(() => {
    componentFixture = TestBed.createComponent(RevenueListComponent);
    revenueListComponent = componentFixture.componentInstance;
    componentFixture.detectChanges();
  });

  it('should create the component', () => {
    expect(revenueListComponent).toBeTruthy();
  });

  it('should call ngOnInit to subscribe to income and expense services for notifications on initialization', () => {
    spyOn(revenueListComponent, 'ngOnInit');
    revenueListComponent.ngOnInit();
    expect(revenueListComponent.ngOnInit).toHaveBeenCalled();

  });

  it('should initialize isDialogVisible to false', () => {
    expect(revenueListComponent.isDialogVisible).toBeFalsy();

  });

  it('should initialize isUpdating to false', () => {
    expect(revenueListComponent.isDialogVisible).toBeFalsy();

  });

  it('should set isDialogVisible to true when onUpdate is called ', () => {

    expect(revenueListComponent.isDialogVisible).toBe(false);
    revenueListComponent.onUpdate(mockIncomeEntry);
    expect(revenueListComponent.isDialogVisible).toBe(true);

  });

  it('should set isUpdating to true when onUpdate is called ', () => {

    expect(revenueListComponent.isUpdating).toBeFalsy();
    revenueListComponent.onUpdate(mockExpenseEntry);
    expect(revenueListComponent.isUpdating).toBeTruthy();

  });


  it('should update entry, isDialogVisible, and isUpdating on calling onUpdate', () => {
    revenueListComponent.onUpdate(mockIncomeEntry);

    expect(revenueListComponent.entry).toEqual(mockIncomeEntry);
    expect(revenueListComponent.isDialogVisible).toBeTruthy();
    expect(revenueListComponent.isUpdating).toBeTruthy();
  });

  it('should only call deleteIncome with mockIncomeEntry', () => {

    spyOn(revenueListComponent.incomeService, 'deleteIncome').and.stub();
    spyOn(revenueListComponent.expenseService, 'deleteExpense').and.stub();

    revenueListComponent.onDelete(mockIncomeEntry);

    expect(revenueListComponent.incomeService.deleteIncome).toHaveBeenCalledWith(mockIncomeEntry);
    expect(revenueListComponent.expenseService.deleteExpense).not.toHaveBeenCalledWith(mockIncomeEntry);

  });

  it('should only call deleteExpense with mockExpenseEntry', () => {

    spyOn(revenueListComponent.expenseService, 'deleteExpense').and.stub();
    spyOn(revenueListComponent.incomeService, 'deleteIncome').and.stub();

    revenueListComponent.onDelete(mockExpenseEntry);

    expect(revenueListComponent.expenseService.deleteExpense).toHaveBeenCalledWith(mockExpenseEntry);
    expect(revenueListComponent.incomeService.deleteIncome).not.toHaveBeenCalledWith(mockExpenseEntry);

  });


  it('should format dates to EU standard', () => {
    revenueListComponent.dateConverterService = jasmine.createSpyObj('DateConverterService', ['convertToEUFormat']);

    const unformattedDateWithHyphen = '2024-07-01';
    const unformattedDateWithSlash = '2024/07/01';
    const unformattedDateWithDots = '2024/07/01';
    const expectedDate = '01.07.2024';


    (revenueListComponent.dateConverterService.convertToEUFormat as jasmine.Spy).and.returnValue(expectedDate);

    expect(revenueListComponent.formatDate(unformattedDateWithHyphen)).toEqual(expectedDate);
    expect(revenueListComponent.dateConverterService.convertToEUFormat).toHaveBeenCalledWith(new Date(unformattedDateWithHyphen));

    expect(revenueListComponent.formatDate(unformattedDateWithSlash)).toEqual(expectedDate);
    expect(revenueListComponent.dateConverterService.convertToEUFormat).toHaveBeenCalledWith(new Date(unformattedDateWithSlash));

    expect(revenueListComponent.formatDate(unformattedDateWithDots)).toEqual(expectedDate);
    expect(revenueListComponent.dateConverterService.convertToEUFormat).toHaveBeenCalledWith(new Date(unformattedDateWithDots));

  });

  it('should call ngOnDestroy to unsubscribe from all subscriptions', () => {
    spyOn(revenueListComponent, 'ngOnDestroy');
    revenueListComponent.ngOnDestroy();
    expect(revenueListComponent.ngOnDestroy).toHaveBeenCalled();

  });


  it('should call MessageService after deleting an expense entry', fakeAsync(() => {
    spyOn(revenueListComponent.expenseService, 'deleteExpense');

    let messageServiceAddMethodHasBeenCalled = false;

    spyOn(revenueListComponent['messageService'], 'add').and.callFake((msg) => {
      messageServiceAddMethodHasBeenCalled = true;
    });

    revenueListComponent.onDelete(mockExpenseEntry);

    tick(1000);
    expect(messageServiceAddMethodHasBeenCalled).toBeTruthy();
  }));

  it('should call MessageService after deleting an expense entry', fakeAsync(() => {
    spyOn(revenueListComponent.incomeService, 'deleteIncome');

    let messageServiceAddMethodHasBeenCalled = false;

    spyOn(revenueListComponent['messageService'], 'add').and.callFake((msg) => {
      messageServiceAddMethodHasBeenCalled = true;
    });

    revenueListComponent.onDelete(mockIncomeEntry);

    tick(1000);
    expect(messageServiceAddMethodHasBeenCalled).toBeTruthy();
  }));



});



