import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { SpecialitieService } from '../service/specialitie.service';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-specialitie-list',
  templateUrl: './specialitie-list.component.html',
  styleUrls: ['./specialitie-list.component.css']
})
export class SpecialitieListComponent implements OnInit {

  
  specialitie: any[] = []; // Arreglo para almacenar los pacientes
  selectedSpecialitie: any = null; // Paciente seleccionado para ver detalles
  loading: boolean = true; // Control de carga
  public authService: AuthService | undefined;

  constructor(
    private specialitieService: SpecialitieService,
    authService: AuthService
  ) {
    this.authService = authService;
  }

  ngOnInit(): void {
    this.loadSpecialitie(); // Cargar la lista de pacientes al iniciar el componente
  }

  // Método para cargar la lista de pacientes desde el servicio
  loadSpecialitie() {
    this.specialitieService.listSpecialitie().subscribe(
      (response: any) => {
        console.log('Especialidades recibidos:', response.specialitie); // Verifica los pacientes dentro de 'specialitie'
        this.specialitie = response.specialitie || []; // Asigna los pacientes correctamente desde 'response.specialitie'
        this.loading = false; // Desactiva el indicador de carga
      },
      (error) => {
        console.error('Error al cargar los pacientes:', error);
        this.loading = false; // Desactiva el indicador de carga en caso de error
      }
    );
  }

  // Método para ver los detalles de un paciente
  viewSpecialitieDetails(specialitie: any) {
    this.selectedSpecialitie = specialitie; // Asigna el paciente seleccionado
  }

  deleteSpecialitie(id: number): void {
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
        this.specialitieService.deleteSpecialitie(id).subscribe(
          (response) => {
            console.log('Paciente eliminado exitosamente:', response);
            // Eliminar el paciente de la lista en el frontend sin necesidad de recargar
            this.specialitie = this.specialitie.filter(
              (specialitie) => specialitie.id !== id
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

  onGlobalFilter(event: Event, dt: any) {
    const inputElement = event.target as HTMLInputElement;
    dt.filterGlobal(inputElement.value, 'contains');
  }

  isAdmin(): boolean {
    return this.authService ? this.authService.isAdmin() : false;
  }

  // Método para exportar la tabla a PDF
 /*  exportPdf() {
    const doc = new jsPDF();
    (doc as any).autoTable({
      head: [
        [

          'Nombre',
          'Descripcion',
        ],
      ],
      body: this.specialitie.map((specialitie) => [

        specialitie.name,
        specialitie.description,
      ]),
    });
    doc.save('specialitie.pdf');
  } */

    exportPdf() {
      const doc = new jsPDF();
      // Añadir un título al
      doc.setFontSize(18);
      doc.text('Lista de Especialidades', 14, 22);
  
      // Añadir la fecha actual al PDF
      const date = new Date();
      doc.setFontSize(11);
      doc.text(`Fecha: ${date.toLocaleDateString()}`, 14, 32);
  
      (doc as any).autoTable({
        head: [
          ['Especialidad', 'PTECIO', 'DESCRIPCION'],
        ],
        body: this.specialitie.map((specialitie) => [
          specialitie.name,
          specialitie.price,
          specialitie.description,
        ]),
        startY: 40, // Posición donde empezará la tabla
        theme: 'striped', // Tema de la tabla
        headStyles: { fillColor: [22, 160, 133] },
        // Color del encabezado
        styles: { fontSize: 10, cellPadding: 3 }, // Estilo de las celdas
        alternateRowStyles: { fillColor: [240, 240, 240] }, // Color de las filas alternadas
      });
  
      doc.save('especialidades.pdf');
    }

    printPdf() {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Lista de Especialidades', 14, 22);
      const date = new Date();
      doc.setFontSize(11);
      doc.text(`Fecha: ${date.toLocaleDateString()}`, 14, 32);
      const options = {
        head: [
          ['Especialidad', 'PTECIO', 'DESCRIPCION'],
        ],
        body: this.specialitie.map((specialitie) => [
          specialitie.name,
          specialitie.price,
          specialitie.description,
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
      const worksheet = xlsx.utils.json_to_sheet(this.specialitie);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'specialitie');
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
