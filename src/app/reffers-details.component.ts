
import { Component, HostListener, Inject, Input, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MatPaginator, MatSort, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
// import { Calendar, EventInput  } from '@fullcalendar/core';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timegrid from '@fullcalendar/timegrid';
// import timeGrigPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
// import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking
import { RefaralService } from './Services/referal.service';
import { Availability, ReferralMaster, Timeslot } from './models/UserData';
import { DoctorDepartment, StaffType } from './models/AllConstansts';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AvailabilityService } from './Services/availability.service';



@Component({
  selector: 'app-reffers-details',
  templateUrl: './reffers-details.component.html',
  styleUrls: ['./reffers-details.component.css']
})
export class ReffersDetailsComponent implements OnInit  {
  name = 'Angular';
  states: Array<String> = ['AR', 'AL', 'CA', 'DC'];
  fruits: Array<String> = ['Mango', 'Grapes', 'Strawberry', 'Oranges'];
  favFruitsError: Boolean = true;
  selectedFruitValues = [];
  addrFrom: FormGroup;
  @Input() PatientComponent:boolean;
  cities = ['Mr.', 'Mrs.', 'Smt','Shree'];
  readonly constDoctorDepartment = DoctorDepartment;
  readonly constStaffType = StaffType;
  referralMaster: ReferralMaster[] = [];
  displayedColumns: string[] = ['UnqueID','StaffType','FirstName', 'ContactNumber','Department','fees','Discount','Experience','Email','Degree','action'];
  //dataSource: MatTableDataSource<UsersData>;
  dataSource: MatTableDataSource<ReferralMaster>;
  //dataSource = ELEMENT_DATA;

  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:true}) sort: MatSort;
