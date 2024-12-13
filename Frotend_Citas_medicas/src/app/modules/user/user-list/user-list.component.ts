import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { UserService } from '../service/user.service';
import { AuthService } from '../../auth/service/auth.service';
import { Router } from '@angular/router';
import 'jspdf-autotable';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  ngOnInit(): void {
    this.loadUser(); // Cargar la lista de pacientes al iniciar el componente
  }

  users: any[] = []; // Arreglo para almacenar los pacientes
  user: any = {}; // Objeto para almacenar el tutor individual en el formulario
  specialitie: any[] = []; // Arreglo para almacenar los pacientes
  loading: boolean = true; // Control de carga
  public authService: AuthService | undefined;

  constructor(
    private userService: UserService,
    authService: AuthService,
    private router: Router
  ) {
    this.authService = authService;
  }

  // Método para cargar la lista de pacientes desde el servicio
  loadUser() {
    this.userService.listUsers().subscribe(
      (response: any) => {
        console.log('Users recibidos:', response.users); // Verifica los pacientes dentro de 'tutor'
        this.users = response.users || []; // Asigna los pacientes correctamente desde 'response.tutor'
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
        this.userService.deleteUser(id).subscribe(
          (response) => {
            console.log('Tutor eliminado exitosamente:', response);
            this.loadUser(); // Recarga la lista de usuarios desde el servidor
            // Eliminar el paciente de la lista en el frontend sin necesidad de recargar
            this.users = this.users.filter((user) => this.user.id !== id);
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
    // Añadir un título al
    doc.setFontSize(18);
    doc.text('Lista de Usuarios', 14, 22);

    // Añadir la fecha actual al PDF
    const date = new Date();
    doc.setFontSize(11);
    doc.text(`Fecha: ${date.toLocaleDateString()}`, 14, 32);

    (doc as any).autoTable({
      head: [
        ['Nombre', 'Apellidos', 'Rol', 'Especialidad', 'Correo', 'Celular'],
      ],
      body: this.users.map((user) => [
        user.name,
        user.surname,
        user.rol,
        user.Specialitie ? user.Specialitie.name : 'Sin especialidad',
        user.email,
        user.phone,
      ]),
      startY: 40, // Posición donde empezará la tabla
      theme: 'striped', // Tema de la tabla
      headStyles: { fillColor: [22, 160, 133] },
      // Color del encabezado
      styles: { fontSize: 10, cellPadding: 3 }, // Estilo de las celdas
      alternateRowStyles: { fillColor: [240, 240, 240] }, // Color de las filas alternadas
    });

    doc.save('Users.pdf');
  }

  printPdf() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Lista de Usuarios', 14, 22);
    const date = new Date();
    doc.setFontSize(11);
    doc.text(`Fecha: ${date.toLocaleDateString()}`, 14, 32);
    const options = {
      head: [
        ['Nombre', 'Apellidos', 'Rol', 'Especialidad', 'Correo', 'Celular'],
      ],
      body: this.users.map((user) => [
        user.name,
        user.surname,
        user.rol,
        user.Specialitie ? user.Specialitie.name : 'Sin especialidad',
        user.email,
        user.phone,
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
      const worksheet = xlsx.utils.json_to_sheet(this.user);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'Users');
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
