import { Component } from '@angular/core';
import { PatientService } from '../../patient/service/patient.service';
import { UserService } from '../../user/service/user.service';
import { AppointmentService } from '../../appointment/service/appointment.service';
import { DatePipe } from '@angular/common';

import { jsPDF } from 'jspdf';  // Importamos jsPDF
import 'jspdf-autotable';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent {

  reportOptions = [
    { label: 'Pacientes mayores de 20 años', key: 'patientsByAge' },
    // { label: 'Ganancias del día', key: 'dailyEarnings' },
    { label: 'Pacientes por médico', key: 'patientsByDoctor' } ,// Opción para el reporte de pacientes por médico
    { label: 'Citas por médico', key: 'apppointmentsByDoctor' } // Opción para el reporte de pacientes por médico
    
  ];
  selectedReport: any = null;
  selectedDoctorName: string = '';  // Campo para el nombre del médico
  reportData: any[] = [];
  patient: any[] = []; // Arreglo para almacenar los pacientes
  

  constructor(private patientService: PatientService,private userService: UserService,
    private appointmentService: AppointmentService, // Inyectamos AppointmentService
    private datePipe: DatePipe  // Inyectamos DatePipe
  ) {}

  loadReport(): void {
    console.log("Reporte seleccionado:", this.selectedReport);
  
    if (!this.selectedReport) return;
  
    switch (this.selectedReport.key) {
      case 'patientsByAge':
        this.patientService.listPatients().subscribe(
          (response: any) => {
            console.log("Pacientes recibidos:", response.patient);
            // Asegúrate de que 'response.patient' existe y es un arreglo
            this.reportData = response.patient?.filter((patient: any) => patient.edad > 18) || [];



        // Eliminar columnas no deseadas de cada paciente
        this.reportData = this.reportData.map((patient: any) => {
          const { antecedent_allergic, antecedent_family,antecedent_personal,temperature,talla,peso,fc,pa,createdAt,state,updatedAt,...rest } = patient;  // Eliminamos las columnas 'edad' y 'nombre'
          return rest;  // Retorna el objeto sin esas propiedades
        });

            console.log("Pacientes mayores de 20 años:", this.reportData);
            if (this.reportData.length === 0) {
              alert('No se encontraron pacientes mayores a 18');
            } 
          },
        
          (error) => {
            console.error("Error al cargar pacientes:", error);
            this.reportData = [];
          }
        );
        break;
  
      case 'dailyEarnings':
        this.userService.listUsers().subscribe(
          (data: any[]) => {
            console.log("Datos de usuarios recibidos:", data);
  
            const today = new Date().toISOString().split('T')[0];
            this.reportData = data.filter((payment) => payment.date.startsWith(today));
          },
          (error) => {
            console.error("Error al cargar datos de usuarios:", error);
            this.reportData = [];
          }
        );
        break;

        case 'patientsByDoctor':
        this.getPatientsByDoctor(); // Llamar al método para cargar los pacientes por médico
        break;

        case 'apppointmentsByDoctor':
          this.getAppointmentsByDoctor(); // Llamar al método para cargar los pacientes por médico
          break;
  
      default:
        this.reportData = [];
    }
  }
  getPatientsByDoctor(): void {
    if (this.selectedDoctorName.trim() === '') {
      alert('Por favor ingrese el nombre del médico.');
      return;
    }

    this.appointmentService.listAppointment().subscribe(
      (response: any) => {
        console.log("Citas recibidas:", response.appointments);

        // Filtrar las citas por el médico seleccionado
        this.reportData = response.appointments
          .filter((appointment: any) => 
            appointment.User.name.toLowerCase() === this.selectedDoctorName.trim().toLowerCase()
          )
          //.map((appointment: any) => appointment.Patient); // Obtener solo los pacientes
          .map((appointment: any) => {
            // Eliminar los campos 'createdAt' y 'updatedAt' de cada paciente
            const patient = appointment.Patient;
            delete patient.createdAt;
            delete patient.updatedAt;
            delete patient.antecedent_allergic;
            delete patient.antecedent_family;
            delete patient.antecedent_personal	;
            delete patient.state	;
            return patient; // Devuelve el paciente sin esos campos
          });
        if (this.reportData.length === 0) {
          alert('No se encontraron pacientes para este médico.');
        } else {
          console.log("Pacientes atendidos por el médico:", this.reportData);
        }
      },
      (error) => {
        console.error("Error al cargar las citas del médico:", error);
        this.reportData = [];
      }
    );
  }
  
  getAppointmentsByDoctor(): void {
    if (this.selectedDoctorName.trim() === '') {
      alert('Por favor ingrese el nombre del médico.');
      return;
    }
  
    this.appointmentService.listAppointment().subscribe(
      (response: any) => {
        console.log("Citas recibidas:", response.appointments);
  
        // Filtrar las citas por el médico seleccionado
        this.reportData = response.appointments
          .filter((appointment: any) =>
            appointment.User.name.toLowerCase() === this.selectedDoctorName.trim().toLowerCase()
          )
          .map((appointment: any) => {
            
            const filteredAppointment = { ...appointment };
            // Formatear solo la fecha dateAppointment
            filteredAppointment.FechaCita = this.datePipe.transform(filteredAppointment.dateAppointment, 'dd/MM/yyyy') || 'No disponible';
            // Formatear la fecha de 'createdAt' con día/mes/año y hora
            filteredAppointment.FechaHoraRegistro = this.datePipe.transform(filteredAppointment.createdAt, 'dd/MM/yyyy HH:mm:ss') || 'No disponible';

            // Asignar estado basado en el valor de 'stateAppointment'
          switch (filteredAppointment.stateAppointment) {
            case 1:
              filteredAppointment.State = 'Pendiente';
              break;
            case 2:
              filteredAppointment.State = 'Completado';
              break;
            case 3:
              filteredAppointment.State = 'Cancelado';
              break;
            default:
              filteredAppointment.State = 'Estado desconocido';
          }
          // Eliminar los campos 'createdAt' y 'updatedAt' de cada cita

            delete filteredAppointment.createdAt;
            delete filteredAppointment.updatedAt;
            delete filteredAppointment.dateAppointment;
            delete filteredAppointment.stateAppointment;
  
            // Extraer las propiedades necesarias de los objetos
            const patient = filteredAppointment.Patient;
            const specialitie = filteredAppointment.Specialitie;
            const user = filteredAppointment.User;
            const dayHour = filteredAppointment.DayHour;
  
            // Crear nuevas propiedades con los valores que quieres mostrar
            //filteredAppointment.PatientName = patient?.name || 'No disponible';  // Nombre del paciente
            filteredAppointment.PatientName = `${patient?.name} ${patient?.surname}` || 'No disponible';
            filteredAppointment.SpecialitieName = specialitie?.name || 'No disponible';  // Nombre de la especialidad
            filteredAppointment.UserName = `${user?.name} ${user?.surname}`  || 'No disponible';  // Nombre del médico
            filteredAppointment.DayHourTime = `${dayHour?.Day?.name || 'No disponible'} ${dayHour?.Hour?.name || 'No disponible'}`;  // Día y hora
  
           
            // Eliminar las propiedades originales que son objetos complejos
            delete filteredAppointment.Patient;
            delete filteredAppointment.Specialitie;
            delete filteredAppointment.User;
            delete filteredAppointment.DayHour;
  
            // Eliminar las columnas innecesarias (si no las quieres mostrar)
            delete filteredAppointment.patientId;
            delete filteredAppointment.specialitieId;
            delete filteredAppointment.userId;
            delete filteredAppointment.dayHourId;
  
            return filteredAppointment;
          });
  
        if (this.reportData.length === 0) {
          alert('No se encontraron citas para este médico.');
        } else {
          console.log("Citas atendidas por el médico:", this.reportData);
        }
      },
      (error) => {
        console.error("Error al cargar las citas del médico:", error);
        this.reportData = [];
      }
    );
  }
  
  

  // Función para imprimir el reporte
  printReport(): void {
    window.print(); // Esto abrirá el cuadro de diálogo de impresión del navegador
  }
 
  downloadPDF(): void {
    const doc = new jsPDF('landscape');
  
    // Título del PDF
    doc.setFontSize(14);
    doc.text('Reporte de Citas Médicas', 10, 10);
    // Nombre del médico seleccionado (puedes ajustar la posición vertical)
 /*  const selectedDoctorName = this.selectedDoctorName || 'No disponible'; // Reemplaza con el dato dinámico
  doc.setFontSize(12);
  doc.text(`Médico: ${selectedDoctorName}`, 10, 18); // Añado el nombre del médico en la siguiente línea
 */

    // Obtener el UserName del primer elemento del reporte
    const firstAppointment = this.reportData[0];
    const selectedDoctorName = firstAppointment?.UserName || 'No disponible';
  
    // Mostrar el UserName del médico en el PDF
    doc.setFontSize(12);
    doc.text(`Médico: ${selectedDoctorName}`, 10, 18);
  
  
    // Espaciado inicial
    let yPosition = 30;
  
    // Encabezados de la tabla
    doc.setFontSize(10);
    doc.text('ID', 10, yPosition);
    doc.text('Fecha Cita', 20, yPosition);
    doc.text('Fecha Registro', 50, yPosition);
    doc.text('Estado', 95, yPosition);
    doc.text('Paciente', 120, yPosition);
    doc.text('Especialidad', 155, yPosition);
    doc.text('Médico', 180, yPosition);
    doc.text('Día/Hora', 210, yPosition); // Encabezado para DayHourTime
  
    // Incrementar la posición vertical para los datos
    yPosition += 10;
  
    // Llenar los datos del reporte en el PDF
    this.reportData.forEach((appointment: any) => {
      if (yPosition > 280) { // Saltar a nueva página si se alcanza el límite
        doc.addPage();
        yPosition = 10; // Reiniciar posición vertical
      }
  
      doc.text(appointment.id?.toString() || 'No disponible', 10, yPosition);
      doc.text(appointment.FechaCita || 'No disponible', 20, yPosition);
      doc.text(appointment.FechaHoraRegistro || 'No disponible', 50, yPosition);
      doc.text(appointment.State || 'No disponible', 95, yPosition);
      doc.text(appointment.PatientName || 'No disponible', 120, yPosition);
      doc.text(appointment.SpecialitieName || 'No disponible', 155, yPosition);
      doc.text(appointment.UserName || 'No disponible', 180, yPosition);
      doc.text(appointment.DayHourTime || 'No disponible', 210, yPosition);
  
      // Incrementar la posición vertical para la próxima fila
      yPosition += 10;
    });
  
    // Descargar el PDF
    doc.save('reporte_citas.pdf');
  }



  
  
  
  


}
