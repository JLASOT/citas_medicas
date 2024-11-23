import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { DayService } from '../service/day.service';

import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-day-list',
  templateUrl: './day-list.component.html',
  styleUrls: ['./day-list.component.css']
})


export class DayListComponent implements OnInit {

  
  day: any[] = []; // Arreglo para almacenar los pacientes
  days:any= {};
  selectedday: any = null; // Paciente seleccionado para ver detalles
  loading: boolean = true; // Control de carga
  public authService: AuthService | undefined;

  constructor(
    private dayService: DayService,
    authService: AuthService
  ) {
    this.authService = authService;
  }

  ngOnInit(): void {
    this.loadDay(); // Cargar la lista de dias al iniciar el componente
  }

  // Método para cargar la lista de pacientes desde el servicio
  loadDay() {
    this.dayService.listDay().subscribe(
      (response: any) => {
        console.log('Dias recibidos:', response.days); // Verifica los pacientes dentro de 'day'
        this.day = response.days || []; // Asigna los pacientes correctamente desde 'response.day'
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
        this.dayService.deleteDay(id).subscribe(
          (response) => {
            console.log('Dia eliminado exitosamente:', response);
            // Eliminar el paciente de la lista en el frontend sin necesidad de recargar
            this.day = this.day.filter(
              (day) => day.id !== id
            );
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
  exportPdf() {
    const doc = new jsPDF();
    (doc as any).autoTable({
      head: [
        [

          'Nombre',
          
        ],
      ],
      body: this.day.map((day) => [

        day.name,
      ]),
    });
    doc.save('day.pdf');
  }

  // Método para exportar la tabla a Excel
  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.day);
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