import { Component, OnInit } from '@angular/core';
import { HourService } from '../service/hour.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hour-edit',
  templateUrl: './hour-edit.component.html',
  styleUrls: ['./hour-edit.component.css']
})


export class HourEditComponent implements OnInit {

    
  hour: any = {
    name: '',
    
  };

  constructor(
    private hourService: HourService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    const hourId = this.route.snapshot.paramMap.get('id');
    if (hourId) {
      console.log('ID de la hora:', hourId);
      this.getHourData(hourId);
    }
  }

   // Obtener los datos del paciente usando el ID
   getHourData(id: string): void {
    this.hourService.getHourById(id).subscribe(
      (data) => {
        console.log('Datos de la hora:', data);
        this.hour = data.hour;
      },
      (error) => {
        console.error('Error al obtener los datos de la hora:', error);
        alert('No se pudo obtener los datos de la hora.');
      }
    );
  }
  onSubmit(): void {

    if (this.hour.id) {
      this.hourService.updateHour(this.hour.id, this.hour).subscribe(
        (response) => {
          console.log('Hora actualizado exitosamente:', response);
          
          // Mostrar alerta de éxito con SweetAlert2
          Swal.fire({
            icon: 'success',
            title: 'Dia actualizado!',
            text: 'Los datos de la hora se han actualizado exitosamente.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#3085d6',
          });

          this.router.navigate(['/hours/lista']);
        },
        (error) => {
          console.error('Error al actualizar la hora:', error);
          
          // Mostrar alerta de error con SweetAlert2
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar la hora. Inténtalo nuevamente.',
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
