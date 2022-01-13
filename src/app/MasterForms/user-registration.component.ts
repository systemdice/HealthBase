import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTable, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseItemComponent } from '../custom-components/expense-item/expense-item.component';
import { ReferralMaster, UserDetails } from '../models/UserData';
import { RefaralService } from '../Services/referal.service';
import { UserDetailsService } from '../Services/user-details.service';
import { StorageService } from '../shared/storage.service';
import { HttpEventType, HttpClient, HttpResponse } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from "rxjs/operators";
import { APIDetails } from '../models/AllConstansts';
import * as XLSX from 'xlsx';
import { TableUtil } from '../shared/tableUtil';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
  apiServer = APIDetails.HelathAPI; //"https://localhost:44380"; //
  displayedColumns: string[] = ['slno', 'ProfilePicName', 'UserName', 'Password', 'Email', 'ContactNumber','Role','SecretCode','Location','ReportingManagerName','action'];
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

  asyncPipeUserDetails:UserDetails[] =[];

  
  updateID:string;
  managers:any[];
  cities = ['Mr.', 'Mrs.', 'Smt','Shree'];
  roles= ['SuperAdmin','Admin','Doctor','Nurse','Patho','Account','Advisor','Reception','Pharmacy','Security', 'Supervisor', 'Sales','User','Employee','Manager','Other'];
  designations =['Manager', 'Implementor', 'Architect','BA','Planner'];
  Location1:string='Bhubaneswar';
  Locations =['All','Bhubaneswar','Anandpur','Talcher','Baripada','Angul','Anandpur','Rourkela',
  ,'Boudh'
  ,'Balangir'
  ,'Bargarh'
  ,'Balasore(Baleswar)'
  ,'Bhadrak'
  ,'Cuttack'
  ,'Deogarh(Debagarh)'
  ,'Dhenkanal'
  ,'Ganjam'
  ,'Gajapati'
  ,'Jharsuguda'
  ,'Jajpur'
  ,'Jagatsinghapur'
  ,'Khordha'
  ,'Keonjhar(Kendujhar)'
  ,'Kalahandi'
  ,'Kandhamal'
  ,'Koraput'
  ,'Kendrapara'
  ,'Malkangir'
  ,'Mayurbhanj'
  ,'Nabarangpur'
  ,'Nuapada'
  ,'Nayagarh'
  ,'Puri'
  ,'Rayagada'
  ,'Sambalpur'
  ,'Subarnapur(Sonepur)'
  ,'Sundargarh'
  ];
     selected1 = 'Mumbai';
    UserRegform: FormGroup = new FormGroup({
      UserName: new FormControl(''),
    Password: new FormControl(''),
    oldpassword: new FormControl(''),
    newpassword: new FormControl(''),
    ContactNumber: new FormControl(''),
    Email: new FormControl(''),
    Role: new FormControl(''),
    Designation: new FormControl(''),
    SecretCode: new FormControl(''),
    Location: new FormControl(''),
    RefferDoctorName: new FormControl(''),
    ReportingManagerName : new FormControl(''),
            ReportingManagerRole : new FormControl(''),
            ProfilePicName : new FormControl(''),
  });
  submit() {
    if (this.UserRegform.valid) {
      this.submitEM.emit(this.UserRegform.value);
    }
  }
  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();
  enbldsbl:boolean=false;
  enableDisablepwd:boolean=false;
  enableDisableusrreg:boolean=false;

showSectionBasedOnRole:boolean=false;

@ViewChild('editor') editor;
description: string = "<p><b>Lorem ipsum</b> dolor sit amet, <s>consectetur adipiscing elit</s>, sed do eiusmod tempor <u>incididunt</u> ut labore et dolore <i>magna aliqua</i>.";

setStyle(style: string) {
  let bool = document.execCommand(style, false, null);
}

onChange() {
  console.log(this.editor.nativeElement["innerHTML"]);
}



exportArray() {
    
  TableUtil.exportArrayToExcel(this.asyncPipeUserDetails, "BedDetails");
}


