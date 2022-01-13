import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort } from '@angular/material';
import { ExpensesService } from 'src/app/shared/expenses.service';
import { MatDialogModule, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Expenses } from 'src/app/shared/Expense.Model';
import { Observable } from 'rxjs';
import { ExpensesCategoryComponent } from '../expenses-category/expenses-category.component';
import { CategoriesService } from '../shared/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  CategoryType:string="All";
  CategoryCollection = ['All','Internal','External','Followup','HealthPKG','PathoLAB','Medicine','Account','TimeManagement','Nursing','DailyExpense','DoctorFollowup','Leave','Employee','Others'];
  displayedColumns: string[] = ['slno', 'UnqueID', 'CategoryName','CategoryType', 'Date', 'Notes', 'action'];
  //dataSource: MatTableDataSource<UsersData>;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  //@ViewChild(MatPaginator, {static:true})// paginator: MatPaginator;  
  actualPaginator: MatPaginator;
  @ViewChild(MatPaginator,{static:true})
  set paginator(value: MatPaginator) {
    this.actualPaginator = value;
  }

  actualSort: MatSort;
  @ViewChild(MatSort,{static:true})
  set sort(value: MatSort) {
    this.actualSort = value;
  }

  // @ViewChild(MatSort,{static:true}) sort: MatSort;
  filterVal: string = '';

  asyncPipeExpenses:Expenses[] =[];

  constructor(private expenseService : ExpensesService,
    private catagoryService : CategoriesService,
    private dialog : MatDialog
    ) { }

  ngOnInit() {
    this.catagoryService.getAll().subscribe((data: Expenses[]) => {
      //console.log('jay'+data);
      this.asyncPipeExpenses = data;

      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';
      //this.GroupedDat();

    });
    
    // this.asyncPipeExpenses$ = this.expenseService.c();
    // console.log(this.asyncPipeExpenses$);
    //console.log("rajat")
  }
  LoadCategoryFilter(filterOption:string){
    var filterData  = this.asyncPipeExpenses;
    if(filterOption !== 'All')
    {
      filterData  = this.asyncPipeExpenses.filter(x=>x.CategoryType == filterOption);
    }

      this.dataSource = new MatTableDataSource(filterData);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';
  }

  public getColor(val: string): string{
    return val == 'Income' ? "green" : "red";
 }
 public getGreenMark(val: string): boolean{
  return val == 'Income' ? true : false;
}
public getRedMark(val: string): boolean{
  return val == 'Income' ? false : true;
}

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


   

  refreshParent(){
    this.catagoryService.getAll().subscribe((data: Expenses[]) => {
      //console.log('jay'+data);
      this.asyncPipeExpenses = data;
      //this.GroupedDat();
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';

    })
  }
   
   addEditExpenseItem(expenseId? : Expenses)
   {
     //console.log(expenseId.UnqueID);
     
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.width = "50%";
        dialogConfig.data = expenseId;
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

  const dialogRef = this.dialog.open(ExpensesCategoryComponent,dialogConfig);

  dialogRef.afterClosed().subscribe(result => {  
    this.refreshParent();       
}); 
      
   }

   DeleteItem(UnqueID : string)
   {
    this.catagoryService.delete(UnqueID).subscribe(
      () => {
        setTimeout(() => {
          this.refreshParent();
          
        }, 1000);
        
      });
     
   }

   callType(value) {
    console.log(value);
    //alert(value);
    this.LoadCategoryFilter(value);
  }

   
}
