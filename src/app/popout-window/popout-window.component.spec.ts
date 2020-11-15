import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoutWindowComponent } from './popout-window.component';

describe('PopoutWindowComponent', () => {
  let component: PopoutWindowComponent;
  let fixture: ComponentFixture<PopoutWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopoutWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoutWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
