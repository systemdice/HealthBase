import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { AppointmentDetail, FarmacyDeliveryToPatient, LabTestIndividual, NewModifyCase, NotifyPendingTestData, OPDIPDModel, other, ProfitLost, ReferralMaster } from 'src/app/models/UserData';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { DateAdapter } from '@angular/material/core';

import { Observable, Subject, ReplaySubject, from, of, range } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';
//import Rx from 'rxjs/Rx';
import * as _ from 'lodash';
import { AppointmentDetailService } from 'src/app/Services/appointment-detail.service';
import { OtherServicesService } from 'src/app/Services/other-services.service';
import { RefaralService } from 'src/app/Services/referal.service';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StringDecoder } from 'string_decoder';

import * as pluginLabels from 'chartjs-plugin-datalabels';
import { APIDetails } from 'src/app/shared/AllConstants';
import { JsonpClientBackend } from '@angular/common/http';
import { AddModifyCaseService } from 'src/app/Services/add-modify-case.service';
import { FarmacyEntryService } from 'src/app/Services/farmacy-entry.service';
import { MatDialog } from '@angular/material';
import { LabTestIndividualService } from 'src/app/Services/lab-test-individual.service';
import { StorageService } from 'src/app/shared/storage.service';


export class Data {
  PlayerName: string;
  Run: string;
}

@Component({
  selector: 'app-appointment-dashboard',
  templateUrl: './appointment-dashboard.component.html',
  styleUrls: ['./appointment-dashboard.component.css']
})
export class AppointmentDashboardComponent implements OnInit {



  panelOpenStatePH:boolean;
  groupedData: any = [];
  lineChartData: ChartDataSets[] = [
    { data: [8005, 7298, 7800, 7500, 7887, 7005], label: 'collection' },
  ];

  lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June'];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  // Pie
  public pieChartLabels: string[] = ['Chrome', 'Safari', 'Firefox', 'Internet Explorer', 'Other'];
  public pieChartData: number[] = [40, 20, 20, 10, 10];
  public pieChartType: string = 'pie';
  http: any;

  // events
  public chartClicked(e: any): void {
    //console.log(e);
  }

  public chartHovered(e: any): void {
    //console.log(e);
  }

  title = 'app';
  data: Data[];
  
  url = APIDetails.HelathAPI + '/AppointmentDetail';
  Player = [];
  Run = [];
  chart: any = [];
  asyncPi: NotifyPendingTestData[] = [];
  CaseID: string = '';
  UserName: string = '';
  showAll: boolean = true;
  Username: string;
  Role: string;
  Location: string;

  asyncPipeFarmacyDeliveryToPatient: NewModifyCase[] = [];
  asyncPipeFarmacyDeliveryToPatientBackup: NewModifyCase[] = [];

  asyncPipeFarmacyDeliveryToPatientPL: NewModifyCase[] = [];
  asyncPipeFarmacyDeliveryToPatientBackupPL: NewModifyCase[] = [];

  groupedMap: any;
  //result:any[]=[];

  reportArryX: any[] = [];
  reportArryY: any[] = [];

  getMonthName(monhNumber) {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    //var d = new Date();
    return months[monhNumber - 1]; // "July" (or current month)
  }
  constructor(private httpClient: HttpClient, private dateAdapter: DateAdapter<Date>,private datePipe: DatePipe, 
    public otherServicesService: OtherServicesService, public referralMasterService: RefaralService,
    private addModifyCaseService: AddModifyCaseService, public farmacyEntryService: FarmacyEntryService,
     private labTestIndividualService: LabTestIndividualService,
    private dialog: MatDialog, private _router: Router, private _store: StorageService,
    private router: Router, private route: ActivatedRoute) {
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    
   }
  ngOnInit(): void {
    
    this.BarchatConfiguration();
    this.LoadAllDoctor();

    

   
    //this.AllTestStatus(); //It will be uncomment if Test status report is required
    var d = new Date();
        var dMonth = d.getUTCMonth();
        var Year = d.getUTCFullYear();
    this.SearchYear = Year.toString();
    this.SearchData();

  }

