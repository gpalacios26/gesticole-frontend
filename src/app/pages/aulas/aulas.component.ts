import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from 'src/app/models/usuario.model';
import { Aula } from 'src/app/models/aula.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AulaService } from 'src/app/services/aula.service';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-aulas',
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.css']
})
export class AulasComponent implements OnInit {

  public usuario: Usuario;
  public aulas: Aula[];
  public displayedColumns = ['idAula', 'anio', 'nivel', 'descripcion', 'vacantes', 'acciones'];
  public displayedColumnsMobile = ['idAula', 'descripcion', 'acciones'];
  public dataSource: MatTableDataSource<Aula>;
  public cantidad: number = 0;
  public mobile: boolean = false;
  public displayedColumnsFinal: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private aulaService: AulaService
  ) {
    this.mobile = (window.innerWidth <= 640) ? true : false;
    this.setColumns();
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.cargarAulas();
  }

  onResize(event) {
    this.mobile = (event.target.innerWidth <= 640) ? true : false;
    this.setColumns();
  }

  setColumns() {
    this.displayedColumnsFinal = (this.mobile) ? this.displayedColumnsMobile : this.displayedColumns;
  }

  cargarAulas(page: number = 0, size: number = 10) {
    this.aulaService.listarPaginado(page, size).subscribe(
      response => {
        this.aulas = response.content;
        this.cantidad = response.totalElements;
        this.dataSource = new MatTableDataSource(this.aulas);
        this.dataSource.sort = this.sort;

        const sortState: Sort = { active: 'idAula', direction: 'desc' };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    );
  }

  siguientePagina(e: any) {
    this.cargarAulas(e.pageIndex, e.pageSize);
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
        this.aulaService.eliminar(id).subscribe(
          () => {
            this.cargarAulas();
            this.snackBar.open('Registro eliminado correctamente', 'AVISO', { duration: 2000 });
          }
        );
      }
    });
  }

}
