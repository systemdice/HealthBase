import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-print-patient-appointment',
  templateUrl: './main-print-patient-appointment.component.html',
  styleUrls: ['./main-print-patient-appointment.component.css']
})
export class MainPrintPatientAppointmentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  printPage() {
    window.print();
  }

}
