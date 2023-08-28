import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

export class ClsFormUsuario {
  form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      CI: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('[0-9]*'),
      ]),
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Zñáéíöäëéöåç ]*$'),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Zñáéíöäëéöåç ]*$'),
      ]),
      address: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(10),
        Validators.pattern('[0-9]*'),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')

      ]),
      password_confirmation: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ]),
    }, 
    );
  }

 
  
}

export class ClsFormUpdateUsuario {
  form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      CI: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('[0-9]*'),
      ]),
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Zñáéíöäëéöåç ]*$'),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Zñáéíöäëéöåç ]*$'),
      ]),
      address: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(10),
        Validators.pattern('[0-9]*'),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
     
    }, 
    );
  }

 
  
}