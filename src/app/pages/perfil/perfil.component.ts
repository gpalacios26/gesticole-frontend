import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public form: FormGroup;
  public usuario: Usuario;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private usuarioService: UsuarioService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    this.cargarPerfil();
  }

  crearFormulario() {
    let regExLetrasEspacios = '[a-zA-ZÀ-ÿ ]+';

    this.form = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(3), Validators.pattern(regExLetrasEspacios)]],
      apellidos: ['', [Validators.required, Validators.minLength(3), Validators.pattern(regExLetrasEspacios)]],
    });
  }

  cargarPerfil() {
    this.form.reset({
      nombres: this.usuario.nombres,
      apellidos: this.usuario.apellidos
    });
  }

  actualizarPerfil() {
    let formulario = this.form.value;
    if (this.form.invalid) {
      this.snackBar.open('Debe completar los datos para guardar los cambios', 'AVISO', { duration: 2000 });
    } else {
      let usuario = this.usuario;
      usuario.nombres = formulario.nombres;
      usuario.apellidos = formulario.apellidos;

      this.usuarioService.modificarPerfil(usuario).subscribe(
        response => {
          if (response == 1) {
            this.usuarioService.setUsuario();
            this.snackBar.open('Los datos fueron actualizados correctamente', 'AVISO', { duration: 2000 });
          } else {
            this.snackBar.open('Error al actualizar los datos', 'AVISO', { duration: 2000 });
          }
        }
      );
    }
  }

}
