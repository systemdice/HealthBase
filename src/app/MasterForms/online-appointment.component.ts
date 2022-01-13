import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RefaralService } from '../Services/referal.service';
import { ReferralMaster, AppointmentDetail, Availability, Timeslot, Availability1 } from '../models/UserData';
import { AppointmentDetailService } from '../Services/appointment-detail.service';
import { GenericInformations } from '../models/AllConstansts';
import { PataientDetailMainComponent } from '../pataient-detail-main.component';
@Component({
  selector: 'online-appointment',
  templateUrl: './online-appointment.component.html',
  styleUrls: ['./online-appointment.component.css']
})
export class OnlineAppointmentComponent implements OnInit {
  name = 'Angular';
  states: Array<String> = ['AR', 'AL', 'CA', 'DC'];
  fruits: Array<String> = ['Mango', 'Grapes', 'Strawberry', 'Oranges'];
  favFruitsError: Boolean = true;
  selectedFruitValues = [];
  addrFrom: FormGroup;
  @Input() PatientComponent: boolean;
  startTime: string = "";
  endTime: string = "";
  cities: string[] = [];
  referralMaster: ReferralMaster[] = [];
  value = 'someValue12340987';
  loading: false;
  lineColor: "red";
  @ViewChild('child') child: PataientDetailMainComponent;
  //@ViewChild(PataientDetailMainComponent) pataientDetailMainComponent1;
  // get values(): string[] {
  //   this.value=  (this.addrFrom.get("home") as FormArray).get("FirstName").value;
  //   return this.value.split('\n');
  // }
  // get Qrvalues() {
  //   return (this.addrFrom.get("home") as FormArray).get("FirstName").value;

  // }

  SavePP() {
    //this.pataientDetailMainComponent1.SavePatientDetails();
  }

  constructor(private _fb: FormBuilder, private datePipe: DatePipe, public referralMasterService: RefaralService
    , public appointmentDetailService: AppointmentDetailService) { }
  ngAfterViewInit() {
    // child is set
    //this.child.doSomething();
  }
  ngOnInit() {
    //this.child.doSomething();
    this.showAppointmentID = false;
    this.createForm();
    //this.child?.onSubmitExplict();
    //console.log('final FormGroup is ', this.addrFrom.value)
    //this.printDIV();

    // var dt = new Date();


    // this.startTime = this.datePipe.transform(dt, "yyyy-MM-dd")
    //   + 'T' + this.datePipe.transform(dt, "hh:mm:ss");



    // this.endTime = this.datePipe.transform(dt, "yyyy-MM-dd")
    //   + 'T' + this.datePipe.transform(dt.setMinutes(dt.getMinutes() + 60), "hh:mm:ss");

    //this.updateEvents1();
    this.LoadAllDoctor();
  }
  LoadAllDoctor() {
    // this.referralMasterService.getAll().subscribe((data: ReferralMaster[]) => {
    //   //console.log(data);
    //   this.referralMaster = data;

    // });
  }
  objArray: AppointmentDetail[] = [];
  result1: any[];
  result2: any[];
  result3: any[];
  groupedData: any = [];
  AppointmentDetail: AppointmentDetail[] = [];
  repeatBooking: boolean = false;
  LoadAppointmentDetail() {
    let appDate = this.addrFrom.get('appointment').value;
    //alert(appDate);
    //console.log('dt' + appDate);
    let dateStr = appDate;
    //console.log(new Date(dateStr).toISOString())
    //student.ReferralMaster.appointment = this.datePipe.transform(this.addrFrom.get('appointment').value, 'dd-MM-yyyy');
    this.appointmentDetailService.getByDateStart(this.datePipe.transform(this.addrFrom.get('appointment').value, 'dd-MM-yyyy')).subscribe((data: AppointmentDetail[]) => {
      //console.log('dt' + appDate);
      this.AppointmentDetail = data;
      this.objArray = data;
      let jj = this.datePipe.transform(this.addrFrom.get('appointment').value, 'dd-MM-yyyy');
      let mobNumber = this.addrFrom.get("home").get('ContactNumber').value;
      let relationship = this.addrFrom.get("home").get('Relationship').value;
      //alert(mobNumber);
      //   let k = this.AppointmentDetail.find(item => {
      //     return item.ReferralMaster.appointment == jj && item.PatientDetails.ContactNumber ==mobNumber
      //  });
      let k = this.AppointmentDetail.find(item => item.PatientDetails.ContactNumber == mobNumber && item.ReferralMaster.appointment == jj && item.PatientDetails.Relationship == relationship);
      if (k == undefined) {
        this.repeatBooking = false;
        if (confirm("Are you sure to create the appointment?")) {

          setTimeout(() => {
            this.CreateStudent(new AppointmentDetail());
            //this.router.navigate(['AppointmentDashboard']);
          }, 2000);
        }
        else {
          console.log("not implemented here");
        }
        
      }
      else {
        this.repeatBooking = true;
        alert('You can not have two appointment in one day.');
      }

      //console.log('dtdata' + data);
      // this.result = this.objArray.map(a => a.ReferralMaster.time);
      // this.result1 = this.objArray.map(a => a.ReferralMaster);

      // this.result2 = this.result1.reduce(function (r, a) {
      //   r[a.doctorname] = r[a.doctorname] || [];
      //   r[a.doctorname].push(a);
      //   return r;
      // }, Object.create(null));
    });

    //this.result3 = Object.entries(this.result2);


    //let json = [{ "User": "Tom Smith", "Hours": 6 }, { "User": "Mark Zuckerberg", "Hours": 8 }, { "User": "Elon Musk", "Hours": 12 }, { "User": "Tom Smith", "Hours": 1 }, { "User": "Tom Smith", "Hours": 1 }];

  }



