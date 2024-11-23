import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SpecialitieService } from '../../specialitie/service/specialitie.service';

interface Rol {
  label: string;
  value: string;
}

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  role: Rol[] | undefined;
  specialities: any[] = []; // Añadir array para almacenar las especialidades
  selectedSpeciality: any; // Añadir variable para la especialidad seleccionada

  constructor(private userService: UserService, private router: Router,private route: ActivatedRoute
    , private specialitieService: SpecialitieService // Añadir SpecialitieService al constructor
  ) {}

  user: any = {
    name: '',
    surname: '',
    rol: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    specilitieId: '',
  };
  submitted: boolean = false;

  ngOnInit(): void {
    this.loadSpecialities();

    this.role = [
      { label: 'Administrador', value: 'admin' },
      { label: 'Enfermera', value: 'enfermera' },
      { label: 'Doctor', value: 'doctor' },
    ]
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      console.log('ID de la especialidiad:', userId);
      this.getSpecialitieData(userId);
    }
  }

   // Obtener los datos del paciente usando el ID
   getSpecialitieData(id: string): void {
    this.userService.getTutorById(id).subscribe(
      (data) => {
        console.log('Datos del paciente:', data);
        this.user = data.users;

        // Una vez que los datos del usuario estén cargados, asignar la especialidad seleccionada 
        if (this.specialities.length > 0) { 
          this.selectedSpeciality = this.specialities.find(s => s.id === this.user.specialitieId

          ); 
        }
      },
      (error) => {
        console.error('Error al obtener los datos del paciente:', error);
        alert('No se pudo obtener los datos del paciente.');
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
    if (this.selectedSpeciality) {
      this.user.specialitieId = Number(this.selectedSpeciality.id);//convierte el input a numro entero
     }

    if (this.user.id) {
      this.userService.updateUser(this.user.id, this.user).subscribe(
        (response) => {
          console.log('Especialidad actualizado exitosamente:', response);
          
          // Mostrar alerta de éxito con SweetAlert2
          Swal.fire({
            icon: 'success',
            title: '¡Especialidad actualizado!',
            text: 'Los datos de la Especialidad se han actualizado exitosamente.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#3085d6',
          });

          this.router.navigate(['/user/lista']);
        },
        (error) => {
          console.error('Error al actualizar la especialidad:', error);
          
          // Mostrar alerta de error con SweetAlert2
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar la especialidad. Inténtalo nuevamente.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#d33',
          });
        }
      );
    } else {
      alert('ID de la especialidad no encontrado.');
    }
  }


}
