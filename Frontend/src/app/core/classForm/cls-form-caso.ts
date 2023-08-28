import { FormControl, FormGroup, Validators } from '@angular/forms';

export class ClsFormCaso {
  //private isPhoneRex = new RegExp('^[0-9]+$')

  form: FormGroup;
  constructor() {
    this.form = new FormGroup({
      ciStudent: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('[0-9]*'),
      ]),
      nameStudent: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Zñáéíöäëéöåç ]*$'),
      ]),
      lastNameStudent: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Zñáéíöäëéöåç ]*$'),
      ]),
      gender: new FormControl('', [
        Validators.required,
      ]),
      ageStudent: new FormControl('', [
        Validators.required,
        Validators.maxLength(2),
        Validators.pattern('^(?:[5-9]|1[01])$'),
      ]),
      addressStudent: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      phoneStudent: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(10),
        Validators.pattern('[0-9]*'),
      ]),
      gradeStudent: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2),
        Validators.pattern('[0-9]*'),
      ]),
      parallelStudent: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1),
        Validators.pattern('^[a-zA-Z]*$'),
      ]),
      selectTeacher: new FormControl('', [

        Validators.required,
      ]),
    });
  }
}
