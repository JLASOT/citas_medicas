import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DayHourService } from '../service/day-hour.service';
import Swal from 'sweetalert2';
import { DayService } from '../../day/service/day.service';
import { HourService } from '../../hour/service/hour.service';
import { UserService } from '../../user/service/user.service';



@Component({
  selector: 'app-day-hour-edit',
  templateUrl: './day-hour-edit.component.html',
  styleUrls: ['./day-hour-edit.component.css']
})
export class DayHourEditComponent implements OnInit{

    
  days: any[] = []; // Añadir array para almacenar las especialidades
  selectedDay: any = null; // Añadir variable para la especialidad seleccionada

  hours: any[] = []; // Añadir array para almacenar las especialidades
  selectedHour: any = null; // Añadir variable para la especialidad seleccionada

  suggestions: any[] = []; // Sugerencias del autocompletado
  users: any[] = []; // Arreglo para almacenar los pacientes
  selectedItem: any = null; // Elemento seleccionado en el autocompletado


  

  loading: boolean = true; // Control de carga
  submitted: boolean = false;

  errorMessage: string = '';

  dayHour: any = {
    dayId: '',
    hourId: '',
    userId: '',
  };

  constructor(
    private dayHourService: DayHourService,
    //para editar
    private router: Router,
    private dayService: DayService, // Añadir SpecialitieService al constructor
    private hourService: HourService, // Añadir SpecialitieService al constructor
    private userService: UserService,
    //para editar
   private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Implementar ngOnInit para cargar las especialidades
    this.loadDays();
    this.loadHours();
    this.loadUsers();
    //para editar
    const dayHourd = this.route.snapshot.paramMap.get('id');
    if (dayHourd) {
      console.log('ID de la dia hora:', dayHourd);
      this.getDayHourData(dayHourd);
    }
  }



  // Obtener los datos del paciente usando el ID para editar
  getDayHourData(id: string): void {
    this.dayHourService.getDayHourById(id).subscribe(
      (data) => {
        console.log('Datos del dia y hora:', data);
        this.dayHour = data.dayHour;
        this.selectedDay = data.dayHour.Day;
        this.selectedHour = data.dayHour.Hour;
        // this.selectedItem = data.dayHour.User
        //para poder mostrar el nombre del docotor asociado al dayhour
        this.selectedItem = {
          ...data.dayHour.User,
          fullName: `${data.dayHour.User.name} ${data.dayHour.User.surname}`
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
        console.log('users recibidos:', response.users); // Verifica los pacientes dentro de 'patient'
        this.users = response.users || []; // Asigna los pacientes correctamente desde 'response.patient'
        this.loading = false; // Desactiva el indicador de carga
        this.users.forEach((user) => {
          user.fullName = `${user.name} ${user.surname}`; // Combinamos name y surname
        });
      },
      (error) => {
        console.error('Error al cargar los pacientes:', error);
        this.loading = false; // Desactiva el indicador de carga en caso de error
      }
    );
  }

  search(event: any) {
    const query = event.query.toLowerCase();
    this.suggestions = this.users.filter((user) =>
      user.fullName.toLowerCase().includes(query)
    );
    console.log('Sugerencias filtradas:', this.suggestions);
    // Verificación de la estructura
    this.suggestions.forEach((suggestion) => {
      if (!suggestion.id) {
        console.error('Falta el id en la sugerencia:', suggestion);
      } else {
        console.log('Sugerencia correcta con id:', suggestion);
      }
    });
  }

  onSelectUser(event: any): void {
    this.selectedItem = event.value; // Asigna el elemento seleccionado
    this.dayHour.userId = this.selectedItem.id;
    console.log('Usuario seleccionado:', this.selectedItem); // Muestra en la consola el usuario seleccionado
  }

  loadDays(): void {
    this.dayService.listDay().subscribe(
      (data) => {
        this.days = data.days; // Asignar las especialidades al array
        console.log('dias cargadas:', data.days); // Añadir este log
      },
      (error) => {
        console.error('Error al cargar lis dias:', error);
      }
    );
  }

  loadHours(): void {
    this.hourService.listHour().subscribe(
      (data) => {
        this.hours = data.hours; // Asignar las especialidades al array
        console.log('horas cargadas:', data.hours); // Añadir este log
      },
      (error) => {
        console.error('Error al cargar lis dias:', error);
      }
    );
  }

  onSubmit(): void {
    this.dayHour.dayId = this.selectedDay?.id || '';
    this.dayHour.hourId = this.selectedHour?.id || '';
    console.log('Datos del día-hora a modificar:', this.dayHour);
    //para editar pasar tambien la id del objeto
    this.dayHourService.updateDayHour(this.dayHour.id,this.dayHour).subscribe(
      (response) => {
        console.log('Paciente registrado exitosamente:', response);
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'dayhour actualizado exitosamente.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
        this.router.navigate(['/dayhour/lista']);
      },
      (error) => {
        console.error('Error al registrar la dayhour:', error);
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: error.message || 'Error desconocido',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      }
    );
  }

}
