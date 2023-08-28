import { ClsFormInstitution } from '@/app/core/classForm/cls-form-institution';
import { InterfaceInstitution } from '@/app/core/interfaces/interface-institution';
import { InstitutionService } from '@/app/shared/services/api/institution.service';
import { ControlErrorService } from '@/app/shared/services/utils/controlErrorService';
import { NotificationsService } from '@/app/shared/services/utils/notifications.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registrar-institucion',
  templateUrl: './registrar-institucion.component.html',
  styleUrls: ['./registrar-institucion.component.css'],
})
export class RegistrarInstitucionComponent implements OnInit {
  public selectedOption?: string;

  public formInstitucion = new ClsFormInstitution();

  constructor(
    private serviceIntitucion: InstitutionService,
    public controlError: ControlErrorService,
    public notification: NotificationsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.formInstitucion.form.reset();
  }

  create() {
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

    const newInstitution: InterfaceInstitution = {
      nameInstitution,
      addressInstitution,
      phoneInstitution,
      emailInstitution,
      typeInstitution,
      stateInstitution,
      cityInstitution,
    };

    this.serviceIntitucion.createInstitution(newInstitution).subscribe(
      (res) => {
        // this.notify.showSuccess('Institución registrada', 'La institución se ha registrado correctamente');
        console.log(res.message);
        this.notification.showSuccess(
          'Registro',
          'La institución se ha registrado correctamente'
        );
        this.router.navigate(['../listar'], { relativeTo: this.route });
      },
      (error) => {
        if (error.status === 0) {
          this.notification.showError(
            'Error',
            'Error de conexión con el servidor'
          );
        } else {
          this.notification.showError(
            'Error',
            'Ha ocurrido un error al registrar la institución'
          );
          console.log(error.error);
        }
      }
    );
  }

  cancel() {
    this.router.navigate(['../listar'], { relativeTo: this.route });
  }
}
