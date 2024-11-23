import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TutorComponent } from './tutor.component';
import { TutorListComponent } from './tutor-list/tutor-list.component';
import { TutorEditComponent } from './tutor-edit/tutor-edit.component';

const routes: Routes = [
  {
    path:'',
    component:TutorComponent,
    children:[
      {
        path:'lista',
        component:TutorListComponent
      },
      {
        path:'edit/:id',
        component:TutorEditComponent
      }
    ]
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TutorRoutingModule { }
