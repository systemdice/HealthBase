import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-print-patient-appointment',
  templateUrl: './print-patient-appointment.component.html',
  styleUrls: ['./print-patient-appointment.component.css']
})
export class PrintPatientAppointmentComponent implements OnInit {

  Address1:string;
  Address2:string;
  Address3:string;
  HospitalName:string;
  Age:string;
  Gender:string;
  AppointmentDate:string;
  AppointmentTime:string;
  PatientName:string;
  CounterName:string;
  DoctorName:string;
  PaymentMode:string;
  PaidOn:string;
  Amount:number;
  Discount:number;
  printedon:string;
  BillID:string;
  value = 'someValue12340987';
  get values(): string[] {
    this.value= this.PatientName;
    return this.value.split('\n');
  }
 
  constructor(@Inject(MAT_DIALOG_DATA) private data: any, public dialogRef: MatDialogRef<PrintPatientAppointmentComponent>) {
    if (data) {

      this.Address1= data.pp.address1;
      this.Address2= data.pp.address2;
      this.Address3= data.pp.address3;
      this.Age=  data.pp.home.Year +' Years' +' '+  data.pp.home.Month + ' Months';
      this.Gender= data.pp.home.Gender=="1" ?"M":"F";

      this.HospitalName = data.pp.hospitalname; //data.doctorname.control['doctorname'].value;
      
  this.AppointmentDate = data.pp.appointment;
  this.AppointmentTime = data.pp.time;
  this.PatientName = data.pp.home.FirstName+' ' +data.pp.home.LastName;
  this.CounterName = data.pp.counternumber;
  this.DoctorName = data.pp.doctorname;
  this.PaymentMode = data.pp.paymentmode;
  this.PaidOn = new Date().toLocaleString();
  this.Amount = data.pp.fees;
  this.Discount = data.pp.discount;
  this.printedon = new Date().toLocaleString();
  this.BillID = data.BillID;
      // alert(data.pp.doctorname);
      // alert(data.pp.home.street);
      
    }
   }

  ngOnInit(): void {
  }

  printPage() {
    window.print();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
