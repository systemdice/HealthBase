
//app.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from '../Popups/dialog-box.component';
import { MatPaginator, MatSort } from '@angular/material';
import { CategoryMaster } from '../models/UserData';
import { CategoryMasterService } from '../Services/category-master.service';
import { DialogueBoxCatagoryComponent } from '../Popups/dialogue-box-catagory.component';


@Component({
  selector: 'app-catagory-master',
  templateUrl: './catagory-master.component.html',
  styleUrls: ['./catagory-master.component.css']
})
export class CatagoryMasterComponent implements OnInit{
  displayedColumns: string[] = ['UnqueID','Order','Name', 'Description','Status', 'action'];
  //dataSource: MatTableDataSource<UsersData>;
  dataSource: MatTableDataSource<CategoryMaster>;
  //dataSource = ELEMENT_DATA;
  CategoryMaster: CategoryMaster[] = [];

  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:true}) sort: MatSort;

  constructor(public dialog: MatDialog,public categoryMasterService: CategoryMasterService) {

    
  }
  ngOnInit() {

    this.LoadAllTestInvestigations(); 
   
  }

  LoadAllTestInvestigations(){
    this.categoryMasterService.getAll().subscribe((data: CategoryMaster[])=>{
      console.log(data);
      this.CategoryMaster = data;
       // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.CategoryMaster);  
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
    const dialogRef = this.dialog.open(DialogueBoxCatagoryComponent, {
      width: '600px',
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

  addRowData(row_obj:CategoryMaster){
    
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

