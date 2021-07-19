import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';
import { TipoPersonal } from '../models/tipo-personal.model';

const base_url = `${environment.HOST}/api/tipo-personal`;

@Injectable({
  providedIn: 'root'
})
export class TipoPersonalService extends GenericService<TipoPersonal> {

  constructor(
    protected http: HttpClient
  ) {
    super(
      http,
      `${base_url}`
    );
  }
}
