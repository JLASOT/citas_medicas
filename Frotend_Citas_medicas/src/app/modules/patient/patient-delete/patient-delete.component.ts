import { Component, OnInit } from '@angular/core';
import { PatientService } from '../service/patient.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-patient-delete',
  templateUrl: './patient-delete.component.html',
  styleUrls: ['./patient-delete.component.css']
})
export class PatientDeleteComponent implements OnInit {
  patientId: number | undefined; // Para almacenar el ID del paciente

  constructor(
    private patientService: PatientService,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Capturamos el ID del paciente desde los parámetros de la URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const parsedId = Number(id);  // Convertimos a número
      if (!isNaN(parsedId)) { // Verificamos si se convirtió correctamente a número
        this.patientId = parsedId;
      } else {
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'ID del paciente no válido.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          this.router.navigate(['/patients/lista']);
        });
      }
    } else {
      // Si no se encuentra el ID en la URL
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'No se ha encontrado el ID del paciente.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      }).then(() => {
        this.router.navigate(['/patients/lista']);
      });
    }
  }

  deletePatient(): void {
    // Verificar si patientId es un número válido y no undefined
    if (this.patientId === undefined || isNaN(this.patientId)) {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'No se ha encontrado el paciente. Inténtalo nuevamente.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
      return; // Si no es válido, terminamos la ejecución de la función
    }
  
    // Mostrar la alerta personalizada antes de proceder con la eliminación
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Una vez eliminado, no podrás recuperar los datos de este paciente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      customClass: {
        popup: 'custom-popup',  // Aplica el estilo personalizado a la ventana de alerta
        confirmButton: 'custom-confirm-button',  // Aplica el estilo personalizado al botón de confirmar
        cancelButton: 'custom-cancel-button',  // Aplica el estilo personalizado al botón de cancelar
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamar al servicio para eliminar el paciente
        this.patientService.deletePatient(this.patientId!).subscribe(
          (response) => {
            console.log('Paciente eliminado exitosamente:', response);
            Swal.fire(
              '¡Eliminado!',
              'El paciente ha sido eliminado exitosamente.',
              'success'
            );
            // Redirigir a la lista de pacientes después de eliminar
            this.router.navigate(['/patients/lista']);
          },
          (error) => {
            console.error('Error al eliminar el paciente:', error);
            Swal.fire(
              'Error',
              'No se pudo eliminar al paciente. Inténtalo nuevamente.',
              'error'
            );
          }
        );
      }
    });


  }





}
