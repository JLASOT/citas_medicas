import { Component, OnInit } from '@angular/core';
import { DayService } from '../service/day.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-day-edit',
  templateUrl: './day-edit.component.html',
  styleUrls: ['./day-edit.component.css']
})


export class DayEditComponent implements OnInit {

    
  day: any = {
    name: '',
    
  };

  constructor(
    private dayService: DayService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    const dayId = this.route.snapshot.paramMap.get('id');
    if (dayId) {
      console.log('ID de la dia:', dayId);
      this.getDayData(dayId);
    }
  }

   // Obtener los datos del paciente usando el ID
   getDayData(id: string): void {
    this.dayService.getDayById(id).subscribe(
      (data) => {
        console.log('Datos del dia:', data);
        this.day = data.day;
      },
      (error) => {
        console.error('Error al obtener los datos del dia:', error);
        alert('No se pudo obtener los datos del dia.');
      }
    );
  }
  onSubmit(): void {

    if (this.day.id) {
      this.dayService.updateDay(this.day.id, this.day).subscribe(
        (response) => {
          console.log('Dia actualizado exitosamente:', response);
          
          // Mostrar alerta de éxito con SweetAlert2
          Swal.fire({
            icon: 'success',
            title: 'Dia actualizado!',
            text: 'Los datos del dia se han actualizado exitosamente.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#3085d6',
          });

          this.router.navigate(['/days/lista']);
        },
        (error) => {
          console.error('Error al actualizar el dia:', error);
          
          // Mostrar alerta de error con SweetAlert2
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el dia. Inténtalo nuevamente.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#d33',
          });
        }
      );
    } else {
      alert('ID del dia no encontrado.');
    }
  }

}
