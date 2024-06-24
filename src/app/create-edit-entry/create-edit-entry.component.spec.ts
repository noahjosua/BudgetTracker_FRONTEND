import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CreateEditEntryComponent } from './create-edit-entry.component'; // Import component you want to test

import {CUSTOM_ELEMENTS_SCHEMA, SimpleChange, SimpleChanges} from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

import { IncomeService } from '../services/income.service';
import { ExpenseService } from '../services/expense.service';


describe('testing CreateEditEntryComponent', () => {
  let createEditEntryComponent: CreateEditEntryComponent;
  let objInstance: ComponentFixture<CreateEditEntryComponent>;
  let cancelButton: HTMLButtonElement;


  beforeEach(async () => {
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
        MessageService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {

    objInstance = TestBed.createComponent(CreateEditEntryComponent);
    createEditEntryComponent = objInstance.componentInstance;
    objInstance.detectChanges();

    cancelButton = objInstance.nativeElement.querySelector('.p-button[label=\'buttons.cancel\']');
  });

  it('Component created.', () => {
    expect(createEditEntryComponent).toBeTruthy();
  })

  it('Validation variables initialized to false.', () => {

    expect(createEditEntryComponent.validation.isTypeChosen).toBeFalsy();
    expect(createEditEntryComponent.validation.isAmountValid).toBeFalsy();
    expect(createEditEntryComponent.validation.isDesValid).toBeFalsy();
    expect(createEditEntryComponent.validation.isCategoryChosen).toBeFalsy();

  })

 /* it('onCancel() is called when button clicked (Event Emitter)', () => {
    spyOn(createEditEntryComponent, 'onCancel');

    cancelButton.click();

    expect(createEditEntryComponent.onCancel).toHaveBeenCalled();

  })
*/

  it('reset() is called when onCancel() is called.', () => {
    spyOn(createEditEntryComponent as any, 'reset');


    createEditEntryComponent.onCancel();
    expect((createEditEntryComponent as any).reset).toHaveBeenCalled();
  })

  it('clearEntry() and clearValidation() are called when onCancel() is called.', () => {
    spyOn(createEditEntryComponent as any, 'clearEntry');
    spyOn(createEditEntryComponent as any, 'clearValidation');

    createEditEntryComponent.onCancel();

    expect((createEditEntryComponent as any).clearEntry).toHaveBeenCalled();
    expect((createEditEntryComponent as any).clearValidation).toHaveBeenCalled();
  })

});
