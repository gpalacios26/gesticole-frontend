import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';
import { Competencia } from '../models/competencia.model';

const base_url = `${environment.HOST}/api/competencias`;

@Injectable({
  providedIn: 'root'
})
export class CompetenciaService extends GenericService<Competencia> {

  constructor(
    protected http: HttpClient
  ) {
    super(
      http,
      `${base_url}`
    );
  }

  listarPorCurso(idCurso: number) {
    return this.http.get<Competencia[]>(`${base_url}/curso/${idCurso}`);
  }
}
