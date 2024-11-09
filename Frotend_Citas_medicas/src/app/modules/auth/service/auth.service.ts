import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { URL_FRONTEND,URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  user:any = null;
  token:any = null;
  constructor(
    public http: HttpClient,
    public router: Router,
  ) { 
    this.initAuthToken();
  }

  initAuthToken(){
    if(localStorage.getItem("token")){
      this.user = JSON.parse(localStorage.getItem("user")?? '');
      this.token = localStorage.getItem("token");
    }
  }

 
  login(email:string, password:string){
    let URL = URL_SERVICIOS + "/users/login";
    console.log("API URL:", URL);
    return this.http.post(URL,{email: email, password:password}).pipe(
      map((auth:any)=>{
        console.log(auth);
        const result = this.savelocalStorage(auth);
        return result;
      }),
      catchError((err:any)=>{
        console.log(err);
        return of(undefined);
      })
    );
  }

  savelocalStorage(auth:any){
    if(auth && auth.USER.token){
      localStorage.setItem("token",auth.USER.token);
      localStorage.setItem("user",JSON.stringify(auth.USER.user));
      return true;
    }
    return false;
  }

  logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setTimeout(() => {
      // this.router.navigateByUrl("/auth/login");
      location.href = URL_FRONTEND+"/auth/login";
    }, 50);
  }

  isAdmin(): boolean {
    const user = this.user;
    return user && user.rol === 'admin'
  };

  isAuthenticated(): boolean { 
    if (!this.token) { 
      return false; 
    } 
    const expiration = (JSON.parse(atob(this.token.split('.')[1]))).exp; 
    return Math.floor((new Date()).getTime() / 1000) < expiration; 
  }


}
