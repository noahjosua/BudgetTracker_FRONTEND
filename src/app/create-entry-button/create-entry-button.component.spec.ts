import { ComponentFixture, TestBed, async } from '@angular/core/testing'; 
import { CreateEntryButtonComponent } from './create-entry-button.component'; // Import component you want to test
import { SimpleChange, SimpleChanges } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; //Otherwise it won't recognize html stuff like buttons or links to other components

describe('testing CreateEntryButtonComponent', () => {
    let createEntryButtonComponent: CreateEntryButtonComponent;
    let objInstance: ComponentFixture<CreateEntryButtonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateEntryButtonComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
    }));

    beforeEach(() => {
        objInstance = TestBed.createComponent(CreateEntryButtonComponent);
        createEntryButtonComponent = objInstance.componentInstance;
        objInstance.detectChanges();
    });

    it('should create component', () => {

        expect(createEntryButtonComponent).toBeTruthy();
    });


    it('should initialize isDialogVisible to false', () => {

        expect(createEntryButtonComponent.isDialogVisible).toBeFalsy();
    });

    it('should open dialog when onOpenDialog is called', () => {
        createEntryButtonComponent.onOpenDialog();
        expect(createEntryButtonComponent.isDialogVisible).toBe(true);
    });


    it('should update selectedDate when currentDate input changes', () => {
        const newDate = new Date();
        
        const changes: SimpleChanges = {
          currentDate: new SimpleChange(null, newDate, false)
        };
        createEntryButtonComponent.ngOnChanges(changes);
        expect(createEntryButtonComponent.selectedDate).toBe(newDate);
      });
    
      it('should not update selectedDate if currentDate input does not change', () => {
        const initialDate = new Date('2023-06-23');
        createEntryButtonComponent.selectedDate = initialDate;
        const changes: SimpleChanges = {};
        createEntryButtonComponent.ngOnChanges(changes);
        expect(createEntryButtonComponent.selectedDate).toBe(initialDate);
      });



});
