import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientRoutingModule } from './patient-routing.module';
import { PatientComponent } from './patient.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientAddComponent } from './patient-add/patient-add.component';
import { PatientEditComponent } from './patient-edit/patient-edit.component';
import { PatientDeleteComponent } from './patient-delete/patient-delete.component';
import { SharedModule } from "../../shared/shared.module";
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

import { InputTextModule } from 'primeng/inputtext';

import { CheckboxModule } from 'primeng/checkbox';

import { CardModule } from 'primeng/card';


import { RadioButtonModule } from 'primeng/radiobutton';

import { DropdownModule } from 'primeng/dropdown';



@NgModule({
  declarations: [
    PatientComponent,
    PatientListComponent,
    PatientAddComponent,
    PatientEditComponent,
    PatientDeleteComponent
  ],
  imports: [
    CommonModule,
    PatientRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    SharedModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    CardModule,
    RadioButtonModule,
    DropdownModule
    
  ]
})
export class PatientModule { }
