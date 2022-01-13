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


@Component({
  selector: 'app-case-details-main',
  templateUrl: './case-details-main.component.html',
  styleUrls: ['./case-details-main.component.css']
})
export class CaseDetailsMainComponent implements OnInit {
  displayedColumns: string[] = ['slno', 'UnqueID', 'DateStart','PatientInfo', 'TestType','Payment','Location', 'action'];
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
  NameIncaseDoctorRole:string;

  asyncPipeNewModifyCase: NewModifyCase[] = [];
  asyncPipeNewModifyCaseBackup: NewModifyCase[] = [];

  constructor(private addModifyCaseService: AddModifyCaseService, private labTestIndividualService: LabTestIndividualService,
    private dialog: MatDialog, private _router: Router,private _store: StorageService,private bedManagementService: BedManagementService,
    private router: Router, private route: ActivatedRoute, private datePipe: DatePipe,public dialog1: NgDialogAnimationService
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
  NDaysData:number=5;

  exportArray() {
    
    TableUtil.exportArrayToExcel(this.asyncPipeNewModifyCase, "CaseData");
  }
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
     this.LoadNDaysData(1);
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

  LoadNDaysData(noofdays:number){
    this.addModifyCaseService.getLastNDaysCase(noofdays).subscribe((data: NewModifyCase[]) => {
      //console.log('jay'+data);
      if(this.Role == 'Admin' || this.Role == 'SuperAdmin' || this.Role == 'Patho')
      {
        this.asyncPipeNewModifyCase = data;
        this.asyncPipeNewModifyCaseBackup = data;
      }
      else if(this.Role == 'Doctor')
      {

        this.asyncPipeNewModifyCase = data.filter(a => a.Home.RefferDoctorName != null && a.Home.RefferDoctorName == this.Username );
        this.asyncPipeNewModifyCaseBackup = data.filter(a => a.Home.RefferDoctorName !=null && a.Home.RefferDoctorName == this.Username);
      }
      else
      {

        this.asyncPipeNewModifyCase = data.filter(a => a.Location == this.Location);
        this.asyncPipeNewModifyCaseBackup = data.filter(a => a.Location == this.Location);
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
  }

  LoadAllCases(){
    this.addModifyCaseService.getAll().subscribe((data: NewModifyCase[]) => {
      //console.log('jay'+data);
      if(this.Role == 'Admin' || this.Role == 'SuperAdmin' || this.Role == 'Patho')
      {
        this.asyncPipeNewModifyCase = data;
        this.asyncPipeNewModifyCaseBackup = data;
      }
      else if(this.Role == 'Doctor')
      {

        this.asyncPipeNewModifyCase = data.filter(a => a.Home.RefferDoctorName != null && a.Home.RefferDoctorName == this.Username );
        this.asyncPipeNewModifyCaseBackup = data.filter(a => a.Home.RefferDoctorName !=null && a.Home.RefferDoctorName == this.Username);
      }
      else
      {

        this.asyncPipeNewModifyCase = data.filter(a => a.Location == this.Location);
        this.asyncPipeNewModifyCaseBackup = data.filter(a => a.Location == this.Location);
      }
      if(this.CaseID != undefined){
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
      if(this.Role == 'Admin' || this.Role == 'SuperAdmin' || this.Role == 'Patho')
      {
        this.asyncPipeNewModifyCase = data;
        this.asyncPipeNewModifyCaseBackup = data;
      }
      else if(this.Role == 'Doctor')
      {

        this.asyncPipeNewModifyCase = data.filter(a => a.Home.RefferDoctorName != null && a.Home.RefferDoctorName == this.Username );
        this.asyncPipeNewModifyCaseBackup = data.filter(a => a.Home.RefferDoctorName !=null && a.Home.RefferDoctorName == this.Username);
      }
      else
      {

        this.asyncPipeNewModifyCase = data.filter(a => a.Location == this.Location);
        this.asyncPipeNewModifyCaseBackup = data.filter(a => a.Location == this.Location);
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
  ShowFromToDataFromCalendar(fromdateParam,todateParam) {

if(new Date(fromdateParam) > new Date(todateParam)){
  alert('From Date can not be greater than To date');
  return;
}
else{
  this.addModifyCaseService.getDateRangeCase(this.datePipe.transform(new Date(fromdateParam), 'dd-MM-yyyy').toString(),this.datePipe.transform(new Date(todateParam), 'dd-MM-yyyy').toString()).subscribe((data: NewModifyCase[]) => {
    //console.log('jay'+data);
    if(this.Role == 'Admin' || this.Role == 'SuperAdmin' || this.Role == 'Patho')
    {
      this.asyncPipeNewModifyCase = data;
      this.asyncPipeNewModifyCaseBackup = data;
    }
    else if(this.Role == 'Doctor')
    {

      this.asyncPipeNewModifyCase = data.filter(a => a.Home.RefferDoctorName != null && a.Home.RefferDoctorName == this.Username );
      this.asyncPipeNewModifyCaseBackup = data.filter(a => a.Home.RefferDoctorName !=null && a.Home.RefferDoctorName == this.Username);
    }
    else
    {

      this.asyncPipeNewModifyCase = data.filter(a => a.Location == this.Location);
      this.asyncPipeNewModifyCaseBackup = data.filter(a => a.Location == this.Location);
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


  this.dataSource = new MatTableDataSource(this.asyncPipeNewModifyCase);
  this.dataSource.paginator = this.actualPaginator; //this.paginator;
  this.dataSource.sort = this.actualSort; //this.sort;
  this.filterVal = '';
}
    

  }

  total:number;
  ShowBalnacesheetFromToDataFromCalendar(fromdateParam,todateParam) {

    if(new Date(fromdateParam) > new Date(todateParam)){
      alert('From Date can not be greater than To date');
      return;
    }
    else{
      this.addModifyCaseService.getDateRangeBalanceSheet(this.datePipe.transform(new Date(fromdateParam), 'dd-MM-yyyy').toString(),this.datePipe.transform(new Date(todateParam), 'dd-MM-yyyy').toString()).subscribe((data: NewModifyCase[]) => {
        //console.log('jay'+data);
        if(this.Role == 'Admin' || this.Role == 'SuperAdmin' || this.Role == 'Patho')
        {
          this.asyncPipeNewModifyCase = data;
          this.asyncPipeNewModifyCaseBackup = data;
          var filteredStudents = this.asyncPipeNewModifyCase[0].PaymentHistory;
          this.total = 0;  //set a variable that holds our total
          var taxes = filteredStudents[0].RegdCharge;  //reference the element in the "JSON" aka object literal we want
          
      for (var i = 0; i < taxes.length; i++) {  //loop through the array
          this.total += +taxes;  //Do the math!
      }
      console.log(this.total);  //display the result

        }
        else if(this.Role == 'Doctor')
        {
    
          this.asyncPipeNewModifyCase = data.filter(a => a.Home.RefferDoctorName != null && a.Home.RefferDoctorName == this.Username );
          this.asyncPipeNewModifyCaseBackup = data.filter(a => a.Home.RefferDoctorName !=null && a.Home.RefferDoctorName == this.Username);
        }
        else
        {
    
          this.asyncPipeNewModifyCase = data.filter(a => a.Location == this.Location);
          this.asyncPipeNewModifyCaseBackup = data.filter(a => a.Location == this.Location);
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
    
    
      this.dataSource = new MatTableDataSource(this.asyncPipeNewModifyCase);
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
    if(this.TABModeActivation ==  true){
      if (expenseId !== null) {
        this._router.navigate(['/freshCaseTab', expenseId.UnqueID], { queryParams: { username: firstName,newid:expenseId.IPDOPDId } });
      }
      else {
        this._router.navigate(['/freshCaseTab', 'Addnew'], { queryParams: { username: "",newid:"" } });
      }
      //console.log(expenseId.UnqueID);
  
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = true;
      dialogConfig.width = "50%";
      dialogConfig.data = expenseId;
    }
    else{
    if (expenseId !== null) {
      this._router.navigate(['/freshCase', expenseId.UnqueID], { queryParams: { username: firstName,newid:expenseId.IPDOPDId } });
    }
    else {
      this._router.navigate(['/freshCase', 'Addnew'], { queryParams: { username: "",newid:"" } });
    }
    //console.log(expenseId.UnqueID);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = expenseId;
  }

  }
  TABModeActivation:boolean=false;
  eventCheck(event){
    //alert(event.target.checked);
    //console.log(event.target.checked) 
    this.TABModeActivation = event.target.checked;
}
  addEditExpenseItemTABMode(expenseId: NewModifyCase, firstName: string) {
    if (expenseId !== null) {
      this._router.navigate(['/freshCaseTab', expenseId.UnqueID], { queryParams: { username: firstName,newid:expenseId.IPDOPDId } });
    }
    else {
      this._router.navigate(['/freshCaseTab', 'Addnew'], { queryParams: { username: "",newid:"" } });
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

  btnDischargePrint(parValue:String) {
    //this.router.navigate(['/LabTestReport']);
    this.router.navigate(['/DichargeReport', parValue]);
  }
  btnBillPrint(parValue:String) {
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
    if (this.labTestIndividual != undefined && this.labTestIndividual?.length >0) {
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
      height:'550px',
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
          keyframeAnimationOptions: { easing: "ease-in-out", duration:500 }
        },
                outgoingOptions: {
          keyframes: [
            { transform: "rotate(0)" },
            { transform: "rotate(180deg)" }
          ],
          keyframeAnimationOptions: { easing: "ease-in-out", duration:500 }
        }
      },


      position:  {
        'top': '150px',
        'left': '500px'
    }//{ rowEnd: "0" }
    });
  }
  DissapearPopup(){
    this.dialog.closeAll();
  }
  animal: string;
  OpenBillPrint(caseidParam,billPartName): void {

    //alert(caseidParam); this is the unique ID
      const dialogRef = this.dialog.open(LabReportComponent, {
        width: '1250px',
        height: '790px',
        data: {'caseID':caseidParam,'printType':billPartName}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.animal = result;
      });
    }

    OpenBillPendingStatus(caseidParam,billPartName): void {

      //alert(caseidParam); this is the unique ID
        const dialogRef = this.dialog.open(CasePaymentFilterComponent, {
          width: '1250px',
          height: '790px',
          data: {'caseID':caseidParam,'printType':billPartName}
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          this.animal = result;
        });
      }
}
