import { ClsFormDece } from '@/app/core/classForm/cls-form-dece';
import { InterfaceDece } from '@/app/core/interfaces/interface-dece';
import { InterfaceInstitution } from '@/app/core/interfaces/interface-institution';
import { DeceService } from '@/app/shared/services/api/dece.service';
import { InstitutionService } from '@/app/shared/services/api/institution.service';
import { PersonaService } from '@/app/shared/services/api/persona.service';
import { ControlErrorService } from '@/app/shared/services/utils/controlErrorService';
import { NotificationsService } from '@/app/shared/services/utils/notifications.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
})
export class EditarComponent implements OnInit {
  public formDece = new ClsFormDece();
  public dece?: InterfaceDece;
  public instituciones: InterfaceInstitution[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public id: any;

  constructor(
    public controlError: ControlErrorService,
    public notification: NotificationsService,
    private institutionService: InstitutionService,
    private deceService: DeceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.formDece.form.reset();
    this.getInstitutions();
    this.getDece();
  }

  update() {
    //destructuring object
    const { CI, name, lastName, address, phone, email, nameInstitution } =
      this.formDece.form.value;
    const updateDece: InterfaceDece = {
      CI,
      name,
      lastName,
      address,
      phone,
      email,
      nameInstitution,
    };

    /* ***************** */
    this.deceService.updateDece(this.id, updateDece).subscribe(
      (res) => {
        const { message } = res;
        console.log(message);
        this.notification.showSuccess(
          'Actualizado',
          message
        );
        this.router.navigate(['../../listar'], { relativeTo: this.route });
      },
      (error) => {
        if (error.status === 0) {
          this.notification.showError(
            'Error ',
            'No se pudo conectar con el servidor'
          );
        } else {
          console.log(error)
          this.notification.showError('Error ', error.error.error);
        }
      }
    );
  }

  getDece() {
    this.deceService.getDece(this.id).subscribe(
      (res) => {
        const { message, data } = res;
        this.dece = data;
        console.log(message);
        this.setValues(this.dece as InterfaceDece);
      },
      (error) => {
        if (error.status === 0) {
          this.notification.showError(
            'Error ',
            'No se pudo conectar con el servidor'
          );
        } else {
          console.log(error);
        }
      }
    );
  }

  setValues(dece: InterfaceDece) {
    this.formDece.form.setValue({
      CI: dece.CI,
      name: dece.name,
      lastName: dece.lastName,
      address: dece.address,
      phone: dece.phone,
      email: dece.email,
      nameInstitution: dece.nameInstitution,
    });
    this.formDece.form.markAllAsTouched();
  }

  getInstitutions() {
    this.institutionService.getAllInstitution().subscribe(
      (res) => {
        const { message, data } = res;
        this.instituciones = data;
        console.log(message);
      },
      (error) => {
        if (error.status === 0) {
          this.notification.showError(
            'Error ',
            'No se pudo conectar con el servidor'
          );
        } else {
          console.log(error);
        }
      }
    );
  }

  cancel() {
    this.router.navigate(['../../listar'], { relativeTo: this.route });
  }
}
