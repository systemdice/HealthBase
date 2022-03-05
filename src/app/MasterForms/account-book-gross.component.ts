import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort } from '@angular/material';
import { MatDialogModule, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AddModifyCaseService } from '../Services/add-modify-case.service';
import { LabTestIndividual, NewModifyCase, NotifyPendingTestData } from '../models/UserData';
import { ActivatedRoute, Router } from '@angular/router';
import { StringDecoder } from 'string_decoder';
import { LabTestIndividualService } from '../Services/lab-test-individual.service';
import { DatePipe } from '@angular/common';
import { StorageService } from '../shared/storage.service';
import { LeaveRequestMainComponent } from './leave-request-main.component';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgDialogAnimationService } from "ng-dialog-animation";
import { BedAvailabilityManagementComponent } from './bed-availability-management.component';
import { LabReportComponent } from './lab-report.component';
import { CasePaymentFilterComponent } from './case-payment-filter.component';
import { TableUtil } from '../shared/tableUtil';
import * as XLSX from 'xlsx';
import { BedManagementService } from '../Services/bed-management.service';
import { AllMasterFixedData } from '../shared/AllConstants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-account-book-gross',
  templateUrl: './account-book-gross.component.html',
  styleUrls: ['./account-book-gross.component.css']
})
export class AccountBookGrossComponent implements OnInit {
  displayedColumns: string[] = ['slno', 'dt', 'amount'];
  //dataSource: MatTableDataSource<UsersData>;
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  //@ViewChild(MatPaginator, {static:true})// paginator: MatPaginator;  
  actualPaginator: MatPaginator;
  patientCategory: FormGroup;
  fb: any;
  @ViewChild(MatPaginator, { static: true })
  set paginator(value: MatPaginator) {
    this.actualPaginator = value;
  }

  actualSort: MatSort;
  @ViewChild(MatSort, { static: true })
  set sort(value: MatSort) {
    this.actualSort = value;
  }

  // @ViewChild(MatSort,{static:true}) sort: MatSort;
  filterVal: string = '';
  Username: string;
  Role: string;
  Location: string;
  NameIncaseDoctorRole: string;
  IncomeDeptType: string[] = AllMasterFixedData.IncomeDeptType;


  asyncPipeNewModifyCase: NewModifyCase[] = [];
  asyncPipeNewModifyCaseBackup: NewModifyCase[] = [];
  selections: string[];

  constructor(private _fb: FormBuilder, private addModifyCaseService: AddModifyCaseService, private labTestIndividualService: LabTestIndividualService,
    private dialog: MatDialog, private _router: Router, private _store: StorageService, private bedManagementService: BedManagementService,
    private router: Router, private route: ActivatedRoute, private datePipe: DatePipe, public dialog1: NgDialogAnimationService
  ) {
    this.Username = this._store.sessionUsername;
    this.Role = this._store.sessionRole;
    this.Location = this._store.sessionLocation;
    //this.selections = this.IncomeDeptType.filter(t => t == 'All');
  }

  asyncPi: NotifyPendingTestData[] = [];
  CaseID: string = '';
  UserName: string = '';
  showAll: boolean = true;
  showPrintoption: boolean = false;
  NDaysData: number = 5;
  ConvertStringToNumber(input1: string, input2: string) {
    var numeric1 = parseFloat(input1);
    var numeric2 = parseFloat(input2);
    return numeric1 + numeric2;
  }
  exportArray() {

    TableUtil.exportArrayToExcel(this.asyncPipeNewModifyCase, "CaseData");
  }
  ngOnInit() {
    this.patientCategory = this._fb.group({
      patientCategory: [null, Validators.required]
    });

    const toSelect = "All";
    this.patientCategory.get('patientCategory').setValue(toSelect);

    if (this.Role == 'Admin' || this.Role == 'SuperAdmin' || this.Role == 'Account' || this.Role == 'Reception') {
      this.showPrintoption = true;
    }
    this.route.params.subscribe((params) => {
      // alert(params['id']);
      //   alert(params['testname']);
      //this.TestName = params['testname'];
      this.CaseID = params['id'];
      //alert(this.CaseID);
      this.UserName = this.CaseID;
      //this.filterVal = this.CaseID;
      //this.applyFilter(this.CaseID);
      //this.LoadNDaysData(1);
      this.showAll = false;
    });
    //this.filterVal='221272100';
    // this.addModifyCaseService.getAllPendingTests().subscribe((data: NotifyPendingTestData[]) => {
    //   //console.log('jay'+data);
    //   this.asyncPi = data;
    // })



    // this.asyncPipeNewModifyCase$ = this.addModifyCaseService.c();
    // console.log(this.asyncPipeNewModifyCase$);
    //console.log("rajat")
    this.AllTestStatus();
  }

