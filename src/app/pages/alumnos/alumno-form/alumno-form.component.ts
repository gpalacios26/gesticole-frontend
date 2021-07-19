import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { Alumno } from 'src/app/models/alumno.model';
import { TipoDocumento } from 'src/app/models/tipo-documento.model';
import { Sexo } from 'src/app/models/sexo.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlumnoService } from 'src/app/services/alumno.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { SexoService } from 'src/app/services/sexo.service';

@Component({
  selector: 'app-alumno-form',
  templateUrl: './alumno-form.component.html',
  styleUrls: ['./alumno-form.component.css']
})
export class AlumnoFormComponent implements OnInit {

  public form: FormGroup;
  public usuario: Usuario;
  public alumno: Alumno;
  public tiposDocumento: TipoDocumento[] = [];
  public sexos: Sexo[] = [];
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
    private alumnoService: AlumnoService,
    private tipoDocumentoService: TipoDocumentoService,
    private sexoService: SexoService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.cargarTipoDocumento();
    this.cargarSexo();
    this.configFormulario();
  }

  crearFormulario() {
    let regExCorreo = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$';

    this.form = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      idTipoDoc: ['', Validators.required],
      numDocumento: ['', Validators.required],
      fechaNac: ['', Validators.required],
      idSexo: ['', Validators.required],
      telCelular: [''],
      telFijo: [''],
      correo: ['', [Validators.required, Validators.pattern(regExCorreo)]]
    });
  }

  configFormulario() {
    this.route.params.subscribe((params: Params) => {
      if (params['id'] != null) {
        this.id = params['id'];
        this.edicion = true;
        this.titulo = "Editar Alumno";
        this.txtBoton = "Editar";
        this.cargarAlumno();
      } else {
        this.edicion = false;
        this.titulo = "Registrar Alumno";
        this.txtBoton = "Registrar";
      }
    });
  }

  cargarAlumno() {
    this.alumnoService.listarPorId(this.id).subscribe(
      response => {
        this.alumno = response;
        this.form.reset({
          nombres: this.alumno.nombres,
          apellidos: this.alumno.apellidos,
          idTipoDoc: this.alumno.tipoDocumento.idTipoDoc,
          numDocumento: this.alumno.numDocumento,
          fechaNac: this.alumno.fechaNac,
          idSexo: this.alumno.sexo.idSexo,
          telCelular: this.alumno.telCelular,
          telFijo: this.alumno.telFijo,
          correo: this.alumno.correo
        });
      }
    );
  }

  cargarTipoDocumento() {
    this.tipoDocumentoService.listar().subscribe(tiposDocumento => this.tiposDocumento = tiposDocumento);
  }

  cargarSexo() {
    this.sexoService.listar().subscribe(sexos => this.sexos = sexos);
  }

  guardarDatos() {
    let formulario = this.form.value;
    if (this.form.invalid) {
      this.snackBar.open('Debe completar los datos para registrar', 'AVISO', { duration: 2000 });
    } else {
      let peticion: Observable<any>;
      let mensaje: string;
      let mensajeError: string;

      let tipoDocumento = new TipoDocumento(formulario.idTipoDoc, null);
      let sexo = new Sexo(formulario.idSexo, null);

      let alumno = (this.edicion) ? this.alumno : new Alumno(null);
      alumno.nombres = formulario.nombres;
      alumno.apellidos = formulario.apellidos;
      alumno.tipoDocumento = tipoDocumento;
      alumno.numDocumento = formulario.numDocumento;
      alumno.fechaNac = formulario.fechaNac;
      alumno.sexo = sexo;
      alumno.telCelular = formulario.telCelular;
      alumno.telFijo = formulario.telFijo;
      alumno.correo = formulario.correo;

      if (this.edicion) {
        peticion = this.alumnoService.modificar(alumno);
        mensaje = 'El alumno fue actualizado correctamente';
        mensajeError = 'Error al actualizar el alumno';
      } else {
        peticion = this.alumnoService.registrar(alumno);
        mensaje = 'El alumno fue registrado correctamente';
        mensajeError = 'Error al registrar el alumno';
      }

      peticion.subscribe(
        response => {
          if (response) {
            this.snackBar.open(mensaje, 'AVISO', { duration: 2000 });
            setTimeout(() => {
              this.router.navigate(['panel/alumnos']);
            }, 1000);
          } else {
            this.snackBar.open(mensajeError, 'ERROR', { duration: 2000 });
          }
        }
      );
    }
  }

}
