import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoDeViajesPage } from './listado-de-viajes.page';

describe('ListadoDeViajes', () => {
  let component: ListadoDeViajesPage;
  let fixture: ComponentFixture<ListadoDeViajesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoDeViajesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
