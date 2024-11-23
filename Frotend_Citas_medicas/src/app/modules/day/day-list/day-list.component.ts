import { Component, OnInit } from '@angular/core';
import { DayService } from '../service/day.service';
import * as FileSaver from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-day-list',
  templateUrl: './day-list.component.html',
  styleUrls: ['./day-list.component.css']
})
export class DayListComponent implements OnInit {
  days: any[] = []; // Arreglo para almacenar los días
  loading: boolean = true; // Indicador de carga

  constructor(private dayService: DayService) {}

  ngOnInit(): void {
    this.loadDays(); // Carga inicial de los días
  }

  // Método para cargar los días desde el servicio
  loadDays() {
    this.dayService.listDays().subscribe(
      (response: any) => {
        this.days = response.days || []; // Ajusta según la estructura de respuesta
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar los días:', error);
        this.loading = false;
      }
    );
  }

  // Método para eliminar un día
  deleteDay(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este día?')) {
      this.dayService.deleteDay(id).subscribe(
        () => {
          this.days = this.days.filter(day => day.id !== id);
        },
        (error) => {
          console.error('Error al eliminar el día:', error);
        }
      );
    }
  }

  // Filtrar en tiempo real
  onGlobalFilter(event: Event, dt: any) {
    const inputElement = event.target as HTMLInputElement;
    dt.filterGlobal(inputElement.value, 'contains');
  }

  // Exportar a PDF
  exportPdf() {
    const doc = new jsPDF();
    (doc as any).autoTable({
      head: [['Nombre', 'Descripción']],
      body: this.days.map(day => [day.name, day.description])
    });
    doc.save('days.pdf');
  }

  // Exportar a Excel
  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.days);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'days');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`);
  }
}
