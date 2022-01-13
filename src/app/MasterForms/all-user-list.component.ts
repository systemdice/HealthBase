import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort } from '@angular/material';
import { MatDialogModule, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AddModifyCaseService } from '../Services/add-modify-case.service';
import { CompanyMaster, LabTestIndividual, NewModifyCase, NotifyPendingTestData, UserDetails } from '../models/UserData';
import { ActivatedRoute, Router } from '@angular/router';
import { StringDecoder } from 'string_decoder';
import { LabTestIndividualService } from '../Services/lab-test-individual.service';
import { DatePipe } from '@angular/common';
import { StorageService } from '../shared/storage.service';
import { CompanyMasterDetailsService } from '../Services/comapny-master-details.service';
import { UserDetailsService } from '../Services/user-details.service';

@Component({
  selector: 'app-all-user-list',
  templateUrl: './all-user-list.component.html',
  styleUrls: ['./all-user-list.component.css']
})
export class AllUserListComponent implements OnInit {
  displayedColumns: string[] = ['slno', 'UnqueID', 'DateStart','UserID','Password','SecretCode','UserName','Role','Location','Status','action'];
  //dataSource: MatTableDataSource<UsersData>;
  dataSource: MatTableDataSource<any>;

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

  asyncPipeNewModifyCase: UserDetails[] = [];
  asyncPipeNewModifyCaseBackup: UserDetails[] = [];

  constructor(private userDetailsService:UserDetailsService,private companyMasterService: CompanyMasterDetailsService,private addModifyCaseService: AddModifyCaseService, private labTestIndividualService: LabTestIndividualService,
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
  ngOnInit() {
    this.route.params.subscribe((params) => {
      // alert(params['id']);
      //   alert(params['testname']);
      //this.TestName = params['testname'];
      this.CaseID = params['id'];
      //alert(this.CaseID);
      this.UserName = this.CaseID;
      //this.filterVal = this.CaseID;
      //this.applyFilter(this.CaseID);
      this.showAll = false;
    });
    //this.filterVal='221272100';
    // this.addModifyCaseService.getAllPendingTests().subscribe((data: NotifyPendingTestData[]) => {
    //   //console.log('jay'+data);
    //   this.asyncPi = data;
    // })

    this.userDetailsService.getAll().subscribe((data: UserDetails[]) => {
      //console.log('jay'+data);
      if(this.Role == 'Admin' || this.Role == 'SuperAdmin')
      {
        this.asyncPipeNewModifyCase = data;
        this.asyncPipeNewModifyCaseBackup = data;
      }
      else
      {

        this.asyncPipeNewModifyCase = data;//.filter(a => a.Location == this.Location);
        this.asyncPipeNewModifyCaseBackup = data;//.filter(a => a.Location == this.Location);
      }
      if(this.CaseID != undefined){
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

    // this.asyncPipeNewModifyCase$ = this.addModifyCaseService.c();
    // console.log(this.asyncPipeNewModifyCase$);
    //console.log("rajat")
    this.AllTestStatus();
  }
  saveLabTest() {
    //alert('abc');
    this.asyncPipeNewModifyCase = this.asyncPipeNewModifyCaseBackup;
    this.filterVal = '';

    this.dataSource = new MatTableDataSource(this.asyncPipeNewModifyCase);
    this.dataSource.paginator = this.actualPaginator; //this.paginator;
    this.dataSource.sort = this.actualSort; //this.sort;
    this.filterVal = '';

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
    //alert(passdate);
    this.myDate = this.datePipe.transform(new Date(passdate), 'dd-MM-yyyy').toString();
    //alert(this.myDate);
    //var myDate1 = this.datePipe.transform(new Date(new Date().getTime()-(1*24*60*60*1000)), 'dd-MM-yyyy').toString();
    var myDate1 = this.datePipe.transform(new Date(new Date().getTime()), 'dd-MM-yyyy').toString();

    //alert(myDate1);
    //this.asyncPipeNewModifyCase = this.asyncPipeNewModifyCaseBackup.filter(a=> a.DateStart == this.myDate);
    this.asyncPipeNewModifyCase = this.asyncPipeNewModifyCaseBackup.filter(a => a.DateStart == this.myDate);
    this.filterVal = '';

    this.dataSource = new MatTableDataSource(this.asyncPipeNewModifyCase);
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
    this.userDetailsService.getAll().subscribe((data: UserDetails[]) => {
      console.log('jay' + data);
      this.asyncPipeNewModifyCase = data;
      //this.GroupedDat();
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';

    })
  }

  addEditExpenseItem(expenseId: CompanyMaster, firstName: string) {
    if (expenseId !== null) {
      this._router.navigate(['/CompanyMaster', expenseId.UnqueID], { queryParams: { username: firstName } });
    }
    else {
      this._router.navigate(['/CompanyMaster', 'Addnew'], { queryParams: { username: "" } });
    }
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

  addEditLabTestItem(expenseId: NewModifyCase, firstName: string, parentTest: string) {
    if (expenseId !== null) {
      this._router.navigate(['/LabTestInd', expenseId.UnqueID, firstName], { queryParams: { username: parentTest } });
    }
    else {
      this._router.navigate(['/LabTestInd', 'Addnew', firstName], { queryParams: { username: "" } });
    }
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
    if (this.labTestIndividual != undefined) {
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
    this.addModifyCaseService.delete(UnqueID,'').subscribe(
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
