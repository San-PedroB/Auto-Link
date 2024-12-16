import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalaDeEsperaPage } from './sala-de-espera.page';
import { FirestoreService } from '../services/firestore/firestore.service';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importar AngularFirestore

describe('SalaDeEsperaPage', () => {
  let component: SalaDeEsperaPage;
  let fixture: ComponentFixture<SalaDeEsperaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalaDeEsperaPage],
      providers: [
        FirestoreService,
        { provide: AngularFirestore, useValue: {} }, // Mock de AngularFirestore
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaDeEsperaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
