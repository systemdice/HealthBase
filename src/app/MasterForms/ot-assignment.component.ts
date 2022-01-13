import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CategoriesService } from 'src/app/shared/categories.service';
import { Category } from 'src/app/shared/Expense.Model';
import { RefaralService } from '../Services/referal.service';
import { ReferralMaster } from '../models/UserData';
import { AllMasterFixedData } from '../shared/AllConstants';
import { interval } from 'rxjs';

@Component({
  selector: 'app-ot-assignment',
  templateUrl: './ot-assignment.component.html',
  styleUrls: ['./ot-assignment.component.css']
})
export class OtAssignmentComponent implements OnInit {
  @Input() CaseDetails;
  @Input() OTDetails : FormGroup;
  @Input() caseid:string; 
  myDate = new Date();
  @Output() getSearchStatusChange = new EventEmitter<boolean>();
  ll:string;
  OperationMajorMinorData:string[] = AllMasterFixedData.OTOperationType;
  expenses = ['Ambulance','Food.', 'Medicine', 'OTDetails','Other'];
       selected = 'Other';
  constructor(private fb: FormBuilder,private datePipe: DatePipe,private catagoryService : CategoriesService,
    public referralMasterService: RefaralService) {
    this.ll = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    // this.DoctorVisit = this.fb.group({
    //   teachers: this.fb.array([]),
    // })
  }
  OTDetailsPlaceholder:string="Enter the description";
  fromDataCategory:Category[];
  onBookChange(ob,ind) {
    //alert(ob.value);
    //console.log('Book changed...');
    let selectedBook = ob.value;
    if(selectedBook == 'Minor'){
      this.teachers().at(ind).patchValue({TotalPrice:(Number(AllMasterFixedData.OTMinor).toString())});
      //this.OTDetails.get('teachersOTDetails').get('OperationNote').patchValue('100');
      this.OTDetailsPlaceholder="Ambulance Number-Driver Name";
    }
    else{
      this.teachers().at(0).patchValue({TotalPrice:(Number(AllMasterFixedData.OTMajor).toString())})
      this.OTDetailsPlaceholder="Enter the Description";
    }
   //alert(selectedBook);
  }
  GetCategories()
  {
    this.catagoryService.GetCategories()
    .subscribe((respose) => {
        this.fromDataCategory = respose as Category[];
        this.fromDataCategory = this.fromDataCategory.filter(e=> e.CategoryType == 'Nursing');
    });
  }
  oninputChange(per: string) {
    //alert('hi');
    this.getSearchStatusChange.emit(true);
  }
   /** Teachers */
   teachers(): FormArray {
    return this.OTDetails.get("teachersOTDetails") as FormArray
  }
  
  newTeacher(): FormGroup {
    return this.fb.group({
      OperationName: [''],
      Date: [''],
      OperationType: [''],
      ConsultationDoctor: ["No"],
      AsstDoctor1: [''],
      AsstDoctor2: [''],
      Nurse1: [''],
      Nurse2: [''],
      Helper1:[''],
      Helper2:[''],
      AnastheticPerson1: [''],
      AnastheticType1: [''],
      AnastheticPerson2: [''],
      AnastheticType2: [''],
      OTTechnician1: [''],
      OTTechnician2: [''],
      OTTechnicianAsst1: [''],
      OTTechnicianAsst2: [''],
      Result: [''],
      Remarks: [''],
      TotalPrice: [''],
      OperationMajorMinor:[''],
        OperationNote:['']
      //expDate:''
    })
  }
  
  
  addTeacher() {
    this.teachers().push(this.newTeacher());
  }
  
  
  removeTeacher(ti) {
    this.teachers().removeAt(ti);
  }
    ngOnInit(): void {
      this.ll = this.datePipe.transform(this.myDate, 'dd-MM-yyyy hh:mm:ss');
      //this.addTeacher();
      if(this.caseid == '' && this.teachers().length < 1)
    {
    this.addTeacher();
    }
      //this.GetCategories();
      //this.LoadAllStaff(); // For old UI we need to uncomment beacuse we need to fill all nurse, doctor, helper, OT technician etc
    }

    referralMaster: ReferralMaster[] = [];
    NurseMaster: ReferralMaster[] = [];
    OTTechMaster: ReferralMaster[] = [];
    AnastheticPersonMaster: ReferralMaster[] = [];
    HelperMaster: ReferralMaster[] = [];
  LoadAllStaff() {
    this.referralMasterService.getAllStaffType().subscribe((data: ReferralMaster[]) => {
      //console.log(data);
      this.referralMaster = data.filter(a=> a.StaffType == 'Doctor');
      this.NurseMaster = data.filter(a=> a.StaffType == 'Nurse');
      this.OTTechMaster = data.filter(a=> a.StaffType == 'OTTechnician');
      this.AnastheticPersonMaster = data.filter(a=> a.StaffType == 'Anasthetic');
      this.HelperMaster = data.filter(a=> a.StaffType == 'Helper');

    });
  }
  LoadAllNurse() {
    this.referralMasterService.getAll().subscribe((data: ReferralMaster[]) => {
      //console.log(data);
      this.referralMaster = data;

    })
  }
  LoadAllTechnician() {
    this.referralMasterService.getAll().subscribe((data: ReferralMaster[]) => {
      //console.log(data);
      this.referralMaster = data;

    })
  }
  
  }
  