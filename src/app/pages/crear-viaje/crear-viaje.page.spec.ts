import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearViajePage } from './crear-viaje.page';
import { ActivatedRoute } from '@angular/router'; // Importar ActivatedRoute
import { of } from 'rxjs'; // Para devolver un observable simulado

describe('CrearViajePage', () => {
  let component: CrearViajePage;
  let fixture: ComponentFixture<CrearViajePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearViajePage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: '123' }) }, // Mock de ActivatedRoute con parámetros simulados
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearViajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
