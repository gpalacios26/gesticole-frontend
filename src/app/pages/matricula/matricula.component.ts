import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from 'src/app/models/usuario.model';
import { MatriculaAula } from 'src/app/models/matricula-aula.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MatriculaAulaService } from 'src/app/services/matricula-aula.service';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-matricula',
  templateUrl: './matricula.component.html',
  styleUrls: ['./matricula.component.css']
})
export class MatriculaComponent implements OnInit {

  public usuario: Usuario;
  public matriculas: MatriculaAula[];
  public displayedColumns = ['idMatricula', 'anio', 'nivel', 'aula', 'acciones'];
  public displayedColumnsMobile = ['idMatricula', 'aula', 'acciones'];
  public dataSource: MatTableDataSource<MatriculaAula>;
  public cantidad: number = 0;
  public mobile: boolean = false;
  public displayedColumnsFinal: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private matriculaAulaService: MatriculaAulaService
  ) {
    this.mobile = (window.innerWidth <= 640) ? true : false;
    this.setColumns();
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.cargarMatriculas();
  }

  onResize(event) {
    this.mobile = (event.target.innerWidth <= 640) ? true : false;
    this.setColumns();
  }

  setColumns() {
    this.displayedColumnsFinal = (this.mobile) ? this.displayedColumnsMobile : this.displayedColumns;
  }

  cargarMatriculas(page: number = 0, size: number = 10) {
    this.matriculaAulaService.listarPaginado(page, size).subscribe(
      response => {
        this.matriculas = response.content;
        this.cantidad = response.totalElements;
        this.dataSource = new MatTableDataSource(this.matriculas);
        this.dataSource.sort = this.sort;

        const sortState: Sort = { active: 'idMatricula', direction: 'desc' };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    );
  }

  siguientePagina(e: any) {
    this.cargarMatriculas(e.pageIndex, e.pageSize);
  }

  eliminar(id: number) {
    const confirmDialog = this.dialog.open(DialogConfirmComponent, {
      disableClose: true,
      data: {
        titulo: 'Alerta',
        mensaje: 'Deseas eliminar el registro seleccionado?'
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.matriculaAulaService.eliminar(id).subscribe(
          () => {
            this.cargarMatriculas();
            this.snackBar.open('Registro eliminado correctamente', 'AVISO', { duration: 2000 });
          }
        );
      }
    });
  }

}
