import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PrintPrescriptionComponent } from 'src/app/Reports/print-prescription.component';
import { NewModifyCase } from 'src/app/models/UserData';
import { LabReportIndividualAllComponent } from '../lab-report-individual-all.component';
import { LabReportIndividualPopupComponent } from '../lab-report-individual-popup.component';
import { Observable, Subscription } from 'rxjs';

export interface DialogData {
  animal: string;
  name: string;
  hlData: string;
  patientHistory:string;
  patientDiagnosis:string;
  patientAdvice:string;
  patientPathotest:string;
  opdipd:string;
  hlAdvice:string;
  patientInfo:any;
  individualDoctorName:string;
  dt:any;
  BD:any;
  medicines:any[];
  
}

@Component({
  selector: 'app-doctot-patient-assignment',
  templateUrl: './doctot-patient-assignment.component.html',
  styleUrls: ['./doctot-patient-assignment.component.css']
})
export class DoctotPatientAssignmentComponent implements OnInit {
  @Input() DoctortoPatientCommentMedicine : FormGroup;
  animal: string;
  name: string;
  hlData:string;
  patientHistory:string;
  patientDiagnosis:string;
  patientAdvice:string;
  patientPathotest:string;
  @Input() CaseDetailValues: any;
  @Input() PatientValues:any;
  @Input() caseid:string;
  @Input() events: Observable<string>;
  private eventsSubscription: Subscription;
  
  constructor(public dialog: MatDialog) { }
  showAdvanceBoxval:string='';
  ngOnInit(): void {
    this.eventsSubscription = this.events.subscribe((data)=>this.showAdvanceBoxval = data); //data=>this.data
  }
  


  addEditLabTestItem(expenseId: string, firstName: string, parentTest: string) {
    //alert(expenseId +"-"+ firstName+"-"+ parentTest)
    // if (expenseId !== null) {
    //   this._router.navigate(['/LabTestInd', expenseId, firstName], { queryParams: { username: parentTest } });
    // }
    // else {
    //   this._router.navigate(['/LabTestInd', 'Addnew', firstName], { queryParams: { username: "" } });
    // }
  }

  OpenPrescription(): void {

    var printdata = document.getElementById('idMedicineNames').innerText;
    //var newwin = window.open("");
    //newwin.document.write(printdata.outerHTML);
    var aPrescription= this.DoctortoPatientCommentMedicine.value.MedicineNamesHL+"\n"+this.DoctortoPatientCommentMedicine.value.MedicineNames;
    var doctorAdvice= this.DoctortoPatientCommentMedicine.value.DoctorCommentsHL+"\n"+this.DoctortoPatientCommentMedicine.value.DoctorComments;
    var patientHistory= this.DoctortoPatientCommentMedicine.value.PatientHistory;
    var patientDiagnosis= this.DoctortoPatientCommentMedicine.value.PatientDiagnosis;
    var patientAdvice= this.DoctortoPatientCommentMedicine.value.PatientFinding;
    var patientPathotest= this.DoctortoPatientCommentMedicine.value.PatientPathoLabTestAdvice;
    const dialogRef = this.dialog.open(PrintPrescriptionComponent, {
      width: '750px',
      height: '600px',
      data: {name: this.name, animal: this.animal,hlData:aPrescription,hlAdvice:doctorAdvice,
        patientHistory:patientHistory,patientDiagnosis:patientDiagnosis,
        patientAdvice:patientAdvice,patientPathotest:patientPathotest,opdipd:this.showAdvanceBoxval,
        patientInfo:this.PatientValues}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
      this.hlData = result;
    });
  }

  OpenLabReport(expenseId: string, firstName: string, parentTest: string): void {

    //var printdata = document.getElementById('idMedicineNames').innerText;
    //var newwin = window.open("");
    //newwin.document.write(printdata.outerHTML);
    // var aPrescription= this.DoctortoPatientCommentMedicine.value.MedicineNamesHL+"\n"+this.DoctortoPatientCommentMedicine.value.MedicineNames;
    // var doctorAdvice= this.DoctortoPatientCommentMedicine.value.DoctorCommentsHL+"\n"+this.DoctortoPatientCommentMedicine.value.DoctorComments;

    const dialogRef11 = this.dialog.open(LabReportIndividualPopupComponent, {
      width: '750px',
      height: '600px',
      data: {name: expenseId, animal: firstName,
      hlData:parentTest}
    });

    dialogRef11.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
      this.hlData = result;
    });
  }

}


