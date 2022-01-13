

//app.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatSort } from '@angular/material';
import { GroupTests } from '../models/UserData';
import { DialogBoxUnitUnitsComponent } from '../Popups/dialog-box-unit-units.component';
import { HttpClient } from '@angular/common/http';
import { GrouTestService } from '../Services/grou-test.service';
import { CreateGroupTestComponent } from './create-group-test.component';
@Component({
  selector: 'app-all-group-details',
  templateUrl: './all-group-details.component.html',
  styleUrls: ['./all-group-details.component.css']
})
export class AllGroupDetailsComponent implements OnInit {
  displayedColumns: string[] = ['slno','UnqueID','GroupName', 'Description','Status','alltests','ActualPrice','TotalPrice', 'action'];
  //dataSource: MatTableDataSource<UsersData>;
  dataSource: MatTableDataSource<GroupTests>;
  //dataSource = ELEMENT_DATA;
  unitsCategory: GroupTests[] = [];

  //dataSource: MatTableDataSource<any>;

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;


  //@ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  //@ViewChild(MatSort,{static:true}) sort: MatSort;
  public response: any;
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

  constructor(public dialog: MatDialog,public grouTestService: GrouTestService,private http: HttpClient
    ) {

    
  }

  
  ngOnInit() {

    this.LoadAllTestInvestigations(); 
    setTimeout(() => {

              }, 1000)
   
  }

  LoadAllTestInvestigations(){
    this.grouTestService.getAll().subscribe((data: GroupTests[])=>{
      //console.log(data);
      this.unitsCategory = data;
       // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.unitsCategory);  
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

  openDialog(action,obj) {
    obj.action = action;
    obj.AddEdit = action;
    const dialogRef = this.dialog.open(CreateGroupTestComponent, {
      width: '850px',
      height: '550px',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => { 
      this.LoadAllTestInvestigations(); 
      //this.foo();
      //this.LoadAllTestInvestigations();       
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
  DeleteItem(UnqueID : string)
  {
   if(confirm("Are you sure to delete ")) {
     //console.log("Implement delete functionality here");
     this.grouTestService.delete(UnqueID).subscribe(
       () => {
         setTimeout(() => {
           this.LoadAllTestInvestigations();
           
         }, 1000);
         
       });
   }

    
  }
 
  addRowData(row_obj:GroupTests){
    
    this.table.renderRows();
    
  }
  updateRowData(row_obj){
    this.dataSource.data = this.dataSource.data.filter((value,key)=>{
      if(value.GroupName == row_obj.Name){
        value.GroupName = row_obj.Name;
      }
      return true;
    });
  }
  deleteRowData(row_obj){
    this.dataSource.data = this.dataSource.data.filter((value,key)=>{
      return value.GroupName != row_obj.Name;
    });
  }
}


