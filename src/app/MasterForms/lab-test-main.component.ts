import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort } from '@angular/material';
import { MatDialogModule, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AddModifyCaseService } from '../Services/add-modify-case.service';
import { LabTestMaster } from '../models/UserData';
import { Router } from '@angular/router';
import { LabTestMainService } from '../Services/lab-test-main.service';


@Component({
  selector: 'lab-test-main',
  templateUrl: './lab-test-main.component.html',
  styleUrls: ['./lab-test-main.component.css']
})
export class LabTestMainComponent implements OnInit {
  displayedColumns: string[] = ['slno', 'UnqueID', 'CategoryName', 'TestName','TestPrice', 'DateStart','action'];
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

  asyncPipeLabTestMaster:LabTestMaster[] =[];

  constructor(private labTestMasterService : LabTestMainService,
    private dialog : MatDialog,private _router: Router, 
    private router:Router
    ) { }

  ngOnInit() {
    this.labTestMasterService.getAll().subscribe((data: LabTestMaster[]) => {
      //console.log('jay'+data);
      this.asyncPipeLabTestMaster = data;

      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';
      //this.GroupedDat();

    })
    
    // this.asyncPipeLabTestMaster$ = this.labTestMasterService.c();
    // console.log(this.asyncPipeLabTestMaster$);
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
    this.labTestMasterService.getAll().subscribe((data: LabTestMaster[]) => {
      console.log('jay'+data);
      this.asyncPipeLabTestMaster = data;
      //this.GroupedDat();
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';

    })
  }
   
   addEditExpenseItem(expenseId : LabTestMaster,testName:string)
   {
     if(expenseId !== null)
     {
    this._router.navigate(['/LabtestParameter', expenseId.UnqueID], { queryParams: { username: testName}});
     }
     else
     {
      this._router.navigate(['/LabtestParameter', 'Add'], { queryParams: { username: ""}});
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
    this.labTestMasterService.delete(UnqueID).subscribe(
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
