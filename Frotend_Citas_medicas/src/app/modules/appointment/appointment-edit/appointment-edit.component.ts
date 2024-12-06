import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user/service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SpecialitieService } from '../../specialitie/service/specialitie.service';
import { PatientService } from '../../patient/service/patient.service';
import { AppointmentService } from '../service/appointment.service';
import { DayHourService } from '../../day-hour/service/day-hour.service';
import Swal from 'sweetalert2';

interface DayHour {
  id: number;
  userId: number;
  day: string; // O el tipo adecuado para el día
  hour: string; // O el tipo adecuado para la hora
  state: number;
}

//cambiar el estado de la cita
interface StateOption {
  label: string;
  value: number;
}

@Component({
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.component.html',
  styleUrls: ['./appointment-edit.component.css'],
})
export class AppointmentEditComponent implements OnInit {
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

  //para pode cambiar el estado de diahora al editar
  previousDayHourId: number | null = null;

  stateOptions: StateOption[] | undefined;

  appointment: any = {
    dateAppointment: new Date(),
    stateAppointment: null,
    patientId: '',
    specialitieId: '',
    userId: '',
    dayHourId: '',
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private specialitieService: SpecialitieService, // Añadir SpecialitieService al constructor
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private dayHourService: DayHourService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //cambiara el estado de la cita
    this.stateOptions = [
      { label: 'Completada', value: 2 },
      { label: 'Cancelada', value: 3 },
    ];

    // Implementar ngOnInit para cargar las especialidades
    this.loadPatients();
    this.loadSpecialities();
    this.loadUsers();
    //para editar
    const appointmentId = this.route.snapshot.paramMap.get('id');
    if (appointmentId) {
      console.log('ID de la dia hora:', appointmentId);
      this.getAppointmentData(appointmentId);
    }
  }

