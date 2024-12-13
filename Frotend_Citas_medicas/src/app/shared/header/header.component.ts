import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  items: MenuItem[] | undefined;
  user: any = null;

  constructor(public authService: AuthService) {
    this.user = this.authService.user;
  }
  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/'
      },
      {
        label: 'Dashboard',
        icon: 'pi pi-star',
        routerLink: '/dashboard'
      },

   /*    {
        label: 'Contact',
        icon: 'pi pi-envelope'
      },  */
      { 
        label: this.user ? `${this.user.name} ${this.user.surname ? this.user.surname : ''}` : 'Ingresa', 
        icon: 'pi pi-user', 
        command: () => { 
          if (!this.user) { 
            this.authService.login; // Lógica de inicio de sesión 
            } 
          },
           routerLink: this.user ? '/profile' : '/auth/login' 
      }, 
      { 
        label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout(), visible: !!this.user 
      }
  ]
  };

  logout() {
    this.authService.logout(); // Cierra la sesión
  }

}
