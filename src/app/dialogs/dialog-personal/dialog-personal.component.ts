import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileDTO } from 'src/app/interfaces/file-dto.interface';
import { Personal } from 'src/app/models/personal.model';
import { PersonalService } from 'src/app/services/personal.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dialog-personal',
  templateUrl: './dialog-personal.component.html',
  styleUrls: ['./dialog-personal.component.css']
})
export class DialogPersonalComponent implements OnInit {

  public titulo: string;
  public personal: Personal;
  public fotoDefault: string;
  public fotoPersonal: any;

  constructor(
    public dialogRef: MatDialogRef<DialogPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private personalService: PersonalService,
    private sanitization: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.titulo = this.data.titulo;
    this.personal = this.data.personal;
    this.fotoDefault = (this.personal.sexo.idSexo == 1) ? '../../../assets/images/foto-masculino.png' : '../../../assets/images/foto-femenino.png';
    this.mostrarFoto();
  }

  handleUpload(event: any) {
    let file = event.target.files[0];
    let fileSize = file.size;
    if (fileSize <= 2097152) {
      let fileName = file.name;
      let fileArray = fileName.split(".");
      let fileExtension = fileArray[1];
      if (fileExtension.toLowerCase() == 'jpg' || fileExtension.toLowerCase() == 'png') {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          let dataURLFile = (reader.result).toString();
          let base64Result = dataURLFile.split(',')[1];
          let fileDTO = new FileDTO();
          fileDTO.fileContentBase64 = base64Result;
          fileDTO.fileFormat = fileExtension;
          fileDTO.fileName = fileName;
          this.personalService.cargarFoto(this.personal.idPersonal, fileDTO).subscribe(
            response => {
              this.personal = response;
              this.mostrarFoto();
            }
          );
        };
      } else {
        event.srcElement.value = null;
        this.snackBar.open('Los formatos aceptados son: JPG - PNG', 'AVISO', { duration: 2000 });
      }
    } else {
      event.srcElement.value = null;
      this.snackBar.open('Los archivos deben tener un peso máximo de 2MB', 'AVISO', { duration: 2000 });
    }
  }

  mostrarFoto() {
    if (this.personal.foto) {
      this.personalService.verFoto(this.personal.foto).subscribe(
        response => {
          let url = window.URL.createObjectURL(response);
          this.fotoPersonal = this.sanitization.bypassSecurityTrustResourceUrl(url);
        }
      );
    } else {
      this.fotoPersonal = this.fotoDefault;
    }
  }

}
