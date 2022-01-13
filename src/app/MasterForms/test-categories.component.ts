
//app.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from '../Popups/dialog-box.component';
import { MatPaginator, MatSort } from '@angular/material';
import { TestsCategoryService } from '../Services/tests-category.service';
import { TestsCategory } from '../models/UserData';

export interface UsersData {
  name: string;
  id: number;
}

const ELEMENT_DATA: UsersData[] = [
  {id: 1560608769632, name: 'Artificial Intelligence'},
  {id: 1560608796014, name: 'Machine Learning'},
  {id: 1560608787815, name: 'Robotic Process Automation'},
  {id: 1560608805101, name: 'Blockchain'}
];
@Component({
  selector: 'app-test-categories',
  templateUrl: './test-categories.component.html',
  styleUrls: ['./test-categories.component.css']
})
export class TestCategoriesComponent implements OnInit{
  displayedColumns: string[] = ['UnqueID','Name', 'ShortName','Category', 'action'];
  //dataSource: MatTableDataSource<UsersData>;
  dataSource: MatTableDataSource<TestsCategory>;
  //dataSource = ELEMENT_DATA;
  TestsCategory: TestsCategory[] = [];

  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:true}) sort: MatSort;

  constructor(public dialog: MatDialog,public testsCategoryService: TestsCategoryService) {

    
  }
  ngOnInit() {

    this.LoadAllTestInvestigations(); 
   
  }

  LoadAllTestInvestigations(){
    this.testsCategoryService.getAll().subscribe((data: TestsCategory[])=>{
      //console.log(data);
      this.TestsCategory = data;
       // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.TestsCategory);  
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
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '800px',
      height:'650px',
      data:obj
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

  addRowData(row_obj:TestsCategory){
    
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

