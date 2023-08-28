import { FormControl, FormGroup, Validators } from '@angular/forms';

export class ClsFormInstitution {
  //private isPhoneRex = new RegExp('^[0-9]+$')
  form: FormGroup;
  constructor() {
    this.form = new FormGroup({
      nameInstitution: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      addressInstitution: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      phoneInstitution: new FormControl('', [
        Validators.required,
        //Validators.pattern(this.isPhoneRex),
        Validators.minLength(6),
        Validators.maxLength(10),
        Validators.pattern('[0-9]*'),
      ]),
      emailInstitution: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      typeInstitution: new FormControl('', [
        Validators.required,
      ]),
      stateInstitution: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[a-zA-Zñáéíöäëéöåç ]*$'),
      ]),
      cityInstitution: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[a-zA-Zñáéíöäëéöåç ]*$'),
      ]),
    });
  }
}
