import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEntryButtonComponent } from './create-entry-button.component';

describe('CreateEntryButtonComponent', () => {
  let component: CreateEntryButtonComponent;
  let fixture: ComponentFixture<CreateEntryButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateEntryButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateEntryButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
