import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { RegistrarInstitucionComponent } from './registrar-institucion.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('RegistrarInstitucionComponent', () => {
  let component: RegistrarInstitucionComponent;
  let fixture: ComponentFixture<RegistrarInstitucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        RegistrarInstitucionComponent
       ],
       imports:[HttpClientTestingModule, ReactiveFormsModule
       ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarInstitucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
