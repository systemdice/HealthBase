
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CategoriesService } from 'src/app/shared/categories.service';
import { Category } from 'src/app/shared/Expense.Model';
import { ReferralMaster } from 'src/app/models/UserData';
import { RefaralService } from 'src/app/Services/referal.service';
import { AllMasterFixedData } from 'src/app/shared/AllConstants';

@Component({
  selector: 'app-ambulance-management',
  templateUrl: './ambulance-management.component.html',
  styleUrls: ['./ambulance-management.component.css']
})
export class AmbulanceManagementComponent implements OnInit {
  @Input() CaseDetails;
  @Input() AmbulanceVisit : FormGroup;
  @Input() caseid:string; 
  //@Input() allStaffParm:ReferralMaster[];
  myDate = new Date();
  @Output() getSearchStatusChange = new EventEmitter<boolean>();
  ll:string;
  
  expenses = ['Ambulance','Food.', 'Medicine', 'AmbulanceVisit','Other'];
       selected = 'Other';
       //AmbulanceDuty:string[] = AllMasterFixedData.AmbulanceDutyType;
  constructor(private fb: FormBuilder,private datePipe: DatePipe,private catagoryService : CategoriesService,
    public referralMasterService: RefaralService) {
    this.ll = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    // this.DoctorVisit = this.fb.group({
    //   teachers: this.fb.array([]),
    // })
  }
  referralMaster: ReferralMaster[] = [];
  LoadAllDoctor() {
    //this.referralMaster = this.allStaffParm.filter(x=> x.StaffType == 'Ambulance');
    // this.referralMasterService.getAllStaffType().subscribe((data: ReferralMaster[]) => {
    //   //console.log(data);
    //   this.referralMaster = data;//.filter(x=> x.StaffType == 'Ambulance');
    //   this.referralMaster = this.referralMaster.filter(x=> x.StaffType == 'Ambulance');

    // })
  }
  AmbulanceVisitPlaceholder:string="Enter the description";
  fromDataCategory:Category[];
  onBookChange(ob) {
    console.log('Book changed...');
    let selectedBook = ob.value;
    if(selectedBook == 'Ambulance'){
      this.AmbulanceVisitPlaceholder="Ambulance Number-Driver Name";
    }
    else{
      this.AmbulanceVisitPlaceholder="Enter the Description";
    }
   //alert(selectedBook);
  }
  onTotalKMCalculation({ target }, ti: any) {

    let unit = ((this.AmbulanceVisit.get('teachersAmbulanceVisit') as FormArray).at(ti) as FormGroup).get('perkm').value;
    let price = ((this.AmbulanceVisit.get('teachersAmbulanceVisit') as FormArray).at(ti) as FormGroup).get('totalkm').value;
    let unitValue = (unit.trim() == "" || unit == "0") ? 0 : parseFloat(unit);
    let priceValue = (price.trim() == "" || price == "0") ? 0 : parseFloat(price);
   
    //if (parseFloat(unitCount) > parseFloat(p.stockQty)) {
    //let unitCount = target.value; // ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('unit').value;
    if (unit !== null || unit == 0) {
      let total = unitValue * (priceValue );
      ((this.AmbulanceVisit.get('teachersAmbulanceVisit') as FormArray).at(ti) as FormGroup).get('Amount').patchValue(total);

    }
    else {
      ((this.AmbulanceVisit.get('teachersAmbulanceVisit') as FormArray).at(ti) as FormGroup).get('Amount').patchValue("0");

      // ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('total').patchValue("0");
      // ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('discount').patchValue("0");

    }

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
    return this.AmbulanceVisit.get("teachersAmbulanceVisit") as FormArray
  }
  
  newTeacher(): FormGroup {
    return this.fb.group({
      name: '',
      ExpenseDescription:'',
      Amount:'',
      expDate:[this.datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm:ss')],
      perkm:['12'],
      totalkm:[],
      total:[],
      drivername:[],
    


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
      //this.LoadAllDoctor();
    }
  
  }
  
