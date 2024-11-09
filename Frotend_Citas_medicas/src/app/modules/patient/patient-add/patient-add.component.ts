import { Component, OnInit } from '@angular/core';
import { PatientService } from '../service/patient.service';
import { Route, Router } from '@angular/router';

interface blood_type {
  name: string;
  value: string;
}

@Component({
  selector: 'app-patient-add',
  templateUrl: './patient-add.component.html',
  styleUrls: ['./patient-add.component.css'],
})
export class PatientAddComponent implements OnInit {
  //blood_type: blood_type[] | undefined;

  patient: any = {
    name: '',
    surname: '',
    ci: '',
    email: '',
    phone: '',
    blood_type: '',
    edad: null, // Agregar estos campos
    temperature: null,
    talla: null,
    peso: null,
    fc: null,
    fr: null,
    pa: null,
    gender: '',
  };

  blood_type: blood_type[] = [
    { name: 'A+', value: 'A+' },
    { name: 'A-', value: 'A-' },
    { name: 'B+', value: 'B+' },
    { name: 'B-', value: 'B-' },
    { name: 'AB+', value: 'AB+' },
    { name: 'AB-', value: 'AB-' },
    { name: 'O+', value: 'O+' },
    { name: 'O-', value: 'O-' },
  ];

  ngOnInit() {}
  constructor(private patientService: PatientService, private router: Router) {}
  onBloodTypeChange(event: any): void {
    this.patient.blood_type = event.value.value;// Asegúrate de que sea un string 
    console.log('Selected blood type:', this.patient.blood_type); 
  }
  
  onSubmit(): void {
    this.patientService.registerPatient(this.patient).subscribe(
      (response) => {
        console.log('Paciente registrado exitosamente:', response);
        // Redirigir al listado de pacientes o mostrar un mensaje de éxito
        this.router.navigate(['/patient/lista']);
      },
      (error) => {
        console.error('Error al registrar el paciente:', error);
        alert(
          'Error al registrar el paciente: ' + error.error.message ||
            'Error desconocido'
        );
      }
    );
  }
}
