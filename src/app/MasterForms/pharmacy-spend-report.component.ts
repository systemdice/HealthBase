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
import { StorageService } from '../shared/storage.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { DateAdapter } from '@angular/material/core';


@Component({
  selector: 'app-pharmacy-spend-report',
  templateUrl: './pharmacy-spend-report.component.html',
  styleUrls: ['./pharmacy-spend-report.component.css']
})
export class PharmacySpendReportComponent implements OnInit {
  myDate:string;
  myDate1:string;
  myDate2:string;
  PharmacyStoreName:string;
  FarmaNameEnable:boolean = false;
  Addressline1= AllMasterFixedData.Addressline1;
    Addressline2= AllMasterFixedData.Addressline2;
    Addressline3= AllMasterFixedData.Addressline3;
    Addressline4= AllMasterFixedData.Addressline4;
    PharmacyStore = AllMasterFixedData.PharmacyStore;
  url = APIDetails.HelathAPI+"/Report"; //;'https://localhost:44380/Report'; 
  // StartDate= new FormControl();
  // EndDate = new FormControl();
  StartDate:string;
  EndDate :string;
  resultRetrieve:ProfitLost[];
  Username: string;
  Role: string;
  Location:string;
    ngOnInit() {
      
      //this.myDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy').toString();
  if(this.Role == 'Pharmacy'){
    this.PharmacyStoreName = this.Username;
    this.FarmaNameEnable = true;

    if(this.PharmacyStoreName == 'Sachin'){
      var p = AllMasterFixedData.NurseDutyType[0];
      this.Addressline1= AllMasterFixedData.PharmaAddress1;
    this.Addressline2= AllMasterFixedData.PharmaAddress2;
    this.Addressline3= AllMasterFixedData.PharmaAddress3;
    this.Addressline4= AllMasterFixedData.PharmaContactNumber;
    }
    else{
      if(this.PharmacyStoreName == 'Mihir'){
        this.Addressline1= AllMasterFixedData.PharmaMihirAddress1;
      this.Addressline2= AllMasterFixedData.PharmaAddress2;
      this.Addressline3= AllMasterFixedData.PharmaMihirAddress3;
      this.Addressline4= AllMasterFixedData.PharmaMihirContactNumber;
      }
    }
  }
      
    }
    
    constructor(private fb: FormBuilder, private httpClient: HttpClient, private route: ActivatedRoute,
      private _router: Router, private datePipe: DatePipe,
      private addModifyCaseService: AddModifyCaseService, private paymentHistoryService: PaymentHistoryService,
      private _store: StorageService,private dateAdapter: DateAdapter<Date>,) {
      // this.MainTestForm = this.fb.group({
      //   MainTest: this.fb.array([]),
      // })
      this.dateAdapter.setLocale('en-GB');
      this.Username = this._store.sessionUsername;
      this.Role = this._store.sessionRole;
      this.Location = this._store.sessionLocation;
    }
  
    groubedByTeam:any[];
    //PharmacyStoreName:string="All";
    ShowData(typeStatus:string){
      if(this.StartDate == undefined || this.EndDate == undefined){
        alert('Please select start date and end date to see report.');
      }
      else if(this.PharmacyStoreName ==null || this.PharmacyStoreName == '' ){
        alert('Please select Pharmacy Name.');
      }
      else{
        this.myDate1 = this.datePipe.transform(this.StartDate, 'dd-MM-yyyy').toString();
        this.myDate2 = this.datePipe.transform(this.EndDate, 'dd-MM-yyyy').toString();
        this.httpClient.get(this.url+'/getBillForPharmacy/'+this.myDate1+'/'+this.myDate2+'/'+this.PharmacyStoreName).subscribe((result: ProfitLost[]) => {  
          //this.resultRetrieve = result.filter(a=>a.ProductName== "Sachin");

          if(this.PharmacyStoreName == "All"){
            if(typeStatus == 'All'){
              this.resultRetrieve = result;
            }
            else if(typeStatus =='Credit'){
              this.resultRetrieve = result.filter(a=>a.CreditStatus=='Credit');
            }
            else if(typeStatus =='Cash'){
              this.resultRetrieve = result.filter(a=>a.CreditStatus=='Cash');
            }
          }

          if(this.PharmacyStoreName == "Others"){
            if(typeStatus == 'All'){
              this.resultRetrieve = result.filter(a=>a.ProductName== '');
            }
            else if(typeStatus =='Credit'){
              this.resultRetrieve = result.filter(a=>a.ProductName== '' && a.CreditStatus=='Credit');
            }
            else if(typeStatus =='Cash'){
              this.resultRetrieve = result.filter(a=>a.ProductName== '' && a.CreditStatus=='Cash');
            }
          }

          if(this.PharmacyStoreName !== "All" && this.PharmacyStoreName !== "Others"){
            if(typeStatus == 'All'){
              this.resultRetrieve = result.filter(a=>a.ProductName== this.PharmacyStoreName );
            }
            else if(typeStatus =='Credit'){
              this.resultRetrieve = result.filter(a=>a.ProductName== this.PharmacyStoreName && a.CreditStatus=='Credit');
            }
            else if(typeStatus =='Cash'){
              this.resultRetrieve = result.filter(a=>a.ProductName== this.PharmacyStoreName && a.CreditStatus=='Cash');
            }
          }




          
          var groupBy = function(xs, key) {
            return xs.reduce(function(rv, x) {
              (rv[x[key]] = rv[x[key]] || []).push(x);
              return rv;
            }, {});
          };
          var groubedByTeam1=groupBy(this.resultRetrieve, 'ProductName')
         
          //const toObject = (arr, key) => arr.reduce((a, b) => ({ ...a, [b[key]]: b }), {});
    
    
          this.groubedByTeam= Object.values(groubedByTeam1);
          this.TotalAmt = this.groubedByTeam[0].reduce( 
            (a: number, b) => a + parseFloat(b.Price), 0);
          // var groubedByTeam3:any;
          // if(typeStatus == 'All')
          // {
          //   this.groubedByTeam = this.groubedByTeam;
          // }
          // else if(typeStatus == 'Credit')
          // {
          //   //groubedByTeam3 =  this.groubedByTeam.find(a => a.CreditStatus =='Credit');
          //   //this.groubedByTeam = this.groubedByTeam.filter(a => a.CreditStatus=='Credit');
          // }
          // else if(typeStatus == 'Cash')
          // {
          //   this.groubedByTeam = this.groubedByTeam.filter(a => a.CreditStatus=='Cash')
          // }
          //this.groubedByTeam= toObject(groubedByTeam1,'DateUse');
        });  
      }
      
    }
  TotalAmt:number;
    myPrint(myfrm) {
      document.getElementById("printElement").style.display = "none";
      document.getElementById("CloseMe").style.display = "none";
      document.getElementById("searchtElement").style.display = "none";
      //document.getElementById("printCheckTextElement").style.display = "none";
      var printdata = document.getElementById(myfrm);
      var newwin = window.open("");
      newwin.document.write(printdata.outerHTML);
      newwin.print();
      document.getElementById("printElement").style.display = "block";
      document.getElementById("searchtElement").style.display = "block";
      document.getElementById("CloseMe").style.display = "block";
      //document.getElementById("printCheckTextElement").style.display = "block";
      newwin.close();
    }
  
    CloseMe(){
      this._router.navigate(['/home', 37], { queryParams: { username: "ax3r5!mmmt!4rtresjjgnth"}});
    }
  }