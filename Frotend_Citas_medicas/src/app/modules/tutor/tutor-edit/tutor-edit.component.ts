import { Component, OnInit } from '@angular/core';
import { TutorService } from '../service/tutor.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PatientService } from '../../patient/service/patient.service';

@Component({
  selector: 'app-tutor-edit',
  templateUrl: './tutor-edit.component.html',
  styleUrls: ['./tutor-edit.component.css']
})
export class TutorEditComponent implements OnInit {

  tutor: any = {
    name: '',
    surname: '',
    ci: '',
    email: '',
    phone: '',
    relationship: '',
    patientId: '',
  };

  patients: any[] = []; // Lista de pacientes
  loading: boolean = true; // Control de carga

  constructor(
    private tutorService: TutorService,
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const tutorId = this.route.snapshot.paramMap.get('id');
    if (tutorId) {
      console.log('ID del tutor:', tutorId);
      this.getTutorData(tutorId);  // Obtener datos del tutor para editar
    }
    this.loadPatients();  // Cargar pacientes para el select
  }

  // Obtener los datos del tutor usando el ID
  getTutorData(id: string): void {
    this.tutorService.getTutorById(id).subscribe(
      (data) => {
        console.log('Datos del tutor:', data);
        this.tutor = data.tutor;
      },
      (error) => {
        console.error('Error al obtener los datos del tutor:', error);
        alert('No se pudo obtener los datos del tutor.');
      }
    );
  }

  // Cargar lista de pacientes
  loadPatients() {
    this.patientService.listPatients().subscribe(
      (response: any) => {
        console.log('Pacientes recibidos:', response.patient);
        this.patients = response.patient || [];
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar los pacientes:', error);
        this.loading = false;
      }
    );
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    // Verifica si se seleccionó un paciente
    if (this.tutor.patientId) {
      console.log('Nuevo patientId asignado:', this.tutor.patientId);
      console.log('Datos enviados al backend:', this.tutor);

      this.tutorService.updateTutor(this.tutor.id, this.tutor).subscribe(
        (response) => {
          console.log('Tutor actualizado exitosamente:', response);

          // Mostrar alerta de éxito con SweetAlert2
          Swal.fire({
            icon: 'success',
            title: '¡Tutor actualizado!',
            text: 'Los datos del tutor se han actualizado exitosamente.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#3085d6',
          });

          // Redirigir a la lista de tutores
          this.router.navigate(['/tutor/lista']);
        },
        (error) => {
          console.error('Error al actualizar el tutor:', error);

          // Mostrar alerta de error con SweetAlert2
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el tutor. Inténtalo nuevamente.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#d33',
          });
        }
      );
    } else {
      alert('Debe seleccionar un paciente.');
    }
  }
}
