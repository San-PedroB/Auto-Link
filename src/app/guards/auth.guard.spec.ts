import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard],
    });

    guard = TestBed.inject(AuthGuard); // Usa TestBed para inyectar el guard
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});