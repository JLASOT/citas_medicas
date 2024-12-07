import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  items: MenuItem[] = [];

    ngOnInit() {
        this.items = [
            {
                label: 'Users',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'New',
                        icon: 'pi pi-fw pi-user-plus',
                        routerLink: '/user/register'
                    },
                    {
                        label: 'Lista',
                        icon: 'pi pi-fw pi-list',
                        routerLink: '/user/lista'
                    },
                ]
            },
            {
                label: 'Especialidad',
                icon: 'pi pi-fw pi-file',
                items: [
                    {
                        label: 'Nuevo',
                        icon: 'pi pi-fw pi-plus',
                        routerLink: '/specialitie/register'
                    },
                    {
                        label: 'Lista',
                        icon: 'pi pi-fw pi-list',
                        routerLink: '/specialitie/lista'
                    },

                ]
            },
            {
                label: 'Pacientes',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Nuevo',
                        icon: 'pi pi-fw pi-plus',
                        routerLink: '/patient/register'
                    },
                    {
                        label: 'Lista',
                        icon: 'pi pi-fw pi-list',
                        routerLink: '/patient/lista'
                    },

                    
                    /* {
                        label: 'Editar',
                        icon: 'pi pi-fw pi-trash'
                    },
                    { 
                        separator: true 
                    },
                    {
                        label: 'Export',
                        icon: 'pi pi-fw pi-external-link'
                    } */
                ]
            },

            {
                label: 'Tutores',
                icon: 'pi pi-fw pi-file',
                items: [
                    {
                        label: 'Lista',
                        icon: 'pi pi-fw pi-list',
                        routerLink: '/tutor/lista'
                    },

                ]
            },
            {
                label: 'citas medicas',
                icon: 'pi pi-fw pi-pencil',
                items: [
                    {
                        label: 'Lista',
                        icon: 'pi pi-fw pi-list',
                        routerLink: '/appointment/lista'
                    },
                    {
                        label: 'Right',
                        icon: 'pi pi-fw pi-align-right',
                        routerLink: '/tutor/lista'
                    },
                ]
            },

            {
                label: 'Events',
                icon: 'pi pi-fw pi-calendar',
                items: [
                    {
                        label: 'Edit',
                        icon: 'pi pi-fw pi-pencil',
                        items: [
                            {
                                label: 'Save',
                                icon: 'pi pi-fw pi-calendar-plus'
                            },
                            {
                                label: 'Delete',
                                icon: 'pi pi-fw pi-calendar-minus'
                            }
                        ]
                    },
                    {
                        label: 'Archieve',
                        icon: 'pi pi-fw pi-calendar-times',
                        items: [
                            {
                                label: 'Remove',
                                icon: 'pi pi-fw pi-calendar-minus'
                            }
                        ]
                    }
                ]
            },

            {
                label: 'Dia',
                icon: 'pi pi-fw pi-calendar-times',
                items: [
                    
                        {
                            label: 'Nuevo',
                            icon: 'pi pi-fw pi-plus',
                            routerLink: '/days/register'
                        },
                        {
                            label: 'Lista',
                            icon: 'pi pi-fw pi-list',
                            routerLink: '/days/lista'
                        },
                ]
            },
            {
                label: 'Hora',
                icon: 'pi pi-fw pi-clock',
                items: [
                    
                        {
                            label: 'Nuevo',
                            icon: 'pi pi-fw pi-plus',
                            routerLink: '/hours/register'
                        },
                        {
                            label: 'Lista',
                            icon: 'pi pi-fw pi-list',
                            routerLink: '/hours/lista'
                        },
                ]
            },
            {
                label: 'Day Hora',
                icon: 'pi pi-fw pi-clock',
                items: [
                    
                        {
                            label: 'Nuevo',
                            icon: 'pi pi-fw pi-plus',
                            routerLink: '/dayhour/register'
                        },
                        {
                            label: 'Lista',
                            icon: 'pi pi-fw pi-list',
                            routerLink: '/dayhour/lista'
                        },
                ]
            },
            {
                label: 'Reportes',
                icon: 'pi pi-fw pi-book',
                items: [
                        {
                            label: 'Lista',
                            icon: 'pi pi-fw pi-list',
                            routerLink: '/report/lista'
                        },
                ]
            }


        ];
    }
    
}
