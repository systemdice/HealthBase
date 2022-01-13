import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Category } from '../shared/Expense.Model';
import { CategoriesService } from '../shared/categories.service';
import { ReferralMaster } from '../models/UserData';
import { RefaralService } from '../Services/referal.service';

@Component({
  selector: 'app-doctor-regular-followup',
  templateUrl: './doctor-regular-followup.component.html',
  styleUrls: ['./doctor-regular-followup.component.css']
})
export class DoctorRegularFollowupComponent implements OnInit {
  @Input() CaseDetails;
  @Input() DoctorVisit: FormGroup;
  @Input() caseid: string;
  @Input() allStaffParm: ReferralMaster[];
  myDate = new Date();
  @Output() getSearchStatusChange = new EventEmitter<boolean>();
  ll: string;

  expenses = ['Ambulance', 'Food.', 'Medicine', 'DoctorVisit', 'Other'];
  selected = 'Other';
  constructor(private fb: FormBuilder, private datePipe: DatePipe, private catagoryService: CategoriesService,
    public referralMasterService: RefaralService) {
    this.ll = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    // this.DoctorVisit = this.fb.group({
    //   teachers: this.fb.array([]),
    // })
  }
  referralMaster: ReferralMaster[] = [];
  LoadAllDoctor() {
    this.referralMaster = this.allStaffParm.filter(x => x.StaffType == 'Doctor');
    // this.referralMasterService.getAllStaffType().subscribe((data: ReferralMaster[]) => {
    //   //console.log(data);
    //   this.referralMaster = data;//.filter(x=> x.StaffType == 'Nurse');
    //   this.referralMaster = this.referralMaster.filter(x=> x.StaffType == 'Doctor');

    // })
  }
  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['allStaffParm']) {
      this.referralMaster = this.allStaffParm.filter(x => x.StaffType == 'Doctor');
    }
  }
  DoctorVisitPlaceholder: string = "Enter the description";
  onBookChange(ob) {
    console.log('Book changed...');
    let selectedBook = ob.value;
    if (selectedBook == 'Ambulance') {
      this.DoctorVisitPlaceholder = "Ambulance Number-Driver Name";
    }
    else {
      this.DoctorVisitPlaceholder = "Enter the Description";
    }
    //alert(selectedBook);
  }
  oninputChange(per: string) {
    //alert('hi');
    this.getSearchStatusChange.emit(true);
  }
  /** Teachers */
  teachers(): FormArray {
    return this.DoctorVisit.get("teachersDoctorVisit") as FormArray
  }

  newTeacher(): FormGroup {
    return this.fb.group({
      name: '',
      ExpenseDescription: '',
      Amount: '',
      expDate: [this.datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm:ss')]
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
    if (this.caseid == '' && this.teachers().length < 1) {
      this.addTeacher();
    }
    this.LoadAllDoctor();
    //this.GetCategories();
  }

  fromDataCategory: Category[];
  GetCategories() {
    this.catagoryService.GetCategories()
      .subscribe((respose) => {
        this.fromDataCategory = respose as Category[];
        this.fromDataCategory = this.fromDataCategory.filter(e => e.CategoryType == 'DoctorFollowup');
      });
  }

}
