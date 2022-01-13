import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CategoriesService } from 'src/app/shared/categories.service';
import { Category } from 'src/app/shared/Expense.Model';
import { ReferralMaster } from 'src/app/models/UserData';
import { RefaralService } from 'src/app/Services/referal.service';
import { AllMasterFixedData } from 'src/app/shared/AllConstants';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrintPrescriptionComponent } from 'src/app/Reports/print-prescription.component';
import { NewModifyCase } from 'src/app/models/UserData';
import { Observable, Subscription } from 'rxjs';
import { LabReportIndividualPopupComponent } from './lab-report-individual-popup.component';

export interface DialogData {
  animal: string;
  name: string;
  hlData: string;
  patientHistory: string;
  patientDiagnosis: string;
  patientAdvice: string;
  patientPathotest: string;
  opdipd: string;
  hlAdvice: string;
  patientInfo: any;
  individualDoctorName:string;
}

@Component({
  selector: 'app-doctor-patient-assignment-redev',
  templateUrl: './doctor-patient-assignment-redev.component.html',
  styleUrls: ['./doctor-patient-assignment-redev.component.css']
})
export class DoctorPatientAssignmentRedevComponent implements OnInit {
  animal: string;
  name: string;
  hlData:string;
  patientHistory:string;
  patientDiagnosis:string;
  patientAdvice:string;
  patientPathotest:string;
  @Input() CaseDetails;
  @Input() DoctortoPatientCommentMedicineReDevelop: FormGroup;
  @Input() caseid: string;
  @Input() CaseDetailValues: any;
  @Input() PatientValues: any;
  @Input() events: Observable<string>;
  @Input() allStaffParm:ReferralMaster[];

  private eventsSubscription: Subscription;
  myDate = new Date();
  @Output() getSearchStatusChange = new EventEmitter<boolean>();
  ll: string;

