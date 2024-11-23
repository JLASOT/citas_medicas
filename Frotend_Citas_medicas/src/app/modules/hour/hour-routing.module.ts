import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HourComponent } from './hour.component';
import { HourListComponent } from './hour-list/hour-list.component';
import { HourAddComponent } from './hour-add/hour-add.component';
import { HourEditComponent } from './hour-edit/hour-edit.component';

const routes: Routes = [
  {
    path: '',
    component: HourComponent,
    children:[
      {
        path:'lista',
        component: HourListComponent
      },
      {
       // coactívate:[adminGuard],
        path:'register',
        component: HourAddComponent
      },

      {
        path:'edit/:id',
        component: HourEditComponent
      },
      
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HourRoutingModule { }
