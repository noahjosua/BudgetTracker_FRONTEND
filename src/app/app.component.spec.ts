import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { IncomeService } from './services/income.service';
import { ExpenseService } from './services/expense.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { of } from 'rxjs';
import { Entry } from './model/entry.model';
import { Constants } from './constants';


describe('testing AppComponent', () => {
    let appComponent: AppComponent;
    let componentFixture: ComponentFixture<AppComponent>;
    let incomeServiceStub: Partial<IncomeService>;
    let expenseServiceStub: Partial<ExpenseService>;

    const mockIncomeEntry: Entry = {
        id: 1, type: Constants.INCOME, amount: 100,
        datePlanned: new Date(),
        dateCreated: new Date(),
        category: undefined,
        description: 'mock'
    };

    beforeEach(async () => {

        incomeServiceStub = {
            fetchIncomesByDate: () => { },
            getIncomesUpdatedListener: () => of([])
        };

        expenseServiceStub = {
            fetchExpensesByDate: () => { },
            getExpensesUpdatedListener: () => of([]),

        };


        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                FormsModule,
                TranslateModule.forRoot()
            ],
            declarations: [AppComponent],
            providers: [
                { provide: IncomeService, useValue: incomeServiceStub },
                { provide: ExpenseService, useValue: expenseServiceStub },
                TranslateService,
                MessageService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        componentFixture = TestBed.createComponent(AppComponent);
        appComponent = componentFixture.componentInstance;
        componentFixture.detectChanges();
    });

    afterEach(() => {
        componentFixture.destroy();
    });


    it('should create the component', () => {
        expect(appComponent).toBeTruthy();
    });

    it('should initialize showOnlyIncomes to false', () => {
        expect(appComponent.showOnlyIncomes).toBeFalsy();
    });

    it('should initialize showOnlyExpenses to false', () => {
        expect(appComponent.showOnlyExpenses).toBeFalsy();
    });

    it('should initialize showAllEntries to false', () => {
        expect(appComponent.showAllEntries).toBeFalsy();
    });

    it('should fetch incomes from service when ngOnInit is called', () => {
        const incomeService = TestBed.inject(IncomeService);
        const fetchIncomesSpy = spyOn(incomeService, 'fetchIncomesByDate').and.callThrough();
        appComponent.ngOnInit();

        expect(fetchIncomesSpy).toHaveBeenCalled();
    });

    it('should fetch expenses from service when ngOnInit is called', () => {
        const expenseService = TestBed.inject(ExpenseService);
        const fetchExpensesSpy = spyOn(expenseService, 'fetchExpensesByDate').and.callThrough();
        appComponent.ngOnInit();

        expect(fetchExpensesSpy).toHaveBeenCalled();
    });


    it('should update selectedDate when onDateChanged() is called', () => {
        const newDate = new Date('2024-07-01');
        appComponent.selectedDate = new Date('2024-06-01')

        appComponent.onDateChanged(newDate);

        expect(appComponent.selectedDate).toEqual(newDate);
    });

    it('should call fetchExpensesByDate() when onDateChanged() is called', () => {
        const newDate = new Date('2024-07-01');

        spyOn(appComponent.expenseService, 'fetchExpensesByDate');
        appComponent.onDateChanged(newDate);

        expect(appComponent.expenseService.fetchExpensesByDate).toHaveBeenCalled();
    });

    it('should call fetchIncomesByDate() when onDateChanged() is called', () => {
        const newDate = new Date('2024-07-01');

        spyOn(appComponent.incomeService, 'fetchIncomesByDate');
        appComponent.onDateChanged(newDate);

        expect(appComponent.incomeService.fetchIncomesByDate).toHaveBeenCalled();
    });



    it('should update total when updateTotal() is called', () => {
        appComponent.total_income = 500;
        appComponent.total_expense = 200;

        appComponent['updateTotal']();

        expect(appComponent.total).toEqual(300);
    });


    it('should set showOnlyExpenses and showAllEntries to false and showOnlyIncomes to true when showIncomes(true) is called', () => {
        appComponent.showIncomes(true);
        expect(appComponent.showOnlyIncomes).toBeTruthy()
        expect(appComponent.showOnlyExpenses).toBeFalsy();
        expect(appComponent.showAllEntries).toBeFalsy();
    });

    it('should not set showOnlyIncomes to true when showIncomes(false) is called', () => {
        appComponent.showIncomes(false);
        expect(appComponent.showOnlyIncomes).not.toBeTruthy()
    });

    it('should set showOnlyIncomes and showAllEntries to false and showOnlyIncomes to true when showExpenses(true) is called', () => {
        appComponent.showExpenses(true);
        expect(appComponent.showOnlyExpenses).toBeTruthy()
        expect(appComponent.showOnlyIncomes).toBeFalsy();
        expect(appComponent.showAllEntries).toBeFalsy();
    });

    it('should not set showOnlyExpenses to true when showExpenses(false) is called', () => {
        appComponent.showExpenses(false);
        expect(appComponent.showOnlyExpenses).not.toBeTruthy()
    });

    it('should set showOnlyIncomes and showOnlyExpenses to false and showAllEntries to true when showEntries(true) is called', () => {
        appComponent.showEntries(true);
        expect(appComponent.showAllEntries).toBeTruthy()
        expect(appComponent.showOnlyIncomes).toBeFalsy();
        expect(appComponent.showOnlyExpenses).toBeFalsy();
    });

    it('should not set showAllEntries to true when showEntries(false) is called', () => {
        appComponent.showEntries(false);
        expect(appComponent.showAllEntries).not.toBeTruthy()
    });



});