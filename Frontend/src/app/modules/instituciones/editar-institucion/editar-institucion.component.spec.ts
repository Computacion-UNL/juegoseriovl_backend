import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarInstitucionComponent } from './editar-institucion.component';

describe('EditarInstitucionComponent', () => {
  let component: EditarInstitucionComponent;
  let fixture: ComponentFixture<EditarInstitucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarInstitucionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarInstitucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
