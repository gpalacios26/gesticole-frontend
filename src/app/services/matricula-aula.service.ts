import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatriculaAula } from '../models/matricula-aula.model';
import { MatriculaAulaDetalle } from '../models/matricula-aula-detalle.model';
import { MatriculaAulaDTO } from '../interfaces/matricula-aula-dto.interface';

const base_url = `${environment.HOST}/api/matricula/aula`;

@Injectable({
  providedIn: 'root'
})
export class MatriculaAulaService {

  constructor(
    private http: HttpClient
  ) { }

  listar() {
    return this.http.get<MatriculaAula[]>(`${base_url}`);
  }

  listarPaginado(page: number, size: number) {
    return this.http.get<any>(`${base_url}/pageable?page=${page}&size=${size}`);
  }

  listarPorId(id: number) {
    return this.http.get<MatriculaAula>(`${base_url}/${id}`);
  }

  registrar(dto: MatriculaAulaDTO): Observable<any> {
    return this.http.post(`${base_url}`, dto);
  }

  modificar(dto: MatriculaAulaDTO): Observable<any> {
    return this.http.put(`${base_url}`, dto);
  }

  eliminar(id: number) {
    return this.http.delete(`${base_url}/${id}`);
  }

  listarPorIdMatricula(id: number) {
    return this.http.get<MatriculaAulaDetalle[]>(`${base_url}/detalle/${id}`);
  }
}
