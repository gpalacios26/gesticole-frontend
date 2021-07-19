import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Competencia } from 'src/app/models/competencia.model';

@Component({
  selector: 'app-dialog-competencias',
  templateUrl: './dialog-competencias.component.html',
  styleUrls: ['./dialog-competencias.component.css']
})
export class DialogCompetenciasComponent implements OnInit {

  public titulo: string;
  public competencias: Competencia[];

  constructor(
    public dialogRef: MatDialogRef<DialogCompetenciasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.titulo = this.data.titulo;
    this.competencias = this.data.competencias;
  }

}
