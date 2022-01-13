import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms'
import { DatePipe } from '@angular/common';
import { AddModifyCaseService } from '../Services/add-modify-case.service';
import { NewModifyCase, PaymentHistory, PrintBill } from '../models/UserData';
import { PaymentHistoryService } from '../Services/payment-history.service';
import { AllMasterFixedData } from '../shared/AllConstants';
import { PrintBillCountService } from '../Services/print-bill-count.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-lab-report',
  templateUrl: './lab-report.component.html',
  styleUrls: ['./lab-report.component.css']
})
export class LabReportComponent implements OnInit {

  templates = [];
  TotalAmountRecived: string = "0";
  Addressline1= AllMasterFixedData.Addressline1;
    Addressline2= AllMasterFixedData.Addressline2;
    Addressline3= AllMasterFixedData.Addressline3;
    Addressline4= AllMasterFixedData.Addressline4;

  asyncPipePaymentHistory: PaymentHistory[] = [];
  jwt: string;


  sampledata: any = {
    MainTest: [
      {
        name: 'Teacher 1',
        parameters: [
          { name: 'Batch No 1', students: [{ name: 'Ramesh' }, { name: 'Suresh' }, { name: 'Naresh' }] },
          { name: 'Batch No 2', students: [{ name: 'Ramesh' }, { name: 'Suresh' }, { name: 'Naresh' }] },
          { name: 'Batch No 3', students: [{ name: 'Vikas' }, { name: 'Harish' }, { name: 'Lokesh' }] },
        ]
      },
      {
        name: 'Teacher 2',
        parameters: [
          { name: 'Batch No 1', students: [{ name: 'Ramesh' }] },
          { name: 'Batch No 2', students: [{ name: 'Ramesh' }] }
        ]
      }
    ]
  };



  testData: any =
    {
      MainTest: [
        {
          "name": "Hemoglobin",
          "ShortName": null,
          "Category": "Florida",
          "Fee": 0,
          "Method": null,
          "Instrument": null,
          "ResultTypeDoc": true,
          "Notes": null,
          "Comments": null,
          "Interpretation": null,
          "validate": "",
          "userName": "",
          "cityName": "",
          "parameters": [
            {
              "Order": 1,
              "Name": "param1",
              "Unit": "g/dl",
              "InputType": "4,000 - 11,000",
              "Optional": true,
              "Removed": true
            },
            {
              "Order": 2,
              "Name": "param2",
              "Unit": "Michigan",
              "InputType": "Florida",
              "Optional": true,
              "Removed": true
            }
          ]

        }

      ]

    };
  // testDataOriginal:any={
  //   "Name": "Hemoglobin",
  //   "ShortName": null,
  //   "Category": "Florida",
  //   "Fee": 0,
  //   "Method": null,
  //   "Instrument": null,
  //   "ResultTypeDoc": true,
  //   "Notes": null,
  //   "Comments": null,
  //   "Interpretation": null,
  //   "validate": "",
  //   "userName": "",
  //   "cityName": "",
  //   "parameters": [
  //     {
  //       "Order": 1,
  //       "Name": "param1",
  //       "Unit": "Tennessee",
  //       "InputType": "Michigan",
  //       "Optional": true,
  //       "Removed": true
  //     },
  //     {
  //       "Order": 2,
  //       "Name": "param2",
  //       "Unit": "Michigan",
  //       "InputType": "Florida",
  //       "Optional": true,
  //       "Removed": true
  //     }
  //   ],
  //   "adresses": [
  //     {
  //       "Order": 1,
  //       "Name": "param1",
  //       "Unit": "Tennessee",
  //       "InputType": "Michigan",
  //       "Optional": true,
  //       "Removed": true
  //     },
  //     {
  //       "Order": 2,
  //       "Name": "param2",
  //       "Unit": "Michigan",
  //       "InputType": "Florida",
  //       "Optional": true,
  //       "Removed": true
  //     }
  //   ]
  // };

