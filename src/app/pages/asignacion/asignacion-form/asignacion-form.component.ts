import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { AsignacionAula } from 'src/app/models/asignacion-aula.model';
import { AsignacionAulaDetalle } from 'src/app/models/asignacion-aula-detalle.model';
import { Anio } from 'src/app/models/anio.model';
import { Nivel } from 'src/app/models/nivel.model';
import { Aula } from 'src/app/models/aula.model';
import { Curso } from 'src/app/models/curso.model';
import { Personal } from 'src/app/models/personal.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AsignacionAulaService } from 'src/app/services/asignacion-aula.service';
import { AnioService } from 'src/app/services/anio.service';
import { NivelService } from 'src/app/services/nivel.service';
import { AulaService } from 'src/app/services/aula.service';
import { CursoService } from 'src/app/services/curso.service';
import { PersonalService } from 'src/app/services/personal.service';
import { AsignacionAulaDTO } from 'src/app/interfaces/asignacion-aula-dto.interface';

@Component({
  selector: 'app-asignacion-form',
  templateUrl: './asignacion-form.component.html',
  styleUrls: ['./asignacion-form.component.css']
})
export class AsignacionFormComponent implements OnInit {

  public form: FormGroup;
  public usuario: Usuario;
  public asignacion: AsignacionAula;
  public asignacionDetalle: AsignacionAulaDetalle[] = [];
  public anios: Anio[] = [];
  public niveles: Nivel[] = [];
  public aulas: Aula[] = [];
  public cursos: Curso[] = [];
  public personas: Personal[] = [];
  public id: number;
  public edicion: boolean;
  public titulo: string;
  public txtBoton: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private usuarioService: UsuarioService,
    private asignacionAulaService: AsignacionAulaService,
    private anioService: AnioService,
    private nivelService: NivelService,
    private aulaService: AulaService,
    private cursoService: CursoService,
    private personalService: PersonalService
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
      idAula: [{ value: '', disabled: true }, Validators.required],
      idCurso: [{ value: '', disabled: true }],
      idPersonal: [{ value: '', disabled: true }]
    });
  }

  configFormulario() {
    this.route.params.subscribe((params: Params) => {
      if (params['id'] != null) {
        this.id = params['id'];
        this.edicion = true;
        this.titulo = "Editar Asignación de Aula / Cursos";
        this.txtBoton = "Editar";
        this.cargarAsignacion();
        this.cargarAsignacionDetalle();
      } else {
        this.edicion = false;
        this.titulo = "Registrar Asignación de Aula / Cursos";
        this.txtBoton = "Registrar";
      }
    });
  }

  cargarAsignacion() {
    this.asignacionAulaService.listarPorId(this.id).subscribe(
      response => {
        this.asignacion = response;
        this.form.reset({
          idAnio: this.asignacion.aula.anio.idAnio,
          idNivel: this.asignacion.aula.nivel.idNivel,
          idAula: this.asignacion.aula.idAula,
          idCurso: '',
          idPersonal: ''
        });
        this.filtrarAnioNivel();
      }
    );
  }

  cargarAnios() {
    this.anioService.listar().subscribe(anios => this.anios = anios);
  }

  cargarNiveles() {
    this.nivelService.listar().subscribe(niveles => this.niveles = niveles);
  }

  cargarAulas(idAnio: number, idNivel: number) {
    this.aulaService.listar().subscribe(
      aulas => {
        this.aulas = aulas;
        this.aulas = this.aulas.filter(el => el.anio.idAnio == idAnio && el.nivel.idNivel == idNivel);
      }
    );
  }

  cargarCursos(idAnio: number, idNivel: number) {
    this.cursoService.listar().subscribe(
      cursos => {
        this.cursos = cursos;
        this.cursos = this.cursos.filter(el => el.anio.idAnio == idAnio && el.nivel.idNivel == idNivel);
      }
    );
  }

  cargarPersonal() {
    this.personalService.listar().subscribe(
      personal => {
        this.personas = personal;
        this.personas = this.personas.filter(el => el.tipoPersonal.idTipoPersonal == 1);
      }
    );
  }

  cargarAsignacionDetalle() {
    this.asignacionAulaService.listarPorIdAsignacion(this.id).subscribe(detalle => this.asignacionDetalle = detalle);
  }

  filtrarAnioNivel() {
    let formulario = this.form.value;
    let idAnio = formulario.idAnio;
    let idNivel = formulario.idNivel;
    if (idAnio && idNivel) {
      this.cargarAulas(idAnio, idNivel);
      this.cargarCursos(idAnio, idNivel);
      this.cargarPersonal();
      this.form.get('idAula').enable();
      this.form.get('idCurso').enable();
      this.form.get('idPersonal').enable();
    }
  }

  agregarCurso() {
    let formulario = this.form.value;
    if (formulario.idCurso != null && formulario.idCurso != '' && formulario.idPersonal != null && formulario.idPersonal != '') {
      let curso = this.cursos.filter(el => el.idCurso == formulario.idCurso)[0];
      let personal = this.personas.filter(el => el.idPersonal == formulario.idPersonal)[0];
      let nuevoCurso = new AsignacionAulaDetalle(null, null, curso, personal);

      let existe = this.asignacionDetalle.filter(el => el.curso.idCurso == nuevoCurso.curso.idCurso && el.personal.idPersonal == nuevoCurso.personal.idPersonal) || [];
      if (existe.length > 0) {
        this.snackBar.open('No se puede duplicar registros', 'AVISO', { duration: 2000 });
      } else {
        this.asignacionDetalle.push(nuevoCurso);

        this.form.reset({
          idAnio: formulario.idAnio,
          idNivel: formulario.idNivel,
          idAula: formulario.idAula,
          idCurso: '',
          idPersonal: ''
        });
      }
    } else {
      this.snackBar.open('Debe completar los datos para agregar', 'AVISO', { duration: 2000 });
    }
  }

  eliminarCurso(index: number) {
    this.asignacionDetalle.splice(index, 1);
  }

  guardarDatos() {
    let formulario = this.form.value;
    if (this.form.invalid) {
      this.snackBar.open('Debe completar los datos para registrar', 'AVISO', { duration: 2000 });
    } else {
      let peticion: Observable<any>;
      let mensaje: string;
      let mensajeError: string;

      let aula = new Aula(formulario.idAula, null, null, null, null);
      let usuario = this.usuario;;

      if (this.edicion) {
        let asignacion = this.asignacion;
        asignacion.aula = aula;
        asignacion.usuario = usuario;
        let dto = new AsignacionAulaDTO();
        dto.asignacion = asignacion;
        dto.detalle = this.asignacionDetalle;

        peticion = this.asignacionAulaService.modificar(dto);
        mensaje = 'La asignación fue actualizada correctamente';
        mensajeError = 'Error al actualizar la asignación';
      } else {
        let asignacion = new AsignacionAula(null, aula, usuario);
        let dto = new AsignacionAulaDTO();
        dto.asignacion = asignacion;
        dto.detalle = this.asignacionDetalle;

        peticion = this.asignacionAulaService.registrar(dto);
        mensaje = 'La asignación fue registrada correctamente';
        mensajeError = 'Error al registrar la asignación';
      }

      peticion.subscribe(
        response => {
          if (response) {
            this.snackBar.open(mensaje, 'AVISO', { duration: 2000 });
            setTimeout(() => {
              this.router.navigate(['panel/asignacion']);
            }, 1000);
          } else {
            this.snackBar.open(mensajeError, 'ERROR', { duration: 2000 });
          }
        }
      );
    }
  }

}
