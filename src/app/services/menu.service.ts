import { Injectable } from '@angular/core';
import { Menu } from '../interfaces/menu.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  public appitems: Menu[] = [
    {
      label: 'Mantenimientos',
      icon: '',
      items: [
        {
          label: 'Aulas',
          link: '/panel/aulas',
          icon: 'store_mall_directory'
        },
        {
          label: 'Cursos',
          link: '/panel/cursos',
          icon: 'menu_book'
        },
        {
          label: 'Personal',
          link: '/panel/personal',
          icon: 'people_alt'
        },
        {
          label: 'Alumnos',
          link: '/panel/alumnos',
          icon: 'person'
        }
      ]
    },
    {
      label: 'Gestión Académica',
      icon: '',
      items: [
        {
          label: 'Aula / Cursos',
          link: '/panel/asignacion',
          icon: 'add_business'
        },
        {
          label: 'Matrícula',
          link: '/panel/matricula',
          icon: 'person_add_alt_1'
        }
      ]
    },
    {
      label: 'Información Personal',
      icon: '',
      items: [
        {
          label: 'Perfil de Usuario',
          link: '/panel/perfil',
          icon: 'account_circle'
        },
        {
          label: 'Cambio de Clave',
          link: '/panel/cambiar-clave',
          icon: 'lock'
        }
      ]
    }
  ];

  constructor() { }

  getMenu() {
    return this.appitems;
  }
}
