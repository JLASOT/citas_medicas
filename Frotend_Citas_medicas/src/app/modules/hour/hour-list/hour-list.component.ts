import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { HourService } from '../service/hour.service';

import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-hour-list',
  templateUrl: './hour-list.component.html',
  styleUrls: ['./hour-list.component.css']
})


export class HourListComponent implements OnInit {

  
  hour: any[] = [];// Arreglo para almacenar los pacientes
  hours:any= {};
  selectedday: any = null; // Paciente seleccionado para ver detalles
  loading: boolean = true; // Control de carga
  public authService: AuthService | undefined;

  constructor(
    private hourService: HourService,
    authService: AuthService
  ) {
    this.authService = authService;
  }


  ngOnInit(): void {
    this.loadHour(); // Cargar la lista de dias al iniciar el componente
  }

  // Método para cargar la lista de horas desde el servicio
  loadHour() {
    this.hourService.listHour().subscribe(
      (response: any) => {
        console.log('Hora recibidos:', response.hours); // Verifica los pacientes dentro de 'day'
        this.hour = response.hours || [];// Asigna los pacientes correctamente desde 'response.day'
        this.loading = false; // Desactiva el indicador de carga
      },
      (error) => {
        console.error('Error al cargar las horas:', error);
        this.loading = false; // Desactiva el indicador de carga en caso de error
      }
    );
  }

  // Método para ver los detalles de un paciente



  deleteHour(id: number): void {
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
        this.hourService.deleteHour(id).subscribe(
          (response) => {
            console.log('Hora eliminado exitosamente:', response);
            // Eliminar el paciente de la lista en el frontend sin necesidad de recargar
            this.hour = this.hour.filter(
              (hour) => hour.id !== id
            );
            Swal.fire({
              title: '¡Eliminado!',
              text: 'La hora ha sido eliminado.',
              icon: 'success',
            });
          },
          (error) => {
            console.error('Error al eliminar lahora:', error);
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al eliminar la hora.',
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
      head: [
        [

          'Nombre',
          
        ],
      ],
      body: this.hour.map((hour) => [

        hour.name,
      ]),
    });
    doc.save('hour.pdf');
  }

  // Método para exportar la tabla a Excel
  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.hour);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'hour');
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