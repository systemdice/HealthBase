import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms'
import { LabTestMainService } from '../Services/lab-test-main.service';
import { LabTestIndividual, LabTestMaster } from '../models/UserData';
import { AddModifyCaseService } from '../Services/add-modify-case.service';
import { LabTestIndividualService } from '../Services/lab-test-individual.service';
import { DatePipe } from '@angular/common';
import { StorageService } from '../shared/storage.service';
import { AllMasterFixedData } from '../shared/AllConstants';

@Component({
  selector: 'app-lab-report-individual-all',
  templateUrl: './lab-report-individual-all.component.html',
  styleUrls: ['./lab-report-individual-all.component.css']
})
export class LabReportIndividualAllComponent implements OnInit {
  jwt: string;
  value = 'someValue12340987';
  teachersForm: FormGroup;
  Username: string;
  Role: string;
  Location:string;
  Addressline1= AllMasterFixedData.Addressline1;
    Addressline2= AllMasterFixedData.Addressline2;
    Addressline3= AllMasterFixedData.Addressline3;
    Addressline4= AllMasterFixedData.Addressline4;
  labTestMaster: LabTestMaster[];
  LabTestIndividualArray:LabTestIndividual[]
  get values(): string[] {
    this.value = this.caseData?.UnqueID + '_' + this.caseData?.Home?.FirstName;
    return this.value.split('\n');
  }


  constructor(private fb: FormBuilder, private route: ActivatedRoute,
    private router: Router, private labTestMasterService: LabTestMainService, private labTestIndividualService: LabTestIndividualService,
    private addModifyCaseService: AddModifyCaseService, private datePipe: DatePipe,private _store: StorageService,
    private _router: Router) {
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
  ngOnInit() {
    this.myDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy').toString();
    this.route.queryParams.subscribe(params => {
      this.parentTest = params['username'] || 0;
      //alert(this.usrName)
    });
    this.route.params.subscribe((params) => {
      // alert(params['id']);
      //   alert(params['testname']);
      this.TestName = params['testname'];
      this.CaseID = params['id'];
    });
    if (this.CaseID == 'Add') {
      this.updateID = null;
    }
    else {
      this.updateID = this.CaseID;
    }

    //this.addTeacher();
    this.loadAllPrameters(this.TestName);
    this.LoadCaseData(this.CaseID);
    
    
    

  }
  myval(CategoryName:string,TestName:string,param1: string, testref): string {
    var finalVal: string = 'NA';
    // alert(param1);
    // alert(testref);
    var q= this.data11.find(itm => itm.CategoryName == CategoryName &&  itm.TestName == TestName)

    var p = q.test[testref]?.batches?.find(item => {
      return item.GenderCategory == param1
    });
    if (p == null) {
      var pInn = q.test[testref]?.batches?.find(item => {
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
  data11: LabTestMaster[];
  dt = new Date();
  loadAllPrameters(testName: string) {

    this.labTestIndividualService.getAllLabIndividualByCaseID(this.CaseID, this.TestName, this.parentTest).subscribe(
      (test) => {
        if (test.length > 0) {
          if (test[0].ReportStatus == 'Final') {
            this.finalSave = true;
          }
          this.LabTestIndividualArray = test;

          this.labTestMasterService.getAll().subscribe(
            (test) => {
              if (test.length > 0) {
               this.labTestMaster= test;
               this.data11 = test;
              }
            });
        }
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