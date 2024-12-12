import { TestBed } from '@angular/core/testing';

import { ServicioViajesService } from './servicio-viajes.service';

describe('ServicioViajesService', () => {
  let service: ServicioViajesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioViajesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
