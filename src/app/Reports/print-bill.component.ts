
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogData } from '../MasterForms/DoctorNursePatho/doctot-patient-assignment.component';
import { DatePipe } from '@angular/common';
import { AllMasterFixedData } from '../shared/AllConstants';

@Component({
  selector: 'app-print-bill',
  templateUrl: './print-bill.component.html',
  styleUrls: ['./print-bill.component.css']
})
export class PrintBillComponent implements OnInit {
  printBillArray: any[] = [];
  myDate:string;
  constructor(private _router: Router,
    public dialogRef: MatDialogRef<PrintBillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private datePipe: DatePipe) {
      this.myDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy').toString();
      
    }

    Addressline1= this.data.patientInfo.PharmacyStoreName=='Sachin'?AllMasterFixedData.PharmaAddress1:AllMasterFixedData.PharmaMihirAddress1;
    Addressline2= AllMasterFixedData.PharmaAddress2;
    Addressline3= this.data.patientInfo.PharmacyStoreName=='Sachin'?AllMasterFixedData.PharmaAddress3:AllMasterFixedData.PharmaMihirAddress3; //AllMasterFixedData.PharmaAddress3;
    Addressline4= this.data.patientInfo.PharmacyStoreName=='Sachin'?AllMasterFixedData.PharmaContactNumber:AllMasterFixedData.PharmaMihirContactNumber;//AllMasterFixedData.PharmaContactNumber;
  OperationMajorMinorData:string[] = AllMasterFixedData.OTOperationType;
  onNoClick(): void {
    this.dialogRef.close();
  }

  showSection:boolean=true;
  timeOnly:string;
  BillDetails: any = {};
  ngOnInit(): void {
    this.timeOnly = new Date().toLocaleTimeString();
    if(this.data.opdipd == "IPD" || this.data.opdipd == ""){
      //alert(this.data.opdipd);
      this.showSection = false;
      //alert(this.data.dt);
    }
    // alert(this.data.dt);
    // alert(this.data.BD);
  }
  myPrint(myfrm) {
    document.getElementById("printElement").style.display = "none";
    document.getElementById("CloseMe1").style.display = "none";
    document.getElementById("closePopup").style.display = "none";

    //document.getElementById("searchtElement").style.display = "none";
    //document.getElementById("printCheckTextElement").style.display = "none";
    var printdata = document.getElementById(myfrm);
    var newwin = window.open("");
    //newwin.document.write('<html><head><link rel="stylesheet" type="text/css" href="./print-prescription.component.css" /><span class="abc">adas</span> <h2>QR Code</h2> </head><body  onload="window.print()">' + printdata.innerHTML + '</html>');
    
    newwin.document.write(printdata.innerHTML);
    
    newwin.print();
    document.getElementById("printElement").style.display = "block";
    //document.getElementById("searchtElement").style.display = "block";
    document.getElementById("CloseMe1").style.display = "block";
    document.getElementById("closePopup").style.display = "block";
    //document.getElementById("printCheckTextElement").style.display = "block";
    newwin.close();

    
  }

  CloseMe(){
    this._router.navigate(['/home', 37], { queryParams: { username: "ax3r5!mmmt!4rtresjjgnth"}});
    this.dialogRef.close();
  }

  inWords (num) {
    var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
  var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

      if ((num = num.toString()).length > 9) return 'overflow';
      var n:any[] = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!n) return; var str = '';
      str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
      str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
      str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
      str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
      str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
      return str;
  }

}

