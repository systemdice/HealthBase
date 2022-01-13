


import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DateAdapter, MatPaginator, MatSort } from '@angular/material';
import { MatDialogModule, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AddModifyCaseService } from '../Services/add-modify-case.service';
import { LabTestIndividual, FarmacyDeliveryToPatient, NotifyPendingTestData, NewModifyCase, ReferralMaster } from '../models/UserData';
import { ActivatedRoute, Router } from '@angular/router';
import { StringDecoder } from 'string_decoder';
import { LabTestIndividualService } from '../Services/lab-test-individual.service';
import { DatePipe } from '@angular/common';
import { StorageService } from '../shared/storage.service';
import { FarmacyEntryService } from '../Services/farmacy-entry.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as pluginLabels from 'chartjs-plugin-datalabels';
import { Color, Label } from 'ng2-charts';
import { APIDetails } from 'src/app/shared/AllConstants';
import { Chart } from 'chart.js';
import { JsonpClientBackend } from '@angular/common/http';
import { RefaralService } from '../Services/referal.service';


@Component({
  selector: 'app-pharmacy-doctor-commsion',
  templateUrl: './pharmacy-doctor-commsion.component.html',
  styleUrls: ['./pharmacy-doctor-commsion.component.css']
})
export class PharmacyDoctorCommsionComponent implements OnInit {
  displayedColumns: string[] = ['slno', 'BillNo', 'PharmacyStoreName','BillingDate', 'CustomerName', 'GrossSalePriceOnthisBill', 'Doctor','CommPerc','Amount'];
  displayedColumnsPL: string[] = ['slno', 'BillNo', 'GrossPurchasePriceOnthisBill', 'GrossSalePriceOnthisBill', 'GrossProffitPriceOnthisBill', 'GrossGSTPriceOnthisBill', 'BillingMonth', 'BillingYear', 'BillingDate', 'CeditStatus', 'action'];
  //dataSource: MatTableDataSource<UsersData>;
  dataSource: MatTableDataSource<any>;
  dataSourcePL: MatTableDataSource<any>;

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
  filterValPL: string = '';
  Username: string;
  Role: string;
  Location: string;

  asyncPipeFarmacyDeliveryToPatient: FarmacyDeliveryToPatient[] = [];
  asyncPipeFarmacyDeliveryToPatientBackup: FarmacyDeliveryToPatient[] = [];

  asyncPipeFarmacyDeliveryToPatientPL: FarmacyDeliveryToPatient[] = [];
  asyncPipeFarmacyDeliveryToPatientBackupPL: FarmacyDeliveryToPatient[] = [];

  groupedMap: any;
  //result:any[]=[];

  reportArryX: any[] = [];
  reportArryY: any[] = [];

  constructor(private addModifyCaseService: AddModifyCaseService, public farmacyEntryService: FarmacyEntryService, private labTestIndividualService: LabTestIndividualService,
    private dialog: MatDialog, private _router: Router, private _store: StorageService,public referralMasterService: RefaralService,
    private router: Router, private route: ActivatedRoute, private datePipe: DatePipe,private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
    this.Username = this._store.sessionUsername;
    this.Role = this._store.sessionRole;
    this.Location = this._store.sessionLocation;
  }