  // in component.ts
  checked: boolean = true;

  changeValue(value) {
    this.checked = !value;
  }

  data: any = {
    MainTest: [
      {
        name: 'Teacher 1',
        parameters: [
          { name: 'Batch No 1', students: [{ name: 'Ramesh' }, { name: 'Suresh' }, { name: 'Naresh' }] },
          { name: 'Batch No 2', students: [{ name: 'Ramesh' }, { name: 'Suresh' }, { name: 'Naresh' }] },
          { name: 'Batch No 3', students: [{ name: 'Vikas' }, { name: 'Harish' }, { name: 'Lokesh' }] },
        ]
      },
      {
        name: 'Teacher 2',
        parameters: [
          { name: 'Batch No 1', students: [{ name: 'Ramesh' }, { name: 'Suresh' }, { name: 'Naresh' }] },
          { name: 'Batch No 2', students: [{ name: 'Ramesh' }, { name: 'Suresh' }, { name: 'Naresh' }] },
          { name: 'Batch No 3', students: [{ name: 'Vikas' }, { name: 'Harish' }, { name: 'Lokesh' }] },
        ]
      }
    ]
  }

  getCountryByCode(code) {
    return this.data.MainTest.filter(
      function (data) { return data.name == code }
    );
  }

  value: string = "systemdice";
  get values(): string[] {
    this.value = this.EditedCaseData?.UnqueID;
    return this.EditedCaseData == undefined ? 'test'.split('\n') : this.value.split('\n');
  }

  myDate: string;
  CaseID: string;
  EditedCaseData: NewModifyCase;
  EditedCaseDataCopy: NewModifyCase;
  ngOnInit() {
    //alert(this.dataPass.caseID);
    this.MainTestForm = this.fb.group({
      MainTest: this.fb.array([]),
    })
    

    if(this.dataPass.printType == 'Billing'){
      //alert('inside bill'+this.dataPass.printType+this.dataPass.caseID)
      this.CaseID = this.dataPass.caseID;
      this.addModifyCaseService.getById(this.CaseID).subscribe(val => {
        this.EditedCaseData = val;
        this.EditedCaseDataCopy = val;
this.CaseID = val.UnqueID;
//alert(this.CaseID);
this.LoadBillIds(this.CaseID);
        this.paymentHistoryService.getPaymentsByCaseID(this.CaseID).subscribe((data: PaymentHistory[]) => {
          //console.log('jay'+data);
          this.asyncPipePaymentHistory = data;
          if(this.EditedCaseData == null){
            this.EditedCaseData = this.EditedCaseDataCopy;
           
          }

          var sum: number = 0;
          if (this.asyncPipePaymentHistory.length > 0) {
            sum = this.asyncPipePaymentHistory.map(a => a.PaidAmount).reduce(function (a, b) {
              //return a + b;
              return (a == 0 ? 0 : a) + (b == 0 ? 0 : b);
            });

            this.TotalAmountRecived = sum.toString();
            //alert('Total recived'+this.TotalAmountRecived);

          }

        });


      });
    }
    this.route.queryParams.subscribe(
      params => {
        console.log('Got the JWT as: ', params['jwt']);
        this.jwt = params['jwt'];
      }
    );

    this.myDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy').toString();

    this.route.params.subscribe((params) => {
      // alert(params['id']);
      //   alert(params['testname']);
      //this.TestName = params['testname'];
      this.CaseID = params['id'];
      this.addModifyCaseService.getById(this.CaseID).subscribe(val => {
        this.EditedCaseData = val;
        this.LoadBillIds(this.CaseID);
        this.paymentHistoryService.getPaymentsByCaseID(this.CaseID).subscribe((data: PaymentHistory[]) => {
          //console.log('jay'+data);
          this.asyncPipePaymentHistory = data;

          var sum: number = 0;
          if (this.asyncPipePaymentHistory.length > 0) {
            sum = this.asyncPipePaymentHistory.map(a => a.PaidAmount).reduce(function (a, b) {
              //return a + b;
              return (a == 0 ? 0 : a) + (b == 0 ? 0 : b);
            });

            this.TotalAmountRecived = sum.toString();
            //alert('Total recived'+this.TotalAmountRecived);

          }

        });


      });

    });
  }
  billidForCase:string;
  CategorySelected(form)
  {
    if(form.selectedIndex == 0){
      this.billidForCase = "";
      this.BillNo='';
      this.activatePrint = true;
      this.onNoClick();
  }
    else{
      //this.formDataExpense.CategoryName =this.fromDataCategory[form.selectedIndex -1].ExpenseCategory;
      this.billidForCase = form.value; //form.selectedIndex -1].Name;
      var p = this.BillIdsforThisCase.filter(a=>a.BillNo == form.value);
      this.EditedCaseData.PaymentHistory[0] = p[0].PaymentHistorySingle;
      this.TotalAmountRecived = (parseFloat(p[0].PaymentHistorySingle.Amount) - parseFloat(p[0].PaymentHistorySingle.Balance)).toString();
      //this.BillIdsforThisCase.filter(a=>a.BillNo == form.value)
      this.BillNo = p[0].BillNo;
      this.activatePrint = false;
      //console.log(this.formDataExpense.CategoryName);
    }
  }

