import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UserService } from '../../user/service/user.service';
import { Router } from '@angular/router';
import { SpecialitieService } from '../../specialitie/service/specialitie.service';
import { PatientService } from '../../patient/service/patient.service';
import { AppointmentService } from '../service/appointment.service';
import { DayHourService } from '../../day-hour/service/day-hour.service';
//para poder obtener la fecha de la url
import { ActivatedRoute } from '@angular/router';  // Importar ActivatedRoute


interface DayHour {
  id: number;
  userId: number;
  day: string; // O el tipo adecuado para el día
  hour: string; // O el tipo adecuado para la hora
  state: number;
}

@Component({
  selector: 'app-appointment-add',
  templateUrl: './appointment-add.component.html',
  styleUrls: ['./appointment-add.component.css'],
})
export class AppointmentAddComponent implements OnInit {
  specialities: any[] = []; // Añadir array para almacenar las especialidades
  selectedSpeciality: any; // Añadir variable para la especialidad seleccionada

  patients: any[] = []; // Arreglo para almacenar los pacientes
  selectedItem: any = null; // Elemento seleccionado en el autocompletado
  suggestions: any[] = []; // Sugerencias del autocompletado

  users: any[] = []; // Lista de usuarios
  filteredUsers: any[] = []; // Usuarios filtrados
  selectedUser: any = null; // Inicializa selectedUser

/*   dayHours: any[] = []; // Días y horas del usuario seleccionado
 */
  dayHours: DayHour[] = []; 
 

  submitted: boolean = false;

  selectedDayOfWeek: string = '';  // Inicializamos con un valor vacío o cualquier valor por defecto

  
  selectedSpecialityDescription: string = ''; // Descripción de la especialidad seleccionada

  usrID: string = ''; // Variable para el rol del usuario

  today: Date = new Date();



  loading: boolean = true; // Control de carga

  appointment: any = {
    dateAppointment: new Date(),
    patientId: '',
    specialitieId: '',
    userId: '',
    dayHourId: '',
    paymentAppointment:'',
    userRegisId:'',
  };

  payment:any = {
    monto: '',
    metodoPago:'',
    appointmentId:'',
  };



  constructor(
    private userService: UserService,
    private router: Router,
    private specialitieService: SpecialitieService, // Añadir SpecialitieService al constructor
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private dayHourService: DayHourService,
    private route: ActivatedRoute  // Inyectar ActivatedRoute
  
  ) {}

  ngOnInit(): void {

    // Obtén el rol del usuario desde el localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}'); // Convierte el JSON almacenado en objeto
    this.usrID = user.id || ''; // Extrae el rol del usuario, por ejemplo: "admin" o "medico"

    console.log('usuario q re',this.usrID);

  // Obtener la fecha desde la URL (en formato '2024-12-11')
  this.route.queryParams.subscribe(params => {
    const selectedDate = params['date'];  // Asume que la fecha es un parámetro en la URL
    if (selectedDate) {
      // Crear un objeto Date a partir de la fecha de la URL
      const date = new Date(selectedDate);

      // Corregir el desfase horario (zona horaria local)
      // Esto puede hacer que la fecha aparezca correcta en el input
      const correctedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      


      // Asignar la fecha corregida al objeto appointment
      this.appointment.dateAppointment = correctedDate;


      //validar el dia lunes q no se elija otra fecha 
        // Obtener el día de la semana de la fecha seleccionada (Lunes, Martes, etc.)
    this.selectedDayOfWeek = correctedDate.toLocaleString('es-ES', { weekday: 'long' });
    console.log('Día seleccionado:', this.selectedDayOfWeek);
    }

    
  });

    // Implementar ngOnInit para cargar las especialidades
    this.loadPatients();
    this.loadSpecialities();
    this.loadUsers();
  }

