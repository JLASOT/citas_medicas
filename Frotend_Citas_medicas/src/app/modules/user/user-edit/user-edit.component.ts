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
  isDoctor: boolean = false; // Controla la visibilidad de los campos de fecha

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
    fechaIni:new Date(),
    fechaFin:new Date(),
    specilitieId: '',
  };

  
  
  submitted: boolean = false;

  ngOnInit(): void {
    this.loadSpecialities();

    this.role = [
      { label: 'Administrador', value: 'admin' },
      { label: 'Enfermera', value: 'enfermera' },
      { label: 'Medico', value: 'medico' },
    ]
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      console.log('ID de la especialidiad:', userId);
      this.getUserData(userId);
    }
  }

    // Cambiar visibilidad de los campos según el rol seleccionado
    onRoleChange(role: string): void {
      this.isDoctor = role === 'medico';
    }

   // Obtener los datos del paciente usando el ID
   getUserData(id: string): void {
    this.userService.getTutorById(id).subscribe(
      (data) => {
        console.log('Datos del paciente:', data);
        this.user = data.users;

         // Convertir fechas para que sean objetos Date
      this.user.fechaIni = data.users.fechaIni ? new Date(data.users.fechaIni) : null;
      this.user.fechaFin = data.users.fechaFin ? new Date(data.users.fechaFin) : null;
      
      //para poder aumenntar un dia al desface q existe el traer la fechafin del usuario
      this.user.fechaIni.setDate(this.user.fechaIni.getDate() + 1);
      this.user.fechaFin.setDate(this.user.fechaFin.getDate() + 1);

       // Actualizar la propiedad isDoctor
       this.isDoctor = this.user.rol === 'medico';
       console.log('Es médico:', this.isDoctor);

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.user.email)) {
      console.error('Email no válido');
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Por favor, ingresa un correo electrónico válido.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
      return;
    }


    console.log('Datos del usuario a registrar:', this.user);
    if (this.selectedSpeciality) {
      this.user.specialitieId = Number(this.selectedSpeciality.id);//convierte el input a numro entero
     }

     console.log('Fecha Inicial:', this.user.fechaIni);
console.log('Fecha Final:', this.user.fechaFin);

this.user.fechaIni = this.user.fechaIni.toISOString();
this.user.fechaFin = this.user.fechaFin.toISOString();


    if (this.user.id) {
      this.userService.updateUser(this.user.id, this.user).subscribe(
        (response) => {
          console.log('usuario actualizado exitosamente:', response);
          
          // Mostrar alerta de éxito con SweetAlert2
          Swal.fire({
            icon: 'success',
            title: '¡Especialidad actualizado!',
            text: 'Los datos del usuario se han actualizado exitosamente.',
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
