import { TestBed } from '@angular/core/testing';

import { ConditionnementService } from './conditionnement.service';

describe('ConditionnementService', () => {
  let service: ConditionnementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConditionnementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
