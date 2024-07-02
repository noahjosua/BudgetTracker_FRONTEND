import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {CreateEditEntryComponent} from './create-edit-entry.component';

import {CUSTOM_ELEMENTS_SCHEMA, SimpleChange, SimpleChanges} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateService, TranslateModule} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';

import {IncomeService} from '../services/income.service';
import {ExpenseService} from '../services/expense.service';


describe('testing CreateEditEntryComponent', () => {
  let createEditEntryComponent: CreateEditEntryComponent;
  let fixture: ComponentFixture<CreateEditEntryComponent>;
  let testDate: Date;


  beforeEach(async () => {
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
      ],

      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditEntryComponent);
    createEditEntryComponent = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('component created', () => {
    expect(createEditEntryComponent).toBeTruthy();
  });

  it('validation variables initialized to false', () => {

    expect(createEditEntryComponent.validation.isTypeChosen).toBeFalsy();
    expect(createEditEntryComponent.validation.isAmountValid).toBeFalsy();
    expect(createEditEntryComponent.validation.isDesValid).toBeFalsy();
    expect(createEditEntryComponent.validation.isCategoryChosen).toBeFalsy();

  });

  it('should emit visibilityChanged event when onCancel() is called', () => {
    spyOn(createEditEntryComponent.visibilityChanged, 'emit');
    createEditEntryComponent.onCancel();
    expect(createEditEntryComponent.visibilityChanged.emit).toHaveBeenCalledWith(false);
  });


  it('reset() is called when onCancel() is called', () => {
    spyOn(createEditEntryComponent as any, 'reset');


    createEditEntryComponent.onCancel();
    expect((createEditEntryComponent as any).reset).toHaveBeenCalled();
  });

  it('clearEntry() and clearValidation() are called when onCancel() is called', () => {
    spyOn(createEditEntryComponent as any, 'clearEntry');
    spyOn(createEditEntryComponent as any, 'clearValidation');

    createEditEntryComponent.onCancel();

    expect((createEditEntryComponent as any).clearEntry).toHaveBeenCalled();
    expect((createEditEntryComponent as any).clearValidation).toHaveBeenCalled();
  });


  it('onSave() should call onIsSaving() when isUpdating is true', () => {
    createEditEntryComponent.isUpdating = false;
    createEditEntryComponent.type = 'expense';
    createEditEntryComponent.newEntry = {
      dateCreated: testDate,
      datePlanned: testDate,
      category: 'Groceries',
      description: 'nom',
      amount: 100
    };

    spyOn(createEditEntryComponent as any, 'onIsSaving');
    createEditEntryComponent.onSave();

    expect((createEditEntryComponent as any).onIsSaving).toHaveBeenCalled();
  });


  it('onSave() should call onIsUpdating() when isUpdating is true', () => {
    createEditEntryComponent.isUpdating = true;
    createEditEntryComponent.type = 'expense';
    createEditEntryComponent.newEntry = {
      dateCreated: testDate,
      datePlanned: testDate,
      category: 'Groceries',
      description: 'nom',
      amount: 100
    };

    spyOn(createEditEntryComponent as any, 'onIsUpdating');
    createEditEntryComponent.onSave();

    expect((createEditEntryComponent as any).onIsUpdating).toHaveBeenCalled();
  });

  it('entryValidator() return true if all validation variables are true', () => {
    createEditEntryComponent.validation.isTypeChosen = createEditEntryComponent.validation.isAmountValid =
      createEditEntryComponent.validation.isCategoryChosen = createEditEntryComponent.validation.isDesValid = true;

    expect(createEditEntryComponent.entryValidator).toBeTruthy();
  });


  it('ngOnChanges() should call handleIsUpdatingChanges(), should call updateValidator() if isUpdating changes to true', () => {
    spyOn(createEditEntryComponent as any, 'handleIsUpdatingChanges');
    const exampleChanges: SimpleChanges = {
      isUpdating: new SimpleChange(false, true, true)
    };

    createEditEntryComponent.ngOnChanges(exampleChanges);
    expect((createEditEntryComponent as any).handleIsUpdatingChanges).toHaveBeenCalled();
  });

  
  it('handleIsUpdatingChanges() should call updateValidator() if isUpdating changes to true', () => {
    spyOn(createEditEntryComponent, 'updateValidator');

    const exampleChanges: SimpleChanges = {
      isUpdating: new SimpleChange(false, true, true)
    };

    createEditEntryComponent.ngOnChanges(exampleChanges);
    expect((createEditEntryComponent).updateValidator).toHaveBeenCalled();
  });

});
