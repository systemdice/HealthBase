
//app.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from '../Popups/dialog-box.component';
import { MatDatepickerInputEvent, MatPaginator, MatSort } from '@angular/material';
import { AppointmentDetail, PatientDetails } from '../models/UserData';
import { DialogueBoxCatagoryComponent } from '../Popups/dialogue-box-catagory.component';
import { AppointmentDetailService } from '../Services/appointment-detail.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';


export interface Element {
  UnqueID:string;
  DateStart:string;
  project: {PatientName: string};
  project1: {DoctorName: string};
  action:string;
}

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.css']
})
export class AppointmentDetailsComponent implements OnInit{
  displayedColumns: string[] = ['UnqueID','DateStart','PatientName','AppointmentTime','DoctorName','AppointmentStatus' ,'action'];
  //dataSource: MatTableDataSource<UsersData>;
  dataSource: MatTableDataSource<any>;
  //dataSource = ELEMENT_DATA;
  AppointmentDetail: AppointmentDetail[] = [];
  AppointmentDetail1: AppointmentDetail[] = [];

  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:true}) sort: MatSort;

  constructor(public dialog: MatDialog,public appointmentDetailService: AppointmentDetailService,private _router: Router, 
    private router:Router,private datePipe: DatePipe) {

    
  }
  ngOnInit() {

    this.LoadAppointmentDetail(); 
   
  }
  results:any[];
  LoadAppointmentDetail(){
    this.appointmentDetailService.getWaitingAppointmnet().subscribe((data: AppointmentDetail[])=>{
      console.log(data);
      this.AppointmentDetail = data;
      //this.results = this.AppointmentDetail[0].PatientDetails.concat(this.AppointmentDetail[0].ReferralMaster) ;// [ ...this.AppointmentDetail[0].PatientDetails, ...data[0].ReferralMaster];
      //console.log('final merge'+JSON.stringify( this.results ));
       // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.AppointmentDetail);  
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: any, filter) => {
      const dataStr =JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1; 
    }

    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property.includes('.')) return property.split('.').reduce((o,i)=>o[i], item)
      return item[property];
   };
 
   this.dataSource.sort = this.sort;
   
    this.filterVal = '';
    }) 
  }

  ShowAll(filterCriteria:string){
    this.appointmentDetailService.getAll().subscribe((data: AppointmentDetail[])=>{
      console.log(data);
      this.AppointmentDetail = data;
      if(filterCriteria !='')
      {
        if(filterCriteria =='today')
        {
          //alert(new Date());
          this.AppointmentDetail = this.AppointmentDetail.filter(x=> x.ReferralMaster.appointment == this.datePipe.transform(new Date(), 'dd-MM-yyyy') );
        
        }
        else
        {
          //alert(filterCriteria);
          this.AppointmentDetail = this.AppointmentDetail.filter(x=> x.ReferralMaster.appointment == this.datePipe.transform(filterCriteria, 'dd-MM-yyyy') );
        }
      }
      //this.results = this.AppointmentDetail[0].PatientDetails.concat(this.AppointmentDetail[0].ReferralMaster) ;// [ ...this.AppointmentDetail[0].PatientDetails, ...data[0].ReferralMaster];
      //console.log('final merge'+JSON.stringify( this.results ));
       // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.AppointmentDetail);  
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: any, filter) => {
      const dataStr =JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1; 
    }

    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property.includes('.')) return property.split('.').reduce((o,i)=>o[i], item)
      return item[property];
   };
 
   this.dataSource.sort = this.sort;
   
    this.filterVal = '';
    }) 
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    //this.events.push(`${type}: ${event.value}`);
    this.ShowAll(event.value.toString());
  }
  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    //this.LoadAppointmentDetail();
    // this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
  }

  filterVal:string = '';

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  addEditExpenseItem(patientDetail:PatientDetails,uniqueid:string)
   {
    this._router.navigate(['/freshCase', 'appoint'], { queryParams: { username: patientDetail.FirstName,appntid: uniqueid}});
     
    
        
      
   }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogueBoxCatagoryComponent, {
      width: '600px',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {  
      this.LoadAppointmentDetail();       
});

    // dialogRef.afterClosed().subscribe(result => {
    //   if(result.event == 'Add'){
    //     this.addRowData(result.data);
    //     this.LoadAppointmentDetail(); 
    //   }else if(result.event == 'Update'){
    //     this.LoadAppointmentDetail(); 
    //     //this.updateRowData(result.data);
    //   }else if(result.event == 'Delete'){
    //     this.LoadAppointmentDetail();
    //     this.deleteRowData(result.data);
    //   }
    // });
  }

  addRowData(row_obj:AppointmentDetail){
    
    this.table.renderRows();
    
  }
  updateRowData(row_obj){
    // this.dataSource.data = this.dataSource.data.filter((value,key)=>{
    //   if(value.Name == row_obj.Name){
    //     value.Name = row_obj.Name;
    //   }
    //   return true;
    // });
  }
  deleteRowData(row_obj){
    // this.dataSource.data = this.dataSource.data.filter((value,key)=>{
    //   return value.Name != row_obj.Name;
    // });
  }
}

