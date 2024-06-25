import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { OverviewComponent } from '../overview/overview.component';
import { IncomeService } from '../services/income.service';
import { ExpenseService } from '../services/expense.service';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core'; //Otherwise it won't recognize html stuff like buttons or links to other components
import { By } from '@angular/platform-browser';

describe('testing OverviewComponent', () => {
    let overviewComponent: OverviewComponent;
    let fixture: ComponentFixture<OverviewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
          imports: [
            HttpClientTestingModule,
            FormsModule,
            //ReactiveFormsModule,
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
        fixture = TestBed.createComponent(OverviewComponent);
        overviewComponent = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(overviewComponent).toBeTruthy();
    });

    /*it('should display input values correctly', () => {
        const mockIncomes = [{ name: 'Income1', amount: 100 }];
        const mockExpenses = [{ name: 'Expense1', amount: 50 }];
        const mockTotalIncome = 100;
        const mockTotalExpense = 50;
        const mockTotal = 50;
    
        overviewComponent.incomes = mockIncomes;
        overviewComponent.expenses = mockExpenses;
        overviewComponent.total_income = mockTotalIncome;
        overviewComponent.total_expense = mockTotalExpense;
        overviewComponent.total = mockTotal;
        fixture.detectChanges();
    
        const totalIncomeElement: DebugElement = fixture.debugElement.query(By.css('.innerContainer:nth-child(1) p'));
        const totalExpenseElement: DebugElement = fixture.debugElement.query(By.css('.innerContainer:nth-child(2) p'));
        const totalElement: DebugElement = fixture.debugElement.query(By.css('.innerContainer:nth-child(3) p'));
    
        expect(totalIncomeElement.nativeElement.textContent).toContain('100€');
        expect(totalExpenseElement.nativeElement.textContent).toContain('50€');
        expect(totalElement.nativeElement.textContent).toContain('50€');
      });*/
    

    it('should emit showIncomes event when showOnlyIncomes is called', () => {
        spyOn(overviewComponent.showIncomes, 'emit'); //create spy on emit() function
        overviewComponent.showOnlyIncomes(); //call function that is supposed to call on emit()
        expect(overviewComponent.showIncomes.emit).toHaveBeenCalled(); //check if emit() has been called by showOnlyIncomes()
    });

    it('should emit showExpenses event when showOnlyExpenses is called', () => {
        spyOn(overviewComponent.showExpenses, 'emit'); //create spy on emit() function
        overviewComponent.showOnlyExpenses(); //call function that is supposed to call on emit()
        expect(overviewComponent.showExpenses.emit).toHaveBeenCalled(); //check if emit() has been called by showOnlyExpenses()
    });

    it('should emit showEntries event when showAllEntries is called', () => {
        spyOn(overviewComponent.showEntries, 'emit'); //create spy on emit() function
        overviewComponent.showAllEntries(); //call function that is supposed to call on emit()
        expect(overviewComponent.showEntries.emit).toHaveBeenCalled(); //check if emit() has been called by showAllEntries()
    });

});