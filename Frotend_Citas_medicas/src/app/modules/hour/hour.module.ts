import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HourRoutingModule } from './hour-routing.module';
import { HourComponent } from './hour.component';
import { HourListComponent } from './hour-list/hour-list.component';
import { HourAddComponent } from './hour-add/hour-add.component';
import { HourEditComponent } from './hour-edit/hour-edit.component';
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    HourComponent,
    HourListComponent,
    HourAddComponent,
    HourEditComponent
  ],
  imports: [
    CommonModule,
    HourRoutingModule,

    FormsModule,
    HttpClientModule,
    RouterModule,
    SharedModule,
    InputTextModule,
    ButtonModule,
    TableModule

  ]
})
export class HourModule { }
