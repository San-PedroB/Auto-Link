import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePasajeroPage } from './home-pasajero.page';
import { ModalController, AngularDelegate } from '@ionic/angular';

describe('HomePasajeroPage', () => {
  let component: HomePasajeroPage;
  let fixture: ComponentFixture<HomePasajeroPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePasajeroPage],
      providers: [
        ModalController,
        { provide: AngularDelegate, useValue: {} }, // Mock de AngularDelegate
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePasajeroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
