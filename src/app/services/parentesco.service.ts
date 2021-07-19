import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';
import { Parentesco } from '../models/parentesco.model';

const base_url = `${environment.HOST}/api/parentesco`;

@Injectable({
  providedIn: 'root'
})
export class ParentescoService extends GenericService<Parentesco> {

  constructor(
    protected http: HttpClient
  ) {
    super(
      http,
      `${base_url}`
    );
  }
}
