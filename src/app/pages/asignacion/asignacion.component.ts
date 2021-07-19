import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from 'src/app/models/usuario.model';
import { AsignacionAula } from 'src/app/models/asignacion-aula.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AsignacionAulaService } from 'src/app/services/asignacion-aula.service';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.component.html',
  styleUrls: ['./asignacion.component.css']
})
export class AsignacionComponent implements OnInit {

  public usuario: Usuario;
  public asignaciones: AsignacionAula[];
  public displayedColumns = ['idAsignacion', 'anio', 'nivel', 'aula', 'acciones'];
  public displayedColumnsMobile = ['idAsignacion', 'aula', 'acciones'];
  public dataSource: MatTableDataSource<AsignacionAula>;
  public cantidad: number = 0;
  public mobile: boolean = false;
  public displayedColumnsFinal: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private asignacionAulaService: AsignacionAulaService
  ) {
    this.mobile = (window.innerWidth <= 640) ? true : false;
    this.setColumns();
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.cargarAsignaciones();
  }

  onResize(event) {
    this.mobile = (event.target.innerWidth <= 640) ? true : false;
    this.setColumns();
  }

  setColumns() {
    this.displayedColumnsFinal = (this.mobile) ? this.displayedColumnsMobile : this.displayedColumns;
  }

  cargarAsignaciones(page: number = 0, size: number = 10) {
    this.asignacionAulaService.listarPaginado(page, size).subscribe(
      response => {
        this.asignaciones = response.content;
        this.cantidad = response.totalElements;
        this.dataSource = new MatTableDataSource(this.asignaciones);
        this.dataSource.sort = this.sort;

        const sortState: Sort = { active: 'idAsignacion', direction: 'desc' };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    );
  }

  siguientePagina(e: any) {
    this.cargarAsignaciones(e.pageIndex, e.pageSize);
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
        this.asignacionAulaService.eliminar(id).subscribe(
          () => {
            this.cargarAsignaciones();
            this.snackBar.open('Registro eliminado correctamente', 'AVISO', { duration: 2000 });
          }
        );
      }
    });
  }

}
