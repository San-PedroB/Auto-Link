import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalLoginComponent } from './modal-login.component';
import { ModalController, AngularDelegate } from '@ionic/angular';

describe('ModalLoginComponent', () => {
  let component: ModalLoginComponent;
  let fixture: ComponentFixture<ModalLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalLoginComponent],
      providers: [
        ModalController,
        { provide: AngularDelegate, useValue: {} }, // Mock de AngularDelegate
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