  labTestIndividual: LabTestIndividual[];
  AllTestStatus() {
    //this.CaseID,this.TestName,this.parentTest
    this.labTestIndividualService.getAll().subscribe(
      (test) => {
        this.labTestIndividual = test;
      });
  }
  referralMaster: ReferralMaster[] = [];
  LoadAllDoctor() {
    this.referralMasterService.getAll().subscribe((data: ReferralMaster[]) => {
      console.log(data);
      this.referralMaster = data;
      this.GroupedDat();

    })
  }
  Finalresult = [];
  arr11 = [];
  arr22 = [];
  GroupedDat() {
    var result = [];
    this.Finalresult = [];
    this.referralMaster.reduce(function (res, value) {
      if (!res[value.Department]) {
        res[value.Department] = { Id: value.Department, qty: 0 };
        result.push(res[value.Department])
      }
      res[value.Department].qty += 1;

      return res;
    }, {});

    this.Finalresult = result;

    for (let key of Object.keys(this.Finalresult)) {
      //let mealName = this.Finalresult[key];
      let mealName1 = this.Finalresult[key];
      //console.log('ttt'+ JSON.stringify(mealName));
      this.arr11.push(mealName1.Id + '(' + mealName1.qty + ')');
      this.arr22.push(mealName1.qty);
      // ... do something with mealName
      //console.log('meal'+mealName);
    }

    // for (var i = 0; i < this.Finalresult.length; i++){
    //   //document.write("<br><br>array index: " + i);
    //   var obj = this.Finalresult[i];
    //   for (var key in obj){
    //     var value = obj[key];
    //     //this.arr11.push(key);
    //     this.arr22.push(value);
    //     //document.write("<br> - " + key + ": " + value);
    //   }
    // }

  }

  testtest(test: any): any {
    this.resultArray = Object.keys(test).map(function (personNamedIndex) {
      let person = test[personNamedIndex];
      // do something with person
      return person;
    });
  }
  cars: any[];
  cars1: AppointmentDetail[];
  result1: ReferralMaster[];
  result2: ReferralMaster[];
  resultArray: any[];
  carType: any[] = [];
  carSum: any[] = [];
  testArr = [];
  testArr1 = [];
  testArr2 = [];
  testTable=[];
  testInnerTable=[];
  makearray() {
    this.cars = [{ make: 'audi', model: 'r8', year: '2012' }, { make: 'audi', model: 'rs5', year: '2013' }, { make: 'ford', model: 'mustang', year: '2012' }, { make: 'ford', model: 'fusion', year: '2015' }, { make: 'kia', model: 'optima', year: '2012' }],
      this.httpClient.get(this.url).subscribe((result: AppointmentDetail[]) => {
        this.cars1 = result;
        this.result1 = this.cars1.reduce(function (r, a) {
          r[a.ReferralMaster.FirstName] = r[a.ReferralMaster.FirstName] || [];
          r[a.ReferralMaster.FirstName].push(a);
          return r;
        }, Object.create(null));

        var d = new Date('2020-11-26T18:30:00.000Z');
        var dMonth = d.getUTCMonth();
        var Year = d.getUTCFullYear();
        //let p = d.toISOString('dd-mm-yyyy');
        // alert(d.getUTCDate());
        // alert(d.getDay()+"-"+d.getMonth()+"-"+d.getFullYear());

        const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        // alert(monthNames[d.getMonth()]);
        // alert(d.getDate());

        //   this.result2 = this.cars1.reduce(function (r, a) {
        //     r[monthNames[ new Date(a.ReferralMaster.appointment).getUTCMonth()]] = monthNames[r[new Date(a.ReferralMaster.appointment).getUTCMonth()]] || [];
        //     r[monthNames[new Date(a.ReferralMaster.appointment).getUTCMonth()]].push(a.ReferralMaster);
        //     return r;
        // }, Object.create(null));

        this.result2 = this.cars1.reduce(function (r, a) {
          r[a.ReferralMaster.FirstName] = r[a.ReferralMaster.FirstName] || [];
          r[a.ReferralMaster.FirstName].push(a.ReferralMaster);
          return r;
        }, Object.create(null));


        // this.result2 = this.cars1.reduce(function (r, a) {
        //   r[ new Date(a.ReferralMaster.appointment).toLocaleDateString()] = r[new Date(a.ReferralMaster.appointment).toLocaleDateString()] || [];
        //   r[new Date(a.ReferralMaster.appointment).toLocaleDateString()].push(a.ReferralMaster);
        //   return r;
        // }, Object.create(null));


        let resultF = this.result2;
        Object.keys(resultF).forEach((key, values) => {
          this.carType.push(key);
          let sum: number = resultF[key]
            .map(a => a.fees)
            .reduce(function (a, b) {
              return a + b;
            });
          this.carSum.push(sum);
          //this.carSum.push(resultF[key].length);
        });

        // console.log(this.carType);
        // console.log(this.carSum);


        [this.result2].forEach(a => {
          //console.log(a.keys)
        });


        for (let key of Object.keys(this.result2)) {
          let mealName = this.result2[key];
          //console.log('ttt'+ JSON.stringify(mealName));
          this.Player.push(mealName);
          // ... do something with mealName
          //console.log('meal'+mealName);
        }

        // this.result2.forEach(x => {  
        //   //this.Player.push(x.doctorname);  
        //   this.Run.push(x.fees);  
        // });
        this.result1 = this.cars1.reduce(function (r, a) {
          r[a.DateStart] = r[a.DateStart] || [];
          r[a.DateStart].push(a);
          return r;
        }, Object.create(null));
        for (let key of Object.keys(this.result1)) {
          let mealName = this.result1[key];
          //console.log('ttt'+ JSON.stringify(mealName));
          this.testArr.push(mealName);
          // ... do something with mealName
          //console.log('meal'+mealName);
        }
        //alert(this.testArr.length);
        this.testInnerTable = [];
        this.testTable=[];
        this.testArr.forEach(a => {
          this.testTable.push({'DateStart':a[0].DateStart,'UnqueID':a[0].UnqueID,'appointmentcount':a.length})
          a.forEach(b => {
            this.testInnerTable.push({'DateStart':b.DateStart,'PatientDetails':b.PatientDetails,'ReferralMaster':b.ReferralMaster});
          });
          this.testTable = this.testTable.filter((v,i,a)=>a.findIndex(t=>(t.DateStart === v.DateStart))===i)
          //this.testInnerTable.push(a.DateStart)
          //console.log('jj' + JSON.stringify(a[0].DateStart));
          //console.log('jjl' + JSON.stringify(a.length));
        });


      });




  }

