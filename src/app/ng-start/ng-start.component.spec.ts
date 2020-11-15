import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgStartComponent } from './ng-start.component';

describe('NgStartComponent', () => {
  let component: NgStartComponent;
  let fixture: ComponentFixture<NgStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgStartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
