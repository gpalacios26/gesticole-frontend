import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Curso } from '../models/curso.model';
import { CursoCompetencias } from '../interfaces/curso-competencias.interface';

const base_url = `${environment.HOST}/api/cursos`;

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  constructor(
    private http: HttpClient
  ) { }

  listar() {
    return this.http.get<Curso[]>(`${base_url}`);
  }

  listarPaginado(page: number, size: number) {
    return this.http.get<any>(`${base_url}/pageable?page=${page}&size=${size}`);
  }

  listarPorId(id: number) {
    return this.http.get<Curso>(`${base_url}/${id}`);
  }

  registrar(dto: CursoCompetencias): Observable<any> {
    return this.http.post(`${base_url}`, dto);
  }

  modificar(dto: CursoCompetencias): Observable<any> {
    return this.http.put(`${base_url}`, dto);
  }

  eliminar(id: number) {
    return this.http.delete(`${base_url}/${id}`);
  }
}
