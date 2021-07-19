import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { PerfilComponent } from './perfil/perfil.component';
import { CambioClaveComponent } from './cambio-clave/cambio-clave.component';
import { AulasComponent } from './aulas/aulas.component';
import { AulaFormComponent } from './aulas/aula-form/aula-form.component';
import { CursosComponent } from './cursos/cursos.component';
import { CursoFormComponent } from './cursos/curso-form/curso-form.component';
import { PersonalComponent } from './personal/personal.component';
import { PersonalFormComponent } from './personal/personal-form/personal-form.component';
import { AlumnosComponent } from './alumnos/alumnos.component';
import { AlumnoFormComponent } from './alumnos/alumno-form/alumno-form.component';
import { FamiliaresComponent } from './familiares/familiares.component';
import { FamiliarFormComponent } from './familiares/familiar-form/familiar-form.component';
import { AsignacionComponent } from './asignacion/asignacion.component';
import { AsignacionFormComponent } from './asignacion/asignacion-form/asignacion-form.component';
import { MatriculaComponent } from './matricula/matricula.component';
import { MatriculaFormComponent } from './matricula/matricula-form/matricula-form.component';

const routes: Routes = [
  {
    path: 'panel',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'cambiar-clave', component: CambioClaveComponent },
      { path: 'aulas', component: AulasComponent },
      { path: 'aulas/registrar', component: AulaFormComponent },
      { path: 'aulas/editar/:id', component: AulaFormComponent },
      { path: 'cursos', component: CursosComponent },
      { path: 'cursos/registrar', component: CursoFormComponent },
      { path: 'cursos/editar/:id', component: CursoFormComponent },
      { path: 'personal', component: PersonalComponent },
      { path: 'personal/registrar', component: PersonalFormComponent },
      { path: 'personal/editar/:id', component: PersonalFormComponent },
      { path: 'alumnos', component: AlumnosComponent },
      { path: 'alumnos/registrar', component: AlumnoFormComponent },
      { path: 'alumnos/editar/:id', component: AlumnoFormComponent },
      { path: 'familiares', component: FamiliaresComponent },
      { path: 'familiares/registrar', component: FamiliarFormComponent },
      { path: 'familiares/editar/:id', component: FamiliarFormComponent },
      { path: 'asignacion', component: AsignacionComponent },
      { path: 'asignacion/registrar', component: AsignacionFormComponent },
      { path: 'asignacion/editar/:id', component: AsignacionFormComponent },
      { path: 'matricula', component: MatriculaComponent },
      { path: 'matricula/registrar', component: MatriculaFormComponent },
      { path: 'matricula/editar/:id', component: MatriculaFormComponent },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
