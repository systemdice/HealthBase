
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject, concat, of } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateAdapter } from '@angular/material';
import { CategoriesService } from '../shared/categories.service';
import { Expenses } from '../shared/Expense.Model';
import { LeaveMangement, ReferralMaster, UserDetails } from '../models/UserData';
import { StaffType } from '../models/AllConstansts';
import { RefaralService } from '../Services/referal.service';
import { LeaveManagementService } from '../Services/leave-management.service';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';
import { Moment } from 'moment';
import * as moment from 'moment';
import { UserDetailsService } from '../Services/user-details.service';
import { ScreenResolutionService } from '../shared/screen-resolution.service';

@Component({ 
  selector: 'app-leave-request-main',
  templateUrl: './leave-request-main.component.html',
  styleUrls: ['./leave-request-main.component.css']
})
export class LeaveRequestMainComponent implements OnInit {
  
  @Input() LeaveDetailValues;
  @Input() VaccineDetailsVisit: FormGroup;
  @Input() caseid: string;
  create_leave_req_msg: string;
  public has_error = false;
  message: string = "Hello!"

  @Output() messageEvent = new EventEmitter<string>();
  leaveTypes: Observable<any>;
  selectedLeaveType: any = null;
  leaveForm: FormGroup;
  minDate: Date;
  submitted = false;
  asyncPipeExpenses:Expenses[] =[];
  asyncPipeLeave:LeaveMangement[] =[];
  //readonly constDoctorDepartment = DoctorDepartment;
  readonly constStaffType = StaffType;
  sendMessage() {
    this.messageEvent.emit(this.message)
    //alert(this.message);
  }

  constructor(private formBuilder: FormBuilder,private dateAdapter: DateAdapter<Date>,private catagoryService : CategoriesService,
    public referralMasterService: RefaralService,public leaveManagementService:LeaveManagementService,public datepipe: DatePipe,
    private userDetailsService:UserDetailsService) {
      this.minDate = new Date();
      this.dateAdapter.setLocale('en-GB');
      }

      @Output() someEvent = new EventEmitter<string>();

  callParent(): void {
    this.someEvent.next('somePhone');
  }

      doSomething(id:LeaveMangement) {
        this.onWriterChangeAfterPatchValue(id.StaffType);
        //alert('from parent'+id.StaffType+JSON.stringify(id));
        this.leaveForm.patchValue(id);
        
    this.editedID = id.UnqueID;
      }

  ngOnInit() {
    //alert(this.screenResolutionService.getIsMobileResolution());
    //alert(this.LeaveDetailValues);
    //this.leaveTypes = this._leaveTypeService.getAllLeaveTypes();
    this.LoadLeaves();
    this.LoadSatffs();
    this.LoadAdminUsers();

    this.leaveForm = this.formBuilder.group({
      DateStart:[],
      StaffType:[''],
      FirstName:[''],
      leaveId:[''],
      leaveType: [''],
      leaveReason: [''],
      dateFrom: new Date(),// ['03/05/2021'],
      dateTo: new Date(),//this.datepipe.transform('03/05/2021', 'dd/MM/yyyy') 
      SingleDayLeave : [''],
      ReportingManager : [''],
      ReportingManagerEmail : [''],
      approved:[''],
      deniedReason:[''],
    });

    //this.leaveForm.get('dateFrom').patchValue(this.datepipe.transform(new Date('2021-05-19'), 'yyyy/MM/dd')); //this.datepipe. transform('15/05/2021', 'yyyy-MM-dd')); // (new Date('04/05/2021'))
  }
  @Input() childProperty: string;
  callfromparent(x){
    // alert('liku');
    // alert(x);
  }
  asyncPipeUserDetails:UserDetails[] =[];
  LoadAdminUsers(){
    this.userDetailsService.getAll().subscribe((data: UserDetails[]) => {
      //console.log('jay'+data);
      this.asyncPipeUserDetails = data.filter(a=>a.Role == 'Admin');
    })
  }
  onStatusChange(ob) {
    //console.log('Book changed...');
    let selectedBook = ob.value;
    //console.log(selectedBook);
  }
  get f() { return this.leaveForm.controls; }
  get StaffType() {
    return this.leaveForm.get('StaffType');
  }
  get StaffName() {
    return this.leaveForm.get('FirstName');
  }
  get dateFrom() {
    return this.leaveForm.get('dateFrom');
  }
  get dateTo() {
    return this.leaveForm.get('dateTo');
  }
  onWriterChange() {
    // console.log('Writer changed...');
    // console.log(this.StaffType.value);
    this.LoadAllDoctor(this.StaffType.value);
    //this.filteredBooks = this.bookService.getBooksByWriter(this.writer.value.wid);
  }
  onWriterChangeAfterPatchValue(stafftype) {
    // console.log('Writer changed...');
    // console.log(this.StaffType.value);
    this.LoadAllDoctor(stafftype);
    //this.filteredBooks = this.bookService.getBooksByWriter(this.writer.value.wid);
  }
  reportingManager:string= 'NA';
  leaveStatus:string='Pending';
  appliedDate = this.datepipe.transform(new Date(), 'dd/MM/yyyy'); //new Date();
  onStaffChange(){
    var k = this.referralMaster.find(a=>a.FirstName == this.StaffName.value)
    if(k != undefined){
this.reportingManager = 'Dr. Mahesh Prasad Mohanta'; //k.UnqueID;
    }
  }
  referralMaster: ReferralMaster[] = [];
  LoadAllDoctor(staff) {
    this.referralMasterService.getStaffType(staff).subscribe((data: ReferralMaster[]) => {
      //console.log(data);
      this.referralMaster = data;//.filter(x=> x.StaffType == 'Nurse');
      //this.referralMaster = this.referralMaster.filter(x=> x.StaffType == 'Nurse');

    })
  }

