import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientComponent } from './patient.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientAddComponent } from './patient-add/patient-add.component';
import { PatientDeleteComponent } from './patient-delete/patient-delete.component';

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
        path:'register',
        component: PatientAddComponent
      },
      {
        path:'delete/:id',
        component: PatientDeleteComponent
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