  // Método para cargar la lista de pacientes desde el servicio
  loadUsers() {
    this.userService.listUsers().subscribe(
      (response: any) => {
        console.log('Users recibidos:', response.users); // Verifica los pacientes dentro de 'tutor'
        this.users = response.users || []; // Asigna los pacientes correctamente desde 'response.tutor'
        this.loading = false; // Desactiva el indicador de carga
        // Crear el campo fullName para cada usuario
        this.users.forEach((user) => {
          user.fullName = `${user.name} ${user.surname}`; // Concatenamos nombre y apellido
        });
      },
      (error) => {
        console.error('Error al cargar los tutores:', error);
        this.loading = false; // Desactiva el indicador de carga en caso de error
      }
    );
  }

  filterUsersBySpeciality() {
    if (this.selectedSpeciality) {
      this.filteredUsers = this.users.filter(
        (user) =>
          user.specialitieId !== null &&
          user.specialitieId === this.selectedSpeciality.id 
          
      );
    } else {
      this.filteredUsers = this.users.filter(
        (user) => user.specialitieId !== null 
       
     
      );
    }
  } 
/* 
    filterUsersBySpeciality() {
      if (this.selectedSpeciality) {
        this.filteredUsers = this.users.filter(
          (user) =>
            user.specialitieId !== null &&
            user.specialitieId === this.selectedSpeciality.id &&
            new Date(user.fechaFin) >= new Date(this.appointment.dateAppointment) // Verificar que fechaFin sea >= a la fecha seleccionada
        );
      } else {
        this.filteredUsers = this.users.filter(
          (user) => user.specialitieId !== null
        );
      }
    }
      */

    

   


  onUserChange(event: any) {
    this.selectedUser = event.value; // Asegúrate de que 'event.value' contenga el usuario completo
    console.log('selectedUser actualizado en onUserChange:', this.selectedUser);
    
    if (this.selectedUser) {
      this.appointment.userId = this.selectedUser.id;  // Actualiza el userId en el objeto appointment
      this.loadDayHours(this.selectedUser.id); // Cargar los días y horas del usuario seleccionado
    }
  }
  

  // Este método se ejecutará cuando se seleccione una especialidad
/*   onSpecialityChange() {
    this.filterUsersBySpeciality();
  }
 */
  /* onSpecialityChange() {
    this.filterUsersBySpeciality();
    if (this.filteredUsers.length === 0) {
      this.dayHours = []; // Resetea dayHours si no hay médicos disponibles
      this.appointment.dayHourId = null; // Resetea el campo dayHourId
    } else {
      this.loadDayHours(this.selectedUser.id);
    }
  }
   */





  onSpecialityChange(): void {
    // Filtra los médicos por especialidad
    this.filterUsersBySpeciality();
  
    // Si no hay médicos disponibles, resetea las listas dependientes
    if (!this.filteredUsers || this.filteredUsers.length === 0) {
      console.log('No hay médicos disponibles para la especialidad seleccionada');
      this.dayHours = []; // Limpia horarios disponibles
      this.appointment.dayHourId = null; // Resetea el campo de día y hora
      this.selectedUser = null; // Resetea el usuario seleccionado
      this.selectedSpecialityDescription = ''; // Resetea la descripción
      return;
    }

    // Actualiza la descripción de la especialidad seleccionada
  if (this.selectedSpeciality && this.selectedSpeciality.description) {
    this.selectedSpecialityDescription = this.selectedSpeciality.price;
  } else {
    this.selectedSpecialityDescription = ''; // Resetea la descripción si no se encuentra
  }
  
    // Si hay médicos disponibles, asegúrate de cargar los horarios para el usuario seleccionado
    if (this.selectedUser && this.selectedUser.id) {
      this.loadDayHours(this.selectedUser.id);
    } else {
      console.log('Selecciona un médico para ver los horarios disponibles');
      this.dayHours = []; // Limpia horarios hasta que se seleccione un médico
    }
  }

  


