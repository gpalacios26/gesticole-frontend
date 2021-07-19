import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from 'src/app/models/usuario.model';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-cambio-clave',
  templateUrl: './cambio-clave.component.html',
  styleUrls: ['./cambio-clave.component.css']
})
export class CambioClaveComponent implements OnInit {

  public form: FormGroup;
  public usuario: Usuario;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private loginService: LoginService,
    private usuarioService: UsuarioService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
  }

  crearFormulario() {
    let regExPassword = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z\d$@$!%*?&].{8,}';

    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(regExPassword)]],
      repassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(regExPassword)]],
    });
  }

  actualizarClave() {
    let formulario = this.form.value;
    if (this.form.invalid) {
      this.snackBar.open('Debe ingresar una contraseña válida', 'AVISO', { duration: 2000 });
    } else {
      if (formulario.password == formulario.repassword) {
        let usuario = this.usuario;
        usuario.password = formulario.password;

        this.usuarioService.modificarClave(usuario).subscribe(
          response => {
            if (response == 1) {
              this.snackBar.open('La contraseña se cambio correctamente', 'AVISO', { duration: 2000 });
              setTimeout(() => {
                this.loginService.cerrarSesion();
              }, 2000);
            } else {
              this.snackBar.open('Error al cambiar la contraseña', 'AVISO', { duration: 2000 });
            }
          }
        );
      } else {
        this.snackBar.open('Las contraseñas deben ser iguales', 'AVISO', { duration: 2000 });
        this.form.get('repassword').setErrors({ diferentes: true });
      }
    }
  }

}
