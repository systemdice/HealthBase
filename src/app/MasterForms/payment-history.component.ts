import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort } from '@angular/material';
import { MatDialogModule, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AddModifyCaseService } from '../Services/add-modify-case.service';
import { PaymentHistory } from '../models/UserData';
import { Router } from '@angular/router';
import { PaymentHistoryService } from '../Services/payment-history.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {
  @Input() caseid: string;
  displayedColumns: string[] = ['slno', 'UnqueID', 'DateStart','Amount','RegdCharge','EarlierPayment','Discount','PaidAmount','Balance','ReceivedBy', 'action'];
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

  asyncPipePaymentHistory:PaymentHistory[] =[];

  constructor(private paymentHistoryService : PaymentHistoryService,
    private dialog : MatDialog,private _router: Router, 
    private router:Router
    ) { 
      //alert(this.caseid);
    }

   

  ngOnInit() {
    var id= this.caseid;
    this.paymentHistoryService.getPaymentsByCaseID(id).subscribe((data: PaymentHistory[]) => {
      //console.log('jay'+data);
      this.asyncPipePaymentHistory = data;
      if(this.asyncPipePaymentHistory !=null){
      this.asyncPipePaymentHistory.sort(function(a, b) {
        return a.DateStart.localeCompare(b.DateStart);
    });
  }
if(data != null)
{
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';
      //this.GroupedDat();
      
    }

    });
   
  }

  LoadPaymentHistoryData()
  {
    var id= this.caseid;
    this.paymentHistoryService.getPaymentsByCaseID(id).subscribe((data: PaymentHistory[]) => {
      //console.log('jay'+data);
      this.asyncPipePaymentHistory = data;

      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';
      //this.GroupedDat();

    })
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
    this.paymentHistoryService.getAll().subscribe((data: PaymentHistory[]) => {
      console.log('jay'+data);
      this.asyncPipePaymentHistory = data;
      //this.GroupedDat();
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';

    })
  }
   
   addEditExpenseItem(expenseId : PaymentHistory)
   {
     if(expenseId !== null)
     {
    this._router.navigate(['/freshCase', expenseId.UnqueID], { queryParams: { username: "jimmy"}});
     }
     else
     {
      this._router.navigate(['/freshCase', 'Addnew'], { queryParams: { username: "jimmy"}});
     }
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

  //////////////const dialogRef = this.dialog.open(ExpenseItemComponent,dialogConfig);

//   dialogRef.afterClosed().subscribe(result => {  
//     this.refreshParent();       
// }); 
      
   }

   DeleteItem(UnqueID : string)
   {
    this.paymentHistoryService.delete(UnqueID).subscribe(
      () => {
        setTimeout(() => {
          this.refreshParent();
          
        }, 1000);
        
      });
     //this.toastr.success("Expense successfully deleted.", "SystemDICE", {
       
    //    timeOut:2000
    //  })
   }

   
}
