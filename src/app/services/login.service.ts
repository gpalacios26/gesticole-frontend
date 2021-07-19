import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = `${environment.HOST}`;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(usuario: string, contrasena: string): Observable<any> {
    let body = `grant_type=password&username=${encodeURIComponent(usuario)}&password=${encodeURIComponent(contrasena)}`;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
      .set('Authorization', 'Basic ' + btoa(environment.TOKEN_AUTH_USERNAME + ':' + environment.TOKEN_AUTH_PASSWORD))

    return this.http.post<any>(`${base_url}/oauth/token`, body, { headers: headers });
  }

  estaLogueado() {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    return token != null;
  }

  cerrarSesion() {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);

    if (token) {
      this.http.get(`${base_url}/api/tokens/anular/${token}`).subscribe(() => {
        sessionStorage.clear();
        this.router.navigate(['login']);
      });
    } else {
      sessionStorage.clear();
      this.router.navigate(['login']);
    }
  }

  validarCorreo(correo: string) {
    return this.http.get<number>(`${base_url}/api/login/correo/${correo}`);
  }

  enviarCorreo(correo: string, webUrl: string): Observable<any> {
    let formData: FormData = new FormData();
    formData.append("correo", correo);
    formData.append("webUrl", webUrl);

    return this.http.post(`${base_url}/api/login/enviar/correo`, formData);
  }

  verificarToken(token: string) {
    return this.http.get<number>(`${base_url}/api/login/verificar/${token}`);
  }

  cambiarClave(token: string, clave: string): Observable<any> {
    let formData: FormData = new FormData();
    formData.append("clave", clave);

    return this.http.post(`${base_url}/api/login/restablecer/${token}`, formData);
  }
}