  onSubmit(value): void {

    if (this.addrFrom.get("home").valid) {
      //alert(this.addrFrom.get("home").valid)
    }
    else {
      //alert(this.addrFrom.get("home").valid)
    }

    // if(confirm("Are you sure to create appointment "+vv)) {
    //   console.log("Implement delete functionality here");
    // }
    // else
    // {
    //   console.log("not implemented here");
    // }
    //alert('you submitted value: '+ value.valid);  
  }




  filteredBooks: ReferralMaster[];
  objfilteredBooks: ReferralMaster;
  //calendarOptions: CalendarOptions;
  todayDate: Date = new Date();
  referralChangeAction() {


    this.filteredBooks = this.referralMaster.filter(val => val.FirstName == this.addrFrom.controls['doctorname'].value);

    this.objfilteredBooks = this.referralMaster.find(val => val.FirstName == this.addrFrom.get('doctorname').value);
    //alert(JSON.stringify(this.filteredBooks) );
    this.addrFrom.controls['fees'].setValue(this.filteredBooks[0].fees);
    //this.addrFrom.controls['discount'].setValue(this.filteredBooks[0].Discount);
    this.addrFrom.controls['discount'].setValue(this.objfilteredBooks.Discount);
    this.addrFrom.controls['department'].setValue(this.objfilteredBooks.Department);
    this.addrFrom.controls['ContactNumber'].setValue(this.objfilteredBooks.ContactNumber);
    this.addrFrom.controls['doctorname'].setValue(this.objfilteredBooks.FirstName);
    this.evs(this.objfilteredBooks.FirstName);
    //this.addrFrom.controls['LastName'].setValue(this.objfilteredBooks.LastName);



  }


  submit1() {

    const body = this.addrFrom.value;
    body.appointment = this.datePipe.transform(body.appointment, 'dd-MM-yyyy');  // You can provide any date format on the 2nd parameter

  }

  updateAppointmentDate(value: any) {
    //alert(JSON.stringify(value));
    //console.log(value);
    //alert(value);

    var year = value.getFullYear();
    var mes = value.getMonth() + 1;
    var dia = value.getDate();
    var fecha = dia + "-" + mes + "-" + year;
    this.addrFrom.get('appointment').setValue(fecha);
  }

  createForm() {
    this.addrFrom = this._fb.group({
      //name: 'Haider',
      address1: [GenericInformations.address1],
      address2: [GenericInformations.address2],
      address3: [GenericInformations.address3],
      doctorname: ['online'],
      department: ['online'],
      appointment: [new Date()],
      time: ['13:30'],
      fees: [0],
      discount: [0],
      hospitalname: [GenericInformations.hospitalname],
      counternumber: ['ONLINE'],
      paymentmode: [''],
      ContactNumber: [''],
      AppointmentStatus : [''],
      AppointmentCharge : [''],
      AppointmentPaymentMode : [''],
      AppointmentPaymentStatus : [''],
      home: this._fb.group({
        UnqueID: [],
        Title: ['Mr.'],
        UserName: [''],
        FirstName: ['', [Validators.required]],
        LastName: [''],
        Year: ['0'],
        Month: ['0',[Validators.minLength(2), Validators.maxLength(2)]],
        Days: ['0'],

        Gender: ['1'],
        Email: [''],
        ContactNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        Address: [''],
        Status: ['true'],
        DOB: [new Date(), [Validators.required]],
        Relationship: ['Self'],
        Pregnancy:['No'],
        PermananetAddress :[''],
        OfficeAddress :[''],
        MaritalStatus :[''],
        CO :[''],
        Religion :[''],
        Occupation :[''],
        BloodGroup :[''],
        AssignedPharma :[''],
        AssignedDept :[''],
        Allergy :[''],
        Height :[''],
        Weight :[''],
        Temperature:[''],
        RespiratoryRate:[''],
        RhType:[''],
        BPReading:[''],
        FatherName: [''],
        MotherName: [''],
        AdvPayment:['0'],
      }),

    })
  }