  asyncPi: NotifyPendingTestData[] = [];
  CaseID: string = '';
  UserName: string = '';
  showAll: boolean = true;
  getMonthName(monhNumber) {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    //var d = new Date();
    return months[monhNumber - 1]; // "July" (or current month)
  }
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
    
this.LoadAllDoctor();
    this.farmacyEntryService.getFarmaComision(this.Username).subscribe((data: FarmacyDeliveryToPatient[]) => {
      //console.log('jay'+data);
      if (this.Role == 'Admin' || this.Role == 'SuperAdmin') {
        this.asyncPipeFarmacyDeliveryToPatient = data;
        this.asyncPipeFarmacyDeliveryToPatientBackup = data;
      }
      else {

        this.asyncPipeFarmacyDeliveryToPatient = data.filter(a => a.PharmacyStoreName == this.Username && a.Patientid != 'SoftDelete');
        this.asyncPipeFarmacyDeliveryToPatientBackup = data.filter(a => a.PharmacyStoreName == this.Username && a.Patientid != 'SoftDelete');//.filter(a => a.Location == this.Location);
      }
      if (this.CaseID != undefined) {
        if (this.showAll == false && this.CaseID.trim() !== '') {
          this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatient.filter(a => a.UnqueID == this.CaseID && a.Patientid != 'SoftDelete');
        }
      }

      this.asyncPipeFarmacyDeliveryToPatientPL = this.asyncPipeFarmacyDeliveryToPatient.filter(a => a.BillingMonth != null);
      this.asyncPipeFarmacyDeliveryToPatientPL.sort((a, b) => (a.BillingMonth > b.BillingMonth) ? 1 : (a.BillingMonth === b.BillingMonth) ? ((a.BillingYear > b.BillingYear) ? 1 : -1) : -1)

this.returnTotal();
      var result = [];
      this.asyncPipeFarmacyDeliveryToPatientPL.reduce(function (res, value) {
        if (!res[value.BillingMonth]) {
          res[value.BillingMonth] = { Id: value.BillingMonth, GrossProffitPriceOnthisBill: 0 };
          result.push(res[value.BillingMonth])
        }
        res[value.BillingMonth].GrossProffitPriceOnthisBill += parseFloat(value.GrossProffitPriceOnthisBill==undefined?'0':value.GrossProffitPriceOnthisBill);
        return res;
      }, {});

      //alert(JSON.stringify(result));

      this.reportArryX = result.map(robot => robot.GrossProffitPriceOnthisBill).filter(function (e) { return e != null; });;
      this.reportArryY = result.map(robot => this.getMonthName(robot.Id)).filter(function (e) { return e != null; });;
      //this.reportArryY = this.reportArryY.map(a=> this.changeFormat(a.BillingMonth) );


      //this.reportArryX = this.asyncPipeFarmacyDeliveryToPatientPL.map(robot => robot.GrossProffitPriceOnthisBill).filter(function (e) {return e != null;});;
      //this.reportArryY = this.asyncPipeFarmacyDeliveryToPatientPL.map(robot => this.getMonthName(robot.BillingMonth)).filter(function (e) {return e != null;});;
      this.ShowChartData(this.reportArryX, this.reportArryY,null);


      this.dataSource = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';
      //this.GroupedDat();


      this.dataSourcePL = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
      this.dataSourcePL.paginator = this.actualPaginator; //this.paginator;
      this.dataSourcePL.sort = this.actualSort; //this.sort;
      this.filterValPL = '';

      ///////////////////////////////////////////////////////////////////////

      //////////////////////////////////////////////////////////////////////

    })

   
    //this.AllTestStatus();
  }
  changeFormat(val) {
    return val + this.SearchYear == undefined ? '' : '(' + this.SearchYear + ')';
  }

  CalculatePercentage(total, percentage):string{
    var amt:number=0;
    if(total!= '' && percentage != ''){
      amt = (parseFloat(total)*parseFloat(percentage))/100;
    } 
return amt.toString();
  }
  SearchData() {

    this.asyncPipeFarmacyDeliveryToPatientPL = this.asyncPipeFarmacyDeliveryToPatient.filter(a => a.BillingYear != null && a.BillingYear == this.SearchYear);
    this.asyncPipeFarmacyDeliveryToPatientPL = this.asyncPipeFarmacyDeliveryToPatientPL.filter(a => a.BillingMonth != null);
    this.asyncPipeFarmacyDeliveryToPatientPL.sort((a, b) => (a.BillingMonth > b.BillingMonth) ? 1 : (a.BillingMonth === b.BillingMonth) ? ((a.BillingYear > b.BillingYear) ? 1 : -1) : -1)

    var result = [];
    this.asyncPipeFarmacyDeliveryToPatientPL.reduce(function (res, value) {
      if (!res[value.BillingMonth]) {
        res[value.BillingMonth] = { Id: value.BillingMonth, GrossProffitPriceOnthisBill: 0 };
        result.push(res[value.BillingMonth])
      }
      res[value.BillingMonth].GrossProffitPriceOnthisBill += parseFloat(value.GrossProffitPriceOnthisBill);
      return res;
    }, {});

    //alert(JSON.stringify(result));

    this.reportArryX = result.map(robot => robot.GrossProffitPriceOnthisBill).filter(function (e) { return e != null; });;
    this.reportArryY = result.map(robot => this.getMonthName(robot.Id)).filter(function (e) { return e != null; });;


    //this.reportArryX = this.asyncPipeFarmacyDeliveryToPatientPL.map(robot => robot.GrossProffitPriceOnthisBill).filter(function (e) {return e != null;});;
    //this.reportArryY = this.asyncPipeFarmacyDeliveryToPatientPL.map(robot => this.getMonthName(robot.BillingMonth)).filter(function (e) {return e != null;});;
    


    var result1 = [];
    this.asyncPipeFarmacyDeliveryToPatientPL.reduce(function (res, value1) {
      if (!res[value1.BillingMonth]) {
        res[value1.BillingMonth] = { Id: value1.BillingMonth, GrossSale: 0, GrossPurchase: 0 };
        result1.push(res[value1.BillingMonth])
      }
      res[value1.BillingMonth].GrossSale += parseFloat(value1.GrossPurchasePriceOnthisBill);
      res[value1.BillingMonth].GrossPurchase += parseFloat(value1.GrossSalePriceOnthisBill)
      return res;
    }, {});

    this.ShowChartData(this.reportArryX, this.reportArryY,result1);

  }

  chart;
  pieChartOptions: ChartOptions;
  pieChartLabels:string[];// = ['Chrome', 'Safari', 'Firefox','Internet Explorer','Other'];
  pieChartData:number[];// = [40, 20, 20 , 10,10];
  pieChartType:string;// = 'pie';
  pieChartPlugins = [];

  barChartPluginsE; 
  barChartOptionsE: ChartOptions;
  barChartLabelsE: Label[];
  barChartTypeE: ChartType = 'bar';
  barChartTypeEP: ChartType = 'line';
  barChartLegendE;
  piePlugins;
  barChartDataE: ChartDataSets[];
  public lineChartColorsE: Color[];
  SearchYear: string;
  ExpireYear: string;
  
  ShowChartData(reportArryX, reportArryY, result1) {
    this.barChartOptionsE = {
      responsive: true,
      // We use these empty structures as placeholders for dynamic theming.
      scales: { xAxes: [{}], yAxes: [{}] },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
        }
      }
    };
    this.barChartLabelsE = reportArryY; //reportArryY.map(a=> this.changeFormat(a) );//reportArryY; //['2006', '2007', '2008', '2009', '2010', '2011', '2012'];; //this.reportArryY;// ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    this.barChartTypeE = 'bar';
    this.barChartTypeEP = 'line';
    this.barChartLegendE = false;
    this.barChartPluginsE = [pluginDataLabels];

    this.barChartDataE = [
      { data: reportArryX, label: 'Proffit' },
      // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }

    ];
    this.lineChartColorsE = [
      {
        borderColor: 'blue',
        backgroundColor: [
          "red",
          "green",
          "#9966FF",
          "#4C4CFF",
          "#00FFFF",
          "#f990a7",
          "#aad2ed",
          "#FF00FF",
          "Blue",
          "Red",
          "Blue"
        ]
      },
    ];


    //multi bar
    if(result1 !== null){
    var reportArryMultiX2 = result1.map(robot => robot.GrossSale).filter(function (e) { return e != null; });;
    var reportArryMultiX1 = result1.map(robot => robot.GrossPurchase).filter(function (e) { return e != null; });;
    this.reportArryY = result1.map(robot => this.getMonthName(robot.Id)).filter(function (e) { return e != null; });;
    this.chart = {
      "datasets": [
        // { "data": [0, 30, 20, 40, 35, 45, 33, 0, 0], "label": "Bar 1" },
        // { "data": [0, 50, 60, 55, 59, 30, 40, 0, 0], "label": "Bar 2" },
        { "data": reportArryMultiX2, "label": "Purchase Price" },
        { "data": reportArryMultiX1, "label": " Sale Price" },
        //{ "data": [45, 45, 45], "label": "Line", "type": "line" }
      ],
      "labels": reportArryY,
      "options": {
        "legend": {
          "text": "You awesome chart with average line",
          "display": true,
        },
        "scales": {
          "yAxes": [{
            "ticks": {
            "beginAtZero": true
            }
          }],
          "xAxes": [{
            "ticks": {
            "min": "Monday",
            "max": "Sunday",
            }
          }],
        }
      }
    };

 
  }
  this.pieChartOptions = {
    responsive: true,
        maintainAspectRatio: true,
        plugins: {
            labels: {
              render: 'percentage',
              fontColor: ['green', 'white', 'red'],
              precision: 2
            }
        },
  };
  this.pieChartLabels = reportArryY;
  this.pieChartData= reportArryX;
  this.pieChartType = 'pie';
  this.pieChartPlugins = [pluginLabels];

    //ended multibar

  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    //console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    //console.log(event, active);
  }
  ClearDateRangeField(){
    this.EndDate= null;
this.StartDate= null;
  }
  ClearDateRangeFieldPL(){
    this.EndDatePL= null;
this.StartDatePL= null;
  }

  refferDoctor:string='--NA--';
  referralMaster: ReferralMaster[];
  LoadAllDoctor() {
    //this.referralMaster = this.allStaffParm.filter(x=> x.StaffType == 'Doctor');
    this.referralMasterService.getStaffType('Doctor').subscribe((data: ReferralMaster[]) => {
      //console.log(data);
      this.referralMaster = data;

    })
  }
  totalCommsiionBasedOnFilter:string='0.0';
  returnTotal(){
    this.totalCommsiionBasedOnFilter='0.0'
    this.totalCommsiionBasedOnFilter = this.asyncPipeFarmacyDeliveryToPatient.map(a => (parseFloat(a.GrossSalePriceOnthisBill==''|| a.GrossSalePriceOnthisBill==undefined?'0':a.GrossSalePriceOnthisBill)*(parseFloat(a.DoctorPercentage=='' || a.DoctorPercentage==undefined?'0':a.DoctorPercentage)))/100).reduce((prev, next) => prev + next).toString();

  }

  currentYear: number = new Date().getFullYear();
  ShowDateMonthandYear(MonthName) {

this.ClearDateRangeField();
if(this.refferDoctor != '--NA--' ){
    this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter
        (a => ((this.addDays(new Date(a.BillingDate),0)).getMonth()+1).toString() == MonthName  && a.refferDoctor==this.refferDoctor);
}
else{
  this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter
  (a => ((this.addDays(new Date(a.BillingDate),0)).getMonth()+1).toString() == MonthName );

}
    this.filterVal = '';

    this.dataSource = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    this.dataSource.paginator = this.actualPaginator; //this.paginator;
    this.dataSource.sort = this.actualSort; //this.sort;
    this.filterVal = '';

    // this.dataSourcePL = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    // this.dataSourcePL.paginator = this.actualPaginator; //this.paginator;
    // this.dataSourcePL.sort = this.actualSort; //this.sort;
    // this.filterValPL = '';
    this.returnTotal();
  }
  
  saveLabTest() {
    this.ClearDateRangeField();
    //alert('abc');
    if(this.refferDoctor != '--NA--' ){
      this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a => a.refferDoctor==this.refferDoctor);
      //this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a => this.datePipe.transform(new Date(a.BillingDate), 'dd-MM-yyyy').toString() == myDate1 && a.refferDoctor==this.refferDoctor);
    
    }
    else{
    this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup;
    this.asyncPipeFarmacyDeliveryToPatientPL = this.asyncPipeFarmacyDeliveryToPatientBackup;
    }
    this.filterVal = '';

    this.dataSource = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    this.dataSource.paginator = this.actualPaginator; //this.paginator;
    this.dataSource.sort = this.actualSort; //this.sort;
    this.filterVal = '';

    // this.dataSourcePL = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatientPL);
    // this.dataSourcePL.paginator = this.actualPaginator; //this.paginator;
    // this.dataSourcePL.sort = this.actualSort; //this.sort;
    // this.filterValPL = '';

