import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-reseteo',
  templateUrl: './reseteo.component.html',
  styleUrls: ['./reseteo.component.css']
})
export class ReseteoComponent {

  public form: FormGroup;
  public height: number;
  public loader: boolean = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private loginService: LoginService
  ) {
    this.height = window.innerHeight;
    this.crearFormulario();
  }

  onResize(event) {
    this.height = event.target.innerHeight;
  }

  crearFormulario() {
    let regExCorreo = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$';

    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.pattern(regExCorreo)]],
    });
  }

  validarCorreo() {
    let formulario = this.form.value;
    let correo = formulario.correo;
    if (this.form.get('correo').valid) {
      this.loginService.validarCorreo(correo).subscribe(
        response => {
          if (response == 0) {
            this.snackBar.open('El correo ingresado no está registrado en el sistema', 'AVISO', { duration: 2000 });
            this.form.get('correo').setErrors({ existe: true });
          }
        }
      );
    }
  }

  enviarCorreo() {
    let formulario = this.form.value;
    if (this.form.invalid) {
      this.snackBar.open('Debe ingresar un correo válido', 'AVISO', { duration: 2000 });
    } else {
      let host = window.location.href;
      let webUrl = host.replace('/#/reseteo', '');
      this.loader = true;
      this.loginService.enviarCorreo(formulario.correo, webUrl).subscribe(
        response => {
          if (response == 1) {
            this.snackBar.open('El correo se ha enviado correctamente', 'AVISO', { duration: 2000 });
            setTimeout(() => {
              this.router.navigate(['login']);
            }, 1000);
          } else {
            this.snackBar.open('Error al intentar enviar el correo', 'AVISO', { duration: 2000 });
          }
          this.loader = false;
        }
      );
    }
  }

}
