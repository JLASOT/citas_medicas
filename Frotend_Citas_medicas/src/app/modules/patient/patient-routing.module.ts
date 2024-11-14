import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientComponent } from './patient.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientAddComponent } from './patient-add/patient-add.component';
import { PatientDeleteComponent } from './patient-delete/patient-delete.component';
import { adminGuard } from '../auth/service/admin.guard';
import { PatientEditComponent } from './patient-edit/patient-edit.component';

const routes: Routes = [
  {
    path: '',
    component: PatientComponent,
    children:[
      {
        path:'lista',
        component: PatientListComponent
      },
      {
        canActivate:[adminGuard],
        path:'register',
        component: PatientAddComponent
      },
      {
        
        path:'delete/:id',
        component: PatientDeleteComponent
      },
      {
        path:'edit/:id',
        component: PatientEditComponent
      },
      
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