  applytimeMaster = ['Morning', 'Afternoon', 'Evening', 'Night'];
  WhichTime = ['After Food', 'Before Food', 'Half n hr Before food','Half n hr after food ','Empty Stomach'];
  expenses = ['Ambulance', 'Food.', 'Medicine', 'DoctortoPatientCommentMedicineReDevelopReDevelop', 'Other'];
  selected = 'Other';
  NurseDuty: string[] = AllMasterFixedData.NurseDutyType;
  constructor(private fb: FormBuilder, private datePipe: DatePipe, private catagoryService: CategoriesService,
    public referralMasterService: RefaralService,public dialog: MatDialog) {
    this.ll = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    // this.DoctorVisit = this.fb.group({
    //   teachers: this.fb.array([]),
    // })
  }
  referralMaster: ReferralMaster[] = [];
  LoadAllDoctor() { 
    this.referralMaster = this.allStaffParm.filter(x=> x.StaffType == 'Doctor');
    // this.referralMasterService.getAllStaffType().subscribe((data: ReferralMaster[]) => {
    //   //console.log(data);
    //   this.referralMaster = data;//.filter(x=> x.StaffType == 'Nurse');
    //   this.referralMaster = this.referralMaster.filter(x => x.StaffType == 'Doctor');

    // })
  }
  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['allStaffParm']) {
      this.referralMaster = this.allStaffParm.filter(x=> x.StaffType == 'Doctor');
    }
}

  DoctortoPatientCommentMedicineReDevelopReDevelopPlaceholder: string = "Enter the description";
  fromDataCategory: Category[];
  onBookChange(ob) {
    console.log('Book changed...');
    let selectedBook = ob.value;
    if (selectedBook == 'Ambulance') {
      this.DoctortoPatientCommentMedicineReDevelopReDevelopPlaceholder = "Ambulance Number-Driver Name";
    }
    else {
      this.DoctortoPatientCommentMedicineReDevelopReDevelopPlaceholder = "Enter the Description";
    }
    //alert(selectedBook);
  }
  GetCategories() {
    this.catagoryService.GetCategories()
      .subscribe((respose) => {
        this.fromDataCategory = respose as Category[];
        this.fromDataCategory = this.fromDataCategory.filter(e => e.CategoryType == 'Nursing');
      });
  }
  oninputChange(per: string) {
    //alert('hi');
    this.getSearchStatusChange.emit(true);
  }
  /** Teachers */
  teachers(): FormArray {
    return this.DoctortoPatientCommentMedicineReDevelop.get("teachersDoctortoPatientCommentMedicineReDevelop") as FormArray
  }

  newTeacher(): FormGroup {
    return this.fb.group({
     
      name : '',
      ExpenseDescription : '',
      Amount : '',
      expDate: [this.datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm:ss')],
      DoctorComments : '',
      DoctorCommentsHL : '',
      MedicineNames : '',
      MedicineNamesHL : '',
      PatientHistory : '',
      PatientFinding : '',
      PatientDiagnosis : '',
      PatientPathoLabTestAdvice : '',

      medicines: this.fb.array([])

    })
  }


  addTeacher() {
    this.teachers().push(this.newTeacher());
    //this.addMedicines(0);
  }


  removeTeacher(ti) {
    this.teachers().removeAt(ti);
  }

   /** medicines */
 
   medicines(ti): FormArray {
    return this.teachers().at(ti).get("medicines") as FormArray
  }
 
 
  newMedicines(): FormGroup {
    return this.fb.group({     
      IndMedicineName: '',
      unit:'1',
      noOfTimes:'',
      noOfDays:'X',
      whichTime:''
    })
  }
 
  addMedicines(ti: number) {
    this.medicines(ti).push(this.newMedicines());
  }
 
  removeMedicines(ti: number, bi: number) {
    this.medicines(ti).removeAt(ti);
  }
 


  showAdvanceBoxval: string = '';

  ngOnInit(): void {
    this.eventsSubscription = this.events.subscribe((data) => this.showAdvanceBoxval = data); //data=>this.data
    this.ll = this.datePipe.transform(this.myDate, 'dd-MM-yyyy hh:mm:ss');
    //this.addTeacher();
    if (this.caseid == '') {
      this.addTeacher();
      this.addMedicines(0);
      
    }
    //this.GetCategories();
    this.LoadAllDoctor();
  }

  OpenPrescription(ti:number): void {

    //var printdata = document.getElementById('idMedicineNames').innerText;
    //var newwin = window.open("");
    //newwin.document.write(printdata.outerHTML);
    var doctorAdvice= this.DoctortoPatientCommentMedicineReDevelop.value.teachersDoctortoPatientCommentMedicineReDevelop[ti].DoctorCommentsHL+"\n"+this.DoctortoPatientCommentMedicineReDevelop.value.teachersDoctortoPatientCommentMedicineReDevelop[ti].DoctorComments;
    var aPrescription= this.DoctortoPatientCommentMedicineReDevelop.value.teachersDoctortoPatientCommentMedicineReDevelop[ti].MedicineNamesHL+"\n"+this.DoctortoPatientCommentMedicineReDevelop.value.teachersDoctortoPatientCommentMedicineReDevelop[ti].MedicineNames;
    var patientHistory= this.DoctortoPatientCommentMedicineReDevelop.value.teachersDoctortoPatientCommentMedicineReDevelop[ti].PatientHistory;
    var patientDiagnosis= this.DoctortoPatientCommentMedicineReDevelop.value.teachersDoctortoPatientCommentMedicineReDevelop[ti].PatientDiagnosis;
    var patientAdvice= this.DoctortoPatientCommentMedicineReDevelop.value.teachersDoctortoPatientCommentMedicineReDevelop[ti].PatientFinding;
    var patientPathotest= this.DoctortoPatientCommentMedicineReDevelop.value.teachersDoctortoPatientCommentMedicineReDevelop[ti].PatientPathoLabTestAdvice;
    var indvDoctorName = this.DoctortoPatientCommentMedicineReDevelop.value.teachersDoctortoPatientCommentMedicineReDevelop[ti].name;
    const dialogRef = this.dialog.open(PrintPrescriptionComponent, {
      width: '850px',
      height: '700px',
      data: {name: this.name, animal: this.animal,hlData:aPrescription,hlAdvice:doctorAdvice,
        patientHistory:patientHistory,patientDiagnosis:patientDiagnosis,
        patientAdvice:patientAdvice,patientPathotest:patientPathotest,opdipd:this.showAdvanceBoxval,
        patientInfo:this.PatientValues,individualDoctorName:indvDoctorName,
        medicines:this.DoctortoPatientCommentMedicineReDevelop.value.teachersDoctortoPatientCommentMedicineReDevelop[ti].medicines}
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
    // var aPrescription= this.DoctortoPatientCommentMedicineReDevelop.value.MedicineNamesHL+"\n"+this.DoctortoPatientCommentMedicineReDevelop.value.MedicineNames;
    // var doctorAdvice= this.DoctortoPatientCommentMedicineReDevelop.value.DoctorCommentsHL+"\n"+this.DoctortoPatientCommentMedicineReDevelop.value.DoctorComments;

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
