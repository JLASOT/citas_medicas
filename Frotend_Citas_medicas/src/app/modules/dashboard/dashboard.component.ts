import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/service/user.service';
import { AppointmentService } from '../appointment/service/appointment.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  basicData: any;

  basicOptions: any;

  chartData: any; // Datos para el gráfico
  chartOptions: any; // Opciones del gráfico

  users: any[] = []; // Lista de usuarios
  userStats: any = { totalUsers: 0, newUsers: 0 }; // Estadísticas de usuarios

  specialitiesRanking: any[] = [];

  appointmentStats: any = {
    todayAppointments: 0,
    totalAppointments: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    estimatedRevenue: 0, // Ingresos estimados
    todayRevenue: 0, // Ingresos estimados y del día
  };

  constructor(
    private userService: UserService,
    private appointmentService: AppointmentService
  ) {}
  ngOnInit() {
    this.getUsers();
    this.getAppointments();
    /*    const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
 */
    // Estilos del gráfico
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  getAppointments(): void {
    this.appointmentService.listAppointment().subscribe(
      (response: any) => {
        const appointments = response.appointments;

        // Total de citas
        this.appointmentStats.totalAppointments = appointments.length;

        // Agrupar citas por mes usando dateAppointment
        /*  const appointmentsByMonth: { [key: string]: number } = {
          'Enero': 0, 'Febrero': 0, 'Marzo': 0, 'Abril': 0, 'Mayo': 0,
          'Junio': 0, 'Julio': 0, 'Agosto': 0, 'Septiembre': 0, 'Octubre': 0,
          'Noviembre': 0, 'Diciembre': 0
        };

        appointments.forEach((appointment: any) => {
          const date = new Date(appointment.dateAppointment); // Usar dateAppointment
          const monthName = date.toLocaleString('es-ES', { month: 'long' }); // Nombre del mes
          const capitalizedMonth =
            monthName.charAt(0).toUpperCase() + monthName.slice(1); // Capitalizar el mes
          if (appointmentsByMonth[capitalizedMonth] !== undefined) {
            appointmentsByMonth[capitalizedMonth]++;
          }
        });

        this.updateChart(appointmentsByMonth); */
        // Agrupar citas por mes y año usando dateAppointment
        const appointmentsByMonth: { [key: string]: number } = {};

        appointments.forEach((appointment: any) => {
          const date = new Date(appointment.dateAppointment); // Usar dateAppointment
          const monthName = date.toLocaleString('es-ES', { month: 'long' }); // Nombre del mes
          const year = date.getFullYear(); // Año de la cita
          const monthYear = `${
            monthName.charAt(0).toUpperCase() + monthName.slice(1)
          } ${year}`; // Mes y año

          if (appointmentsByMonth[monthYear] !== undefined) {
            appointmentsByMonth[monthYear]++;
          } else {
            appointmentsByMonth[monthYear] = 1; // Si no existe, inicializa con 1
          }
        });

        this.updateChart(appointmentsByMonth);

        // Fecha actual a las 00:00
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Citas registradas hoy (usando createdAt)
        this.appointmentStats.todayAppointments = appointments.filter(
          (appointment: any) => {
            const createdAtDate = new Date(appointment.createdAt);
            return (
              createdAtDate.getFullYear() === today.getFullYear() &&
              createdAtDate.getMonth() === today.getMonth() &&
              createdAtDate.getDate() === today.getDate()
            );
          }
        ).length;

        // Citas por estado
        this.appointmentStats.pending = appointments.filter(
          (appointment: any) => appointment.stateAppointment === 1
        ).length;
        this.appointmentStats.completed = appointments.filter(
          (appointment: any) => appointment.stateAppointment === 2
        ).length;
        this.appointmentStats.cancelled = appointments.filter(
          (appointment: any) => appointment.stateAppointment === 3
        ).length;

        // Calcular ranking de especialidades
        const specialityCounts: { [key: string]: number } = {};
        appointments.forEach((appointment: any) => {
          const specialityName = appointment.Specialitie.name;
          if (!specialityCounts[specialityName]) {
            specialityCounts[specialityName] = 0;
          }
          specialityCounts[specialityName]++;
        });

        // Convertir el objeto a un array y ordenarlo por número de citas
        this.specialitiesRanking = Object.entries(specialityCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);


        // Calcular ingresos estimados
        this.appointmentStats.estimatedRevenue = appointments
          .filter(
            (appointment: any) =>
              appointment.stateAppointment === 2 ||
              appointment.stateAppointment === 1
          ) // Filtrar citas completadas
          .reduce(
            (sum: number, appointment: any) =>
              sum + (appointment.paymentAppointment || 0),
            0
          ); // Sumar los pagos

        // Calcular ingresos de hoy (filtrar citas de hoy por createdAt)
       /*  this.appointmentStats.todayRevenue = appointments
          .filter((appointment: any) => {
            const createdAtDate = new Date(appointment.createdAt);
            return (
              (createdAtDate.getFullYear() === today.getFullYear() &&
                createdAtDate.getMonth() === today.getMonth() &&
                createdAtDate.getDate() === today.getDate() &&
                appointment.stateAppointment === 2) ||
              appointment.stateAppointment === 1 // Solo contar las citas completadas
            );
          })
          .reduce(
            (sum: number, appointment: any) =>
              sum + (appointment.paymentAppointment || 0),
            0
          ); // Sumar los pagos de las citas de hoy
 */
          this.appointmentStats.todayRevenue = appointments
          .filter((appointment: any) => {
            const createdAtDate = new Date(appointment.createdAt);
            return (
              createdAtDate.getTime() >= today.getTime() && // Inicio del día actual
              createdAtDate.getTime() < today.getTime() + 86400000 && // Final del día actual
              (appointment.stateAppointment === 2 || appointment.stateAppointment === 1) // Solo citas completadas o pendientes
            );
          })
          .reduce(
            (sum: number, appointment: any) =>
              sum + (appointment.paymentAppointment || 0),
            0
          );

      },
      (error) => {
        console.error('Error al obtener las citas:', error);
      }
    );
  }

  // Actualizar los datos del gráfico
  updateChart(appointmentsByMonth: { [key: string]: number }): void {
    this.chartData = {
      labels: Object.keys(appointmentsByMonth),
      datasets: [
        {
          label: 'Citas por mes',
          data: Object.values(appointmentsByMonth),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
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

    this.userStats.newUsers = this.users.filter(
      (user) => new Date(user.createdAt) > sevenDaysAgo
    ).length;
  }
}
