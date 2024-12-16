import { TestBed } from '@angular/core/testing';
import { FirestoreService } from './firestore.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';

describe('FirestoreService', () => {
  let service: FirestoreService;

  // Mock para AngularFirestore
  const angularFirestoreMock = {
    collection: jasmine.createSpy('collection').and.returnValue({
      valueChanges: jasmine.createSpy('valueChanges').and.returnValue(of([])),
      doc: jasmine.createSpy('doc').and.returnValue({
        set: jasmine.createSpy('set'),
        update: jasmine.createSpy('update'),
        delete: jasmine.createSpy('delete'),
      }),
    }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FirestoreService,
        { provide: AngularFirestore, useValue: angularFirestoreMock }, // Mock más detallado
      ],
    });
    service = TestBed.inject(FirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
