import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CategoriesService } from 'src/app/shared/categories.service';
import { Category } from 'src/app/shared/Expense.Model';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { BedManagementService } from '../Services/bed-management.service';
import { BedManagement } from '../models/UserData';
import { DateAdapter } from '@angular/material/core';


@Component({
  selector: 'app-bed-patient-management',
  templateUrl: './bed-patient-management.component.html',
  styleUrls: ['./bed-patient-management.component.css']
})
export class BedPatientManagementComponent implements OnInit {
  @Input() CaseDetails;
  @Input() BedDetailsVisit: FormGroup;
  @Input() caseid: string;
  myDate = new Date();
  @Output() getSearchStatusChange = new EventEmitter<boolean>();
  ll: string;

  expenses = ['Ambulance', 'Food.', 'Medicine', 'BedDetailsVisit', 'Other'];
  selected = 'Other';
  constructor(private fb: FormBuilder, private datePipe: DatePipe, private catagoryService: CategoriesService,
    private bedManagementService: BedManagementService, private dateAdapter: DateAdapter<Date>) {
    this.ll = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    // this.DoctorVisit = this.fb.group({
    //   teachers: this.fb.array([]),
    // })
  }
  BedDetailsVisitPlaceholder: string = "Enter the description";
  fromDataCategory: Category[];
  onBookChangeMainBed(ob, ind) {
    this.teachers().at(ind).patchValue({ BedPrice: "0" })
    //this.CreateArrFilter(ob.value,ind);
    // console.log('Book changed...');
    // let selectedBook = ob.value;
    // if(selectedBook == 'Ambulance'){
    //   this.BedDetailsVisitPlaceholder="Ambulance Number-Driver Name";
    // }
    // else{
    //   this.BedDetailsVisitPlaceholder="Enter the Description";
    // }
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
    return this.BedDetailsVisit.get("teachersBedDetailsVisit") as FormArray
  }
  DefstartDate = new Date();

  readonly selectValues = [{ type: 'location', values: ['Morroco', 'France', 'Belgium'] }, { type: 'device', values: ['phone', 'tablet'] }];

  selects: string[];

