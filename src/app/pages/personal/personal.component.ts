import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from 'src/app/models/usuario.model';
import { Personal } from 'src/app/models/personal.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { PersonalService } from 'src/app/services/personal.service';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogPersonalComponent } from 'src/app/dialogs/dialog-personal/dialog-personal.component';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

  public usuario: Usuario;
  public personal: Personal[];
  public displayedColumns = ['idPersonal', 'nombres', 'apellidos', 'tipoDocumento', 'numDocumento', 'ficha', 'acciones'];
  public displayedColumnsMobile = ['idPersonal', 'nombres', 'apellidos', 'acciones'];
  public dataSource: MatTableDataSource<Personal>;
  public cantidad: number = 0;
  public mobile: boolean = false;
  public displayedColumnsFinal: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private personalService: PersonalService
  ) {
    this.mobile = (window.innerWidth <= 640) ? true : false;
    this.setColumns();
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.cargarPersonal();
  }

  onResize(event) {
    this.mobile = (event.target.innerWidth <= 640) ? true : false;
    this.setColumns();
  }

  setColumns() {
    this.displayedColumnsFinal = (this.mobile) ? this.displayedColumnsMobile : this.displayedColumns;
  }

  cargarPersonal(page: number = 0, size: number = 10) {
    this.personalService.listarPaginado(page, size).subscribe(
      response => {
        this.personal = response.content;
        this.cantidad = response.totalElements;
        this.dataSource = new MatTableDataSource(this.personal);
        this.dataSource.sort = this.sort;

        const sortState: Sort = { active: 'idPersonal', direction: 'desc' };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    );
  }

  siguientePagina(e: any) {
    this.cargarPersonal(e.pageIndex, e.pageSize);
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
        this.personalService.eliminar(id).subscribe(
          () => {
            this.cargarPersonal();
            this.snackBar.open('Registro eliminado correctamente', 'AVISO', { duration: 2000 });
          }
        );
      }
    });
  }

  mostrarFicha(id: number) {
    this.personalService.listarPorId(id).subscribe(
      response => {
        if (response) {
          this.dialog.open(DialogPersonalComponent, {
            disableClose: true,
            data: {
              titulo: 'Ficha de Personal',
              personal: response
            }
          });
        } else {
          this.snackBar.open('No hay información disponible', 'AVISO', { duration: 2000 });
        }
      }
    );
  }

  exportar() {
    this.personalService.exportar().subscribe(
      response => {
        if (response) {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.setAttribute('style', 'display:none');
          document.body.appendChild(a);
          a.href = url;
          a.download = 'personal.xlsx';
          a.click();
        } else {
          this.snackBar.open('Error al descargar la información', 'AVISO', { duration: 2000 });
        }
      }
    );
  }

  exportarFicha(id: number) {
    this.personalService.exportarFicha(id).subscribe(
      response => {
        if (response) {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.setAttribute('style', 'display:none');
          document.body.appendChild(a);
          a.href = url;
          a.download = 'personal.pdf';
          a.click();
        } else {
          this.snackBar.open('Error al descargar la información', 'AVISO', { duration: 2000 });
        }
      }
    );
  }

}
