import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarDocenteComponent } from './listar-docente.component';

describe('ListarDocenteComponent', () => {
  let component: ListarDocenteComponent;
  let fixture: ComponentFixture<ListarDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarDocenteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
