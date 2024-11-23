import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DayService {
  private apiUrl = 'http://localhost:3000/api/days'; // Cambia según tu API

  constructor(private http: HttpClient) {}

  // Método para obtener la lista de días
  listDays(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Método para eliminar un día
  deleteDay(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // (Opcional) Método para agregar un nuevo día
  addDay(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // (Opcional) Método para actualizar un día
  updateDay(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}
