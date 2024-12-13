import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import { AuthService } from '../../auth/service/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../user/service/user.service';
import { AppointmentService } from '../service/appointment.service';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css'],
})
export class AppointmentListComponent implements OnInit {
  ngOnInit(): void {
    this.loadAppointment(); // Cargar la lista de pacientes al iniciar el componente
  }

  appointments: any[] = []; // Arreglo para almacenar los pacientes
  appointment: any = {}; // Objeto para almacenar el tutor individual en el formulario
  specialitie: any[] = []; // Arreglo para almacenar los pacientes
  loading: boolean = true; // Control de carga
  public authService: AuthService | undefined;

  constructor(
    private appointmentService: AppointmentService,
    authService: AuthService,
    private router: Router
  ) {
    this.authService = authService;
  }

  // Método para cargar la lista de pacientes desde el servicio
  loadAppointment() {
    this.appointmentService.listAppointment().subscribe(
      (response: any) => {
        console.log('Users recibidos:', response.appointments); // Verifica los pacientes dentro de 'tutor'
        this.appointments = response.appointments || []; // Asigna los pacientes correctamente desde 'response.tutor'
        /* this.appointments = response.appointments.map((appointment: any) => {
          // Convertir la fecha a un formato más legible
          appointment.dateAppointment = new Date(appointment.dateAppointment).toLocaleString('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            // hour: '2-digit',
            // minute: '2-digit',
          }); 
          return appointment;
        }); */

        // Modificar las citas para cambiar el formato de la fecha
      this.appointments = this.appointments.map((appointment: any) => {
        // Convierte la fecha al formato 'dd/mm/yyyy'
        if (appointment.dateAppointment) {
          const date = new Date(appointment.dateAppointment);
          date.setDate(date.getDate() + 1);
          appointment.dateAppointment = date.toLocaleDateString('es-PE'); // Formato 'dd/mm/yyyy'
        }
        return appointment;
      });
        this.loading = false; // Desactiva el indicador de carga
      },
      (error) => {
        console.error('Error al cargar los tutores:', error);
        this.loading = false; // Desactiva el indicador de carga en caso de error
      }
    );
  }

  deleteUser(id: number): void {
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
        this.appointmentService.deleteAppointment(id).subscribe(
          (response) => {
            console.log('Tutor eliminado exitosamente:', response);
            this.loadAppointment(); // Recarga la lista de usuarios desde el servidor
            // Eliminar el paciente de la lista en el frontend sin necesidad de recargar
            this.appointments = this.appointments.filter(
              (user) => this.appointment.id !== id
            );
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

// Método para obtener la etiqueta del estado de la cita
  getStateLabel(state: number): string {
    switch (state) {
      case 1:
        return 'Pendiente';
      case 2:
        return 'Completada';
      case 3:
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  }
// Método para obtener la severidad del estado de la cita
  getSeverity(state: number): string {
    switch (state) {
      case 1:
        return 'info';
      case 2:
        return 'success';
      case 3:
        return 'danger';
      default:
        return '';
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

  // Agregar título
  doc.setFontSize(18);
  doc.text('Lista de Citas Médicas', 14, 20); // Título centrado en la parte superior

  // Establecer estilo para la tabla
  const tableOptions = {
    startY: 30, // Comienza la tabla después del título
    head: [['Fecha', 'Estado', 'Paciente', 'Especialidad', 'Médico', 'Día y Hora']],
    body: this.appointments.map((appointment) => [
      appointment.dateAppointment,
      this.getStateLabel(appointment.stateAppointment),
      `${appointment.Patient.name} ${appointment.Patient.surname}`,
      appointment.Specialitie.name,
      `${appointment.User.name} ${appointment.User.surname}`,
      `${appointment.DayHour.Day.name} ${appointment.DayHour.Hour.name}`
    ]),
    styles: {
      fontSize: 10,
      cellPadding: 5,
      halign: 'center', // Centrado en las celdas
      valign: 'middle',
    },
    headStyles: {
      fillColor: [63, 81, 181], // Color de fondo de las cabeceras
      textColor: [255, 255, 255], // Color del texto de las cabeceras
      fontSize: 12,
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245], // Color de fondo alternativo para las filas
    },
    margin: { top: 30, bottom: 20 }, // Márgenes
  };

  // Generar la tabla con las opciones
  (doc as any).autoTable(tableOptions);

  // Guardar el archivo PDF
  doc.save('appointment.pdf');
}


  // Método para exportar la tabla a Excel
  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.appointment);
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
