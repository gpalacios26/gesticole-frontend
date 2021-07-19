import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { Menu } from '../interfaces/menu.interface';
import { Usuario } from '../models/usuario.model';
import { MenuService } from '../services/menu.service';
import { UsuarioService } from '../services/usuario.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;
  public appitems: Menu[];
  public usuario: Usuario;
  public admin: boolean = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private usuarioService: UsuarioService,
    private menuService: MenuService
  ) { }

  ngOnInit(): void {
    this.appitems = this.menuService.getMenu();
    this.usuario = this.usuarioService.usuario;
    this.admin = this.usuarioService.esAdministrador();
  }

  selectedItem(event: any) {
    this.sidenav.close();
    this.router.navigate([event.link]);
  }

  cerrarSesion() {
    this.loginService.cerrarSesion();
  }

}
