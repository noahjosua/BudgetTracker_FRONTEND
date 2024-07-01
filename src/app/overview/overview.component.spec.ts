import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { OverviewComponent } from '../overview/overview.component';
import { IncomeService } from '../services/income.service';
import { ExpenseService } from '../services/expense.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


describe('testing OverviewComponent', () => {
  let overviewComponent: OverviewComponent;
  let componentFixture: ComponentFixture<OverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        TranslateModule.forRoot()
      ],
      declarations: [OverviewComponent],
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
    componentFixture = TestBed.createComponent(OverviewComponent);
    overviewComponent = componentFixture.componentInstance;
    componentFixture.detectChanges();
  });

  it('should create the component', () => {
    expect(overviewComponent).toBeTruthy();
  });

  it('should display income input values correctly', () => {
    overviewComponent.incomes = [{ name: 'Income1', amount: 100 }];
    overviewComponent.expenses = [{ name: 'Expense1', amount: 50 }];
    overviewComponent.total_income = 100;
    componentFixture.detectChanges();

    const nativeElement = componentFixture.nativeElement;
    //find total income in first <p> element of first .innercontainer
    const totalIncome = nativeElement.querySelector('.innerContainer:nth-child(1) p');

    expect(totalIncome.textContent).toBe('100€');

  });

  it('should display expense input values correctly', () => {
    overviewComponent.incomes = [{ name: 'Income1', amount: 100 }];
    overviewComponent.expenses = [{ name: 'Expense1', amount: 50 }];
    overviewComponent.total_expense = 50;
    componentFixture.detectChanges();

    const nativeElement = componentFixture.nativeElement;
    //find total expense in first <p> element of second .innercontainer
    const totalExpense = nativeElement.querySelector('.innerContainer:nth-child(2) p');

    expect(totalExpense.textContent).toBe('50€');
  });

  it('should display calculated total values correctly', () => {
    overviewComponent.incomes = [{ name: 'Income1', amount: 100 }];
    overviewComponent.expenses = [{ name: 'Expense1', amount: 50 }];
    overviewComponent.total = 50;
    componentFixture.detectChanges();

    const nativeElement = componentFixture.nativeElement;
    //find total in first <p> element of third .innercontainer
    const total = nativeElement.querySelector('.innerContainer:nth-child(3) p');

    expect(total.textContent).toBe('50€');
  });


  it('should emit showIncomes event when showOnlyIncomes is called', () => {
    spyOn(overviewComponent.showIncomes, 'emit');
    overviewComponent.showOnlyIncomes();
    expect(overviewComponent.showIncomes.emit).toHaveBeenCalled();
  });

  it('should emit showExpenses event when showOnlyExpenses is called', () => {
    spyOn(overviewComponent.showExpenses, 'emit');
    overviewComponent.showOnlyExpenses();
    expect(overviewComponent.showExpenses.emit).toHaveBeenCalled();
  });

  it('should emit showEntries event when showAllEntries is called', () => {
    spyOn(overviewComponent.showEntries, 'emit');
    overviewComponent.showAllEntries();
    expect(overviewComponent.showEntries.emit).toHaveBeenCalled();
  });

});