public progress: number;
  public message: string;
  @Output() public onUploadFinished = new EventEmitter();
  public uploadFile = (files) => {
    // if (files.length === 0 && this.editedID == null) {
    //   this.CreateUser();
    //   return;
     
    // }
   
    this.ButtonText="Create User";
    if(this.editedID != null){
      if (files.length !== 0){
        let fileToUpload = <File>files[0];
        this.UserRegform.value.ProfilePicName = fileToUpload.name;
      }
      else{
        //this.UserRegform.value.ProfilePicName = this.UserRegform.value.UserName+".PNG";
        this.UserRegform.value.ProfilePicName = "NA.PNG";
      }
      
      this.userDetailsService.update(this.editedID,this.UserRegform.value).subscribe(
        (test) => {

          if (files.length !== 0){
          let fileToUpload = <File>files[0];
          const formData = new FormData();
          formData.append('file', fileToUpload, fileToUpload.name);
          this.http.post(this.apiServer+'/api/ImageUpload?nameOfFile='+this.UserRegform.value.ProfilePicName, formData, { reportProgress: true, observe: 'events'})
            .subscribe(event => {
              if (event.type === HttpEventType.UploadProgress)
                this.progress = Math.round(100 * event.loaded / event.total);
              else if (event.type === HttpEventType.Response) {
                this.message = 'Upload success.';
                this.onUploadFinished.emit(event.body);
              }
              this.UserRegform.reset();
            });
          }
      
          // this.CaseID = test.UnqueID;
          // this.paymentDetailsTemplate.SavePaymentDetails(this.CaseID);
          // this.child.SavePatientDetails(this.CaseID);
          alert('User Updated Successfully.');
          this.updateID = null;
          this.UserRegform.reset();
          this.editedID = null;
        });
    }
    else{
      if (files.length !== 0){
        let fileToUpload = <File>files[0];
        this.UserRegform.value.ProfilePicName = fileToUpload.name;
      }
      else{
        //this.UserRegform.value.ProfilePicName = this.UserRegform.value.UserName+".PNG";
        this.UserRegform.value.ProfilePicName = "NA.PNG";
      }
    this.userDetailsService.createStudent(this.UserRegform.value).subscribe(
      (test) => {
        if (files.length !== 0){
        let fileToUpload = <File>files[0];
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);
        this.http.post(this.apiServer+'/api/ImageUpload?nameOfFile='+this.UserRegform.value.ProfilePicName, formData, { reportProgress: true, observe: 'events'})
          .subscribe(event => {
            if (event.type === HttpEventType.UploadProgress)
              this.progress = Math.round(100 * event.loaded / event.total);
            else if (event.type === HttpEventType.Response) {
              this.message = 'Upload success.';
              this.onUploadFinished.emit(event.body);
            }
            this.UserRegform.reset();
          });
        }
        // this.CaseID = test.UnqueID;
        // this.paymentDetailsTemplate.SavePaymentDetails(this.CaseID);
        // this.child.SavePatientDetails(this.CaseID);
        alert('User cretaed Successfully.');
        this.updateID = null;
        this.UserRegform.reset();
        this.editedID = null;
        
      });

      this.LoadUserGrid();
    }

  



  } // upload functionality ended here
  // downloadFile(): Observable<any>{
	// 	return this.http.get('http://localhost:8080/employees/download', {responseType: ResponseContentType.Blob});
  // }
  errorMsg:boolean=false;;
  download(url: string,id:string): Observable<any> {
    this.errorMsg = false;
    return this.http.get(url+id, {responseType: 'blob'})
    .pipe(
      catchError((err) => {
        alert('File/image not available');
        this.errorMsg = true;
                console.log('error caught in service')
                console.error(err); 
                //Handle the error here 
                return throwError(err);    //Rethrow it back to component
              })
  );


  // return this.http.get<repos[]>(this.baseURL + 'usersY/' + userName + '/repos')
  //     .pipe(
  //       catchError((err) => {
  //         console.log('error caught in service')
  //         console.error(err); 
  //         //Handle the error here 
  //         return throwError(err);    //Rethrow it back to component
  //       })
  //     )

  }
  constructor(private userDetailsService:UserDetailsService,private route: ActivatedRoute,private http: HttpClient,
    private router: Router,private _store: StorageService,public referralMasterService: RefaralService,private dialog : MatDialog) {

      this.Username = this._store.sessionUsername;
    this.Role = this._store.sessionRole;

   }
   option:string;
   Username: string;
   Role:string;
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      // alert(params['id']);
      //   alert(params['testname']);
        this.option = params['option'];
        if(params['option']=='pwd')
        {
this.enableDisablepwd= true;
this.enableDisableusrreg= false;
        }
        else if(params['option']=='usrreg')
        {
this.enableDisableusrreg= true;
this.enableDisablepwd= false;
        }
    });

    if(this.Role == 'Admin' || this.Role == 'SuperAdmin'){
      this.showSectionBasedOnRole = true;
    }else{
      this.UserRegform.patchValue({ UserName: this.Username });
      //this.onBookChange();
      
    }
    this.LoadUserGrid();
    
  }

  LoadUserGrid(){
    this.userDetailsService.getAll().subscribe((data: UserDetails[]) => {
      //console.log('jay'+data);
      this.asyncPipeUserDetails = data;
      var removeObj = this.UserRegform.value.UserName;
      this.managers = this.asyncPipeUserDetails.map(a=>a.UserName).filter(obj => obj !== removeObj);
      //var finalArr = values.filter(function(val) { return val.Rev != "NO ACCESS"; });

      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';
      //this.GroupedDat();

    })
  }

  public getColor(val: string): string{
    return val == 'Admin' ? "green" : "red";
 }
 public getGreenMark(val: string): boolean{
  return val == 'Admin' ? true : false;
}
public getRedMark(val: string): boolean{
  return val !== 'Admin' ? false : true;
}

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  
  refreshParent(){
    this.userDetailsService.getAll().subscribe((data: UserDetails[]) => {
      //console.log('jay'+data);
      this.asyncPipeUserDetails = data;
      //this.GroupedDat();
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';

    })
  }
   
   addEditExpenseItem(expenseId? : UserDetails)
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
    if(confirm("Are you sure to delete ")) {
      //console.log("Implement delete functionality here");
      this.userDetailsService.delete(UnqueID).subscribe(
        () => {
          setTimeout(() => {
            this.refreshParent();
            
          }, 1000);
          
        });
    }
   
     
   }

   ButtonText:string="Create User";
  CreateUser()
  {
    this.ButtonText="Create User";
    if(this.editedID != null){
      this.userDetailsService.update(this.editedID,this.UserRegform.value).subscribe(
        (test) => {
          // this.CaseID = test.UnqueID;
          // this.paymentDetailsTemplate.SavePaymentDetails(this.CaseID);
          // this.child.SavePatientDetails(this.CaseID);
          alert('User Updated Successfully.');
          this.updateID = null;
          this.UserRegform.reset();
          this.editedID = null;
        });
    }
    else{
    this.userDetailsService.createStudent(this.UserRegform.value).subscribe(
      (test) => {
        // this.CaseID = test.UnqueID;
        // this.paymentDetailsTemplate.SavePaymentDetails(this.CaseID);
        // this.child.SavePatientDetails(this.CaseID);
        alert('User cretaed Successfully.');
        this.updateID = null;
        this.UserRegform.reset();
        this.editedID = null;
        
      });
    }

  }
  ChangePassword(){
    this.userDetailsService.update('ChangePassword',this.UserRegform.value).subscribe(
      (test) => {
        // this.CaseID = test.UnqueID;
        // this.paymentDetailsTemplate.SavePaymentDetails(this.CaseID);
        // this.child.SavePatientDetails(this.CaseID);
        alert('You new Password updated Successfully. Your User ID is ' + test.UnqueID);
        this.updateID = null;
        this.UserRegform.reset();
      });
  }

  ResetPassword(){
    this.userDetailsService.update('ResetPassword',this.UserRegform.value).subscribe(
      (test) => {
        // this.CaseID = test.UnqueID;
        // this.paymentDetailsTemplate.SavePaymentDetails(this.CaseID);
        // this.child.SavePatientDetails(this.CaseID);
        alert('You Password reset was Successful. Separate Email has been sent to you.');
        this.updateID = null;
        this.UserRegform.reset();
      });
  }

  editedID:string=null;
  editUserDetailsMat(idParam: string) {
    // this.showTheAddInventory = true;
    // this.employeeIdUpdate = data.UnqueID.toString();
    // this.btnText = "UPDATE";
    // this.HeaderText = "UPDATE ";


    let p: any = this.asyncPipeUserDetails.find(x => x.UnqueID == idParam)
    this.UserRegform.patchValue(this.asyncPipeUserDetails.find(x => x.UnqueID == idParam));
    this.UserRegform.patchValue({ReportingManagerName:p.ReportingManagerName});
    var removeObj = this.UserRegform.value.UserName;
      this.managers = this.asyncPipeUserDetails.map(a=>a.UserName).filter(obj => obj !== removeObj);
    this.editedID = p.UnqueID;
    this.ButtonText="Edit User";


  }

  loadDoctor:boolean=false;
onBookChange(ob) {
  //alert(ob.value);
  let selectedBook = ob.value;
  if(selectedBook == 'Doctor'){
    this.loadDoctor = true;
    this.LoadAllDoctor();
  }
  else{
    this.loadDoctor = false;
  }
 //alert(selectedBook);
}

referralMaster: ReferralMaster[] = [];
  LoadAllDoctor() {
    this.referralMasterService.getAll().subscribe((data: ReferralMaster[]) => {
      //console.log(data);
      this.referralMaster = data;

    })
  }

}
