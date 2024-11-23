import { Component, OnInit } from '@angular/core';
import { DayService } from '../service/day.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-day-add',
  templateUrl: './day-add.component.html',
  styleUrls: ['./day-add.component.css']
})



export class DayAddComponent implements OnInit {

  day: any = {
    name: '',
    
  };


  constructor(private dayService: DayService, private router: Router) {}

  ngOnInit() {
  }

  onSubmit(): void {
    this.dayService.registerDay(this.day).subscribe(
      (response) => {
        console.log('Paciente registrado exitosamente:', response);
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Dia registrado exitosamente.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
        this.router.navigate(['/days/lista']);
      },
      (error) => {
        console.error('Error al registrar el dia:', error);
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Error al registrar el dia: ' + (error.error?.message || 'Error desconocido'),
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
      }
    );
  }
  
  

}