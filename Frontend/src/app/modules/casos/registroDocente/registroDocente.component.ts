import { ClsFormDocente } from '@/app/core/classForm/cls-form-docente';
import { InterfaceInstitution } from '@/app/core/interfaces/interface-institution';
import { EvaluatorRole } from '@/app/core/interfaces/interface-roleEvaluator';
import { AuthService } from '@/app/shared/services/api/auth.service';
import { DocenteService } from '@/app/shared/services/api/docente.service';
import { InstitutionService } from '@/app/shared/services/api/institution.service';
import { ControlErrorService } from '@/app/shared/services/utils/controlErrorService';
import { NotificationsService } from '@/app/shared/services/utils/notifications.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registroDocente',
  templateUrl: './registroDocente.component.html',
  styleUrls: ['./registroDocente.component.css'],
})
export class RegistroDocenteComponent implements OnInit {
  public formDocente = new ClsFormDocente();
  public institucion:any;
  public teacher?: EvaluatorRole;

  constructor(
    public controlError: ControlErrorService,
    public notification: NotificationsService,
    private teacherService: DocenteService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formDocente.form.reset();
    this.institucion = this.authService.getInstitution();
  }

  create() {
    const { CI, name, lastName, address, phone, email } =
      this.formDocente.form.value;

    const body = {
      CI,
      name,
      lastName,
      address,
      phone,
      email,
      nameInstitution: this.institucion,
    };

    this.teacherService.createTeacher(body).subscribe(
      (res) => {
        const { message } = res;
        this.notification.showSuccess('Registro', message);
        console.log(message);
        this.router.navigate(['../docentes'], { relativeTo: this.route });
      },
      (err) => {
        if (err.status === 0) {
          this.notification.showError(
            'Error',
            'Error de conexión con el servidor'
          );
        } else {
          this.notification.showError('Error', err.error.error);
          console.log(err);
        }
      }
    );
  }

 


  cancel() {
    this.router.navigate(['../docentes'], { relativeTo: this.route });
  }
}
