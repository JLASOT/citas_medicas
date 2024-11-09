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
    //canActivate: [authGuard],
    path:'patient',
    loadChildren:() => import("./modules/patient/patient.module").then(m => m.PatientModule),
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