  getBillNUmber(val){
    var splits = val.split("-");
    return splits[1] != undefined ? splits[1] :'';
  }

  MainTestForm: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute,private _router: Router, private datePipe: DatePipe,
    private addModifyCaseService: AddModifyCaseService, private printBillCountService: PrintBillCountService, 
    private paymentHistoryService: PaymentHistoryService,@Inject(MAT_DIALOG_DATA) public dataPass: any,public dialogRef: MatDialogRef<LabReportComponent>) {
    // this.MainTestForm = this.fb.group({
    //   MainTest: this.fb.array([]),
    // })
  }


  /** MainTest */
  MainTest(): FormArray {
    return this.MainTestForm.get("MainTest") as FormArray
  }

  newTeacher(): FormGroup {
    return this.fb.group({
      Name: '',
      Category: '',
      parameters: this.fb.array([])
    })
  }

  found: any;
  addTeacher() {
    this.MainTest().push(this.newTeacher());
    this.found = this.getCountryByCode('Teacher1');
  }


  removeTeacher(ti) {
    this.MainTest().removeAt(ti);
  }


  /** parameters */

  parameters(ti): FormArray {
    return this.MainTest().at(ti).get("parameters") as FormArray
  }


  newBatch(): FormGroup {
    return this.fb.group({
      DoctorInput: '',
      Name: '',
      Unit: '',
      InputType: '',
      Optional: '',
      Removed: '',
      students: this.fb.array([])
    })
  }

  addBatch(ti: number) {
    this.parameters(ti).push(this.newBatch());
  }

  removeBatch(ti: number, bi: number) {
    this.parameters(ti).removeAt(ti);
  }

  /** students */

  students(ti, bi): FormArray {
    return this.parameters(ti).at(bi).get("students") as FormArray
  }

  newStudent(): FormGroup {
    return this.fb.group({
      Name: '',
    })
  }

  addStudent(ti: number, bi: number) {
    this.students(ti, bi).push(this.newStudent());
  }

  removeStudent(ti: number, bi: number, si: number) {
    this.students(ti, bi).removeAt(si);
  }

  onSubmit() {
    console.log(this.MainTestForm.value);
  }
