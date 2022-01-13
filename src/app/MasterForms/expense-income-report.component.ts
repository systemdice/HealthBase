import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms'
import { DatePipe } from '@angular/common';
import { AddModifyCaseService } from '../Services/add-modify-case.service';
import { NewModifyCase, PaymentHistory, ProfitLost } from '../models/UserData';
import { PaymentHistoryService } from '../Services/payment-history.service';
import { APIDetails } from '../models/AllConstansts';
import { HttpClient } from '@angular/common/http';
import { AllMasterFixedData } from '../shared/AllConstants';

@Component({
  selector: 'app-expense-income-report',
  templateUrl: './expense-income-report.component.html',
  styleUrls: ['./expense-income-report.component.css']
})
export class ExpenseIncomeReportComponent implements OnInit {
myDate:string;
myDate1:string;
myDate2:string;
Addressline1= AllMasterFixedData.Addressline1;
    Addressline2= AllMasterFixedData.Addressline2;
    Addressline3= AllMasterFixedData.Addressline3;
    Addressline4= AllMasterFixedData.Addressline4;
url = APIDetails.HelathAPI+"/Report"; //;'https://localhost:44380/Report'; 
// StartDate= new FormControl();
// EndDate = new FormControl();
StartDate:string;
EndDate :string;
resultRetrieve:ProfitLost[];
resultRetrieveAll:ProfitLost[];
  ngOnInit() {
    
    //this.myDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy').toString();

    
  }
  
  constructor(private fb: FormBuilder, private httpClient: HttpClient, private route: ActivatedRoute,private _router: Router, private datePipe: DatePipe,
    private addModifyCaseService: AddModifyCaseService, private paymentHistoryService: PaymentHistoryService) {
    // this.MainTestForm = this.fb.group({
    //   MainTest: this.fb.array([]),
    // })
  }

