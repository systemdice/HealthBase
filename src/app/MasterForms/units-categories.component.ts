
//app.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatSort } from '@angular/material';
import { UnitsCategory } from '../models/UserData';
import { UnitsCategoryService } from '../Services/units-category.service';
import { DialogBoxUnitUnitsComponent } from '../Popups/dialog-box-unit-units.component';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-units-categories',
  templateUrl: './units-categories.component.html',
  styleUrls: ['./units-categories.component.css']
})
export class UnitsCategoriesComponent implements OnInit{
  displayedColumns: string[] = ['UnqueID','Name', 'Description','Status', 'action'];
  //dataSource: MatTableDataSource<UsersData>;
  dataSource: MatTableDataSource<UnitsCategory>;
  //dataSource = ELEMENT_DATA;
  unitsCategory: UnitsCategory[] = [];

  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:true}) sort: MatSort;
  public response: any;

  constructor(public dialog: MatDialog,public unitsCategoryService: UnitsCategoryService,private http: HttpClient
    ) {

    
  }

  
  ngOnInit() {

    this.LoadAllTestInvestigations(); 
    setTimeout(() => {

              }, 1000)
   
  }

  LoadAllTestInvestigations(){
    this.unitsCategoryService.getAll().subscribe((data: UnitsCategory[])=>{
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
    const dialogRef = this.dialog.open(DialogBoxUnitUnitsComponent, {
      width: '600px',
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

  addRowData(row_obj:UnitsCategory){
    
    this.table.renderRows();
    
  }
  updateRowData(row_obj){
    this.dataSource.data = this.dataSource.data.filter((value,key)=>{
      if(value.Name == row_obj.Name){
        value.Name = row_obj.Name;
      }
      return true;
    });
  }
  deleteRowData(row_obj){
    this.dataSource.data = this.dataSource.data.filter((value,key)=>{
      return value.Name != row_obj.Name;
    });
  }
}

