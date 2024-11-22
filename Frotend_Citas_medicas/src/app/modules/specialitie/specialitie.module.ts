import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpecialitieRoutingModule } from './specialitie-routing.module';
import { SpecialitieComponent } from './specialitie.component';
import { SpecialitieListComponent } from './specialitie-list/specialitie-list.component';
import { SpecialitieAddComponent } from './specialitie-add/specialitie-add.component';
import { SpecialitieEditComponent } from './specialitie-edit/specialitie-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';


@NgModule({
  declarations: [
    SpecialitieComponent,
    SpecialitieListComponent,
    SpecialitieAddComponent,
    SpecialitieEditComponent
  ],
  imports: [
    CommonModule,
    SpecialitieRoutingModule,
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
    DropdownModule,
    InputTextareaModule

  ]
})
export class SpecialitieModule { }
