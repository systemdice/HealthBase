
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort } from '@angular/material';
import { MatDialogModule, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AddModifyCaseService } from '../Services/add-modify-case.service';
import { LabTestIndividual, BedReport, NotifyPendingTestData } from '../models/UserData';
import { ActivatedRoute, Router } from '@angular/router';
import { StringDecoder } from 'string_decoder';
import { LabTestIndividualService } from '../Services/lab-test-individual.service';
import { DatePipe } from '@angular/common';
import { StorageService } from '../shared/storage.service';
import * as XLSX from 'xlsx';
import { TableUtil } from '../shared/tableUtil';
import { map, filter, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-bed-admission-report',
  templateUrl: './bed-admission-report.component.html',
  styleUrls: ['./bed-admission-report.component.css']
}) 
export class BedAdmissionReportComponent implements OnInit {
  displayedColumns: string[] = ['slno', 'OPDIPDid', 'DateStart','BedCategory', 'BedName','PatientName'];
  //dataSource: MatTableDataSource<UsersData>;
  dataSource: MatTableDataSource<BedReport>;

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  //@ViewChild(MatPaginator, {static:true})// paginator: MatPaginator;  
  actualPaginator: MatPaginator;
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
  Location:string;
  NameIncaseDoctorRole:string;

  asyncPipeBedReport: BedReport[] = [];
  asyncPipeBedReportBackup: BedReport[] = [];

  exportArray() {
    
    TableUtil.exportArrayToExcel(this.asyncPipeBedReport, "BedDetails");
  }

  constructor(private addModifyCaseService: AddModifyCaseService, private labTestIndividualService: LabTestIndividualService,
    private dialog: MatDialog, private _router: Router,private _store: StorageService,
    private router: Router, private route: ActivatedRoute, private datePipe: DatePipe
  ) { 
    this.Username = this._store.sessionUsername;
    this.Role = this._store.sessionRole;
    this.Location = this._store.sessionLocation;
  }

  asyncPi: NotifyPendingTestData[] = [];
  CaseID: string = '';
  UserName: string = '';
  showAll: boolean = true;
  showPrintoption:boolean=false;
  ngOnInit() {
    if(this.Role == 'Admin' || this.Role == 'SuperAdmin' ||  this.Role == 'Account' ||  this.Role == 'Reception'){
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
      this.addModifyCaseService.getAdmitted().subscribe((data: BedReport[]) => {
        //console.log('jay'+data);
        if(this.Role == 'Admin' || this.Role == 'SuperAdmin' || this.Role == 'Patho')
        {
          this.asyncPipeBedReport = data;
          this.asyncPipeBedReportBackup = data;
        }
        // else if(this.Role == 'Doctor')
        // {
  
        //   this.asyncPipeBedReport = data.filter(a => a.Home.RefferDoctorName != null && a.Home.RefferDoctorName == this.Username );
        //   this.asyncPipeBedReportBackup = data.filter(a => a.Home.RefferDoctorName !=null && a.Home.RefferDoctorName == this.Username);
        // }
        // else
        // {
  
        //   this.asyncPipeBedReport = data.filter(a => a.Location == this.Location);
        //   this.asyncPipeBedReportBackup = data.filter(a => a.Location == this.Location);
        // }
        if(this.CaseID != undefined){
        if (this.showAll == false && this.CaseID.trim() !== '') {
          this.asyncPipeBedReport = this.asyncPipeBedReport.filter(a => a.UnqueID == this.CaseID);
        }
      }
  
  
        this.dataSource = new MatTableDataSource(this.asyncPipeBedReport);
        this.dataSource.paginator = this.actualPaginator; //this.paginator;
        this.dataSource.sort = this.actualSort; //this.sort;
        this.filterVal = '';
        //this.GroupedDat();
  
      })
      this.showAll = false;
    });
    //this.filterVal='221272100';
    // this.addModifyCaseService.getAllPendingTests().subscribe((data: NotifyPendingTestData[]) => {
    //   //console.log('jay'+data);
    //   this.asyncPi = data;
    // })

   

