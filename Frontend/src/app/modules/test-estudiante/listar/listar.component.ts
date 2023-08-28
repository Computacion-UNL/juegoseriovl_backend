import { InterfaceTestEstudiante } from '@/app/core/interfaces/test-estudiante';
import { FilterTablesPipe } from '@/app/shared/pipes/filter-tables.pipe';
import { TestEstudianteService } from '@/app/shared/services/api/test-estudiante.service';
import { NotificationsService } from '@/app/shared/services/utils/notifications.service';
import { environment } from '@/environments/environment';
import { NgOptimizedImage, provideImgixLoader } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
  providers: [
    FilterTablesPipe,
    NgOptimizedImage,
    provideImgixLoader(environment.api + '/api/1.0'),
  ],
})
export class ListarComponent implements OnInit {
  public api = environment.api + '/api/1.0';
  public search = '';
  public loading = true;
  isButtonPressed: boolean = false;

  preguntas: InterfaceTestEstudiante[] = [];

  constructor(
    private preguntaService: TestEstudianteService,
    private notification: NotificationsService
  ) { }

  ngOnInit(): void {
    this.getData();
  }



  getData(): void {
    this.loading = true;
    this.preguntaService
      .getAllPreguntaPaginated()
      .subscribe(
        (res) => {
          const { message, data } = res;
          this.preguntas = data
          this.loading = false;
          console.log(message);
        },
        (err) => {
          console.log('Error:', err.error);
          this.loading = false;
          this.notification.showError('Error', err.error.error);
        }
      );
  }

  async delete(id: any) {

    const remarks = await this.notification.showObservationPrompt('¿Estás seguro de querer eliminar la pregunta?', 'Por favor, introduce una razón u observación:');
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

    this.preguntaService.deletePregunta(id, { remarks }).subscribe(
      (res) => {
        const { message } = res;
        this.notification.showSuccess('Eliminado', 'Pregunta eliminada correctamente');
        console.log(message);
        this.ngOnInit();
      },
      (err) => {
        console.log(err);
        this.ngOnInit();
        this.notification.showError('Error', 'No se pudo eliminar la pregunta');
      }
    );

  }

}
