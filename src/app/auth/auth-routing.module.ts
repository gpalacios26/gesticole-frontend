import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ReseteoComponent } from './reseteo/reseteo.component';
import { CambioComponent } from './cambio/cambio.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'reseteo', component: ReseteoComponent },
  { path: 'recuperar/:token', component: CambioComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
