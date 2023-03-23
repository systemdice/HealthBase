import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { DialogData } from '../MasterForms/farmacy-entry.component';
import { NewModifyCase } from '../models/UserData';
import { AddModifyCaseService } from '../Services/add-modify-case.service';
import { AllMasterFixedData } from '../shared/AllConstants';

@Component({
  selector: 'app-new-patient-registration',
  templateUrl: './new-patient-registration.component.html',
  styleUrls: ['./new-patient-registration.component.css']
})
export class NewPatientRegistrationComponent implements OnInit {
  Addressline1= AllMasterFixedData.Addressline1;
  Addressline2= AllMasterFixedData.Addressline2;
  Addressline3= AllMasterFixedData.Addressline3;
  Addressline4= AllMasterFixedData.Addressline4;
  EditedCaseData: NewModifyCase;
  showSearch:boolean= false;
  timeOnly:string;
  myDate:string;
  CustomID:string;
  constructor( private _router: Router,public dialogRef: MatDialogRef<NewPatientRegistrationComponent>,private addModifyCaseService: AddModifyCaseService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private datePipe: DatePipe) { 
      this.myDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy').toString();
    }
  

  ngOnInit(): void {

    //alert('hi');
    //alert("{'list':[{\'nmae\':\'ddas\'}]}");
    //var p= ("{'list':'[{\'nmae\':\'ddas\'}]'}");
    //var obj = JSON.stringify(p);
    //var obj1 = JSON.parse(obj);
    //alert(JSON.parse(obj));
    //console.log(obj);
    //var k= obj1['list'];
    //console.log('p'+ k);
    //alert(obj)  ;
   // let kk = "{'list1':'[{'nmae':'ddas'}]'}"
    //let jsonStr: string = "{'name':'[{'nmae':'ddas'}]'}"
//let jsonObj = JSON.parse(kk)
 
//let name: string = jsonObj.list1
//let property: string = jsonObj.property
 
//console.log(name);
//console.log(property);



    this.timeOnly = new Date().toLocaleTimeString(); // 11:18:48 AM
    if(this.data.animal== undefined){
      this.showSearch = true;
    }
    else{
      this.addModifyCaseService.getById(this.data.animal).subscribe(val => {
        this.EditedCaseData = val;});
    }
  }

  LoadSearchID(){
    this.addModifyCaseService.getDataWithUniqueorIPOP(this.CustomID).subscribe(val => {
      this.EditedCaseData = val;});
  }

  WithoutTime() {
    var date = new Date();
    date. setHours(0, 0, 0, 0);
    return date;
    }
    isChecked:any;
    permanentAddress:string[]=[];
    checkValue(event: any){
      //alert(event);
      if(event == 'A'){
      //this.permanentAddress = this.EditedCaseData?.Home.Address;
      this.permanentAddress = this.EditedCaseData?.Home.Address.split(',');//splits the text up in chunks
      }
      else{
        this.permanentAddress = [];
      }
   }
  myPrint(myfrm) {
    document.getElementById("printElement").style.display = "none";
    //document.getElementById("CloseMe").style.display = "none";
    if(this.showSearch == true){
      document.getElementById("searchtElement").style.display = "none";
    }
    
    document.getElementById("closePopup").style.display = "none";
    var printdata = document.getElementById('frmIndividualLapReport');
    var newwin = window.open('');
    newwin.document.write(printdata.innerHTML);
    newwin.print();
    document.getElementById("printElement").style.display = "block";
    if(this.showSearch == true){
      document.getElementById("searchtElement").style.display = "block";
    }
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