data11:any;
activatePrint:boolean=true;
  addAPrintBill(){
    this.activatePrint = false;
     var PB:PrintBill = new PrintBill();
     PB.BillID = this.EditedCaseData.IPDOPDId;
     PB.PaymentHistorySingle = this.EditedCaseData?.PaymentHistory[0];
    this.printBillCountService.create(PB).subscribe(
      (test) => {
        this.BillNo = test.BillNo;
        this.LoadBillIds('');
      });
  }
  BillIdsforThisCase:any[];
  LoadBillIds(CaseID){
    this.printBillCountService.getAll().subscribe(
      (test) => {
        this.BillIdsforThisCase = test.filter(a=>a.BillID == this.EditedCaseData?.IPDOPDId);
      });
  }

  //---------------
  LoadData() {

    var data = {
      MainTest: [
        {
          "Name": "Blood Test",
          "ShortName": null,
          "Category": "HAEMATOLOGY",
          "Fee": 0,
          "Method": null,
          "Instrument": null,
          "ResultTypeDoc": true,
          "Notes": null,
          "Comments": null,
          "Interpretation": null,
          "validate": "",
          "userName": "",
          "cityName": "",
          "parameters": [
            {
              "Order": 1,
              "Name": "Hemoglobin",
              "Unit": "g/dl",
              "InputType": "13 - 17",
              "Optional": true,
              "Removed": true
            },
            {
              "Order": 2,
              "Name": "Total RBC Count",
              "Unit": "million/cumm",
              "InputType": "4.5 - 5.5",
              "Optional": true,
              "Removed": true
            }
          ]

        },
        {
          "Name": "Salmonella Typhi 'O'",
          "ShortName": null,
          "Category": "SEROLOGY & IMMUNOLOGY",
          "Fee": 0,
          "Method": null,
          "Instrument": null,
          "ResultTypeDoc": true,
          "Notes": null,
          "Comments": null,
          "Interpretation": null,
          "validate": "",
          "userName": "",
          "cityName": "",
          "parameters": [
            {
              "Order": 1,
              "Name": "Basophils",
              "Unit": "%",
              "InputType": "< 2",
              "Optional": true,
              "Removed": true
            }
          ]

        }

      ]
    }

    this.clearFormArray();


    data.MainTest.forEach(t => {

      var teacher: FormGroup = this.newTeacher();
      this.MainTest().push(teacher);

      t.parameters.forEach(b => {
        var batch = this.newBatch();

        (teacher.get("parameters") as FormArray).push(batch)



      });
    });

    this.MainTestForm.patchValue(data);
  }


  clearFormArray() {

    //Angular 8 +
    this.MainTest().clear();

    //older Versions of angualar
    //while (this.MainTest().length) {
    //  this.MainTest().removeAt(0);
    //}
  }
  BillNo:string;
  myPrint(myfrm) {
    document.getElementById("printBill").style.display = "none";
    document.getElementById("printElement").style.display = "none";
    document.getElementById("printBillms1").style.display = "none";
    document.getElementById("printCheckElement").style.display = "none";
    document.getElementById("closePopup").style.display = "none";
    //document.getElementById("printCheckTextElement").style.display = "none";
    var printdata = document.getElementById(myfrm);
    var newwin = window.open("");
    newwin.document.write(printdata.outerHTML);
    newwin.print();
    document.getElementById("printBill").style.display = "block";
    document.getElementById("printElement").style.display = "block";
    document.getElementById("printCheckElement").style.display = "block";
    document.getElementById("printBillms1").style.display = "block";
    document.getElementById("closePopup").style.display = "block";
    //document.getElementById("printCheckTextElement").style.display = "block";
    newwin.close();
    
   
    
  }

  HeaderRepeat: boolean = false;

  fieldsChange(values: any): void {
    if (values.currentTarget.checked) {
      this.HeaderRepeat = true;
    }
    else {
      this.HeaderRepeat = false;
    }
  }

  getMoreInformation(): string {
    return 'Address : Home \n  Tel : Number';// \n represent break line here
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  CloseMe(){
    this._router.navigate(['/home', 37], { queryParams: { username: "ax3r5!mmmt!4rtresjjgnth"}});
  }

}