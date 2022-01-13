import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms'
import { LabTestMainService } from '../Services/lab-test-main.service';
import { LabTestMaster } from '../models/UserData';
import { AddModifyCaseService } from '../Services/add-modify-case.service';
import { LabTestIndividualService } from '../Services/lab-test-individual.service';
import { DatePipe } from '@angular/common';
import { StorageService } from '../shared/storage.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from './DoctorNursePatho/doctot-patient-assignment.component';
import { LEFT_ARROW } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-lab-report-individual-popup',
  templateUrl: './lab-report-individual-popup.component.html',
  styleUrls: ['./lab-report-individual-popup.component.css']
})
export class LabReportIndividualPopupComponent implements OnInit {
  jwt: string;
  value = 'someValue12340987';
  teachersForm: FormGroup;
  Username: string;
  Role: string;
  Location:string;
  get values(): string[] {
    this.value = this.caseData?.UnqueID + '_' + this.caseData?.Home?.FirstName;
    return this.value.split('\n');
  }


  constructor(private fb: FormBuilder, private route: ActivatedRoute,
    private router: Router, private labTestMasterService: LabTestMainService, private labTestIndividualService: LabTestIndividualService,
    private addModifyCaseService: AddModifyCaseService, private datePipe: DatePipe,private _store: StorageService,
    private _router: Router,public dialogRef: MatDialogRef<LabReportIndividualPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.Username = this._store.sessionUsername;
      this.Role = this._store.sessionRole;
      this.Location = this._store.sessionLocation;

    this.teachersForm = this.fb.group({
      CaseID: '',
      TestName: '',
      CategoryName: '',
      DateStart: '',
      TestPrice: '',
      CreatedBy: '',
      UserName:'',
      UserRole:'',
      Location:'',
      ModifiedBy:'',
      ReportStatus: '',
      BarCodeKey: '',
      QRCodeKey: '',
      ParentTest: '',
      MoreDetails: '',
      test: this.fb.array([]),
    })
  }
  CaseID: string;
  TestName: string;
  finalSave: boolean = false;
  parentTest: string;
  myDate: string;
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.CaseID =this.data.name;
    this.TestName = this.data.animal;
    this.parentTest = this.data.hlData;
  // alert(this.data.name);
  // alert(this.data.animal);
  // alert(this.data.hlData);
    this.myDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy').toString();
    
