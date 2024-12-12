import { TestBed } from '@angular/core/testing';

import { GuardarCorreoService } from './guardar-correo.service';

describe('GuardarCorreoService', () => {
  let service: GuardarCorreoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuardarCorreoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