  returnAllAppoinrmrmnt(dt:string):any[]
  {

    // let arr = [{x:1}, {x:3}]

    // console.log('newarr is'+arr.reduce((accumulator, current) => accumulator + current.x, 0));
    return this.testInnerTable.filter( x => x!== undefined && x.DateStart == dt
    
    );
  }

  returnAllAppoinrmrmntCount(dt:string):number
  {
    let arr =  this.testInnerTable.filter( x => x!== undefined && x.DateStart == dt);
    const sum = arr.reduce((sum, current) => sum + Number(current.ReferralMaster.fees), 0);
    return sum;
    //console.log('newarr is'+arr.reduce((accumulator, current) => accumulator + current.x, 0));
    
    // return arr.reduce(
    //   (accumulator, current) => 
    //   accumulator + Number(current.ReferralMaster.fees)==undefined?0:Number(current.ReferralMaster.fees), 0)
  }
  filterVal = new Date();
  filterValDaywise:string;
  //today's date
todayDate:Date = new Date();

//any date
//someDate: Date = new Date(anydate);
date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
valueChangedWorkingDat(tt){
  //this.filterValDaywise = this.datePipe.transform(tt, 'dd-MM-yyyy');
  //testTable
  this.WorkingDaydetails(this.datePipe.transform(tt, 'dd-MM-yyyy'));
  // alert(this.filterVal);
  // alert(tt);
  
}
valChangeforActualAppointmnet:string;
valueChanged(tt){
  //this.filterVal = this.datePipe.transform(tt, 'dd-MM-yyyy');
  this.returnAllApointmentActual(this.datePipe.transform(tt, 'dd-MM-yyyy'));
  this.valChangeforActualAppointmnet = this.datePipe.transform(tt, 'dd-MM-yyyy');
  // alert(this.filterVal);
  // alert(tt);
  
}
  returnAllAppoinrmrmntDiscount(dt:string):number
  {
    let arr =  this.testInnerTable.filter( x => x!== undefined && x.DateStart == dt);
    const sum = arr.reduce((sum, current) => sum + Number(current.ReferralMaster.Discount), 0);
    return sum;
    //console.log('newarr is'+arr.reduce((accumulator, current) => accumulator + current.x, 0));
    
    // return arr.reduce(
    //   (accumulator, current) => 
    //   accumulator + Number(current.ReferralMaster.fees)==undefined?0:Number(current.ReferralMaster.fees), 0)
  }
  returnAllAppointmrntFees(dt:string):number
  {
    let arr =  this.actualAppointmentDeatils.filter( x => x!== undefined && x.ReferralMaster.appointment == dt);
    const sum = arr.reduce((sum, current) => sum + Number(current.ReferralMaster.fees), 0);
    return sum;
    //console.log('newarr is'+arr.reduce((accumulator, current) => accumulator + current.x, 0));
    
    // return arr.reduce(
    //   (accumulator, current) => 
    //   accumulator + Number(current.ReferralMaster.fees)==undefined?0:Number(current.ReferralMaster.fees), 0)
  }
  returnAllAppointmrntDiscount(dt:string):number
  {
    let arr =  this.actualAppointmentDeatils.filter( x => x!== undefined && x.ReferralMaster.appointment == dt);
    const sum = arr.reduce((sum, current) => sum + Number(current.ReferralMaster.Discount), 0);
    return sum;
    //console.log('newarr is'+arr.reduce((accumulator, current) => accumulator + current.x, 0));
    
    // return arr.reduce(
    //   (accumulator, current) => 
    //   accumulator + Number(current.ReferralMaster.fees)==undefined?0:Number(current.ReferralMaster.fees), 0)
  }

