import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileDTO } from 'src/app/interfaces/file-dto.interface';
import { Familiar } from 'src/app/models/familiar.model';
import { FamiliarService } from 'src/app/services/familiar.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dialog-familiar',
  templateUrl: './dialog-familiar.component.html',
  styleUrls: ['./dialog-familiar.component.css']
})
export class DialogFamiliarComponent implements OnInit {

  public titulo: string;
  public familiar: Familiar;
  public fotoDefault: string;
  public fotoFamiliar: any;

  constructor(
    public dialogRef: MatDialogRef<DialogFamiliarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private familiarService: FamiliarService,
    private sanitization: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.titulo = this.data.titulo;
    this.familiar = this.data.familiar;
    this.fotoDefault = (this.familiar.sexo.idSexo == 1) ? '../../../assets/images/foto-masculino.png' : '../../../assets/images/foto-femenino.png';
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
          this.familiarService.cargarFoto(this.familiar.idFamiliar, fileDTO).subscribe(
            response => {
              this.familiar = response;
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
    if (this.familiar.foto) {
      this.familiarService.verFoto(this.familiar.foto).subscribe(
        response => {
          let url = window.URL.createObjectURL(response);
          this.fotoFamiliar = this.sanitization.bypassSecurityTrustResourceUrl(url);
        }
      );
    } else {
      this.fotoFamiliar = this.fotoDefault;
    }
  }

}
