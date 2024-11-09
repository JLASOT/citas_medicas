import { Component, OnInit } from '@angular/core';
import { PatientService } from '../service/patient.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-patient-delete',
  templateUrl: './patient-delete.component.html',
  styleUrls: ['./patient-delete.component.css']
})
export class PatientDeleteComponent implements OnInit {
  patientId: number | undefined; // Para almacenar el ID del paciente
  patient: any; // Opcional: información del paciente, si deseas mostrarla antes de eliminar

  constructor(
    private patientService: PatientService,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Capturamos el ID del paciente desde los parámetros de la URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.patientId = Number(id);
      // Opcional: cargar los detalles del paciente si deseas mostrar la información antes de eliminar
      //this.loadPatientDetails();
    }
  }

  // Método para cargar los detalles del paciente (opcional)
  /* loadPatientDetails(): void {
    if (this.patientId) {
      this.patientService.getPatientDetails(this.patientId).subscribe(
        (response) => {
          this.patient = response;
        },
        (error) => {
          console.error('Error al cargar los detalles del paciente:', error);
        }
      );
    }
  } */

  deletePatient(): void {
    if (this.patientId) {
      if (confirm('¿Estás seguro de que deseas eliminar a este paciente?')) {
        this.patientService.deletePatient(this.patientId).subscribe(
          (response) => {
            console.log('Paciente eliminado exitosamente:', response);
            // Redirigir a la lista de pacientes después de eliminar
            this.router.navigate(['/patients/lista']);
          },
          (error) => {
            console.error('Error al eliminar el paciente:', error);
            alert('Error al eliminar el paciente');
          }
        );
      }
    }
  }
}
