import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service'; // Asegúrate de que la ruta es correcta
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inyectar AuthService
  const router = inject(Router); // Inyectar Router

  // Verificar si el usuario está autenticado
  if (!authService.user) {
    authService.logout(); // Cerrar sesión si no hay usuario
    return false; // Impedir el acceso
  }

  const token = authService.token; // Obtener el token
  if (!token) {
    authService.logout(); // Cerrar sesión si no hay token
    return false; // Impedir el acceso
  }

  // Verificar la expiración del token
  const expiration = (JSON.parse(atob(token.split('.')[1]))).exp;
  if (Math.floor((new Date()).getTime() / 1000) >= expiration) {
    authService.logout(); // Cerrar sesión si el token ha expirado
    return false; // Impedir el acceso
  }

  return true; // Permitir el acceso si el usuario está autenticado y el token es válido
};
