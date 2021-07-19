import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';

import { AppRoutingModule } from '../app-routing.module';
import { MaterialModule } from '../material/material.module';
import { DialogsModule } from '../dialogs/dialogs.module';

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

@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    PerfilComponent,
    CambioClaveComponent,
    AulasComponent,
    AulaFormComponent,
    CursosComponent,
    CursoFormComponent,
    PersonalComponent,
    PersonalFormComponent,
    AlumnosComponent,
    AlumnoFormComponent,
    FamiliaresComponent,
    FamiliarFormComponent,
    AsignacionComponent,
    AsignacionFormComponent,
    MatriculaComponent,
    MatriculaFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgMaterialMultilevelMenuModule,
    AppRoutingModule,
    MaterialModule,
    DialogsModule
  ],
  exports: [
    PagesComponent,
    HomeComponent,
    PerfilComponent,
    CambioClaveComponent,
    AulasComponent,
    AulaFormComponent,
    CursosComponent,
    CursoFormComponent,
    PersonalComponent,
    PersonalFormComponent,
    AlumnosComponent,
    AlumnoFormComponent,
    FamiliaresComponent,
    FamiliarFormComponent,
    AsignacionComponent,
    AsignacionFormComponent,
    MatriculaComponent,
    MatriculaFormComponent
  ]
})
export class PagesModule { }
