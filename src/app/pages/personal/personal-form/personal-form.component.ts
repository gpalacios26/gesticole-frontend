import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { Personal } from 'src/app/models/personal.model';
import { TipoDocumento } from 'src/app/models/tipo-documento.model';
import { Sexo } from 'src/app/models/sexo.model';
import { TipoPersonal } from 'src/app/models/tipo-personal.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { PersonalService } from 'src/app/services/personal.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { SexoService } from 'src/app/services/sexo.service';
import { TipoPersonalService } from 'src/app/services/tipo-personal.service';

@Component({
  selector: 'app-personal-form',
  templateUrl: './personal-form.component.html',
  styleUrls: ['./personal-form.component.css']
})
export class PersonalFormComponent implements OnInit {

  public form: FormGroup;
  public usuario: Usuario;
  public personal: Personal;
  public tiposDocumento: TipoDocumento[] = [];
  public sexos: Sexo[] = [];
  public tiposPersonal: TipoPersonal[] = [];
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
    private personalService: PersonalService,
    private tipoDocumentoService: TipoDocumentoService,
    private sexoService: SexoService,
    private tipoPersonalService: TipoPersonalService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.cargarTipoDocumento();
    this.cargarSexo();
    this.cargarTipoPersonal();
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
      telCelular: ['', Validators.required],
      telFijo: [''],
      correo: ['', [Validators.required, Validators.pattern(regExCorreo)]],
      idTipoPersonal: ['', Validators.required],
      cargo: ['', Validators.required]
    });
  }

  configFormulario() {
    this.route.params.subscribe((params: Params) => {
      if (params['id'] != null) {
        this.id = params['id'];
        this.edicion = true;
        this.titulo = "Editar Personal";
        this.txtBoton = "Editar";
        this.cargarPersonal();
      } else {
        this.edicion = false;
        this.titulo = "Registrar Personal";
        this.txtBoton = "Registrar";
      }
    });
  }

  cargarPersonal() {
    this.personalService.listarPorId(this.id).subscribe(
      response => {
        this.personal = response;
        this.form.reset({
          nombres: this.personal.nombres,
          apellidos: this.personal.apellidos,
          idTipoDoc: this.personal.tipoDocumento.idTipoDoc,
          numDocumento: this.personal.numDocumento,
          fechaNac: this.personal.fechaNac,
          idSexo: this.personal.sexo.idSexo,
          telCelular: this.personal.telCelular,
          telFijo: this.personal.telFijo,
          correo: this.personal.correo,
          idTipoPersonal: this.personal.tipoPersonal.idTipoPersonal,
          cargo: this.personal.cargo
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

  cargarTipoPersonal() {
    this.tipoPersonalService.listar().subscribe(tiposPersonal => this.tiposPersonal = tiposPersonal);
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
      let tipoPersonal = new TipoPersonal(formulario.idTipoPersonal, null);

      let personal = (this.edicion) ? this.personal : new Personal(null);
      personal.nombres = formulario.nombres;
      personal.apellidos = formulario.apellidos;
      personal.tipoDocumento = tipoDocumento;
      personal.numDocumento = formulario.numDocumento;
      personal.fechaNac = formulario.fechaNac;
      personal.sexo = sexo;
      personal.telCelular = formulario.telCelular;
      personal.telFijo = formulario.telFijo;
      personal.correo = formulario.correo;
      personal.tipoPersonal = tipoPersonal;
      personal.cargo = formulario.cargo;

      if (this.edicion) {
        peticion = this.personalService.modificar(personal);
        mensaje = 'El personal fue actualizado correctamente';
        mensajeError = 'Error al actualizar el personal';
      } else {
        peticion = this.personalService.registrar(personal);
        mensaje = 'El personal fue registrado correctamente';
        mensajeError = 'Error al registrar el personal';
      }

      peticion.subscribe(
        response => {
          if (response) {
            this.snackBar.open(mensaje, 'AVISO', { duration: 2000 });
            setTimeout(() => {
              this.router.navigate(['panel/personal']);
            }, 1000);
          } else {
            this.snackBar.open(mensajeError, 'ERROR', { duration: 2000 });
          }
        }
      );
    }
  }

}
