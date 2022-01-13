import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms'
import { DatePipe } from '@angular/common';
import { AddModifyCaseService } from '../Services/add-modify-case.service';
import { FarmacyDeliveryToPatient, LabTestIndividual, LabTestMaster, NewModifyCase, PaymentHistory } from '../models/UserData';
import { PaymentHistoryService } from '../Services/payment-history.service';
import { FarmacyEntryService } from '../Services/farmacy-entry.service';
import { LabTestIndividualService } from '../Services/lab-test-individual.service';
import { LabTestMainService } from '../Services/lab-test-main.service';
import { AllMasterFixedData } from '../shared/AllConstants';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StorageService } from '../shared/storage.service';
export interface DialogCommonPrintData {
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
}

@Component({
  selector: 'app-discharge-report',
  templateUrl: './discharge-report.component.html',
  styleUrls: ['./discharge-report.component.css']
})
export class DischargeReportComponent implements OnInit {
  Addressline1= AllMasterFixedData.Addressline1;
  Addressline2= AllMasterFixedData.Addressline2;
  Addressline3= AllMasterFixedData.Addressline3;
  Addressline4= AllMasterFixedData.Addressline4;
  templates = [];
  TotalAmountRecived: string = "0";

  MainDischargeReport:boolean=true; // for main complete discharge report
  BillingSectionInclusion:boolean=true;

  PatientDetails:boolean=true;
  MedicineDoctorAdvice:boolean=true;
  pathoLabSection:boolean=true;
  NurseVisitDetails:boolean=true;
  DailyExpenseDetails:boolean=true;
  BedAdmissionDetails:boolean=true;
  VaccineDetails:boolean=true;
  OTDetails:boolean=true;
  FarmacyDetails:boolean=true;
  OPDDetails:boolean=true;
  AmbulanceSection:boolean=true;
  DoctorVisiting:boolean=true;
  DischargeSection:boolean=true;
  BillingSection:boolean=true;
  VaccineSection:boolean=true;


  asyncPipePaymentHistory: PaymentHistory[] = [];
  farmacyDeliveryToPatientData:FarmacyDeliveryToPatient;
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

