import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeConductorPage } from './home-conductor.page';
import { ModalController, AngularDelegate } from '@ionic/angular';

describe('HomeConductorPage', () => {
  let component: HomeConductorPage;
  let fixture: ComponentFixture<HomeConductorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeConductorPage],
      providers: [
        ModalController,
        { provide: AngularDelegate, useValue: {} }, // Mock de AngularDelegate
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeConductorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
