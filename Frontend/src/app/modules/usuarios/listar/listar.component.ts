import { FilterTablesPipe } from "@/app/shared/pipes/filter-tables.pipe";
import { AuthService } from "@/app/shared/services/api/auth.service";
import { UserService } from "@/app/shared/services/api/user.service";
import { NotificationsService } from "@/app/shared/services/utils/notifications.service";
import { Component, OnInit } from "@angular/core";
import { Subject, Subscription, takeUntil } from "rxjs";

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
  providers: [FilterTablesPipe],
})
export class ListarComponent implements OnInit {
  public usuarios: Usuario[] = [];
  public modalActivate = false;
  public currentUser?: Usuario;
  public search = '';
  public loading = true;
  private subscription = new Subject<void>();

  constructor(
    private notification: NotificationsService,
    private usuariosService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  ngOnDestroy(): void {
    this.subscription.next();
    this.subscription.complete();
  }

  getUsers(): void {
    this.loading = true;
    this.usuariosService.getAllUser()
      .pipe(takeUntil(this.subscription))
      .subscribe(
        (res) => {
          const { message, data } = res;
          this.usuarios = data;
          this.loading = false;
          console.log(message);
        },
        (err) => {
          console.log('Error:', err.error);
          this.loading = false;
          this.notification.showError('Error', err.error.error);
        }
      )
  }

  delete(id: string): void {
    this.notification
      .showConfirm(
        'warning',
        'Peligro',
        '¿Está seguro de eliminar este usuario?',
        'Eliminar',
        'Cancelar'
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.usuariosService.deleteUser(id)
            .pipe(takeUntil(this.subscription))
            .subscribe(
              (res) => {
                this.notification.showSuccess(
                  'Eliminado',
                  'Cuenta eliminada correctamente'
                );
                console.log(res.message);
                this.ngOnInit();
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
      });
  }


}
interface Usuario {
  id: string;
  CI: string;
  email: string;
  role: string;
  status: boolean;
}