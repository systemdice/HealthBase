import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DischargeReportComponent } from '../MasterForms/discharge-report.component';
import { NewModifyCase } from '../models/UserData';
import { AddModifyCaseService } from '../Services/add-modify-case.service';

@Component({
  selector: 'app-discharge-report-unique',
  templateUrl: './discharge-report-unique.component.html',
  styleUrls: ['./discharge-report-unique.component.css']
})
export class DischargeReportUniqueComponent implements OnInit {
  IPOPid:string;
  unquieid:string;
  msg:string;
  constructor( public dialog: MatDialog,private addModifyCaseService: AddModifyCaseService,) { }

  ngOnInit(): void {
   
    
  }

  OpenPrescription(nm): void {
    this.addModifyCaseService.getUniqueIdFromIPOP(this.IPOPid).subscribe((data: NewModifyCase) => {
      //console.log('jay'+data);
      this.unquieid = data.UnqueID;

      if(this.unquieid !== 'NA'){
        this.msg="This IP/OP number viewed in popup.";
      const dialogRef = this.dialog.open(DischargeReportComponent, {
        width: '1250px',
        height: '670px',
        data: {name: nm, animal: this.unquieid}
      });
    
      }
      else{
        this.msg="This IP/OP number does not exist";
      }
    });
  
  //421422124?username=SAI%20KUMAR%20NAIK&newid=IP421-0121
   
     
    
    
  }


}
