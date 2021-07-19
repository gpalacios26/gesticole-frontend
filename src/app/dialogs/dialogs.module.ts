import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from '../app-routing.module';
import { MaterialModule } from '../material/material.module';

import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
import { DialogCompetenciasComponent } from './dialog-competencias/dialog-competencias.component';
import { DialogPersonalComponent } from './dialog-personal/dialog-personal.component';
import { DialogAlumnoComponent } from './dialog-alumno/dialog-alumno.component';
import { DialogFamiliarComponent } from './dialog-familiar/dialog-familiar.component';

@NgModule({
  declarations: [
    DialogConfirmComponent,
    DialogCompetenciasComponent,
    DialogPersonalComponent,
    DialogAlumnoComponent,
    DialogFamiliarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule
  ],
  exports: [
    DialogConfirmComponent,
    DialogCompetenciasComponent,
    DialogPersonalComponent,
    DialogAlumnoComponent
  ]
})
export class DialogsModule { }
