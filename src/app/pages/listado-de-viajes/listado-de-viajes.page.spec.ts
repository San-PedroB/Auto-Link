import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoDeViajesPage } from './listado-de-viajes.page';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importar AngularFirestore

describe('ListadoDeViajesPage', () => {
  let component: ListadoDeViajesPage;
  let fixture: ComponentFixture<ListadoDeViajesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListadoDeViajesPage],
      providers: [
        FirestoreService,
        { provide: AngularFirestore, useValue: {} }, // Mock de AngularFirestore
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoDeViajesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
