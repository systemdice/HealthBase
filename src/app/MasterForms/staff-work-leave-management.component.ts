import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTable, MatTableDataSource } from '@angular/material';
import { LeaveMangement } from '../models/UserData';
import { LeaveManagementService } from '../Services/leave-management.service';
import { AllMasterFixedData } from '../shared/AllConstants';
import { ScreenResolutionService } from '../shared/screen-resolution.service';
import { LeaveRequestMainComponent } from './leave-request-main.component';

@Component({
  selector: 'app-staff-work-leave-management',
  templateUrl: './staff-work-leave-management.component.html',
  styleUrls: ['./staff-work-leave-management.component.css'],
  //directives: [LeaveRequestMainComponent]
})
export class StaffWorkLeaveManagementComponent implements OnInit {
  displayedColumns: string[] = ['slno', 'UnqueID', 'DateStart', 'FirstName', 'StaffType','leaveId','leaveReason','ReportingManager', 'dateFrom','dateTo','SingleDayLeave','approved','action'];
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

  @ViewChild(LeaveRequestMainComponent) child:LeaveRequestMainComponent;
  // @ViewChild(MatSort,{static:true}) sort: MatSort;
  filterVal: string = '';

  asyncPipeUserDetails:LeaveMangement[] =[];
  asyncPipeUserDetailsObj:LeaveMangement;
  asyncPipeAlphabet:LeaveMangement[] =[];
  alphabet:string[] = AllMasterFixedData.alphabet; // ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
  
  updateID:string;
  SR:boolean;

  constructor(public leaveManagementService:LeaveManagementService,private screenResolutionService:ScreenResolutionService) { }
  // ngAfterViewInit() {
  //   // child is set
  //   this.child.doSomething();
  // }

  ngOnInit(): void {
   this.LoadAllLeaves();
   //alert(this.screenResolutionService.getIsMobileResolution());
   this.SR = this.screenResolutionService.getIsMobileResolution();
   if(this.SR == true){
this.displayedColumns = ['FirstName', 'StaffType', 'dateFrom','dateTo','approved','action'];
 
   }
  }

  LoadAllLeaves(){
    this.leaveManagementService.getAll().subscribe((data: LeaveMangement[]) => {
      //console.log('jay'+data);
      this.asyncPipeUserDetails = data;

      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';
      //this.GroupedDat();

    })
  }

  editedID:string=null;
  editUserDetailsMat(idParam: string) {
    // this.showTheAddInventory = true;
    // this.employeeIdUpdate = data.UnqueID.toString();
    // this.btnText = "UPDATE";
    // this.HeaderText = "UPDATE ";
    


    this.asyncPipeUserDetailsObj = this.asyncPipeUserDetails.find(x => x.UnqueID == idParam)
    this.child.doSomething(this.asyncPipeUserDetailsObj);
    //this.UserRegform.patchValue(this.asyncPipeUserDetails.find(x => x.UnqueID == idParam));
    this.editedID = this.asyncPipeUserDetailsObj.UnqueID;
    //this.ButtonText="Edit User";


  }
  message:string;

  receiveMessage($event) {
    this.message = $event
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  applyFilterAlphabet(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.asyncPipeAlphabet = this.asyncPipeUserDetails.filter(a=> a.FirstName.charAt(0).toLowerCase() === filterValue);
    this.dataSource = new MatTableDataSource(this.asyncPipeAlphabet);
    this.dataSource.paginator = this.actualPaginator; //this.paginator;
    this.dataSource.sort = this.actualSort; //this.sort;
    this.filterVal = '';
  }

  addEditExpenseItem(){}
  parentProperty = "I come from parent"
  DeleteItem(UnqueID : string)
  {
   if(confirm("Are you sure to delete ")) {
     //console.log("Implement delete functionality here");
     this.leaveManagementService.delete(UnqueID).subscribe(
       () => {
         setTimeout(() => {
           this.refreshParent();
           
         }, 1000);
         
       });
   }

    
  }
  refreshParent(){
    this.LoadAllLeaves();
  }

  deletePhone(xyz){
    //alert(xyz);
    this.LoadAllLeaves();
  }

}
