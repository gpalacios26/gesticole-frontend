import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { Aula } from 'src/app/models/aula.model';
import { Anio } from 'src/app/models/anio.model';
import { Nivel } from 'src/app/models/nivel.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AulaService } from 'src/app/services/aula.service';
import { AnioService } from 'src/app/services/anio.service';
import { NivelService } from 'src/app/services/nivel.service';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-aula-form',
  templateUrl: './aula-form.component.html',
  styleUrls: ['./aula-form.component.css']
})
export class AulaFormComponent implements OnInit {

  public form: FormGroup;
  public usuario: Usuario;
  public aula: Aula;
  public anios: Anio[] = [];
  public niveles: Nivel[] = [];
  public id: number;
  public edicion: boolean;
  public titulo: string;
  public txtBoton: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private aulaService: AulaService,
    private anioService: AnioService,
    private nivelService: NivelService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.cargarAnios();
    this.cargarNiveles();
    this.configFormulario();
  }

  crearFormulario() {
    this.form = this.fb.group({
      idAnio: ['', Validators.required],
      idNivel: ['', Validators.required],
      descripcion: ['', Validators.required],
      vacantes: ['', Validators.required]
    });
  }

  configFormulario() {
    this.route.params.subscribe((params: Params) => {
      if (params['id'] != null) {
        this.id = params['id'];
        this.edicion = true;
        this.titulo = "Editar Aula";
        this.txtBoton = "Editar";
        this.cargarAula();
      } else {
        this.edicion = false;
        this.titulo = "Registrar Aula";
        this.txtBoton = "Registrar";
      }
    });
  }

  cargarAula() {
    this.aulaService.listarPorId(this.id).subscribe(
      response => {
        this.aula = response;
        this.form.reset({
          idAnio: this.aula.anio.idAnio,
          idNivel: this.aula.nivel.idNivel,
          descripcion: this.aula.descripcion,
          vacantes: this.aula.vacantes
        });
      }
    );
  }

  cargarAnios() {
    this.anioService.listar().subscribe(anios => this.anios = anios);
  }

  cargarNiveles() {
    this.nivelService.listar().subscribe(niveles => this.niveles = niveles);
  }

  nuevoAnio() {
    const confirmDialog = this.dialog.open(DialogConfirmComponent, {
      disableClose: true,
      data: {
        titulo: 'Alerta',
        mensaje: 'Deseas registrar un nuevo año escolar?'
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        let tamanio = this.anios.length;
        if (tamanio > 0) {
          let ultimo = this.anios[tamanio - 1];
          let nuevo = ultimo.idAnio + 1;
          let anio = new Anio(nuevo, nuevo.toString());
          this.anioService.registrar(anio).subscribe(
            () => {
              this.cargarAnios();
              this.snackBar.open('Nuevo año escolar registrado', 'AVISO', { duration: 2000 });
            }
          );
        }
      }
    });
  }

  guardarDatos() {
    let formulario = this.form.value;
    if (this.form.invalid) {
      this.snackBar.open('Debe completar los datos para registrar', 'AVISO', { duration: 2000 });
    } else {
      let peticion: Observable<any>;
      let mensaje: string;
      let mensajeError: string;

      let anio = new Anio(formulario.idAnio, '');
      let nivel = new Nivel(formulario.idNivel, '');

      if (this.edicion) {
        let aula = this.aula;
        aula.anio = anio;
        aula.nivel = nivel;
        aula.descripcion = formulario.descripcion;
        aula.vacantes = formulario.vacantes;

        peticion = this.aulaService.modificar(aula);
        mensaje = 'El aula fue actualizada correctamente';
        mensajeError = 'Error al actualizar el aula';
      } else {
        let aula = new Aula(null, anio, nivel, formulario.descripcion, formulario.vacantes);

        peticion = this.aulaService.registrar(aula);
        mensaje = 'El aula fue registrada correctamente';
        mensajeError = 'Error al registrar el aula';
      }

      peticion.subscribe(
        response => {
          if (response) {
            this.snackBar.open(mensaje, 'AVISO', { duration: 2000 });
            setTimeout(() => {
              this.router.navigate(['panel/aulas']);
            }, 1000);
          } else {
            this.snackBar.open(mensajeError, 'ERROR', { duration: 2000 });
          }
        }
      );
    }
  }

}
