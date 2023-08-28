import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@/app/shared/services/api/auth.service';
import { NotificationsService } from '@/app/shared/services/utils/notifications.service';


@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css'],
})

export class RecoveryComponent implements OnInit {
  recoverForm: FormGroup = new FormGroup({});
  formCode: FormGroup = new FormGroup({});
  formPassword: FormGroup = new FormGroup({});

  tieneMayusculas = false;
  tieneMinusculas = false;
  tieneNumeros = false;
  esLarga = false;
  esSegura = false;
  showPassword = false;
  showPassword2 = false;
  emailSent = false;
  codeValidate = false;
  codeSent = false;
  codeExpired = false;
  error = false;
  errorMessage = '';


  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private notification: NotificationsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }


  initForm(): void {
    this.recoverForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.formCode = this.formBuilder.group({
      code1: ['', [Validators.required, Validators.maxLength(1)]],
      code2: ['', [Validators.required, Validators.maxLength(1)]],
      code3: ['', [Validators.required, Validators.maxLength(1)]],
      code4: ['', [Validators.required, Validators.maxLength(1)]],
      code5: ['', [Validators.required, Validators.maxLength(1)]],
      code6: ['', [Validators.required, Validators.maxLength(1)]],
    });

    this.formPassword = this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(6),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]],
        repeatPassword: ['', [Validators.required, Validators.minLength(6),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]],
      },
      { validator: this.checkPasswords }
    );
  }

  sendRecover() {
    if (this.recoverForm.invalid) {
      return;
    }

    const body = {
      email: this.recoverForm.value.email,
    };

    this.authService.recoverPassword(body).subscribe(
      (res) => {
        const { message, timeExpire, seconds } = res;
        this.emailSent = true;
        this.codeSent = true;
      },
      (error) => {
        if (error.status === 0) {
          this.notification.showError(
            'Error',
            'Error de conexión con el servidor, inténtelo mas tarde'
          );
        } else {
          console.log(error);
          this.emailSent = false;
          this.codeSent = false;
          this.error = true;
          this.errorMessage = error.error.error;
        }
      }
    );
  }

  onEmailInputFocus() {
    this.error = false;
    this.errorMessage = '';
  }

  validateCode() {
    const { code1, code2, code3, code4, code5, code6 } = this.formCode.value;
    //unir todos los code
    const code = code1 + code2 + code3 + code4 + code5 + code6;
    const body = {
      email: this.recoverForm.value.email,
      code: code,
    };
    this.authService.validateCode(body).subscribe(
      (res) => {
        this.codeValidate = true;
        this.codeSent = false;
        this.error = false;
        this.errorMessage = '';
      },
      (err) => {
        this.codeValidate = false;
        this.error = true;
        this.errorMessage = err.error.error;
      }
    );
  }

  //funcion para saltar entre digitos
  focus(next: string, event: KeyboardEvent) {
    // Obtener el código de la tecla presionada
    const keyCode = event.keyCode || event.which;

    // Verificar si la tecla presionada es un dígito
    if (keyCode >= 48 && keyCode <= 57) {
      // Obtener el valor actual del input
      const value = (event.target as HTMLInputElement).value;

      // Verificar si el input no está vacío
      if (value.length > 0) {
        // Obtener el siguiente elemento por su id
        const nextElement = document.getElementById(next);

        // Verificar si se encontró el elemento siguiente
        if (nextElement) {
          // Enfocar el elemento siguiente
          nextElement.focus();
        }
      }
    }
  }

  // Función para verificar que las contraseñas coincidan
  checkPasswords(group: any) {
    const pass = group.get('password').value;
    const confirmPass = group.get('repeatPassword').value;
    return pass === confirmPass ? null : { notSame: true };
  }

  savePassword() {
    if (this.formPassword.valid) {
      const body = {
        email: this.recoverForm.value.email,
        newPassword: this.formPassword.value.password,
      };
      this.authService.changePassword(body).subscribe(
        (res) => {
          console.log(res);

          this.router.navigate(['/auth/login']);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.error = true;
      this.errorMessage = 'Ingrese una contraseña';
    }
  }

  verificarFortalezaContrasena() {
    const password = this.formPassword.value.password;
    this.tieneMayusculas = /[A-Z]/.test(password);
    this.tieneMinusculas = /[a-z]/.test(password);
    this.tieneNumeros = /[0-9]/.test(password);
    this.esLarga = password.length >= 8;
    this.esSegura =
      this.tieneMayusculas &&
      this.tieneMinusculas &&
      this.tieneNumeros &&
      this.esLarga;
  }

  goBack() {
    this.router.navigate(['/auth/login']);
  }
}