  onNoClick(): void {
    this.dialogRef.close();
  }

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
  ngOnInit() {
    //alert(this.dataDialogue.name+'-'+this.dataDialogue.animal);
    
    this.MainTestForm = this.fb.group({
      MainTest: this.fb.array([]),
    })

   
    this.route.queryParams.subscribe(
      params => {
        console.log('Got the JWT as: ', params['jwt']);
        this.jwt = params['jwt'];
      }
    );

    this.myDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy').toString();

   

    if(this.dataDialogue.animal ==undefined)
    {
      this.MainDischargeReport = true;
      this.BillingSectionInclusion = true;
      this.route.params.subscribe((params) => {
        // alert(params['id']);
        //   alert(params['testname']);
        //this.TestName = params['testname'];
        this.CaseID = params['id'];
        this.addModifyCaseService.getById(this.CaseID).subscribe(val => {
          this.EditedCaseData = val;
  
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
  
          this.loadAllPrameters(this.CaseID);
  
          this.loadAllPrametersLAB(this.CaseID);
  
  
        });
      });
    }
    else{
      this.MainDischargeReport = false;
      this.BillingSectionInclusion = false;
      if(this.dataDialogue.name =='nurse'){
        this.MedicineDoctorAdvice=false;
        this.DailyExpenseDetails=false;
        this.NurseVisitDetails=true;
        this.BedAdmissionDetails=false;
        this.VaccineDetails=false;
        this.OTDetails=false;
        this.FarmacyDetails=false;
        this.OPDDetails=false;
        this.pathoLabSection=false;     
        this.AmbulanceSection=false;
        this.DischargeSection=false;
        this.BillingSection=false;
        this.PatientDetails=false; 
        this.DoctorVisiting=false;  
        this.VaccineSection=false;    
       
      }
      if(this.dataDialogue.name =='Bed'){
        this.MedicineDoctorAdvice=false;
        this.DailyExpenseDetails=false;
        this.NurseVisitDetails=false;
        this.BedAdmissionDetails=true;
        this.VaccineDetails=false;
        this.OTDetails=false;
        this.FarmacyDetails=false;
        this.OPDDetails=false;
        this.pathoLabSection=false;     
        this.AmbulanceSection=false;
        this.DischargeSection=false;
        this.BillingSection=false;
        this.PatientDetails=false;
        this.DoctorVisiting=false;
        this.VaccineSection=false;
       
      }
      if(this.dataDialogue.name =='prescription'){
        this.MedicineDoctorAdvice=true;
        this.DailyExpenseDetails=false;
        this.NurseVisitDetails=false;
        this.BedAdmissionDetails=false;
        this.VaccineDetails=false;
        this.OTDetails=false;
        this.FarmacyDetails=false;
        this.OPDDetails=false;
        this.pathoLabSection=false;     
        this.AmbulanceSection=false;
        this.DischargeSection=false;
        this.BillingSection=false;
        this.PatientDetails=false;
        this.DoctorVisiting=false;
        this.VaccineSection=false;
       
      }
      if(this.dataDialogue.name =='OT'){
        this.MedicineDoctorAdvice=false;
        this.DailyExpenseDetails=false;
        this.NurseVisitDetails=false;
        this.BedAdmissionDetails=false;
        this.VaccineDetails=false;
        this.OTDetails=true;
        this.FarmacyDetails=false;
        this.OPDDetails=false;
        this.pathoLabSection=false;     
        this.AmbulanceSection=false;
        this.DischargeSection=false;
        this.BillingSection=false;
        this.PatientDetails=false;
        this.DoctorVisiting=false;
        this.VaccineSection=false;
       
      }
      if(this.dataDialogue.name =='Pharmacy'){
        this.MedicineDoctorAdvice=false;
        this.DailyExpenseDetails=false;
        this.NurseVisitDetails=false;
        this.BedAdmissionDetails=false;
        this.VaccineDetails=false;
        this.OTDetails=false;
        this.FarmacyDetails=true;
        this.OPDDetails=false;
        this.pathoLabSection=false;     
        this.AmbulanceSection=false;
        this.DischargeSection=false;
        this.BillingSection=false;
        this.PatientDetails=false;
        this.DoctorVisiting=false;
        this.VaccineSection=false;
       
      }
      if(this.dataDialogue.name =='patient'){
        this.MedicineDoctorAdvice=false;
        this.DailyExpenseDetails=false;
        this.NurseVisitDetails=false;
        this.BedAdmissionDetails=false;
        this.VaccineDetails=false;
        this.OTDetails=false;
        this.FarmacyDetails=false;
        this.OPDDetails=false;
        this.pathoLabSection=false;     
        this.AmbulanceSection=false;
        this.DischargeSection=false;
        this.BillingSection=false;
        this.PatientDetails=true;
        this.DoctorVisiting=false;
        this.VaccineSection=false;
       
      }
      if(this.dataDialogue.name =='DailyExp'){
        this.MedicineDoctorAdvice=false;
        this.DailyExpenseDetails=true;
        this.NurseVisitDetails=false;
        this.BedAdmissionDetails=false;
        this.VaccineDetails=false;
        this.OTDetails=false;
        this.FarmacyDetails=false;
        this.OPDDetails=false;
        this.pathoLabSection=false;     
        this.AmbulanceSection=false;
        this.DischargeSection=false;
        this.BillingSection=false;
        this.PatientDetails=false;
        this.DoctorVisiting=false;
        this.VaccineSection=false;
       
      }
      if(this.dataDialogue.name =='Lab'){
        this.MedicineDoctorAdvice=false;
        this.DailyExpenseDetails=false;
        this.NurseVisitDetails=false;
        this.BedAdmissionDetails=false;
        this.VaccineDetails=false;
        this.OTDetails=false;
        this.FarmacyDetails=false;
        this.OPDDetails=false;
        this.pathoLabSection=true;     
        this.AmbulanceSection=false;
        this.DischargeSection=false;
        this.BillingSection=false;
        this.PatientDetails=false;
        this.DoctorVisiting=false;
        this.VaccineSection=false;
       
      }
      if(this.dataDialogue.name =='Ambulance'){
        this.MedicineDoctorAdvice=false;
        this.DailyExpenseDetails=false;
        this.NurseVisitDetails=false;
        this.BedAdmissionDetails=false;
        this.VaccineDetails=false;
        this.OTDetails=false;
        this.FarmacyDetails=false;
        this.OPDDetails=false;
        this.pathoLabSection=false;     
        this.AmbulanceSection=true;
        this.DischargeSection=false;
        this.BillingSection=false;
        this.PatientDetails=false;
        this.DoctorVisiting=false;
        this.VaccineSection=false;
       
      }
      if(this.dataDialogue.name =='DoctorVisit'){
        this.MedicineDoctorAdvice=false;
        this.DailyExpenseDetails=false;
        this.NurseVisitDetails=false;
        this.BedAdmissionDetails=false;
        this.VaccineDetails=false;
        this.OTDetails=false;
        this.FarmacyDetails=false;
        this.OPDDetails=false;
        this.pathoLabSection=false;     
        this.AmbulanceSection=false;
        this.DischargeSection=false;
        this.BillingSection=false;
        this.PatientDetails=false;
        this.DoctorVisiting=true;
        this.VaccineSection=false;
       
      }
      if(this.dataDialogue.name =='DischargeaRep'){
        this.MedicineDoctorAdvice=false;
        this.DailyExpenseDetails=false;
        this.NurseVisitDetails=false;
        this.BedAdmissionDetails=false;
        this.VaccineDetails=false;
        this.OTDetails=false;
        this.FarmacyDetails=false;
        this.OPDDetails=false;
        this.pathoLabSection=false;     
        this.AmbulanceSection=false;
        this.DischargeSection=true;
        this.BillingSection=false;
        this.PatientDetails=false;
        this.DoctorVisiting=false;
        this.VaccineSection=false;
       
      }
      if(this.dataDialogue.name =='Vaccine'){
        this.MedicineDoctorAdvice=false;
        this.DailyExpenseDetails=false;
        this.NurseVisitDetails=false;
        this.BedAdmissionDetails=false;
        this.VaccineDetails=true;
        this.OTDetails=false;
        this.FarmacyDetails=false;
        this.OPDDetails=false;
        this.pathoLabSection=false;     
        this.AmbulanceSection=false;
        this.DischargeSection=false;
        this.BillingSection=false;
        this.PatientDetails=false;
        this.DoctorVisiting=false;
        this.VaccineSection=true;
       
      }
      this.CaseID = this.dataDialogue.animal;
       //this.CaseID = params['id'];
       this.addModifyCaseService.getById(this.CaseID).subscribe(val => {
        this.EditedCaseData = val;

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

        this.loadAllPrameters(this.CaseID);

        this.loadAllPrametersLAB(this.CaseID);


      });
    }

    
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
finalVal(){
  var a= this.EditedCaseData?.PaymentHistory[0]?.Amount;
  var b = parseFloat(this.EditedCaseData?.PaymentHistory[0]?.OPDCharge);
  return a+b;
}

  MainTestForm: FormGroup;
  Username: string;
Role: string;
Location: string;
storename: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute,private _router: Router, private datePipe: DatePipe,
    private addModifyCaseService: AddModifyCaseService, private paymentHistoryService: PaymentHistoryService,private _store: StorageService,
    public farmacyEntryService: FarmacyEntryService,private labTestIndividualService: LabTestIndividualService,
    private labTestMasterService: LabTestMainService, @Inject(MAT_DIALOG_DATA) public dataDialogue: DialogCommonPrintData,
    public dialogRef: MatDialogRef<DischargeReportComponent>) {
    // this.MainTestForm = this.fb.group({
    //   MainTest: this.fb.array([]),
    // })
    this.Username = this._store.sessionUsername;
    this.Role = this._store.sessionRole;
    this.Location = this._store.sessionLocation;
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

  myPrint(myfrm) {
    document.getElementById("printElement").style.display = "none";
    //document.getElementById("CloseMe").style.display = "none";
    document.getElementById("printCheckElement").style.display = "none";
    document.getElementById("closePopup").style.display = "none";
    var printdata = document.getElementById(myfrm);
    var newwin = window.open("");
    newwin.document.write(printdata.innerHTML);
    newwin.print();
    document.getElementById("printElement").style.display = "block";
    document.getElementById("printCheckElement").style.display = "block";
    //document.getElementById("CloseMe").style.display = "block";
    document.getElementById("closePopup").style.display = "block";
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

  CloseMe(){
    this._router.navigate(['/home', 37], { queryParams: { username: "ax3r5!mmmt!4rtresjjgnth"}});
    this.onNoClick();
  }

  loadAllPrameters(testName: string) {
    this.farmacyEntryService.getByCaseId(this.CaseID,this.Username).subscribe((data: FarmacyDeliveryToPatient) => {
      this.farmacyDeliveryToPatientData = data;
    });
     
      
    }

    LabTestIndividualArray:LabTestIndividual[];
    DentalTestIndividualArray:LabTestIndividual[]
    labTestMaster: LabTestMaster[];
    dentalTestMaster: LabTestMaster[];
    data11: LabTestMaster[];
    data11Dental: LabTestMaster[];
    loadAllPrametersLAB(testName: string) {

      this.labTestIndividualService.getAllLabIndividualByCaseID(this.CaseID, 'Final', 'LAB').subscribe(
        (test) => {
          if (test.length > 0) {
            
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

        this.labTestIndividualService.getAllLabIndividualByCaseID(this.CaseID, 'Final', 'DENTAL').subscribe(
          (test) => {
            if (test.length > 0) {
              
              this.DentalTestIndividualArray = test;
    
              this.labTestMasterService.getAll().subscribe(
                (test) => {
                  if (test.length > 0) {
                   this.dentalTestMaster= test;
                   this.data11Dental = test;
                  }
                });
            }
          });
  
  
      
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
    myvalDental(CategoryName:string,TestName:string,param1: string, testref): string {
      var finalVal: string = 'NA';
      // alert(param1);
      // alert(testref);
      var q= this.data11Dental.find(itm => itm.CategoryName == CategoryName &&  itm.TestName == TestName)
  
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

}