  WorkingDaydetails(dt:string):any[]
  {
    this.testTable=[];
    let arr = this.testInnerTable.filter( x => x!== undefined && x.DateStart == dt);

    this.testTable = arr.filter((v,i,a)=>a.findIndex(t=>(t.DateStart === v.DateStart))===i)
    // this.actualAppointmentDeatils = arr;
    // const sum = arr.reduce((sum, current) => sum + Number(current.ReferralMaster.Discount), 0);
    return this.testTable;
    //console.log('newarr is'+arr.reduce((accumulator, current) => accumulator + current.x, 0));
    
    // return arr.reduce(
    //   (accumulator, current) => 
    //   accumulator + Number(current.ReferralMaster.fees)==undefined?0:Number(current.ReferralMaster.fees), 0)
  }

  actualAppointmentDeatils=[];
  returnAllApointmentActual(dt:string):any[]
  {
    let arr =  this.testInnerTable.filter( x => x!== undefined && x.ReferralMaster.appointment == dt);
    this.actualAppointmentDeatils = arr;
    const sum = arr.reduce((sum, current) => sum + Number(current.ReferralMaster.Discount), 0);
    return arr;
    //console.log('newarr is'+arr.reduce((accumulator, current) => accumulator + current.x, 0));
    
    // return arr.reduce(
    //   (accumulator, current) => 
    //   accumulator + Number(current.ReferralMaster.fees)==undefined?0:Number(current.ReferralMaster.fees), 0)
  }
 
  isShown: boolean = false ; // hidden by default


toggleShow() {
this.isShown = ! this.isShown;
}

  BarchatConfiguration() {
    this.makearray();
    this.httpClient.get(this.url).subscribe((result: any[]) => {
      result.forEach(x => {
        this.Player.push(x.ReferralMaster.fees);
        this.Run.push(x.ReferralMaster.Discount);
      });

      this.chart = new Chart('canvas', {

        type: 'bar',
        data: {
          labels: this.carType,
          datasets: [
            {
              data: this.carSum,
              label: 'Doctors',

              borderColor: '#3cba9f',
              backgroundColor: [
                "#3cb371",
                "#0000FF",
                "#9966FF",
                "#4C4CFF",
                "#00FFFF",
                "#f990a7",
                "#aad2ed",
                "#FF00FF",
                "Blue",
                "Red",
                "Blue"
              ],
              fill: true
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: 'Doctor collection'
          },
          legend: {
            display: true
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true
            }],
          }
        }
      });

      this.chart = new Chart('canvas2', {
        type: 'bar',
        data: {
          labels: this.carType,
          datasets: [
            {
              data: this.carSum,
              label: 'Crude',

              borderColor: '#3cba9f',
              backgroundColor: [
                "#3cb371",
                "#0000FF",
                "#9966FF",
                "#4C4CFF",
                "#00FFFF",
                "#f990a7",
                "#aad2ed",
                "#FF00FF",
                "Blue",
                "Red",
                "Blue"
              ],
              fill: true
            }
          ]
        },
        options: {
          legend: {
            display: true
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true
            }],
          }
        }
      });
    });
  }

  dataOther: any[] = [];//[1,2,3];

  //pie chart option
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels2: Label[] = this.arr11;
  public pieChartData2: number[] = this.arr22;
  public pieChartType2: ChartType = 'pie';
  public pieChartLegend = true;
  //public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

