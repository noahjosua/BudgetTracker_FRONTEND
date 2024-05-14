import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditEntryComponent } from './create-edit-entry.component';

describe('CreateEditEntryComponent', () => {
  let component: CreateEditEntryComponent;
  let fixture: ComponentFixture<CreateEditEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateEditEntryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateEditEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
