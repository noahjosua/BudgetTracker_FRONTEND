import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { RevenueListComponent } from './revenue-list.component';
import { IncomeService } from '../services/income.service';
import { ExpenseService } from '../services/expense.service';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core'; //Otherwise it won't recognize html stuff like buttons or links to other components
import { By } from '@angular/platform-browser';

describe('testing RevenueListComponent', () => {
    let revenueListComponent: RevenueListComponent;
    let fixture: ComponentFixture<RevenueListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
          imports: [
            HttpClientTestingModule,
            FormsModule,
            //ReactiveFormsModule,
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
        fixture = TestBed.createComponent(RevenueListComponent);
        revenueListComponent = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(revenueListComponent).toBeTruthy();
    });


    


});