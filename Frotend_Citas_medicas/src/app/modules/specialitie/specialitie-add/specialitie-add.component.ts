import { Component, OnInit } from '@angular/core';
import { SpecialitieService } from '../service/specialitie.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-specialitie-add',
  templateUrl: './specialitie-add.component.html',
  styleUrls: ['./specialitie-add.component.css']
})
export class SpecialitieAddComponent implements OnInit {

  specialitie: any = {
    name: '',
    price:'',
    description: '',
  };


  constructor(private specialitieService: SpecialitieService, private router: Router) {}

  ngOnInit() {
  }

  onSubmit(): void {
    this.specialitieService.registerSpecialitie(this.specialitie).subscribe(
      (response) => {
        console.log('Paciente registrado exitosamente:', response);
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Paciente registrado exitosamente.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
        this.router.navigate(['/specialitie/lista']);
      },
      (error) => {
        console.error('Error al registrar la especialidad:', error);
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Error al registrar la especialidad: ' + (error.error?.message || 'Error desconocido'),
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
      }
    );
  }
  
  

}
