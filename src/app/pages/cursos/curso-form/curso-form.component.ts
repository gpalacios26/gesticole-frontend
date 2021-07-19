import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { Curso } from 'src/app/models/curso.model';
import { Anio } from 'src/app/models/anio.model';
import { Nivel } from 'src/app/models/nivel.model';
import { Competencia } from 'src/app/models/competencia.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CursoService } from 'src/app/services/curso.service';
import { AnioService } from 'src/app/services/anio.service';
import { NivelService } from 'src/app/services/nivel.service';
import { CompetenciaService } from 'src/app/services/competencia.service';
import { CursoCompetencias } from 'src/app/interfaces/curso-competencias.interface';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-curso-form',
  templateUrl: './curso-form.component.html',
  styleUrls: ['./curso-form.component.css']
})
export class CursoFormComponent implements OnInit {

  public form: FormGroup;
  public usuario: Usuario;
  public curso: Curso;
  public anios: Anio[] = [];
  public niveles: Nivel[] = [];
  public competencias: Competencia[] = [];
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
    private cursoService: CursoService,
    private anioService: AnioService,
    private nivelService: NivelService,
    private competenciaService: CompetenciaService
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
      competencia: ['']
    });
  }

  configFormulario() {
    this.route.params.subscribe((params: Params) => {
      if (params['id'] != null) {
        this.id = params['id'];
        this.edicion = true;
        this.titulo = "Editar Curso";
        this.txtBoton = "Editar";
        this.cargarCurso();
        this.cargarCompetencias();
      } else {
        this.edicion = false;
        this.titulo = "Registrar Curso";
        this.txtBoton = "Registrar";
      }
    });
  }

  cargarCurso() {
    this.cursoService.listarPorId(this.id).subscribe(
      response => {
        this.curso = response;
        this.form.reset({
          idAnio: this.curso.anio.idAnio,
          idNivel: this.curso.nivel.idNivel,
          descripcion: this.curso.descripcion,
          competencia: ''
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

  cargarCompetencias() {
    this.competenciaService.listarPorCurso(this.id).subscribe(competencias => this.competencias = competencias);
  }

  agregarCompetencia() {
    let formulario = this.form.value;
    if (formulario.competencia != null && formulario.competencia != '') {
      let nuevaCompetencia = new Competencia(null, null, formulario.competencia);
      this.competencias.push(nuevaCompetencia);

      this.form.reset({
        idAnio: formulario.idAnio,
        idNivel: formulario.idNivel,
        descripcion: formulario.descripcion,
        competencia: ''
      });

    } else {
      this.snackBar.open('Debe completar los datos para agregar', 'AVISO', { duration: 2000 });
    }
  }

  eliminarCompetencia(index: number) {
    this.competencias.splice(index, 1);
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
        let curso = this.curso;
        curso.anio = anio;
        curso.nivel = nivel;
        curso.descripcion = formulario.descripcion;
        let dto = new CursoCompetencias();
        dto.curso = curso;
        dto.competencias = this.competencias;

        peticion = this.cursoService.modificar(dto);
        mensaje = 'El curso fue actualizado correctamente';
        mensajeError = 'Error al actualizar el curso';
      } else {
        let curso = new Curso(null, anio, nivel, formulario.descripcion);
        let dto = new CursoCompetencias();
        dto.curso = curso;
        dto.competencias = this.competencias;

        peticion = this.cursoService.registrar(dto);
        mensaje = 'El curso fue registrado correctamente';
        mensajeError = 'Error al registrar el curso';
      }

      peticion.subscribe(
        response => {
          if (response) {
            this.snackBar.open(mensaje, 'AVISO', { duration: 2000 });
            setTimeout(() => {
              this.router.navigate(['panel/cursos']);
            }, 1000);
          } else {
            this.snackBar.open(mensajeError, 'ERROR', { duration: 2000 });
          }
        }
      );
    }
  }

}
