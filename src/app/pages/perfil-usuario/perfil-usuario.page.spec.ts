import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilUsuarioPage } from './perfil-usuario.page';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importar AngularFirestore

describe('PerfilUsuarioPage', () => {
  let component: PerfilUsuarioPage;
  let fixture: ComponentFixture<PerfilUsuarioPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfilUsuarioPage],
      providers: [
        FirestoreService,
        { provide: AngularFirestore, useValue: {} }, // Mock de AngularFirestore
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
