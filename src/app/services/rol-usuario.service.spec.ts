import { TestBed } from '@angular/core/testing';
import { RolUsuarioService } from './rol-usuario.service';

describe('RolUsuarioService', () => {
  let service: RolUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolUsuarioService);
  });

  it('deberia crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('deberia establecer y obtener el rol del usuario', () => {
    service.setRolUsuario('conductor');
    expect(service.getRolUsuario()).toBe('conductor');
  });

  it('deberia retornar verdadero si el usuario es conductor', () => {
    service.setRolUsuario('conductor');
    expect(service.esConductor()).toBeTrue();
  });

  it('deberia retornar falso si el usuario no es conductor', () => {
    service.setRolUsuario('pasajero');
    expect(service.esConductor()).toBeFalse();
  });

  it('deberia retornar verdadero si el usuario es pasajero', () => {
    service.setRolUsuario('pasajero');
    expect(service.esPasajero()).toBeTrue();
  });

  it('deberia retornar falso si el usuario no es pasajero', () => {
    service.setRolUsuario('conductor');
    expect(service.esPasajero()).toBeFalse();
  });
});