this.returnTotal();
  }
  saveLabTestPL() {
    this.ClearDateRangeFieldPL();
    //alert('abc');
    if(this.refferDoctor != '--NA--' ){
      this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a => a.refferDoctor==this.refferDoctor);
      //this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a => this.datePipe.transform(new Date(a.BillingDate), 'dd-MM-yyyy').toString() == myDate1 && a.refferDoctor==this.refferDoctor);
    
    }
    else{
    this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup;
    this.asyncPipeFarmacyDeliveryToPatientPL = this.asyncPipeFarmacyDeliveryToPatientBackup;
    }
    this.filterVal = '';

    // this.dataSource = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    // this.dataSource.paginator = this.actualPaginator; //this.paginator;
    // this.dataSource.sort = this.actualSort; //this.sort;
    // this.filterVal = '';

    this.dataSourcePL = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatientPL);
    this.dataSourcePL.paginator = this.actualPaginator; //this.paginator;
    this.dataSourcePL.sort = this.actualSort; //this.sort;
    this.filterValPL = '';


  }
  AllCredit() {
    //alert('abc');
    this.ClearDateRangeField();
    this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a => a.CeditStatus == 'Credit' && a.Patientid != 'SoftDelete');
    this.filterVal = '';

    this.dataSource = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    this.dataSource.paginator = this.actualPaginator; //this.paginator;
    this.dataSource.sort = this.actualSort; //this.sort;
    this.filterVal = '';

    // this.dataSourcePL = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    // this.dataSourcePL.paginator = this.actualPaginator; //this.paginator;
    // this.dataSourcePL.sort = this.actualSort; //this.sort;
    // this.filterValPL = '';

  }
  AllCreditPL() {
    this.ClearDateRangeFieldPL();
    //alert('abc');
    this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a => a.CeditStatus == 'Credit' && a.Patientid != 'SoftDelete');
    this.filterVal = '';

    // this.dataSource = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    // this.dataSource.paginator = this.actualPaginator; //this.paginator;
    // this.dataSource.sort = this.actualSort; //this.sort;
    // this.filterVal = '';

    this.dataSourcePL = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    this.dataSourcePL.paginator = this.actualPaginator; //this.paginator;
    this.dataSourcePL.sort = this.actualSort; //this.sort;
    this.filterValPL = '';

  }
  AllCash() {
    this.ClearDateRangeField();
    //alert('abc');
    this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a => a.CeditStatus == 'Cash' && a.Patientid != 'SoftDelete');
    this.filterVal = '';

    this.dataSource = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    this.dataSource.paginator = this.actualPaginator; //this.paginator;
    this.dataSource.sort = this.actualSort; //this.sort;
    this.filterVal = '';

    // this.dataSourcePL = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    // this.dataSourcePL.paginator = this.actualPaginator; //this.paginator;
    // this.dataSourcePL.sort = this.actualSort; //this.sort;
    // this.filterValPL = '';

  }
  AllCashPL() {
    this.ClearDateRangeFieldPL();
    //alert('abc');
    this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a => a.CeditStatus == 'Cash' && a.Patientid != 'SoftDelete');
    this.filterVal = '';

    // this.dataSource = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    // this.dataSource.paginator = this.actualPaginator; //this.paginator;
    // this.dataSource.sort = this.actualSort; //this.sort;
    // this.filterVal = '';

    this.dataSourcePL = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    this.dataSourcePL.paginator = this.actualPaginator; //this.paginator;
    this.dataSourcePL.sort = this.actualSort; //this.sort;
    this.filterValPL = '';

  }

  myDate: string;
  ShowTodaysData() {
    this.ClearDateRangeField();
    //alert('abc');
    this.myDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy').toString();
    //var myDate1 = this.datePipe.transform(new Date(new Date().getTime()-(1*24*60*60*1000)), 'dd-MM-yyyy').toString();
    var myDate1 = this.datePipe.transform(new Date(new Date().getTime()), 'dd-MM-yyyy').toString();

    //alert(myDate1);
    //this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a=> a.DateStart == this.myDate);
    if(this.refferDoctor != '--NA--' ){
      this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a => this.datePipe.transform(new Date(a.BillingDate), 'dd-MM-yyyy').toString() == myDate1 && a.refferDoctor==this.refferDoctor);
    
    }
    else{
      this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a => this.datePipe.transform(new Date(a.BillingDate), 'dd-MM-yyyy').toString() == myDate1);
    
    }
    this.filterVal = '';

    this.dataSource = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    this.dataSource.paginator = this.actualPaginator; //this.paginator;
    this.dataSource.sort = this.actualSort; //this.sort;
    this.filterVal = '';
