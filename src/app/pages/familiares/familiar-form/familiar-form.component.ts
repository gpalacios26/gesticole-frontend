import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from 'src/app/models/usuario.model';
import { Familiar } from 'src/app/models/familiar.model';
import { Alumno } from 'src/app/models/alumno.model';
import { Parentesco } from 'src/app/models/parentesco.model';
import { TipoDocumento } from 'src/app/models/tipo-documento.model';
import { Sexo } from 'src/app/models/sexo.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlumnoService } from 'src/app/services/alumno.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { SexoService } from 'src/app/services/sexo.service';
import { FamiliarService } from 'src/app/services/familiar.service';
import { ParentescoService } from 'src/app/services/parentesco.service';

@Component({
  selector: 'app-familiar-form',
  templateUrl: './familiar-form.component.html',
  styleUrls: ['./familiar-form.component.css']
})
export class FamiliarFormComponent implements OnInit {

  public form: FormGroup;
  public myControlAlumno: FormControl = new FormControl('', Validators.required);
  public usuario: Usuario;
  public familiar: Familiar;
  public alumnos: Alumno[] = [];
  public parentesco: Parentesco[] = [];
  public tiposDocumento: TipoDocumento[] = [];
  public sexos: Sexo[] = [];
  public id: number;
  public edicion: boolean;
  public titulo: string;
  public txtBoton: string;

  public alumnosFiltrados$: Observable<Alumno[]>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private usuarioService: UsuarioService,
    private familiarService: FamiliarService,
    private alumnoService: AlumnoService,
    private parentescoService: ParentescoService,
    private tipoDocumentoService: TipoDocumentoService,
    private sexoService: SexoService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.cargarAlumnos();
    this.cargarParentesco();
    this.cargarTipoDocumento();
    this.cargarSexo();
    this.configFormulario();
    this.alumnosFiltrados$ = this.myControlAlumno.valueChanges.pipe(map(val => this.filtrarAlumnos(val)));
  }

  crearFormulario() {
    let regExCorreo = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$';

    this.form = this.fb.group({
      alumno: this.myControlAlumno,
      idParentesco: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      idTipoDoc: ['', Validators.required],
      numDocumento: ['', Validators.required],
      fechaNac: ['', Validators.required],
      idSexo: ['', Validators.required],
      telCelular: ['', Validators.required],
      telFijo: [''],
      correo: ['', [Validators.required, Validators.pattern(regExCorreo)]],
      contactoEmergencia: [false]
    });
  }

  configFormulario() {
    this.route.params.subscribe((params: Params) => {
      if (params['id'] != null) {
        this.id = params['id'];
        this.edicion = true;
        this.titulo = "Editar Familiar";
        this.txtBoton = "Editar";
        this.cargarFamiliar();
      } else {
        this.edicion = false;
        this.titulo = "Registrar Familiar";
        this.txtBoton = "Registrar";
      }
    });
  }

  cargarFamiliar() {
    this.familiarService.listarPorId(this.id).subscribe(
      response => {
        this.familiar = response;
        this.form.reset({
          alumno: this.familiar.alumno,
          idParentesco: this.familiar.parentesco.idParentesco,
          nombres: this.familiar.nombres,
          apellidos: this.familiar.apellidos,
          idTipoDoc: this.familiar.tipoDocumento.idTipoDoc,
          numDocumento: this.familiar.numDocumento,
          fechaNac: this.familiar.fechaNac,
          idSexo: this.familiar.sexo.idSexo,
          telCelular: this.familiar.telCelular,
          telFijo: this.familiar.telFijo,
          correo: this.familiar.correo,
          contactoEmergencia: this.familiar.contactoEmergencia
        });
      }
    );
  }

  cargarAlumnos() {
    this.alumnoService.listar().subscribe(alumnos => this.alumnos = alumnos);
  }

  cargarParentesco() {
    this.parentescoService.listar().subscribe(parentesco => this.parentesco = parentesco);
  }

  cargarTipoDocumento() {
    this.tipoDocumentoService.listar().subscribe(tiposDocumento => this.tiposDocumento = tiposDocumento);
  }

  cargarSexo() {
    this.sexoService.listar().subscribe(sexos => this.sexos = sexos);
  }

  filtrarAlumnos(val: any) {
    if (val != null && val.idAlumno > 0) {
      return this.alumnos.filter(el =>
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase())
      );
    }
    return this.alumnos.filter(el =>
      el.nombres.toLowerCase().includes(val?.toLowerCase()) || el.apellidos.toLowerCase().includes(val?.toLowerCase())
    );
  }

  mostrarAlumno(val: Alumno) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  guardarDatos() {
    let formulario = this.form.value;
    if (this.form.invalid) {
      this.snackBar.open('Debe completar los datos para registrar', 'AVISO', { duration: 2000 });
    } else {
      let peticion: Observable<any>;
      let mensaje: string;
      let mensajeError: string;

      let alumno = formulario.alumno;
      let parentesco = new Parentesco(formulario.idParentesco, null);
      let tipoDocumento = new TipoDocumento(formulario.idTipoDoc, null);
      let sexo = new Sexo(formulario.idSexo, null);

      let familiar = (this.edicion) ? this.familiar : new Familiar(null);
      familiar.alumno = alumno;
      familiar.parentesco = parentesco;
      familiar.nombres = formulario.nombres;
      familiar.apellidos = formulario.apellidos;
      familiar.tipoDocumento = tipoDocumento;
      familiar.numDocumento = formulario.numDocumento;
      familiar.fechaNac = formulario.fechaNac;
      familiar.sexo = sexo;
      familiar.telCelular = formulario.telCelular;
      familiar.telFijo = formulario.telFijo;
      familiar.correo = formulario.correo;
      familiar.contactoEmergencia = formulario.contactoEmergencia;

      if (this.edicion) {
        peticion = this.familiarService.modificar(familiar);
        mensaje = 'El familiar del alumno fue actualizado correctamente';
        mensajeError = 'Error al actualizar el familiar del alumno';
      } else {
        peticion = this.familiarService.registrar(familiar);
        mensaje = 'El familiar del alumno fue registrado correctamente';
        mensajeError = 'Error al registrar el familiar del alumno';
      }

      peticion.subscribe(
        response => {
          if (response) {
            this.snackBar.open(mensaje, 'AVISO', { duration: 2000 });
            setTimeout(() => {
              this.router.navigate(['panel/familiares']);
            }, 1000);
          } else {
            this.snackBar.open(mensajeError, 'ERROR', { duration: 2000 });
          }
        }
      );
    }
  }

}
