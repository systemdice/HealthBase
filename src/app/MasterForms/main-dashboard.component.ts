import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DateAdapter, MatDialog, MatDialogConfig, MatPaginator, MatSort } from '@angular/material';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ExpenseItemComponent } from '../custom-components/expense-item/expense-item.component';
import { APIDetails } from '../models/AllConstansts';
import { BedManagement, BedReport, NewModifyCase, ProfitLost, Vaccinations } from '../models/UserData';
import { DialogBoxVaccinesComponent } from '../Popups/dialog-box-vaccines.component';
import { ReffersDetailsComponent } from '../reffers-details.component';
import { AddModifyCaseService } from '../Services/add-modify-case.service';
import { BedManagementService } from '../Services/bed-management.service';
import { PaymentHistoryService } from '../Services/payment-history.service';
import { VaccinationsCategoryService } from '../Services/vaccines-category.service';
import { Expenses } from '../shared/Expense.Model';
import { StorageService } from '../shared/storage.service';
import { CasePaymentFilterComponent } from './case-payment-filter.component';
import { LeaveRequestMainComponent } from './leave-request-main.component';
import { StaffWorkLeaveManagementComponent } from './staff-work-leave-management.component';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit {


  cards;
  TotalPatient:any;
  totalIPD:any;
  totalOPD:any;
  totalVS:any;
  totalBed:string;
  OccuppiedBed:any;
  availablebed:any
  waitingtime:string;
averagepatientperday:string;

ipdmale:any;
ipdfemale:any;
ipdadult:any;
ipdchildren:any;

opdmale:any;
opdfemale:any;
opdadult:any;
opdchildren:any;

vsmale:any;
vsfemale:any;
vsadult:any;
vschildren:any;

  Username: string;
  Role: string;
  Location:string;
  asyncPipeNewModifyCase: NewModifyCase[] = [];
  asyncPipeNewModifyCaseBackup: NewModifyCase[] = [];
  asyncPipeNewModifyCaseIPD: NewModifyCase[] = [];
  asyncPipeNewModifyCaseOPD: NewModifyCase[] = [];
  asyncPipeNewModifyCaseOPDAll: NewModifyCase[] = [];
  asyncPipeNewModifyCaseIPDAll: NewModifyCase[] = [];
  asyncPipeNewModifyCaseVSAll: NewModifyCase[] = [];
  asyncPipeNewModifyCaseVS: NewModifyCase[] = [];
  displayedColumns: string[] = ['slno','VaccineName', 'Quantity','MRP','Expiry','action'];
  //dataSource: MatTableDataSource<UsersData>;
  dataSource: MatTableDataSource< Vaccinations>;
  VaccineCategories:  Vaccinations[] = [];
  StatusTodayorAll:string= 'Today';

  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:true}) sort: MatSort;


  
  constructor(private dateAdapter: DateAdapter<Date>,private addModifyCaseService: AddModifyCaseService,private _store: StorageService,private _router: Router,
    public  VaccineCategoriesService:  VaccinationsCategoryService,public bedManagementService:BedManagementService,public dialog: MatDialog,
    private httpClient: HttpClient, private datePipe: DatePipe,
    private paymentHistoryService: PaymentHistoryService) {

    this.Username = this._store.sessionUsername;
    this.Role = this._store.sessionRole;
    this.Location = this._store.sessionLocation;

    this.dateAdapter.setLocale('en-GB');

  }

  ngOnInit() {
    this.LoadAllTestInvestigations(); 
    this.LoadAllBeds();
    this.LoadTodaysCase();
  }

  Openit(webaddress:string){
    // the url,html tag should be called from here , how ?
    window.open(webaddress);
    }

  LoadTodaysCase(){
    this.addModifyCaseService.getAllTodaysCase().subscribe((data: NewModifyCase[]) => {
      //console.log('jay'+data);
      if(this.Role == 'Admin' || this.Role == 'SuperAdmin' || this.Role == 'Patho')
      {
        this.asyncPipeNewModifyCase = data;
        this.asyncPipeNewModifyCaseBackup = data;
        this.asyncPipeNewModifyCaseOPD =  data.filter(a=>a.OPDkimbaIPD == 'OPD');
        this.asyncPipeNewModifyCaseIPD = data.filter(a=>a.OPDkimbaIPD == 'IPD');
        this.asyncPipeNewModifyCaseVS = data.filter(a=>a.OPDkimbaIPD == 'VS');

        this.asyncPipeNewModifyCaseOPDAll= this.asyncPipeNewModifyCaseOPD;
        this.asyncPipeNewModifyCaseIPDAll= this.asyncPipeNewModifyCaseIPD;
        this.asyncPipeNewModifyCaseVSAll = this.asyncPipeNewModifyCaseVS
        
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
      

      
        this.TotalPatient = data.length.toString();
        this.totalIPD = data.filter(a=>a.OPDkimbaIPD == 'IPD').length;
        this.totalOPD = data.filter(a=>a.OPDkimbaIPD == 'OPD').length;
        this.totalVS = data.filter(a=>a.OPDkimbaIPD == 'VS').length;
//ipd male female
        this.ipdmale = data.filter(a=>a.OPDkimbaIPD == 'IPD' && a.Home.Gender =='1').length;
        this.ipdfemale = data.filter(a=>a.OPDkimbaIPD == 'IPD' && a.Home.Gender =='2').length;
        this.ipdadult = data.filter(a=>a.OPDkimbaIPD == 'IPD' && Number(a.Home.Year) > 10).length;
        this.ipdchildren = data.filter(a=>a.OPDkimbaIPD == 'IPD' && Number(a.Home.Year) <11).length;
//opd male female
        this.opdmale = data.filter(a=>a.OPDkimbaIPD == 'OPD' && a.Home.Gender =='1').length;
        this.opdfemale = data.filter(a=>a.OPDkimbaIPD == 'OPD' && a.Home.Gender =='2').length;
        this.opdadult = data.filter(a=>a.OPDkimbaIPD == 'OPD' && Number(a.Home.Year) > 10).length;
        this.opdchildren = data.filter(a=>a.OPDkimbaIPD == 'OPD' && Number(a.Home.Year) <11).length;

        //VS male female
        this.vsmale = data.filter(a=>a.OPDkimbaIPD == 'VS' && a.Home.Gender =='1').length;
        this.vsfemale = data.filter(a=>a.OPDkimbaIPD == 'VS' && a.Home.Gender =='2').length;
        this.vsadult = data.filter(a=>a.OPDkimbaIPD == 'VS' && Number(a.Home.Year) > 10).length;
        this.vschildren = data.filter(a=>a.OPDkimbaIPD == 'VS' && Number(a.Home.Year) <11).length;
    })
  }
  LoadTodaysCaseInd(val:string){
    this.addModifyCaseService.getAllTodaysCase().subscribe((data: NewModifyCase[]) => {
      //console.log('jay'+data);
      if(this.Role == 'Admin' || this.Role == 'SuperAdmin' || this.Role == 'Patho')
      {
        this.asyncPipeNewModifyCase = data;
        this.asyncPipeNewModifyCaseBackup = data;
        // this.asyncPipeNewModifyCaseOPD =  data.filter(a=>a.OPDkimbaIPD == 'OPD');
        // this.asyncPipeNewModifyCaseIPD = data.filter(a=>a.OPDkimbaIPD == 'IPD');
        // this.asyncPipeNewModifyCaseVS = data.filter(a=>a.OPDkimbaIPD == 'VS');

        // this.asyncPipeNewModifyCaseOPDAll= this.asyncPipeNewModifyCaseOPD;
        // this.asyncPipeNewModifyCaseIPDAll= this.asyncPipeNewModifyCaseIPD;
        // this.asyncPipeNewModifyCaseVSAll = this.asyncPipeNewModifyCaseVS
        
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
      
if(val == 'IPD'){
  //this.asyncPipeNewModifyCaseOPD =  data.filter(a=>a.OPDkimbaIPD == 'OPD');
  this.asyncPipeNewModifyCaseIPD = data.filter(a=>a.OPDkimbaIPD == 'IPD');
  //this.asyncPipeNewModifyCaseVS = data.filter(a=>a.OPDkimbaIPD == 'VS');

  //this.asyncPipeNewModifyCaseOPDAll= this.asyncPipeNewModifyCaseOPD;
  this.asyncPipeNewModifyCaseIPDAll= this.asyncPipeNewModifyCaseIPD;
  //this.asyncPipeNewModifyCaseVSAll = this.asyncPipeNewModifyCaseVS
}
else if(val == 'OPD'){
  this.asyncPipeNewModifyCaseOPD =  data.filter(a=>a.OPDkimbaIPD == 'OPD');
  //this.asyncPipeNewModifyCaseIPD = data.filter(a=>a.OPDkimbaIPD == 'IPD');
  //this.asyncPipeNewModifyCaseVS = data.filter(a=>a.OPDkimbaIPD == 'VS');

  this.asyncPipeNewModifyCaseOPDAll= this.asyncPipeNewModifyCaseOPD;
  //this.asyncPipeNewModifyCaseIPDAll= this.asyncPipeNewModifyCaseIPD;
  //this.asyncPipeNewModifyCaseVSAll = this.asyncPipeNewModifyCaseVS
}
else if(val == 'VS'){
  //this.asyncPipeNewModifyCaseOPD =  data.filter(a=>a.OPDkimbaIPD == 'OPD');
  //this.asyncPipeNewModifyCaseIPD = data.filter(a=>a.OPDkimbaIPD == 'IPD');
  this.asyncPipeNewModifyCaseVS = data.filter(a=>a.OPDkimbaIPD == 'VS');

  //this.asyncPipeNewModifyCaseOPDAll= this.asyncPipeNewModifyCaseOPD;
  //this.asyncPipeNewModifyCaseIPDAll= this.asyncPipeNewModifyCaseIPD;
  this.asyncPipeNewModifyCaseVSAll = this.asyncPipeNewModifyCaseVS
}
      
        this.TotalPatient = data.length.toString();
        this.totalIPD = data.filter(a=>a.OPDkimbaIPD == 'IPD').length;
        this.totalOPD = data.filter(a=>a.OPDkimbaIPD == 'OPD').length;
        this.totalVS = data.filter(a=>a.OPDkimbaIPD == 'VS').length;
//ipd male female
        this.ipdmale = data.filter(a=>a.OPDkimbaIPD == 'IPD' && a.Home.Gender =='1').length;
        this.ipdfemale = data.filter(a=>a.OPDkimbaIPD == 'IPD' && a.Home.Gender =='2').length;
        this.ipdadult = data.filter(a=>a.OPDkimbaIPD == 'IPD' && Number(a.Home.Year) > 10).length;
        this.ipdchildren = data.filter(a=>a.OPDkimbaIPD == 'IPD' && Number(a.Home.Year) <11).length;
//opd male female
        this.opdmale = data.filter(a=>a.OPDkimbaIPD == 'OPD' && a.Home.Gender =='1').length;
        this.opdfemale = data.filter(a=>a.OPDkimbaIPD == 'OPD' && a.Home.Gender =='2').length;
        this.opdadult = data.filter(a=>a.OPDkimbaIPD == 'OPD' && Number(a.Home.Year) > 10).length;
        this.opdchildren = data.filter(a=>a.OPDkimbaIPD == 'OPD' && Number(a.Home.Year) <11).length;

        //VS male female
        this.vsmale = data.filter(a=>a.OPDkimbaIPD == 'VS' && a.Home.Gender =='1').length;
        this.vsfemale = data.filter(a=>a.OPDkimbaIPD == 'VS' && a.Home.Gender =='2').length;
        this.vsadult = data.filter(a=>a.OPDkimbaIPD == 'VS' && Number(a.Home.Year) > 10).length;
        this.vschildren = data.filter(a=>a.OPDkimbaIPD == 'VS' && Number(a.Home.Year) <11).length;
    })
  }
  LoadAllCases(){
    this.addModifyCaseService.getAll().subscribe((data: NewModifyCase[]) => {
      //console.log('jay'+data);
      if(this.Role == 'Admin' || this.Role == 'SuperAdmin' || this.Role == 'Patho')
      {
        this.asyncPipeNewModifyCase = data;
        this.asyncPipeNewModifyCaseBackup = data;
        this.asyncPipeNewModifyCaseOPD =  data.filter(a=>a.OPDkimbaIPD == 'OPD');
        this.asyncPipeNewModifyCaseIPD = data.filter(a=>a.OPDkimbaIPD == 'IPD');
        this.asyncPipeNewModifyCaseVS = data.filter(a=>a.OPDkimbaIPD == 'VS');

        this.asyncPipeNewModifyCaseOPDAll= this.asyncPipeNewModifyCaseOPD;
        this.asyncPipeNewModifyCaseIPDAll= this.asyncPipeNewModifyCaseIPD;
        this.asyncPipeNewModifyCaseVSAll = this.asyncPipeNewModifyCaseVS
        
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
      

      this.StatusTodayorAll = "Complete";
        this.TotalPatient = data.length.toString();
        this.totalIPD = data.filter(a=>a.OPDkimbaIPD == 'IPD').length;
        this.totalOPD = data.filter(a=>a.OPDkimbaIPD == 'OPD').length;
        this.totalVS = data.filter(a=>a.OPDkimbaIPD == 'VS').length;
//ipd male female
        this.ipdmale = data.filter(a=>a.OPDkimbaIPD == 'IPD' && a.Home.Gender =='1').length;
        this.ipdfemale = data.filter(a=>a.OPDkimbaIPD == 'IPD' && a.Home.Gender =='2').length;
        this.ipdadult = data.filter(a=>a.OPDkimbaIPD == 'IPD' && Number(a.Home.Year) > 10).length;
        this.ipdchildren = data.filter(a=>a.OPDkimbaIPD == 'IPD' && Number(a.Home.Year) <11).length;
//opd male female
        this.opdmale = data.filter(a=>a.OPDkimbaIPD == 'OPD' && a.Home.Gender =='1').length;
        this.opdfemale = data.filter(a=>a.OPDkimbaIPD == 'OPD' && a.Home.Gender =='2').length;
        this.opdadult = data.filter(a=>a.OPDkimbaIPD == 'OPD' && Number(a.Home.Year) > 10).length;
        this.opdchildren = data.filter(a=>a.OPDkimbaIPD == 'OPD' && Number(a.Home.Year) <11).length;

        //VS male female
        this.vsmale = data.filter(a=>a.OPDkimbaIPD == 'VS' && a.Home.Gender =='1').length;
        this.vsfemale = data.filter(a=>a.OPDkimbaIPD == 'VS' && a.Home.Gender =='2').length;
        this.vsadult = data.filter(a=>a.OPDkimbaIPD == 'VS' && Number(a.Home.Year) > 10).length;
        this.vschildren = data.filter(a=>a.OPDkimbaIPD == 'VS' && Number(a.Home.Year) <11).length;
    })
  }
  LoadAllCasesInd(val:string){
    this.addModifyCaseService.getAll().subscribe((data: NewModifyCase[]) => {
      //console.log('jay'+data);
      if(this.Role == 'Admin' || this.Role == 'SuperAdmin' || this.Role == 'Patho')
      {
        this.asyncPipeNewModifyCase = data;
        this.asyncPipeNewModifyCaseBackup = data;
        // this.asyncPipeNewModifyCaseOPD =  data.filter(a=>a.OPDkimbaIPD == 'OPD');
        // this.asyncPipeNewModifyCaseIPD = data.filter(a=>a.OPDkimbaIPD == 'IPD');
        // this.asyncPipeNewModifyCaseVS = data.filter(a=>a.OPDkimbaIPD == 'VS');

        // this.asyncPipeNewModifyCaseOPDAll= this.asyncPipeNewModifyCaseOPD;
        // this.asyncPipeNewModifyCaseIPDAll= this.asyncPipeNewModifyCaseIPD;
        // this.asyncPipeNewModifyCaseVSAll = this.asyncPipeNewModifyCaseVS
        
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
      
      if(val == 'IPD'){
        //this.asyncPipeNewModifyCaseOPD =  data.filter(a=>a.OPDkimbaIPD == 'OPD');
        this.asyncPipeNewModifyCaseIPD = data.filter(a=>a.OPDkimbaIPD == 'IPD');
        //this.asyncPipeNewModifyCaseVS = data.filter(a=>a.OPDkimbaIPD == 'VS');
      
        //this.asyncPipeNewModifyCaseOPDAll= this.asyncPipeNewModifyCaseOPD;
        this.asyncPipeNewModifyCaseIPDAll= this.asyncPipeNewModifyCaseIPD;
        //this.asyncPipeNewModifyCaseVSAll = this.asyncPipeNewModifyCaseVS
      }
      else if(val == 'OPD'){
        this.asyncPipeNewModifyCaseOPD =  data.filter(a=>a.OPDkimbaIPD == 'OPD');
        //this.asyncPipeNewModifyCaseIPD = data.filter(a=>a.OPDkimbaIPD == 'IPD');
        //this.asyncPipeNewModifyCaseVS = data.filter(a=>a.OPDkimbaIPD == 'VS');
      
        this.asyncPipeNewModifyCaseOPDAll= this.asyncPipeNewModifyCaseOPD;
        //this.asyncPipeNewModifyCaseIPDAll= this.asyncPipeNewModifyCaseIPD;
        //this.asyncPipeNewModifyCaseVSAll = this.asyncPipeNewModifyCaseVS
      }
      else if(val == 'VS'){
        //this.asyncPipeNewModifyCaseOPD =  data.filter(a=>a.OPDkimbaIPD == 'OPD');
        //this.asyncPipeNewModifyCaseIPD = data.filter(a=>a.OPDkimbaIPD == 'IPD');
        this.asyncPipeNewModifyCaseVS = data.filter(a=>a.OPDkimbaIPD == 'VS');
      
        //this.asyncPipeNewModifyCaseOPDAll= this.asyncPipeNewModifyCaseOPD;
        //this.asyncPipeNewModifyCaseIPDAll= this.asyncPipeNewModifyCaseIPD;
        this.asyncPipeNewModifyCaseVSAll = this.asyncPipeNewModifyCaseVS
      }
      this.StatusTodayorAll = "Complete";
        this.TotalPatient = data.length.toString();
        this.totalIPD = data.filter(a=>a.OPDkimbaIPD == 'IPD').length;
        this.totalOPD = data.filter(a=>a.OPDkimbaIPD == 'OPD').length;
        this.totalVS = data.filter(a=>a.OPDkimbaIPD == 'VS').length;
//ipd male female
        this.ipdmale = data.filter(a=>a.OPDkimbaIPD == 'IPD' && a.Home.Gender =='1').length;
        this.ipdfemale = data.filter(a=>a.OPDkimbaIPD == 'IPD' && a.Home.Gender =='2').length;
        this.ipdadult = data.filter(a=>a.OPDkimbaIPD == 'IPD' && Number(a.Home.Year) > 10).length;
        this.ipdchildren = data.filter(a=>a.OPDkimbaIPD == 'IPD' && Number(a.Home.Year) <11).length;
//opd male female
        this.opdmale = data.filter(a=>a.OPDkimbaIPD == 'OPD' && a.Home.Gender =='1').length;
        this.opdfemale = data.filter(a=>a.OPDkimbaIPD == 'OPD' && a.Home.Gender =='2').length;
        this.opdadult = data.filter(a=>a.OPDkimbaIPD == 'OPD' && Number(a.Home.Year) > 10).length;
        this.opdchildren = data.filter(a=>a.OPDkimbaIPD == 'OPD' && Number(a.Home.Year) <11).length;

        //VS male female
        this.vsmale = data.filter(a=>a.OPDkimbaIPD == 'VS' && a.Home.Gender =='1').length;
        this.vsfemale = data.filter(a=>a.OPDkimbaIPD == 'VS' && a.Home.Gender =='2').length;
        this.vsadult = data.filter(a=>a.OPDkimbaIPD == 'VS' && Number(a.Home.Year) > 10).length;
        this.vschildren = data.filter(a=>a.OPDkimbaIPD == 'VS' && Number(a.Home.Year) <11).length;
    })
  }
  LoadAllTestInvestigations(){
    this. VaccineCategoriesService.getAll().subscribe((data:  Vaccinations[])=>{
      //console.log(data);
      this. VaccineCategories = data;
       // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this. VaccineCategories);  
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.filterVal = '';
    }) 
  }
  findName(nm){
    var retVal:string='';
   var p = this.asyncPipeBedReportActual.find(a=>a.BedName==nm);
   if(p !== undefined)
   {
     retVal = p.PatientName;
   }
   return retVal;
  }
  findOPDIPDid(nm){
   var retVal:string='';
  var p = this.asyncPipeBedReportActual.find(a=>a.BedName==nm);
  if(p !== undefined)
  {
    retVal = p.OPDIPDid;
  }
  return retVal;
 }
  
  asyncPipeBedReport: BedManagement[] = [];
  asyncPipeBedReportBackup: BedManagement[] = [];
  asyncPipeBedReportActual: BedReport[] = [];
  occupiedBed=0;
  availableBeds=0;
  LoadAllBeds(){

    // this.addModifyCaseService.getAdmitted().subscribe((data: BedReport[]) => {
    //   this.asyncPipeBedReportActual = data;
    //   this.bedManagementService.getAll().subscribe((data: BedManagement[]) => {
    //     this.asyncPipeBedReport = data;
    //     this.asyncPipeBedReportBackup = data;
    //     for(let i = 0; i < data[0].teachers.length; i++) {
  
    //       for(let j = 0; j <data[0].teachers[i].batches.length; j++) {
            
    //         //  console.log(data[0].teachers[i].batches[j]);
    //         //  console.log(data[0].teachers[i].batches[j].OccupySatus);
    //          if(data[0].teachers[i].batches[j].OccupySatus == 'BOOKED'){
    //            this.occupiedBed +=1;
    //          }
    //          else{
    //            this.availableBeds+=1;
    //          }
    //       }
    //     }
    //   });
    // });


    this.bedManagementService.getAll().subscribe((data: BedManagement[]) => {
      this.asyncPipeBedReport = data;
      this.asyncPipeBedReportBackup = data;
      for(let i = 0; i < data[0].teachers.length; i++) {
  
              for(let j = 0; j <data[0].teachers[i].batches.length; j++) {
                
                //  console.log(data[0].teachers[i].batches[j]);
                //  console.log(data[0].teachers[i].batches[j].OccupySatus);
                 if(data[0].teachers[i].batches[j].OccupySatus == 'BOOKED'){
                   this.occupiedBed +=1;
                 }
                 else{
                   this.availableBeds+=1;
                 }
              }
            }
      //this.occupiedBed = data.filter(a=>a.teachers)
//       console.log(this.getItems(this.asyncPipeBedReportBackup)); // outputs entire object
// console.log(this.getItems(this.asyncPipeBedReportBackup)['BOOKED']); // outputs 10



    });
  }

  filterOPD='';
  AllOPD(){
    this.LoadAllCasesInd('OPD');
    this.filterOPD = '';
    this.applyFilterOPD('');
  }
  applyFilterOPD(filterValue: string) {
    let filterValueLower = filterValue.toLowerCase();
    if(filterValue === '' ) {
        this.asyncPipeNewModifyCaseOPD=this.asyncPipeNewModifyCaseOPDAll;
    } 
    else {
      this.asyncPipeNewModifyCaseOPD = this.asyncPipeNewModifyCaseOPDAll.filter((employee) => 
      employee.IPDOPDId.toLowerCase().includes(filterValueLower) || employee.Home.FirstName.toLowerCase().includes(filterValueLower));
    }
 }

 filterIPD='';
  AllIPD(){
    this.LoadAllCasesInd('IPD');
    this.filterIPD = '';
    this.applyFilterIPD('');
  }
 applyFilterIPD(filterValue: string) {
  let filterValueLower = filterValue.toLowerCase();
  if(filterValue === '' ) {
      this.asyncPipeNewModifyCaseIPD=this.asyncPipeNewModifyCaseIPDAll;
  } 
  else {
    this.asyncPipeNewModifyCaseIPD = this.asyncPipeNewModifyCaseIPDAll.filter((employee) => 
    employee.IPDOPDId.toLowerCase().includes(filterValueLower) || employee.Home.FirstName.toLowerCase().includes(filterValueLower));
  }
}

filterVS='';
  AllVS(){
    this.LoadAllCasesInd('VS');
    this.filterVS = '';
    this.applyFilterVS('');
  }
applyFilterVS(filterValue: string) {
  let filterValueLower = filterValue.toLowerCase();
  if(filterValue === '' ) {
      this.asyncPipeNewModifyCaseVS=this.asyncPipeNewModifyCaseVSAll;
  } 
  else {
    this.asyncPipeNewModifyCaseVS = this.asyncPipeNewModifyCaseVSAll.filter((employee) => 
    employee.IPDOPDId.toLowerCase().includes(filterValueLower) || employee.Home.FirstName.toLowerCase().includes(filterValueLower));
  }
}

  LoadAdmittedPatients(){
    this.bedManagementService.getAll().subscribe((data: BedManagement[]) => {
      this.asyncPipeBedReport = data;
      this.asyncPipeBedReportBackup = data;
      for(let i = 0; i < data[0].teachers.length; i++) {

        for(let j = 0; j <data[0].teachers[i].batches.length; j++) {
          
          //  console.log(data[0].teachers[i].batches[j]);
          //  console.log(data[0].teachers[i].batches[j].OccupySatus);
           if(data[0].teachers[i].batches[j].OccupySatus == 'BOOKED'){
             this.occupiedBed +=1;
           }
           else{
             this.availableBeds+=1;
           }
        }
      }
    });

    // this.addModifyCaseService.getAdmitted().subscribe((data: BedReport[]) => {
    //   this.asyncPipeBedReportActual = data;
    //   this.bedManagementService.getAll().subscribe((data: BedManagement[]) => {
    //     this.asyncPipeBedReport = data;
    //     this.asyncPipeBedReportBackup = data;
    //     for(let i = 0; i < data[0].teachers.length; i++) {
  
    //       for(let j = 0; j <data[0].teachers[i].batches.length; j++) {
            
    //         //  console.log(data[0].teachers[i].batches[j]);
    //         //  console.log(data[0].teachers[i].batches[j].OccupySatus);
    //          if(data[0].teachers[i].batches[j].OccupySatus == 'BOOKED'){
    //            this.occupiedBed +=1;
    //          }
    //          else{
    //            this.availableBeds+=1;
    //          }
    //       }
    //     }
    //   });
    // });


//     this.bedManagementService.getAll().subscribe((data: BedManagement[]) => {
//       this.asyncPipeBedReport = data;
//       this.asyncPipeBedReportBackup = data;
//       //this.occupiedBed = data.filter(a=>a.teachers)
// //       console.log(this.getItems(this.asyncPipeBedReportBackup)); // outputs entire object
// // console.log(this.getItems(this.asyncPipeBedReportBackup)['BOOKED']); // outputs 10



//     });
  }

  findUnqueid(nm):string{
    var retVal:string='';
   var p = this.asyncPipeBedReportActual.find(a=>a.BedName==nm);
   if(p !== undefined)
   {
     retVal = p.CaseID;
   }
   return retVal;
  }
   

  getItems(input) {
    var arr = input, obj = {};
  for (var i = 0; i < arr.length; i++) {
    if (!obj[arr[i].OccupySatus]) {
      obj[arr[i].OccupySatus] = 1;
    } else if (obj[arr[i].OccupySatus]) {
      obj[arr[i].OccupySatus] += 1;
    }
  }
  return obj;
}
  filterVal:string = '';

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  TABModeActivation:boolean=false;
  
  addEditExpenseItem(expenseId: NewModifyCase, firstName: string) {
    if(this.TABModeActivation ==  true){
      if (expenseId !== null) {
        this._router.navigate(['/freshCaseTab', expenseId.UnqueID], { queryParams: { username: firstName,newid:expenseId.IPDOPDId } });
      }
      else {
        this._router.navigate(['/freshCaseTab', 'Addnew'], { queryParams: { username: "",newid:"" } });
      }
     
    }
    else{
    if (expenseId !== null) {
      this._router.navigate(['/freshCase', expenseId.UnqueID], { queryParams: { username: firstName,newid:expenseId.IPDOPDId } });
    }
    else {
      this._router.navigate(['/freshCase', 'Addnew'], { queryParams: { username: "",newid:"" } });
    }
   
  }

  }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxVaccinesComponent, {
      width: '800px',
      height:'400px',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => { 
      this.LoadAllTestInvestigations(); 
      //this.foo();
      //this.LoadAllTestInvestigations();       
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
        //this.animal = result;
      });
    }
  addEditExpenseItemBed(UnqueID: string, IPDOPDId:string, firstName: string) {
    if(this.TABModeActivation ==  true){
      if (UnqueID !== '') {
        this._router.navigate(['/freshCaseTab', UnqueID], { queryParams: { username: firstName,newid:IPDOPDId } });
      }
      else {
        this._router.navigate(['/freshCaseTab', 'Addnew'], { queryParams: { username: "",newid:"" } });
      }
     
    }
    else{
    if (UnqueID !== '') {
      this._router.navigate(['/freshCase', UnqueID], { queryParams: { username: firstName,newid:IPDOPDId } });
    }
    else {
      this._router.navigate(['/freshCase', 'Addnew'], { queryParams: { username: "",newid:"" } });
    }
   
  }

  }

  constructSrc(hexVal, size){
    const constructedVal = "/assets/images/hexagon.svg?size=" + size + "&color=" + hexVal;
    //const constructedVal = "https://icongr.am/material/hexagon.svg?size=" + size + "&color=" + hexVal;
    return constructedVal;

  }
  signUp() {
    console.log("signing up!")
  }
  resumeRole() {
    console.log("resuming your role")
  }

  name = 'Angular';
  blink = false;

  blinkMe(){
    this.blink = true;
    setTimeout(function(){
      this.blink = false;
    }.bind(this)
    ,300)
  }

  //account section
  groubedByTeam:any[];
  Expense:any;
  Income:any;
  showInDetail:boolean=false;
  showgrp:boolean=true;
  myDate1:string;
myDate2:string;
StartDate:string;
EndDate :string;
StartDateLeave:string;
EndDateLeave:string;
resultRetrieve:ProfitLost[];
resultRetrieveAll:ProfitLost[];
url = APIDetails.HelathAPI+"/Report"; //;'https://localhost:44380/Report'; 
  ShowData(cond:string){
    this.myDate1 = this.datePipe.transform(this.StartDate, 'dd-MM-yyyy').toString();
    this.myDate2 = this.datePipe.transform(this.EndDate, 'dd-MM-yyyy').toString();

    if(cond == "grp")
    {
      this.showInDetail = false;
      this.showgrp = true;
    this.httpClient.get(this.url+'/getExpenseIncomeFromTo/'+this.myDate1+'/'+this.myDate2+'/').subscribe((result: ProfitLost[]) => {  
      this.resultRetrieve = result.sort((a, b) => (a.DateUse > b.DateUse) ? 1 : (a.DateUse === b.DateUse) ? ((a.ProductName > b.ProductName) ? 1 : -1) : -1 )
       
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
  
  }

  leaveresultRetrieve:ProfitLost[];
leaveresultRetrieveAll:ProfitLost[];
  ShowLeaveData(cond:string){
    this.myDate1 = this.datePipe.transform(this.StartDateLeave, 'dd-MM-yyyy').toString();
    //this.myDate2 = this.datePipe.transform(this.EndDateLeave, 'dd-MM-yyyy').toString();

    // this.showInDetail = false;
    //   this.showgrp = true;
    this.httpClient.get(this.url+'/getAllLeaveFromTo/'+this.myDate1).subscribe((result: ProfitLost[]) => {  
      this.leaveresultRetrieveAll = result.sort((a, b) => (a.DateUse > b.DateUse) ? 1 : (a.DateUse === b.DateUse) ? ((a.ProductName > b.ProductName) ? 1 : -1) : -1 )
       
     
     
    }); 
  
  }

  AllLeave(){
    //this.myDate1 = this.datePipe.transform(this.StartDateLeave, 'dd-MM-yyyy').toString();
    //this.myDate2 = this.datePipe.transform(this.EndDateLeave, 'dd-MM-yyyy').toString();

    // this.showInDetail = false;
    //   this.showgrp = true;
    this.httpClient.get(this.url+'/getAllLeave/').subscribe((result: ProfitLost[]) => {  
      this.leaveresultRetrieveAll = result.sort((a, b) => (a.DateUse > b.DateUse) ? 1 : (a.DateUse === b.DateUse) ? ((a.ProductName > b.ProductName) ? 1 : -1) : -1 )
       
     
     
    }); 
  
  }

  addEditExpenseItemPopup(pagename: string)
  {
    //console.log(expenseId.UnqueID);
    
       const dialogConfig = new MatDialogConfig();
       dialogConfig.autoFocus = true;
       //dialogConfig.disableClose = true;
       dialogConfig.width = "50%";
       dialogConfig.height = "700px";
       dialogConfig.data = pagename;
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
 if(pagename == 'staff'){
  const dialogRef = this.dialog.open(ReffersDetailsComponent,dialogConfig);
 }
 else if(pagename == 'leave'){
  const dialogRef = this.dialog.open(LeaveRequestMainComponent,dialogConfig);
}else if(pagename == 'expinc'){
  const dialogRef = this.dialog.open(ExpenseItemComponent,dialogConfig);
}

 

//  dialogRef.afterClosed().subscribe(result => {  
//    this.refreshParent();       
// }); 
     
  }
  
}
