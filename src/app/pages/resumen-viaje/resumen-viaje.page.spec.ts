import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResumenViajePage } from './resumen-viaje.page';
import { ActivatedRoute } from '@angular/router'; // Importar ActivatedRoute
import { of } from 'rxjs'; // Para simular un observable

describe('ResumenViajePage', () => {
  let component: ResumenViajePage;
  let fixture: ComponentFixture<ResumenViajePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResumenViajePage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: '123' }) }, // Mock de ActivatedRoute
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenViajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
