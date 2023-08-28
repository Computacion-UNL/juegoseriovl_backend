
import { FilterTablesPipe } from '@/app/shared/pipes/filter-tables.pipe';
import { AuthService } from '@/app/shared/services/api/auth.service';
import { CasosService } from '@/app/shared/services/api/casos.service';
import { StudentService } from '@/app/shared/services/api/student.service';
import { NotificationsService } from '@/app/shared/services/utils/notifications.service';
import { environment } from '@/environments/environment';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
  providers: [DatePipe, FilterTablesPipe],
})
export class ListarComponent implements OnInit {
  public api = environment.api + '/api/1.0';

  public casos: any[] = [];
  public codigo = 0;
  public modalActivate = false;
  public loading = true;
  public search = '';
  public id: any;

  constructor(
    private notification: NotificationsService,
    private authService: AuthService,
    private casoService: CasosService,
    private studentService: StudentService,
  ) { }

  ngOnInit(): void {
    this.getCasos();
  }



  getCasos() {
    this.id = this.authService.getUserId();
    this.casoService.getAllCaso(this.id).subscribe(
      (res) => {
        const { message, data } = res;
        this.casos = data;
        this.loading = false;
        console.log(message);
      }, (err) => {
        console.log('Error:', err.error);
        this.loading = false;
        this.notification.showError('Error', err.error.error);
      }
    );
  }

  closeModal() {
    this.modalActivate = false;
    this.codigo = 0;
  }

  openModal(CI: string) {
    console.log(CI);
    const body = {
      CI: CI,
    };
    this.studentService.generateCode(body).subscribe((res) => {
      const { data } = res;
      this.codigo = data;
      console.log(data);
      this.ngOnInit();
    });

    this.modalActivate = true;
  }

  async deleteCaso(id: string) {

    const remarks = await this.notification.showObservationPrompt('¿Estás seguro de querer eliminar el Test?', 'Por favor, introduce una razón u observación:');

    if (remarks === null) {
      this.notification.showError('Acción cancelada', 'La acción ha sido cancelada por el usuario.');
      console.log('Acción cancelada.');
      return;
    }

    if (remarks.length < 10) {
      this.notification.showError('Observación inválida', 'Debe introducir una observación de mínimo 10 caracteres.');
      console.log('Observación insuficiente.');
      return;
    }

    this.casoService.deleteCaso(id, { remarks }).subscribe(
      (res) => {
        console.log(res);
        this.notification.showSuccess(
          'Eliminado',
          'Caso eliminado correctamente'
        );
        this.ngOnInit();
      },
      (err) => {
        if (err.status === 0) {
          this.notification.showError(
            'Error',
            'No se pudo conectar con el servidor'
          );
        } else {
          console.log(err);
          this.notification.showError('Error', err.error.error);
        }
      }
    );

  }
}
