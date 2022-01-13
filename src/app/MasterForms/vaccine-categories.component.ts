


//app.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatSort } from '@angular/material';
import { DialogBoxUnitUnitsComponent } from '../Popups/dialog-box-unit-units.component';
import { HttpClient } from '@angular/common/http';
import { Vaccinations } from '../models/UserData';
import { DialogBoxVaccinesComponent } from '../Popups/dialog-box-vaccines.component';
import { VaccinationsCategoryService } from '../Services/vaccines-category.service';
@Component({
  selector: 'app-vaccine-categories',
  templateUrl: './vaccine-categories.component.html',
  styleUrls: ['./vaccine-categories.component.css']
})
export class VaccineCategoriesComponent implements OnInit {
  displayedColumns: string[] = ['slno','VaccineName', 'Unit','Quantity','BatchNumber','HSN','MRP','Purchase','Expiry','Status','MonthLeft' ,'action'];
  //dataSource: MatTableDataSource<UsersData>;
  dataSource: MatTableDataSource< Vaccinations>;
  //dataSource = ELEMENT_DATA;
   VaccineCategories:  Vaccinations[] = [];

  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:true}) sort: MatSort;
  public response: any;

  constructor(public dialog: MatDialog,public  VaccineCategoriesService:  VaccinationsCategoryService,private http: HttpClient
    ) {

    
  }

  
  ngOnInit() {

    this.LoadAllTestInvestigations(); 
    setTimeout(() => {

              }, 1000)
   
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

  addRowData(row_obj: Vaccinations){
    
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

  FindExpireRemainingTime(ExpiryYear:string,ExpiryMonth:string){

    //var currentYear1: number=new Date().getFullYear();
    var CurrentYear = new Date().getFullYear();// DateTime.Now.Year;
    var CurrentMonth =new Date().getMonth();

    var YearDiff = parseFloat(ExpiryYear) - parseFloat(CurrentYear.toString());
    var MonthDiff = parseFloat(ExpiryMonth) -parseFloat( CurrentMonth.toString());
var ExpiryDayRemaining="";
    if (YearDiff >= 0)
    {
        if (YearDiff ==0)
        {
            if (MonthDiff < 0)
            {
                //value.Expiry = "expired";
                ExpiryDayRemaining = "0";
            }
            else if (MonthDiff >= 0)
            {
                //value.ExpiryStatus = "not expired";
                ExpiryDayRemaining = (YearDiff * 12 + MonthDiff).toString();
            }
        }
        else if(YearDiff > 0 && YearDiff <=1 )
        {

           // value.ExpiryStatus = "not expired";
            //(((12 - parseFloat(CurrentMonth))) + 12 * YearDiff).ToString()  04/2021 -- 07-2022
            ExpiryDayRemaining = (((12 - parseFloat(CurrentMonth.toString()))) + parseFloat(ExpiryMonth)).toString(); // (YearDiff * 12 + parseFloat(value.ExpiryMonth)).ToString();
        }
        else if (YearDiff >  1)
        {
            //04/2021 -- 04-2024 8+24+4
            //value.ExpiryStatus = "not expired";
            ExpiryDayRemaining = (((12 - parseFloat(CurrentMonth.toString()))) + (12 * (YearDiff - 1)) + parseFloat(ExpiryMonth)).toString();
            //value.ExpiryDayRemaining = (((12 - parseFloat(value.ExpiryMonth)) * YearDiff) + CurrentMonth).ToString(); // (YearDiff * 12 + parseFloat(value.ExpiryMonth)).ToString();
        }

    }
    else
    {
        //value.Expiry = "expired";
        ExpiryDayRemaining = "0";
    }

    return ExpiryDayRemaining;
  }
}


