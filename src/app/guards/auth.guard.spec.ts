import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { FirestoreService } from '../services/firestore/firestore.service';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importar AngularFirestore

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        FirestoreService,
        { provide: AngularFirestore, useValue: {} }, // Mock de AngularFirestore
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
