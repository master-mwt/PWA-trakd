import { TestBed } from '@angular/core/testing';

import { LocalserverService } from './localserver.service';

describe('LocalserverService', () => {
  let service: LocalserverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalserverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
