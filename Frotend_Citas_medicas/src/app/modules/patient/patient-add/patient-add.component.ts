import { Component, OnInit } from '@angular/core';
import { PatientService } from '../service/patient.service';
import { Router } from '@angular/router';

interface BloodType {
  label: string;
  value: string;
}
interface GenderOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-patient-add',
  templateUrl: './patient-add.component.html',
  styleUrls: ['./patient-add.component.css'],
})
export class PatientAddComponent implements OnInit {
  genderOptions: GenderOption[] | undefined;
  blood_type: BloodType[] | undefined;

  patient: any = {
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


  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit() {
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
    ]
  }

  onSubmit(): void {
    // Verificar que el género sea un string
    if (typeof this.patient.gender !== 'string') {
      alert('Seleccione un género válido');
      return;
    }

    this.patientService.registerPatient(this.patient).subscribe(
      (response) => {
        console.log('Paciente registrado exitosamente:', response);
        this.router.navigate(['/patient/lista']);
      },
      (error) => {
        console.error('Error al registrar el paciente:', error);
        alert(
          'Error al registrar el paciente: ' + (error.error?.message || 'Error desconocido')
        );
      }
    );
  }
}
