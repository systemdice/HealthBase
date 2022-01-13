import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort } from '@angular/material';
import { MatDialogModule, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AddModifyCaseService } from '../Services/add-modify-case.service';
import { NewModifyCase, NotifyPendingTestData } from '../models/UserData';
import { Router } from '@angular/router';
import { StorageService } from '../shared/storage.service';

export interface pendingLab{
  id:string;
  name:string;
}


@Component({
  selector: 'test-details-pending',
  templateUrl: './test-details-pending.component.html',
  styleUrls: ['./test-details-pending.component.css']
}) 
export class TestDetailsPendingComponent implements OnInit {
  displayedColumns: string[] = ['slno', 'CaseID','ParentTest', 'TestName', 'DateStart','RefferDoctorName','CollectionCenter','ProgressStatus', 'action'];
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

  asyncPipeNewModifyCase:NotifyPendingTestData[] =[];
  Username: string;
  Role: string;
  Location:string;

  constructor(private addModifyCaseService : AddModifyCaseService,
    private dialog : MatDialog,private _router: Router, private _store: StorageService,
    private router:Router
    ) { 
      this.Username = this._store.sessionUsername;
    this.Role = this._store.sessionRole;
    this.Location = this._store.sessionLocation;
    }
result:any;
result1:any;
  ngOnInit() {
    this.addModifyCaseService.getAllPendingTests().subscribe((data: NotifyPendingTestData[]) => {
      //console.log('jay'+data);
      if(this.Role == 'Admin' || this.Role == 'SuperAdmin')
      {
        this.asyncPipeNewModifyCase = data;
      }
      else
      {
        this.asyncPipeNewModifyCase = data.filter(a => a.Location == this.Location);
      }
      
      //this.result = this.asyncPipeNewModifyCase.map(({ UnqueID, TestNameWithCase }) => ({UnqueID, TestNameWithCase}));
     // this.result = this.asyncPipeNewModifyCase.map(a => a.TestNameWithCase.TestType);
      //this.result1 = this.result.map(x=>{a: x.UnqueID; b: x.TestNameWithCase.TestType});

      this.dataSource = new MatTableDataSource(this.asyncPipeNewModifyCase);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';
      
      

    })
    
    // this.asyncPipeNewModifyCase$ = this.addModifyCaseService.c();
    // console.log(this.asyncPipeNewModifyCase$);
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
    this.addModifyCaseService.getAllPendingTests().subscribe((data: NotifyPendingTestData[]) => {
      console.log('jay'+data);
      this.asyncPipeNewModifyCase = data;
      //this.GroupedDat();
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';

    })
  }
   
   addEditExpenseItem(expenseId : NewModifyCase,firstName:string)
   {
     if(expenseId !== null)
     {
    this._router.navigate(['/freshCase', expenseId.UnqueID], { queryParams: { username: firstName}});
     }
     else
     {
      this._router.navigate(['/freshCase', 'Addnew'], { queryParams: { username: ""}});
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

   addEditLabTestItem(expenseId : NotifyPendingTestData,testName:string)
   {
     if(expenseId !== null)
     {
    this._router.navigate(['/LabTestInd', expenseId.CaseID,testName], { queryParams: { username: expenseId.ParentTest}});
     }
     else
     {
      this._router.navigate(['/LabTestInd', 'Addnew',testName], { queryParams: { username: ""}});
     }
    }
    

   DeleteItem(UnqueID : string)
   {
    this.addModifyCaseService.delete(UnqueID,'').subscribe(
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
