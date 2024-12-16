import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViajeActualPage } from './viaje-actual.page';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importar AngularFirestore

describe('ViajeActualPage', () => {
  let component: ViajeActualPage;
  let fixture: ComponentFixture<ViajeActualPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViajeActualPage],
      providers: [
        FirestoreService,
        { provide: AngularFirestore, useValue: {} }, // Mock de AngularFirestore
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViajeActualPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