//////////////////////////Dashboard chart data
asyncOPDIPDModel:OPDIPDModel[];
SearchData() {

  this.addModifyCaseService.getOPDIPDPerMonth().subscribe((data: OPDIPDModel[]) => {
    //console.log('jay'+data);
    this.asyncOPDIPDModel = data;
    
    
    //this.asyncPipeFarmacyDeliveryToPatientPL = this.asyncPipeFarmacyDeliveryToPatient.filter(a => a.DateStart != null);
    this.asyncOPDIPDModel.sort((a, b) => (a.BillingMonth > b.BillingMonth) ? 1 : (a.BillingMonth === b.BillingMonth) ? ((a.BillingYear > b.BillingYear) ? 1 : -1) : -1)


    // var result = [];
    // this.asyncOPDIPDModel.reduce(function (res, value) {
      
    //   if (!res[value.BillingMonth]) {
    //     res[value.BillingMonth] = { Id: value.BillingMonth, GrossProffitPriceOnthisBill: 0 };
    //     result.push(res[value.BillingMonth])
    //   }
    //   res[value.BillingMonth].GrossProffitPriceOnthisBill += parseFloat(value.GrossProffitPriceOnthisBill);
    //   return res;
    // }, {});

    //alert(JSON.stringify(result));

    this.reportArryX = this.asyncOPDIPDModel.filter(a=>a.OPDIPDType == 'IPD').map(robot => robot.RecordCount).filter(function (e) { return e != null; });;
    this.reportArryY = this.asyncOPDIPDModel.filter(a=>a.OPDIPDType == 'IPD').map(robot => this.getMonthName(robot.BillingMonth)).filter(function (e) { return e != null; });;


    // this.reportArryX = this.asyncOPDIPDModel.map(robot => robot.RecordCount).filter(function (e) { return e != null; });;
    // this.reportArryY = this.asyncOPDIPDModel.map(robot => this.getMonthName(robot.BillingMonth)).filter(function (e) { return e != null; });;
    //this.reportArryY = this.reportArryY.map(a=> this.changeFormat(a.BillingMonth) );


    //this.reportArryX = this.asyncPipeFarmacyDeliveryToPatientPL.map(robot => robot.GrossProffitPriceOnthisBill).filter(function (e) {return e != null;});;
    //this.reportArryY = this.asyncPipeFarmacyDeliveryToPatientPL.map(robot => this.getMonthName(robot.BillingMonth)).filter(function (e) {return e != null;});;
    //this.ShowChartData(this.reportArryX, this.reportArryY,null);
    
  // this.asyncPipeFarmacyDeliveryToPatientPL = this.asyncPipeFarmacyDeliveryToPatient.filter(a => a.BillingYear != null && a.BillingYear == this.SearchYear);
  // this.asyncPipeFarmacyDeliveryToPatientPL = this.asyncPipeFarmacyDeliveryToPatientPL.filter(a => a.BillingMonth != null);
  // this.asyncPipeFarmacyDeliveryToPatientPL.sort((a, b) => (a.BillingMonth > b.BillingMonth) ? 1 : (a.BillingMonth === b.BillingMonth) ? ((a.BillingYear > b.BillingYear) ? 1 : -1) : -1)

  // var result = [];
  // this.asyncPipeFarmacyDeliveryToPatientPL.reduce(function (res, value) {
  //   if (!res[value.BillingMonth]) {
  //     res[value.BillingMonth] = { Id: value.BillingMonth, GrossProffitPriceOnthisBill: 0 };
  //     result.push(res[value.BillingMonth])
  //   }
  //   res[value.BillingMonth].GrossProffitPriceOnthisBill += parseFloat(value.GrossProffitPriceOnthisBill);
  //   return res;
  // }, {});

  //alert(JSON.stringify(result));

  // this.reportArryX = result.map(robot => robot.GrossProffitPriceOnthisBill).filter(function (e) { return e != null; });;
  // this.reportArryY = result.map(robot => this.getMonthName(robot.Id)).filter(function (e) { return e != null; });;


  //this.reportArryX = this.asyncPipeFarmacyDeliveryToPatientPL.map(robot => robot.GrossProffitPriceOnthisBill).filter(function (e) {return e != null;});;
  //this.reportArryY = this.asyncPipeFarmacyDeliveryToPatientPL.map(robot => this.getMonthName(robot.BillingMonth)).filter(function (e) {return e != null;});;
  var groupedPeople=this.groupArrayOfObjects(data,"Month");
  console.log(groupedPeople.Male);//will be the Males 
  console.log(groupedPeople.Female);//will be the Females

  var result2 = [];
  var arr:any[]=data;
  data.reduce(function (res, value1) {
    if (!res[value1.BillingMonth]) {
      res[value1.BillingMonth] = { Id: value1.BillingMonth, GrossSale: 0, GrossPurchase: 0,VSCount:0 };
      result2.push(res[value1.BillingMonth])
    }
    res[value1.BillingMonth].GrossSale += parseFloat(value1.IPDCount);
    res[value1.BillingMonth].GrossPurchase += parseFloat(value1.OPDCount)
    res[value1.BillingMonth].VSCount += parseFloat(value1.VSCount)
    return res;
  }, {});



   var result1 = [];
   this.addModifyCaseService.getOPDIPDVSCount().subscribe((data: ProfitLost[]) => {
    //console.log('jay'+data);
    result1 = data;

   

    this.ShowChartData(this.reportArryX, this.reportArryY,result1,result2);
   });
  // this.asyncPipeFarmacyDeliveryToPatientPL.reduce(function (res, value1) {
  //   if (!res[value1.BillingMonth]) {
  //     res[value1.BillingMonth] = { Id: value1.BillingMonth, GrossSale: 0, GrossPurchase: 0 };
  //     result1.push(res[value1.BillingMonth])
  //   }
  //   res[value1.BillingMonth].GrossSale += parseFloat(value1.GrossPurchasePriceOnthisBill);
  //   res[value1.BillingMonth].GrossPurchase += parseFloat(value1.GrossSalePriceOnthisBill)
  //   return res;
  // }, {});
  })
}

