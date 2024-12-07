import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-report-child',
  templateUrl: './report-child.component.html',
  styleUrls: ['./report-child.component.css']
})
export class ReportChildComponent {


  @Input() title: string = '';
  @Input() data: any[] = [];
   // Acceso al contenedor principal
   //@ViewChild('tableContainer', { static: false }) tableContainer!: ElementRef;
     // Usando ViewChild para referenciar el contenedor y el botón
  @ViewChild('tableContainer', { static: false }) tableContainer!: ElementRef;
  @ViewChild('printButton', { static: false }) printButton!: ElementRef;
  @ViewChild('paginator', { static: false }) paginator!: ElementRef;  // Añadido para referenciar el paginator

  paginatorVisible: boolean = true; // Variable para controlar la visibilidad del paginator


  get columns(): string[] {
    return this.data.length > 0 ? Object.keys(this.data[0]) : [];
  }
/* 
  printReport(): void {
    // Encuentra el contenedor que contiene la tabla
    const tableElement = this.tableContainer.nativeElement;

    // Crea una nueva ventana para imprimir
    const printWindow = window.open('', '_blank')!;
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>${this.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          </style>
        </head>
        <body>
          <h2>${this.title}</h2>
          ${tableElement.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  } */
 // Función para generar y descargar el PDF
  // Función para generar y descargar el PDF
  downloadPDF(): void {
    if (!this.tableContainer) {
      console.error('El contenedor de la tabla no está disponible.');
      return;
    }

    // Ocultar el botón y el paginator antes de generar el PDF
    const printButton = this.printButton?.nativeElement as HTMLElement;
    const paginatorElement = this.paginator?.nativeElement;
    this.paginatorVisible = false;  // Ocultar el paginator durante la generación del PDF
    if (printButton) printButton.style.display = 'none';

    // Crear una instancia de jsPDF
    //const doc = new jsPDF('landscape');

    // Capturar la tabla HTML
    const tableElement = this.tableContainer.nativeElement;

    // Determinar la orientación basada en el número de columnas
    const isHorizontal = this.columns.length > 7;  // Ajusta el número de columnas según sea necesario

    // Crear una instancia de jsPDF con la orientación correcta
    const doc = new jsPDF(isHorizontal ? 'landscape' : 'portrait');  // 'landscape' o 'portrait'
    // Configurar fuente más pequeña
    doc.setFontSize(8); // Cambia el tamaño de la fuente a 8 (puedes ajustarlo)

    
    // Usar jsPDF para convertir la tabla HTML en un PDF
    doc.html(tableElement, {
      callback: (doc) => {
        // Después de generar el PDF, lo descargamos
        doc.save(`${this.title}.pdf`);
      },
      margin: [10, 10, 10, 10],  // Definir márgenes para el PDF
      autoPaging: true,  // Esto asegura que el contenido se divida en múltiples páginas si es necesario
      x: 10,  // Definir posición horizontal para el contenido
      y: 10,  // Definir posición vertical para el contenido
      html2canvas: {
        scale: 0.2, // Ajusta el factor de escala (reduce el tamaño de los elementos en el PDF)
      }
    });

    // Restaurar la visibilidad después de la generación del PDF
    setTimeout(() => {
      this.paginatorVisible = true;  // Restaurar el paginator
      if (printButton) printButton.style.display = 'block';  // Restaurar el botón
    }, 1000);  // Restauramos después de un pequeño delay para asegurar la descarga
  }



    printReport(): void {
      if (!this.tableContainer) {
        console.error('El contenedor de la tabla no está disponible.');
        return;
      }
       // Guardamos el estado del paginator (si está visible o no)
    const originalPaginatorVisibility = this.paginatorVisible;
    this.paginatorVisible = false;  // Ocultar el paginator durante la impresión

    
   // Obtener los elementos que se deben ocultar durante la impresión
   /* const paginator = this.tableContainer.nativeElement.querySelector('.p-paginator') as HTMLElement;
   const paginatorElement = this.paginator?.nativeElement;
   const printButton = this.printButton?.nativeElement as HTMLElement; */


    // Guardar los estilos originales del paginator para restaurarlos
    //const originalPaginatorStyles = paginatorElement ? window.getComputedStyle(paginatorElement) : null;


  // Ocultar el botón y el paginador si existen
  // if (paginator) paginator.style.display = 'none';
   // Obtener los elementos que se deben ocultar durante la impresión
   const printButton = this.printButton?.nativeElement as HTMLElement;
  if (printButton) printButton.style.display = 'none';

      const tableElement = this.tableContainer.nativeElement;
    
      // Construye el contenido HTML para la impresión
      const printContent = `
        <html>
          <head>
            <title>Citas por Médico</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                line-height: 1.6;
              }
              h2 {
                text-align: center;
                margin-bottom: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
              }
              .no-data {
                text-align: center;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
          
            ${tableElement.outerHTML}
          </body>
        </html>
      `;
    
      // Abre una nueva ventana y carga el contenido HTML
      const printWindow = window.open('', '_blank')!;
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
    
      // Ejecuta la impresión
      printWindow.print();
    
      // Restaurar la visibilidad y los estilos del paginator y el botón después de la impresión
     // Restaurar la visibilidad del paginator y el botón después de la impresión
     setTimeout(() => {
      this.paginatorVisible = originalPaginatorVisibility;  // Restaurar la visibilidad del paginator
      if (printButton) printButton.style.display = 'block';  // Restaurar el botón
    }, 1000);  // Restauramos después de un pequeño delay para asegurar la impresión

  }  
    
/* 

   // Restaurar la visibilidad del paginator y el botón después de la impresión
    setTimeout(() => {
      if (paginator) paginator.style.display = 'block';
      if (printButton) printButton.style.display = 'block';
    
    }, 1000);  // Restauramos después de un pequeño delay para asegurar la impresión
    

      printReport(): void {
        const printContent = document.getElementById('printableArea')!;
        const originalContent = document.body.innerHTML;
      
        // Reemplaza el contenido del cuerpo por el área imprimible
        document.body.innerHTML = printContent.outerHTML;
      
        // Llama al cuadro de impresión
        window.print();
      
        // Restaura el contenido original del cuerpo
        document.body.innerHTML = originalContent;
      
        // Recarga el componente para restaurar el estado original de Angular
        window.location.reload();
      } 
      

 */
}
