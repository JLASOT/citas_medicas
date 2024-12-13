import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpecialitieService } from '../service/specialitie.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-specialitie-edit',
  templateUrl: './specialitie-edit.component.html',
  styleUrls: ['./specialitie-edit.component.css']
})
export class SpecialitieEditComponent implements OnInit {

    
  specialitie: any = {
    name: '',
    price:'',
    description: '',
  };

  constructor(
    private specialitieService: SpecialitieService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    const specialitieId = this.route.snapshot.paramMap.get('id');
    if (specialitieId) {
      console.log('ID de la especialidiad:', specialitieId);
      this.getSpecialitieData(specialitieId);
    }
  }

   // Obtener los datos del paciente usando el ID
   getSpecialitieData(id: string): void {
    this.specialitieService.getSpecialitieById(id).subscribe(
      (data) => {
        console.log('Datos del paciente:', data);
        this.specialitie = data.specialitie;
      },
      (error) => {
        console.error('Error al obtener los datos del paciente:', error);
        alert('No se pudo obtener los datos del paciente.');
      }
    );
  }
  onSubmit(): void {

    if (this.specialitie.id) {
      this.specialitieService.updateSpecialitie(this.specialitie.id, this.specialitie).subscribe(
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

          this.router.navigate(['/specialitie/lista']);
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
