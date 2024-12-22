import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpecialitieComponent } from './specialitie.component';
import { SpecialitieListComponent } from './specialitie-list/specialitie-list.component';
import { SpecialitieAddComponent } from './specialitie-add/specialitie-add.component';
import { SpecialitieEditComponent } from './specialitie-edit/specialitie-edit.component';
import { adminGuard } from '../auth/service/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: SpecialitieComponent,
    children:[
      {
        canActivate:[adminGuard],
        path:'lista',
        component: SpecialitieListComponent
      },
      {
        canActivate:[adminGuard],
        path:'register',
        component: SpecialitieAddComponent
      },
      {
        canActivate:[adminGuard],
        path:'edit/:id',
        component: SpecialitieEditComponent
      },
      
      
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecialitieRoutingModule { }
