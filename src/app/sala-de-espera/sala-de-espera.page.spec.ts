import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalaDeEsperaPage } from './sala-de-espera.page';

describe('SalaDeEsperaPage', () => {
  let component: SalaDeEsperaPage;
  let fixture: ComponentFixture<SalaDeEsperaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaDeEsperaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
