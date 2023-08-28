import { ClsFormEstudiante } from '@/app/core/classForm/cls-form-estudiante';
import { InstitutionService } from '@/app/shared/services/api/institution.service';
import { PersonaService } from '@/app/shared/services/api/persona.service';
import { StudentService } from '@/app/shared/services/api/student.service';
import { ControlErrorService } from '@/app/shared/services/utils/controlErrorService';
import { NotificationsService } from '@/app/shared/services/utils/notifications.service';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
})
export class EditarComponent {
  public formStudent = new ClsFormEstudiante();
  public instituciones: any[] = [];
  public studentPerson: any;
  public student: any;
  public institucionValue = '';
  public id: any;

  constructor(
    private institutionService: InstitutionService,
    public controlError: ControlErrorService,
    public notification: NotificationsService,
    private studentService: StudentService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.formStudent.form.reset();
    this.getInstitutions();
    this.getStudent();
  }

  update() {
    const {
      ciStudent,
      name,
      lastName,
      gender,
      ageStudent,
      addressStudent,
      phoneStudent,
      gradeStudent,
      parallelStudent,
    } = this.formStudent.form.value;

    const body = {
      CI: ciStudent,
      name: name,
      lastName: lastName,
      address: addressStudent,
      phone: phoneStudent,
      gender: gender,
      age: ageStudent,
      nameInstitution: this.student.nameInstitution,
      grade: gradeStudent,
      parallel: parallelStudent,
    };

    this.studentService.updateStudent(this.id, body).subscribe(
      (res) => {
        const { message, data } = res;
        console.log(message);
        this.notification.showSuccess(
          'Actualizado',
          'Estudiante actualizado correctamente'
        );

        this.router.navigate(['../../listar'], { relativeTo: this.route });
      },
      (error) => {
        if (error.status === 0) {
          this.notification.showError(
            'Error',
            'Error de conexión con el servidor, inténtelo mas tarde..'
          );
        } else {
          this.notification.showError('Error', error.error.error);
        }
      }
    );
  }

  getStudent() {
    this.studentService.getStudent(this.id).subscribe(
      (res) => {
        const { message, data } = res;
        this.student = data;
        this.setValuesStudent(this.student);
        console.log(message);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setValuesStudent(student: any) {
    this.formStudent.form.setValue({
      ciStudent: student.CI,
      name: student.name,
      lastName: student.lastName,
      gender: student.gender,
      ageStudent: student.age,
      addressStudent: student.address,
      phoneStudent: student.phone,
      gradeStudent: student.grade,
      parallelStudent: student.parallel,
    });
    this.formStudent.form
      .get('institucion')
      ?.patchValue(student.nameInstitution);
    this.formStudent.form.markAllAsTouched();
  }

  getInstitutions() {
    this.institutionService.getAllInstitution().subscribe((res) => {
      const { message, data } = res;
      this.instituciones = data;
      console.log(message);
    });
  }

  cancel() {
  this.location.back();
  }
}
