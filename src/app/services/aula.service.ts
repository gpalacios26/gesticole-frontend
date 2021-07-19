import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';
import { Aula } from '../models/aula.model';

const base_url = `${environment.HOST}/api/aulas`;

@Injectable({
  providedIn: 'root'
})
export class AulaService extends GenericService<Aula> {

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
}
