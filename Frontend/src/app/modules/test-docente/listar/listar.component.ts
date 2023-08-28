/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterTablesPipe } from '@/app/shared/pipes/filter-tables.pipe';
import { AuthService } from '@/app/shared/services/api/auth.service';
import { CasosService } from '@/app/shared/services/api/casos.service';
import { NotificationsService } from '@/app/shared/services/utils/notifications.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
  providers: [FilterTablesPipe],
})
export class ListarComponent implements OnInit {
  public casos: any[] = [];
  public selectedCasoValue: any;
  public loading = true;
  public search = '';
  private idUserTeacher? = '';
  private subscription = new Subject<void>(); 


  constructor(
    private notification: NotificationsService,
    private authService: AuthService,
    private casoService: CasosService
  ) {}

  ngOnInit(): void {
    this.idUserTeacher = this.authService.getUserId();
    this.getCasos(this.idUserTeacher);

   
  }

  getCasos(id:any){
    this.casoService.getAllCasosTeacher(id)
    .pipe(takeUntil(this.subscription))
    .subscribe(
      (res) => {
        const { message, data } = res;
        this.casos = data;
        this.loading = false;
        console.log(message);
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
            error.error.error
          );
        }
      }
      )
  }

  ngOnDestroy(): void{
    this.subscription.next();
    this.subscription.complete();
  }
  

}
