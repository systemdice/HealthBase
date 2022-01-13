import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DateAdapter, MatPaginator, MatSort } from '@angular/material';
import { ExpensesService } from 'src/app/shared/expenses.service';
import { MatDialogModule, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ExpenseItemComponent } from './../expense-item/expense-item.component';
import { Expenses } from 'src/app/shared/Expense.Model';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {
  displayedColumns: string[] = ['slno', 'UnqueID', 'ExpenseAmount', 'Date', 'BusinessType', 'ExpenseCategory','action'];
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
  asyncPipeExpensesFilter:Expenses[] =[];

  constructor(private expenseService : ExpensesService,private dateAdapter: DateAdapter<Date>,
    private dialog : MatDialog
    ) { 
      this.dateAdapter.setLocale('en-GB');
    }

  ngOnInit() {
    this.ShowAllExpense();
    
    // this.asyncPipeExpenses$ = this.expenseService.c();
    // console.log(this.asyncPipeExpenses$);
    //console.log("rajat")
  }
  ShowAllExpense(){
    this.ClearDateRangeField();
    this.expenseService.getAll().subscribe((data: Expenses[]) => {
      //console.log('jay'+data);
      this.asyncPipeExpenses = data;

      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';
      //this.GroupedDat();

    })
  }
  StartDate:string;
  EndDate:string;
  MonthName:string;
  ShowDateRangeDate(passdateFrom,passdateTo) {
//     var date2 = new Date(passdateFrom);
//     const monthNames = ["January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December"
// ];
// alert(date2.getMonth());
// const d = new Date();
// alert("The current month is " + monthNames[date2.getMonth()]);
    
    //alert(passdate);
    //this.myDate = this.datePipe.transform(new Date(passdateFrom), 'dd-MM-yyyy').toString();
    //alert(this.myDate);
    //var myDate1 = this.datePipe.transform(new Date(new Date().getTime()-(1*24*60*60*1000)), 'dd-MM-yyyy').toString();
    // var myDate1 = this.datePipe.transform(new Date(new Date()), 'dd-MM-yyyy').toString();
    // var myDate2 = this.datePipe.transform(new Date(passdateFrom), 'dd-MM-yyyy').toString();

    // if(new Date(new Date()) > new Date(passdateFrom)){
    //   alert('greater');
    // }

    //alert(myDate1);
    //this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a=> a.DateStart == this.myDate);
    //this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a => a.BillingDate == this.myDate);
    //this.asyncPipeFarmacyDeliveryToPatient = this.asyncPipeFarmacyDeliveryToPatientBackup.filter(a => this.datePipe.transform(new Date(a.BillingDate), 'dd-MM-yyyy').toString() == this.myDate);
    
    this.asyncPipeExpensesFilter = this.asyncPipeExpenses.filter
        (a => this.addDays(new Date(a.Date),0) >= new Date(passdateFrom) && this.addDays(new Date(a.Date),-1) <= new Date(passdateTo) );
    
    this.filterVal = '';

    this.dataSource = new MatTableDataSource(this.asyncPipeExpensesFilter);
    this.dataSource.paginator = this.actualPaginator; //this.paginator;
    this.dataSource.sort = this.actualSort; //this.sort;
    this.filterVal = '';

    // this.dataSourcePL = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    // this.dataSourcePL.paginator = this.actualPaginator; //this.paginator;
    // this.dataSourcePL.sort = this.actualSort; //this.sort;
    // this.filterValPL = '';

  }
  currentYear: number = new Date().getFullYear();
  ShowDateMonthandYear(MonthName) {

this.ClearDateRangeField();
     
    this.asyncPipeExpensesFilter = this.asyncPipeExpenses.filter
        (a => ((this.addDays(new Date(a.Date),0)).getMonth()+1).toString() == MonthName  );
    
    this.filterVal = '';

    this.dataSource = new MatTableDataSource(this.asyncPipeExpensesFilter);
    this.dataSource.paginator = this.actualPaginator; //this.paginator;
    this.dataSource.sort = this.actualSort; //this.sort;
    this.filterVal = '';

    // this.dataSourcePL = new MatTableDataSource(this.asyncPipeFarmacyDeliveryToPatient);
    // this.dataSourcePL.paginator = this.actualPaginator; //this.paginator;
    // this.dataSourcePL.sort = this.actualSort; //this.sort;
    // this.filterValPL = '';

  }
  ClearDateRangeField(){
    this.EndDate= null;
this.StartDate= null;
  }
  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
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
    this.expenseService.getAll().subscribe((data: Expenses[]) => {
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

  const dialogRef = this.dialog.open(ExpenseItemComponent,dialogConfig);

  dialogRef.afterClosed().subscribe(result => {  
    this.refreshParent();       
}); 
      
   }

   DeleteItem(UnqueID : string)
   {
    this.expenseService.delete(UnqueID).subscribe(
      () => {
        setTimeout(() => {
          this.refreshParent();
          
        }, 1000);
        
      });
     
   }

   
}
