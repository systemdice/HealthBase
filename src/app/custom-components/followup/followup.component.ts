import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort } from '@angular/material';
import { MatDialogModule, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ExpenseItemComponent } from '../expense-item/expense-item.component';
import { Observable } from 'rxjs';
import { FollowupService } from 'src/app/shared/followup.service';
import { Followup } from 'src/app/shared/Followup.Model';
import { FollowupItemComponent } from '../followup-item/followup-item.component';


@Component({
  selector: 'app-followup',
  templateUrl: './followup.component.html',
  styleUrls: ['./followup.component.css']
})
export class FollowupComponent implements OnInit {
  displayedColumns: string[] = ['slno', 'UnqueID', 'UserName', 'FollowupStartDate', 'CategoryName','ClientName', 'WorkStatus','DemoStatus','action'];
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

  asyncPipeFollowup:Followup[] =[];

  constructor(private expenseService : FollowupService,
    private dialog : MatDialog
    ) { }

  ngOnInit() {
    this.expenseService.getAll().subscribe((data: Followup[]) => {
      //console.log('jay'+data);
      this.asyncPipeFollowup = data;

      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';
      //this.GroupedDat();

    })
    
    // this.asyncPipeFollowup$ = this.expenseService.c();
    // console.log(this.asyncPipeFollowup$);
    //console.log("rajat")
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
    this.expenseService.getAll().subscribe((data: Followup[]) => {
      console.log('jay'+data);
      this.asyncPipeFollowup = data;
      //this.GroupedDat();
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';

    })
  }
   
   addEditExpenseItem(expenseId? : Followup)
   {
     //console.log(expenseId.UnqueID);
     
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.width = "70%";
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

  const dialogRef = this.dialog.open(FollowupItemComponent,dialogConfig);

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