  // Obtener los datos del paciente usando el ID para editar
  getAppointmentData(id: string): void {
    this.appointmentService.getAppointmentById(id).subscribe(
      (data) => {
        console.log('Datos de la cita:', data);

        this.appointment = data.appointment;
        this.selectedSpeciality = data.appointment.Specialitie;
        this.previousDayHourId = data.appointment.dayHourId; // Guarda el ID del DayHour anterior

        // Verificar la consistencia del ID
        console.log('ID de usuario en la cita:', data.appointment.userId);
        console.log('Lista de usuarios cargados:', this.users);

        // Asegurar que los usuarios están cargados antes de buscar
        setTimeout(() => {
          this.selectedUser = this.users.find(
            (user) => user.id === +data.appointment.userId
          );

          if (this.selectedUser) {
            console.log('Usuario encontrado:', this.selectedUser.fullName);
          } else {
            console.warn('No se encontró el usuario asociado al appointment.');
          }
        }, 500);

        // Manejamos el caso del día y la hora
        /*     if (data.appointment.dayHourId) {
        this.loadDayHours(this.selectedUser?.id || data.appointment.User.id);
      } */

        // Convertir la fecha si viene en formato string
        if (data.appointment.dateAppointment) {
          this.appointment.dateAppointment = new Date(
            data.appointment.dateAppointment
          );
        }

        // this.selectedItem = data.dayHour.User
        //para poder mostrar el nombre del docotor asociado al dayhour
        this.selectedItem = {
          ...data.appointment.Patient,
          fullName: `${data.appointment.Patient.name} ${data.appointment.Patient.surname}`,
        }; // Crear 'fullName' para autocompletado
        console.log('Usuario seleccionado para edición:', this.selectedItem);
      },
      (error) => {
        console.error('Error al obtener los datos del dia hora:', error);
        alert('No se pudo obtener los datos del dia hora.');
      }
    );
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
      this.appointment.userId = this.selectedUser.id; // Actualiza el userId en el objeto appointment
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
          const selectedDayHour = this.dayHours.find(
            (dh) => dh.id === this.appointment.dayHourId
          );
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

  onSubmit(): void {
    // Ajustar la fecha a la zona horaria local
    const localDate = new Date(this.appointment.dateAppointment);
    localDate.setMinutes(
      localDate.getMinutes() - localDate.getTimezoneOffset()
    );
    this.appointment.dateAppointment = localDate.toISOString().slice(0, 19); // Eliminar la "Z"

    console.log('Fecha seleccionada:', this.appointment.dateAppointment);
    console.log('ID del día y hora seleccionado:', this.appointment.dayHourId);

    // Verificar que solo estamos enviando los IDs y no los objetos completos
    if (!this.appointment.dayHourId) {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Selecciona un día y hora válidos.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
      return;
    }

    // Convertir dayHourId a número si es un objeto
    const selectedDayHourId =
      this.appointment.dayHourId?.id ?? this.appointment.dayHourId;
    this.appointment.dayHourId = selectedDayHourId;

    // Asegurarse de que solo se están enviando los IDs
    const appointmentData = {
      dateAppointment: this.appointment.dateAppointment,
      stateAppointment: this.appointment.stateAppointment,
      patientId: this.selectedItem ? this.selectedItem.id : null, // Solo el ID del paciente
      specialitieId: this.selectedSpeciality
        ? this.selectedSpeciality.id
        : null, // Solo el ID de la especialidad
      userId: this.selectedUser ? this.selectedUser.id : null, // Solo el ID del usuario (médico)
      //dayHourId: this.appointment.dayHourId, // Solo el ID del día y hora
      //dayHourId: this.appointment.dayHourId ? this.appointment.dayHourId.id : null,
      dayHourId: selectedDayHourId,
    };
    // Asegúrate de que solo el id se pasa, no el objeto completo
    //const selectedDayHourId = this.appointment.dayHourId ? this.appointment.dayHourId.id : null;

    if (selectedDayHourId) {
      this.appointment.dayHourId = selectedDayHourId; // Solo el ID debe ir al servidor
      console.log(
        'ID del día y hora seleccionado:',
        this.appointment.dayHourId
      ); // Esto debe ser solo el ID numérico
    }

    console.log('Datos a registrar:', appointmentData);

    // Si alguno de los IDs es null o no está definido, muestra un error
    if (
      !appointmentData.patientId ||
      !appointmentData.specialitieId ||
      !appointmentData.userId ||
      !appointmentData.dayHourId
    ) {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Todos los campos deben ser seleccionados correctamente.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
      return;
    }

    this.appointmentService
      .updateAppointment(this.appointment.id, appointmentData)
      .subscribe(
        (updateResponse) => {
          // Si el estado de la cita es 2 o 3, actualizar el estado del `dayHour` a 1
          if (
            this.appointment.stateAppointment === 2 ||
            this.appointment.stateAppointment === 3
          ) {
            if (this.appointment.dayHourId) {
              this.dayHourService
                .updateDayHour(this.appointment.dayHourId, { state: 1 })
                .subscribe(
                  () => {
                    console.log('Estado del DayHour actualizado a 1.');
                  },
                  (error) => {
                    console.error(
                      'Error al actualizar el estado del DayHour:',
                      error
                    );
                  }
                );
            }
          } else {
            // Cambiar el estado del DayHour anterior a "1"
            if (
              this.previousDayHourId &&
              this.previousDayHourId !== this.appointment.dayHourId
            ) {
              this.dayHourService
                .updateDayHour(this.previousDayHourId, { state: 1 })
                .subscribe(
                  () => {
                    console.log('Estado del DayHour anterior actualizado a 1.');
                  },
                  (error) => {
                    console.error(
                      'Error al actualizar el estado del DayHour anterior:',
                      error
                    );
                  }
                );
            }

            // Cambiar el estado del nuevo DayHour a "2"
            this.dayHourService
              .updateDayHour(this.appointment.dayHourId, { state: 2 })
              .subscribe(
                () => {
                  console.log('Estado del nuevo DayHour actualizado a 2.');
                  Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Cita y DayHours actualizados exitosamente.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK',
                  });
                  this.router.navigate(['/appointment/lista']);
                },
                (error) => {
                  console.error(
                    'Error al actualizar el estado del nuevo DayHour:',
                    error
                  );
                }
              );
          }
          console.log('Estado del DayHour actualizado:', updateResponse);
          // Redirigir al listado de citas
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Cita actualizada exitosamente.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
          });
          this.router.navigate(['/appointment/lista']);
        },

        (error) => {
          console.error('Error al actualizar la cita:', error);
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text:
              'Error al actualizar la cita: ' +
              (error.error?.message || 'Error desconocido'),
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
