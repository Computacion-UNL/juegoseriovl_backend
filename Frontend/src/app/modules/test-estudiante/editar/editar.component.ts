import { ClsFormTestEstudiante } from '@/app/core/classForm/cls-form-test-estudiante';
import { TestEstudianteService } from '@/app/shared/services/api/test-estudiante.service';
import { ImageValidatorService } from '@/app/shared/services/utils/image-validator.service';
import { NotificationsService } from '@/app/shared/services/utils/notifications.service';
import { ControlErrorService } from '@/app/shared/services/utils/controlErrorService';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
})
export class EditarComponent implements OnInit {
  public api = environment.api + '/api/1.0';
  public formTestImages = new ClsFormTestEstudiante();
  private testImages?: any;
  public srcImage = '';
  public imagenTest?: File;
  public imageUrl = '';
  private id: string | null = '';
  public imageUpload = false;

  constructor(
    public controlError: ControlErrorService,
    public notification: NotificationsService,
    private testService: TestEstudianteService,
    private imageService: ImageValidatorService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.formTestImages.form.reset();
    this.id = this.route.snapshot.paramMap.get('id');
    this.getTest();
  }

  getTest() {
    this.testService.getPregunta(this.id).subscribe(
      (data) => {
        this.testImages = data;
        this.setValues(this.testImages);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  obtenerImagen(id: string): Observable<Blob> {
    return this.http.get(id as string, { responseType: 'blob' });
  }

  setValues(data: any) {
    const formValue = {
      name: data.name,
      valor: data.value,
      section: data.section,
    };
    this.formTestImages.form.patchValue(formValue);

    this.loadImage(data.link);
  }

  loadImage(link: string) {
    const dataImage = link.split('/');

    this.obtenerImagen(this.api + link).subscribe((imagenData: Blob) => {
      const file = new File([imagenData], dataImage[dataImage.length - 1], {
        type: imagenData.type,
      });

      this.imagenTest = this.imageService.renameImage(file, 'TestImagenes');
      this.srcImage = '/public/TestImagenes/' + this.imagenTest.name.split('_').pop();
      this.imageUpload = true;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  update() {
    if(this.srcImage===''||this.imagenTest===null){
      this.notification.showError('Error','Es necesario tener una imagen cargada..')
    }


    this.testImages = {
      name: this.formTestImages.form.value.name,
      urlImage: this.srcImage,
      value: this.formTestImages.form.value.valor,
      section: this.formTestImages.form.value.section,
    };

    const formData = new FormData();
    formData.append('singleFile', this.imagenTest as File);
    formData.append('data', JSON.stringify(this.testImages));

    this.testService.updatePregunta(this.id, formData).subscribe(
      (res) => {
        const { message } = res;
        this.notification.showSuccess(
          'Actualizado',
          'Pregunta agregada correctamente'
        );
        console.log(message);
        this.router.navigate(['../../listar'], { relativeTo: this.route });
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

  onFileSelected(event: any) {
    const files = event.target.files;
    const file = files.length > 0 ? files[0] : null;

    if (file && this.imageService.validateImage(file)) {
      this.imagenTest = this.imageService.renameImage(file, 'TestImagenes');
      this.srcImage = '/public/TestImagenes/' + this.imagenTest.name.split('_').pop();
      this.imageUpload = true;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.resetImage();
    }
  }

  resetImage() {
    this.formTestImages.form.get('imagen')?.setValue(null);
    this.imagenTest = undefined;
    this.srcImage = '';
    this.imageUpload = false;
    this.imageUrl = '';
  }

  cancel() {
    this.router.navigate(['../../listar'], { relativeTo: this.route });
  }
}
