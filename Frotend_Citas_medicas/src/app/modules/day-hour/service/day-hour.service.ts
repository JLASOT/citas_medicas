import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { URL_SERVICIOS } from 'src/app/config/config';
import { catchError, map, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class DayHourService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  listDayHour(): Observable<any> {
    const headers = new HttpHeaders({ token: this.authService.token });
    const URL = `${URL_SERVICIOS}/dayhours`;
    return this.http.get(URL, { headers }).pipe(catchError(this.handleError)); // Agregar manejo de errores
  }

  registerDayHour(data: any): Observable<any> {
    const headers = new HttpHeaders({ token: this.authService.token });
    const URL = `${URL_SERVICIOS}/dayhours`;
    return this.http
      .post(URL, data, { headers })
      .pipe(catchError(this.handleError)); // Agregar manejo de errores
  }

  updateDayHour(id: number, data: any): Observable<any> {
    const headers = new HttpHeaders({ token: this.authService.token });
    const URL = `${URL_SERVICIOS}/dayhours/${id}`;
    return this.http
      .put(URL, data, { headers })
      .pipe(catchError(this.handleError)); // Agregar manejo de errores
  }

  getDayHourById(id: string): Observable<any> {
    const headers = new HttpHeaders({ token: this.authService.token });
    const URL = `${URL_SERVICIOS}/dayhours/${id}`;
    return this.http.get(URL, { headers }).pipe(catchError(this.handleError)); // Agregar manejo de errores
  }

  deleteDayHour(id: number): Observable<any> {
    const headers = new HttpHeaders({ token: this.authService.token });
    const URL = `${URL_SERVICIOS}/dayhours/${id}`;
    return this.http
      .delete(URL, { headers })
      .pipe(catchError(this.handleError)); // Agregar manejo de errores
  }

  // Manejo de errores en las solicitudes HTTP
  /* private handleError(error: any): Observable<never> {
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
  } */
/*   private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage =
        error.error.message ||
        `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  } */
    private handleError(error: HttpErrorResponse) {
      let errorMessage = 'Ha ocurrido un error desconocido';
      
      if (error.error instanceof ErrorEvent) {
          // Errores del lado del cliente
          errorMessage = `Error: ${error.error.message}`;
      } else {
          // Errores del lado del servidor
          if (error.error && error.error.message) {
              errorMessage = error.error.message;
          } else {
              errorMessage = `Código de error: ${error.status}`;
          }
      }
  
      Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: errorMessage,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
      });
      return throwError(() => new Error(errorMessage));
  }
  

 // Método para obtener todos los dayhours, filtrando por userId y stateAppointment == 2
 getDayHoursByUser(userId: number): Observable<any[]> {
  const headers = new HttpHeaders({ token: this.authService.token });
  const URL = `${URL_SERVICIOS}/dayhours`;  // Endpoint para obtener todos los dayhours
  return this.http.get<any[]>(URL, { headers }).pipe(
    map((data) => {
      // Filtramos los registros donde el userId coincida con el proporcionado y stateAppointment sea 2
      return data.filter(item => item.User.id === userId && item.stateAppointment === 2);
    }),
    catchError((error) => {
      // Aquí agregamos la impresión en consola para verificar si se captura el error
      console.error('Error en getDayHoursByUser:', error);
      return this.handleError(error);  // Llamada a tu método de manejo de errores
    })
  );
}
  



}