    // this.asyncPipeBedReport$ = this.addModifyCaseService.c();
    // console.log(this.asyncPipeBedReport$);
    //console.log("rajat")
    this.AllTestStatus();
  }
  saveLabTest() {
    //alert('abc');
    this.asyncPipeBedReport = this.asyncPipeBedReportBackup;
    this.filterVal = '';

    this.dataSource = new MatTableDataSource(this.asyncPipeBedReport);
    this.dataSource.paginator = this.actualPaginator; //this.paginator;
    this.dataSource.sort = this.actualSort; //this.sort;
    this.filterVal = '';

  }
  CancelMe() {
    this.router.navigate(['/home', 37], { queryParams: { username: "Cancel" } });
  }
  myDate: string;
  ShowTodaysData() {
    //alert('abc');
    this.myDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy').toString();
    //var myDate1 = this.datePipe.transform(new Date(new Date().getTime()-(1*24*60*60*1000)), 'dd-MM-yyyy').toString();
    var myDate1 = this.datePipe.transform(new Date(new Date().getTime()), 'dd-MM-yyyy').toString();

    //alert(myDate1);
    //this.asyncPipeBedReport = this.asyncPipeBedReportBackup.filter(a=> a.DateStart == this.myDate);
    this.asyncPipeBedReport = this.asyncPipeBedReportBackup.filter(a => a.DateStart == myDate1);
    this.filterVal = '';

    this.dataSource = new MatTableDataSource(this.asyncPipeBedReport);
    this.dataSource.paginator = this.actualPaginator; //this.paginator;
    this.dataSource.sort = this.actualSort; //this.sort;
    this.filterVal = '';

  }
  passdate: string;
  ShowTodaysDataFromCalendar(passdate) {
    //alert(passdate);
    this.myDate = this.datePipe.transform(new Date(passdate), 'dd-MM-yyyy').toString();
    //alert(this.myDate);
    //var myDate1 = this.datePipe.transform(new Date(new Date().getTime()-(1*24*60*60*1000)), 'dd-MM-yyyy').toString();
    var myDate1 = this.datePipe.transform(new Date(new Date().getTime()), 'dd-MM-yyyy').toString();

    //alert(myDate1);
    //this.asyncPipeBedReport = this.asyncPipeBedReportBackup.filter(a=> a.DateStart == this.myDate);
    this.asyncPipeBedReport = this.asyncPipeBedReportBackup.filter(a => a.DateStart == this.myDate);
    this.filterVal = '';

    this.dataSource = new MatTableDataSource(this.asyncPipeBedReport);
    this.dataSource.paginator = this.actualPaginator; //this.paginator;
    this.dataSource.sort = this.actualSort; //this.sort;
    this.filterVal = '';

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
    this.addModifyCaseService.getAdmitted().subscribe((data: BedReport[]) => {
      console.log('jay' + data);
      this.asyncPipeBedReport = data;
      //this.GroupedDat();
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';

    })
  }

  addEditExpenseItem(expenseId: BedReport, firstName: string) {
    // if (expenseId !== null) {
    //   this._router.navigate(['/freshCase', expenseId.UnqueID], { queryParams: { username: firstName,newid:expenseId.IPDOPDId } });
    // }
    // else {
    //   this._router.navigate(['/freshCase', 'Addnew'], { queryParams: { username: "",newid:"" } });
    // }
    //console.log(expenseId.UnqueID);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = expenseId;
    // {
    //   expenseId 
    // };
    //       this.dialog.open(ExpenseItemComponent,dialogConfig)
    //       .afterClosed()
    // .subscribe(() => {
    //   setTimeout(() => {
    //     this.refreshParent();

    //   }, 2000);
    // });

    //////////////const dialogRef = this.dialog.open(ExpenseItemComponent,dialogConfig);

    //   dialogRef.afterClosed().subscribe(result => {  
    //     this.refreshParent();       
    // }); 

  }

  addEditLabTestItem(expenseId: BedReport, firstName: string, parentTest: string) {
    if (expenseId !== null) {
      this._router.navigate(['/LabTestInd', expenseId.UnqueID, firstName], { queryParams: { username: parentTest } });
    }
    else {
      this._router.navigate(['/LabTestInd', 'Addnew', firstName], { queryParams: { username: "" } });
    }
  }

  btnDischargePrint(parValue:String) {
    //this.router.navigate(['/LabTestReport']);
    this.router.navigate(['/DichargeReport', parValue]);
  }
  btnBillPrint(parValue:String) {
    //this.router.navigate(['/LabTestReport']);
    //this.onSubmit(this.addrFrom.value);
    this.router.navigate(['/LabReportandFindings', parValue]);
  }

  addEditLabTestItemForAll(expenseId: BedReport, firstName: string, parentTest: string) {
    if (expenseId !== null) {
      this._router.navigate(['/LabTestIndAll', expenseId.UnqueID, firstName], { queryParams: { username: parentTest } });
    }
    else {
      this._router.navigate(['/LabTestInd', 'Addnew', firstName], { queryParams: { username: "" } });
    }
  }

  testStatus: string = 'kk';
  labtt(name: string, ind) {
    if (this.labTestIndividual != undefined && this.labTestIndividual.length >0) {
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
    if(parValueCalculation>0)
    {
      retColor ="#229A3E";
    }
    else if(parValueCalculation==0){
      retColor ="#4795BF";
    }
    else {
      retColor ="#ED4E23";
    }
    //let bal = parseFloat(earlierPayment);;
   ////// this.PaymentDetails.get('Balance').patchValue(bal);
    return retColor;
  }

  ReturnStatusPaymentTest(parValue) {
    var retColor = 'orange';
    //let earlierPaymen1t= this.PaymentDetails.get('Balance').value;
    let parValueCalculation = parseFloat(parValue == "" ? "0" : parValue)
    if(parValueCalculation>0)
    {
      retColor ="Due";
    }
    else if(parValueCalculation==0){
      retColor ="Clear";
    }
    else {
      retColor ="Ref";
    }
    //let bal = parseFloat(earlierPayment);;
   ////// this.PaymentDetails.get('Balance').patchValue(bal);
    return retColor;
  }



  DeleteItem(UnqueID: string) {
    this.addModifyCaseService.delete(UnqueID,'SoftDelete').subscribe(
      () => {
        setTimeout(() => {
          this.refreshParent();

        }, 1000);

      });
    //this.toastr.success("Expense successfully deleted.", "SystemDICE", {

    //    timeOut:2000
    //  })
  }


}

