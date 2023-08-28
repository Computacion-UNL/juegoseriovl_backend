import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

export class ClsFormDece {
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
        Validators.required,Validators.minLength(2)]),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(10),
        Validators.pattern('[0-9]*'),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      nameInstitution: new FormControl(false),
    });
  }
}