  LoadLeaves(){
    this.catagoryService.getAllLeaves('Leave').subscribe((data: Expenses[]) => {
      //console.log('jay'+data);
      this.asyncPipeExpenses = data;
    });
  }
  LoadSatffs(){
    this.catagoryService.getAllLeaves('Leave').subscribe((data: Expenses[]) => {
      //console.log('jay'+data);
      this.asyncPipeExpenses = data;
    });
  }
  onSave() {
    this.submitted = true;
    this.CreateLeave();
    // stop here if form is invalid
    // if (this.leaveForm.invalid) {
    //   alert('form is invalid');
    //   return;
    // }
    //const submissionData = { ...this.leaveForm.value, 'leaveTypeDTO': { 'leaveTypeId': this.leaveForm.value.leaveType } };
//save
//leaveManagementService
   
  }

  getDifferenceInDays(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60 * 60 * 24);
  }
  startALeave(){
    this.updateID = null;
        this.leaveForm.reset();
        this.editedID = null;
  }

  editedID:string;
  updateID:string;
  CreateLeave()
  {
    //this.ButtonText="Create User";
    if(this.editedID != null){
      this.leaveManagementService.update(this.editedID,this.leaveForm.value).subscribe(
        (test) => {
          // this.CaseID = test.UnqueID;
          // this.paymentDetailsTemplate.SavePaymentDetails(this.CaseID);
          // this.child.SavePatientDetails(this.CaseID);
          alert('Leave Request Updated Successfully.');
          this.updateID = null;
          this.leaveForm.reset();
          this.editedID = null;
          this.callParent();
        });
    }
    else{
      //this.leaveForm.value.dateFrom =this.datepipe.transform(this.leaveForm.value.dateFrom.toISOString().split('T')[0], 'dd/MM/yyyy') ;
      this.leaveForm.value.dateFrom = this.leaveForm.value.dateFrom.toISOString().split('T')[0];
      this.leaveForm.value.dateTo = this.leaveForm.value.dateTo.toISOString().split('T')[0];
      this.leaveForm.value.SingleDayLeave = this.getDifferenceInDays(new Date(this.leaveForm.value.dateFrom),new Date(this.leaveForm.value.dateTo))+1;
      this.leaveForm.value.ReportingManager = 'Dr. Mahesh Prasad Mohanta';
      this.leaveForm.value.ReportingManagerEmail = 'mahesh.mohant@gmail.com';
      this.leaveForm.value.approved= 'Approved';
    this.leaveManagementService.createStudent(this.leaveForm.value).subscribe(
      (test) => {
        // this.CaseID = test.UnqueID;
        // this.paymentDetailsTemplate.SavePaymentDetails(this.CaseID);
        // this.child.SavePatientDetails(this.CaseID);
        alert('Leave Request Cretaed Successfully.');
        this.updateID = null;
        this.leaveForm.reset();
        this.editedID = null;
        this.callParent();
      });
    }

  }

}
