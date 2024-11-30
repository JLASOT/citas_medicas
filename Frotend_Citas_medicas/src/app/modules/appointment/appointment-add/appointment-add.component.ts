import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UserService } from '../../user/service/user.service';
import { Router } from '@angular/router';
import { SpecialitieService } from '../../specialitie/service/specialitie.service';
import { PatientService } from '../../patient/service/patient.service';
import { AppointmentService } from '../service/appointment.service';
import { DayHourService } from '../../day-hour/service/day-hour.service';

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

  loading: boolean = true; // Control de carga
  constructor(
    private userService: UserService,
    private router: Router,
    private specialitieService: SpecialitieService, // Añadir SpecialitieService al constructor
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private dayHourService: DayHourService
  
  ) {}

  ngOnInit(): void {
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



  onUserChange(event: any) {
    this.selectedUser = event.value; // Asegúrate de que 'event.value' contenga el usuario completo
    console.log('selectedUser actualizado en onUserChange:', this.selectedUser);
    
    if (this.selectedUser) {
      this.appointment.userId = this.selectedUser.id;  // Actualiza el userId en el objeto appointment
      this.loadDayHours(this.selectedUser.id); // Cargar los días y horas del usuario seleccionado
    }
  }
  

  // Este método se ejecutará cuando se seleccione una especialidad
  onSpecialityChange() {
    this.filterUsersBySpeciality();
  }


  loadDayHours(userId: number) {

    
    this.dayHourService.listDayHour().subscribe(
      (response: any) => {
        // Filtrar solo los registros para el usuario seleccionado
        this.dayHours = response.dayHours.filter(
          (dayHour: any) => dayHour.User.id === userId && dayHour.state === 1
        );
  
        // Asignar el displayName para cada elemento
        this.dayHours = this.dayHours.map((dayHour: any) => {
          dayHour.displayName = `${dayHour.Day.name} - ${dayHour.Hour.name}`;
          return dayHour;
        });
  
        // Si tienes un valor previamente seleccionado en appointment.dayHourId
        if (this.appointment.dayHourId) {
          const selectedDayHour = this.dayHours.find(dh => dh.id === this.appointment.dayHourId);
          if (selectedDayHour) {
            // Asegúrate de que solo el id esté asignado
            this.appointment.dayHourId = selectedDayHour.id;
          }
        }
  
        console.log('Días y horas disponibles para el usuario:', this.dayHours);
      },
      (error) => {
        console.error('Error al cargar los días y horas:', error);
      }
    );
  }
  

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

  appointment: any = {
    dateAppointment: new Date(),
    patientId: '',
    specialitieId: '',
    userId: '',
    dayHourId: '',
  };

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
  
    this.appointmentService.registerAppointment(this.appointment).subscribe(
      (response) => {
        console.log('Paciente registrado exitosamente:', response);
  
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
                text: 'Paciente registrado exitosamente.',
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
  
      },
      (error) => {
        console.error('Error al registrar el appointment:', error);
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Error al registrar el appointment: ' + (error.error?.message || 'Error desconocido'),
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
