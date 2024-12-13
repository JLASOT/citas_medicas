import { Component, Input } from '@angular/core';
import { AppointmentService } from '../../appointment/service/appointment.service';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth.service';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css'],
})
export class CalendarViewComponent {
  @Input() appointment: any = {}; // Asegura que appointment esté definido


  //para poder sehabilitar los dias anteriores de hoy 
   // Obtener la fecha actual en formato YYYY-MM-DD
   //today: string = new Date().toISOString().split('T')[0];  

   today: string = new Date(new Date().setDate(new Date().getDate())).toISOString().split('T')[0];


  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin], // Aquí se habilita el plugin
    locale: esLocale, // Configuración para el idioma español

    events: [], // Aquí se cargarán los eventos dinámicamente
    editable: true,
    selectable: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },

    dateClick: this.handleDateClick.bind(this),
  //para poder sehabilitar los dias anteriores de hoy 
    // Añadir validRange para bloquear fechas anteriores a la fecha actual
    validRange: {
      start: this.today, // La fecha mínima que se puede seleccionar
    },

  };

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private authService: AuthService, // Inyectamos AuthService
  ) {
    this.loadAppointments();
  }

  loadAppointments() {

     // Obtener el usuario actual desde AuthService
     const currentUser = this.authService.user;
     const isDoctor = currentUser && currentUser.rol === 'medico'; // Verifica si es médico
     const doctorId = currentUser?.id; // ID del médico logueado
 



   /*  this.appointmentService.listAppointment().subscribe((response: any) => {
      const appointments = response.appointments; // Extraemos el array de citas
      if (Array.isArray(appointments)) {
        // Filtrar las citas para que solo se incluyan aquellas con stateAppointment igual a 1
        const filteredAppointments = appointments.filter(
          (appointment) => appointment.stateAppointment === 1
        );
 */

        this.appointmentService.listAppointment().subscribe((response: any) => {
          const appointments = response.appointments; // Extraemos el array de citas

          if (Array.isArray(appointments)) {
            // Filtrar las citas según el rol del usuario
            const filteredAppointments = appointments.filter((appointment) => {
              
               if (isDoctor) {
                // Si el usuario es médico, mostrar solo sus citas
                return (
                  appointment.stateAppointment === 1 &&
                  appointment.User.id === doctorId
                );
              }
              // Si no es médico, muestra todas las citas activas
              return appointment.stateAppointment === 1;
            });
            

        /* this.calendarOptions.events = appointments.map((appointment) => {
                  console.log("Estado de la cita:", appointment.stateAppointment); // Verificar el estado

                   */

        // Mapear las citas filtradas para convertirlas en eventos
        this.calendarOptions.events = filteredAppointments.map(
          (appointment) => {
            console.log('Estado de la cita:', appointment.stateAppointment); // Verificar el estado

            const dateStr = appointment.dateAppointment; // Fecha de la cita (en formato '2024-12-09T04:00:00.000Z')
            
            const hourStr = appointment.DayHour.Hour.name; // Hora de la cita (ej. '07:00:00')

            // Combinar la fecha y la hora para generar un valor completo de fecha y hora
            const [hour, minute, second] = hourStr.split(':'); // Dividir la hora en partes
            const fullDate = new Date(dateStr); // Usar la fecha de la cita como base


             // Ajustar la fecha añadiendo un día
            fullDate.setDate(fullDate.getDate() + 1); // Añadir un día

            fullDate.setHours(Number(hour), Number(minute), Number(second), 0); // Establecer la hora, minuto y segundo

            return {
              title: `${appointment.Patient.name} ${appointment.Patient.surname} - ${appointment.Specialitie.name}- Dr(a). ${appointment.User.name.trim()} ${appointment.User.surname.trim()}`,
              start: fullDate.toISOString(), // Usamos el valor de fecha completo como inicio del evento
              extendedProps: {
                state: appointment.stateAppointment, // Se pasa el estado del evento
                doctor: `${appointment.User.name} ${appointment.User.surname}`,
                dayHour: `${appointment.DayHour.Day.name} ${appointment.DayHour.Hour.name}`,
              },
            };
          }
        );
      } else {
        console.error(
          'Los datos recibidos no son un arreglo de citas:',
          appointments
        );
      }
    });
  }

  // Manejar clic en una fecha
  handleDateClick(arg: any) {
    const selectedDate = arg.dateStr; // Fecha seleccionada
    console.log('Fecha seleccionada:', selectedDate);

    // Redirigir a la ruta /appointment/register y pasar la fecha seleccionada como parámetro
    this.router.navigate(['/appointment/register'], {
      queryParams: { date: selectedDate },
    });
  }
}
