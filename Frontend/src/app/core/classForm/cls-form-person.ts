import { FormControl, FormGroup, Validators } from "@angular/forms";

export class ClsFormPerson {

    form: FormGroup;
    constructor() {
        this.form = new FormGroup({
            name: new FormControl('', [
                Validators.required,
                Validators.minLength(6)
            ]),
            lastName: new FormControl('', [
                Validators.required,
                Validators.minLength(6)
            ]),
            age: new FormControl('', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(3)
            ]),
            address: new FormControl('', [
                Validators.required,
                Validators.minLength(2)
            ]),
            phone: new FormControl('', [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(10)
            ]),
            email: new FormControl('', [
                Validators.required,
                Validators.email
            ]),
            CI: new FormControl('', [
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(10)
            ])

        })
    }


}
