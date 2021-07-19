import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';
import { Sexo } from '../models/sexo.model';

const base_url = `${environment.HOST}/api/sexo`;

@Injectable({
  providedIn: 'root'
})
export class SexoService extends GenericService<Sexo> {

  constructor(
    protected http: HttpClient
  ) {
    super(
      http,
      `${base_url}`
    );
  }
}
