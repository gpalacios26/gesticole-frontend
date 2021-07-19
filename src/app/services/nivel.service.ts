import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';
import { Nivel } from '../models/nivel.model';

const base_url = `${environment.HOST}/api/niveles`;

@Injectable({
  providedIn: 'root'
})
export class NivelService extends GenericService<Nivel> {

  constructor(
    protected http: HttpClient
  ) {
    super(
      http,
      `${base_url}`
    );
  }
}
