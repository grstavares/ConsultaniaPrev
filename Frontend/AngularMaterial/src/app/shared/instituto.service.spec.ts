import { TestBed } from '@angular/core/testing';

import { InstitutoService } from './instituto.service';

describe('InstitutoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InstitutoService = TestBed.get(InstitutoService);
    expect(service).toBeTruthy();
  });
});
