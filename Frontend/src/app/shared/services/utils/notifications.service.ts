import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})

/**
 * Clase que proporciona métodos para mostrar alertas utilizando SweetAlert.
 */
export class NotificationsService {
  /**
   * Muestra una alerta de éxito utilizando SweetAlert.
   * @param title El título de la alerta.
   * @param text El texto de la alerta.
   */
  showSuccess(title: string, text?: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      confirmButtonText: 'Aceptar',
    });
  }

  /**
   * Muestra una alerta de error utilizando SweetAlert.
   * @param title El título de la alerta de error.
   * @param text El texto de la alerta de error.
   */
  showError(title: string, text: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
  }

  /**
   * Muestra una alerta de confirmación utilizando SweetAlert.
   * @param icon El icono de la alerta de confirmación.
   * @param title El título de la alerta de confirmación.
   * @param text El texto de la alerta de confirmación.
   * @param confirmButtonText El texto del botón de confirmación.
   * @param cancelButtonText El texto del botón de cancelación.
   * @returns Una promesa que se resuelve con el resultado de la confirmación.
   */
  showQuestion(title: string, text: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      confirmButtonText: 'Aceptar',
    });
  }

  async showObservationPrompt(title: string, text: string): Promise<any> {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      input: 'textarea',
      inputPlaceholder: 'Ingrese su observación aquí',
      confirmButtonText: 'Eliminar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
      return result.value;
    } else {
      return null;
    }
  }

  showTooltip(text: string) {
    Swal.fire({
      title: 'Error',
      text: text,
      icon: 'error',
      position: 'top',
      toast: true,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }

  getTooltipTopPosition(input: HTMLElement): string {
    const rect = input.offsetTop;
    return `${rect + window.pageYOffset}px`;
  }

  getTooltipLeftPosition(input: HTMLElement): string {
    const rect = input.offsetLeft;
    return `${rect + window.pageXOffset}px`;
  }


  close() {
    Swal.close()
  }

  /**
   * Muestra una alerta de confirmación utilizando SweetAlert.
   * @param icon El icono de la alerta de confirmación.
   * @param title El título de la alerta de confirmación.
   * @param text El texto de la alerta de confirmación.
   * @param confirmButtonText El texto del botón de confirmación.
   * @param cancelButtonText El texto del botón de cancelación.
   * @returns Una promesa que se resuelve con el resultado de la confirmación.
   */
  showConfirm(
    icon: any,
    title: string,
    text: string,
    confirmButtonText: string,
    cancelButtonText: string
  ) {
    return Swal.fire({
      icon: icon || 'warning',
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
    });
  }
}
