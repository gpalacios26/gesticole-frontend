import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, EMPTY } from 'rxjs';
import { tap, catchError, retry } from 'rxjs/operators';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ErrorsInterceptor implements HttpInterceptor {

  constructor(
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(retry(environment.REINTENTOS))
      .pipe(tap(event => {
        if (event instanceof HttpResponse) {
          if (event.body && event.body.error === true && event.body.errorMessage) {
            throw new Error(event.body.errorMessage);
          }
        }
      })).pipe(catchError((err) => {

        if (err.status === 400) {
          this.snackBar.open('Los datos ingresados no son válidos', 'ERROR 400', { duration: 2500 });
        }
        else if (err.status === 404) {
          this.snackBar.open('No existe el recurso solicitado', 'ERROR 404', { duration: 2500 });
        }
        else if (err.status === 403 || err.status === 401) {
          this.snackBar.open('No tiene permisos para acceder al recurso solicitado', 'ERROR 403', { duration: 2500 });

          sessionStorage.clear();
          this.router.navigate(['login']);
        }
        else if (err.status === 500) {
          this.snackBar.open('Error en el servidor, comuníquese con el administrador', 'ERROR 500', { duration: 2500 });
        } else {
          this.snackBar.open('Error desconocido, comuníquese con el administrador', 'ERROR', { duration: 2500 });
        }

        return EMPTY;
      }));
  }
}
