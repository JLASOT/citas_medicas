import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SpecialitieService } from '../../specialitie/service/specialitie.service';

interface Rol {
  label: string;
  value: string;
}

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css'],
})
export class UserAddComponent implements OnInit {
  specialities: any[] = []; // Añadir array para almacenar las especialidades
  selectedSpeciality: any; // Añadir variable para la especialidad seleccionada
  role: Rol[] | undefined;

  isDoctor: boolean = false; // Controla la visibilidad de los campos de fecha
 

  constructor(
    private userService: UserService,
    private router: Router,
    private specialitieService: SpecialitieService // Añadir SpecialitieService al constructor
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


  // Cambiar visibilidad de los campos según el rol seleccionado
  onRoleChange(role: string): void {
    this.isDoctor = role === 'medico';
  }



  ngOnInit(): void {
    // Implementar ngOnInit para cargar las especialidades
    this.loadSpecialities();
    this.role = [
      { label: 'Administrador', value: 'admin' },
      { label: 'Enfermera', value: 'enfermera' },
      { label: 'medico', value: 'medico' },
    ];
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


  submitted: boolean = false;

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

      // Verificar el rol del usuario
  if (this.user.rol !== 'medico') {
    // Si no es "medico", establecer las fechas como null
    this.user.fechaIni = null;
    this.user.fechaFin = null;
  }

    console.log('Especialidad seleccionada:', this.selectedSpeciality);
    console.log('Datos del usuario a registrar:', this.user);
    if (this.selectedSpeciality) {
      this.user.specialitieId = Number(this.selectedSpeciality.id);//convierte el input a numro entero
     }

    this.userService.registerUser(this.user).subscribe(
      (response) => {
        console.log('Paciente registrado exitosamente:', response);
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Paciente registrado exitosamente.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
        this.router.navigate(['/user/lista']);
      },
      (error) => {
        console.error('Error al registrar la especialidad:', error);
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text:
            'Error al registrar la especialidad: ' +
            (error.error?.message || 'Error desconocido'),
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      }
    );
  }
}
