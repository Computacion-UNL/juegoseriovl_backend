import { ClsFormInstitution } from '@/app/core/classForm/cls-form-institution';
import { InterfaceInstitution } from '@/app/core/interfaces/interface-institution';
import { InstitutionService } from '@/app/shared/services/api/institution.service';
import { ControlErrorService } from '@/app/shared/services/utils/controlErrorService';
import { NotificationsService } from '@/app/shared/services/utils/notifications.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-institucion',
  templateUrl: './editar-institucion.component.html',
  styleUrls: ['./editar-institucion.component.css'],
})
export class EditarInstitucionComponent implements OnInit {
  public formInstitucion = new ClsFormInstitution();
  private institucion?: InterfaceInstitution;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private id: any;

  constructor(
    public controlError: ControlErrorService,
    public notification: NotificationsService,
    private serviceIntitucion: InstitutionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.formInstitucion.form.reset();
    this.id = this.route.snapshot.paramMap.get('id');
    this.getInstitution();
  }

  getInstitution() {
    this.serviceIntitucion.getInstitution(this.id).subscribe(
      (res) => {
        this.institucion = res.data;
        this.setValues(this.institucion);
      },
      (error) => {
        if (error.status === 0) {
          this.notification.showError(
            'Error de conexión',
            'No se ha podido conectar con el servidor'
          );
        } else {
          this.notification.showError(
            'Error al obtener institución',
            'Ha ocurrido un error al obtener la información'
          );
        }
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValues(data: any) {
    this.formInstitucion.form.setValue({
      nameInstitution: data?.nameInstitution,
      addressInstitution: data?.addressInstitution,
      phoneInstitution: data?.phoneInstitution,
      emailInstitution: data?.emailInstitution,
      typeInstitution: data?.typeInstitution,
      stateInstitution: data?.stateInstitution,
      cityInstitution: data?.cityInstitution,
    });
    //se marcan los campos como tocados
    this.formInstitucion.form.markAllAsTouched();
  }

  update() {
    //desestructuración de objeto
    const {
      nameInstitution,
      addressInstitution,
      phoneInstitution,
      emailInstitution,
      typeInstitution,
      stateInstitution,
      cityInstitution,
    } = this.formInstitucion.form.value;
    //validación de campos
    if (this.formInstitucion.form.invalid) {
      return Object.values(this.formInstitucion.form.controls).forEach(
        (control) => {
          control.markAsTouched();
        }
      );
    }

    const updateInstitution: InterfaceInstitution = {
      nameInstitution,
      addressInstitution,
      phoneInstitution,
      emailInstitution,
      typeInstitution,
      stateInstitution,
      cityInstitution,
    };

    this.serviceIntitucion
      .updateInstitution(this.id, updateInstitution)
      .subscribe(
        (res) => {
          const { message } = res;
          console.log(message);
          this.notification.showSuccess(
            'Actualizado',
            'La institución se ha actualizado correctamente'
          );
          this.router.navigate(['../../listar'], { relativeTo: this.route });
        },
        (error) => {
          if (error.status === 0) {
            this.notification.showError(
              'Error',
              'No se ha podido conectar con el servidor'
            );
          } else {
            this.notification.showError(
              'Error al actualizar institución',
              'Ha ocurrido un error al actualizar la información'
            );
          }
        }
      );
  }

  cancel() {
    this.router.navigate(['../../listar'], { relativeTo: this.route });
  }
}
