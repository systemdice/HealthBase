import { A } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent, MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { NewModifyCase, PatientDetails, ReferralMaster } from './models/UserData';
import { DialogBoxPatientComponent } from './Popups/dialog-box-patient.component';
import { AddModifyCaseService } from './Services/add-modify-case.service';
import { PatientDetailsService } from './Services/patient-details.service';
import { RefaralService } from './Services/referal.service';

@Component({
  selector: 'app-pataient-detail-main',
  templateUrl: './pataient-detail-main.component.html',
  styleUrls: ['./pataient-detail-main.component.css']
})
export class PataientDetailMainComponent implements OnInit {
  @Input() home: FormGroup;
  @Input() caseType: string;
  @Input() usrName: string;
  @Input() diectOnline: string;
  @Input() passOPDkimbaIPD:string;
  @Input() allStaffParm:ReferralMaster[];
  private eventsSubscription: Subscription;

@Input() events: Observable<string>;
  Pregnancy: string;
  cities = ['Mr.', 'Mrs.', 'Smt', 'Shree'];
  relationships = ['Self', 'Father', 'Mother', 'Spouse', 'Children1', 'Children2', 'Children3'];
  selected = 'Mr.';
  selectedRelationship = 'Self';
  constructor(public dialog: MatDialog, public patientDetailsService: PatientDetailsService, 
    private route: ActivatedRoute,public referralMasterService: RefaralService, private addModifyCaseService: AddModifyCaseService) {
    this.tomorrow.setDate(this.tomorrow.getDate());
    //this.patientName='tapu';
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  limitKeypress(event, value, maxLength) {
    if (value != undefined && value.toString().length >= maxLength) {
      event.preventDefault();
    }
  }

 // Only Integer Numbers
 keyPressNumbers(event) {
  var charCode = (event.which) ? event.which : event.keyCode;
  // Only Numbers 0-9
  if ((charCode < 48 || charCode > 57)) {
    event.preventDefault();
    return false;
  } else {
    return true;
  }
}
  patientDetails: PatientDetails[] = [];

  onSubmit(value): void {
    if (this.home.valid) {
      alert('Validation successful');
      //this.SavePatientDetails();
    }
    else {
      alert('Please enter valid data.');
    }
  }
  onSubmitExplict(): void {
    if (this.home.valid) {
      alert('Validation successful');
      //this.SavePatientDetails();
    }
    else {
      alert('Please enter valid data.');
    }
  }
  referralMaster: ReferralMaster[] = [];
  LoadAllDoctor() {
    this.referralMaster = this.allStaffParm?.filter(x=> x.StaffType == 'Doctor');
    // this.referralMasterService.getAll().subscribe((data: ReferralMaster[]) => {
    //   //console.log(data);
    //   this.referralMaster = data;

    // })
  }

  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['allStaffParm']) {
      this.referralMaster = this.allStaffParm.filter(x=> x.StaffType == 'Doctor');
      this.pharmaMaster = this.allStaffParm.filter(x=> x.StaffType == 'Pharma');
    }
}

  pharmaMaster: ReferralMaster[] = [];
  LoadAllPharma() {
    this.pharmaMaster = this.allStaffParm?.filter(x=> x.StaffType == 'Pharma');
    // this.referralMasterService.getAllStaffType().subscribe((data: ReferralMaster[]) => {
    //   //console.log(data);
    //   this.pharmaMaster = data.filter(a=>a.StaffType == 'Pharma');

    // })
  }

  onStatusChange(ob) {
    //console.log('Book changed...');
    let selectedBook = ob.value;
    var dept = this.referralMaster.find(a=>a.FirstName == ob.value)
    // alert(ob.value);
    // alert(dept.Department);
    this.home.get('AssignedDept').patchValue(dept.Department);
    //console.log(selectedBook);
  }

  assignDept:string[] = [
    'Orthopaedics',
    'ENT',
    'Ophthalmology',
    'Dental',
    'Emergency with or without ICU',
    'Anaesthesia',
    'Psychiatry',
    'Skin Pulmonary Medicine',
    'Rehabilitation',
    'paediatric'];

  onFocusOutEventContactNumber() {
    if(this.caseType == 'Addnew' || this.caseType == 'Add'|| this.caseType == ''){
    if (this.home.get('FirstName').value !== '' && this.home.get('ContactNumber').value !== '') {
    var datFound = this.patientDetails.find(a=>a.FirstName == this.home.get('FirstName').value && a.ContactNumber == this.home.get('ContactNumber').value);
    if(datFound != undefined){
      alert('This User is lareday exist. Please provide different user name or Phone number.');
      this.home.get('ContactNumber').patchValue('');
    }
  }
}
    // if (this.home.get('FirstName').value !== '' && this.home.get('ContactNumber').value !== '') {
    //   this.patientDetailsService.getUniquePatient(this.home.get('FirstName').value, event.target.value).subscribe(data => {
    //     if (data == false) {
    //       alert('This User is lareday exist. Please provide different user name or Phone number.');
    //       this.home.get('ContactNumber').patchValue('');
    //       //return;
    //     }
    //     // else{
    //     //   alert('new user phone');
    //     // }
    //   })
    //   //this.home.get('Year').patchValue('0');
    // }

    //alert(event.target.value);
 
 }

 onFocusOutEventName(event: any) {
  if(this.caseType == 'Addnew' || this.caseType == 'Add'|| this.caseType == ''){
    if (this.home.get('FirstName').value !== '' && this.home.get('ContactNumber').value !== '') {
    var datFound = this.patientDetails.find(a=>a.FirstName == this.home.get('FirstName').value && a.ContactNumber == this.home.get('ContactNumber').value);
    if(datFound != undefined){
      alert('This User is lareday exist. Please provide different user name or Phone number.');
      this.home.get('ContactNumber').patchValue('');
    }
  }
}
  // if(this.caseType == 'Addnew' || this.caseType == 'Add'|| this.caseType == ''){
  // if (this.home.get('FirstName').value !== '' && this.home.get('ContactNumber').value !== '') {
  //   var k = this.patientDetails.find(a=>a.FirstName == event.target.value && a.ContactNumber== this.home.get('ContactNumber').value)
  //   this.patientDetailsService.getUniquePatient(event.target.value,this.home.get('ContactNumber').value).subscribe(data => {
  //     if (data == false) {
  //       alert('This User is lareday exist. Please provide different user name or Phone number.');
  //       this.home.get('FirstName').patchValue('');
  //       //return;
  //     }
  //     // else{
  //     //   alert('new user name');
  //     // }
  //   })
  // }
  // }
  //alert(event.target.value);

}

  DOB: any;
  tomorrow = new Date();
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    //this.events.push(`${type}: ${event.value}`);
    this.btnClick();
  }
  btnClick() {
    //this.home.get('DOB').get('TestType')
    //alert(this.home.get('DOB').value);
    var diff_year_month_day = this.dateDiff(this.home.get('DOB').value, new Date()); // 1Y 0M 0D
    //dateDiff('2019-05-09'); // 0Y 0M 1D
    // dateDiff('2018-05-09'); // 1Y 0M 1D
    // dateDiff('2018-05-18'); // 0Y 11M 23D
    // dateDiff('2019-01-09'); // 0Y 4M 1D
    // dateDiff('2019-02-10'); // 0Y 3M 0D
    //alert('p'+diff_year_month_day);
  }
  PatientCategory: string;
  dateDiff(startingDate: any, endingDate: any) {
    var startDate = new Date(new Date(startingDate).toISOString().substr(0, 10));
    if (!endingDate) {
      endingDate = new Date().toISOString().substr(0, 10);    // need date in YYYY-MM-DD format
    }
    var endDate = new Date(endingDate);
    if (startDate > endDate) {
      var swap = startDate;
      startDate = endDate;
      endDate = swap;
    }
    var startYear = startDate.getFullYear();
    var february = (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0 ? 29 : 28;
    var daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var yearDiff = endDate.getFullYear() - startYear;
    var monthDiff = endDate.getMonth() - startDate.getMonth();
    if (monthDiff < 0) {
      yearDiff--;
      monthDiff += 12;
    }
    var dayDiff = endDate.getDate() - startDate.getDate();
    if (dayDiff < 0) {
      if (monthDiff > 0) {
        monthDiff--;
      } else {
        yearDiff--;
        monthDiff = 11;
      }
      dayDiff += daysInMonth[startDate.getMonth()];
    }

    this.home.get('Year').patchValue(yearDiff);
    this.home.get('Month').patchValue(monthDiff);
    this.home.get('Days').patchValue(dayDiff);




    return yearDiff + 'Y ' + monthDiff + 'M ' + dayDiff + 'D';
  }

  subt() {

  }
  directOrNot: string = null;
  visibledoctorassignment:boolean=false;

  advpaymnet:boolean = false;

  ngOnInit() {
    //alert(this.caseType);
    if (this.usrName !== "0") {
      this.patientName = this.usrName;
    }
    //  alert(this.usrName);
    //  alert(this.diectOnline);
    this.directOrNot = 'kk';// this.diectOnline;
    //alert(this.directOrNot);
    //this.onLoadNameChange('tapu');

    //this.LoadAllTestInvestigations(); 
    if (this.diectOnline !== 'Yes') {
      this.visibledoctorassignment = true;
      if(this.patientName == '')
      {

      }
      else{
      this.onNameChange(this.patientName);
      this.showAdvanceBox = false;
      }
      
    }

    this.LoadAllDoctor();
    this.LoadAllPharma();
    this.patientDetailsService.getAll().subscribe((data: PatientDetails[]) => {
      //console.log(data);
      this.patientDetails = data;
    });

    //alert(this.passOPDkimbaIPD);

//     if(this.home.value.AdvPayment!== ''){
// this.showAdvanceBox = false;
//     }

this.eventsSubscription = this.events.subscribe((data)=>this.showAdvanceBoxval = data); //data=>this.data

  }
  showAdvanceBox:boolean=true;
  showAdvanceBoxval:string='';
  date = new Date((new Date().getTime() - 3888000000));
  LoadAllTestInvestigations() {
    let p: PatientDetails = this.patientDetails.find(x => x?.FirstName?.toUpperCase() == this.patientName?.toUpperCase());
    if (p !== undefined) {
          this.patientID = p.UnqueID;
          
          this.home.patchValue(p);
        }
        else {
          this.home.reset();
        }
    // this.patientDetailsService.getAll().subscribe((data: PatientDetails[]) => {
    //   //console.log(data);
    //   this.patientDetails = data;
    //   let p: PatientDetails = this.patientDetails.find(x => x?.FirstName?.toUpperCase() == this.patientName?.toUpperCase());
    //   if (p !== undefined) {
    //     this.patientID = p.UnqueID;
        
    //     this.home.patchValue(p);
    //   }
    //   else {
    //     this.home.reset();
    //   }
    // })
  }
  patientID: string = '';
  patientName: string = '';
  ShowPatientID(FirstName: string, ContactNumber: string) {
    //data.Home.FirstName,data.Home.ContactNumber
    //alert('hi');
    // this.patientDetailsService.getAll().subscribe((data: PatientDetails[]) => {
    //   //let p:PatientDetails = this.patientDetails.find(x=>x.FirstName == this.home.get('FirstName').value);
    //   let p: PatientDetails = this.patientDetails.find(x => x.FirstName == FirstName && x.ContactNumber == ContactNumber);
    //   if (p !== undefined) {
    //     this.patientID = p.UnqueID;
    //     this.patientName = p.FirstName;
    //     //this.home.patchValue(p);
    //     this.countChanged.emit(this.patientID);
    //   }
    //   else {
    //     this.patientID = 'NA';
    //     this.countChanged.emit(this.patientID);
    //   }
    // })
    let p: PatientDetails = this.patientDetails.find(x => x.FirstName == FirstName && x.ContactNumber == ContactNumber);
    if (p !== undefined) {
      this.patientID = p.UnqueID;
      this.patientName = p.FirstName;
      //this.home.patchValue(p);
      this.countChanged.emit(this.patientID);
    }
    else {
      this.patientID = 'NA';
      this.countChanged.emit(this.patientID);
    }

  }
  SearchPatient(patientName: string) {
    this.LoadAllTestInvestigations();

    // let p: any = this.Inventory.find(x => x.itemName == target.value.toString() || x.BarCode == target.value.toString());
    // let objIndex = this.Inventory.findIndex(x => x.itemName == target.value.toString() || x.BarCode == target.value.toString());
  }
  onNameChange(patientName: string) {
    this.LoadAllTestInvestigations();

    // let p: any = this.Inventory.find(x => x.itemName == target.value.toString() || x.BarCode == target.value.toString());
    // let objIndex = this.Inventory.findIndex(x => x.itemName == target.value.toString() || x.BarCode == target.value.toString());
  }
  onLoadNameChange(passName: string) {
    let p: PatientDetails = this.patientDetails.find(x => x.FirstName == passName);
    if (p !== undefined) {
      this.patientID = p.UnqueID;
      this.home.patchValue(p);
    }
    else {
      this.home.reset();
    }
    // let p: any = this.Inventory.find(x => x.itemName == target.value.toString() || x.BarCode == target.value.toString());
    // let objIndex = this.Inventory.findIndex(x => x.itemName == target.value.toString() || x.BarCode == target.value.toString());
  }

  onPhoneChange({ target }) {
    //alert(target.value.toString());
    
    //alert(target.value.toString());
    this.patientName = '';

    let p: PatientDetails = this.patientDetails.find(x => x.ContactNumber == target.value.toString());
    if (p !== undefined) {
      this.home.patchValue(p);
    }
    else {
      this.home.reset();
    }
  }

  asyncPipeNewModifyCase: NewModifyCase;
  onOPDIPD({ target }) {
    //alert(target.value.toString());
    
    //alert(target.value.toString());
    this.addModifyCaseService.getAll().subscribe((data: NewModifyCase[]) => {
      this.asyncPipeNewModifyCase = data.find(x=> x.IPDOPDId == target.value.toString());
      if( this.asyncPipeNewModifyCase !== undefined){
        this.home.patchValue(this.asyncPipeNewModifyCase.Home);
      }
      else {
        this.home.reset();
      }
    });
     
   
  }

  searchme() {
    let serachVal = this.home.get('FirstName').value;
    let p: PatientDetails = this.patientDetails.find(x => x.FirstName == serachVal);
    this.home.patchValue(p);

  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    //this.LoadAllTestInvestigations();
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  test = 0;
  callMethod() {
    //console.log('successfully executed.');
    this.test++;
  }


  doSomething() {
    //alert('hi child from parent');
  }
  ptid: string;
  @Output() countChanged: EventEmitter<string> =   new EventEmitter();
  SavePatientDetails(appointmnetID: string): Observable<string> {
    // alert('called');
    //console.log(this.home.value);
    this.CreateStudent(this.home.value, appointmnetID);
    return of(this.ptid);
  }

  onCheckboxChange(e) {

    //alert(e.target.value);
    // if(e.checked){
    //   this.home.get('Pregnancy').setValue('Yes')
    // }
    // else{
    //   this.home.get('Pregnancy').setValue('No')
    // }
  }
  CreateStudent(student: PatientDetails, appointmnetID: string){
    student.AppointmentID = appointmnetID;
    var yearDiff = this.home.get('Year').value;
    var genderValue = this.home.get('Gender').value;
    if (yearDiff < 3) {
      this.PatientCategory = "0-2Yrs"
      student.PatientCategory = "0-2Yrs";
    }
    else if (yearDiff == 3 || yearDiff < 11) {
      this.PatientCategory = "Neonates";
      student.PatientCategory = "Neonates";
    }

    else if (yearDiff > 10 && genderValue == '1') {
      this.PatientCategory = "Male Adult"
      student.PatientCategory = "Male Adult";
    }
    else if (yearDiff > 10 && genderValue == '2') {
      this.PatientCategory = "Female Adult"
      student.PatientCategory = "Female Adult";
    }

    if (this.home.get('Pregnancy').value == true) {
      this.PatientCategory = "Pregnancy";
    }
    else {
      this.PatientCategory = "NoPregnancy";
    }

if(student.UnqueID != null && student.UnqueID != ''){
  this.patientDetailsService.update(student.UnqueID,student).subscribe(
    (data) => {
      this.patientName = null;
      this.patientName = ' ';
      this.home.reset();
      this.ptid= data.UnqueID;
    });
}
else{

  this.patientDetailsService.createStudent(student).subscribe(
    (data) => {
      this.patientName = null;
      this.patientName = ' ';
      this.home.reset();
      this.ptid= data.UnqueID;
    });
}
    
  }




  filterVal: string = '';

  obj: any = {};
  openDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxPatientComponent, {
      width: '600px',
      //data: {dialogTitle: action, dialogText: obj}
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      this.LoadAllTestInvestigations();
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   if(result.event == 'Add'){
    //     this.addRowData(result.data);
    //     this.LoadAllTestInvestigations(); 
    //   }else if(result.event == 'Update'){
    //     this.LoadAllTestInvestigations(); 
    //     //this.updateRowData(result.data);
    //   }else if(result.event == 'Delete'){
    //     this.LoadAllTestInvestigations();
    //     this.deleteRowData(result.data);
    //   }
    // });
  }

  //  addRowData(row_obj:CategoryMaster){

  //    this.table.renderRows();

  //  }
  //  updateRowData(row_obj){
  //    this.dataSource.data = this.dataSource.data.filter((value,key)=>{
  //      if(value.Name == row_obj.Name){
  //        value.Name = row_obj.Name;
  //      }
  //      return true;
  //    });
  //  }
  //  deleteRowData(row_obj){
  //    this.dataSource.data = this.dataSource.data.filter((value,key)=>{
  //      return value.Name != row_obj.Name;
  //    });
  //  }

}