  loadDayHours(userId: number) {
    // Paso 1: Cargar los dayHours disponibles para el usuario
    this.dayHourService.listDayHour().subscribe(
      (response: any) => {
        // Filtrar los dayHours por el userId y el día seleccionado
        let availableDayHours = response.dayHours.filter((dayHour: any) => {
          return dayHour.User.id === userId && dayHour.Day.name === this.selectedDayOfWeek;
        });
  
        console.log('Días y horas disponibles:', availableDayHours);
  
        // Paso 2: Cargar todas las citas registradas
        this.appointmentService.listAppointment().subscribe(
          (appointmentsResponse: any) => {
            const appointments = appointmentsResponse.appointments || [];
  
            // Paso 3: Filtrar los dayHours ocupados en la fecha seleccionada
            availableDayHours = availableDayHours.filter((dayHour: any) => {
              const fechaSeleccionada = new Date(this.appointment.dateAppointment);
              let isOccupied = false;
  
              // Verificar si ya existe una cita con el mismo dayHourId en la misma fecha
              appointments.forEach((appointment: any) => {
                const citaDate = new Date(appointment.dateAppointment);
                citaDate.setDate(citaDate.getDate() + 1);  // Ajuste por el desfase de fechas
                if (citaDate.toLocaleDateString('es-PE') === fechaSeleccionada.toLocaleDateString('es-PE') &&
                    appointment.dayHourId === dayHour.id) {
                  isOccupied = true;  // Si se encuentra ocupada, se marca como ocupada
                }
              });
  
              return !isOccupied;  // Si no está ocupada, lo dejamos en los disponibles
            });
  
            console.log('Días y horas disponibles para el usuario:', availableDayHours);
  
            // Paso 4: Asignar el displayName para cada elemento
            this.dayHours = availableDayHours.map((dayHour: any) => {
              dayHour.displayName = `${dayHour.Day.name} - ${dayHour.Hour.name}`;
              return dayHour;
            });
  
            console.log('Días y horas disponibles para el usuario con displayName:', this.dayHours);
  
            // Si tienes un valor previamente seleccionado en appointment.dayHourId
            if (this.appointment.dayHourId) {
              const selectedDayHour = this.dayHours.find(dh => dh.id === this.appointment.dayHourId);
              if (selectedDayHour) {
                // Asegúrate de que solo el id esté asignado
                this.appointment.dayHourId = selectedDayHour.id;
              }
            }
          },
          (error) => {
            console.error('Error al cargar las citas:', error);
          }
        );
      },
      (error) => {
        console.error('Error al cargar los dayHours:', error);
      }
    );
  }
  
   

  // Método para manejar el cambio de fecha desde el calendario o manualmente
onDateChange() {
  const selectedDate = this.appointment.dateAppointment;
  if (selectedDate) {
    // Formatear la fecha seleccionada
    //const formattedDate = selectedDate.toISOString().split('T')[0];

    // Ajustar la fecha a la zona horaria local
  /*   const correctedDate = new Date(
      selectedDate.getTime() + selectedDate.getTimezoneOffset() * 60000
    );

    //this.appointment.dateAppointment = new Date(formattedDate);
    // Asignar la fecha corregida
    this.appointment.dateAppointment = correctedDate; */
    

    // Obtener el día de la semana de la fecha seleccionada
    this.selectedDayOfWeek = selectedDate.toLocaleString('es-ES', { weekday: 'long' });
    console.log('Día seleccionado manualmente:', this.selectedDayOfWeek);

    // Refiltrar los días y horas según la nueva fecha seleccionada
    if (this.selectedUser) {
      this.loadDayHours(this.selectedUser.id); // Refiltra usando el usuario seleccionado
    }
  } else {
    console.warn('Fecha seleccionada no válida.');
  }
}



    

   // Método para manejar el cambio de fecha desde el calendario
/*    onDateChange() {
    const selectedDate = this.appointment.dateAppointment;
    if (selectedDate) {
      // Formateamos la fecha a string para compararla con los datos del backend si es necesario
      const formattedDate = selectedDate.toISOString().split('T')[0];
      this.appointment.dateAppointment = new Date(formattedDate); // Asegúrate de que la fecha esté en el formato correcto
    }
  }
 */
  loadSpecialities(): void {
    this.specialitieService.listSpecialitie().subscribe(
      (data) => {
        this.specialities = data.specialitie; // Asignar las especialidades al array
        console.log('Especialidades cargadas:', data.specialitie); // Añadir este log
      },
      (error) => {
        console.error('Error al cargar las especialidades:', error);
      }
    );
  }

 

