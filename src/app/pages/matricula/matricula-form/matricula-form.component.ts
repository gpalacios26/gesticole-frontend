import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { MatriculaAula } from 'src/app/models/matricula-aula.model';
import { MatriculaAulaDetalle } from 'src/app/models/matricula-aula-detalle.model';
import { Anio } from 'src/app/models/anio.model';
import { Nivel } from 'src/app/models/nivel.model';
import { Aula } from 'src/app/models/aula.model';
import { Alumno } from 'src/app/models/alumno.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MatriculaAulaService } from 'src/app/services/matricula-aula.service';
import { AnioService } from 'src/app/services/anio.service';
import { NivelService } from 'src/app/services/nivel.service';
import { AulaService } from 'src/app/services/aula.service';
import { AlumnoService } from 'src/app/services/alumno.service';
import { MatriculaAulaDTO } from 'src/app/interfaces/matricula-aula-dto.interface';

@Component({
  selector: 'app-matricula-form',
  templateUrl: './matricula-form.component.html',
  styleUrls: ['./matricula-form.component.css']
})
export class MatriculaFormComponent implements OnInit {

  public form: FormGroup;
  public usuario: Usuario;
  public matricula: MatriculaAula;
  public matriculaDetalle: MatriculaAulaDetalle[] = [];
  public anios: Anio[] = [];
  public niveles: Nivel[] = [];
  public aulas: Aula[] = [];
  public alumnos: Alumno[] = [];
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
    private matriculaAulaService: MatriculaAulaService,
    private anioService: AnioService,
    private nivelService: NivelService,
    private aulaService: AulaService,
    private alumnoService: AlumnoService
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
      idAlumno: [{ value: '', disabled: true }]
    });
  }

  configFormulario() {
    this.route.params.subscribe((params: Params) => {
      if (params['id'] != null) {
        this.id = params['id'];
        this.edicion = true;
        this.titulo = "Editar Matrícula de Alumnos";
        this.txtBoton = "Editar";
        this.cargarMatricula();
        this.cargarMatriculaDetalle();
      } else {
        this.edicion = false;
        this.titulo = "Registrar Matrícula de Alumnos";
        this.txtBoton = "Registrar";
      }
    });
  }

  cargarMatricula() {
    this.matriculaAulaService.listarPorId(this.id).subscribe(
      response => {
        this.matricula = response;
        this.form.reset({
          idAnio: this.matricula.aula.anio.idAnio,
          idNivel: this.matricula.aula.nivel.idNivel,
          idAula: this.matricula.aula.idAula,
          idAlumno: ''
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

  cargarAlumnos() {
    this.alumnoService.listar().subscribe(alumnos => this.alumnos = alumnos);
  }

  cargarMatriculaDetalle() {
    this.matriculaAulaService.listarPorIdMatricula(this.id).subscribe(detalle => this.matriculaDetalle = detalle);
  }

  filtrarAnioNivel() {
    let formulario = this.form.value;
    let idAnio = formulario.idAnio;
    let idNivel = formulario.idNivel;
    if (idAnio && idNivel) {
      this.cargarAulas(idAnio, idNivel);
      this.cargarAlumnos();
      this.form.get('idAula').enable();
      this.form.get('idAlumno').enable();
    }
  }

  agregarAlumno() {
    let formulario = this.form.value;
    if (formulario.idAlumno != null && formulario.idAlumno != '') {
      let alumno = this.alumnos.filter(el => el.idAlumno == formulario.idAlumno)[0];
      let nuevoAlumno = new MatriculaAulaDetalle(null, null, alumno);

      let existe = this.matriculaDetalle.filter(el => el.alumno.idAlumno == nuevoAlumno.alumno.idAlumno) || [];
      if (existe.length > 0) {
        this.snackBar.open('No se puede duplicar registros', 'AVISO', { duration: 2000 });
      } else {
        this.matriculaDetalle.push(nuevoAlumno);

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

  eliminarAlumno(index: number) {
    this.matriculaDetalle.splice(index, 1);
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
        let matricula = this.matricula;
        matricula.aula = aula;
        matricula.usuario = usuario;
        let dto = new MatriculaAulaDTO();
        dto.matricula = matricula;
        dto.detalle = this.matriculaDetalle;

        peticion = this.matriculaAulaService.modificar(dto);
        mensaje = 'La matrícula fue actualizada correctamente';
        mensajeError = 'Error al actualizar la matrícula';
      } else {
        let matricula = new MatriculaAula(null, aula, usuario);
        let dto = new MatriculaAulaDTO();
        dto.matricula = matricula;
        dto.detalle = this.matriculaDetalle;

        peticion = this.matriculaAulaService.registrar(dto);
        mensaje = 'La matrícula fue registrada correctamente';
        mensajeError = 'Error al registrar la matrícula';
      }

      peticion.subscribe(
        response => {
          if (response) {
            this.snackBar.open(mensaje, 'AVISO', { duration: 2000 });
            setTimeout(() => {
              this.router.navigate(['panel/matricula']);
            }, 1000);
          } else {
            this.snackBar.open(mensajeError, 'ERROR', { duration: 2000 });
          }
        }
      );
    }
  }

}
