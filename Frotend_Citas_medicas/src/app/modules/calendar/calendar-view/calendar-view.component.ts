import { Component } from '@angular/core';
import { AppointmentService } from '../../appointment/service/appointment.service';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [interactionPlugin,dayGridPlugin,timeGridPlugin], // Aquí se habilita el plugin
 
    events: [], // Aquí se cargarán los eventos dinámicamente
    editable: true,
    selectable: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    eventTimeFormat: {
      // Eliminamos la parte de "minute" para evitar que el FullCalendar agregue la fecha.
      hour12: false, // Usar formato de 24 horas sin AM/PM
      minute:'2-digit',
      meridiem: false, // Desactiva el formato AM/PM
    },
/* 
//para eliminar el  0 y el punto se elimnina tambien
    eventContent: function(arg) {
      // Modificamos el contenido del evento y solo mostramos el título
      const title = arg.event.title; // Solo título del evento
      return { html: `<div class="fc-event-title">${title}</div>` }; // Solo mostramos el título, sin la hora ni la fecha
    }, */
    /* eventContent: function(arg) {
      const title = arg.event.title; // Solo mostramos el título
      const state = arg.event.extendedProps['state']; // Accedemos al estado con ['state']
      
      // Verifica en la consola que el estado es correcto
      console.log("Estado en eventContent:", state); // Verifica el valor del estado
    
      let dotClass = ''; // Clase dinámica para el puntito
    
      // Determinar el color del puntito según el estado
      if (state === 1) {
        dotClass = 'fc-event-dot-pending'; // Puntito rojo para pendiente
      } else if (state === 2) {
        dotClass = 'fc-event-dot-completed'; // Puntito verde para completado
      } else if (state === 3) {
        dotClass = 'fc-event-dot-cancelled'; // Puntito gris para cancelado
      }
    
      console.log("Clase asignada:", dotClass); // Verifica que la clase está siendo asignada
    
      return { 
        html: `<div class="fc-event-title">${title}</div>
               <div class="fc-daygrid-event-dot ${dotClass}"></div>` 
      }; // Agregar el puntito con la clase dinámica
    },
     */
    dateClick: this.handleDateClick.bind(this),
  };

  constructor(private appointmentService: AppointmentService) {
    this.loadAppointments();
  }

 /*   // Cargar las citas como eventos en el calendario
   /* loadAppointments() {
    this.appointmentService.listAppointment().subscribe((data) => {
      this.calendarOptions.events = data.map((appointment: any) => ({
        id: appointment.id,
        title: appointment.title,
        start: appointment.date, // Asegúrate de que el formato sea válido (ISO 8601)
        end: appointment.endDate, // Opcional si manejas rango de fechas
      }));
    });
  } */
/*   loadAppointments() {
      this.appointmentService.listAppointment().subscribe((response: any) => {
        const appointments = response.appointments; // Extraemos el array de citas
        if (Array.isArray(appointments)) {
          this.calendarOptions.events = appointments.map((appointment) => ({
            title: `${appointment.DayHour.Hour.name} ${appointment.Patient.name} ${appointment.Patient.surname} - ${appointment.Specialitie.name}`, // Combina datos relevantes para el título
            start: appointment.dateAppointment, // Fecha de inicio
            extendedProps: {
              // Puedes añadir más propiedades si las necesitas en algún evento
              state: appointment.stateAppointment,
              doctor: `${appointment.User.name} ${appointment.User.surname}`,
              dayHour: `${appointment.DayHour.Day.name} ${appointment.DayHour.Hour.name}`,
            },
          }));
        } else {
          console.error('Los datos recibidos no son un arreglo de citas:', appointments);
        }
      });
    } 
 */


