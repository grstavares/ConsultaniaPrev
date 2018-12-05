import { TestBed } from '@angular/core/testing';

import { OuvidoriaService } from './ouvidoria.service';

describe('OuvidoriaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OuvidoriaService = TestBed.get(OuvidoriaService);
    expect(service).toBeTruthy();
  });
});
