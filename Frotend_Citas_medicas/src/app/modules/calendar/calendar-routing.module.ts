import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar.component';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';

const routes: Routes = [
  {
    path: '',
    component: CalendarComponent,
    children:[
      {
        path:'lista',
        component: CalendarViewComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
