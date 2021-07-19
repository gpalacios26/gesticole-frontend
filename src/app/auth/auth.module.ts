import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from '../app-routing.module';
import { MaterialModule } from '../material/material.module';

import { LoginComponent } from './login/login.component';
import { ReseteoComponent } from './reseteo/reseteo.component';
import { CambioComponent } from './cambio/cambio.component';

@NgModule({
  declarations: [
    LoginComponent,
    ReseteoComponent,
    CambioComponent
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
    LoginComponent,
    ReseteoComponent,
    CambioComponent
  ]
})
export class AuthModule { }
