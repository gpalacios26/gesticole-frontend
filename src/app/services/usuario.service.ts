import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Usuario } from '../models/usuario.model';

const base_url = `${environment.HOST}/api/usuarios`;
const user_data = `user_data`;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private http: HttpClient
  ) { }

  get usuario(): Usuario {
    return JSON.parse(decodeURIComponent(atob(sessionStorage.getItem(user_data))));
  }

  setUsuario() {
    let access_token = sessionStorage.getItem(environment.TOKEN_NAME);
    let helper = new JwtHelperService();
    let decodedToken = helper.decodeToken(access_token);
    let correo = decodedToken.user_name;

    this.cargarPerfil(correo).subscribe(
      usuario => {
        sessionStorage.setItem(user_data, btoa(encodeURIComponent(JSON.stringify(usuario))));
      }
    );
  }

  esAdministrador() {
    let rol = this.usuario.rol;
    return (rol.idRol == 1) ? true : false;
  }

  listar() {
    return this.http.get<Usuario[]>(`${base_url}`);
  }

  listarPaginado(page: number, size: number) {
    return this.http.get<any>(`${base_url}/pageable?page=${page}&size=${size}`);
  }

  listarPorId(id: number) {
    return this.http.get<Usuario>(`${base_url}/${id}`);
  }

  registrar(usuario: Usuario): Observable<any> {
    return this.http.post(`${base_url}`, usuario);
  }

  cargarPerfil(correo: string) {
    return this.http.get<Usuario>(`${base_url}/correo/${correo}`);
  }

  modificarEstado(usuario: Usuario): Observable<any> {
    return this.http.post(`${base_url}/modificar/estado`, usuario);
  }

  modificarClave(usuario: Usuario): Observable<any> {
    return this.http.post(`${base_url}/modificar/clave`, usuario);
  }

  modificarPerfil(usuario: Usuario): Observable<any> {
    return this.http.post(`${base_url}/modificar/perfil`, usuario);
  }
}
