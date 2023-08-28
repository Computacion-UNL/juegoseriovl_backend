import { FormControl, FormGroup, Validators } from "@angular/forms";

export class ClsFormTestQuestion {
    form: FormGroup;
    constructor() {
        this.form = new FormGroup({
            name: new FormControl('',
                [
                    Validators.required,
                    Validators.minLength(3)
                ]),
            description: new FormControl('',
                [
                    Validators.required,
                    Validators.minLength(3)
                ])
        })
    }
}

export class ClsFormRespuestas {
    form: FormGroup;
    constructor() {
        this.form = new FormGroup({
            nameAnswer: new FormControl('',
                [
                    Validators.required,
                    Validators.minLength(3)
                ]),
            valueAnswer: new FormControl('',
                [
                    Validators.required
                ])
        })
    }
}