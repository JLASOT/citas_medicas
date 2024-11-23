import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './modules/auth/service/auth.guard';
import { adminGuard } from './modules/auth/service/admin.guard';

export const routes:Routes =[
  {
    path:'',
    loadChildren:() => import("./modules/home/home.module").then(m => m.HomeModule),
  },
  {
    
    path:'auth',
    loadChildren:() => import("./modules/auth/auth.module").then(m => m.AuthModule),
  },
  {
    canActivate: [authGuard],
    path:'dashboard',
    loadChildren:() => import("./modules/dashboard/dashboard.module").then(m => m.DashboardModule),
  },
  {
    canActivate: [authGuard],
    path:'patient',
    loadChildren:() => import("./modules/patient/patient.module").then(m => m.PatientModule),
  },
  {
    canActivate: [authGuard],

    path:'specialitie',
    loadChildren:() => import("./modules/specialitie/specialitie.module").then(m => m.SpecialitieModule),
  },
  {
    canActivate: [authGuard],
    path:'tutor',
    loadChildren:() => import("./modules/tutor/tutor.module").then(m => m.TutorModule),
  },
  {
    canActivate: [authGuard],
    path:'user',
    loadChildren:() => import("./modules/user/user.module").then(m => m.UserModule),
  },
// este es de la tabla dia
  {
    canActivate: [authGuard],
    path:'days',
    loadChildren:() => import("./modules/day/day.module").then(m => m.DayModule),
  },
// hora
  {
    canActivate: [authGuard],
    path:'hours',
    loadChildren:() => import("./modules/hour/hour.module").then(m => m.HourModule),
  },

  {
    path:'',
    redirectTo: '/',
    pathMatch: 'full'
  },
  {
    path:'**',
    redirectTo:'error/404'
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
  ],

  exports:[
    RouterModule,
  ]
})
export class AppRoutingModule { }
