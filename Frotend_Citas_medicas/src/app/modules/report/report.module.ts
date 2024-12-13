import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportListComponent } from './report-list/report-list.component';
import { ReportChildComponent } from './report-child/report-child.component';
import { TableModule } from 'primeng/table';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

import { CardModule } from 'primeng/card';

import { ToolbarModule } from 'primeng/toolbar';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  declarations: [
    ReportComponent,
    ReportListComponent,
    ReportChildComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    SharedModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CardModule,
    ToolbarModule,
    CalendarModule

  ],
  providers: [DatePipe],  // Añade DatePipe en los providers
})
export class ReportModule { }
