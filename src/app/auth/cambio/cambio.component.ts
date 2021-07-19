import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-cambio',
  templateUrl: './cambio.component.html',
  styleUrls: ['./cambio.component.css']
})
export class CambioComponent implements OnInit {

  public form: FormGroup;
  public token: string;
  public tokenValido: boolean;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.token = params['token'];
      this.verificarToken(this.token);
    });
  }

  crearFormulario() {
    let regExPassword = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z\d$@$!%*?&].{8,}';

    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(regExPassword)]],
      repassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(regExPassword)]],
    });
  }

  verificarToken(token: string) {
    this.loginService.verificarToken(token).subscribe(
      response => {
        if (response == 1) {
          this.tokenValido = true;
        } else {
          this.tokenValido = false;
          this.snackBar.open('El token no es válido o ya está expirado', 'AVISO', { duration: 2000 });
          this.router.navigate(['login']);
        }
      }
    );
  }

  cambiarClave() {
    let formulario = this.form.value;
    if (this.form.invalid) {
      this.snackBar.open('Debe ingresar una contraseña válida', 'AVISO', { duration: 2000 });
    } else {
      if (formulario.password == formulario.repassword) {
        this.loginService.cambiarClave(this.token, formulario.password).subscribe(
          response => {
            if (response == 1) {
              this.snackBar.open('La contraseña se cambio correctamente', 'AVISO', { duration: 2000 });
              setTimeout(() => {
                this.router.navigate(['login']);
              }, 1000);
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
