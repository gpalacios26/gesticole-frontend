import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';
import { Personal } from '../models/personal.model';
import { FileDTO } from '../interfaces/file-dto.interface';

const base_url = `${environment.HOST}/api/personal`;

@Injectable({
  providedIn: 'root'
})
export class PersonalService extends GenericService<Personal> {

  constructor(
    protected http: HttpClient
  ) {
    super(
      http,
      `${base_url}`
    );
  }

  listarPaginado(page: number, size: number) {
    return this.http.get<any>(`${base_url}/pageable?page=${page}&size=${size}`);
  }

  cargarFoto(id: number, fileDTO: FileDTO): Observable<any> {
    return this.http.post(`${base_url}/foto/${id}`, fileDTO);
  }

  verFoto(name: string) {
    return this.http.get(`${base_url}/foto/${name}`, {
      responseType: 'blob'
    });
  }

  exportar() {
    return this.http.get(`${base_url}/descargar`, {
      responseType: 'blob'
    });
  }

  exportarFicha(id: number) {
    return this.http.get(`${base_url}/descargar/ficha/${id}`, {
      responseType: 'blob'
    });
  }
}
