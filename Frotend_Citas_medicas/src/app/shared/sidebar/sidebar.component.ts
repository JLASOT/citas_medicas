import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  items: MenuItem[] = [];

  userRole: string = ''; // Variable para el rol del usuario

    ngOnInit() {

          // Obtén el rol del usuario desde el localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}'); // Convierte el JSON almacenado en objeto
    this.userRole = user.rol || ''; // Extrae el rol del usuario, por ejemplo: "admin" o "medico"


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
                        label: 'Nuevo',
                        icon: 'pi pi-fw pi-plus',
                        routerLink: '/appointment/register'
                    },
                ]
            },

            {
                label: 'Calendario',
                icon: 'pi pi-fw pi-calendar',
                routerLink: '/calendar/lista'
             /*    items: [
                    {
                        label: 'Calendario',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: '/calendar/lista'
                    },
                    
                ] */
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
                label: 'Horario Medicos',
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

         // Filtra las opciones según el rol
     if (this.userRole !== 'admin') {
        // Oculta el menú de "Users" si no es administrador
        this.items = this.items.filter(item => item.label !== 'Users');
        this.items = this.items.filter(item => item.label !== 'Especialidad');
        this.items = this.items.filter(item => item.label !== 'Dia');
        this.items = this.items.filter(item => item.label !== 'Hora');
        this.items = this.items.filter(item => item.label !== 'Day Hora');
      }
      if (this.userRole === 'medico') {
        // Oculta el menú de "Horario Medicos" si el rol es "medico"
        this.items = this.items.filter(item => item.label !== 'Horario Medicos');
    }

    }
    
}
