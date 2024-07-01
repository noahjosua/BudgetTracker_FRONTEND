import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ToolbarComponent } from './toolbar.component';
import { IncomeService } from '../services/income.service';
import { ExpenseService } from '../services/expense.service';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';


describe('testing ToolbarComponent', () => {
    let toolbarComponent: ToolbarComponent;
    let componentFixture: ComponentFixture<ToolbarComponent>;
    let debugElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                FormsModule,
                TranslateModule.forRoot(),
                ButtonModule
            ],
            declarations: [ToolbarComponent],
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
        componentFixture = TestBed.createComponent(ToolbarComponent);
        toolbarComponent = componentFixture.componentInstance;
        componentFixture.detectChanges();
    });

    it('should call emitDateChanged`s emit when prevMonth() is called', () => {
        spyOn(toolbarComponent.dateChanged, 'emit');
        toolbarComponent.prevMonth();
        expect(toolbarComponent.dateChanged.emit).toHaveBeenCalled();
    });

    it('should call emitDateChanged`s emit when nextMonth() is called', () => {
        spyOn(toolbarComponent.dateChanged, 'emit');
        toolbarComponent.nextMonth();
        expect(toolbarComponent.dateChanged.emit).toHaveBeenCalled();
    });

    it('should emit correct month when nextMonth() is called', () => {
        spyOn(toolbarComponent.dateChanged, 'emit');

        const currentMonth = toolbarComponent.currentDate.getMonth();
        const newMonth = toolbarComponent.currentDate.getMonth() + 1;

        expect(toolbarComponent.currentDate.getMonth()).toBe(currentMonth);
        toolbarComponent.nextMonth();
        expect(toolbarComponent.currentDate.getMonth()).toBe(newMonth);

        expect(toolbarComponent.dateChanged.emit).toHaveBeenCalledWith(toolbarComponent.currentDate);

    });

    it('should emit correct month when prevMonth() is called', () => {
        spyOn(toolbarComponent.dateChanged, 'emit');

        const currentMonth = toolbarComponent.currentDate.getMonth();
        const newMonth = toolbarComponent.currentDate.getMonth() - 1;

        expect(toolbarComponent.currentDate.getMonth()).toBe(currentMonth);
        toolbarComponent.prevMonth();
        expect(toolbarComponent.currentDate.getMonth()).toBe(newMonth);

        expect(toolbarComponent.dateChanged.emit).toHaveBeenCalledWith(toolbarComponent.currentDate);

    });

    xit('should emit correct month when nextMonth() is called in december', () => {
        spyOn(toolbarComponent.dateChanged, 'emit');

        toolbarComponent.currentDate = new Date('2023-12-01');


        const currentMonth = toolbarComponent.currentDate.getMonth();
        const newMonth = toolbarComponent.currentDate.getMonth() + 1;

        expect(toolbarComponent.currentDate.getMonth()).toBe(currentMonth);
        toolbarComponent.nextMonth();
        expect(toolbarComponent.currentDate.getMonth()).toBe(newMonth);

        expect(toolbarComponent.dateChanged.emit).toHaveBeenCalledWith(toolbarComponent.currentDate);

    });

    it('should emit correct year when nextMonth() is called in december', () => {
        spyOn(toolbarComponent.dateChanged, 'emit');

        toolbarComponent.currentDate = new Date('2023-12-01');

        const currentYear = toolbarComponent.currentDate.getFullYear();
        const newYear = toolbarComponent.currentDate.getFullYear() + 1;


        expect(toolbarComponent.currentDate.getFullYear()).toBe(currentYear);
        toolbarComponent.nextMonth();
        expect(toolbarComponent.currentDate.getFullYear()).toBe(newYear);

        expect(toolbarComponent.dateChanged.emit).toHaveBeenCalledWith(toolbarComponent.currentDate);

    });

    });