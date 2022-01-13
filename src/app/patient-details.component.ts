//app.component.ts
import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatSort } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { PatientDetails } from './models/UserData';
import { PatientDetailsService } from './Services/patient-details.service';
import { DialogBoxPatientComponent } from './Popups/dialog-box-patient.component';


@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit{

  displayedColumns: string[] = ['UnqueID','FirstName','LastName', 'Year','Month','Days','Gender','Email','ContactNumber','Address','action'];
  //dataSource: MatTableDataSource<UsersData>;
  dataSource: MatTableDataSource<PatientDetails>;
  //dataSource = ELEMENT_DATA;
  PatientDetails: PatientDetails[] = [];
  @Input() home : FormGroup;
  cities = ['Mr.', 'Mrs.', 'Smt','Shree'];
     selected = 'Mumbai';

  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:true}) sort: MatSort;

  constructor(public dialog: MatDialog,public patientDetailsService: PatientDetailsService) {

    
  }
  ngOnInit() {

    this.LoadAllTestInvestigations(); 
   
  }

  LoadAllTestInvestigations(){
    this.patientDetailsService.getAll().subscribe((data: PatientDetails[])=>{
      //console.log(data);
      this.PatientDetails = data;
       // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.PatientDetails);  
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.filterVal = '';
    }) 
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    //this.LoadAllTestInvestigations();
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  filterVal:string = '';

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  openDialog(action,obj,uid,operation) {
    obj.action = action;
    
    const dialogRef = this.dialog.open(DialogBoxPatientComponent, {
      width: '900px',
      data:{obj:obj,"uid":uid,"operation":operation}
    });

    dialogRef.afterClosed().subscribe(result => {  
      this.LoadAllTestInvestigations();       
});

    // dialogRef.afterClosed().subscribe(result => {
    //   if(result.event == 'Add'){
    //     this.addRowData(result.data);
    //     this.LoadAllTestInvestigations(); 
    //   }else if(result.event == 'Update'){
    //     this.LoadAllTestInvestigations(); 
    //     //this.updateRowData(result.data);
    //   }else if(result.event == 'Delete'){
    //     this.LoadAllTestInvestigations();
    //     this.deleteRowData(result.data);
    //   }
    // });
  }

  addRowData(row_obj:PatientDetails){
    
    this.table.renderRows();
    
  }
  updateRowData(row_obj){
    this.dataSource.data = this.dataSource.data.filter((value,key)=>{
      if(value.UserName == row_obj.Name){
        value.UserName = row_obj.Name;
      }
      return true;
    });
  }
  deleteRowData(row_obj){
    this.dataSource.data = this.dataSource.data.filter((value,key)=>{
      this.LoadAllTestInvestigations();  
      return value.UserName != row_obj.Name;
    });
  }
}

