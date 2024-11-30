import { Component, OnInit } from '@angular/core';
import { HourService } from '../service/hour.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hour-add',
  templateUrl: './hour-add.component.html',
  styleUrls: ['./hour-add.component.css']
})

export class HourAddComponent implements OnInit {

  hour: any = {
    name: '',
    
  };


  constructor(private hourService: HourService, private router: Router) {}

  ngOnInit() {
  }

  onSubmit(): void {
    this.hourService.registerHour(this.hour).subscribe(
      (response) => {
        console.log('Hora registrado exitosamente:', response);
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Hora registrado exitosamente.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
        this.router.navigate(['/hours/lista']);
      },
      (error) => {
        console.error('Error al registrar el dia:', error);
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Error al registrar la hora: ' + (error.error?.message || 'Error desconocido'),
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
      }
    );
  }
  
  

}