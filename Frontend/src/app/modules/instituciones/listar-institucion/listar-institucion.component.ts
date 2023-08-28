import { InterfaceInstitution } from '@/app/core/interfaces/interface-institution';
import { FilterTablesPipe } from '@/app/shared/pipes/filter-tables.pipe';
import { InstitutionService } from '@/app/shared/services/api/institution.service';
import { NotificationsService } from '@/app/shared/services/utils/notifications.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listar-institucion',
  templateUrl: './listar-institucion.component.html',
  styleUrls: ['./listar-institucion.component.css'],
  providers: [FilterTablesPipe],
})
export class ListarInstitucionComponent implements OnInit {
  public instituciones: InterfaceInstitution[] = [];
  public search = '';
  public loading = true;

  constructor(
    private notification: NotificationsService,
    private institutionService: InstitutionService
  ) {}

  ngOnInit(): void {
        this.getInstitutions(); 
  }


  getInstitutions() {
    this.institutionService.getAllInstitution().subscribe(
      (res) => {
        const { message, data } = res;
        this.instituciones = data;
        this.loading = false;
        console.log(message);
      },
      (err) => {
        this.loading = false;
          this.notification.showError(
            'Error',
            'No se pudo obtener instituciones')
          console.log(err);
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteInstitution(id: any) {
    this.notification
      .showConfirm(
        'warning',
        'Eliminar institución',
        '¿Está seguro de eliminar la institución?',
        'Eliminar',
        'Cancelar'
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.institutionService.deleteInstitution(id).subscribe(
            (res) => {
              const { message } = res;
              console.log(message);
              this.notification.showSuccess(
                'Eliminado',
                'La institución se ha eliminado correctamente'
              );
              this.ngOnInit();
            },
            (err) => {
              if (err.status === 0) {
                this.notification.showError(
                  'Error',
                  'No se ha podido conectar con el servidor, intente más tarde'
                );
              } else {
                this.notification.showError('Error', err.error.error);
              }
            }
          );
        }
      });
  }
}
