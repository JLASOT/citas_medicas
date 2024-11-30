import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentComponent } from './appointment.component';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentAddComponent } from './appointment-add/appointment-add.component';
import { AppointmentEditComponent } from './appointment-edit/appointment-edit.component';

const routes: Routes = [
  {
    path: '',
    component: AppointmentComponent,
    children:[
      {
        path:'lista',
        component: AppointmentListComponent
      },
      {
        // coactívate:[adminGuard],
        path:'register',
        component: AppointmentAddComponent
      },
      {
        path:'edit/:id',
        component: AppointmentEditComponent
      },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentRoutingModule { }
