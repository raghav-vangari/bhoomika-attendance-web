import { TestBed } from '@angular/core/testing';

import { AttendanceDateService } from './attendance-date.service';

describe('AttendanceDateService', () => {
  let service: AttendanceDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendanceDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
