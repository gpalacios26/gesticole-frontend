import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';
import { Anio } from '../models/anio.model';

const base_url = `${environment.HOST}/api/anios`;

@Injectable({
  providedIn: 'root'
})
export class AnioService extends GenericService<Anio> {

  constructor(
    protected http: HttpClient
  ) {
    super(
      http,
      `${base_url}`
    );
  }
}
