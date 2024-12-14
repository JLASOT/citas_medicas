import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/service/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  basicData: any;

    basicOptions: any;
    users: any[] = [];  // Lista de usuarios
  userStats: any = { totalUsers: 0, newUsers: 0 }; // Estadísticas de usuarios
  constructor(private userService: UserService) {}
    ngOnInit() {

        this.getUsers(); 
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      this.basicData = {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          datasets: [
              {
                  label: 'Sales',
                  data: [540, 325, 702, 620],
                  backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                  borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                  borderWidth: 1
              }
          ]
      };

      this.basicOptions = {
          plugins: {
              legend: {
                  labels: {
                      color: textColor
                  }
              }
          },
          scales: {
              y: {
                  beginAtZero: true,
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              },
              x: {
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              }
          }
      };
  }

     // Método para obtener los usuarios y calcular las estadísticas
     getUsers(): void {
        this.userService.listUsers().subscribe(
          (response: any) => {
            // Almacenar los usuarios en la propiedad users
            this.users = response.users;
    
            // Calcular estadísticas
            this.calculateStats();
          },
          (error) => {
            console.error('Error al obtener los usuarios:', error);
          }
        );
      }
       // Método para calcular las estadísticas
       calculateStats(): void {
        // Número total de usuarios
        this.userStats.totalUsers = this.users.length;
    
        // Filtrar los usuarios nuevos (creados en los últimos 7 días)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
        this.userStats.newUsers = this.users.filter(user => new Date(user.createdAt) > sevenDaysAgo).length;
      }

}