  groubedByTeam:any[];
  Expense:string;
  Income:string;
  showInDetail:boolean=false;
  showgrp:boolean=true;
  returnDate(dt:string){
    return this.datePipe.transform(dt, 'dd-MM-yyyy');
  }
  ShowData(cond:string){
    this.myDate1 = this.datePipe.transform(this.StartDate, 'dd-MM-yyyy').toString();
    this.myDate2 = this.datePipe.transform(this.EndDate, 'dd-MM-yyyy').toString();

    if(cond == "grp")
    {
      this.showInDetail = false;
      this.showgrp = true;
    this.httpClient.get(this.url+'/getExpenseIncomeFromTo/'+this.myDate1+'/'+this.myDate2+'/').subscribe((result: ProfitLost[]) => {  
      //this.resultRetrieve = result.sort((a, b) => (a.DateUse > b.DateUse) ? 1 : (a.DateUse === b.DateUse) ? ((a.ProductName > b.ProductName) ? 1 : -1) : -1 )
      this.resultRetrieve = result.sort((a, b) => (this.returnDate(a.DateUse) < this.returnDate(b.DateUse)) ? 1 : (this.returnDate(a.DateUse) === this.returnDate(b.DateUse)) ? ((a.ProductName > b.ProductName) ? 1 : -1) : -1 )
      
      var groupBy = function(xs, key) {
        return xs.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };
      var groubedByTeam1=groupBy(this.resultRetrieve, 'DateUse')
     
      this.groubedByTeam= Object.values(groubedByTeam1);
      //this.groubedByTeam= toObject(groubedByTeam1,'DateUse');
      var ex=0;
      var inn=0;
      this.groubedByTeam.forEach(([key, value]) => console.log('PKPK',key, value));

      //var ex: number = 0;
      var expenseArry = this.resultRetrieve.filter(b=>b.ProductName=='Expense');
      var incomeArry = this.resultRetrieve.filter(b=>b.ProductName=='Income');
    if (expenseArry.length > 0) {
      ex = expenseArry.map(a => parseFloat(a.Price)<0?(-1*parseFloat(a.Price)):parseFloat(a.Price)).reduce(function (a, b) {
        //return parseFloat(a) + parseFloat(b);
        return (a == 0 ? 0 : a) + (b == 0 ? 0 : b);
      });
    }
    if (incomeArry.length > 0) {
      inn = incomeArry.map(a => parseFloat(a.Price)<0?(-1*parseFloat(a.Price)):parseFloat(a.Price)).reduce(function (a, b) {
        //return parseFloat(a) + parseFloat(b);
        return (a == 0 ? 0 : a) + (b == 0 ? 0 : b);
      });
    }


    // alert('Total Expense'+ ex);
    // alert('Total Income'+ inn);
    this.Expense=ex.toString();
    this.Income=inn.toString();
    });  
  }
  else if(cond == "Both")
  {
    this.showInDetail = true;
      this.showgrp = true;
    this.httpClient.get(this.url+'/getExpenseIncomeFromTo/'+this.myDate1+'/'+this.myDate2+'/').subscribe((result: ProfitLost[]) => {  
      this.resultRetrieve = result.sort((a, b) => (this.returnDate(a.DateUse) < this.returnDate(b.DateUse)) ? 1 : (this.returnDate(a.DateUse) === this.returnDate(b.DateUse)) ? ((a.ProductName > b.ProductName) ? 1 : -1) : -1 )
      
      // result.forEach(x => {  
      //   this.Category.push(x.Category);  
      //   this.Amount.push(x.Amount);  
      // });     
     
      var groupBy = function(xs, key) {
        return xs.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };
      var groubedByTeam1=groupBy(this.resultRetrieve, 'DateUse')
     
      //const toObject = (arr, key) => arr.reduce((a, b) => ({ ...a, [b[key]]: b }), {});


      this.groubedByTeam= Object.values(groubedByTeam1);
      //this.groubedByTeam= toObject(groubedByTeam1,'DateUse');
      var ex=0;
      var inn=0;
      this.groubedByTeam.forEach(([key, value]) => console.log('PKPK',key, value));

      //var ex: number = 0;
      var expenseArry = this.resultRetrieve.filter(b=>b.ProductName=='Expense');
      var incomeArry = this.resultRetrieve.filter(b=>b.ProductName=='Income');
    if (expenseArry.length > 0) {
      ex = expenseArry.map(a => parseFloat(a.Price)<0?(-1*parseFloat(a.Price)):parseFloat(a.Price)).reduce(function (a, b) {
        //return parseFloat(a) + parseFloat(b);
        return (a == 0 ? 0 : a) + (b == 0 ? 0 : b);
      });
    }
    if (incomeArry.length > 0) {
      inn = incomeArry.map(a => parseFloat(a.Price)).reduce(function (a, b) {
        //return parseFloat(a) + parseFloat(b);
        return (a == 0 ? 0 : a) + (b == 0 ? 0 : b);
      });
    }

   
    this.Expense=ex.toString();
    this.Income=inn.toString();

    }); 

    this.httpClient.get(this.url+'/getAllExpenseIncomeFromTo/'+this.myDate1+'/'+this.myDate2+'/').subscribe((result: ProfitLost[]) => {  
      this.resultRetrieveAll = result.sort((a, b) => (this.returnDate(a.DateUse) < this.returnDate(b.DateUse)) ? 1 : (this.returnDate(a.DateUse) === this.returnDate(b.DateUse)) ? ((a.ProductName > b.ProductName) ? 1 : -1) : -1 )
      
     
    });
  }
  else{
    this.showInDetail = true;
      this.showgrp = false;
    this.httpClient.get(this.url+'/getAllExpenseIncomeFromTo/'+this.myDate1+'/'+this.myDate2+'/').subscribe((result: ProfitLost[]) => {  
      this.resultRetrieveAll = result.sort((a, b) => (this.returnDate(a.DateUse) < this.returnDate(b.DateUse)) ? 1 : (this.returnDate(a.DateUse) === this.returnDate(b.DateUse)) ? ((a.ProductName > b.ProductName) ? 1 : -1) : -1 )
      
     
    });
  }
  }

  myPrint(myfrm) {
    document.getElementById("printElement").style.display = "none";
    document.getElementById("CloseMe").style.display = "none";
    document.getElementById("printCheckElement").style.display = "none";
    //document.getElementById("printCheckTextElement").style.display = "none";
    var printdata = document.getElementById(myfrm);
    var newwin = window.open("");
    newwin.document.write(printdata.outerHTML);
    newwin.print();
    document.getElementById("printElement").style.display = "block";
    document.getElementById("printCheckElement").style.display = "block";
    document.getElementById("CloseMe").style.display = "block";
    //document.getElementById("printCheckTextElement").style.display = "block";
    newwin.close();
  }

  CloseMe(){
    this._router.navigate(['/home', 37], { queryParams: { username: "ax3r5!mmmt!4rtresjjgnth"}});
  }
}