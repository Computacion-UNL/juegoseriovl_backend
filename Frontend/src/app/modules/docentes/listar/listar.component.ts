import { DocenteService } from '@/app/shared/services/api/docente.service';
import { FilterTablesPipe } from '@/app/shared/pipes/filter-tables.pipe';
import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '@/app/shared/services/utils/notifications.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
  providers: [FilterTablesPipe],
})
export class ListarComponent implements OnInit {
  public docentes: TeacherData[] = [];
  public search = '';
  public loading = true;

  constructor(
    private notification: NotificationsService,
    private docenteService: DocenteService
  ) {}

  ngOnInit(): void {
    this.getTeachers();
  }

  getTeachers() {
    this.docenteService.getAllTeacher().subscribe(
      (res) => {
        const { message, data } = res;
        this.docentes = data;
        this.loading = false;
        console.log(message);
      },(err) => {
        console.log('Error:', err.error);
        this.loading = false;
        this.notification.showError('Error', 'No se pudo obtener el test');
      }
    );
  }
  
 

  delete(id: string) {
    this.notification
      .showConfirm(
        'warning',
        'Eliminar Docente',
        '¿Está seguro de eliminar este docente?',
        'Eliminar',
        'Cancelar'
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.docenteService.deleteTeacher(id).subscribe(
            (res) => {
              const { message, data } = res;
              this.notification.showSuccess('Eliminado', message);
              this.ngOnInit();
            },
            (error) => {
              if (error.status === 0) {

                this.ngOnInit();
                this.notification.showError(
                  'Error ',
                  'No se pudo conectar con el servidor'
                );
              } else {

                this.ngOnInit();
                this.notification.showError('Error ', error.error.error);
                console.log(error);
              }
            }
          );
        }
      });
  }
}

//Interfaz de recepion
interface TeacherData {
  id: string;
  CI: string;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  nameInstitution: string;
  role: string;
  status: boolean;
}
