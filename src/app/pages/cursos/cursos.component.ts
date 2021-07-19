import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from 'src/app/models/usuario.model';
import { Curso } from 'src/app/models/curso.model';
import { Competencia } from 'src/app/models/competencia.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CursoService } from 'src/app/services/curso.service';
import { CompetenciaService } from 'src/app/services/competencia.service';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogCompetenciasComponent } from 'src/app/dialogs/dialog-competencias/dialog-competencias.component';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {

  public usuario: Usuario;
  public cursos: Curso[];
  public competencias: Competencia[] = [];
  public displayedColumns = ['idCurso', 'anio', 'nivel', 'descripcion', 'competencias', 'acciones'];
  public displayedColumnsMobile = ['idCurso', 'descripcion', 'acciones'];
  public dataSource: MatTableDataSource<Curso>;
  public cantidad: number = 0;
  public mobile: boolean = false;
  public displayedColumnsFinal: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private cursoService: CursoService,
    private competenciaService: CompetenciaService
  ) {
    this.mobile = (window.innerWidth <= 640) ? true : false;
    this.setColumns();
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.cargarCursos();
  }

  onResize(event) {
    this.mobile = (event.target.innerWidth <= 640) ? true : false;
    this.setColumns();
  }

  setColumns() {
    this.displayedColumnsFinal = (this.mobile) ? this.displayedColumnsMobile : this.displayedColumns;
  }

  cargarCursos(page: number = 0, size: number = 10) {
    this.cursoService.listarPaginado(page, size).subscribe(
      response => {
        this.cursos = response.content;
        this.cantidad = response.totalElements;
        this.dataSource = new MatTableDataSource(this.cursos);
        this.dataSource.sort = this.sort;

        const sortState: Sort = { active: 'idCurso', direction: 'desc' };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    );
  }

  siguientePagina(e: any) {
    this.cargarCursos(e.pageIndex, e.pageSize);
  }

  mostrarCompetencias(id: number) {
    this.competenciaService.listarPorCurso(id).subscribe(
      response => {
        this.competencias = response;
        if (this.competencias.length > 0) {
          this.dialog.open(DialogCompetenciasComponent, {
            disableClose: true,
            data: {
              titulo: 'Listado de Competencias',
              competencias: this.competencias
            }
          });
        } else {
          this.snackBar.open('No hay competencias registradas', 'AVISO', { duration: 2000 });
        }
      }
    );
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
        this.cursoService.eliminar(id).subscribe(
          () => {
            this.cargarCursos();
            this.snackBar.open('Registro eliminado correctamente', 'AVISO', { duration: 2000 });
          }
        );
      }
    });
  }

}
