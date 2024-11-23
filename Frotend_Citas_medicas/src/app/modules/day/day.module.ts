import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DayRoutingModule } from './day-routing.module';
import { DayComponent } from './day.component';
import { DayListComponent } from './day-list/day-list.component';
import { DayAddComponent } from './day-add/day-add.component';
import { DayEditComponent } from './day-edit/day-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';


@NgModule({
  declarations: [
    DayComponent,
    DayListComponent,
    DayAddComponent,
    DayEditComponent
  ],
  imports: [
    CommonModule,
    DayRoutingModule,
    
    FormsModule,
    HttpClientModule,
    RouterModule,
    SharedModule,
    InputTextModule,
    ButtonModule,
    TableModule
  ]
})
export class DayModule { }
