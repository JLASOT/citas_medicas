import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService); 
  const router = inject(Router); 
  if (authService.isAuthenticated() && authService.isAdmin()) { 
    return true; 
  } else { 
    //authService.logout(); 
    console.log('adminGuard: Acceso denegado, redirigiendo a /dashboard');
    //alert('Acceso denegado. Redirigiendo a la página principal.');
    await  router.navigate(['dashboard']); 
    return false;
  }
};