this.returnTotal();
    // this.dataSourcePL = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    // this.dataSourcePL.paginator = this.actualPaginator; //this.paginator;
    // this.dataSourcePL.sort = this.actualSort; //this.sort;
    // this.filterValPL = '';

  }

  ShowTodaysDataPL() {
    this.ClearDateRangeFieldPL();
    //alert('abc');
    this.myDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy').toString();
    //var myDate1 = this.datePipe.transform(new Date(new Date().getTime()-(1*24*60*60*1000)), 'dd-MM-yyyy').toString();
    var myDate1 = this.datePipe.transform(new Date(new Date().getTime()), 'dd-MM-yyyy').toString();

    //alert(myDate1);
    //this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a=> a.DateStart == this.myDate);
    this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a => a.DateStart == myDate1);
    this.filterVal = '';

    // this.dataSource = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    // this.dataSource.paginator = this.actualPaginator; //this.paginator;
    // this.dataSource.sort = this.actualSort; //this.sort;
    // this.filterVal = '';

    this.dataSourcePL = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    this.dataSourcePL.paginator = this.actualPaginator; //this.paginator;
    this.dataSourcePL.sort = this.actualSort; //this.sort;
    this.filterValPL = '';

  }
  passdate: string;
  passdatePL: string;
  StartDate:string;
  EndDate:string;
  StartDatePL:string;
  EndDatePL:string;
  MonthName:string;
  ShowTodaysDataFromCalendar(passdate) {
    this.ClearDateRangeField();
    //alert(passdate);
    this.myDate = this.datePipe.transform(new Date(passdate), 'dd-MM-yyyy').toString();
    //alert(this.myDate);
    //var myDate1 = this.datePipe.transform(new Date(new Date().getTime()-(1*24*60*60*1000)), 'dd-MM-yyyy').toString();
    var myDate1 = this.datePipe.transform(new Date(new Date().getTime()), 'dd-MM-yyyy').toString();

    //alert(myDate1);
    //this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a=> a.DateStart == this.myDate);
    //this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a => a.BillingDate == this.myDate);
    if(this.refferDoctor != '--NA--' ){
      this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a => this.datePipe.transform(new Date(a.BillingDate), 'dd-MM-yyyy').toString() == this.myDate && a.refferDoctor==this.refferDoctor);
      //this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a => this.datePipe.transform(new Date(a.BillingDate), 'dd-MM-yyyy').toString() == myDate1 && a.refferDoctor==this.refferDoctor);
    
    }
    else{
    this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a => this.datePipe.transform(new Date(a.BillingDate), 'dd-MM-yyyy').toString() == this.myDate);
    }
    this.filterVal = '';

    this.dataSource = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    this.dataSource.paginator = this.actualPaginator; //this.paginator;
    this.dataSource.sort = this.actualSort; //this.sort;
    this.filterVal = '';