groupArrayOfObjects(list, key) {
  return list.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

chartMaster;
pieChartOptionsMaster: ChartOptions;
pieChartLabelsMaster:string[];// = ['Chrome', 'Safari', 'Firefox','Internet Explorer','Other'];
pieChartDataMaster:number[];// = [40, 20, 20 , 10,10];
pieChartTypeMaster:string;// = 'pie';
pieChartPlugins = [];

barChartPluginsE; 
barChartOptionsE: ChartOptions;
barChartLabelsE: Label[];
barChartLabelsDoct: Label[];
barChartLabelsIndDoct: Label[];
barChartLabelsOPD: Label[];
barChartTypeE: ChartType = 'bar';
barChartTypeHorizontal : ChartType = 'horizontalBar';
barChartTypeEP: ChartType = 'line';
barChartLegendE;
piePlugins;
barChartDataE: ChartDataSets[];
barChartDataOPD: ChartDataSets[];
public lineChartColorsE: Color[];
barChartDataDoct: ChartDataSets[];
barChartDataIndDoct: ChartDataSets[];
SearchYear: string;
ExpireYear: string;

public barChartOptions: ChartOptions = {
  responsive: true
};
public barChartType: ChartType = 'horizontalBar';
public barChartLegend = true;

public barChartData: ChartDataSets[] ;
public barChartLabels: string[] ;

asyncDoctorModel:OPDIPDModel[];
asyncIndDoctorModel:OPDIPDModel[];

chartReady:boolean=false;
ShowChartData(reportArryX, reportArryY, result1,result2) {
  var OPDX:any = this.asyncOPDIPDModel.filter(a=>a.OPDIPDType == 'OPD').map(robot => robot.RecordCount).filter(function (e) { return e != null; });;
  var OPDY:any = this.asyncOPDIPDModel.filter(a=>a.OPDIPDType == 'OPD').map(robot => this.getMonthName(robot.BillingMonth)).filter(function (e) { return e != null; });;

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
  this.barChartLabelsOPD = OPDY; 
  this.barChartTypeE = 'bar';
  this.barChartTypeHorizontal = 'horizontalBar';
  this.barChartTypeEP = 'line';
  this.barChartLegendE = false;
  this.barChartPluginsE = [pluginDataLabels];

  this.barChartDataE = [
    { data: reportArryX, label: 'IPD' },
    // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];
  this.barChartDataOPD = [
    { data: OPDX, label: 'OPD' },
    // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];


  this.addModifyCaseService.getCasewithDoctorAll().subscribe((data: OPDIPDModel[]) => {
    //console.log('jay'+data);
    this.asyncDoctorModel = data;
    var doctorLabel = this.asyncDoctorModel.map(robot => robot.OPDIPDType==''?'Doctor:NA':robot.OPDIPDType).filter(function (e) { return e != null; });;
    var OPDX:any = this.asyncDoctorModel.map(robot => robot.RecordCount).filter(function (e) { return e != null; });;
    var OPDY:any = this.asyncDoctorModel.map(robot => this.getMonthName(robot.BillingMonth)).filter(function (e) { return e != null; });;
  
    this.barChartDataDoct = [
      { data: OPDX, label: 'Name' },
      // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ];
    this.barChartLabelsDoct = doctorLabel;
  });

  this.addModifyCaseService.getCasewithDoctorPerMonth().subscribe((data: OPDIPDModel[]) => {
    //console.log('jay'+data);
    this.asyncIndDoctorModel = data.filter(a=> a.OPDIPDType == 'Dr. Mahesh Prasad Mohanta');
    //var doctorLabel = this.asyncDoctorModel.map(robot => robot.OPDIPDType==''?'Doctor:NA':robot.OPDIPDType).filter(function (e) { return e != null; });;
    var OPDXInd:any = this.asyncIndDoctorModel.map(robot => robot.RecordCount).filter(function (e) { return e != null; });;
    var OPDYInd:any = this.asyncIndDoctorModel.map(robot => this.getMonthName(robot.BillingMonth)).filter(function (e) { return e != null; });;
  
    this.barChartDataIndDoct = [
      { data: OPDXInd, label: 'Mahesh' },
      // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ];
    this.barChartLabelsIndDoct = OPDYInd;
  });

  



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
    var reportArryMultiX3 = result2.map(robot => robot.VSCount).filter(function (e) { return e != null; });;
    var reportArryMultiX2 = result2.map(robot => robot.GrossSale).filter(function (e) { return e != null; });;
    var reportArryMultiX1 = result2.map(robot => robot.GrossPurchase).filter(function (e) { return e != null; });;
    var reportArryMultiY = result2.map(robot => this.getMonthName(robot.Id)).filter(function (e) { return e != null; });;
  //var reportArryMultiX2 = this.asyncOPDIPDModel.map(robot => robot.Month).filter(function (e) { return e != null; });;
  var piex = result1.map(robot => robot.Quantity).filter(function (e) { return e != null; });;
  var piey = result1.map(robot => robot.ProductName).filter(function (e) { return e != null; });;

  this.chartMaster = {
    "datasets": [
      // { "data": [0, 30, 20, 40, 35, 45, 33, 0, 0], "label": "Bar 1" },
      // { "data": [0, 50, 60, 55, 59, 30, 40, 0, 0], "label": "Bar 2" },
      { "data": reportArryMultiX2, "label": "IPd" },
      { "data": reportArryMultiX1, "label": "OPD" },
      {"data":reportArryMultiX3, "label": "Vaccine" }
      //{ "data": [45, 45, 45], "label": "Line", "type": "line" }
    ],
    "labels": reportArryMultiY,
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


  this.pieChartOptionsMaster = {
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
  this.pieChartLabelsMaster = piey;
  this.pieChartDataMaster= piex;
  this.pieChartTypeMaster = 'pie';
  this.pieChartPlugins = [pluginLabels];
}


  //ended multibar
  this.barChartData = [
    { data: reportArryMultiX1, label: 'Approved', stack: 'a' },
    { data:reportArryMultiX2, label: 'Accepted', stack: 'a' },
    { data: reportArryMultiX3, label: 'Open', stack: 'a' }
  ];
  this.barChartLabels = ['P', 'R', 'B'];
  this.chartReady = true;

}
//ended here

}
