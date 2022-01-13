import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CategoriesService } from 'src/app/shared/categories.service';
import { Category } from 'src/app/shared/Expense.Model';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { BedManagementService } from '../Services/bed-management.service';
import { BedManagement, Vaccinations } from '../models/UserData';
import { DateAdapter } from '@angular/material/core';
import { VaccinationsCategoryService } from '../Services/vaccines-category.service';


@Component({
  selector: 'app-vaccine-patient-management', 
  templateUrl: './vaccine-patient-management.component.html',
  styleUrls: ['./vaccine-patient-management.component.css']
})
export class VaccinePatientManagementComponent implements OnInit {
  @Input() CaseDetails;
  @Input() VaccineDetailsVisit: FormGroup;
  @Input() caseid: string;
  @Input() allVaccinations:Vaccinations[]
  myDate = new Date();
  @Output() getSearchStatusChange = new EventEmitter<boolean>();
  ll: string;

  expenses = ['Ambulance', 'Food.', 'Medicine', 'VaccineDetailsVisit', 'Other'];
  selected = 'Other';
  constructor(private fb: FormBuilder, private datePipe: DatePipe, private catagoryService: CategoriesService,
    public VaccineCategoriesService: VaccinationsCategoryService,
    private bedManagementService: BedManagementService, private dateAdapter: DateAdapter<Date>) {
    this.ll = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    // this.DoctorVisit = this.fb.group({
    //   teachers: this.fb.array([]),
    // })
  }
  VaccineDetailsVisitPlaceholder: string = "Enter the description";
  fromDataCategory: Category[];
  VaccineCategories: Vaccinations[] = [];
  onBookChangeMainBed(ob, ind) {

    var p = this.VaccineCategories.find(p => p.VaccineName == ob.value)
    if (p !== undefined) {
      this.teachers().at(ind).patchValue({ BatchNumber: p.BatchNumber });
      this.teachers().at(ind).patchValue({ BrandName: p.BrandName });
      this.teachers().at(ind).patchValue({ CompanyName: p.CompanyName });
      this.teachers().at(ind).patchValue({ Unit: p.Unit });
      this.teachers().at(ind).patchValue({ Expiry: (p.ExpiryMonth + '/' + p.ExpiryYear) });

      this.teachers().at(ind).patchValue({ MRP: p.MRP });
      this.teachers().at(ind).patchValue({ Amount: p.MRP });
    }

    //this.CreateArrFilter(ob.value,ind);
    // console.log('Book changed...');
    // let selectedBook = ob.value;
    // if(selectedBook == 'Ambulance'){
    //   this.VaccineDetailsVisitPlaceholder="Ambulance Number-Driver Name";
    // }
    // else{
    //   this.VaccineDetailsVisitPlaceholder="Enter the Description";
    // }
    //alert(selectedBook);
  }
  LoadAllVaccines() {
    this.VaccineCategories = this.allVaccinations;
    // this.VaccineCategoriesService.getAll().subscribe((data: Vaccinations[]) => {
    //   //console.log(data);
    //   this.VaccineCategories = data;
    //   // Assign the data to the data source for the table to render

    // })
  }
  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['allVaccinations']) {
      this.VaccineCategories = this.allVaccinations;
    }
}
  onTotalKMCalculation({ target }, ti: any) {

    let unit = ((this.VaccineDetailsVisit.get('teachersVaccineDetailsVisit') as FormArray).at(ti) as FormGroup).get('Quantity').value;
    let price = ((this.VaccineDetailsVisit.get('teachersVaccineDetailsVisit') as FormArray).at(ti) as FormGroup).get('MRP').value;
    let unitValue = (unit.trim() == "" || unit == "0") ? 0 : parseFloat(unit);
    let priceValue = (price.trim() == "" || price == "0") ? 0 : parseFloat(price);

    //if (parseFloat(unitCount) > parseFloat(p.stockQty)) {
    //let unitCount = target.value; // ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('unit').value;
    if (unit !== null || unit == 0) {
      let total = unitValue * (priceValue);
      ((this.VaccineDetailsVisit.get('teachersVaccineDetailsVisit') as FormArray).at(ti) as FormGroup).get('Amount').patchValue(total);

    }
    else {
      ((this.VaccineDetailsVisit.get('teachersVaccineDetailsVisit') as FormArray).at(ti) as FormGroup).get('Amount').patchValue("0");

      // ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('total').patchValue("0");
      // ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('discount').patchValue("0");

    }

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
    return this.VaccineDetailsVisit.get("teachersVaccineDetailsVisit") as FormArray
  }
  DefstartDate = new Date();

  readonly selectValues = [{ type: 'location', values: ['Morroco', 'France', 'Belgium'] }, { type: 'device', values: ['phone', 'tablet'] }];

  selects: string[];

  newTeacher(): FormGroup {
    let d: Date = new Date();
    return this.fb.group({
      VaccineCategory: '',
      BrandName: '',
      CompanyName: '',
      VaccineName: '',
      Quantity: '1',
      Unit: '',
      BatchNumber: '',
      Expiry: '',
      MRP: '',
      Amount: '',
      StartDate: new Date(),
      NextVaccineDate: '',
      VaccinePrice: '',
      VaccineDescription: '',
      NofDays: '',
      DoctorAssigned: '',
      DoctorPrice: '',
      NurseAssigned: '',
      NursePrice: '',
      CurrentStatus: 'NotApplied',
      TotalPrice: '',
      Other: '',
    })
  }

  getCriteria(type) {
    const select = this.selectValues.find(_ => _.type == type);
    return select ? select.values : select;
  }
  getCriteria1(type) {
    const select = this.data1?.teachers.find(_ => _.name == type);
    var filterAvlWards = select?.batches.filter(a => a.OccupySatus == 'OPEN');
    return select ? filterAvlWards : select;
    //return select ? select.batches : select;

  }

  addTeacher(ind) {
    this.teachers().push(this.newTeacher());
    // var bedName = this.VaccineDetailsVisit.value.teachersVaccineDetailsVisit[ind].BedName;
    // var bedCategory = this.VaccineDetailsVisit.value.teachersVaccineDetailsVisit[ind].BedCategory;

    //var bdp = this.findthePrice(bedCategory,bedName);
    //this.Calculate(null,bedName,bdp,ind);
    //this.updateOccupieStatus(bedCategory,bedName);
  }

  updateOccupieStatus(type, bedName) {
    const select = this.data1.teachers.find(_ => _.name == type);
    var filterAvlWards = select.batches.find(a => a.name == bedName);
    //Find index of specific object using findIndex method.    
    var objIndex = this.data1.teachers.findIndex((obj => obj.name == type));
    var objIndexInn = this.data1.teachers[objIndex].batches.findIndex((obj => obj.name == bedName));
    filterAvlWards
    this.data1.teachers[objIndex].batches[objIndexInn].OccupySatus = "BOOKED"
  }



  findthePrice(catName, BedName): string {
    var price = "0";
    var q = this.data1?.teachers?.filter(a => a.name == catName)
    //var p = q.batches.filter(x=>x.name==filCond);
    //this.objectRoomType=[];
    // this.data1.teachers.filter(x=>x.name==filCond).forEach(t => {
    if (q == undefined) {
      return price
    }
    else {
      var val = q[0].batches.find(a => a.name == BedName)
      //alert(val.price);
      return val.price;
    }
  }

  ShowAssignedBedName(ind: number): string {
    var k = this.VaccineDetailsVisit.value.teachersVaccineDetailsVisit[ind].BedName;
    return k;
  }

  removeTeacher(ti) {
    this.teachers().removeAt(ti);
  }
  data1: BedManagement;//[]=[];
  ngOnInit(): void {
    this.LoadAllVaccines();
    // this.bedManagementService.getAll().subscribe((data: BedManagement[]) => {
    //   this.data1 = data[0];
    //   this.CreateArr();

    // });
    this.ll = this.datePipe.transform(this.myDate, 'dd-MM-yyyy hh:mm:ss');

    //this.CreateArrFilter('General');
    //this.addTeacher();
    if (this.caseid == '') {
      if( this.teachers().length <1){
      this.addTeacher(0);
      }
    }
    //this.GetCategories();
  }

  object: any = []
  object1: any = []
  object2: any = []
  objectRoomType: any = []
  newTeacherArr(t: any): any {
    return {
      name: t.name,
      price: '200'
    }
  }

  // data1:any = {
  //   teachers:[
  //     {
  //       "name": "General",
  //       "batches": [
  //         {
  //           "name": "General1",
  //           "price":"100",
  //           "OccupySatus":"OPEN"
  //         },
  //         {
  //           "name": "General 2",
  //           "price":"101", 
  //           "OccupySatus":"BOOKED"             
  //         }
  //       ]
  //     },
  //     {
  //       "name": "Casual",
  //       "batches": [
  //         {
  //           "name": "Casual2",
  //           "price":"200",
  //           "OccupySatus":"BOOKED"               
  //         },
  //         {
  //           "name": "Casual3",
  //           "price":"201",
  //           "OccupySatus":"OPEN" 
  //         }
  //       ]
  //     },
  //     {
  //       "name": "Cabin",
  //       "batches": [
  //         {
  //           "name": "Cabin2",
  //           "price":"300",
  //           "OccupySatus":"OPEN" 

  //         },
  //         {
  //           "name": "Cabin3",
  //           "price":"303",
  //           "OccupySatus":"OPEN" 
  //         }
  //       ]
  //     }
  //   ]
  // }
  CreateArr() {
    this.data1.teachers.forEach(t => {

      var teacher: any = this.newTeacherArr(t);
      this.object.push(teacher);

      t.batches.forEach(b => {
        this.object1.push(b);

      });
    });

  }

  CreateArrFilter(bedCatagory: string, filCond: string) {
    var q = this.data1.teachers.filter(a => a.name == bedCatagory)
    //var p = q.batches.filter(x=>x.name==filCond);
    this.objectRoomType = [];
    // this.data1.teachers.filter(x=>x.name==filCond).forEach(t => {
    var val = q.find(a => a.name == filCond)
    //alert(val.price);

  }
  onBookChange(ob, ind) {
    //alert(ob.value);
    //console.log('Book changed...');

  }


  seatFacility: any[];
  roomNo: string;


}