/*       loadAppointments() {
        this.appointmentService.listAppointment().subscribe((response: any) => {
          const appointments = response.appointments; // Extraemos el array de citas
          if (Array.isArray(appointments)) {
            this.calendarOptions.events = appointments.map((appointment) => ({
              title: `${appointment.Patient.name} ${appointment.Patient.surname} - ${appointment.Specialitie.name}`, // Solo mostramos el nombre del paciente y la especialidad, sin la hora
              start: appointment.dateAppointment,
              extendedProps: {
                state: appointment.stateAppointment,
                doctor: `${appointment.User.name} ${appointment.User.surname}`,
                dayHour: `${appointment.DayHour.Day.name} ${appointment.DayHour.Hour.name}`, // Si necesitas el día y la hora, pero no mostrarla
              },
            }));
          } else {
            console.error('Los datos recibidos no son un arreglo de citas:', appointments);
          }
        });
      } */
  /*       loadAppointments() {
          this.appointmentService.listAppointment().subscribe((response: any) => {
            const appointments = response.appointments; // Extraemos el array de citas
            if (Array.isArray(appointments)) {
              this.calendarOptions.events = appointments.map((appointment) => ({
                title: `${appointment.DayHour.Hour.name} ${appointment.Patient.name} ${appointment.Patient.surname} - ${appointment.Specialitie.name}`, // Usa la hora tal cual viene desde la base de datos
                start: appointment.dateAppointment, // Fecha de inicio
                extendedProps: {
                  // Más propiedades si es necesario
                  state: appointment.stateAppointment,
                  doctor: `${appointment.User.name} ${appointment.User.surname}`,
                  dayHour: `${appointment.DayHour.Day.name} ${appointment.DayHour.Hour.name}`,
                },
              }));
            } else {
              console.error('Los datos recibidos no son un arreglo de citas:', appointments);
            }
          });
        } */
        

 /*        loadAppointments() {
          this.appointmentService.listAppointment().subscribe((response: any) => {
            const appointments = response.appointments; // Extraemos el array de citas
            if (Array.isArray(appointments)) {
              this.calendarOptions.events = appointments.map((appointment) => ({

                title: `${appointment.DayHour.Hour.name} ${appointment.Patient.name} ${appointment.Patient.surname} - ${appointment.Specialitie.name}`, // Usa la hora tal cual viene desde la base de datos
                start: appointment.dateAppointment, // Fecha de inicio
                extendedProps: {
                  state: appointment.stateAppointment,  // Se pasa el estado del evento
                  doctor: `${appointment.User.name} ${appointment.User.surname}`,
                  dayHour: `${appointment.DayHour.Day.name} ${appointment.DayHour.Hour.name}`,
                },
              }));
            } else {
              console.error('Los datos recibidos no son un arreglo de citas:', appointments);
            }
          });
        } */
        

          loadAppointments() {
            this.appointmentService.listAppointment().subscribe((response: any) => {
              const appointments = response.appointments; // Extraemos el array de citas
              if (Array.isArray(appointments)) {
                this.calendarOptions.events = appointments.map((appointment) => {
                  console.log("Estado de la cita:", appointment.stateAppointment); // Verificar el estado
                  return {
                    title: `${appointment.DayHour.Hour.name} ${appointment.Patient.name} ${appointment.Patient.surname} - ${appointment.Specialitie.name}`,
                    start: appointment.dateAppointment, // Fecha de inicio
                    extendedProps: {
                      
                      state: appointment.stateAppointment,  // Se pasa el estado del evento
                      doctor: `${appointment.User.name} ${appointment.User.surname}`,
                      dayHour: `${appointment.DayHour.Day.name} ${appointment.DayHour.Hour.name}`,
                    },
                    
                  };
                });
              } else {
                console.error('Los datos recibidos no son un arreglo de citas:', appointments);
              }
            });
          }
          
        
      
    
 // Manejar clic en una fecha
 handleDateClick(arg: any) {
  alert(`Fecha seleccionada: ${arg.dateStr}`);
  // Aquí podrías abrir un modal para crear una nueva cita
}

}
