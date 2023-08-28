import { CasosService } from '@/app/shared/services/api/casos.service';
import { TestCasoEstudianteService } from '@/app/shared/services/api/test-caso-estudiante.service';
import { TestCasoTeacherService } from '@/app/shared/services/api/test-caso-teacher.service';
import { NotificationsService } from '@/app/shared/services/utils/notifications.service';
import { environment } from '@/environments/environment';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  providers: [DatePipe],
})
export class ReporteComponent implements OnInit {

  public api = environment.api + '/api/1.0/testStudent/reporte/';
  public id: any;
  public modalActivate: Boolean = false;
  public modalActivate2: Boolean = false;
  public listaRespuestas: Respuestas[] = [];
  public loading = true;

  public caso: any = {};
  public circumference: any = ((2 * 22) / 7) * 120;

  constructor(
    private testEstudiante: TestCasoEstudianteService,
    private testTeacher: TestCasoTeacherService,
    private notification: NotificationsService,
    private serviceCaso: CasosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getCaso();
  }

  getCaso() {
    this.serviceCaso.getReporte(this.id).subscribe(
      (res) => {
        const { message, data } = res;
        this.caso = data;
        this.loading =false;
        console.log(message);
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

  public getColor(porcentaje: number): string {
    if (porcentaje > 70) {
      return 'red';
    } else if (porcentaje > 50) {
      return 'yellow';
    } else {
      return 'green';
    }
  }

  openModal(id: string) {
    this.modalActivate = true;
    this.testEstudiante.getTestStudent(id).subscribe(
      (res) => {
        console.log(res);
        this.listaRespuestas = res.answers;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  openModal2(id: string) {
    this.modalActivate2 = true;
    this.testTeacher.getTestTeacher(id).subscribe(
      (res) => {
        console.log(res);
        this.listaRespuestas = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  closeModal() {
    this.modalActivate = false;
    this.modalActivate2 = false;
    this.listaRespuestas = [];
  }

  goBack() {
    this.router.navigate(['../../listar'], { relativeTo: this.route });
  }

}

interface Respuestas {
  id?: string;
  refImages?: string;
  name?: string;
  valueAnswer?: number;
  value?: number;
}