  // Getter method to access formcontrols
  get fees() {
    return this.addrFrom.get('fees');
  }

  //options: OptionsInput;
  eventsModel: any;


  isHidden: boolean = false;
  handleDateClick(arg) {
    this.isHidden = false;
  }

  updateEvents1() {
    const nowDate = new Date();
    const yearMonth = nowDate.getUTCFullYear() + '-' + (nowDate.getUTCMonth() + 1);

  }

  handleEventClick(arg) {
    // console.log(arg);
    // console.log(arg._def);
  }

  handleEventDragStop(arg) {
    //console.log(arg);
  }

  closeEventSetting() {
    this.isHidden = false;
  }

  openEventSettingDialog(dt: string) {
    // const dialogRef = this.dialog.open(DialogBoxPatientComponent, {
    //   width: '600px',
    //   //data: {dialogTitle: action, dialogText: obj}
    //   data: { dt }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   //this.LoadAllTestInvestigations();       
    // });
  }

  eventClick(model) {
    //console.log(model);
  }
  eventDragStop(model) {
    //console.log(model);
  }
  dateClick(model) {
    //console.log(model);
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

  kk: Availability = {
    "UnqueID": "96",
    "Name": "",
    "PesronAvailability": []
  };
  timeSlotResult: Timeslot[] = [];
  evs(dc: string) {

  }
  // evs(doctorName:string) {
  //   this.timeSlotResult=[];
  //   //kk[0].PesronAvailability=[];

  //   //let p:Timeslot[]=[];

  //   this.availabilityService.getByAvlName(doctorName).subscribe((data: Availability) => {
  //    // console.log('avl data'+ data);

  //     if(data!= null)
  //     {
  //       //const availDoctor:DoctorAvail[] = DoctorAvailabilityCalander;
  //     //   let filteredBooks = data.filter(val => val.Name == doctorName);
  //     this.timeSlotResult = data.PesronAvailability;

  //     //  kk = filteredBooks;
  //     //p= data

  //     }


  //   });
  //  // alert(JSON.stringify(this.kk));
  //   //alert(JSON.stringify(this.timeSlotResult));
  //   //return p;

  // }
  initialized = false;
  loadEvents() {
    const event = {
      title: 'test',
      start: Date.now(),
      allDay: true
    };

  }

  btnClick() {
    this.LoadAppointmentDetail();

  }


  result: any[];
  redirecttodoctor() {
    //this.router.navigate(['/ReffersDetails']);
  }

  CreateTheAppointmnet() {

    let appDate = this.addrFrom.get('appointment').value;
    //alert(appDate);
    //alert('time is '+ appDate);
    if (appDate == '') {

      alert('Please select an appointment Date.');
      //return;
    }
    else {
      if (this.addrFrom.valid) {
        this.btnClick();    

      }
      else {
        if (this.addrFrom.get("home").valid) {
          //alert(this.addrFrom.get("home").valid);
        }
        else {
          //this.child?.onSubmitExplict();
          //alert(this.addrFrom.get("home").valid);
          alert('Please provide required data from patient like FistName, contact number, DOB etc.');

        }
      }
    }

  }

  valueChanged() {
    let appDate = this.addrFrom.get('appointment').value;
    //alert(appDate);
    this.LoadAppointmentDetail();
  }

  findMatch: boolean = false;
  findTimeConflict(): boolean {

    let str = this.addrFrom.get('time').value;
    //alert(str);   
    let pv = false;
    this.result.forEach(event => {
      //alert('loop1')
      let td = this.getTimeDifference(str, event);
      var splitted = td.split(":");
      let tm1 = parseInt(splitted[0]) * 60 + parseInt(splitted[1]);
      if (tm1 <= 15) {
        var minutesToAdd = 15;
        var currentDate = new Date();
        var futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000);
        this.findMatch = true;
        pv = true;
        //alert(futureDate.getHours() + ":" + futureDate.getMinutes());
        //alert('This time aleady booked, You can get one appointment after 30 minutes from now or next.');
        //return false;
      }

    });
    if (this.findMatch == true) {
      this.findMatch = false;
      alert('This time aleady booked, You can get one appointment after 30 minutes from now or next.');
    }

    //   alert(this.getTimeDifference('21:58', '22:01'));
    //   let p= this.getTimeDifference('21:58', '22:2');
    // //var str = p; 
    // var splitted = p.split(":"); 
    // alert(splitted[0]);
    // alert(splitted[1]);

    // //if(parseInt(splitted[1]) < 15) 
    // alert((parseInt(splitted[1]) < 15));
    return pv;

  }

