import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';
import { TipoDocumento } from '../models/tipo-documento.model';

const base_url = `${environment.HOST}/api/tipo-documento`;

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService extends GenericService<TipoDocumento> {

  constructor(
    protected http: HttpClient
  ) {
    super(
      http,
      `${base_url}`
    );
  }
}
