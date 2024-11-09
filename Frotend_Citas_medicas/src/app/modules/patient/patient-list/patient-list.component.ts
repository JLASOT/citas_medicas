import { Component, OnInit } from '@angular/core';
import { PatientService } from '../service/patient.service';
import { AuthService } from '../../auth/service/auth.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  patients: any[] = []; // Arreglo para almacenar los pacientes
  selectedPatient: any = null; // Paciente seleccionado para ver detalles
  loading: boolean = true; // Control de carga
  public authService: AuthService | undefined;

  constructor(private patientService: PatientService, authService: AuthService) {
    this.authService = authService;
  }

  ngOnInit(): void {
    this.loadPatients(); // Cargar la lista de pacientes al iniciar el componente
  }

  // Método para cargar la lista de pacientes desde el servicio
  loadPatients() {
    this.patientService.listPatients().subscribe(
      (response: any) => {
        console.log('Pacientes recibidos:', response.patient); // Verifica los pacientes dentro de 'patient'
        this.patients = response.patient || []; // Asigna los pacientes correctamente desde 'response.patient'
        this.loading = false; // Desactiva el indicador de carga
      },
      (error) => {
        console.error('Error al cargar los pacientes:', error);
        this.loading = false; // Desactiva el indicador de carga en caso de error
      }
    );
  }

  // Método para ver los detalles de un paciente
  viewPatientDetails(patient: any) {
    this.selectedPatient = patient; // Asigna el paciente seleccionado
  }

  // Método para eliminar un paciente
  deletePatient(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      this.patientService.deletePatient(id).subscribe(
        (response) => {
          console.log('Paciente eliminado exitosamente:', response);
          // Eliminar el paciente de la lista en el frontend sin necesidad de recargar
          this.patients = this.patients.filter(patient => patient.id !== id);
        },
        (error) => {
          console.error('Error al eliminar el paciente:', error);
          alert('Error al eliminar el paciente');
        }
      );
    }
  }
  onGlobalFilter(event: Event, dt: any) {
    const inputElement = event.target as HTMLInputElement;
    dt.filterGlobal(inputElement.value, 'contains');
  }

  isAdmin(): boolean { 
    return this.authService ? this.authService.isAdmin() : false; 
  }

  // Método para exportar la tabla a PDF
  exportPdf() {
    const doc = new jsPDF();
    (doc as any).autoTable({
      head: [
        [
          'CI',
          'Nombre',
          'Apellido',
          'Edad',
          'Email',
          'Teléfono',
          'Tipo de Sangre',
        ],
      ],
      body: this.patients.map((patient) => [
        patient.ci,
        patient.name,
        patient.surname,
        patient.edad,
        patient.email,
        patient.phone,
        patient.blood_type,
      ]),
    });
    doc.save('patients.pdf');
  }

// Método para exportar la tabla a Excel
exportExcel() {
  import('xlsx').then((xlsx) => {
    const worksheet = xlsx.utils.json_to_sheet(this.patients);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'patients');
  });
}

saveAsExcelFile(buffer: any, fileName: string): void {
  const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const EXCEL_EXTENSION = '.xlsx';
  const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
  FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
}
}
