import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CreateEntryButtonComponent } from './create-entry-button.component'; // Import component you want to test
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core'; //Otherwise it won't recognize html stuff like buttons or links to other components

describe('testing CreateEntryButtonComponent', () => {
  let createEntryButtonComponent: CreateEntryButtonComponent;
  let componentFixture: ComponentFixture<CreateEntryButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateEntryButtonComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
  }));

  beforeEach(() => {
    componentFixture = TestBed.createComponent(CreateEntryButtonComponent);
    createEntryButtonComponent = componentFixture.componentInstance;
    componentFixture.detectChanges();
  });

  it('should create the component', () => {

    expect(createEntryButtonComponent).toBeTruthy();
  });

  it('should have title "Neuer Eintrag" by default', () => {
    expect(createEntryButtonComponent.title).toEqual("Neuer Eintrag");
  });


  it('should initialize isDialogVisible to false', () => {
    expect(createEntryButtonComponent.isDialogVisible).toBeFalsy();
  });

  it('should set isDialogVisible to true when onOpenDialog is called', () => {
    expect(createEntryButtonComponent.isDialogVisible).toBeFalsy();
    createEntryButtonComponent.onOpenDialog();
    expect(createEntryButtonComponent.isDialogVisible).toBeTruthy();
  });


});