  onSubmit(): void {
   

    console.log('Datos del usuario a registrar:', this.appointment);

      // Verifica que la fecha no sea nula o inválida antes de continuar
  if (!this.appointment.dateAppointment || isNaN(this.appointment.dateAppointment.getTime())) {
    console.error('La fecha es inválida');
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: 'Por favor, selecciona una fecha válida.',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });
    return; // Detiene el submit si la fecha no es válida
  }

  if (this.selectedUser && this.selectedUser.fechaFin) {
    const fechaIni = new Date(this.selectedUser.fechaIni);
    const fechaFin = new Date(this.selectedUser.fechaFin);
    const fechaSeleccionada = new Date(this.appointment.dateAppointment);

    // Sumar un día a fechaFin para corregir el posible desfase de zona horaria
    fechaIni.setDate(fechaIni.getDate() + 1);
    fechaFin.setDate(fechaFin.getDate() + 1);

   // Log después de sumar un día
   console.log('fechaIni después de sumar un día:', fechaIni);
   console.log('fechaFin después de sumar un día:', fechaFin);
  
   /*  // Asegurarse de que solo se compare la parte de la fecha (sin horas, minutos, segundos)
    fechaFin.setHours(0, 0, 0, 0); // Ajusta la hora de fechaFin a medianoche
    fechaSeleccionada.setHours(0, 0, 0, 0); // Ajusta la hora de fechaSeleccionada a medianoche

    console.log('fecahfin',fechaFin);
    console.log('fecahsselction',fechaSeleccionada);
  
    // Compara solo la parte de la fecha
    if (fechaSeleccionada > fechaFin) {

       // Formatear la fecha a un formato legible (dd/mm/yyyy)
  const fechaFinFormateada = fechaFin.toLocaleDateString('es-BO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
      console.error('La fecha seleccionada está fuera del rango permitido.');
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: `La fecha seleccionada está fuera del rango. El medico no puede tener citas después del ${fechaFinFormateada}.`,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
      return; // Detiene el submit si la fecha está fuera de rango
    } */

      // Crear una nueva fecha para evitar modificar la original
/* const fechaFinAjustada = new Date(fechaFin);
fechaFinAjustada.setDate(fechaFinAjustada.getDate() + 1); // Añadir un día */

// Asegurarse de que ambas fechas estén sin horas
fechaIni.setHours(0, 0, 0, 0);
fechaFin.setHours(0, 0, 0, 0);
fechaSeleccionada.setHours(0, 0, 0, 0);

console.log('fechaFinAjustada:', fechaIni);
console.log('fechaFinAjustada:', fechaFin);
console.log('fechaSeleccionada:', fechaSeleccionada);

// Compara solo la parte de la fecha
if (fechaSeleccionada > fechaFin || fechaSeleccionada < fechaIni) {
  const fechaFinFormateada = fechaFin.toLocaleDateString('es-BO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const fechaIniFormateada = fechaIni.toLocaleDateString('es-BO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });


  console.error('La fecha seleccionada está fuera del rango permitido.');
  Swal.fire({
    icon: 'error',
    title: '¡Error!',
    text: `Fecha fuera del rango. Dr(a) ${this.selectedUser.name} ${this.selectedUser.surname} no puede tener citas antes del ${fechaIniFormateada} ni  después del ${fechaFinFormateada}.`,
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'OK',
  });
  return; // Detiene el submit si la fecha está fuera de rango  
}

  }
  


    console.log('Fecha seleccionada:', this.appointment.dateAppointment);    
    console.log('ID del día y hora seleccionado:', this.appointment.dayHourId); // Debería ser solo un número (ID)

    console.log('Datos del usuario a registrar:', this.appointment);
    console.log('selectedUser:', this.selectedUser);
    console.log('Filtered users:', this.filteredUsers);
  
    // Asegúrate de que solo el id se pasa, no el objeto completo
    const selectedDayHourId = this.appointment.dayHourId ? this.appointment.dayHourId.id : null;
  
    if (selectedDayHourId) {
      this.appointment.dayHourId = selectedDayHourId; // Solo el ID debe ir al servidor
      console.log('ID del día y hora seleccionado:', this.appointment.dayHourId); // Esto debe ser solo el ID numérico
    }
  
    this.appointment.patientId = this.selectedItem.id; // Asignamos el patientId seleccionado
    this.appointment.specialitieId = this.selectedSpeciality.id;
    // Asegurémonos de que selectedUser tiene el id
    if (this.selectedUser) {
      this.appointment.userId = this.selectedUser.id; // Asignamos el id correctamente
    } else {
      console.error('No se seleccionó un usuario.');
    }
    console.log('Datos finales del appointment:', this.appointment);

  
    this.appointment.userRegisId = this.usrID;
    this.appointmentService.registerAppointment(this.appointment).subscribe(
      (response) => {
        console.log('Paciente registrado exitosamente:', response);

         // Obtener el ID de la cita registrada
      const appointmentId = response.appointment.id;

      // Preparar el objeto de pago
      this.payment.appointmentId = appointmentId;
      console.log('Datos del pago a registrar:', this.payment);

        this.payment.appointmentId = appointmentId;

        

        this.appointmentService.registerPayment(this.payment).subscribe(
          (paymentResponse) => {
            console.log('Pago registrado exitosamente:', paymentResponse);
          }
        )
  
        // Después de registrar el appointment, actualizamos el estado del dayHour
        const selectedDayHour = this.dayHours.find((dh: any) => dh.id === selectedDayHourId);
  
        if (selectedDayHour) {
          selectedDayHour.state = 2; // Actualizamos el estado del dayHour a "ocupado"
  
          // Llamamos al servicio para actualizar el estado del dayHour en la base de datos
          this.dayHourService.updateDayHour(selectedDayHour.id, selectedDayHour).subscribe(
            (updateResponse) => {
              console.log('Estado del DayHour actualizado:', updateResponse);
  
              // Redirige a la lista de citas después de actualizar el DayHour
              Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'cita registrado exitosamente.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
              });
              this.router.navigate(['/appointment/lista']);
            },
            (error) => {
              console.error('Error al actualizar el estado del DayHour:', error);
            }
          );
        } else {
          console.error('No se encontró el DayHour seleccionado');
        }

        Swal.fire({
                  icon: 'success',
                  title: '¡Éxito!',
                  text: 'cita registrado exitosamente.',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK',
                });
                this.router.navigate(['/appointment/lista']);

  
      },
      (error) => {
        console.error('Error al registrar la cita:', error);
                Swal.fire({
                  icon: 'error',
                  title: '¡Error!',
                  // text:
                  //   'Error al registrar la especialidad: ' +
                  //   (error.error?.message || 'Error desconocido'),
                  text: error.message || 'Error desconocido',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK',
                });
      }
    );
  }
  

  // Método para cargar la lista de pacientes desde el servicio
  loadPatients() {
    this.patientService.listPatients().subscribe(
      (response: any) => {
        console.log('Pacientes recibidos:', response.patient); // Verifica los pacientes dentro de 'patient'
        this.patients = response.patient || []; // Asigna los pacientes correctamente desde 'response.patient'
        this.loading = false; // Desactiva el indicador de carga
        this.patients.forEach((patient) => {
          patient.fullName = `${patient.name} ${patient.surname}`; // Combinamos name y surname
        });
      },
      (error) => {
        console.error('Error al cargar los pacientes:', error);
        this.loading = false; // Desactiva el indicador de carga en caso de error
      }
    );
  }

  // Método para manejar la búsqueda y filtrar los pacientes
  search(event: any) {
    const query = event.query.toLowerCase();
    // Filtra los pacientes por nombre o apellido
    this.suggestions = this.patients.filter((patient) =>
      patient.fullName.toLowerCase().includes(query)
    );
  }
}
