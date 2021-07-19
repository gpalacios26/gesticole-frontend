import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';
import { Rol } from '../models/rol.model';

const base_url = `${environment.HOST}/api/roles`;

@Injectable({
  providedIn: 'root'
})
export class RolService extends GenericService<Rol> {

  constructor(
    protected http: HttpClient
  ) {
    super(
      http,
      `${base_url}`
    );
  }
}