  newTeacher(): FormGroup {
    let d: Date = new Date();
    return this.fb.group({
      BedCategory: '',
      BedName: '',
      StartDate: new Date(),
      EndDate: new Date(),
      BedPrice: '',
      BedDescription: '',
      NofDays: '',
      AdmittedBy: '',
      ShiftingReason: '',
      BedCurrentStatus: '',
      BedForceRelease: 'Occupied',
      Other: '',

      //expDate:''
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

  addTeacher(ind, clk) {
    if (this.caseid == '' && this.teachers().length < 1) {
      this.teachers().push(this.newTeacher());
    }
    else {

      if (this.BedDetailsVisit.value.teachersBedDetailsVisit.length > 0) {
        //pending put a logic if any row is havving status occupied the don't allow to add new row. (Test Scenario: switch OPD IPD and vaccineation)
        if (this.BedDetailsVisit.value.teachersBedDetailsVisit[ind].BedForceRelease == 'Release') {
          this.teachers().push(this.newTeacher());
          var bedName = this.BedDetailsVisit.value.teachersBedDetailsVisit[ind].BedName;
          var bedCategory = this.BedDetailsVisit.value.teachersBedDetailsVisit[ind].BedCategory;

          var bdp = this.findthePrice(bedCategory, bedName);
          this.Calculate(null, bedName, bdp, ind);
          //this.updateOccupieStatus(bedCategory,bedName);
        }
        else {
          if (clk == 'clk') {
            alert('This Bed is occupied. Please select to assign a new Bed.')
          }
        }
      }
      else {
        this.teachers().push(this.newTeacher());
        var bedName = this.BedDetailsVisit.value.teachersBedDetailsVisit[ind].BedName;
        var bedCategory = this.BedDetailsVisit.value.teachersBedDetailsVisit[ind].BedCategory;

        var bdp = this.findthePrice(bedCategory, bedName);
        this.Calculate(null, bedName, bdp, ind);
      }
    }

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

  calculateonenddate(ind: number) {
    //this.teachers().push(this.newTeacher());
    var bedName = this.BedDetailsVisit.value.teachersBedDetailsVisit[ind].BedName;
    var bedCategory = this.BedDetailsVisit.value.teachersBedDetailsVisit[ind].BedCategory;

    var bdp = this.findthePrice(bedCategory, bedName);
    this.Calculate(null, bedName, bdp, ind);

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
    var k = this.BedDetailsVisit.value.teachersBedDetailsVisit[ind].BedName;
    return k;
  }

  removeTeacher(ti) {
    this.teachers().removeAt(ti);
  }
  data1: BedManagement;//[]=[];
  ngOnInit(): void {

    this.bedManagementService.getAll().subscribe((data: BedManagement[]) => {
      this.data1 = data[0];
      this.CreateArr();

    });
    this.ll = this.datePipe.transform(this.myDate, 'dd-MM-yyyy hh:mm:ss');

    //this.CreateArrFilter('General');
    //this.addTeacher();
    if (this.caseid == '') {

      this.addTeacher(0, '');
    }
    //this.GetCategories();
    //this.GetCategories();
    // alert(this.caseid);
    // if(this.caseid !== '' && this.teachers().length <1){
    //   this.addTeacher(0, '');
    // }
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
    var bedCategory = this.BedDetailsVisit.value.teachersBedDetailsVisit[ind].BedCategory;
    var q = this.data1.teachers.filter(a => a.name == bedCategory)
    //var p = q.batches.filter(x=>x.name==filCond);
    this.objectRoomType = [];
    // this.data1.teachers.filter(x=>x.name==filCond).forEach(t => {
    var val = q[0].batches.find(a => a.name == ob.value)
    //alert(val.price);

    this.Calculate(null, val.name, val.price, ind);

    // var bedPrice = this.data1..find(a=> a.name == ob.value)
    // let selectedBook = ob.value;
    // if(selectedBook == 'Minor'){
    //   this.teachers().at(ind).patchValue({TotalPrice:(Number(bedPrice.price).toString())});
    //   //this.OTDetails.get('teachersOTDetails').get('OperationNote').patchValue('100');
    //   //this.OTDetailsPlaceholder="Ambulance Number-Driver Name";
    // }
    // else{
    //   this.teachers().at(0).patchValue({TotalPrice:(Number("500").toString())})
    //   //this.OTDetailsPlaceholder="Enter the Description";
    // }
    //alert(selectedBook);
  }


  seatFacility: any[];
  roomNo: string;
  Calculate(facilitees: any[], roomno: string, price: string, ind: number) {
    var stDate = this.BedDetailsVisit.value.teachersBedDetailsVisit[ind].StartDate;
    var endDate = this.BedDetailsVisit.value.teachersBedDetailsVisit[ind].EndDate;
    if (stDate == '' || endDate == '') {
      alert('Please select both the Admission and release date.');
    }
    else {
      this.seatFacility = facilitees;
      this.roomNo = roomno;
      //this.BedDetailsVisit.get('BedNumber').patchValue(this.roomNo);
      //this.BedDetailsVisit.get('teachersBedDetailsVisit').get('BedPrice').patchValue(price);
      var kk = this.datePipe.transform("2021-01-06T18:30:00.000Z", 'dd-MM-yyyy');
      var kk = this.datePipe.transform("2021-01-06T18:30:00.000Z", 'dd-MM-yyyy');

      var date1 = new Date(stDate).setHours(0, 0, 0, 0);;//new Date(this.datepipe.transform(this.BedDetails.get('StartDate').value, 'dd/MM/yyyy'));
      var date2 = new Date(endDate).setHours(0, 0, 0, 0);
      // To calculate the time difference of two dates 
      var Difference_In_Time = (date2 - date1);; //(date2.getTime() - date1.getTime());
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); //(Difference_In_Time / (1000 * 3600 * 24)).toFixed();
      //alert(Difference_In_Days);
      if (Difference_In_Days == 0) {
        Difference_In_Days = 1;
      }
      //var k = this.BedDetailsVisit;
      this.teachers().at(ind).patchValue({ BedPrice: (Number(price) * (Number(Difference_In_Days))).toString() })
      this.teachers().at(ind).patchValue({ NofDays: ((Number(Difference_In_Days)).toString()) })
      //this.teachers().get('newBedDetailsVisit').get('BedPrice').patchValue('jj');

      // var p = (this.BedDetailsVisit.get("teachersBedDetailsVisit") as FormGroup);

      //p.get('BedPrice').patchValue("gg");
      //this.teachers().get('Nofdays').patchValue(Difference_In_Days);
      //this.teachers().get('BedPrice').patchValue((Number(price)*Number(Difference_In_Days)).toString());
      //(this.BedDetailsVisit.get('CaseDetails').get("TestType") as FormArray);
      //this.BedDetailsVisit.get('Nofdays').patchValue(Difference_In_Days);

      //this.BedDetailsVisit.get('BedPrice').patchValue((Number(price)*Number(Difference_In_Days)).toString());
      //this.getSearchStatusChange.emit(true);

      //var ppp = this.datePipe.transform(this.BedDetails.get('SatrtDate').value, 'dd-MM-yyyy');

      // var datePipe = new DatePipe('en-US');
      // var dateSelected =datePipe.transform("2021-01-15T18:30:00.000Z", 'dd/MM/yyyy');;
      //this.FullDayDBValueFormat =arg.dateStr;


      //this.BedDetails.get('StartDate').patchValue(moment("12/25/1995", "MM/DD/YYYY"));
      // this.BedDetails.patchValue({
      //   StartDate: moment("2021-01-15T18:30:00.000Z", "MM/DD/YYYY"),

      // });
    }


  }

}
