import { FilterTablesPipe } from '@/app/shared/pipes/filter-tables.pipe';
import { TestCasoEstudianteService } from '@/app/shared/services/api/test-caso-estudiante.service';
import { NotificationsService } from '@/app/shared/services/utils/notifications.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@/app/shared/services/api/auth.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
  providers: [DatePipe, FilterTablesPipe],
})
export class ListarComponent implements OnInit {
  public tests: any[] = [];
  public search = '';
  public loading = true;
  public id: any;

  constructor(
    private serviceCasoEstudiante: TestCasoEstudianteService,
    private notification: NotificationsService,
    private authService: AuthService,

  ) { }

  ngOnInit(): void {

    this.id = this.authService.getUserId();
    this.serviceCasoEstudiante.getAll(this.id).subscribe(
      (res) => {
        const { message, data } = res;
        this.tests = data;
        this.loading = false;
        console.log(message);
      },
      (err) => {
        this.loading = false;
        console.log(err.error);
        this.notification.showError('Error', err.error.error);
      }
    );
  }



  scoreUpdate(id: string, op: string) {
    if (op == 'plus') {
      const body = {
        scoreEvaluator: true,
      };
      this.serviceCasoEstudiante.updateScore(id, body).subscribe(
        (res) => {
          const { message, data } = res;
          this.tests = data;
          console.log(message);
          this.ngOnInit();
        },
        (err) => {
          console.log(err.error);
          this.notification.showError('Error', err.error.error);
        }
      );
    } else {
      const body = {
        score: false,
      };
      this.serviceCasoEstudiante.updateScore(id, body).subscribe(
        (res) => {
          const { message, data } = res;
          this.tests = data;
          console.log(message);

          this.ngOnInit();
        },
        (err) => {
          console.log(err.error);

          this.ngOnInit();
          this.notification.showError('Error', err.error.error);
        }
      );
    }
  }

  async deleteTest(id: any) {

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

    this.serviceCasoEstudiante.delete(id, { remarks }).subscribe(
      (res) => {
        this.notification.showSuccess(
          'Eliminado',
          'Test eliminado correctamente'
        );
        console.log(res);
        this.ngOnInit();
      },
      (err) => {
        this.ngOnInit();
        this.notification.showError('Error', err.error.error);
      }
    );

  }
}
