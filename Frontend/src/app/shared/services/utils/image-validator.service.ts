import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageValidatorService {


  validateImage(file: File): boolean {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (file && allowedTypes.includes(file.type)) {
      return true;
    } else {
      return false;
    }
  }

  renameImage(file: File, destination: string): File {
    const name = file.name.split('.')[0];
    const ext = file.name.split('.')[1];
    
    const date = new Date();
    const formattedDate = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
    
    let newName = `${destination}_${name.replace(/[^a-zA-Z0-9.]/g, '')}${formattedDate}${formattedTime}.${ext}`;
    
    console.log("Nuevo nombre:",newName)
    const newFile = new File([file], newName, { type: file.type });
    return newFile;
  }
  




}
