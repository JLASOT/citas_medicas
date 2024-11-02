import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-and-register',
  templateUrl: './login-and-register.component.html',
  styleUrls: ['./login-and-register.component.css']
})
export class LoginAndRegisterComponent {

  email_login:string = '';
  password_login:string = '';

  constructor(
    public authService :AuthService,
    public router:Router,
  ){} 

  ngOnInit():void{

    //una vez iniciado sesion no le permite ir de nuevo al login
    console.log(this.authService.user);
    if(this.authService.user){
      this.router.navigateByUrl("/dashboard");
    }
  }

  login(){
    if(!this.email_login || !this.password_login){
      alert("NO PUEDES INGRESAR AL SISTEMA SI NO INGRESAS TODOS LOS CAMPOS");
      return;
    }
    this.authService.login(this.email_login,this.password_login).subscribe((resp:any)=>{
      console.log(resp);
      if(resp){
        window.location.reload();
      }else{
        alert("LAS CREDENCIALES SON INCORRECTAS");
      }
    })
  }
}
