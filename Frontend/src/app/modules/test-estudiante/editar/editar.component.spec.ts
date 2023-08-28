import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarComponent } from './editar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('EditarComponent', () => {
  let component: EditarComponent;
  let fixture: ComponentFixture<EditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarComponent ],
      imports: [HttpClientTestingModule,ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
