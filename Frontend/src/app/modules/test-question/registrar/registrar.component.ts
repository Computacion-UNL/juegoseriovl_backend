import {
  ClsFormRespuestas,
  ClsFormTestQuestion,
} from '@/app/core/classForm/cls-form-test-question';
import { InterfaceQuestion } from '@/app/core/interfaces/interface-question';
import { TestQuestionService } from '@/app/shared/services/api/test-question.service';
import { ControlErrorService } from '@/app/shared/services/utils/controlErrorService';
import { NotificationsService } from '@/app/shared/services/utils/notifications.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css'],
})
export class RegistrarComponent {
  public modalActivate: Boolean = false;
  public formRespuesta = new ClsFormRespuestas();
  public formPreguntas = new ClsFormTestQuestion();
  public listaRespuestas: Respuestas[] = [];

  private testQuestion?: InterfaceQuestion;

  constructor(
    public controlError: ControlErrorService,
    public notification: NotificationsService,
    private changeDetectorRef: ChangeDetectorRef,
    private questionService: TestQuestionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.formRespuesta.form.reset();
    this.formPreguntas.form.reset();
  }

  create() {
    this.testQuestion = {
      nameQuestion: this.formPreguntas.form.value.name,
      descriptionQuestion: this.formPreguntas.form.value.description,
      answer: this.listaRespuestas,
    };

    this.questionService.createQuestion(this.testQuestion).subscribe(
      (data) => {
        this.notification.showSuccess('Registro','Pregunta registrada con éxito')
        this.router.navigate(['../listar'], { relativeTo: this.route });
      },
      
      (error) => {
        if (error.status === 0) {
          this.notification.showError(
            'Error',
            'Error de conexión con el servidor, inténtelo mas tarde'
          );
        } else {
          this.notification.showError('Error', error.error.error);
        }
      }
    );
  }

  openModal() {
    this.modalActivate = true;
  }

  closeModal() {
    this.modalActivate = false;
  }

  addRespuesta() {
    const id = this.listaRespuestas.length + 1;
    const respuesta: Respuestas = {
      id,
      nameAnswer: this.formRespuesta.form.value.nameAnswer,
      valueAnswer: this.formRespuesta.form.value.valueAnswer,
    };

    this.listaRespuestas.push(respuesta);
    this.changeDetectorRef.detectChanges();
    this.formRespuesta.form.reset();
    this.closeModal();
  }

  deleteRespuesta(id: number) {
    this.listaRespuestas = this.listaRespuestas.filter(
      (tarjeta) => tarjeta.id !== id
    );
  }

  cancel() {
    this.router.navigate(['../listar'], { relativeTo: this.route });
  }
}

interface Respuestas {
  id: number;
  nameAnswer: string;
  valueAnswer: number;
}
