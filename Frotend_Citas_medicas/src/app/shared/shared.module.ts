import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenubarModule } from 'primeng/menubar';
import { ChipModule } from 'primeng/chip';
import { SidebarModule } from 'primeng/sidebar';




@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    MenuModule,
    ToastModule,
    CardModule,
    PanelMenuModule,
    MenubarModule,
    ChipModule,
    SidebarModule
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    MenuModule
  ]
})
export class SharedModule { }
