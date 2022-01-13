


  import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { DialogData } from '../MasterForms/farmacy-entry.component';
import { NewModifyCase } from '../models/UserData';
import { AddModifyCaseService } from '../Services/add-modify-case.service';
import { AllMasterFixedData } from '../shared/AllConstants';
import { PatientRegistrationFirstPageComponent } from './patient-registration-first-page.component';

@Component({
  selector: 'app-opd-ticket-report',
  templateUrl: './opd-ticket-report.component.html',
  styleUrls: ['./opd-ticket-report.component.css']
})
export class OpdTicketReportComponent implements OnInit {
  Addressline1= AllMasterFixedData.Addressline1;
  Addressline2= AllMasterFixedData.Addressline2;
  Addressline3= AllMasterFixedData.Addressline3;
  Addressline4= AllMasterFixedData.Addressline4;
  EditedCaseData: NewModifyCase;
  showSearch:boolean= false;
  timeOnly:string;
  myDate:string;
  constructor( private _router: Router,public dialogRef: MatDialogRef<PatientRegistrationFirstPageComponent>,private addModifyCaseService: AddModifyCaseService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private datePipe: DatePipe) { 
      this.myDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy').toString();
    }
  

  ngOnInit(): void {
    this.timeOnly = new Date().toLocaleTimeString(); // 11:18:48 AM
    if(this.data.animal== undefined){
      this.showSearch = true;
    }
    else{
      this.addModifyCaseService.getById(this.data.animal).subscribe(val => {
        this.EditedCaseData = val;});
    }
  }

  WithoutTime() {
    var date = new Date();
    date. setHours(0, 0, 0, 0);
    return date;
    }
    isChecked:any;
    permanentAddress:string;
    checkValue(event: any){
      //alert(event);
      if(event == 'A'){
      this.permanentAddress = this.EditedCaseData?.Home.Address;
      }
      else{
        this.permanentAddress = '';
      }
   }
  myPrint(myfrm) {
    document.getElementById("printElement").style.display = "none";
    //document.getElementById("CloseMe").style.display = "none";
    //document.getElementById("searchtElement").style.display = "none";
    document.getElementById("closePopup").style.display = "none";
    var printdata = document.getElementById('frmIndividualLapReport');
    var newwin = window.open('');
    newwin.document.write(printdata.innerHTML);
    newwin.print();
    document.getElementById("printElement").style.display = "block";
    //document.getElementById("searchtElement").style.display = "block";
    //document.getElementById("CloseMe").style.display = "block";
    document.getElementById("closePopup").style.display = "block";
    newwin.close();
  }

  CloseMe(){
    this._router.navigate(['/home', 37], { queryParams: { username: "ax3r5!mmmt!4rtresjjgnth"}});
    this.dialogRef.close();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }


}







