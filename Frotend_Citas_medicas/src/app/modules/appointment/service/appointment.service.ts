import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  listAppointment(): Observable<any> {
    const headers = new HttpHeaders({ token: this.authService.token });
    const URL = `${URL_SERVICIOS}/appointment`;
    return this.http
      .get(URL, { headers })
      .pipe(catchError(this.handleError)); // Agregar manejo de errores
  }

  registerAppointment(data: any): Observable<any> {
    const headers = new HttpHeaders({ token: this.authService.token });
    const URL = `${URL_SERVICIOS}/appointment`;
    return this.http
      .post(URL, data, { headers })
      .pipe(catchError(this.handleError)); // Agregar manejo de errores
  }

  updateAppointment(id: number, data: any): Observable<any> {
    const headers = new HttpHeaders({ token: this.authService.token });
    const URL = `${URL_SERVICIOS}/appointment/${id}`;
    return this.http
      .put(URL, data, { headers })
      .pipe(catchError(this.handleError)); // Agregar manejo de errores
  }

  getAppointmentById(id: string): Observable<any> {
    const headers = new HttpHeaders({ token: this.authService.token });
    const URL = `${URL_SERVICIOS}/appointment/${id}`;
    return this.http
      .get(URL, { headers })
      .pipe(catchError(this.handleError)); // Agregar manejo de errores
  }

  deleteAppointment(id: number): Observable<any> {
    const headers = new HttpHeaders({ token: this.authService.token });
    const URL = `${URL_SERVICIOS}/appointment/${id}`;
    return this.http
      .delete(URL, { headers })
      .pipe(catchError(this.handleError)); // Agregar manejo de errores
  }

  // Manejo de errores en las solicitudes HTTP
  private handleError(error: any): Observable<never> {
    // Mostrar la alerta SweetAlert2 en lugar de usar la alerta por defecto
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: error.message || 'Algo salió mal. Inténtalo nuevamente.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#3085d6',
    });

    // Opcionalmente, puedes mostrar en la consola el error detallado para depuración
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error(error.message || 'Error desconocido'));
  }
}
