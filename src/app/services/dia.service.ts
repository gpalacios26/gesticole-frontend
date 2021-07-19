import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';
import { Dia } from '../models/dia.model';

const base_url = `${environment.HOST}/api/dias`;

@Injectable({
  providedIn: 'root'
})
export class DiaService extends GenericService<Dia> {

  constructor(
    protected http: HttpClient
  ) {
    super(
      http,
      `${base_url}`
    );
  }
}
