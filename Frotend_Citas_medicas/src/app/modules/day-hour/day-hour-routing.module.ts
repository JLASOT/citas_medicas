import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DayHourComponent } from './day-hour.component';
import { DayListComponent } from '../day/day-list/day-list.component';
import { DayAddComponent } from '../day/day-add/day-add.component';
import { DayHourEditComponent } from './day-hour-edit/day-hour-edit.component';
import { adminGuard } from '../auth/service/admin.guard';
import { DayHourListComponent } from './day-hour-list/day-hour-list.component';
import { DayHourAddComponent } from './day-hour-add/day-hour-add.component';

const routes: Routes = [
  {
    path: '',
    component: DayHourComponent,
    children:[
      {
        path:'lista',
        component: DayHourListComponent
      },
      {
        canActivate:[adminGuard],
        path:'register',
        component: DayHourAddComponent
      },
    
      {
        path:'edit/:id',
        component: DayHourEditComponent
      },
      
      
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DayHourRoutingModule { }
