import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceDatesComponent } from './attendance-dates.component';

describe('AttendanceDatesComponent', () => {
  let component: AttendanceDatesComponent;
  let fixture: ComponentFixture<AttendanceDatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceDatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