showLeaveSection:boolean= true;
showPopupCloseSection= false;
  constructor(private _fb: FormBuilder,private router:Router, public dialog: MatDialog,
     public referralMasterService: RefaralService, public availabilityService:AvailabilityService,
     public refaralService:RefaralService,public dialogRef: MatDialogRef<ReffersDetailsComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit() {
    this.createForm();
    //console.log('final FormGroup is ', this.addrFrom.value)
    this.LoadAllDoctor();
    //this.referralChangeAction('');
    if(this.data.AddEdit == 'Pharmacy' || this.data.AddEdit == 'Add'){
this.showLeaveSection = false;
this.showPopupCloseSection= true;
    }
    else if(this.data.AddEdit ==undefined){
      this.showPopupCloseSection= false;
    }
  }

  createForm() {
    this.addrFrom = this._fb.group({
      FirstName: ['',[Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      LastName: [''],
      ContactNumber: ['',[Validators.required]],
      Description: [''],
      Status: ['true'],
      Department: ['', [Validators.required]],
      fees: ['',[Validators.required]],
      Commission:['0'],
      Discount: [0,[ Validators.maxLength(4)]],
      Experience:['',[Validators.required]],
      Degree: [''],
      DoctorName:[''],
      Email: ['',[Validators.required, Validators.email]],
      Address: [''],
      Title: [''],
      DateStart: [''],
      DateEnd: [''], 
      StaffType:[''],
      AvailabilityDetails: new FormGroup({
        title: new FormControl(''),
        start: new FormControl(this.startDatetime),
        end:new FormControl(this.endDatetime),
        date:new FormControl(false)
        // stack: new FormControl(''),
        // experience: new FormControl(this.startDatetime)
      }),

      
    })
  }
  
  avl:Availability;// = 
  

  DoctorNameAvailData:string="";
 unqueID:string="";
 evenRows=[];
 row = [
  {
    "title": "zxczx",
    "date": "2020-12-24",
        "start": "2020-12-09T10:30:00",
        "end": "2020-12-09T11:30:00"
  },
  {
    "title": "abcd",
    
        "start": "2020-12-09T10:30:00",
        "end": "2020-12-09T11:30:00"
  }
];
deleteRow(x){
  var delBtn = confirm(" Do you want to delete ?");
  if ( delBtn == true ) {
    this.avl.PesronAvailability.splice(x, 1 );
    //this.row.splice(x, 1 );
  }   
} 
// calendarOptions: CalendarOptions;
//  referralChangeAction(doctorNameAvailData) {
//   //this.avl;
//   this.avl = null;
//    this.unqueID = "";
//    this.DoctorNameAvailData = doctorNameAvailData;
//    this.doctorNameModel = doctorNameAvailData;
//    this.evs(doctorNameAvailData);
//    //alert(abcd);
//    this.availabilityService.getByAvlName(doctorNameAvailData).subscribe((data: Availability) => {
//     //console.log('avl data'+ data);
//     if(data!= null)
//     {
//     this.avl = data;// //data.reduce((a,b)=> (a[b]='',a),{});
//     this.evenRows = data.PesronAvailability;
    
//     }

//     setTimeout(() => {
//       this.calendarOptions =  {
//         // initialView: 'timeGridWeek',
//          //dateClick: this.handleDateClick.bind(this), // bind is important!
//         //  events: [ //yyyy-MM-dd
//         //   { title: 'event 1', date: '2020-11-11' },
//         //   { title: 'event 2', date: '2020-11-02' }
//         // ],
//         // plugins:[dayGridPlugin, timeGrigPlugin, interactionPlugin],
//         // headerToolbar:{
//         //   left: 'prev,next today',
//         //   center: 'title',
//         //   right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
//         //   }
//         editable: true,
//         height: 300,
//         //showNonCurrentDates: false,
//         validRange: {
//           start: new Date(),
//         },
//         events:this.timeSlotResult,
//          // events: [],
//           customButtons: {
//             myCustomButton: {
//               text: 'custom!',
//               click: function() {
//                 //alert('clicked the custom button!');
//               }
//             }
//           },
//           dateClick: this.handleDateClick.bind(this),
//           plugins:[dayGridPlugin, timeGrigPlugin, interactionPlugin],
//           headerToolbar: {
//             left: 'prev,next today myCustomButton',
//             center: 'title',
//             right: 'dayGridMonth,timeGridWeek,timeGridDay'
//           },
        
//       };
//     }, 1000);

//   })

  
//   //this.filteredBooks = this.referralMaster.filter(val => val.FirstName == this.addrFrom.controls['doctorname'].value);


// }
pp:any;
//FullDayDBValueFormat
 showInnerData(){
   //alert(this.addrFrom.get('AvailabilityDetails'));
   this.pp=this.addrFrom.get('AvailabilityDetails').value;
   //alert('1.'+this.addrFrom.get('AvailabilityDetails.date').value);
  //  alert('2.'+this.addrFrom.controls['AvailabilityDetails'].value.stack);
  //  alert('3.'+this.addrFrom.get(['AvailabilityDetails','stack']).value);
   //this.avl.PesronAvailability.push(this.pp);
   let k:any = {title:this.addrFrom.get('AvailabilityDetails.title').value,start:this.addrFrom.get('AvailabilityDetails.start').value,end:this.addrFrom.get('AvailabilityDetails.end').value};
   let m:any = {title:this.addrFrom.get('AvailabilityDetails.title').value,date:this.FullDayDBValueFormat};
   let filteredBooks:any ={};
   if( this.avl== null)
   {
    filteredBooks = {};
    filteredBooks.PesronAvailability=[];
   }
   else{
    filteredBooks = this.avl;
    
   }
   if(this.addrFrom.get('AvailabilityDetails.title').value.trim() == "")
   {}
   else
   {

   if(this.addrFrom.get('AvailabilityDetails.date').value === true)
   {
    filteredBooks.PesronAvailability.push(m);
   }
   else
   {
    filteredBooks.PesronAvailability.push(k);
   }
  }
   this.CreateAvailablity(new Availability(),filteredBooks);
   this.isHidden = false;
 }
 CreateAvailablity(student: Availability, filteredBooks:Availability) {

  //this.patientBody = this.addrFrom.value;
  student.Name = this.DoctorNameAvailData ;
  student.PesronAvailability= filteredBooks.PesronAvailability;
  // student.ReferralMaster.FirstName = this.addrFrom.get('doctorname').value;
  // student.ReferralMaster.appointment = this.datePipe.transform(this.addrFrom.get('appointment').value, 'dd-MM-yyyy');
  this.employeeIdUpdate = 'AVL'; // hardcoded to save always. Edit is not available now
  if (filteredBooks.UnqueID==null || filteredBooks.UnqueID== "") {

    this.availabilityService.createStudent(student).subscribe(
      (test) => {
        //this.dataSaved = true;
        //this.massage = 'Record saved Successfully';
       // this.BillID = test.UnqueID;
        // alert(test.UnqueID);
        alert('Availability created Successfully.');
        
      });
  } else {
    this.availabilityService.update(filteredBooks.UnqueID, student).subscribe(
      (test) => {
        //this.dataSaved = true;
        //this.massage = 'Record saved Successfully';
       // this.BillID = test.UnqueID;
        // alert(test.UnqueID);
        alert('Availability updated Successfully.');
        
      });
    
  }
}
 
disabled:boolean=true;
timeColor:string="black";
onCheckboxChange(e) {
  //const website: FormArray = this.form.get('website') as FormArray;

  if (e.checked) {
    //alert('checked');
    this.addrFrom.get('AvailabilityDetails.start').disable();
    this.addrFrom.get('AvailabilityDetails.end').disable();
    this.timeColor = "lightgrey";
  } else {
    //alert('not checked');
    this.addrFrom.get('AvailabilityDetails.start').enable();
    this.addrFrom.get('AvailabilityDetails.end').enable();
    this.timeColor = "black";
  }
}
filterValDoctorSearch:string='';
 LoadAllDoctor() {
  this.referralMasterService.getAllStaffType().subscribe((data: ReferralMaster[]) => {
    //console.log(data);
    this.referralMaster = data;

    this.dataSource = new MatTableDataSource(this.referralMaster);  
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.filterValDoctorSearch = '';

  })
}

applyFilter(filterValue: string) {
  filterValue = filterValue.trim(); // Remove whitespace
  filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  this.dataSource.filter = filterValue;
}
  get writer() {
    return this.addrFrom.get('Department');
  }
  selected:any;
  doctorNameModel:string="";
  DoctorDesc:string="N/A";
  DoctorDeptName:string="";
  onDoctorDescChange(ob) {
    console.log('Book changed...');
    //let x = foo?.bar.baz();
    //alert(ob.value?.name);
    this.DoctorDeptName = ob.value;//?.name;
    //this.DoctorDesc = ob.value?.desc;
    //alert(selectedBook);
    let p= this.constDoctorDepartment.find(x=>x.name==this.DoctorDeptName );
    this.DoctorDesc = p.desc;
  }

  CancelDoctorPage(){
    this.employeeIdUpdate='AVL';
    this.btnTest = "Add ";
    this.router.navigate(['AppointmentDashboard']);
  }
  employeeIdUpdate:string;
  btnTest:string = "Add "; 

  // isShow: boolean;
  // topPosToStartShowing = 10;

  // @HostListener('window:scroll')
  // checkScroll() {
      
  //   // window의 scroll top
  //   // Both window.pageYOffset and document.documentElement.scrollTop returns the same result in all the cases. window.pageYOffset is not supported below IE 9.

  //   const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

  //   console.log('[scroll]', scrollPosition);
    
  //   if (scrollPosition >= this.topPosToStartShowing) {
  //     this.isShow = true;
  //   } else {
  //     this.isShow = false;
  //   }
  // }

  // gotoTop() {
  //   window.scroll({ 
  //     top: 0, 
  //     left: 0, 
  //     behavior: 'smooth' 
  //   });
  // }
  
  UpdateForm(aa,bb:any){
    this.addrFrom.patchValue(bb
      //json: this.data.data[this.selectedId].conditionals
     );
     this.employeeIdUpdate= bb.UnqueID;
     this.btnTest = "Update ";
     window.scrollTo(0, 0);
    //  window.scroll({
    //   top: 0, 
    //   left: 0, 
    //   behavior: 'smooth' 
    //  });
     //document.body.scrollTop = document.documentElement.scrollTop = 0;
     //this.addrFrom.get('Department').setValue('Anesthesiologists');
     //this.addrFrom.patchValue({Department: 'Anesthesiologists'}); 
     var elmnt = document.getElementById("editContent");
      elmnt.scrollIntoView();
  }
  DeleteForm(aa,bb:any){
    this.addrFrom.patchValue(bb);
     this.employeeIdUpdate= bb.UnqueID;
     
     if (confirm("Are you sure you want to delete this ?")) {
      //employeeId = "229";
      this.refaralService.delete(this.employeeIdUpdate).subscribe(() => {
        // this.dataSaved = true;
        // this.massage = 'Record Deleted Succefully';
        //this.loadAllEmployees();
        this.employeeIdUpdate = 'AVL';
        this.addrFrom.reset();
        this.LoadAllDoctor();

      });
    }
  }

  AddDoctor(){
    if(this.addrFrom.valid)
    {
      this.CreateStudent(this.addrFrom.value);
     }
    else
    {
      alert('Please provide the required data.');
    }

  }
  //employeeIdUpdate:string='AVL'
  CreateStudent(student: ReferralMaster) {
    if (this.employeeIdUpdate == undefined || this.employeeIdUpdate == 'AVL') {
     
      student.Department = this.DoctorDeptName;
      student.doctorname = student.FirstName;
      student.DoctorName = student.FirstName;
      student.Status = true;
      this.refaralService.createStudent(student).subscribe(
        () => {
          //this.dataSaved = true;
          //this.massage = 'Record saved Successfully';
          alert('Doctor saved Successfully.');
          //this.router.navigate(['AppointmentDashboard']);
          //this.loadAllEmployees();
          //this.employeeIdUpdate = null;
          //this.formGroup.reset();
          this.addrFrom.reset();
        this.LoadAllDoctor();
        });
    } else {
      // employee.EmpId = this.row.id;
      // student.UnqueID = this.data.row.UnqueID;
      // var id= this.employeeIdUpdate;
      var p = this.employeeIdUpdate; //student.UnqueID;
      this.refaralService.update(p,student).subscribe(() => {
        // this.dataSaved = true;
        // this.massage = 'Record Updated Successfully';
        //this.loadAllEmployees();
        alert('Doctor data updated Successfully.');
        this.employeeIdUpdate = 'AVL';
        this.btnTest = "Add";
        this.addrFrom.reset();
        this.LoadAllDoctor();
        //this.formGroup.reset();
      });
    }
  }

  //options: OptionsInput;
  eventsModel: any;
  evs(doctorName:string) {
    this.timeSlotResult=[];
    
    this.availabilityService.getByAvlName(doctorName).subscribe((data: Availability) => {
     // console.log('avl data'+ data);
      
      if(data!= null)
      {
        //const availDoctor:DoctorAvail[] = DoctorAvailabilityCalander;
      //   let filteredBooks = data.filter(val => val.Name == doctorName);
      //alert('hi')
      this.timeSlotResult = data.PesronAvailability;
      // alert(JSON.stringify(this.timeSlotResult));
      // console.log( this.timeSlotResult);

      //  kk = filteredBooks;
      //p= data
      
      }
      
  
    });
   // alert(JSON.stringify(this.kk));
    //alert(JSON.stringify(this.timeSlotResult));
    //return p;
   
  }
  //@ViewChild('fullcalendar',{static:true}) fullcalendar: CalendarComponent;
  timeSlotResult:Timeslot[]=[];
  // calendarOptions: CalendarOptions = {
  //   // initialView: 'timeGridWeek',
  //    //dateClick: this.handleDateClick.bind(this), // bind is important!
  //   //  events: [ //yyyy-MM-dd
  //   //   { title: 'event 1', date: '2020-11-11' },
  //   //   { title: 'event 2', date: '2020-11-02' }
  //   // ],
  //   // plugins:[dayGridPlugin, timeGrigPlugin, interactionPlugin],
  //   // headerToolbar:{
  //   //   left: 'prev,next today',
  //   //   center: 'title',
  //   //   right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
  //   //   }
  //   editable: true,
  //   //showNonCurrentDates: false,
  //   validRange: {
  //     start: new Date(),
  //   },
  //   events:this.timeSlotResult,
  //    // events: [],
  //     customButtons: {
  //       myCustomButton: {
  //         text: 'custom!',
  //         click: function() {
  //           //alert('clicked the custom button!');
  //         }
  //       }
  //     },
  //     dateClick: this.handleDateClick.bind(this),
  //     plugins:[dayGridPlugin, timeGrigPlugin, interactionPlugin],
  //     headerToolbar: {
  //       left: 'prev,next today myCustomButton',
  //       center: 'title',
  //       right: 'dayGridMonth,timeGridWeek,timeGridDay'
  //     },
    
  // };

  eventClick(model) {
    console.log(model);
  }
  eventDragStop(model) {
    //console.log(model);
  }

  isHidden:boolean= false;
  dateClick(model) {
   // console.log(model);
    this.isHidden = true;
  }
  updateEvents() {
    this.eventsModel = [{
      title: 'Updaten Event',
      start: this.yearMonth + '-08',
      end: this.yearMonth + '-10'
    }];
  }
  get yearMonth(): string {
    const dateObj = new Date();
    return dateObj.getUTCFullYear() + '-' + (dateObj.getUTCMonth() + 1);
  }

  // evs():any{
  //   [ //yyyy-MM-dd
  //     { title: 'Available', date: '2020-11-11' },
  //     { title: 'Available', date: '2020-11-04' },
  //     { title: 'Available(L)', date: '2020-11-05' }
  //   ]

  // }
  // calendarEvents: EventInput[] = [];
  // calendarApi: Calendar; 
  initialized = false;
  // loadEvents() {
  //   const event = {
  //     title: 'test',
  //     start: Date.now(),
  //     allDay: true
  //   };
  //   this.calendarEvents.push(event);
  //         this.calendarApi.removeAllEventSources(); 
  //     this.calendarApi.addEventSource(this.calendarEvents); 
  // }
  //isHidden: boolean = false;
  startDatetime:string = "2020-12-09T10:30:00";
  endDatetime:string = "2020-12-09T11:30:00";
  dateSelected:string;
  FullDayDBValueFormat:string;
  handleDateClick(arg) {
    if(this.DoctorNameAvailData == undefined && this.DoctorNameAvailData == ""){
      alert('Please select a doctor for which you want to schedule the availability.');
    }
    else{
    //alert('date click! ' + arg.dateStr)
    var datePipe = new DatePipe('en-US');
    this.dateSelected =datePipe.transform(arg.dateStr, 'dd/MM/yyyy');;
    this.FullDayDBValueFormat =arg.dateStr;
    this.isHidden= true;
    //this.referralChangeAction(this.DoctorNameAvailData);
    }
    
  }
  getUnit(sportKey: string): string {
    var datePipe = new DatePipe('en-US');
    //this.dateSelected =datePipe.transform(arg.dateStr, 'dd/MM/yyyy');;
    return (sportKey === undefined || sportKey === '')  ? '' : datePipe.transform(sportKey, 'dd/MM/yyyy')+' (FullDay Available)';
 }
 getUnitStarEnd(sportKey: string,srartEnd:string): string {
  return (sportKey === undefined|| sportKey === null || sportKey === '')  ? srartEnd : ' XXXXXXXX';
}
 
  closeEventSetting() {
    this.isHidden = false;
  }

  onSubmit(){

  }
  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
