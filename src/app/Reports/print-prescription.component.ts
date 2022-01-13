import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogData } from '../MasterForms/DoctorNursePatho/doctot-patient-assignment.component';
import { DatePipe } from '@angular/common';
import { AllMasterFixedData } from '../shared/AllConstants';

@Component({
  selector: 'app-print-prescription',
  templateUrl: './print-prescription.component.html',
  styleUrls: ['./print-prescription.component.css']
})
export class PrintPrescriptionComponent implements OnInit {

  myDate:string;
  constructor(private _router: Router,
    public dialogRef: MatDialogRef<PrintPrescriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private datePipe: DatePipe) {
      this.myDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy').toString();
      
    }

    Addressline1= AllMasterFixedData.Addressline1;
    Addressline2= AllMasterFixedData.Addressline2;
    Addressline3= AllMasterFixedData.Addressline3;
    Addressline4= AllMasterFixedData.Addressline4;
  OperationMajorMinorData:string[] = AllMasterFixedData.OTOperationType;
  onNoClick(): void {
    this.dialogRef.close();
  }

  showSection:boolean=true;
  patientDiagnosisShow:boolean=true;
  patientAdviceShow:boolean=true;
  patientPathotestShow:boolean=true;
  tp:string;
  categories: string[];
  name = 'Angular';
  items = [];
  splitLines:string[];
  medicines:any[];
  ngOnInit(): void {
this.medicines= this.data.medicines;
    if(this.data.opdipd == "IPD" || this.data.opdipd == ""){
      //alert(this.data.opdipd);
      this.showSection = false;
    }
    else if(this.data.opdipd == "OPD" || this.data.opdipd == ""){
      //alert(this.data.opdipd);
      // "patientDiagnosis": "", "patientAdvice": "", "patientPathotest": ""
      if(this.data.patientDiagnosis == ''){
        this.patientDiagnosisShow = false;
      }
      if(this.data.patientAdvice == ''){
        this.patientAdviceShow = false;
      }
      if(this.data.patientPathotest == ''){
        this.patientPathotestShow = false;
      }
     

    }

    //alert(this.data.hlData);
//     console.log(this.data.hlData);
//    this.splitLines = this.data.hlData.split(/\r?\n/);
// console.log('Original string:');
// console.log(this.data.hlData);
// console.log(this.splitLines);
// this.tp='liku';

// for (let i = 0; i < this.splitLines.length; i++) {
//   this.items.push({selectedCategory: this.splitLines[i],unit:'',noOfTimes:'',noOfDays:'X',whichTime:''});
// }

  }
  myPrint(myfrm) {
    document.getElementById("printElement").style.display = "none";
    //document.getElementById("CloseMe").style.display = "none";
    document.getElementById("closePopup").style.display = "none";
    document.getElementById("customiseCloseElement").style.display = "none";

    //document.getElementById("searchtElement").style.display = "none";
    //document.getElementById("printCheckTextElement").style.display = "none";
    var printdata = document.getElementById(myfrm);
    var newwin = window.open("");
    //newwin.document.write('<html><head><link rel="stylesheet" type="text/css" href="./print-prescription.component.css" /><span class="abc">adas</span> <h2>QR Code</h2> </head><body  onload="window.print()">' + printdata.innerHTML + '</html>');
    
    newwin.document.write(printdata.innerHTML);
    
    newwin.print();
    document.getElementById("printElement").style.display = "block";
    //document.getElementById("searchtElement").style.display = "block";
    //document.getElementById("CloseMe").style.display = "block";
    document.getElementById("closePopup").style.display = "block";
    document.getElementById("customiseCloseElement").style.display = "block";
    //document.getElementById("printCheckTextElement").style.display = "block";
    newwin.close();

    
  }

  CloseMe(){
    this._router.navigate(['/home', 37], { queryParams: { username: "ax3r5!mmmt!4rtresjjgnth"}});
    this.dialogRef.close();
  }

}