this.returnTotal();
    // this.dataSourcePL = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    // this.dataSourcePL.paginator = this.actualPaginator; //this.paginator;
    // this.dataSourcePL.sort = this.actualSort; //this.sort;
    // this.filterValPL = '';

  }

  ShowTodaysDataFromCalendarPL(passdate) {
    this.ClearDateRangeFieldPL();
    //alert(passdate);
    this.myDate = this.datePipe.transform(new Date(passdate), 'dd-MM-yyyy').toString();
    //alert(this.myDate);
    //var myDate1 = this.datePipe.transform(new Date(new Date().getTime()-(1*24*60*60*1000)), 'dd-MM-yyyy').toString();
    var myDate1 = this.datePipe.transform(new Date(new Date().getTime()), 'dd-MM-yyyy').toString();

    //alert(myDate1);
    //this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a=> a.DateStart == this.myDate);
    //this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a => a.BillingDate == this.myDate);
    this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a => this.datePipe.transform(new Date(a.BillingDate), 'dd-MM-yyyy').toString() == this.myDate);
    this.filterVal = '';

    // this.dataSource = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    // this.dataSource.paginator = this.actualPaginator; //this.paginator;
    // this.dataSource.sort = this.actualSort; //this.sort;
    // this.filterVal = '';
    this.dataSourcePL = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    this.dataSourcePL.paginator = this.actualPaginator; //this.paginator;
    this.dataSourcePL.sort = this.actualSort; //this.sort;
    this.filterValPL = '';

  }

  ShowDateRangeDate(passdateFrom,passdateTo) {

    var date2 = new Date(passdateFrom);
    //alert(passdate);
    this.myDate = this.datePipe.transform(new Date(passdateFrom), 'dd-MM-yyyy').toString();
    //alert(this.myDate);
    //var myDate1 = this.datePipe.transform(new Date(new Date().getTime()-(1*24*60*60*1000)), 'dd-MM-yyyy').toString();
    var myDate1 = this.datePipe.transform(new Date(new Date()), 'dd-MM-yyyy').toString();
    var myDate2 = this.datePipe.transform(new Date(passdateFrom), 'dd-MM-yyyy').toString();

    // if(new Date(new Date()) > new Date(passdateFrom)){
    //   alert('greater');
    // }

    //alert(myDate1);
    //this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a=> a.DateStart == this.myDate);
    //this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a => a.BillingDate == this.myDate);
    //this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a => this.datePipe.transform(new Date(a.BillingDate), 'dd-MM-yyyy').toString() == this.myDate);
    
    if(this.refferDoctor != '--NA--' ){
      this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter
      (a => this.addDays(new Date(a.BillingDate),0) >= new Date(passdateFrom) && this.addDays(new Date(a.BillingDate),-1) <= new Date(passdateTo) 
      && a.refferDoctor == this.refferDoctor);
  
    }
    else{
      this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter
      (a => this.addDays(new Date(a.BillingDate),0) >= new Date(passdateFrom) && this.addDays(new Date(a.BillingDate),-1) <= new Date(passdateTo) );
  
    }
    
    this.filterVal = '';

    this.dataSource = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    this.dataSource.paginator = this.actualPaginator; //this.paginator;
    this.dataSource.sort = this.actualSort; //this.sort;
    this.filterVal = '';

    // this.dataSourcePL = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    // this.dataSourcePL.paginator = this.actualPaginator; //this.paginator;
    // this.dataSourcePL.sort = this.actualSort; //this.sort;
    // this.filterValPL = '';
    this.returnTotal();
  }

  ShowDateRangeDatePL(passdateFrom,passdateTo) {

    var date2 = new Date(passdateFrom);
    //alert(passdate);
    this.myDate = this.datePipe.transform(new Date(passdateFrom), 'dd-MM-yyyy').toString();
    //alert(this.myDate);
    //var myDate1 = this.datePipe.transform(new Date(new Date().getTime()-(1*24*60*60*1000)), 'dd-MM-yyyy').toString();
    var myDate1 = this.datePipe.transform(new Date(new Date()), 'dd-MM-yyyy').toString();
    var myDate2 = this.datePipe.transform(new Date(passdateFrom), 'dd-MM-yyyy').toString();

    // if(new Date(new Date()) > new Date(passdateFrom)){
    //   alert('greater');
    // }

    //alert(myDate1);
    //this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a=> a.DateStart == this.myDate);
    //this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a => a.BillingDate == this.myDate);
    //this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a => this.datePipe.transform(new Date(a.BillingDate), 'dd-MM-yyyy').toString() == this.myDate);
    
    this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter
        (a => this.addDays(new Date(a.BillingDate),0) >= new Date(passdateFrom) && this.addDays(new Date(a.BillingDate),-1) <= new Date(passdateTo) );
    
    this.filterVal = '';

    // this.dataSource = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    // this.dataSource.paginator = this.actualPaginator; //this.paginator;
    // this.dataSource.sort = this.actualSort; //this.sort;
    // this.filterVal = '';
    this.dataSourcePL = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    this.dataSourcePL.paginator = this.actualPaginator; //this.paginator;
    this.dataSourcePL.sort = this.actualSort; //this.sort;
    this.filterValPL = '';

  }

  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
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
  applyFilterPL(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSourcePL.filter = filterValue;
  }

  applyFilterAll(filterValue: string) {
    // filterValue = filterValue.trim(); // Remove whitespace
    // filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = '';
  }




  refreshParent() {

    
    this.farmacyEntryService.getFarmDataNamewise(this.Username).subscribe((data: FarmacyDeliveryToPatient[]) => {
      //console.log('jay' + data);
      this.asyncPipeFarmacyDeliveryToPatient = data.filter(a => a.PharmacyStoreName == this.Username && a.Patientid !='SoftDelete');;
      //this.GroupedDat();
      this.asyncPipeFarmacyDeliveryToPatientBackup = this.asyncPipeFarmacyDeliveryToPatient;
      this.dataSource = new MatTableDataSource(data.filter(a => a.PharmacyStoreName == this.Username && a.Patientid !='SoftDelete'));
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';

    })
  }

  addEditExpenseItem(expenseId: string, firstName: string, newIDParam: string) {
    if (expenseId !== null) {
      this._router.navigate(['/Farmaentry', expenseId], { queryParams: { username: firstName, newid: newIDParam } });
    }
    else {
      this._router.navigate(['/freshCase', 'Addnew'], { queryParams: { username: "" } });
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

  addEditLabTestItem(expenseId: FarmacyDeliveryToPatient, firstName: string, parentTest: string) {
    if (expenseId !== null) {
      this._router.navigate(['/LabTestInd', expenseId.UnqueID, firstName], { queryParams: { username: parentTest } });
    }
    else {
      this._router.navigate(['/LabTestInd', 'Addnew', firstName], { queryParams: { username: "" } });
    }
  }

  addEditLabTestItemForAll(expenseId: FarmacyDeliveryToPatient, firstName: string, parentTest: string) {
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
    var delBtn = confirm(" Do you want to delete?");
  if ( delBtn == true ) {
    this.farmacyEntryService.delete(UnqueID).subscribe(
      () => {
        this.refreshParent();
        // setTimeout(() => {
        //   this.refreshParent();

        // }, 1000);

      });
        }
  }
 

}


