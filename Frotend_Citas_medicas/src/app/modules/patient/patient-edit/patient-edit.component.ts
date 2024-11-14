import { Component, OnInit } from '@angular/core';
import { PatientService } from '../service/patient.service';
import { Router, ActivatedRoute } from '@angular/router';

interface BloodType {
  label: string;
  value: string;
}

interface GenderOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-patient-edit',
  templateUrl: './patient-edit.component.html',
  styleUrls: ['./patient-edit.component.css'],
})
export class PatientEditComponent implements OnInit {
  genderOptions: GenderOption[] | undefined;
  blood_type: BloodType[] | undefined;

  patient: any = {
    id: null,
    name: '',
    surname: '',
    ci: '',
    email: '',
    phone: '',
    blood_type: '',
    edad: null,
    temperature: null,
    talla: null,
    peso: null,
    fc: null,
    fr: null,
    pa: null,
    gender: '',
  };

  constructor(
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Inicialización de las opciones
    this.genderOptions = [
      { label: 'Masculino', value: 'M' },
      { label: 'Femenino', value: 'F' },
    ];
    this.blood_type = [
      { label: 'A+', value: 'A+' },
      { label: 'A-', value: 'A-' },
      { label: 'B+', value: 'B+' },
      { label: 'B-', value: 'B-' },
      { label: 'AB+', value: 'AB+' },
      { label: 'AB-', value: 'AB-' },
      { label: 'O+', value: 'O+' },
      { label: 'O-', value: 'O-' },
    ];

    // Obtener el ID del paciente desde la URL
    const patientId = this.route.snapshot.paramMap.get('id');
    if (patientId) {
      console.log('ID del paciente:', patientId);
      this.getPatientData(patientId);
    }
  }

  

  // Obtener los datos del paciente usando el ID
  getPatientData(id: string): void {
    this.patientService.getPatientById(id).subscribe(
      (data) => {
        console.log('Datos del paciente:', data);
        this.patient = data.patient;
      },
      (error) => {
        console.error('Error al obtener los datos del paciente:', error);
        alert('No se pudo obtener los datos del paciente.');
      }
    );
  }

  // Enviar la solicitud para actualizar el paciente
  onSubmit(): void {
    // Verificar que el género sea un string
    if (typeof this.patient.gender !== 'string') {
      alert('Seleccione un género válido');
      return;
    }

    // Actualizar los datos del paciente
    if (this.patient.id) {
      this.patientService.updatePatient(this.patient.id, this.patient).subscribe(
        (response) => {
          console.log('Paciente actualizado exitosamente:', response);
          this.router.navigate(['/patient/lista']);
        },
        (error) => {
          console.error('Error al actualizar el paciente:', error);
          alert('Error al actualizar el paciente.');
        }
      );
    } else {
      alert('ID del paciente no encontrado.');
    }
  }
}
