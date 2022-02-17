import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleChildComponent } from './example-child.component';

describe('ExampleChildComponent', () => {
  let component: ExampleChildComponent;
  let fixture: ComponentFixture<ExampleChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExampleChildComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExampleChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
