import { ComponentFixture, TestBed, async } from '@angular/core/testing'; 
import { CreateEntryButtonComponent } from './create-entry-button.component'; // Import component you want to test
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

    it('should create the component', () => {

        expect(createEntryButtonComponent).toBeTruthy();
    });

    it('should have title "Neuer Eintrag" by default', () => {
        expect(createEntryButtonComponent.title).toBe("Neuer Eintrag");
      });


    it('should initialize isDialogVisible to false', () => {

        expect(createEntryButtonComponent.isDialogVisible).toBeFalsy();
    });

    it('should set isDialogVisible to true when onOpenDialog is called', () => {
        createEntryButtonComponent.onOpenDialog();
        expect(createEntryButtonComponent.isDialogVisible).toBe(true);
    });


      it('should update selectedDate when currentDate changes', () => {
        const newDate = new Date('2024-06-24')
        const oldDate = new Date('2024-06-23')
        createEntryButtonComponent.currentDate = oldDate;
        createEntryButtonComponent.ngOnChanges({
          currentDate: {
            currentValue: newDate,
            previousValue: oldDate,
            firstChange: true,
            isFirstChange: () => true
          }
        });
    
        expect(createEntryButtonComponent.selectedDate).toBe(newDate);
      });



      it('should not change selectedDate if currentDate input does not change', () => {
        const initialDate = new Date();
        createEntryButtonComponent.currentDate = initialDate;
        createEntryButtonComponent.ngOnChanges({
          currentDate: {
            currentValue: initialDate,
            previousValue: null,
            firstChange: true,
            isFirstChange: () => true
          }
        });

        const selectedDateAfterFirstChange = createEntryButtonComponent.selectedDate;
        
        // fake change where currentDate does not actually change
        createEntryButtonComponent.ngOnChanges({
          currentDate: {
            currentValue: initialDate,
            previousValue: initialDate,
            firstChange: true,
            isFirstChange: () => true
          }
        });
        
      
    
        // selectedDate should remain the same as initialDate
        expect(createEntryButtonComponent.selectedDate).toBe(selectedDateAfterFirstChange);
      });



});
