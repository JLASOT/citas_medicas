import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(
    private http:HttpClient,
    private authService: AuthService,
  ) { }

    listPatients(): Observable<any> {
      const headers = new HttpHeaders({ 'token': this.authService.token });
      const URL = `${URL_SERVICIOS}/patients`;
      return this.http.get(URL, { headers });
    }
  
   /*  registerPatient(data: any){
      let headers = new HttpHeaders({ "token": this.authService.token });
      const URL = `${URL_SERVICIOS}/patients/register`;
      return this.http.post(URL, data, { headers });
    } */

    registerPatient(data: any): Observable<any> {
      let headers = new HttpHeaders({ "token": this.authService.token });
      const URL = `${URL_SERVICIOS}/patients`;
      return this.http.post(URL, data, { headers });
    }

    deletePatient(id: number): Observable<any> {
      const headers = new HttpHeaders({ 'token': this.authService.token });
      const URL = `${URL_SERVICIOS}/patients/${id}`;
      return this.http.delete(URL, { headers });
    }
  
}
