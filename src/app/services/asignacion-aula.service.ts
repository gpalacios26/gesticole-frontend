import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AsignacionAula } from '../models/asignacion-aula.model';
import { AsignacionAulaDetalle } from '../models/asignacion-aula-detalle.model';
import { AsignacionAulaDTO } from '../interfaces/asignacion-aula-dto.interface';

const base_url = `${environment.HOST}/api/asignacion/aula`;

@Injectable({
  providedIn: 'root'
})
export class AsignacionAulaService {

  constructor(
    private http: HttpClient
  ) { }

  listar() {
    return this.http.get<AsignacionAula[]>(`${base_url}`);
  }

  listarPaginado(page: number, size: number) {
    return this.http.get<any>(`${base_url}/pageable?page=${page}&size=${size}`);
  }

  listarPorId(id: number) {
    return this.http.get<AsignacionAula>(`${base_url}/${id}`);
  }

  registrar(dto: AsignacionAulaDTO): Observable<any> {
    return this.http.post(`${base_url}`, dto);
  }

  modificar(dto: AsignacionAulaDTO): Observable<any> {
    return this.http.put(`${base_url}`, dto);
  }

  eliminar(id: number) {
    return this.http.delete(`${base_url}/${id}`);
  }

  listarPorIdAsignacion(id: number) {
    return this.http.get<AsignacionAulaDetalle[]>(`${base_url}/detalle/${id}`);
  }
}
