import { TestBed } from '@angular/core/testing';

import { ProcedimentosService } from './procedimentos.service';

describe('ProcedimentosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProcedimentosService = TestBed.get(ProcedimentosService);
    expect(service).toBeTruthy();
  });
});
