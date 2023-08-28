import { ClsFormUsuario } from '@/app/core/classForm/cls-form-usuario';
import { UserRole } from '@/app/core/interfaces/interface-roleAdmin';
import { AuthService } from '@/app/shared/services/api/auth.service';
import { UserService } from '@/app/shared/services/api/user.service';
import { ControlErrorService } from '@/app/shared/services/utils/controlErrorService';
import { NotificationsService } from '@/app/shared/services/utils/notifications.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css'],
})
export class RegistrarComponent implements OnInit {
  public formUser = new ClsFormUsuario();
  public loading = false;
  public notMatch = false;

  constructor(
    public controlError: ControlErrorService,
    public notification: NotificationsService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.formUser.form.reset();
  }

  create() {
    const { CI, name, lastName, address, phone, email, password } =
      this.formUser.form.value;

    const body: UserRole = {
      CI,
      name,
      lastName,
      address,
      phone,
      email,
      password
    };

    this.userService.createUser(body).subscribe(
      (res) => {
        this.notification.showSuccess('Registro', 'Usuario registrado con éxito');
        this.router.navigate(['../listar'], { relativeTo: this.route });
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
    );
  }
  onCheckPassword() {
    const password = this.formUser.form.get('password')?.value;
    const confirmPassword = this.formUser.form.get(
      'password_confirmation'
    )?.value;
    this.notMatch = password !== confirmPassword;
  }

  cancel() {
    this.router.navigate(['../listar'], { relativeTo: this.route });
  }
}
