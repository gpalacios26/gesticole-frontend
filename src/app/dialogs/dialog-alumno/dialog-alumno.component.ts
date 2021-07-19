import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileDTO } from 'src/app/interfaces/file-dto.interface';
import { Alumno } from 'src/app/models/alumno.model';
import { AlumnoService } from 'src/app/services/alumno.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dialog-alumno',
  templateUrl: './dialog-alumno.component.html',
  styleUrls: ['./dialog-alumno.component.css']
})
export class DialogAlumnoComponent implements OnInit {

  public titulo: string;
  public alumno: Alumno;
  public fotoDefault: string;
  public fotoAlumno: any;

  constructor(
    public dialogRef: MatDialogRef<DialogAlumnoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private alumnoService: AlumnoService,
    private sanitization: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.titulo = this.data.titulo;
    this.alumno = this.data.alumno;
    this.fotoDefault = (this.alumno.sexo.idSexo == 1) ? '../../../assets/images/foto-masculino.png' : '../../../assets/images/foto-femenino.png';
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
          this.alumnoService.cargarFoto(this.alumno.idAlumno, fileDTO).subscribe(
            response => {
              this.alumno = response;
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
    if (this.alumno.foto) {
      this.alumnoService.verFoto(this.alumno.foto).subscribe(
        response => {
          let url = window.URL.createObjectURL(response);
          this.fotoAlumno = this.sanitization.bypassSecurityTrustResourceUrl(url);
        }
      );
    } else {
      this.fotoAlumno = this.fotoDefault;
    }
  }

}
