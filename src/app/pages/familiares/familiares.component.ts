import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from 'src/app/models/usuario.model';
import { Familiar } from 'src/app/models/familiar.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FamiliarService } from 'src/app/services/familiar.service';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogFamiliarComponent } from 'src/app/dialogs/dialog-familiar/dialog-familiar.component';

@Component({
  selector: 'app-familiares',
  templateUrl: './familiares.component.html',
  styleUrls: ['./familiares.component.css']
})
export class FamiliaresComponent implements OnInit {

  public usuario: Usuario;
  public familiares: Familiar[];
  public displayedColumns = ['idFamiliar', 'nombres', 'apellidos', 'tipoDocumento', 'numDocumento', 'ficha', 'acciones'];
  public displayedColumnsMobile = ['idFamiliar', 'nombres', 'apellidos', 'acciones'];
  public dataSource: MatTableDataSource<Familiar>;
  public cantidad: number = 0;
  public mobile: boolean = false;
  public displayedColumnsFinal: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private familiarService: FamiliarService
  ) {
    this.mobile = (window.innerWidth <= 640) ? true : false;
    this.setColumns();
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.cargarFamiliares();
  }

  onResize(event) {
    this.mobile = (event.target.innerWidth <= 640) ? true : false;
    this.setColumns();
  }

  setColumns() {
    this.displayedColumnsFinal = (this.mobile) ? this.displayedColumnsMobile : this.displayedColumns;
  }

  cargarFamiliares(page: number = 0, size: number = 10) {
    this.familiarService.listarPaginado(page, size).subscribe(
      response => {
        this.familiares = response.content;
        this.cantidad = response.totalElements;
        this.dataSource = new MatTableDataSource(this.familiares);
        this.dataSource.sort = this.sort;

        const sortState: Sort = { active: 'idFamiliar', direction: 'desc' };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    );
  }

  siguientePagina(e: any) {
    this.cargarFamiliares(e.pageIndex, e.pageSize);
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
        this.familiarService.eliminar(id).subscribe(
          () => {
            this.cargarFamiliares();
            this.snackBar.open('Registro eliminado correctamente', 'AVISO', { duration: 2000 });
          }
        );
      }
    });
  }

  mostrarFicha(id: number) {
    this.familiarService.listarPorId(id).subscribe(
      response => {
        if (response) {
          this.dialog.open(DialogFamiliarComponent, {
            disableClose: true,
            data: {
              titulo: 'Ficha de Familiar',
              familiar: response
            }
          });
        } else {
          this.snackBar.open('No hay información disponible', 'AVISO', { duration: 2000 });
        }
      }
    );
  }

  exportar() {
    this.familiarService.exportar().subscribe(
      response => {
        if (response) {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.setAttribute('style', 'display:none');
          document.body.appendChild(a);
          a.href = url;
          a.download = 'familiares.xlsx';
          a.click();
        } else {
          this.snackBar.open('Error al descargar la información', 'AVISO', { duration: 2000 });
        }
      }
    );
  }

  exportarFicha(id: number) {
    this.familiarService.exportarFicha(id).subscribe(
      response => {
        if (response) {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.setAttribute('style', 'display:none');
          document.body.appendChild(a);
          a.href = url;
          a.download = 'familiar.pdf';
          a.click();
        } else {
          this.snackBar.open('Error al descargar la información', 'AVISO', { duration: 2000 });
        }
      }
    );
  }

}
