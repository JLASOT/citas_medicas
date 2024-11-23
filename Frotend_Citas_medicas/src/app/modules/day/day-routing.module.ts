import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DayComponent } from './day.component';
import { DayAddComponent } from './day-add/day-add.component';
import { DayListComponent } from './day-list/day-list.component';
import { DayEditComponent } from './day-edit/day-edit.component';
import { adminGuard } from '../auth/service/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: DayComponent,
    children:[
      {
        path:'lista',
        component: DayListComponent
      },
      {
        canActivate:[adminGuard],
        path:'register',
        component: DayAddComponent
      },
  
      {
        path:'edit/:id',
        component: DayEditComponent
      },
      
      
    ]
  }

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DayRoutingModule { }
