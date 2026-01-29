import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoaderService } from '../util/service/loader.service';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private authService: AuthService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // Afficher le loader
    this.loaderService.show();

    // Cloner et modifier la requête
    let clonedRequest = request.clone({
      setHeaders: {
        'ngrok-skip-browser-warning': 'true',
      },
    });

    const token = localStorage.getItem("token");
    if (token) {
      clonedRequest = clonedRequest.clone({
        setHeaders: { 
          Authorization: `Bearer ${token}` 
        },
      }); 
    }

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          const message = error.error?.erreurs?.[0]?.messageErreur || 'Accès refusé';
          alert('Erreur 403:'+ message);
          Swal.fire({
              title: 'Erreur',
              text: `${message}.`,
              icon: 'error'
            });
          // Ici vous pouvez utiliser Swal ou un service de notification
        }

        return throwError(() => error);
      }),
      finalize(() => {
        this.loaderService.hide();
      })
    );
  }
}