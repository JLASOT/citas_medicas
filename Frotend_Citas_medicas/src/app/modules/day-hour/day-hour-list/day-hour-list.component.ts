import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { DayHourService } from '../service/day-hour.service';
import Swal from 'sweetalert2';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-day-hour-list',
  templateUrl: './day-hour-list.component.html',
  styleUrls: ['./day-hour-list.component.css'],
})
export class DayHourListComponent implements OnInit {

  //modal
  tutorDialog: boolean = false;
  submitted: boolean = false;

  dayHour: any[] = []; // Arreglo para almacenar los pacientes
  dayHours: any = {};
  selectedday: any = null; // Paciente seleccionado para ver detalles
  loading: boolean = true; // Control de carga
  public authService: AuthService | undefined;


    selectedItem: any = null; // Elemento seleccionado en el autocompletado

  constructor(
    private dayHourService: DayHourService,
    authService: AuthService,
    //modal

  ) {
    this.authService = authService;
  }

  ngOnInit(): void {
    this.loadDayHour(); // Cargar la lista de dias al iniciar el componente
  }

  // Método para cargar la lista de pacientes desde el servicio
  loadDayHour() {
    this.dayHourService.listDayHour().subscribe(
      (response: any) => {
        console.log('Dias recibidos:', response.dayHours); // Verifica los pacientes dentro de 'day'
        this.dayHour = response.dayHours || []; // Asigna los pacientes correctamente desde 'response.day'
        this.loading = false; // Desactiva el indicador de carga
      },
      (error) => {
        console.error('Error al cargar los dias:', error);
        this.loading = false; // Desactiva el indicador de carga en caso de error
      }
    );
  }

  // Método para ver los detalles de un paciente

  deleteDay(id: number): void {
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
        this.dayHourService.deleteDayHour(id).subscribe(
          (response) => {
            console.log('Dia eliminado exitosamente:', response);
            // Eliminar el paciente de la lista en el frontend sin necesidad de recargar
            this.dayHour = this.dayHour.filter((dayHour) => dayHour.id !== id);
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El Dia ha sido eliminado.',
              icon: 'success',
            });
          },
          (error) => {
            console.error('Error al eliminar el Dia:', error);
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al eliminar el dia.',
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
/*   exportPdf() {
    const doc = new jsPDF();
    (doc as any).autoTable({
      head: [['Medico','Dia','Horario']],
      body: this.dayHour.map((dayHour) => [ 
        dayHour.User ? `${dayHour.User.name} ${dayHour.User.surname}` : 'Sin médico',
        dayHour.Day ? dayHour.Day.name  : 'Sin dia',
        dayHour.Hour ? dayHour.Hour.name  : 'Sin horas',
      ]),
    });
    doc.save('day.pdf');
  } */

    // Método para exportar la tabla a PDF
    exportPdf() {
      const doc = new jsPDF();
      // Añadir un título al
      doc.setFontSize(18);
      doc.text('Lista de Horatio Medicos', 14, 22);
  
      // Añadir la fecha actual al PDF
      const date = new Date();
      doc.setFontSize(11);
      doc.text(`Fecha: ${date.toLocaleDateString()}`, 14, 32);
  
      (doc as any).autoTable({
        head: [['Medico','Dia','Horario']],
      body: this.dayHour.map((dayHour) => [ 
        dayHour.User ? `${dayHour.User.name} ${dayHour.User.surname}` : 'Sin médico',
        dayHour.Day ? dayHour.Day.name  : 'Sin dia',
        dayHour.Hour ? dayHour.Hour.name  : 'Sin horas',
      ]),
        startY: 40, // Posición donde empezará la tabla
        theme: 'striped', // Tema de la tabla
        headStyles: { fillColor: [22, 160, 133] },
        // Color del encabezado
        styles: { fontSize: 10, cellPadding: 3 }, // Estilo de las celdas
        alternateRowStyles: { fillColor: [240, 240, 240] }, // Color de las filas alternadas
      });
  
      doc.save('Horario_Medicos.pdf');
    }

    printPdf() {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Lista de Horario Medico', 14, 22);
        const date = new Date();
        doc.setFontSize(11);
        doc.text(`Fecha: ${date.toLocaleDateString()}`, 14, 32);
        const options = {
          head: [['Medico','Dia','Horario']],
          body: this.dayHour.map((dayHour) => [ 
            dayHour.User ? `${dayHour.User.name} ${dayHour.User.surname}` : 'Sin médico',
            dayHour.Day ? dayHour.Day.name  : 'Sin dia',
            dayHour.Hour ? dayHour.Hour.name  : 'Sin horas',
          ]),
          startY: 40,
          theme: 'striped',
          headStyles: { fillColor: [22, 160, 133] },
          styles: { fontSize: 10, cellPadding: 3 },
          alternateRowStyles: { fillColor: [240, 240, 240] },
        };
        (doc as any).autoTable(options);
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
      }
    

  // Método para exportar la tabla a Excel
  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.dayHour);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'day');
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
