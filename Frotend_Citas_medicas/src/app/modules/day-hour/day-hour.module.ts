import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DayHourRoutingModule } from './day-hour-routing.module';
import { DayHourAddComponent } from './day-hour-add/day-hour-add.component';
import { DayHourListComponent } from './day-hour-list/day-hour-list.component';
import { DayHourEditComponent } from './day-hour-edit/day-hour-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CardModule } from 'primeng/card';


@NgModule({
  declarations: [
    DayHourAddComponent,
    DayHourListComponent,
    DayHourEditComponent
  ],
  imports: [
    CommonModule,
    DayHourRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    SharedModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ToolbarModule,
    DialogModule,
    DropdownModule,
    AutoCompleteModule,
    CardModule

    
    

  ]
})
export class DayHourModule { }
