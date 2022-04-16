import { TestBed } from '@angular/core/testing';

import { RationCalculatorService } from './ration-calculator.service';

describe('RationCalculatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RationCalculatorService = TestBed.get(RationCalculatorService);
    expect(service).toBeTruthy();
  });
});
