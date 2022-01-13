import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CategoriesService } from 'src/app/shared/categories.service';
import { Category } from 'src/app/shared/Expense.Model';
import { ReferralMaster } from 'src/app/models/UserData';
import { RefaralService } from 'src/app/Services/referal.service';
import { AllMasterFixedData } from 'src/app/shared/AllConstants';

@Component({
  selector: 'app-nurse-assignment',
  templateUrl: './nurse-assignment.component.html',
  styleUrls: ['./nurse-assignment.component.css']
})
export class NurseAssignmentComponent implements OnInit {
  @Input() CaseDetails;
  @Input() NurseVisit : FormGroup;
  @Input() caseid:string; 
  @Input() allStaffParm:ReferralMaster[];
  myDate = new Date();
  @Output() getSearchStatusChange = new EventEmitter<boolean>();
  ll:string;
  
  applytimeMaster = ['Morning','Afternoon','Evening','Night'];
  expenses = ['Ambulance','Food.', 'Medicine', 'NurseVisit','Other'];
       selected = 'Other';
       NurseDuty:string[] = AllMasterFixedData.NurseDutyType;
  constructor(private fb: FormBuilder,private datePipe: DatePipe,private catagoryService : CategoriesService,
    public referralMasterService: RefaralService) {
    this.ll = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    // this.DoctorVisit = this.fb.group({
    //   teachers: this.fb.array([]),
    // })
  }
  referralMaster: ReferralMaster[] = [];
  LoadAllDoctor() {
    if(this.allStaffParm.length > 0){
    this.referralMaster = this.allStaffParm.filter(x=> x.StaffType == 'Nurse');
    }
    // this.referralMasterService.getAllStaffType().subscribe((data: ReferralMaster[]) => {
    //   //console.log(data);
    //   this.referralMaster = data;//.filter(x=> x.StaffType == 'Nurse');
    //   this.referralMaster = this.referralMaster.filter(x=> x.StaffType == 'Nurse');

    // })
  }

  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['allStaffParm']) {
      this.referralMaster = this.allStaffParm.filter(x=> x.StaffType == 'Nurse');
    }
}
  NurseVisitPlaceholder:string="Enter the description";
  fromDataCategory:Category[];
  onBookChange(ob) {
    console.log('Book changed...');
    let selectedBook = ob.value;
    if(selectedBook == 'Ambulance'){
      this.NurseVisitPlaceholder="Ambulance Number-Driver Name";
    }
    else{
      this.NurseVisitPlaceholder="Enter the Description";
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
    return this.NurseVisit.get("teachersNurseVisit") as FormArray
  }
  
  newTeacher(): FormGroup {
    return this.fb.group({
      name: '',
      ExpenseDescription:'',
      Amount:'',
      expDate:[this.datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm:ss')],
      task1:'',
      task2:'',
      task3:'',
      task4:'',
      task5:'',
      task6:'',
      task7:'',
      task8:'',      
      task9:'',
      task10:'',
      drug :'',
      dose :'',
      frequency :'',
      applytime :'',
      others :'',
    //expDate:''


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
      if(this.caseid == '' && this.teachers().length <1)
    {
    this.addTeacher();
    }
      //this.GetCategories();
      this.LoadAllDoctor();
    }
  
  }
  