  // Convert hh:mm[am/pm] to minutes
  timeStringToMins(s) {
    s = s.split(':');
    s[0] = /m$/i.test(s[1]) && s[0] == 12 ? 0 : s[0];
    return s[0] * 60 + parseInt(s[1]) + (/pm$/i.test(s[1]) ? 720 : 0);
  }

  // Return difference between two times in hh:mm[am/pm] format as hh:mm
  getTimeDifference(t0, t1) {

    // Small helper function to padd single digits
    function z(n) { return (n < 10 ? '0' : '') + n; }

    // Get difference in minutes
    var diff = this.timeStringToMins(t1) - this.timeStringToMins(t0);

    // Format difference as hh:mm and return
    return z(diff / 60 | 0) + ':' + z(diff % 60);
  }


  date1: any;
  openDialog(formValue: any) {

    //body.ID = this.BillID;
    //body.appointment   = this.datePipe.transform(body.appointment, 'dd-MM-yyyy');  // You can provide any date format on the 2nd parameter

    // const body =this.patientBody; // this.addrFrom.value;
    // let user: print = this.addrFrom.value;
    // const dialogRef = this.dialog.open(PrintPatientAppointmentComponent, {
    //   width: '100vw', height: '100vh',
    //   data: { "doctorname": body, "pp": body, "BillID": this.BillID }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   //this.animal = result;
    // });
  }

  employeeIdUpdate: string;
  BillID: string;
  patientBody: any;
  showAppointmentID: boolean = false;
  patientBodySecondway: any;
  CreateStudent(student: AppointmentDetail) {

    if (true) {
      this.addrFrom.get('AppointmentStatus').patchValue('Waiting');
      this.addrFrom.get('AppointmentCharge').patchValue('0');
      this.addrFrom.get('AppointmentPaymentMode').patchValue('NA');
      this.addrFrom.get('AppointmentPaymentStatus').patchValue('NA');
      this.patientBody = this.addrFrom.value;
      this.patientBodySecondway = this.addrFrom.value.home
      student.PatientDetails = this.addrFrom.value.home;
      student.ReferralMaster = this.addrFrom.value;
      student.AppointmentStatus=this.addrFrom.get('AppointmentStatus').value;
      student.AppointmentCharge =this.addrFrom.get('AppointmentStatus').value;
      student.AppointmentPaymentMode =this.addrFrom.get('AppointmentPaymentMode').value;
      student.AppointmentPaymentStatus =this.addrFrom.get('AppointmentPaymentStatus').value;
      student.ReferralMaster.FirstName = this.addrFrom.get('doctorname').value;
      
      student.ReferralMaster.appointment = this.datePipe.transform(this.addrFrom.get('appointment').value, 'dd-MM-yyyy');
      this.employeeIdUpdate = 'AVL'; // hardcoded to save always. Edit is not available now
      if (this.employeeIdUpdate == 'AVL') {

        this.appointmentDetailService.createStudent(student).subscribe(
          (test) => {
            //this.dataSaved = true;
            //this.massage = 'Record saved Successfully';
            this.BillID = test.UnqueID;
            // alert(test.UnqueID);
            //alert('Appointment created Successfully. Your appointmrnt ID is:'+test.UnqueID);
            this.child.SavePatientDetails(this.BillID);
            this.showAppointmentID = true;
            //this.loadAllEmployees();
            //this.employeeIdUpdate = null;
            //this.formGroup.reset();
          });
      } else {
        //employee.EmpId = this.row.id;
        //student.UnqueID = this.data.row.UnqueID;
        // var id = this.employeeIdUpdate;
        // var p = student.UnqueID;
        // this.testsCategoryService.update(id, student).subscribe(() => {
        //   // this.dataSaved = true;
        //   // this.massage = 'Record Updated Successfully';
        //   //this.loadAllEmployees();
        //   alert('Student data updated Successfully');
        //   this.employeeIdUpdate = null;
        //   this.formGroup.reset();
        // });
      }
    }
  }


  public cardList: CardInterface[] = [];

  printDIV() {
    for (let i = 1; i <= 1; i++) {
      this.cardList.push({
        imgSrc: 'http://via.placeholder.com/300',
        title: 'Card No. ' + i,
        description:
          'Angular Flex Layout provides a sophisticated layout API using FlexBox CSS + mediaQuery.\
          This module provides Angular developers with component layout features using a custom Layout API, \
          mediaQuery observables, and injected DOM flexbox-2016 css stylings.'
      });
    }
  }

}

export interface CardInterface {
  imgSrc: string;
  title: string;
  description: string;
}