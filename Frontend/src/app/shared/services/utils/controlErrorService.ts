import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ControlErrorService {
  getErrorMessage( form: FormGroup,fieldName: string): string {
    const control = form.get(fieldName);

   // Agregar mensajes para los validadores `minlength` y `maxlength`
  const minLength = control?.errors?.['minlength']?.requiredLength;
  const maxLength = control?.errors?.['maxlength']?.requiredLength;

    const errorMessages: { [key: string]: string | { [key: string]: string } } = {
      required: `El campo es obligatorio *`,
      minlength: `Longitud minima de ${minLength} caracteres..`,
      pattern: {
        '^(?:[5-9]|1[01])$': 'Solo se permiten edades entre 5 y 11 años', 
      '^[01]$': 'Solo se permiten el 0 o 1',
        '^[0-9]*$': 'Solo se permiten números',
        '^[0-9]{10}$': 'Longitud de 10 caracteres requerida',
        '^[a-zA-Z]*$': 'Solo se permiten letras',
        '^[a-zA-Z0-9]*$': 'Solo se permiten letras y números',
        '^[a-zA-Zñáéíöäëéöåç ]*$': 'Solo se permiten letras',
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$': 'La contraseña debe tener al menos una letra mayúscula, una letra minúscula y un número',
        '^[a-zA-Z0-9-_]*$': 'Solo se permiten letras, números y guiones'
      },
      maxlength: `Longitud maxima de ${maxLength} caracteres..`,
      email: 'Formato de email no válido',
      mismatch: 'Las contraseñas no coinciden',
    };

    if (control?.invalid) {
      const errors = control.errors;
      if (errors) {
        for (const key in errors) {
          if (errors.hasOwnProperty(key)) {
            const errorValue = errors[key];
            const errorMessage = errorMessages[key] || 'Formato no valido';
            if (errorMessage && typeof errorMessage === 'object') {
              const patternErrorMessage = errorMessage[errorValue?.requiredPattern || 'unknown'];
              return patternErrorMessage || 'Formato no valido';
            }
            return errorMessage;
          }
        }
      }
    }

    return '';
  }
}