    //this.addTeacher();
    this.loadAllPrameters(this.TestName);
    this.LoadCaseData(this.CaseID);

  }
  myval(param1: string, testref): string {
    var finalVal: string = 'NA';
    // alert(param1);
    // alert(testref);
    var p = this.data11[0].test[testref]?.batches?.find(item => {
      return item.GenderCategory == param1
    });
    if (p == null) {
      var pInn = this.data11[0].test[testref]?.batches?.find(item => {
        return item.GenderCategory == 'Genearal'
      })
      if (pInn == null) {
        //this.teachers().value.GeneralRef=p.MinRange + ' to ' + p.MaxRange;
        return 'NA';
      }
      else {
        //this.teachers().value.GeneralRef=p.MinRange + ' to ' + p.MaxRange;
        return pInn.MinRange + ' to ' + pInn.MaxRange;
      }
    }


//this.teachers().value.GeneralRef=p.MinRange + ' to ' + p.MaxRange;
    return p.MinRange + ' to ' + p.MaxRange;
  }

  myvalRangeSecurity(inputValue:string,param1: string, testref): string {
    var finalVal: string = 'NA';
    // alert(param1);
    // alert(testref);
    var p = this.data11[0].test[testref]?.batches?.find(item => {
      return item.GenderCategory == param1
    });
    if (p == null) {
      var pInn = this.data11[0].test[testref]?.batches?.find(item => {
        return item.GenderCategory == 'Genearal'
      })
      if (pInn == null) {
        return 'NA';
      }
      else {
        if(parseFloat(inputValue) <= parseFloat(pInn.MaxRange) && parseFloat(inputValue) >= parseFloat(pInn.MinRange)){
return "(Normal)";
        }
        else{
return "(Out of Rang)";
        }
        //return pInn.MinRange + ' to ' + pInn.MaxRange;
      }
    }



    return p.MinRange + ' to ' + p.MaxRange;
  }
  onSubmit() {

  }
  data11: LabTestMaster;
  dt = new Date();
  loadAllPrameters(testName: string) {
    this.labTestMasterService.getTestDetail(testName).subscribe(val => {
      this.data11 = val;
      var data = this.data11;
      this.clearFormArray();
      this.data11[0].test.forEach(t => {
        var teacher: FormGroup = this.newTeacher();
        this.teachers().push(teacher);
      });

      this.teachersForm.get('test').patchValue(this.data11[0].test);
      //this.teachersForm.patchValue({ParamterName:this.data11[0].test[0].ParamterName});

      //this.teachersForm.get('test').patchValue(this.data11[0].test);
      this.teachersForm.patchValue({ TestName: this.data11[0].TestName });
      this.teachersForm.patchValue({ CategoryName: this.data11[0].CategoryName });
      this.teachersForm.patchValue({ ParentTest: this.parentTest });

      //  this.teachersForm.patchValue({DateStart:this.data11.DateStart});
      //  this.teachersForm.patchValue({TestPrice:this.data11.TestPrice});
      //  this.teachersForm.patchValue({CreatedBy:this.data11.CreatedBy});

      this.labTestIndividualService.getLabIndividualByCaseID(this.CaseID, this.TestName, this.parentTest).subscribe(
        (test) => {
          if (test.length > 0) {
            if (test[0].ReportStatus == 'Final') {
              this.finalSave = true;
            }
            this.teachersForm.get('test').patchValue(test[0].test);
            this.teachersForm.get('MoreDetails').patchValue(test[0].MoreDetails);
          }
        });

    });
  }
  clearFormArray() {

    //Angular 8 +
    this.teachers().clear();

    //older Versions of angualar
    //while (this.teachers().length) {
    //  this.teachers().removeAt(0);
    //}
  }
  caseData: any;
  LoadCaseData(caseID: string) {
    this.addModifyCaseService.getById(caseID).subscribe(val => {
      this.caseData = val;
      var data = this.data11;
    });
  }

  /** Teachers */
  teachers(): FormArray {
    return this.teachersForm.get("test") as FormArray
  }

  newTeacher(): FormGroup {
    return this.fb.group({
      ParamterName: '',
      InputValue: '',
      Unit: '',
      GeneralRef: ''

    })
  }


  addTeacher() {
    this.teachers().push(this.newTeacher());
  }


  removeTeacher(ti) {
    this.teachers().removeAt(ti);
  }


  printPage() {
    window.print();
  }

  onPrint() {
    window.print();
  }
  numberOfUnreadAlerts: string;
  myPrint(myfrm) {
    document.getElementById("printElement").style.display = "none";
    document.getElementById("CloseMe").style.display = "none";
    var printdata = document.getElementById(myfrm);
    var newwin = window.open("");
    newwin.document.write(printdata.outerHTML);
    newwin.print();
    document.getElementById("printElement").style.display = "block";
    document.getElementById("CloseMe").style.display = "block";
    newwin.close();
  }
  SubmitButtonNameDynamically: string = "Save Lab TEST";
  updateID: string = null;

  saveLabTest(ReportDataSaveStatus: string) {
    this.teachersForm.get('CaseID').patchValue(this.CaseID);
    this.teachersForm.get('ReportStatus').patchValue(ReportDataSaveStatus);
    this.teachersForm.get('BarCodeKey').patchValue(this.caseData?.UnqueID + '_' + this.caseData?.Home?.FirstName);
    this.teachersForm.get('QRCodeKey').patchValue('NA');
    this.teachersForm.get('ParentTest').patchValue(this.parentTest);
    this.teachersForm.value.UserName = this.Username;
            this.teachersForm.value.UserRole = this.Role;
            this.teachersForm.value.Location = this.Location;

           
            
    //this.teachersForm.get('MoreDetails').patchValue(this.MoreDetails);
    //this.teachersForm.patchValue({ParentTest:this.data11[0].ParentTest});
    if (this.updateID == null) {

    }
    else {
      this.labTestIndividualService.getLabIndividualByCaseID(this.CaseID, this.TestName, this.parentTest).subscribe(
        (test) => {
          if (test.length < 1) {
            

            //alert('not find');
            this.labTestIndividualService.createStudent(this.teachersForm.value).subscribe(
              (test) => {
                // this.CaseID = test.UnqueID;
                // this.paymentDetailsTemplate.SavePaymentDetails(this.CaseID);
                // this.child.SavePatientDetails(this.CaseID);
                alert('Lab TEST data saved Successfully. Finding ID is ' + test.UnqueID);
                this.updateID = null;
                this.router.navigate(['/CaseDetails', this.CaseID]);
              });
          }
          else {

            //alert(' find');
            this.teachersForm.value.ModifiedBy = this.Username;
            this.teachersForm.value.UserRole = this.Role;
            this.labTestIndividualService.update(test[0].UnqueID, this.teachersForm.value).subscribe(() => {

              alert('Lab TEST data updated Successfully. Sataus is ' + ReportDataSaveStatus+'.');
              //this.updateID = null;
              this.router.navigate(['/CaseDetails', this.CaseID]);
            });
          }
          // this.CaseID = test.UnqueID;
          // this.paymentDetailsTemplate.SavePaymentDetails(this.CaseID);
          // this.child.SavePatientDetails(this.CaseID);
          // alert('Lab TEST data saved Successfully. ID is ' + test.UnqueID);
          // this.updateID = null;
        });


    }
    
  }

  HeaderRepeat:boolean=false;

  fieldsChange(values:any):void {
    if(values.currentTarget.checked){
    this.HeaderRepeat = true; 
    }
    else{
      this.HeaderRepeat = false;
    }
  }

  CloseMe(){
    this._router.navigate(['/home', 37], { queryParams: { username: "ax3r5!mmmt!4rtresjjgnth"}});
  }

}