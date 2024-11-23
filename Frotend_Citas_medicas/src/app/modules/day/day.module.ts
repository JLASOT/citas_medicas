import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DayRoutingModule } from './day-routing.module';
import { DayComponent } from './day.component';
import { DayListComponent } from './day-list/day-list.component';
import { DayAddComponent } from './day-add/day-add.component';
import { DayEditComponent } from './day-edit/day-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'primeng/api';
// Importar módulos de PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { AppHeaderComponent } from '../path/to/app-header/app-header.component';
import { AppSidebarComponent } from '../path/to/app-sidebar/app-sidebar.component';



@NgModule({
  declarations: [
    DayComponent,
    DayListComponent,
    DayAddComponent,
    DayEditComponent
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    SharedModule,
    TableModule,    // Para <p-table>
    ButtonModule,   // Para <p-button>
    InputTextModule, // Para los campos de entrada
    TooltipModule 



  ]
})
export class DayModule { }