  LoadNDaysData(noofdays: number) {
    this.addModifyCaseService.getLastNDaysCase(noofdays).subscribe((data: NewModifyCase[]) => {
      //console.log('jay'+data);
      if (this.Role == 'Admin' || this.Role == 'SuperAdmin' || this.Role == 'Patho') {
        this.asyncPipeNewModifyCase = data;
        this.asyncPipeNewModifyCaseBackup = data;
      }
      else if (this.Role == 'Doctor') {

        this.asyncPipeNewModifyCase = data.filter(a => a.Home.RefferDoctorName != null && a.Home.RefferDoctorName == this.Username);
        this.asyncPipeNewModifyCaseBackup = data.filter(a => a.Home.RefferDoctorName != null && a.Home.RefferDoctorName == this.Username);
      }
      else {

        this.asyncPipeNewModifyCase = data.filter(a => a.Location == this.Location);
        this.asyncPipeNewModifyCaseBackup = data.filter(a => a.Location == this.Location);
      }
      if (this.CaseID != undefined) {
        if (this.showAll == false && this.CaseID.trim() !== '') {
          this.asyncPipeNewModifyCase = this.asyncPipeNewModifyCase.filter(a => a.UnqueID == this.CaseID);
        }
      }


      this.dataSource = new MatTableDataSource(this.asyncPipeNewModifyCase);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';
      //this.GroupedDat();

    })
  }

  LoadAllCases() {
    this.addModifyCaseService.getAll().subscribe((data: NewModifyCase[]) => {
      //console.log('jay'+data);
      if (this.Role == 'Admin' || this.Role == 'SuperAdmin' || this.Role == 'Patho') {
        this.asyncPipeNewModifyCase = data;
        this.asyncPipeNewModifyCaseBackup = data;
      }
      else if (this.Role == 'Doctor') {

        this.asyncPipeNewModifyCase = data.filter(a => a.Home.RefferDoctorName != null && a.Home.RefferDoctorName == this.Username);
        this.asyncPipeNewModifyCaseBackup = data.filter(a => a.Home.RefferDoctorName != null && a.Home.RefferDoctorName == this.Username);
      }
      else {

        this.asyncPipeNewModifyCase = data.filter(a => a.Location == this.Location);
        this.asyncPipeNewModifyCaseBackup = data.filter(a => a.Location == this.Location);
      }
      if (this.CaseID != undefined) {
        if (this.showAll == false && this.CaseID.trim() !== '') {
          this.asyncPipeNewModifyCase = this.asyncPipeNewModifyCase.filter(a => a.UnqueID == this.CaseID);
        }
      }


      // this.asyncPipeNewModifyCase = this.asyncPipeNewModifyCaseBackup;
      // this.filterVal = '';

      // this.dataSource = new MatTableDataSource(this.asyncPipeNewModifyCase);
      // this.dataSource.paginator = this.actualPaginator; //this.paginator;
      // this.dataSource.sort = this.actualSort; //this.sort;
      // this.filterVal = '';


      this.dataSource = new MatTableDataSource(this.asyncPipeNewModifyCase);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';
      //this.GroupedDat();

    })
  }

  OPDCharge: boolean = false;
  DoctorCharge: boolean = false;
  NurseCharge: boolean = false;
  LabTestCharge: boolean = false;
  FarmaCharge: boolean = false;
  BedCharge: boolean = false;
  DailyExpense: boolean = false;
  OTCharge: boolean = false;
  OtherCharge: boolean = false;
  RegdCharge: boolean = false;
  EarlierPayment: boolean = false;
  caseRecordTotal: boolean = false;
  changeValue(value: any) {
    //alert(value);
    this.EarlierPayment = false;
    this.OPDCharge = false;
    this.DoctorCharge = false;
    this.NurseCharge = false;
    this.LabTestCharge = false;
    this.FarmaCharge = false;
    this.BedCharge = false;
    this.DailyExpense = false;
    this.OTCharge = false;
    this.OtherCharge = false;
    this.RegdCharge = false;
    this.caseRecordTotal = false;
    this.total = 0;
    if (value == 'All') {
      this.EarlierPayment = true;
      this.OPDCharge = true;
      this.DoctorCharge = true;
      this.NurseCharge = true;
      this.LabTestCharge = true;
      this.FarmaCharge = true;
      this.BedCharge = true;
      this.DailyExpense = true;
      this.OTCharge = true;
      this.OtherCharge = true;
      this.RegdCharge = true;
      this.caseRecordTotal = true;

      for (var i = 0; i < this.asyncPipeNewModifyCase.length; i++) {  //loop through the array
        var earlierPayment = this.asyncPipeNewModifyCase[i].PaymentHistory[0].EarlierPayment == '' ? '0' : this.asyncPipeNewModifyCase[i].PaymentHistory[0].EarlierPayment;
        this.total += +this.asyncPipeNewModifyCase[i].PaymentHistory[0].Amount + +earlierPayment;  //Do the math!
      }
      this.total = Math.round(this.total);
    }
    else if (value == 'OPDCharge') {
      this.OPDCharge = true;
      for (var i = 0; i < this.asyncPipeNewModifyCase.length; i++) {  //loop through the array
        this.total += +this.asyncPipeNewModifyCase[i].PaymentHistory[0].OPDCharge;  //Do the math!
      }
    }
    else if (value == 'DoctorCharge') {
      this.DoctorCharge = true;
      for (var i = 0; i < this.asyncPipeNewModifyCase.length; i++) {  //loop through the array
        this.total += +this.asyncPipeNewModifyCase[i].PaymentHistory[0].DoctorCharge;  //Do the math!
      }
    }
    else if (value == 'LabTestCharge') {
      this.LabTestCharge = true;
    }
    else if (value == 'FarmaCharge') {
      this.FarmaCharge = true;
    }
    else if (value == 'BedCharge') {
      this.BedCharge = true;
      for (var i = 0; i < this.asyncPipeNewModifyCase.length; i++) {  //loop through the array
        this.total += +this.asyncPipeNewModifyCase[i].PaymentHistory[0].BedCharge;  //Do the math!
      }
    }
    else if (value == 'DailyExpense') {
      this.DailyExpense = true;
    }
    else if (value == 'NurseCharge') {
      this.NurseCharge = true;
    }
    else if (value == 'EarlierPayment') {
      this.EarlierPayment = true;
    }
  }
  saveLabTest() {
    //alert('abc');
    this.LoadAllCases();

  }
  myDate: string;
  ShowTodaysData() {
    //alert('abc');
    this.myDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy').toString();
    //var myDate1 = this.datePipe.transform(new Date(new Date().getTime()-(1*24*60*60*1000)), 'dd-MM-yyyy').toString();
    var myDate1 = this.datePipe.transform(new Date(new Date().getTime()), 'dd-MM-yyyy').toString();

    //alert(myDate1);
    //this.asyncPipeNewModifyCase = this.asyncPipeNewModifyCaseBackup.filter(a=> a.DateStart == this.myDate);
    this.asyncPipeNewModifyCase = this.asyncPipeNewModifyCaseBackup.filter(a => a.DateStart == myDate1);
    this.filterVal = '';

    this.dataSource = new MatTableDataSource(this.asyncPipeNewModifyCase);
    this.dataSource.paginator = this.actualPaginator; //this.paginator;
    this.dataSource.sort = this.actualSort; //this.sort;
    this.filterVal = '';

  }
  passdate: string;
  ShowTodaysDataFromCalendar(passdate) {


    this.addModifyCaseService.getAnydaysCase(this.datePipe.transform(new Date(passdate), 'dd-MM-yyyy').toString()).subscribe((data: NewModifyCase[]) => {
      //console.log('jay'+data);
      if (this.Role == 'Admin' || this.Role == 'SuperAdmin' || this.Role == 'Patho') {
        this.asyncPipeNewModifyCase = data;
        this.asyncPipeNewModifyCaseBackup = data;
      }
      else if (this.Role == 'Doctor') {

        this.asyncPipeNewModifyCase = data.filter(a => a.Home.RefferDoctorName != null && a.Home.RefferDoctorName == this.Username);
        this.asyncPipeNewModifyCaseBackup = data.filter(a => a.Home.RefferDoctorName != null && a.Home.RefferDoctorName == this.Username);
      }
      else {

        this.asyncPipeNewModifyCase = data.filter(a => a.Location == this.Location);
        this.asyncPipeNewModifyCaseBackup = data.filter(a => a.Location == this.Location);
      }
      if (this.CaseID != undefined) {
        if (this.showAll == false && this.CaseID.trim() !== '') {
          this.asyncPipeNewModifyCase = this.asyncPipeNewModifyCase.filter(a => a.UnqueID == this.CaseID);
        }
      }


      this.dataSource = new MatTableDataSource(this.asyncPipeNewModifyCase);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';
      //this.GroupedDat();

    })
    //alert(passdate);
    // this.myDate = this.datePipe.transform(new Date(passdate), 'dd-MM-yyyy').toString();
    // //alert(this.myDate);
    // //var myDate1 = this.datePipe.transform(new Date(new Date().getTime()-(1*24*60*60*1000)), 'dd-MM-yyyy').toString();
    // var myDate1 = this.datePipe.transform(new Date(new Date().getTime()), 'dd-MM-yyyy').toString();

    // //alert(myDate1);
    // //this.asyncPipeNewModifyCase = this.asyncPipeNewModifyCaseBackup.filter(a=> a.DateStart == this.myDate);
    // this.asyncPipeNewModifyCase = this.asyncPipeNewModifyCaseBackup.filter(a => a.DateStart == this.myDate);
    // this.filterVal = '';

    this.dataSource = new MatTableDataSource(this.asyncPipeNewModifyCase);
    this.dataSource.paginator = this.actualPaginator; //this.paginator;
    this.dataSource.sort = this.actualSort; //this.sort;
    this.filterVal = '';

  }
  fromdate: string;
  todate: string;
  ShowFromToDataFromCalendar(fromdateParam, todateParam) {

    if (new Date(fromdateParam) > new Date(todateParam)) {
      alert('From Date can not be greater than To date');
      return;
    }
    else {
      this.addModifyCaseService.getDateRangeCase(this.datePipe.transform(new Date(fromdateParam), 'dd-MM-yyyy').toString(), this.datePipe.transform(new Date(todateParam), 'dd-MM-yyyy').toString()).subscribe((data: NewModifyCase[]) => {
        //console.log('jay'+data);
        if (this.Role == 'Admin' || this.Role == 'SuperAdmin' || this.Role == 'Patho') {
          this.asyncPipeNewModifyCase = data;
          this.asyncPipeNewModifyCaseBackup = data;
        }
        else if (this.Role == 'Doctor') {

          this.asyncPipeNewModifyCase = data.filter(a => a.Home.RefferDoctorName != null && a.Home.RefferDoctorName == this.Username);
          this.asyncPipeNewModifyCaseBackup = data.filter(a => a.Home.RefferDoctorName != null && a.Home.RefferDoctorName == this.Username);
        }
        else {

          this.asyncPipeNewModifyCase = data.filter(a => a.Location == this.Location);
          this.asyncPipeNewModifyCaseBackup = data.filter(a => a.Location == this.Location);
        }
        if (this.CaseID != undefined) {
          if (this.showAll == false && this.CaseID.trim() !== '') {
            this.asyncPipeNewModifyCase = this.asyncPipeNewModifyCase.filter(a => a.UnqueID == this.CaseID);
          }
        }


        this.dataSource = new MatTableDataSource(this.asyncPipeNewModifyCase);
        this.dataSource.paginator = this.actualPaginator; //this.paginator;
        this.dataSource.sort = this.actualSort; //this.sort;
        this.filterVal = '';
        //this.GroupedDat();

      })


      this.dataSource = new MatTableDataSource(this.asyncPipeNewModifyCase);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';
    }


  }

  total: number;
  //deptwise variable
  ttlEarlierPayment: number;
  ttlCollectionChargePaid: number;
  ttlOPDCharge: number;
  ttlDoctorCharge: number;
  ttlNurseCharge: number;
  ttlLabTestCharge: number;
  ttlFarmaCharge: number;
  ttlBedCharge: number;
  ttlDailyExpense: number;
  ttlOTCharge: number;
  ttlOtherCharge: number;
  ttlRegdCharge: number;
  //ended
  nurseShow: boolean = false;
  departmentwiseShow:boolean=false;
  GrossWiseShow:boolean= true
  myresult = [];
  //result:any[]=[{ dt: '', amount: 0 }];
  ShowBalnacesheetFromToDataFromCalendar(fromdateParam, todateParam) {
    this.departmentwiseShow = false;
    this.GrossWiseShow = true;
    if (new Date(fromdateParam) > new Date(todateParam)) {
      alert('From Date can not be greater than To date');
      return;
    }
    else {
      this.nurseShow = true;
      this.addModifyCaseService.getDateRangeBalanceSheet(this.datePipe.transform(new Date(fromdateParam), 'dd-MM-yyyy').toString(), this.datePipe.transform(new Date(todateParam), 'dd-MM-yyyy').toString()).subscribe((data: NewModifyCase[]) => {
        //console.log('jay'+data);
        if (this.Role == 'Admin' || this.Role == 'SuperAdmin' || this.Role == 'Patho') {
          this.asyncPipeNewModifyCase = data;
          this.asyncPipeNewModifyCaseBackup = data;
          var filteredStudents = this.asyncPipeNewModifyCase[0].PaymentHistory;
          this.total = 0;  //set a variable that holds our total
          var taxes = filteredStudents[0].RegdCharge;  //reference the element in the "JSON" aka object literal we want

          for (var i = 0; i < this.asyncPipeNewModifyCase.length; i++) {  //loop through the array
            var earlierPayment = this.asyncPipeNewModifyCase[i].PaymentHistory[0].EarlierPayment == '' ? '0' : this.asyncPipeNewModifyCase[i].PaymentHistory[0].EarlierPayment;
            this.total += +this.asyncPipeNewModifyCase[i].PaymentHistory[0].Amount + +earlierPayment; // +this.asyncPipeNewModifyCase[i].PaymentHistory[0].EarlierPayment;  //Do the math!
          }
          this.total = Math.round(this.total);
          console.log(this.total);  //display the result
          
      

          let NAMES = [];

          for (var i = 0; i < this.asyncPipeNewModifyCase.length; i++) {
            let totalInn = 0;
            let earlierPayment1 = this.asyncPipeNewModifyCase[i].PaymentHistory[0].EarlierPayment == '' ? '0' : this.asyncPipeNewModifyCase[i].PaymentHistory[0].EarlierPayment;
            totalInn = +this.asyncPipeNewModifyCase[i].PaymentHistory[0].Amount + +earlierPayment1;


            let newName = {

              amount: totalInn,
              dt: this.asyncPipeNewModifyCase[i].DateStart.toString(),
              ct: 1
            };
            NAMES.push(newName);
          }

          console.log(NAMES);

          var result = [];
          NAMES.reduce(function (res, value) {
            if (!res[value.dt]) {
              res[value.dt] = { dt: value.dt, amount: 0, ct: 0 };
              result.push(res[value.dt])
            }
            res[value.dt].amount += value.amount;
            res[value.dt].ct += value.ct;
            return res;
          }, {});
          this.myresult = [...result];
          console.log(result)


        }
        else if (this.Role == 'Doctor') {

          this.asyncPipeNewModifyCase = data.filter(a => a.Home.RefferDoctorName != null && a.Home.RefferDoctorName == this.Username);
          this.asyncPipeNewModifyCaseBackup = data.filter(a => a.Home.RefferDoctorName != null && a.Home.RefferDoctorName == this.Username);
        }
        else {

          this.asyncPipeNewModifyCase = data.filter(a => a.Location == this.Location);
          this.asyncPipeNewModifyCaseBackup = data.filter(a => a.Location == this.Location);
        }
        if (this.CaseID != undefined) {
          if (this.showAll == false && this.CaseID.trim() !== '') {
            this.asyncPipeNewModifyCase = this.asyncPipeNewModifyCase.filter(a => a.UnqueID == this.CaseID);
          }
        }


        this.dataSource = new MatTableDataSource(this.myresult); //(this.asyncPipeNewModifyCase);
        this.dataSource.paginator = this.actualPaginator; //this.paginator;
        this.dataSource.sort = this.actualSort; //this.sort;
        this.filterVal = '';
        //this.GroupedDat();

        this.changeValue('All');

      })


      this.dataSource = new MatTableDataSource(this.myresult); //(this.asyncPipeNewModifyCase);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';
    }


  }

  DepartmentWiseCollection(fromdateParam, todateParam) {
  this.departmentwiseShow = true;
  this.GrossWiseShow = false;
    if (new Date(fromdateParam) > new Date(todateParam)) {
      alert('From Date can not be greater than To date');
      return;
    }
    else {
      this.nurseShow = true;
      this.addModifyCaseService.getDateRangeBalanceSheet(this.datePipe.transform(new Date(fromdateParam), 'dd-MM-yyyy').toString(), this.datePipe.transform(new Date(todateParam), 'dd-MM-yyyy').toString()).subscribe((data: NewModifyCase[]) => {
        //console.log('jay'+data);
        if (this.Role == 'Admin' || this.Role == 'SuperAdmin' || this.Role == 'Patho') {
          this.asyncPipeNewModifyCase = data;
          this.asyncPipeNewModifyCaseBackup = data;
          var filteredStudents = this.asyncPipeNewModifyCase[0].PaymentHistory;
          this.total = 0;  //set a variable that holds our total
          var taxes = filteredStudents[0].RegdCharge;  //reference the element in the "JSON" aka object literal we want

          for (var i = 0; i < this.asyncPipeNewModifyCase.length; i++) {  //loop through the array
            var earlierPayment = this.asyncPipeNewModifyCase[i].PaymentHistory[0].EarlierPayment == '' ? '0' : this.asyncPipeNewModifyCase[i].PaymentHistory[0].EarlierPayment;
            this.total += +this.asyncPipeNewModifyCase[i].PaymentHistory[0].Amount + +earlierPayment; // +this.asyncPipeNewModifyCase[i].PaymentHistory[0].EarlierPayment;  //Do the math!
          }
          this.total = Math.round(this.total);
          console.log(this.total);  //display the result
          
          //Doctor Calculation//
          this.ttlEarlierPayment=0;
          this.ttlCollectionChargePaid=0;
          this.ttlOPDCharge=0;
          this.ttlDoctorCharge=0;
          this.ttlNurseCharge=0;
          this.ttlLabTestCharge=0;
          this.ttlFarmaCharge=0;
          this.ttlBedCharge=0;
          this.ttlDailyExpense=0;
          this.ttlOTCharge=0;
          this.ttlOtherCharge=0;
          this.ttlRegdCharge=0;
          for (var i = 0; i < this.asyncPipeNewModifyCase.length; i++) {  //loop through the array
            var EarlierPaymentVldn = this.asyncPipeNewModifyCase[i].PaymentHistory[0].EarlierPayment == '' ? '0' : this.asyncPipeNewModifyCase[i].PaymentHistory[0].EarlierPayment;
            var CollectionChargePaidVldn = this.asyncPipeNewModifyCase[i].PaymentHistory[0].CollectionChargePaid == '' ? '0' : this.asyncPipeNewModifyCase[i].PaymentHistory[0].CollectionChargePaid;
            var OPDChargeVldn = this.asyncPipeNewModifyCase[i].PaymentHistory[0].OPDCharge == '' ? '0' : this.asyncPipeNewModifyCase[i].PaymentHistory[0].OPDCharge;
            var doctorChargeVldn = this.asyncPipeNewModifyCase[i].PaymentHistory[0].DoctorCharge == '' ? '0' : this.asyncPipeNewModifyCase[i].PaymentHistory[0].DoctorCharge;
            var NurseChargeVldn = this.asyncPipeNewModifyCase[i].PaymentHistory[0].NurseCharge == '' ? '0' : this.asyncPipeNewModifyCase[i].PaymentHistory[0].NurseCharge;
            var LabTestChargeVldn = this.asyncPipeNewModifyCase[i].PaymentHistory[0].LabTestCharge == '' ? '0' : this.asyncPipeNewModifyCase[i].PaymentHistory[0].LabTestCharge;
            var FarmaChargeVldn = this.asyncPipeNewModifyCase[i].PaymentHistory[0].FarmaCharge == '' ? '0' : this.asyncPipeNewModifyCase[i].PaymentHistory[0].FarmaCharge;
            var bedChargeVldn = this.asyncPipeNewModifyCase[i].PaymentHistory[0].BedCharge == '' ? '0' : this.asyncPipeNewModifyCase[i].PaymentHistory[0].BedCharge;
            var DailyExpenseVldn = this.asyncPipeNewModifyCase[i].PaymentHistory[0].DailyExpense == '' ? '0' : this.asyncPipeNewModifyCase[i].PaymentHistory[0].DailyExpense;
            var OTChargeVldn = this.asyncPipeNewModifyCase[i].PaymentHistory[0].OTCharge == '' ? '0' : this.asyncPipeNewModifyCase[i].PaymentHistory[0].OTCharge;
            var OtherChargeVldn = this.asyncPipeNewModifyCase[i].PaymentHistory[0].OtherCharge == '' ? '0' : this.asyncPipeNewModifyCase[i].PaymentHistory[0].OtherCharge;
            var RegdChargeVldn = this.asyncPipeNewModifyCase[i].PaymentHistory[0].RegdCharge == '' ? '0' : this.asyncPipeNewModifyCase[i].PaymentHistory[0].RegdCharge;
            
            
            this.ttlEarlierPayment+= +EarlierPaymentVldn;
            this.ttlCollectionChargePaid+= +CollectionChargePaidVldn;
            this.ttlOPDCharge+= +OPDChargeVldn;
            this.ttlDoctorCharge+= +doctorChargeVldn;
            this.ttlNurseCharge+= +NurseChargeVldn;
            this.ttlLabTestCharge+= +LabTestChargeVldn;
            this.ttlFarmaCharge+= +FarmaChargeVldn;
            this.ttlBedCharge+= +bedChargeVldn;
            this.ttlDailyExpense+= +DailyExpenseVldn;
            this.ttlOTCharge+= +OTChargeVldn;
            this.ttlOtherCharge+= +OtherChargeVldn;
            this.ttlRegdCharge+= +RegdChargeVldn;
          }
          this.total = Math.round(this.total);
          console.log(this.total);  //display the result
          //ended here

     

       


        }
        else if (this.Role == 'Doctor') {

          this.asyncPipeNewModifyCase = data.filter(a => a.Home.RefferDoctorName != null && a.Home.RefferDoctorName == this.Username);
          this.asyncPipeNewModifyCaseBackup = data.filter(a => a.Home.RefferDoctorName != null && a.Home.RefferDoctorName == this.Username);
        }
        else {

          this.asyncPipeNewModifyCase = data.filter(a => a.Location == this.Location);
          this.asyncPipeNewModifyCaseBackup = data.filter(a => a.Location == this.Location);
        }
       


  

      })


      this.dataSource = new MatTableDataSource(this.myresult); //(this.asyncPipeNewModifyCase);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';
    }


  }
  public getColor(val: string): string {
    return val == 'Income' ? "green" : "red";
  }
  public getGreenMark(val: string): boolean {
    return val == 'Income' ? true : false;
  }
  public getRedMark(val: string): boolean {
    return val == 'Income' ? false : true;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  applyFilterAll(filterValue: string) {
    // filterValue = filterValue.trim(); // Remove whitespace
    // filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = '';
  }




  refreshParent() {
    this.addModifyCaseService.getAll().subscribe((data: NewModifyCase[]) => {
      console.log('Deleted now' + data);
      this.asyncPipeNewModifyCase = data;
      //this.GroupedDat();
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';

    })
  }

  addEditExpenseItem(expenseId: NewModifyCase, firstName: string) {
    if (this.TABModeActivation == true) {
      if (expenseId !== null) {
        this._router.navigate(['/freshCaseTab', expenseId.UnqueID], { queryParams: { username: firstName, newid: expenseId.IPDOPDId } });
      }
      else {
        this._router.navigate(['/freshCaseTab', 'Addnew'], { queryParams: { username: "", newid: "" } });
      }
      //console.log(expenseId.UnqueID);

      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = true;
      dialogConfig.width = "50%";
      dialogConfig.data = expenseId;
    }
    else {
      if (expenseId !== null) {
        this._router.navigate(['/freshCase', expenseId.UnqueID], { queryParams: { username: firstName, newid: expenseId.IPDOPDId } });
      }
      else {
        this._router.navigate(['/freshCase', 'Addnew'], { queryParams: { username: "", newid: "" } });
      }
      //console.log(expenseId.UnqueID);

      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = true;
      dialogConfig.width = "50%";
      dialogConfig.data = expenseId;
    }

  }
  TABModeActivation: boolean = false;
  eventCheck(event) {
    //alert(event.target.checked);
    //console.log(event.target.checked) 
    this.TABModeActivation = event.target.checked;
  }
  addEditExpenseItemTABMode(expenseId: NewModifyCase, firstName: string) {
    if (expenseId !== null) {
      this._router.navigate(['/freshCaseTab', expenseId.UnqueID], { queryParams: { username: firstName, newid: expenseId.IPDOPDId } });
    }
    else {
      this._router.navigate(['/freshCaseTab', 'Addnew'], { queryParams: { username: "", newid: "" } });
    }
    //console.log(expenseId.UnqueID);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = expenseId;


  }

  addEditLabTestItem(expenseId: NewModifyCase, firstName: string, parentTest: string) {
    if (expenseId !== null) {
      this._router.navigate(['/LabTestInd', expenseId.UnqueID, firstName], { queryParams: { username: parentTest } });
    }
    else {
      this._router.navigate(['/LabTestInd', 'Addnew', firstName], { queryParams: { username: "" } });
    }
  }

  btnDischargePrint(parValue: String) {
    //this.router.navigate(['/LabTestReport']);
    this.router.navigate(['/DichargeReport', parValue]);
  }
  btnBillPrint(parValue: String) {
    //this.router.navigate(['/LabTestReport']);
    //this.onSubmit(this.addrFrom.value);
    this.router.navigate(['/LabReportandFindings', parValue]);
  }

  addEditLabTestItemForAll(expenseId: NewModifyCase, firstName: string, parentTest: string) {
    if (expenseId !== null) {
      this._router.navigate(['/LabTestIndAll', expenseId.UnqueID, firstName], { queryParams: { username: parentTest } });
    }
    else {
      this._router.navigate(['/LabTestInd', 'Addnew', firstName], { queryParams: { username: "" } });
    }
  }

  testStatus: string = 'kk';
  labtt(name: string, ind) {
    if (this.labTestIndividual != undefined && this.labTestIndividual?.length > 0) {
      if (this.labTestIndividual[ind].ParentTest == undefined) { }
      else {
        return this.labTestIndividual !== null ? this.labTestIndividual[ind]?.ParentTest : '';
      }
    }


  }
  LabtestStatus(CaseID: string, TestName: string, parentTest: string) {
    var p = "jay";
    this.labTestIndividualService.getById(CaseID).subscribe(
      (test) => {
        this.testStatus = test.TestName;
        return this.testStatus == '' ? 'hey' : this.testStatus;
      });


  }

  labTestIndividual: LabTestIndividual[];
  AllTestStatus() {
    //this.CaseID,this.TestName,this.parentTest
    this.labTestIndividualService.getAll().subscribe(
      (test) => {
        this.labTestIndividual = test;
      });
  }
  TestStatus(caseID, testName, parentTest) {
    var p = this.labTestIndividual?.find(a => a.CaseID == caseID && a.TestName == testName && a.ParentTest == parentTest)
    return p !== undefined ? p.ReportStatus : 'Pending';

  }
  TestStatus11(caseID, testName, parentTest) {
    var p = this.labTestIndividual?.find(a => a.CaseID == caseID && a.TestName == testName && a.ParentTest == parentTest)
    return p !== undefined ? p.ReportStatus : 'Pending';

  }
  ReturnStatusColor(colorVar) {
    var retColor = 'black';

    switch (colorVar) {
      case 'Progress': {
        retColor = 'green';
        break;
      }
      case 'Pending': {
        retColor = 'purple';
        break;
      }
      case 'Final': {
        retColor = 'red';
        break;
      }
      default: {
        retColor = 'black';
        break;
      }
    }

    return retColor;
  }

  ReturnStatusPaymentColor(parValue) {
    var retColor = 'orange';
    //let earlierPaymen1t= this.PaymentDetails.get('Balance').value;
    let parValueCalculation = parseFloat(parValue == "" ? "0" : parValue)
    if (parValueCalculation > 0) {
      retColor = "#229A3E";
    }
    else if (parValueCalculation == 0) {
      retColor = "#4795BF";
    }
    else {
      retColor = "#ED4E23";
    }
    //let bal = parseFloat(earlierPayment);;
    ////// this.PaymentDetails.get('Balance').patchValue(bal);
    return retColor;
  }

  ReturnStatusPaymentTest(parValue) {
    var retColor = 'orange';
    //let earlierPaymen1t= this.PaymentDetails.get('Balance').value;
    let parValueCalculation = parseFloat(parValue == "" ? "0" : parValue)
    if (parValueCalculation > 0) {
      retColor = "Due";
    }
    else if (parValueCalculation == 0) {
      retColor = "Clear";
    }
    else {
      retColor = "Ref";
    }
    //let bal = parseFloat(earlierPayment);;
    ////// this.PaymentDetails.get('Balance').patchValue(bal);
    return retColor;
  }



  DeleteItem(UnqueID: string) {
    this.addModifyCaseService.delete(UnqueID, 'SoftDelete').subscribe(
      () => {


        this.bedManagementService.UpdateBedStatusDuringAllCaseDelete('32176855', UnqueID).subscribe(aa => {
          alert('Deleted successfully');
          this.LoadNDaysData(1);
        });
      });

  }
  name: string;
  openDialog(): void {

    const dialogRef = this.dialog1.open(BedAvailabilityManagementComponent, {
      width: '800px',
      height: '550px',
      //title: "Hi " + (this.name || ""),
      // option1 
      //animation:{to:"aside"},

      // option2
      // animation: {
      //   to: "aside",
      //   incomingOptions: {
      //     keyframeAnimationOptions: { duration: 1000, easing: "steps(7, end)" }
      //   }
      // },

      // option3
      animation: {
        to: "bottom",
        incomingOptions: {
          keyframes: [
            { transform: "rotate(180deg)" },
            { transform: "rotate(0)" }
          ],
          keyframeAnimationOptions: { easing: "ease-in-out", duration: 500 }
        },
        outgoingOptions: {
          keyframes: [
            { transform: "rotate(0)" },
            { transform: "rotate(180deg)" }
          ],
          keyframeAnimationOptions: { easing: "ease-in-out", duration: 500 }
        }
      },


      position: {
        'top': '150px',
        'left': '500px'
      }//{ rowEnd: "0" }
    });
  }
  DissapearPopup() {
    this.dialog.closeAll();
  }
  animal: string;
  OpenBillPrint(caseidParam, billPartName): void {

    //alert(caseidParam); this is the unique ID
    const dialogRef = this.dialog.open(LabReportComponent, {
      width: '1250px',
      height: '790px',
      data: { 'caseID': caseidParam, 'printType': billPartName }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  OpenBillPendingStatus(caseidParam, billPartName): void {

    //alert(caseidParam); this is the unique ID
    const dialogRef = this.dialog.open(CasePaymentFilterComponent, {
      width: '1250px',
      height: '790px',
      data: { 'caseID': caseidParam, 'printType': billPartName }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }
}