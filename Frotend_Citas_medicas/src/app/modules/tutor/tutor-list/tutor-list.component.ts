import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { TutorService } from '../service/tutor.service';
import { Router } from '@angular/router';
import { PatientService } from '../../patient/service/patient.service';

@Component({
  selector: 'app-tutor-list',
  templateUrl: './tutor-list.component.html',
  styleUrls: ['./tutor-list.component.css'],
})
export class TutorListComponent implements OnInit {

  //modal
  tutorDialog: boolean = false;
  submitted: boolean = false;

  tutor: any[] = []; // Arreglo para almacenar los pacientes
  tutors: any = {}; // Objeto para almacenar el tutor individual en el formulario
  selectedSpecialitie: any = null; // tutor seleccionado para ver detalles
 
  //modal
  suggestions: any[] = [];  // Sugerencias del autocompletado

  loading: boolean = true; // Control de carga
  public authService: AuthService | undefined;

  //modal
  patients: any[] = []; // Arreglo para almacenar los pacientes  
  selectedItem: any = null; // Elemento seleccionado en el autocompletado

  constructor(
    private tutorService: TutorService,
    //modal
    private patientService: PatientService,
    authService: AuthService,
    private router: Router
  ) {
    this.authService = authService;
  }

  ngOnInit(): void {
    this.loadTutor(); // Cargar la lista de pacientes al iniciar el componente
    this.loadPatients();//modal
  }
  openNew() {
    this.tutors = {};
    this.submitted = false;
    this.selectedItem = null;  // Restablece el paciente seleccionado
    this.tutorDialog = true;
  }

  //modal
  hideDialog() {
    this.tutorDialog = false;
    this.submitted = false;
  }


  saveTutors() {
    this.submitted = true;
    if (this.selectedItem) {
      this.tutors.patientId = this.selectedItem.id; // Asignamos el patientId seleccionado
    }

    console.log('Datos de tutor a enviar:', this.tutors);
    this.tutorService.registerTutors(this.tutors).subscribe(
      (response) => {
        console.log('tutor registrado exitosamente:', response);
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'tutor registrado exitosamente.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
        this.tutorDialog = false;
        this.loadTutor();
        this.router.navigate(['/tutor/lista']);
      },
      (error) => {
        console.error('Error al registrar el tutor:', error);
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text:
            'Error al registrar el tutor: ' +
            (error.error?.message || 'Error desconocido'),
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
      }
    );
  }

  // Método para cargar la lista de pacientes desde el servicio
  loadTutor() {
    this.tutorService.listTutors().subscribe(
      (response: any) => {
        console.log('Tutores recibidos:', response.tutor); // Verifica los pacientes dentro de 'tutor'
        this.tutor = response.tutor || []; // Asigna los pacientes correctamente desde 'response.tutor'
        this.loading = false; // Desactiva el indicador de carga
      },
      (error) => {
        console.error('Error al cargar los tutores:', error);
        this.loading = false; // Desactiva el indicador de carga en caso de error
      }
    );
  }


  //modal
  // Método para cargar la lista de pacientes desde el servicio 
  loadPatients() {
    this.patientService.listPatients().subscribe(
      (response: any) => {
        console.log('Pacientes recibidos:', response.patient); // Verifica los pacientes dentro de 'patient'
        this.patients = response.patient || []; // Asigna los pacientes correctamente desde 'response.patient'
        this.loading = false; // Desactiva el indicador de carga
        this.patients.forEach(patient => {
          patient.fullName = `${patient.name} ${patient.surname}`;  // Combinamos name y surname
        });
      },
      (error) => {
        console.error('Error al cargar los pacientes:', error);
        this.loading = false; // Desactiva el indicador de carga en caso de error
      }
    );
  }

  //modal
 // Método para manejar la búsqueda y filtrar los pacientes
 search(event: any) {
  const query = event.query.toLowerCase();
  // Filtra los pacientes por nombre o apellido
  this.suggestions = this.patients.filter(patient =>
    patient.fullName.toLowerCase().includes(query)
  );
}


  // Método para ver los detalles de un paciente
  viewSpecialitieDetails(tutor: any) {
    this.selectedSpecialitie = tutor; // Asigna el paciente seleccionado
  }

  deleteTutors(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡elimínalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tutorService.deleteTutors(id).subscribe(
          (response) => {
            console.log('Tutor eliminado exitosamente:', response);
            // Eliminar el paciente de la lista en el frontend sin necesidad de recargar
            this.tutor = this.tutor.filter((tutor) => tutor.id !== id);
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El paciente ha sido eliminado.',
              icon: 'success',
            });
          },
          (error) => {
            console.error('Error al eliminar el paciente:', error);
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al eliminar el paciente.',
              icon: 'error',
            });
          }
        );
      }
    });
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
      head: [['Nombre', 'Descripcion']],
      body: this.tutor.map((tutor) => [tutor.name, tutor.description]),
    });
    doc.save('tutor.pdf');
  }

  // Método para exportar la tabla a Excel
  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.tutor);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'tutor');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
}
