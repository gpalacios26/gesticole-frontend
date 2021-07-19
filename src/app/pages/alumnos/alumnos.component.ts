import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from 'src/app/models/usuario.model';
import { Alumno } from 'src/app/models/alumno.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlumnoService } from 'src/app/services/alumno.service';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogAlumnoComponent } from 'src/app/dialogs/dialog-alumno/dialog-alumno.component';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent implements OnInit {

  public usuario: Usuario;
  public alumnos: Alumno[];
  public displayedColumns = ['idAlumno', 'nombres', 'apellidos', 'tipoDocumento', 'numDocumento', 'ficha', 'acciones'];
  public displayedColumnsMobile = ['idAlumno', 'nombres', 'apellidos', 'acciones'];
  public dataSource: MatTableDataSource<Alumno>;
  public cantidad: number = 0;
  public mobile: boolean = false;
  public displayedColumnsFinal: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private alumnoService: AlumnoService
  ) {
    this.mobile = (window.innerWidth <= 640) ? true : false;
    this.setColumns();
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.cargarAlumnos();
  }

  onResize(event) {
    this.mobile = (event.target.innerWidth <= 640) ? true : false;
    this.setColumns();
  }

  setColumns() {
    this.displayedColumnsFinal = (this.mobile) ? this.displayedColumnsMobile : this.displayedColumns;
  }

  cargarAlumnos(page: number = 0, size: number = 10) {
    this.alumnoService.listarPaginado(page, size).subscribe(
      response => {
        this.alumnos = response.content;
        this.cantidad = response.totalElements;
        this.dataSource = new MatTableDataSource(this.alumnos);
        this.dataSource.sort = this.sort;

        const sortState: Sort = { active: 'idAlumno', direction: 'desc' };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    );
  }

  siguientePagina(e: any) {
    this.cargarAlumnos(e.pageIndex, e.pageSize);
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
        this.alumnoService.eliminar(id).subscribe(
          () => {
            this.cargarAlumnos();
            this.snackBar.open('Registro eliminado correctamente', 'AVISO', { duration: 2000 });
          }
        );
      }
    });
  }

  mostrarFicha(id: number) {
    this.alumnoService.listarPorId(id).subscribe(
      response => {
        if (response) {
          this.dialog.open(DialogAlumnoComponent, {
            disableClose: true,
            data: {
              titulo: 'Ficha de Alumno',
              alumno: response
            }
          });
        } else {
          this.snackBar.open('No hay información disponible', 'AVISO', { duration: 2000 });
        }
      }
    );
  }

  exportar() {
    this.alumnoService.exportar().subscribe(
      response => {
        if (response) {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.setAttribute('style', 'display:none');
          document.body.appendChild(a);
          a.href = url;
          a.download = 'alumnos.xlsx';
          a.click();
        } else {
          this.snackBar.open('Error al descargar la información', 'AVISO', { duration: 2000 });
        }
      }
    );
  }

  exportarFicha(id: number) {
    this.alumnoService.exportarFicha(id).subscribe(
      response => {
        if (response) {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.setAttribute('style', 'display:none');
          document.body.appendChild(a);
          a.href = url;
          a.download = 'alumno.pdf';
          a.click();
        } else {
          this.snackBar.open('Error al descargar la información', 'AVISO', { duration: 2000 });
        }
      }
    );
  }

}
