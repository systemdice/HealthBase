import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatRadioChange } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CalculatorComponent } from './custom-components/calculator.component';
import { BedAvailabilityManagementComponent } from './MasterForms/bed-availability-management.component';
import { DischargeReportComponent } from './MasterForms/discharge-report.component';
//import { truncate } from 'fs';
import { FarmacyDetailsPendingComponent } from './MasterForms/farmacy-details-pending.component';
import { HelpPageComponent } from './MasterForms/help-page.component';
import { LabReportComponent } from './MasterForms/lab-report.component';
import { FarmacyDeliveryToPatient, NewModifyCase, PaymentHistory, PaymentParams, ReferralMaster, Vaccinations } from './models/UserData';
import { PataientDetailMainComponent } from './pataient-detail-main.component';
import { PaymentDetailsComponent } from './payment-details.component';
import { OpdTicketReportComponent } from './Reports/opd-ticket-report.component';
import { PatientRegistrationFirstPageComponent } from './Reports/patient-registration-first-page.component';
import { AddModifyCaseService } from './Services/add-modify-case.service';
import { AppointmentDetailService } from './Services/appointment-detail.service';
import { BedManagementService } from './Services/bed-management.service';
import { FarmacyEntryService } from './Services/farmacy-entry.service';
import { PatientDetailsService } from './Services/patient-details.service';
import { PaymentHistoryService } from './Services/payment-history.service';
import { RefaralService } from './Services/referal.service';
import { VaccinationsCategoryService } from './Services/vaccines-category.service';
import { StorageService } from './shared/storage.service';

@Component({
  selector: 'app-fresh-case',
  templateUrl: './fresh-case.component.html',
  styleUrls: ['./fresh-case.component.css']
})
export class FreshCaseComponent implements OnInit {

  name = 'Angular';
  states: Array<String> = ['AR', 'AL', 'CA', 'DC'];
  fruits: Array<String> = ['Mango', 'Grapes', 'Strawberry', 'Oranges'];
  favFruitsError: Boolean = true;
  selectedFruitValues = [];
  addrFrom: FormGroup;
  par: string;
  parValue: string;
  caseValue: string;
  usrName: string;
  appntid: string;
  newid: string;
  panelOpenStateOPD = false;
  panelOpenStateLAB = false;
  panelOpenStateDailyExpense = false;
  panelOpenStatePharmacyManualEntry = false;
  panelOpenStateNebulization = false;
  panelOpenStateDoctorVisit = false;
  panelOpenStateNurseVisit = false;
  panelOpenStateDoctortoPatientCommentMedicineReDevelop = false;
  panelOpenStateAmbulanceVisit = false;
  panelOpenDoctortoPatientComment = false;
  panelOpenStateBED = false;
  panelOpenStateVaccine = false;
  panelOpenStateOT = false;
  panelOpenStateDIS = false
  panelOpenStateBILL = true;
  panelOpenStatePH = false;
  panelOpenStatePatient = false;

  panelOpenStateOPDSH = false;
  panelOpenStateLABSH = false;
  panelOpenStateDailyExpenseSH = false;
  panelOpenStatePharmacyManualEntrySH = false;
  panelOpenStateNebulizationSH = false;
  panelOpenStateDoctorVisitSH = false;
  panelOpenStateNurseVisitSH = false;
  panelOpenStateDoctortoPatientCommentMedicineReDevelopSH = false;
  panelOpenStateAmbulanceVisitSH = false;
  panelOpenDoctortoPatientCommentSH = false;
  panelOpenStateBEDSH = false;
  panelOpenStateVaccineSH = false;
  panelOpenStateOTSH = false;
  panelOpenStateDISSH = false;
  panelOpenStateBILLSH = true;
  panelOpenStatePHSH = false;
  panelOpenStatePatientSH = false;

  showBasedOnRole = true;

  showUpdateGIF: boolean = false;
  SubmitButtonNameDynamically: string = "Add Fresh CASE";
  siblings: Array<string>;
  paymentParams: PaymentParams;
  Username: string;
  Role: string;
  Location: string;
  ProductType: string;
  asyncPipePaymentHistory: PaymentHistory[] = [];
  TotalAmountRecived: string = "0";
  passOPDkimbaIPD: string = "IPD";
  showSectionPrintOption: boolean = false;
  eventsSubject: Subject<string> = new Subject<string>();
  eventsSubject1: Subject<string> = new Subject<string>();
  emitEventToChild(opd) {
    this.eventsSubject.next(opd);
  }
  emitEventToChild1(opd) {
    this.eventsSubject1.next(opd);
  }

  @ViewChild(PataientDetailMainComponent) pataientDetailMainComponent;
  @ViewChild('paymentDetails') paymentDetailsTemplate: PaymentDetailsComponent;
  @ViewChild('child') child: PataientDetailMainComponent;
  @ViewChild(PaymentDetailsComponent) paymentDetailsMainComponent;

  constructor(private _fb: FormBuilder, public dialog: MatDialog, private route: ActivatedRoute,
    private router: Router, private addModifyCaseService: AddModifyCaseService, public patientDetailsService: PatientDetailsService,
    public appointmentDetailService: AppointmentDetailService, private _store: StorageService,
    public vaccineCategoriesService: VaccinationsCategoryService, @Inject(DOCUMENT) private document: Document,
    private paymentHistoryService: PaymentHistoryService, public farmacyEntryService: FarmacyEntryService,
    private bedManagementService: BedManagementService, public referralMasterService: RefaralService, public http: HttpClient) {
    this.Username = this._store.sessionUsername;
    this.Role = this._store.sessionRole;
    this.Location = this._store.sessionLocation;
    this.ProductType = this._store.sessionProductType;
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    var url = window.location.href;
    console.log('from location.href' + url);

  }


  CaseRecordStatus: boolean = true;
  isEditCase: boolean = false;
  isopdipd: boolean = true;
  // applyFilterAlphabet(filterValue: string) {
  //   filterValue = filterValue.trim(); // Remove whitespace
  //   filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  //   this.asyncPipeAlphabet = this.asyncPipeUserDetails.filter(a=> a.FirstName.charAt(0).toLowerCase() === filterValue);
  //   this.dataSource = new MatTableDataSource(this.asyncPipeAlphabet);
  //   this.dataSource.paginator = this.actualPaginator; //this.paginator;
  //   this.dataSource.sort = this.actualSort; //this.sort;
  //   this.filterVal = '';
  // }
  ngOnInit() {
    //alert(this._store.sessionProductType);


    console.log('from navigateurl' + this.router.navigateByUrl.name);
    this.LoadAllVaccinations();
    //this.router.routeReuseStrategy.shouldReuseRoute = () => true;
    this.siblings = new Array<string>('Jane', 'Jack', 'Sophie');
    //this.PaymentParams = new PaymentParams(300,400,500,600);
    this.route.queryParams.subscribe(params => {
      this.usrName = params['username'] || "0";
      this.appntid = params['appntid'] || "0";
      this.newid = params['newid'] || "0";
      //alert(this.usrName)
    });

    this.route.params.subscribe((params) => {
      //alert(this.route.url.toString());
      this.parValue = params['caseType'];
      //this.usrName = params['username'] || 0;
      // alert('par val:'+ this.usrName);
      if (this.parValue == "appoint") {
        this.isEditCase = false;
        //alert('from appoinment');
        //this.addrFrom.get('')
        this.createForm();
        this.showUpdateGIF = false;
        this.SubmitButtonNameDynamically = "Create Fresh CASE";
        this.caseValue = "";
        //this.addrFrom.get('opdid').patchValue('1');
        this.radioChange('3');
        this.radioChangeOPDIPD('IPD');

        //below is called to update the registration fee and billing exception
        //this.FinalCalculation('');

      }
      else if (this.parValue == "Add" || this.parValue == "Addnew" || this.parValue == "") {
        this.isEditCase = false;
        this.createForm();
        this.showUpdateGIF = false;
        this.SubmitButtonNameDynamically = "Add Fresh CASE";
        this.caseValue = "";
        //this.addrFrom.get('opdid').patchValue('4');
        this.radioChange('3');
        this.radioChangeOPDIPD('IPD');
        if (this.passOPDkimbaIPD == 'IPD') {
          //////this.addrFrom.get('PaymentDetails').get('RegdCharge').patchValue('50');
        }
        else {
          this.addrFrom.get('PaymentDetails').get('RegdCharge').patchValue('0');
        }

        this.emitEventToChild("IPD");
        this.emitEventToChild1("IPD");
      }
      else if (this.parValue == "conv") {
        //alert('converted case'+this.newid);
        this.isEditCase = false;
        this.createForm();
        this.showUpdateGIF = false;
        this.SubmitButtonNameDynamically = "Add Fresh CASE";
        this.caseValue = "";
        //this.addrFrom.get('opdid').patchValue('4');
        this.radioChange('3');
        //this.radioChangeOPDIPD('IPD');

        this.caseValue = this.newid; //this.parValue;
        this.createForm();

        this.farmacyEntryService.getByCaseId(this.caseValue, this.Username).subscribe((data: FarmacyDeliveryToPatient) => {
          this.farmacyDeliveryToPatientData = data;

        });
        // this.addModifyCaseService.getById(this.parValue).subscribe(() => {

        // })
        this.paymentHistoryService.getPaymentsByCaseID(this.caseValue).subscribe((data: PaymentHistory[]) => {
          //console.log('jay'+data);
          this.asyncPipePaymentHistory = data;

          var sum: number = 0;
          if (this.asyncPipePaymentHistory.length > 0) {
            sum = this.asyncPipePaymentHistory.map(a => a.PaidAmount).reduce(function (a, b) {
              //return a + b;
              return (a == 0 ? 0 : a) + (b == 0 ? 0 : b);
            });

            this.TotalAmountRecived = sum.toString();
            //alert('Total recived'+this.TotalAmountRecived);

          }

          //paid amount /Advance

          //ended

        });

        this.patchValue2(this.caseValue);
        //this.showUpdateGIF = true;
        this.radioChangeOPDIPD('IPD');
        if (this.passOPDkimbaIPD == 'IPD') {
          //////this.addrFrom.get('PaymentDetails').get('RegdCharge').patchValue('50');
        }
        else {
          this.addrFrom.get('PaymentDetails').get('RegdCharge').patchValue('0');
        }

        this.emitEventToChild("IPD");
        this.emitEventToChild1("IPD");
      }
      else if (this.parValue == undefined) {

      }
      else {

        this.isEditCase = true;
        this.caseValue = this.parValue;
        this.createForm();
        this.farmacyEntryService.getByCaseIdEditFreshCase(this.caseValue).subscribe((data: FarmacyDeliveryToPatient) => {
          this.farmacyDeliveryToPatientData = data;


        });
        // this.addModifyCaseService.getById(this.parValue).subscribe(() => {

        // })
        this.paymentHistoryService.getPaymentsByCaseID(this.caseValue).subscribe((data: PaymentHistory[]) => {
          //console.log('jay'+data);
          this.asyncPipePaymentHistory = data;

          var sum: number = 0;
          if (this.asyncPipePaymentHistory.length > 0) {
            sum = this.asyncPipePaymentHistory.map(a => a.PaidAmount).reduce(function (a, b) {
              //return a + b;
              return (a == 0 ? 0 : a) + (b == 0 ? 0 : b);
            });

            this.TotalAmountRecived = sum.toString();
            //alert('Total recived'+this.TotalAmountRecived);

          }

          //paid amount /Advance

          //ended

        });

        this.patchValue2(this.parValue);
        this.showUpdateGIF = true;
        this.SubmitButtonNameDynamically = "Update CASE (" + this.newid + ")";
      }
    });

    this.AssignPannelVisibility("");
    this.LoadAllDoctor();
    if (this._store.sessionProductType == 'Patho LAB') {
      this.isopdipd = true;
      this.radioChange('4');


    }
    //console.log('final FormGroup is ', this.addrFrom.value)
  }

  addEditExpenseItem(expenseId: string, firstName: string) {
    //alert(expenseId+'-'+firstName);
    if (expenseId == null) {
      this.router.navigate(['/freshCase', expenseId], { queryParams: { username: firstName, newid: expenseId } });
    }
    else {
      this.router.navigate(['/freshCase', 'conv'], { queryParams: { username: firstName, newid: expenseId } });
    }
  }
  allStaffParm: ReferralMaster[] = [];
  allFarmaParm: FarmacyDeliveryToPatient;
  referralMaster: ReferralMaster[] = [];
  referralMasterCalc: ReferralMaster[] = [];
  nurseMasterCalc: ReferralMaster[] = [];
  LoadAllDoctor() {
    this.referralMasterService.getAllStaffType().subscribe((data: ReferralMaster[]) => {
      //console.log(data);
      this.allStaffParm = data;
      this.referralMaster = data;//.filter(x=> x.StaffType == 'Nurse');
      this.referralMasterCalc = this.referralMaster.filter(x => x.StaffType == 'Doctor');
      this.nurseMasterCalc = this.referralMaster.filter(x => x.StaffType == 'Nurse');

    })
  }
  retrunStaffCharge(staffName: string, staffType: string) {
    var pricep = '0';
    if (staffName !== "") {
      if (staffType == "Doctor") {
        var k = this.referralMasterCalc.find(x => x.FirstName == staffName);
        pricep = k == undefined ? '0' : k.fees.toString();
      }
      else if (staffType == "Nurse") {
        var k = this.nurseMasterCalc.find(x => x.FirstName == staffName);
        pricep = k == undefined ? '0' : k.fees.toString();
      }
    }
    return pricep;
  }
  CalculationDone: boolean = true;
  farmacyDeliveryToPatientData: FarmacyDeliveryToPatient;
  FinalCalculation(bookRelaseOption: string) {
    this.CalculationDone = false;
    if (this.parValue == "Add" || this.parValue == "Addnew" || this.parValue == "" || this.parValue == "conv") {
      if (this.passOPDkimbaIPD == 'IPD') {
        ////this.addrFrom.get('PaymentDetails').get('RegdCharge').patchValue('50');
      }
      else {
        this.addrFrom.get('PaymentDetails').get('RegdCharge').patchValue('0');
      }

    }
    else {
      //this.addrFrom.get('Home').get('AdvPayment').patchValue('0');
      //this.addrFrom.get('home').get('AdvPayment').patchValue('0');
    }

    this.addrFrom.get('PaymentDetails').get('BedCharge').patchValue(this.addrFrom.value.BedDetails.TotalPrice);
    //alert(this.addrFrom.value.BedDetails.TotalPrice);
    var sum: number = 0;
    if (this.addrFrom.value.CaseDetails.TestType.length > 0) {
      sum = this.addrFrom.value.CaseDetails.TestType?.map(a => a.TotalSum).reduce(function (a, b) {
        //return a + b;
        return parseFloat(a == "" ? "0" : a) + parseFloat(b == "" ? "0" : b);
      });

    }

    var sumDailyExpense: number = 0;
    if (this.addrFrom.value.DailyExpense.teachers.length > 0) {
      sumDailyExpense = this.addrFrom.value.DailyExpense.teachers.map(a => a.Amount).reduce(function (a, b) {
        //return parseFloat(a) + parseFloat(b);
        return parseFloat(a == "" ? "0" : a) + parseFloat(b == "" ? "0" : b);
      });
    }

    var sumPharmacyManualEntry: number = 0;
    if (this.addrFrom.value.PharmacyManualEntry.teachersPharmacyManualEntry.length > 0) {
      sumPharmacyManualEntry = this.addrFrom.value.PharmacyManualEntry.teachersPharmacyManualEntry.map(a => a.Amount).reduce(function (a, b) {
        //return parseFloat(a) + parseFloat(b);
        return parseFloat(a == "" ? "0" : a) + parseFloat(b == "" ? "0" : b);
      });
    }

    var sumNebulization: number = 0;
    if (this.addrFrom.value.Nebulization.teachersNebulization.length > 0) {
      sumNebulization = this.addrFrom.value.Nebulization.teachersNebulization.map(a => a.Amount).reduce(function (a, b) {
        //return parseFloat(a) + parseFloat(b);
        return parseFloat(a == "" ? "0" : a) + parseFloat(b == "" ? "0" : b);
      });
    }

    // var sumOTExpense: number = 0;
    // if (this.addrFrom.value.OTDetails.teachersOTDetails.length > 0) {
    //   sumOTExpense = this.addrFrom.value.OTDetails.teachersOTDetails.map(a => a.TotalPrice).reduce(function (a, b) {
    //     //return parseFloat(a) + parseFloat(b);
    //     return parseFloat(a == "" ? "0" : a) + parseFloat(b == "" ? "0" : b); 
    //   });
    // }


    var sumDoctorCharge: number = 0;
    if (this.addrFrom.value.DoctorVisit.teachersDoctorVisit.length > 0) {
      for (let i = 0; i < this.addrFrom.value.DoctorVisit.teachersDoctorVisit.length; i++) {
        //console.log(data.products[i].product_desc); //use i instead of 0
        var retvalue = this.retrunStaffCharge(this.addrFrom.value.DoctorVisit.teachersDoctorVisit[i].name, 'Doctor');
        sumDoctorCharge += parseFloat(retvalue == "" ? "0" : retvalue);
        //sumDoctorCharge+=15; 
      }

    }

    var sumNurseCharge: number = 0;
    if (this.addrFrom.value.NurseVisit.teachersNurseVisit.length > 0) {
      for (let i = 0; i < this.addrFrom.value.NurseVisit.teachersNurseVisit.length; i++) {
        //console.log(data.products[i].product_desc); //use i instead of 0
        var retvalue = this.retrunStaffCharge(this.addrFrom.value.NurseVisit.teachersNurseVisit[i].name, 'Nurse');
        sumNurseCharge += parseFloat(retvalue == "" ? "0" : retvalue);
        //sumNurseCharge+=5;
      }

    }
    var sumDoctortoPatientReDevelopCharge: number = 0;
    if (this.addrFrom.value.DoctortoPatientCommentMedicineReDevelop.teachersDoctortoPatientCommentMedicineReDevelop.length > 0) {
      for (let i = 0; i < this.addrFrom.value.DoctortoPatientCommentMedicineReDevelop.teachersDoctortoPatientCommentMedicineReDevelop.length; i++) {
        //console.log(data.products[i].product_desc); //use i instead of 0
        var retvalue = this.retrunStaffCharge(this.addrFrom.value.DoctortoPatientCommentMedicineReDevelop.teachersDoctortoPatientCommentMedicineReDevelop[i].name, 'Doctor');
        sumDoctortoPatientReDevelopCharge += parseFloat(retvalue == "" ? "0" : retvalue);
        //sumNurseCharge+=5;
      }

    }

    var sumAmbulanceCharge: number = 0;
    if (this.addrFrom.value.AmbulanceVisit.teachersAmbulanceVisit.length > 0) {
      for (let i = 0; i < this.addrFrom.value.AmbulanceVisit.teachersAmbulanceVisit.length; i++) {

        sumAmbulanceCharge = this.addrFrom.value.AmbulanceVisit.teachersAmbulanceVisit.map(a => a.Amount).reduce(function (a, b) {
          //return parseFloat(a) + parseFloat(b);
          return parseFloat(a == "" ? "0" : a) + parseFloat(b == "" ? "0" : b);
        });
        //console.log(data.products[i].product_desc); //use i instead of 0
        //sumAmbulanceCharge+=5;
      }

    }
    var sumVaccinationCharge: number = 0;
    if (this.addrFrom.value.VaccineDetailsVisit.teachersVaccineDetailsVisit.length > 0) {

      for (let i = 0; i < this.addrFrom.value.VaccineDetailsVisit.teachersVaccineDetailsVisit.length; i++) {

        sumVaccinationCharge = this.addrFrom.value.VaccineDetailsVisit.teachersVaccineDetailsVisit.map(a => a.Amount).reduce(function (a, b) {
          //return parseFloat(a) + parseFloat(b);
          return parseFloat(a == "" ? "0" : a) + parseFloat(b == "" ? "0" : b);
        });
        //console.log(data.products[i].product_desc); //use i instead of 0
        //sumAmbulanceCharge+=5;
      }

    }

    var sumOtCharges: number = 0;
    if (this.addrFrom.value.OTDetails.teachersOTDetails.length > 0) {
      sumOtCharges = this.addrFrom.value.OTDetails.teachersOTDetails.map(a => a.TotalPrice).reduce(function (a, b) {
        //return parseFloat(a) + parseFloat(b);
        return parseFloat(a == "" ? "0" : a) + parseFloat(b == "" ? "0" : b);
      });
    }

    var sumBedCharges: number = 0;
    if (this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit.length > 0) {
      sumBedCharges = this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit.map(a => a.BedPrice).reduce(function (a, b) {
        //return parseFloat(a) + parseFloat(b);
        return parseFloat(a == "" ? "0" : a) + parseFloat(b == "" ? "0" : b);
      });
    }

    var sumBVaccineCharges: number = 0;
    if (this.addrFrom.value.VaccineDetailsVisit.teachersVaccineDetailsVisit.length > 0) {
      sumBVaccineCharges = this.addrFrom.value.VaccineDetailsVisit.teachersVaccineDetailsVisit.map(a => a.VaccinePrice).reduce(function (a, b) {
        //return parseFloat(a) + parseFloat(b);
        return parseFloat(a == "" ? "0" : a) + parseFloat(b == "" ? "0" : b);
      });
    }




    // //Update the bed details
    // if (this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit.length > 0) {
    //   for (let i = 0; i < this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit.length; i++) {
    //     console.log("Block statement execution no." + i);
    //     if (this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedCategory !== '' && this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedName !== '') {
    //       //if (bookRelaseOption !== undefined || bookRelaseOption != '') {
    //         if (this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedForceRelease == 'Occupied') {
    //           alert(this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedForceRelease);
    //         this.bedManagementService.updateBedStatus('32176855', this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedCategory,
    //           this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedName, 'BOOKED').subscribe(aa => {
    //             //alert('updated the appointment');
    //           });
    //       }
    //       else if(this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedForceRelease == 'Release'){
    //         alert(this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedForceRelease);
    //         this.bedManagementService.updateBedStatus('32176855', this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedCategory,
    //         this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedName, 'OPEN').subscribe(aa => {
    //           //alert('updated the appointment');
    //         });
    //       }
    //     }


    //   }
    // }


    var farmaExpense: number = 0;


    try {
      if (this.farmacyDeliveryToPatientData !== undefined) {
        if (this.farmacyDeliveryToPatientData[0].teachers.length > 0)
          farmaExpense = this.farmacyDeliveryToPatientData[0]?.teachers.reduce((accumulator, current) => accumulator + parseFloat(current.total), 0);
      }

    }
    catch (error) {
    }
    finally {
    }



    //alert(sumDailyExpense);
    if (this.parValue == "Add" || this.parValue == "Addnew" || this.parValue == "") {
      this.addrFrom.get('PaymentDetails').get('EarlierPayment').patchValue(this.addrFrom.value.home.AdvPayment);
    }

    var discountCheck = "0";
    if (this.addrFrom.get('PaymentDetails').get('Discount').value == null || this.addrFrom.get('PaymentDetails').get('Discount').value == '') {
      this.addrFrom.get('PaymentDetails').get('Discount').patchValue('0');
    }


    this.addrFrom.get('PaymentDetails').get('LabTestCharge').patchValue(sum);
    this.addrFrom.get('PaymentDetails').get("DailyExpense").patchValue(sumDailyExpense == 0 ? '0' : sumDailyExpense);
    this.addrFrom.get('PaymentDetails').get("PharmacyManualEntryCharge").patchValue(sumPharmacyManualEntry == 0 ? '0' : sumPharmacyManualEntry);
    this.addrFrom.get('PaymentDetails').get("NebulizationCharge").patchValue(sumNebulization == 0 ? '0' : sumNebulization);
    this.addrFrom.get('PaymentDetails').get("FarmaCharge").patchValue(farmaExpense);
    this.addrFrom.get('PaymentDetails').get('OTCharge').patchValue(sumOtCharges == 0 ? '0' : sumOtCharges);
    this.addrFrom.get('PaymentDetails').get('NurseCharge').patchValue(sumNurseCharge);
    //this.addrFrom.get('PaymentDetails').get('DoctorCharge').patchValue(sumDoctorCharge); //original
    this.addrFrom.get('PaymentDetails').get('DoctorCharge').patchValue(sumDoctortoPatientReDevelopCharge);
    this.addrFrom.get('PaymentDetails').get('BedCharge').patchValue(sumBedCharges);
    this.addrFrom.get('PaymentDetails').get('AmbulanceCharge').patchValue(sumAmbulanceCharge == 0 ? '0' : sumAmbulanceCharge);
    this.addrFrom.get('PaymentDetails').get('VaccinationCharge').patchValue(sumVaccinationCharge == 0 ? '0' : sumVaccinationCharge);

    this.GrandTotalFunction('');

  }

  GrandTotalFunction(per: string) {

    //alert('changed');
    // if (this.caseid == null) {
    //   //let grandTotal = Number(this.paymentParams?.OPD) + Number(this.paymentParams?.Doctor) + Number(this.paymentParams?.LabTest) + Number(this.paymentParams?.Bed);
    //   //  this.paym
    //   //   this.PaymentDetails.get('Amount').patchValue('500');
    //   //   this.PaymentDetails.get('Amount').patchValue(grandTotal);
    // }
    // else {
    //   //   let grandTotal = Number(this.paymentParams?.OPD) + Number(this.paymentParams?.Doctor) + Number(this.paymentParams?.LabTest) + Number(this.paymentParams?.Bed);
    //   // this.PaymentDetails.get('Amount').patchValue('500');
    //   // this.PaymentDetails.get('Amount').patchValue(grandTotal);DailyExpense

    // }
    //console.log(this.addrFrom.get('PaymentDetails').get('OPDCharge').value);
    let OPDCharge = parseFloat(this.addrFrom.get('PaymentDetails').get('OPDCharge').value == "" ? "0" : this.addrFrom.get('PaymentDetails').get('OPDCharge').value)
    let DoctorCharge = parseFloat(this.addrFrom.get('PaymentDetails').get('DoctorCharge').value == "" ? "0" : this.addrFrom.get('PaymentDetails').get('DoctorCharge').value)
    let LabTestCharge = parseFloat(this.addrFrom.get('PaymentDetails').get('LabTestCharge').value == "" ? "0" : this.addrFrom.get('PaymentDetails').get('LabTestCharge').value)
    let FarmaCharge = parseFloat(this.addrFrom.get('PaymentDetails').get('FarmaCharge').value == "" ? "0" : this.addrFrom.get('PaymentDetails').get('FarmaCharge').value)
    //let OTCharge = parseFloat("0")//parseFloat(this.addrFrom.get('PaymentDetails').get('OPDCharge').value)
    let OTCharge = parseFloat(this.addrFrom.get('PaymentDetails').get('OTCharge').value == "" ? "0" : this.addrFrom.get('PaymentDetails').get('OTCharge').value)

    let BedCharge = parseFloat(this.addrFrom.get('PaymentDetails').get('BedCharge').value == "" ? "0" : this.addrFrom.get('PaymentDetails').get('BedCharge').value)
    let DailyExpenseCharge = parseFloat(this.addrFrom.get('PaymentDetails').get('DailyExpense').value == "" ? "0" : this.addrFrom.get('PaymentDetails').get('DailyExpense').value)
    let PharmacyManualEntryCharge = parseFloat(this.addrFrom.get('PaymentDetails').get('PharmacyManualEntryCharge').value == "" ? "0" : this.addrFrom.get('PaymentDetails').get('PharmacyManualEntryCharge').value)
    let NebulizationCharge = parseFloat(this.addrFrom.get('PaymentDetails').get('NebulizationCharge').value == "" ? "0" : this.addrFrom.get('PaymentDetails').get('NebulizationCharge').value)
    
    let OtherCharge = parseFloat(this.addrFrom.get('PaymentDetails').get('OtherCharge').value == "" ? "0" : this.addrFrom.get('PaymentDetails').get('OtherCharge').value)
    let RegdCharge = parseFloat(this.addrFrom.get('PaymentDetails').get('RegdCharge').value == "" ? "0" : this.addrFrom.get('PaymentDetails').get('RegdCharge').value)
    let NurseCharge = parseFloat(this.addrFrom.get('PaymentDetails').get('NurseCharge').value == "" ? "0" : this.addrFrom.get('PaymentDetails').get('NurseCharge').value)
    let AmbulanceCharge = parseFloat(this.addrFrom.get('PaymentDetails').get('AmbulanceCharge').value == "" ? "0" : this.addrFrom.get('PaymentDetails').get('AmbulanceCharge').value)
    let VaccinationCharge = parseFloat(this.addrFrom.get('PaymentDetails').get('VaccinationCharge').value == "" ? "0" : this.addrFrom.get('PaymentDetails').get('VaccinationCharge').value)

    let GTotal = OPDCharge + DoctorCharge + LabTestCharge + FarmaCharge + OTCharge + BedCharge + DailyExpenseCharge + PharmacyManualEntryCharge +NebulizationCharge + OtherCharge + RegdCharge + NurseCharge + AmbulanceCharge + VaccinationCharge;
    this.addrFrom.get('PaymentDetails').get('Amount').patchValue(GTotal);
    var ct = 0;
    let price = this.addrFrom.get('PaymentDetails').get('Amount').value;
    let discount = this.addrFrom.get('PaymentDetails').get('Discount').value;
    if (per == "%") {
      //this.disType = "In Percent(%)";
      let ctDis = (parseFloat(discount) / 100) * parseFloat(price);
      this.addrFrom.get('PaymentDetails').get('Discount').patchValue(ctDis);
      ct = this.CalculateFinalPriceWithDiscountAmount(price, ctDis.toString());
    }
    else {
      this.disType = "In Rupees"
      ct = this.CalculateFinalPriceWithDiscountAmount(price, discount);
    }

    //let ct = this.CalculateFinalPriceWithDiscountAmount(price, discount);
    //let discountTotal = this.CalculateanyPercent(price, discount);

    let paidAmount = this.addrFrom.get('PaymentDetails').get('PaidAmount').value;
    //this.addrFrom.get('PaymentDetails').get('EarlierPayment').patchValue('0');
    //let earlierPayment = this.addrFrom.get('PaymentDetails').get('EarlierPayment').value;
    let earlierPayment = parseFloat(this.addrFrom.get('PaymentDetails').get('EarlierPayment').value == "" ? "0" : this.addrFrom.get('PaymentDetails').get('EarlierPayment').value)
    let disvalue = parseFloat(this.addrFrom.get('PaymentDetails').get('Discount').value == "" ? "0" : this.addrFrom.get('PaymentDetails').get('Discount').value)
    let paidVal = parseFloat(this.addrFrom.get('PaymentDetails').get('PaidAmount').value == "" ? "0" : this.addrFrom.get('PaymentDetails').get('PaidAmount').value)

    //this.addrFrom.get('PaymentDetails').get('PaidAmount').patchValue(ct - earlierPayment);
    //let bal =(parseFloat(price) - parseFloat(paidAmount)) - parseFloat(earlierPayment.toString());
    let bal = (parseFloat(price) - (paidVal + parseFloat(this.TotalAmountRecived)) - parseFloat(disvalue.toString())) - parseFloat(earlierPayment.toString());
    this.addrFrom.get('PaymentDetails').get('Balance').patchValue(this.round(bal));
    //this.addrFrom.get('PaymentDetails').get('EarlierPayment').patchValue(bal);

  }
  disType: string = 'In Rupees';
  round(num) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);
}
  CalculatePercent() {
    let perval = this.addrFrom.get('PaymentDetails').get('Discount').value;
    this.disType = "With (" + perval + " %)"
    this.GrandTotalFunction('%');
  }
  CalculateFinalPriceWithDiscountDiscount(price: string, discount: string): number {

    var result = (parseFloat(discount) / 100) * parseFloat(price);
    return (parseFloat(price) - result);
  }
  CalculateFinalPriceWithDiscountAmount(price: string, discount: string): number {

    // var result = (parseFloat(discount) / 100) * parseFloat(price);
    return (parseFloat(price) - parseFloat(discount));
  }

  createForm() {
    this.addrFrom = this._fb.group({
      opdipd: ['3'],
      OPDkimbaIPD: ['IPD'],
      IPDOPDId: [''],
      CaseLife: ['Running'],
      IPDOPDConversionStatus: ['Original'],  //converted if convert from OPD to IPD
      IPDOPDConversionFrom: [''],
      DateStart: [''],
      home: this._fb.group({
        UnqueID: [],
        Title: ['Mr.'],
        UserName: [''],
        FirstName: ['', [Validators.required]],
        LastName: [''],
        Year: ['0', [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
        Month: ['0'],
        Days: ['0'],
        DOB: [],
        Gender: ['1'],
        Email: [''],
        ContactNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        Address: [''],
        Status: ['true'],
        Relationship: ['Self'],
        Pregnancy: [false],
        PatientCategory: [''],
        RefferDoctorName: [''],
        PermananetAddress: [''],
        OfficeAddress: [''],
        MaritalStatus: [''],
        CO: [''],
        Religion: [''],
        Occupation: [''],
        BloodGroup: [''],
        AssignedPharma: [''],
        AssignedDept: [''],
        Allergy: [''],
        Height: [''],
        Weight: [''],
        Temperature: [''],
        RespiratoryRate: [''],
        RhType: [''],
        BPReading: [''],
        FatherName: [''],
        MotherName: [''],
        AdvPayment: [''],
      }),
      OPD: this._fb.group({
        title: [''],
        firstName: [''],
        lastName: [''],
        DoctorFeedback: [''],
        converttoIPD: [false],
        OPDChoice: new FormArray([])
      }),

      DailyExpense: this._fb.group({
        teachers: this._fb.array([]),
      }),
      PharmacyManualEntry: this._fb.group({
        teachersPharmacyManualEntry: this._fb.array([]),
      }),
      Nebulization: this._fb.group({
        teachersNebulization: this._fb.array([]),
      }),
      DoctorVisit: this._fb.group({
        teachersDoctorVisit: this._fb.array([]),
      }),
      NurseVisit: this._fb.group({
        teachersNurseVisit: this._fb.array([]),
      }),
      DoctortoPatientCommentMedicineReDevelop: this._fb.group({
        teachersDoctortoPatientCommentMedicineReDevelop: this._fb.array([]),
      }),
      AmbulanceVisit: this._fb.group({
        teachersAmbulanceVisit: this._fb.array([]),
      }),
      BedDetailsVisit: this._fb.group({
        teachersBedDetailsVisit: this._fb.array([]),
      }),
      VaccineDetailsVisit: this._fb.group({
        teachersVaccineDetailsVisit: this._fb.array([]),
      }),
      OTDetails: this._fb.group({
        teachersOTDetails: this._fb.array([]),
      }),

      DoctortoPatientCommentMedicine: this._fb.group({
        DoctorComments: [''],
        DoctorCommentsHL: [''],
        MedicineNames: [''],
        MedicineNamesHL: [''],
        PatientHistory: [''],
        PatientFinding: [''],
        PatientDiagnosis: [''],
        PatientPathoLabTestAdvice: [''],
      }),

      CaseDetails: this._fb.group({
        RefferDoctorName: [''],
        RefferDoctorCharge: [''],
        RefferDoctorCommission: [''],
        CollectionCenter: [''],
        TestType: this._fb.array([]),
      }),
      PaymentDetails: this._fb.group({
        Amount: ['0'],
        Discount: ['0'],
        PaidAmount: ['0'],
        RefundAmount: ['0'],
        Balance: ['0'],
        CaseID: [''],
        ReceivedBy: [this.Username],
        Date: ['',],
        OPDCharge: [0],
        DoctorCharge: ['0'],
        LabTestCharge: ['0'],
        DailyExpense: ['0'],
        PharmacyManualEntryCharge: ['0'],
        NebulizationCharge: ['0'],
        FarmaCharge: ['0'],
        BedCharge: ['0'],
        OTCharge: ['0'],
        OtherCharge: ['0'],
        EarlierPayment: ['0'],
        RegdCharge: ['0'],
        NurseCharge: ['0'],
        AmbulanceCharge: ['0'],
        VaccinationCharge: ['0']
      }),
      BedDetails: this._fb.group({
        Description: [''],
        BedNumber: [''],
        BedPrice: [''],
        Upgrade: ["No"],
        StartDate: [''],
        EndDate: [''],
        NofDays: [''],
        TotalPrice: ['0'],
      }),
      DischargeNote: this._fb.group({
        AdviceNote: [''],
        FinalDiagnosis: [''],
        Referal: [''],
        DischargeType: [''],
        Other: [''],
      }),

    })
  }

  activeOtherThanOPD: boolean = true; //original
  activePathoLAB: boolean = false;
  //activeOtherThanOPD: boolean = false; //del
  activeOPD: boolean = true;
  activeBed: boolean = false;
  serviceType: string = '0';
  radioChangeOPDIPD($event: string) {


    if ($event === "OPD") {
      this.panelOpenStatePatientSH = true;
      this.panelOpenStateOPDSH = false;
      this.panelOpenStateLABSH = true;
      this.panelOpenStateDailyExpenseSH = false;
      this.panelOpenStatePharmacyManualEntrySH = false;
      this.panelOpenStateNebulizationSH = false;
      this.panelOpenStateDoctorVisitSH = false;
      this.panelOpenStateNurseVisitSH = false;
      this.panelOpenStateDoctortoPatientCommentMedicineReDevelopSH = true;
      this.panelOpenStateAmbulanceVisitSH = false;
      this.panelOpenDoctortoPatientCommentSH = true;
      this.panelOpenStateBEDSH = false;
      this.panelOpenStateVaccineSH = false;
      this.panelOpenStateOTSH = false;
      this.panelOpenStateDISSH = false;
      this.panelOpenStateBILLSH = true;
      this.panelOpenStatePHSH = false;
      this.panelOpenStateVaccineSH = false;

      this.passOPDkimbaIPD = "OPD";
      this.emitEventToChild('OPD');
      this.emitEventToChild1('OPD');

    }
    else if ($event === "VS") {
      this.panelOpenStatePatientSH = true;
      this.panelOpenStateOPDSH = false;
      this.panelOpenStateLABSH = false;
      this.panelOpenStateDailyExpenseSH = false;
      this.panelOpenStatePharmacyManualEntrySH = false;
      this.panelOpenStateNebulizationSH = false;
      this.panelOpenStateDoctorVisitSH = false;
      this.panelOpenStateNurseVisitSH = false;
      this.panelOpenStateDoctortoPatientCommentMedicineReDevelopSH = true;
      this.panelOpenStateAmbulanceVisitSH = false;
      this.panelOpenDoctortoPatientCommentSH = true;
      this.panelOpenStateBEDSH = false;
      this.panelOpenStateVaccineSH = false;
      this.panelOpenStateOTSH = false;
      this.panelOpenStateDISSH = false;
      this.panelOpenStateBILLSH = true;
      this.panelOpenStatePHSH = false;
      this.panelOpenStateVaccineSH = true;

      this.passOPDkimbaIPD = "VS";
      this.emitEventToChild('VS');
      this.emitEventToChild1('VS');

    }

    else {
      this.radioChange('3');
      //this.radioChangeOPDIPD('IPD');
      this.passOPDkimbaIPD = "IPD";
      this.emitEventToChild('IPD');
      this.emitEventToChild1('IPD');
    }


  }
  opdipdVisible: boolean = true;
  radioChange($event: string) {
    //alert($event.source.name +'-'+ $event.value);

    if ($event === "1") {
      // Do whatever you want here
      this.activeOtherThanOPD = true; //original
      this.activeBed = true;
      //this.activeOtherThanOPD = false; //Del
      this.activeOPD = false;
      this.activePathoLAB = false;
      this.serviceType = "1";
    }
    else if ($event === "3") { //all
      // Do whatever you want here
      // this.activeOtherThanOPD = false;
      // this.activeOPD = false;
      // this.activePathoLAB = false;
      // this.activeBed = false;
      this.AssignPannelVisibility("3");
      this.serviceType = "3";
      this.opdipdVisible = true;
    }
    else if ($event === "4") {//patholab
      // Do whatever you want here
      this.activeOtherThanOPD = true;
      this.activeBed = true;
      this.activeOPD = true;
      this.activePathoLAB = false;
      this.AssignPannelVisibility("4");
      this.serviceType = "4";
      this.opdipdVisible = false;
    }
    else {
      this.activeOtherThanOPD = false;
      this.activeOPD = true; //original
      this.activePathoLAB = false;
      this.activeBed = false;
      //this.activeOPD = false; //Del
      this.serviceType = "0";
    }
    this.addrFrom.get('opdipd').patchValue($event);
    //this.addrFrom.value.opdipd="4";
    this.serviceType = $event;
  }

  geCaseType(caseKey: string): string {
    return caseKey === 'Add' ? 'It is a new CASE. (Please fill out the datas and create the CASE)' : this.parValue;
  }

  SavePP() {//patient details
    this.pataientDetailMainComponent.SavePatientDetails();
  }

  SavePD() { //payment details
    this.paymentDetailsTemplate?.SavePaymentDetails("q12");
  }

  addAddressGroup() {
    return this._fb.group({
      primaryFlg: [],
      streetAddress: [null, Validators.required],
      city: [null, Validators.required],
      state: [null, Validators.required],
      zipcode: [null, [Validators.required, Validators.pattern('^[0-9]{5}$')]]
    });
  }

  btnBillPrint() {
    //this.router.navigate(['/LabTestReport']);
    //this.onSubmit(this.addrFrom.value);
    this.router.navigate(['/LabReportandFindings', this.parValue]);
  }
  btnDischargePrint() {
    //this.router.navigate(['/LabTestReport']);
    this.router.navigate(['/DichargeReport', this.parValue]);
  }
  btnTest() {
    //this.router.navigate(['/LabTestReport']);
    //this.router.navigate(['/DichargeReport', this.parValue]);
    return this.addrFrom.value.home.FirstName;
  }
  animal: string;
  //print generic report
  OpenPrescription(nm): void {


    // const dialogRef = this.dialog.open(DischargeReportComponent, {
    //   width: '1250px',
    //   height: '670px',
    //   data: {name: nm, animal: this.parValue}
    // });
    if (this.addrFrom.value.OPDkimbaIPD == 'IPD' && nm == 'patient') {
      //alert(this.parValue);
      const dialogRef = this.dialog.open(PatientRegistrationFirstPageComponent, {

        width: '1250px',
        height: '670px',
        data: { name: nm, animal: this.parValue }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.animal = result;
      });
    }
    else if (this.addrFrom.value.OPDkimbaIPD == 'OPD' && nm == 'patient') {
      const dialogRef = this.dialog.open(OpdTicketReportComponent, {
        width: '1250px',
        height: '670px',
        data: { name: nm, animal: this.parValue }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.animal = result;
      });
    }
    else {
      const dialogRef = this.dialog.open(DischargeReportComponent, {
        width: '1250px',
        height: '670px',
        data: { name: nm, animal: this.parValue }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.animal = result;
      });
    }

  }

  OpenHelpPage(nm): void {

    const dialogRef = this.dialog.open(HelpPageComponent, {
      width: '1200px',
      height: '650px',
      data: { 'caseID': '15', 'printType': nm }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }
  OpenCalculator(): void {

    const dialogRef = this.dialog.open(CalculatorComponent, {
      width: '500px',
      //height: '650px',
      position: { right: '20px', top: '20px' },
      data: { name: 'Yes' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  OpenBedAvailability(): void {


    const dialogRef = this.dialog.open(BedAvailabilityManagementComponent, {
      width: '1270px',
      height: '650px',

      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  OpenBillPrint(caseidParam, billPartName): void {

    //alert(caseidParam); this is the unique ID
    const dialogRef = this.dialog.open(LabReportComponent, {
      width: '1250px',
      height: '790px',
      data: { 'caseID': caseidParam, 'printType': billPartName }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  onSubmit(xyz) {
    if (this.addrFrom.value.home.FirstName == null || this.addrFrom.value.home.FirstName == '') {
      alert('Please provide patient\'s first name.');
    }
    else if (this.addrFrom.value.home.ContactNumber == null || this.addrFrom.value.home.ContactNumber == '') {
      alert('Please provide patient\'s Contact Number.');
    }
    // else if(this.addrFrom.value.home.Year == null || this.addrFrom.value.home.Year == '0')
    // {
    //     alert('Please provide patient\'s  age in year.');
    // }
    else if (this.addrFrom.value.home.Year == '0' && this.addrFrom.value.home.Month == '0' && this.addrFrom.value.home.Days == '0') {
      alert('Please provide patient\'s  age in year or month or days or all.');
    }
    else if (this.addrFrom.value.home.Year > 100) {
      alert('Please provide patient\'s  age year between 0 to 99.');
    }

    else if (this.addrFrom.value.home.FirstName != '' && this.addrFrom.value.home.ContactNumber != '') {
      if (this.parValue == "Add" || this.parValue == "Addnew" || this.parValue == "appoint" || this.parValue == "conv") {

        this.patientDetailsService.getUniquePatient(this.addrFrom.value.home.FirstName, this.addrFrom.value.home.ContactNumber).subscribe(data => {
          if (data == false) {
            alert('This User is lareday exist. Please provide different user name or Phone number.');
            //this.home.get('ContactNumber').patchValue('');
            //return;
          }
          else {
            this.FinalCalculation('BOOKED');
            this.CreateStudent(new NewModifyCase(), 'Progress');
          }
        })
      }
      else {
        this.FinalCalculation('BOOKED');
        this.CreateStudent(new NewModifyCase(), 'Progress');
      }
    }
    // else if(this.addrFrom.value.home.FirstName !== null || this.addrFrom.value.home.FirstName !== '' ||
    // this.addrFrom.value.home.ContactNumber !== null || this.addrFrom.value.home.ContactNumber !== ''  ){
    //   this.patientDetailsService.getUniquePatient(this.addrFrom.value.home.FirstName, 
    //     this.addrFrom.value.home.ContactNumber).subscribe(data => {
    //     if (data == false) {
    //       alert('This User is lareday exist. Please provide different user name or Phone number.');
    //       //return;
    //     }

    //   })  

    // }
    else {
      this.FinalCalculation('BOOKED');
      this.CreateStudent(new NewModifyCase(), 'Progress');
    }


  }
  Counter = 'NA';
  countChangedHandler(count: string) {
    this.Counter = count;
    //alert('emitter'+ count);
  }

  uupp() {
    this.ngOnInit();
    this.FinalCalculation('BOOKED');
    this.CreateStudent(new NewModifyCase(), 'Progress');
  }

  ShowAssignedBedName(ind: number): string {
    var k = this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[ind].BedName;
    return k;
  }

  employeeIdUpdate: string;
  CaseID: string;
  dd: any;
  CreateStudent(student: NewModifyCase, caseStatus: string) {
    if (this.parValue == "Add" || this.parValue == "Addnew" || this.parValue == "appoint" || this.parValue == "conv") {
      this.employeeIdUpdate = null;
    }
    else {
      this.employeeIdUpdate = this.parValue;
    }
    student.PaymentHistory = [];
    student.BedandAdmissionHistory = [];
    //student.OPD = [];
    student.CaseStatus = caseStatus;
    student.CaseLife = 'Running';
    if (this.parValue !== "conv") {
      student.IPDOPDConversionStatus = 'Original';  //converted if convert from OPD to IPD    
      student.IPDOPDConversionFrom = student.IPDOPDConversionFrom !== null && student.IPDOPDConversionFrom !== "New" ? student.IPDOPDConversionFrom : 'New';

    }
    else {
      student.IPDOPDConversionStatus = 'Converted';  //converted if convert from OPD to IPD
      student.IPDOPDConversionFrom = this.newid;
    }


    if (this.parValue !== "conv") {
      student.IPDOPDConversionStatus = 'Original';  //converted if convert from OPD to IPD
      if (this.employeeIdUpdate !== null) {
        student.IPDOPDConversionFrom = student.IPDOPDConversionFrom;//this.newid;
      }
      else {
        student.IPDOPDConversionFrom = "New";
      }
    }
    else {
      student.IPDOPDConversionStatus = 'Converted';  //converted if convert from OPD to IPD
      student.IPDOPDConversionFrom = this.newid;
    }

    student.UserName = this.Username;
    student.UserRole = this.Role;
    student.Location = this.Location;
    student.UnqueID = "99";
    student.PatientID = "100";
    student.PaymentHistoryID = "101";

    //student.CaseStatus = 'Progress';
    student.PaymentHistory.push(this.addrFrom.value.PaymentDetails);
    student.BedandAdmissionHistory.push(this.addrFrom.value.BedDetails);
    //student.OPD.push(this.addrFrom.value.OPD);
    if (this.addrFrom.value.BedDetails.Upgrade == true) {
      this.addrFrom.value.BedDetails.Upgrade = "Yes";
      student.BedandAdmissionHistory.push(this.addrFrom.value.BedDetails);
    }


    //student.PaymentHistory.push({ "Amount": 190, "Discount": 40, "PaidAmount": 150, "Balance": 0, "CaseID": "", "ReceivedBy": "liku", "Date": "" }) ;
    student.DateStart = student.DateStart; //"11/12/2020";
    student.TestNameWithCase = this.addrFrom.value.CaseDetails;
    student.home = this.addrFrom.value.home;
    if (this.addrFrom.value.home.Pregnancy == true) {
      this.addrFrom.value.home.PatientCategory = 'Yes';
    }
    else {
      this.addrFrom.value.home.PatientCategory = 'No';
    }

    var yr = parseFloat(this.addrFrom.value.home.Year);

    if (yr < 3) {
      //this.PatientCategory = "0-2Yrs"
      this.addrFrom.value.home.PatientCategory = "0-2Yrs";
    }
    else if (yr == 3 || yr < 11) {
      //this.PatientCategory = "Neonates";
      this.addrFrom.value.home.PatientCategory = "Neonates";
    }

    else if (yr > 10 && this.addrFrom.value.home.Gender == '1') {
      // this.PatientCategory = "Male Adult"
      this.addrFrom.value.home.PatientCategory = "Male Adult";
    }
    else if (yr > 10 && this.addrFrom.value.home.Gender == '2') {
      //this.PatientCategory = "Female Adult"
      this.addrFrom.value.home.PatientCategory = "Female Adult";
    }

    if (this.addrFrom.value.home.Pregnancy == true) {
      this.addrFrom.value.home.Pregnancy = "Pregnancy";
    }
    else {
      this.addrFrom.value.home.Pregnancy = "NoPregnancy";
    }




    student.OPD = this.addrFrom.value.OPD;
    student.OTDetails = this.addrFrom.value.OTDetails;

    for (let i = 0; i < this.addrFrom.value.DoctortoPatientCommentMedicineReDevelop.teachersDoctortoPatientCommentMedicineReDevelop.length; i++) {
      if (this.addrFrom.value.DoctortoPatientCommentMedicineReDevelop.teachersDoctortoPatientCommentMedicineReDevelop[i].DoctorComments !== '') {
        this.addrFrom.value.DoctortoPatientCommentMedicineReDevelop.teachersDoctortoPatientCommentMedicineReDevelop[i].DoctorCommentsHL = (this.addrFrom.value.DoctortoPatientCommentMedicineReDevelop.teachersDoctortoPatientCommentMedicineReDevelop[i].DoctorCommentsHL == null ? '' : this.addrFrom.value.DoctortoPatientCommentMedicineReDevelop.teachersDoctortoPatientCommentMedicineReDevelop[i].DoctorCommentsHL) + "\n" + new Date().toLocaleString() + "\n" + this.addrFrom.value.DoctortoPatientCommentMedicineReDevelop.teachersDoctortoPatientCommentMedicineReDevelop[i].DoctorComments;
      }
      this.addrFrom.value.DoctortoPatientCommentMedicineReDevelop.teachersDoctortoPatientCommentMedicineReDevelop[i].DoctorComments = "";

      //this.addrFrom.value.DoctortoPatientCommentMedicine.DoctorComments = "";

      if (this.addrFrom.value.DoctortoPatientCommentMedicineReDevelop.teachersDoctortoPatientCommentMedicineReDevelop[i].MedicineNames !== '') {
        this.addrFrom.value.DoctortoPatientCommentMedicineReDevelop.teachersDoctortoPatientCommentMedicineReDevelop[i].MedicineNamesHL = (this.addrFrom.value.DoctortoPatientCommentMedicineReDevelop.teachersDoctortoPatientCommentMedicineReDevelop[i].MedicineNamesHL == null ? '' : this.addrFrom.value.DoctortoPatientCommentMedicineReDevelop.teachersDoctortoPatientCommentMedicineReDevelop[i].MedicineNamesHL) + "\n" + new Date().toLocaleString() + "\n" + this.addrFrom.value.DoctortoPatientCommentMedicineReDevelop.teachersDoctortoPatientCommentMedicineReDevelop[i].MedicineNames;
      }
      //this.addrFrom.value.DoctortoPatientCommentMedicineReDevelop.teachersDoctortoPatientCommentMedicineReDevelop[i].MedicineNames = "";
    }
    if (this.addrFrom.value.DoctortoPatientCommentMedicine.DoctorComments !== '') {
      this.addrFrom.value.DoctortoPatientCommentMedicine.DoctorCommentsHL = (this.addrFrom.value.DoctortoPatientCommentMedicine.DoctorCommentsHL == null ? '' : this.addrFrom.value.DoctortoPatientCommentMedicine.DoctorCommentsHL) + "\n" + new Date().toLocaleString() + "\n" + this.addrFrom.value.DoctortoPatientCommentMedicine.DoctorComments;
    }
    this.addrFrom.value.DoctortoPatientCommentMedicine.DoctorComments = "";

    if (this.addrFrom.value.DoctortoPatientCommentMedicine.MedicineNames !== '') {
      this.addrFrom.value.DoctortoPatientCommentMedicine.MedicineNamesHL = (this.addrFrom.value.DoctortoPatientCommentMedicine.MedicineNamesHL == null ? '' : this.addrFrom.value.DoctortoPatientCommentMedicine.MedicineNamesHL) + "\n" + new Date().toLocaleString() + "\n" + this.addrFrom.value.DoctortoPatientCommentMedicine.MedicineNames;
    }
    this.addrFrom.value.DoctortoPatientCommentMedicine.MedicineNames = "";

    student.DoctortoPatientCommentMedicine = this.addrFrom.value.DoctortoPatientCommentMedicine;
    student.DischargeNote = this.addrFrom.value.DischargeNote;
    student.DailyExpense = this.addrFrom.value.DailyExpense.teachers;
    student.PharmacyManualEntry = this.addrFrom.value.PharmacyManualEntry.teachersPharmacyManualEntry;
    student.Nebulization = this.addrFrom.value.Nebulization.teachersNebulization;
    student.DoctorVisit = this.addrFrom.value.DoctorVisit.teachersDoctorVisit;
    student.NurseVisit = this.addrFrom.value.NurseVisit.teachersNurseVisit;
    student.DoctortoPatientCommentMedicineReDevelop = this.addrFrom.value.DoctortoPatientCommentMedicineReDevelop.teachersDoctortoPatientCommentMedicineReDevelop;
    student.AmbulanceVisit = this.addrFrom.value.AmbulanceVisit.teachersAmbulanceVisit;
    student.BedDetailsVisit = this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit;
    student.VaccineDetailsVisit = this.addrFrom.value.VaccineDetailsVisit.teachersVaccineDetailsVisit;
    student.OTDetails = this.addrFrom.value.OTDetails.teachersOTDetails;
    student.opdipd = this.addrFrom.value.opdipd;
    student.OPDkimbaIPD = this.addrFrom.value.OPDkimbaIPD;
    student.IPDOPDId = this.addrFrom.value.IPDOPDId;

    //this.employeeIdUpdate="12186089";
    this.child.SavePatientDetails(this.CaseID)
      .subscribe(
        (data) => {
          this.dd = data;
          student.PatientID = data;
          //alert('first in'+ data);
          //console.log(data);
          //alert('patient saved completed');

          //Update vaccine inventory
          if (this.addrFrom.value.VaccineDetailsVisit?.teachersVaccineDetailsVisit.length > 0) {
            for (let i = 0; i < this.addrFrom.value.VaccineDetailsVisit?.teachersVaccineDetailsVisit.length; i++) {
              //this.addrFrom.value.VaccineDetailsVisit.teachersVaccineDetailsVisit[i].CurrentStatus = 'Applied';
              if (this.addrFrom.value.VaccineDetailsVisit?.teachersVaccineDetailsVisit[i].CurrentStatus !== 'Applied') {
                //alert(element.name +'-'+ element.inventoryID);
                if (this.addrFrom.value.VaccineDetailsVisit?.teachersVaccineDetailsVisit[i].VaccineName != '') {
                  var invIDUnique = this.addrFrom.value.VaccineDetailsVisit?.teachersVaccineDetailsVisit[i].VaccineName;
                  var Updateqty = "1";
                  let p: Vaccinations = this.VaccineCategories.find(x => x.VaccineName == invIDUnique)
                  var id = p.UnqueID == undefined ? '0' : p.UnqueID;
                  p.Quantity = (Number(p.Quantity) - Number(Updateqty)).toString();
                  this.vaccineCategoriesService.update(id, p).subscribe(() => {
                    // this.dataSaved = true;
                  });
                }

              }
            }
          }
          //ended

          //Update the bed details
          if (this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit.length > 0) {
            for (let i = 0; i < this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit.length; i++) {
              console.log("Block statement execution no." + i);
              if (this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedCategory !== '' && this.ShowAssignedBedName(i) !== '') {
                //if (bookRelaseOption !== undefined || bookRelaseOption != '') {
                if (this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedForceRelease == 'Occupied') {
                  //alert(this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedForceRelease);
                  this.bedManagementService.updateBedStatus('32176855', this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedCategory,
                    this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedName, 'BOOKED'
                    , (student.home.FirstName + ' ' + student.home.LastName), student.IPDOPDId, this.employeeIdUpdate, student.home.RefferDoctorName == '' ? 'NoDoctor' : student.home.RefferDoctorName).subscribe(aa => {
                      //alert('updated the appointment');
                    });
                }
                else if (this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedForceRelease == 'Release') {
                  //alert(this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedForceRelease);
                  this.bedManagementService.updateBedStatus('32176855', this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedCategory,
                    this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedName, 'OPEN'
                    , (student.home.FirstName + ' ' + student.home.LastName), student.IPDOPDId, this.employeeIdUpdate, student.home.RefferDoctorName == '' ? 'NoDoctor' : student.home.RefferDoctorName).subscribe(aa => {
                      //alert('updated the appointment');
                    });
                }
              }


            }
          }

          //ended here
          if (this.employeeIdUpdate == null) {
            //student.PatientID = data;
            var tempPaidValue = this.addrFrom.value.PaymentDetails.PaidAmount;
            this.addrFrom.value.PaymentDetails.PaidAmount = "0";
            //student.PaymentHistory[0].PaidAmount = 0;
            // alert(student);
            // alert(JSON.stringify(student));
            // console.log(student);
            // console.log(JSON.stringify(student));
            this.addModifyCaseService.createStudent(student).subscribe(
              (test) => {
                this.CaseID = test.UnqueID;
                this.addrFrom.value.PaymentDetails.PaidAmount = tempPaidValue;
                this.paymentDetailsTemplate?.SavePaymentDetails(this.CaseID);

                //maintain Bed availability like occupy or free
                //Update the bed details
                if (this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit.length > 0) {
                  for (let i = 0; i < this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit.length; i++) {
                    console.log("Block statement execution no." + i);
                    if (this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedCategory !== '' && this.ShowAssignedBedName(i) !== '') {
                      //if (bookRelaseOption !== undefined || bookRelaseOption != '') {
                      if (this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedForceRelease == 'Occupied') {
                        //alert(this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedForceRelease);
                        this.bedManagementService.updateBedStatus('32176855', this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedCategory,
                          this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedName, 'BOOKED'
                          , (student.home.FirstName + ' ' + student.home.LastName), test.IPDOPDId, test.UnqueID, student.home.RefferDoctorName).subscribe(aa => {
                            //alert('updated the appointment');
                          });
                      }
                      else if (this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedForceRelease == 'Release') {
                        //alert(this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedForceRelease);
                        this.bedManagementService.updateBedStatus('32176855', this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedCategory,
                          this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedName, 'OPEN'
                          , (student.home.FirstName + ' ' + student.home.LastName), test.IPDOPDId, test.UnqueID, student.home.RefferDoctorName).subscribe(aa => {
                            //alert('updated the appointment');
                          });
                      }
                    }


                  }
                }



                //this.child.SavePatientDetails(this.CaseID);
                if (caseStatus == 'Closed') {
                  alert('Case closed Successfully. ID is ' + this.CaseID);
                }
                else {
                  alert('New case data saved Successfully. ID is ' + test.IPDOPDId);
                }

                //update appointment detail status
                this.appointmentDetailService.getById(this.appntid).subscribe(aa => {
                  if (aa !== null) {
                    aa.AppointmentStatus = "Progress";
                    this.appointmentDetailService.update(this.appntid, aa).subscribe(aa => {
                      //alert('updated the appointment');
                    });
                  }



                });

                this.employeeIdUpdate = null;
                //this.router.navigate(['/CaseDetails', this.CaseID]); //temporary
                this.router.navigate(['/freshCase', test.UnqueID], { queryParams: { username: test.Home.FirstName, newid: test.IPDOPDId } });

              });
          } else {
            var id = this.employeeIdUpdate;
            student.UnqueID = id;
            student.IPDOPDId = this.addrFrom.get("IPDOPDId").value;
            // student.PatientID = "100";
            student.PaymentHistoryID = "101U";
            //student.PaymentHistory.push({ "Amount": 180, "Discount": 40, "PaidAmount": 150, "Balance": 0, "CaseID": "", "ReceivedBy": "liku", "DateStart": "" }) ;
            student.DateStart = this.addrFrom.value.DateStart; //student.DateStart; //"11/12/2020";
            student.PatientID = this.Counter;
            student.ModifiedBy = this.Username;
            student.UserRole = this.Role;
            //alert('update before'+this.Counter);
            var tempPaidValue = this.addrFrom.value.PaymentDetails.PaidAmount;
            this.addrFrom.value.PaymentDetails.PaidAmount = "0";
            //student.PaymentHistory[0].PaidAmount = 0;

            //update the bes status
            if (caseStatus == 'Closed') {
              //Update the bed details
              if (this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit.length > 0) {
                for (let i = 0; i < this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit.length; i++) {
                  console.log("Block statement execution for closed case - no." + i);
                  if (this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedCategory !== '' && this.ShowAssignedBedName(i) !== '') {
                    //if (bookRelaseOption !== undefined || bookRelaseOption != '') {
                    this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedForceRelease = 'Release'
                    if (this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedForceRelease == 'Occupied') {
                      //alert(this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedForceRelease);
                      this.bedManagementService.updateBedStatus('32176855', this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedCategory,
                        this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedName, 'OPEN'
                        , (student.home.FirstName + ' ' + student.home.LastName), student.IPDOPDId, this.CaseID, student.home.RefferDoctorName).subscribe(aa => {
                          //alert('updated the appointment');
                        });
                    }
                    else if (this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedForceRelease == 'Release') {
                      //alert(this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedForceRelease);
                      this.bedManagementService.updateBedStatus('32176855', this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedCategory,
                        this.addrFrom.value.BedDetailsVisit.teachersBedDetailsVisit[i].BedName, 'OPEN'
                        , (student.home.FirstName + ' ' + student.home.LastName), student.IPDOPDId, this.CaseID, student.home.RefferDoctorName).subscribe(aa => {
                          //alert('updated the appointment');
                        });
                    }
                  }


                }
              }

            }

            this.addModifyCaseService.update(id, student).subscribe(() => {
              this.addrFrom.value.PaymentDetails.PaidAmount = tempPaidValue;
              this.paymentDetailsTemplate?.SavePaymentDetails(id);
              if (caseStatus == 'Closed') {
                alert('Case closed Successfully. ID is ' + id);
              }
              else {
                alert('Case data updated Successfully.');
              }
              this.employeeIdUpdate = null;
              //this.router.navigate(['/CaseDetails']);
              //this.router.navigate(['/CaseDetails', id]);
              this.router.navigate(['/freshCase', student.UnqueID], { queryParams: { username: student.home.FirstName, newid: student.IPDOPDId } }
              ).then(() => {
                window.location.reload();
              });

            });
          }
        }
      );



  }
  CloseTheCase() {
    this.FinalCalculation('OPEN');
    this.CreateStudent(new NewModifyCase(), 'Closed');
    // var statusUpdate=new NewModifyCase();
    // statusUpdate.CaseStatus = 'Closed';
    // this.addModifyCaseService.update(this.parValue, statusUpdate).subscribe(() => {
    //   alert('CASE Closed Successfully.');
    //   this.employeeIdUpdate = null;
    //   //this.router.navigate(['/CaseDetails']);
    //   this.router.navigate(['/CaseDetails',this.CaseID ]);
    // });
  }

  newStudent(): FormGroup {
    return this._fb.group({
      TestName: '', TestPrice: ''
    })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
    });
  }
  data11: any;
  GrandTotal: number;
  EditedCaseData: NewModifyCase;
  disableIPDOPDOption: boolean = false;
  patientEntry='active';
  dlExp='active';
  dlPharmaManual='active';
  dlNebulization='active';
  drVisit='active';
  nurseVisit='active';
  manageBed='active';
  drPrescription='active';
  vaccineMan='active';
  labMan='active';
  ambulanceDetails='active';
  otNotes='active';
  follupDet='active';
  medEntry='active';
  dischargeNote='active';
  patchValue2(UnqueID: string) {

    this.addModifyCaseService.getById(UnqueID).subscribe(val => {
      this.data11 = val;
      var data = this.data11;
      if(this.data11?.Home.FirstName ==''){
        this.patientEntry = "col";
    }
      if(this.data11?.DailyExpense[0]?.name ==''){
          this.dlExp = "col";
      }
      if(this.data11?.PharmacyManualEntry != null){
      if(this.data11?.PharmacyManualEntry[0]?.name ==''){
        this.dlPharmaManual = "col";
    }
  }
  if(this.data11?.Nebulization !=null){
    if(this.data11?.Nebulization[0]?.name ==''){
      this.dlNebulization = "col";
  }
}
      
      if(this.data11?.DoctorVisit[0]?.name ==''){
        this.drVisit = "col";
    }
    if(this.data11?.NurseVisit[0]?.name ==''){
      this.nurseVisit = "col";
  }
  if(this.data11?.BedDetailsVisit[0]?.BedName ==''){
    this.manageBed = "col";
}
if(this.data11?.DoctortoPatientCommentMedicineReDevelop[0]?.name ==''){
  this.drPrescription = "col";
}
if(this.data11?.VaccineDetailsVisit[0]?.VaccineName ==''){
  this.vaccineMan = "col";
}

if(this.data11?.AmbulanceVisit[0]?.name ==''){
  this.ambulanceDetails = "col";
}

if(this.data11?.TestNameWithCase.TestType.length < 1){
  this.labMan = "col";
}

if(this.data11?.OTDetails[0]?.OperationName ==''){
  this.otNotes = "col";
}
if(this.data11?.DoctorVisit[0]?.name ==''){
  this.follupDet = "col";
}

if(this.data11?.DischargeNote?.AdviceNote ==''){
  this.dischargeNote = "col";
}


      this.EditedCaseData = val;
      if (this.EditedCaseData?.CaseStatus == 'Closed') {
        this.CaseRecordStatus = false;
      }

      //var p = parseFloat(data.BedandAdmissionHistory[0].TotalPrice);
      var sum: number = 0;
      if (data?.TestNameWithCase?.TestType.length > 0) {
        sum = data.TestNameWithCase.TestType.map(a => a.TotalSum).reduce(function (a, b) {
          return a + b;
        });
      }

      this.clearFormArray();



      let i: number = 0;
      if (this.parValue !== "conv") {
        data?.TestNameWithCase.TestType.forEach(t => {

          var teacher: FormArray = (this.addrFrom.get('CaseDetails').get("TestType") as FormArray); //this.addAllTestsGroup();
          var teacher1: FormGroup = this.addAllTestsGroup('LAB');
          teacher.push(teacher1);
          let p: number = 0;
          const toppingsRootAllTests = (<FormArray>(<FormArray>this.addrFrom.get('CaseDetails').get('TestType')).at(0).get("names"));
          //const toppingsRootAllTests = (<FormArray>this.CaseDetails.get('TestType'))
          let k: number = 0;
          t.names.forEach(m => {
            var teacherInn: FormArray = ((this.addrFrom.get('CaseDetails').get("TestType") as FormArray).at(i).get('names')) as FormArray; //this.addAllTestsGroup();
            var teacher1Inn: FormGroup = this.newStudent();
            teacherInn.push(teacher1Inn);

          })
          k += 1;
          toppingsRootAllTests.patchValue(t.names);
          i += 1;
        });
        this.addrFrom.get('CaseDetails').patchValue(data.TestNameWithCase);
        let toppingsRootAllTests1 = <FormArray>(<FormArray>this.addrFrom.get('CaseDetails').get('TestType'));
      }

      var farmaExpense: number = 0;
      try {
        if (this.farmacyDeliveryToPatientData !== undefined) {
          if (this.farmacyDeliveryToPatientData[0].teachers.length > 0)
            farmaExpense = this.farmacyDeliveryToPatientData[0]?.teachers.reduce((accumulator, current) => accumulator + parseFloat(current.total), 0);
        }

      }
      catch (error) {
      }
      finally {
      }
      data.PaymentHistory[0].FarmaCharge = farmaExpense;


      //this.getTotalVal();
      this.addrFrom.get('BedDetails').patchValue(data.BedandAdmissionHistory[0]);
      //to initialize advancepaymentbox as defult zero. purely xutomization
      data.PaymentHistory[0].EarlierPayment = "0";
      data.PaymentHistory[0].ReceivedBy = this.Username;
      //data.PaymentHistory[0].RegdCharge = "0";
      //data.Home.AdvPayment = "0";
      this.addrFrom.get('PaymentDetails').patchValue(data.PaymentHistory[0]);
      //data.Home.AdvPayment = "0";
      this.addrFrom.get('home').patchValue(data.Home);
      this.child.ShowPatientID(data.Home.FirstName, data.Home.ContactNumber);
      data.DailyExpense?.forEach(t => {

        var teacher: FormArray = (this.addrFrom.get('DailyExpense').get("teachers") as FormArray); //this.addAllTestsGroup();
        var teacher1: FormGroup = this.newDailyExpence();
        teacher.push(teacher1);
      });
      this.addrFrom.get('DailyExpense').get("teachers").patchValue(data.DailyExpense);
      //for Pharmacy Manual visit
      if(data.PharmacyManualEntry!= null){
      data.PharmacyManualEntry?.forEach(t => {

        var teacher: FormArray = (this.addrFrom.get('PharmacyManualEntry').get("teachersPharmacyManualEntry") as FormArray); //this.addAllTestsGroup();
        var teacher1: FormGroup = this.newPharmacyManualEntry();
        teacher.push(teacher1);
      });
      this.addrFrom.get('PharmacyManualEntry').get("teachersPharmacyManualEntry").patchValue(data.PharmacyManualEntry);
    }
      //for Nebilization visit
      if(data.Nebulization !=null){
      data.Nebulization?.forEach(t => {

        var teacher: FormArray = (this.addrFrom.get('Nebulization').get("teachersNebulization") as FormArray); //this.addAllTestsGroup();
        var teacher1: FormGroup = this.newNebulization();
        teacher.push(teacher1);
      });
      this.addrFrom.get('Nebulization').get("teachersNebulization").patchValue(data.Nebulization);
    }
      //for doctor visit
      if (data.DoctorVisit != null) {
        data.DoctorVisit?.forEach(t => {

          var teacher: FormArray = (this.addrFrom.get('DoctorVisit').get("teachersDoctorVisit") as FormArray); //this.addAllTestsGroup();
          var teacher1: FormGroup = this.newDoctorVisit();
          teacher.push(teacher1);
        });
        this.addrFrom.get('DoctorVisit').get("teachersDoctorVisit").patchValue(data.DoctorVisit);
      }

      if (data.NurseVisit != null) {
        data.NurseVisit?.forEach(t => {

          var teacher: FormArray = (this.addrFrom.get('NurseVisit').get("teachersNurseVisit") as FormArray); //this.addAllTestsGroup();
          var teacher1: FormGroup = this.newNurseVisit();
          teacher.push(teacher1);
        });
        this.addrFrom.get('NurseVisit').get("teachersNurseVisit").patchValue(data.NurseVisit);
      }

      if (data.DoctortoPatientCommentMedicineReDevelop != null) {
        data?.DoctortoPatientCommentMedicineReDevelop?.forEach(t => {

          var teacher: FormArray = (this.addrFrom.get('DoctortoPatientCommentMedicineReDevelop').get("teachersDoctortoPatientCommentMedicineReDevelop") as FormArray); //this.addAllTestsGroup();
          var teacher1: FormGroup = this.newDoctortoPatientCommentMedicineReDevelop();
          teacher.push(teacher1);

          t.medicines.forEach(s => {
            (teacher1.get("medicines") as FormArray).push(this.newMedicines())
          })

        });
        //this.addrFrom.get('DoctortoPatientCommentMedicineReDevelop').get("teachersDoctortoPatientCommentMedicineReDevelop").patchValue(data.DoctortoPatientCommentMedicineReDevelop);
        this.addrFrom.get('DoctortoPatientCommentMedicineReDevelop').get("teachersDoctortoPatientCommentMedicineReDevelop").patchValue(data.DoctortoPatientCommentMedicineReDevelop);
      }

      if (data.AmbulanceVisit != null) {
        data.AmbulanceVisit?.forEach(t => {

          var teacher: FormArray = (this.addrFrom.get('AmbulanceVisit').get("teachersAmbulanceVisit") as FormArray); //this.addAllTestsGroup();
          var teacher1: FormGroup = this.newAmbulanceVisit();
          teacher.push(teacher1);
        });
        this.addrFrom.get('AmbulanceVisit').get("teachersAmbulanceVisit").patchValue(data.AmbulanceVisit);
      }


      if (data.BedDetailsVisit != null) {
        data.BedDetailsVisit?.forEach(t => {

          var teacher: FormArray = (this.addrFrom.get('BedDetailsVisit').get("teachersBedDetailsVisit") as FormArray); //this.addAllTestsGroup();
          var teacher1: FormGroup = this.newBedDetailsVisit();
          teacher.push(teacher1);
        });
        this.addrFrom.get('BedDetailsVisit').get("teachersBedDetailsVisit").patchValue(data.BedDetailsVisit);
      }

      if (data.VaccineDetailsVisit != null) {
        data.VaccineDetailsVisit?.forEach(t => {

          var teacher: FormArray = (this.addrFrom.get('VaccineDetailsVisit').get("teachersVaccineDetailsVisit") as FormArray); //this.addAllTestsGroup();
          var teacher1: FormGroup = this.newVaccineDetailsVisit();
          teacher.push(teacher1);
        });
        this.addrFrom.get('VaccineDetailsVisit').get("teachersVaccineDetailsVisit").patchValue(data.VaccineDetailsVisit);
      }


      if (data.OTDetails != null) {
        data.OTDetails?.forEach(t => {

          var teacher: FormArray = (this.addrFrom.get('OTDetails').get("teachersOTDetails") as FormArray); //this.addAllTestsGroup();
          var teacher1: FormGroup = this.newOTDetails();
          teacher.push(teacher1);
        });
        this.addrFrom.get('OTDetails').get("teachersOTDetails").patchValue(data.OTDetails);
      }



      var p = parseFloat(this.EditedCaseData.BedandAdmissionHistory[0].TotalPrice);
      var sum1: number = 0;
      if (this.EditedCaseData.TestNameWithCase.TestType.length > 0) {
        sum1 = this.EditedCaseData.TestNameWithCase.TestType.map(a => a.TotalSum).reduce(function (a, b) {
          return a + b;
        });
      }

      var farmaExpense: number = 40;


      try {
        if (this.farmacyDeliveryToPatientData !== undefined) {
          if (this.farmacyDeliveryToPatientData[0].teachers.length > 0)
            farmaExpense = this.farmacyDeliveryToPatientData[0]?.teachers.reduce((accumulator, current) => accumulator + parseFloat(current.total), 0);
        }

      }
      catch (error) {
      }
      finally {
      }
      data.PaymentHistory[0].FarmaCharge = farmaExpense;
      this.addrFrom.get('opdipd').patchValue(data.opdipd.toString());
      this.addrFrom.get('OPDkimbaIPD').patchValue(data.OPDkimbaIPD.toString());
      this.addrFrom.get('DateStart').patchValue(data.DateStart.toString());
      if (this.parValue == "conv") {
        this.addrFrom.get('OPDkimbaIPD').patchValue(data.OPDkimbaIPD.toString());
      }
      this.addrFrom.get('IPDOPDId').patchValue(data.IPDOPDId.toString());

      //alert(data.OPDkimbaIPD);
      if (data.OPDkimbaIPD == 'IPD') {
        this.disableIPDOPDOption = true;
      }

      // data.PaymentHistory[0].OPDCharge = "100";
      // data.PaymentHistory[0].DoctorCharge = "110";
      data.PaymentHistory[0].LabTestCharge = sum1;
      // data.PaymentHistory[0].FarmaCharge = "100";
      // data.PaymentHistory[0].Amount = "100";

      let totalAmount = parseFloat(data.PaymentHistory[0].OPDCharge) + parseFloat(data.PaymentHistory[0].DoctorCharge) + parseFloat(data.PaymentHistory[0].LabTestCharge) + parseFloat(data.PaymentHistory[0].FarmaCharge);
      data.PaymentHistory[0].Amount = totalAmount.toString();
      this.addrFrom.get('PaymentDetails').patchValue(data.PaymentHistory[0]);
      this.addrFrom.get('OPD').patchValue(data.OPD);
      if (data.OTDetails != null) {
        this.addrFrom.get('OTDetails').patchValue(data.OTDetails);
      }
      if (data.DoctortoPatientCommentMedicine != null) {
        this.addrFrom.get('DoctortoPatientCommentMedicine').patchValue(data.DoctortoPatientCommentMedicine);
      }
      if (data.DischargeNote != null) {
        this.addrFrom.get('DischargeNote').patchValue(data.DischargeNote);
      }

      var OPDCharge = parseFloat(this.addrFrom.value.PaymentDetails.OPDCharge);
      var DoctorCharge = parseFloat(this.addrFrom.value.PaymentDetails.DoctorCharge)

      this.addrFrom.get('opdipd').patchValue(data.opdipd.toString());
      this.addrFrom.get('OPDkimbaIPD').patchValue(data.OPDkimbaIPD.toString());
      this.addrFrom.get('DateStart').patchValue(data.DateStart.toString());
      if (this.parValue == "conv") {
        this.addrFrom.get('OPDkimbaIPD').patchValue('IPD');
        this.addrFrom.get('PaymentDetails').get('OPDCharge').patchValue('0');
      }
      this.addrFrom.get('IPDOPDId').patchValue(data.IPDOPDId.toString());

      this.radioChange(data.opdipd.toString());
      if (data.opdipd.toString() == "4") {
        this.isopdipd = true;
      }
      if (data.opdipd.toString() !== "4") {
        if (this.parValue == "conv") {
          this.radioChangeOPDIPD('IPD');
        }
        else {
          this.radioChangeOPDIPD(data.OPDkimbaIPD.toString());
        }
      }

      this.FinalCalculation('');

    })



  }
  activecol:string="";
  addAllTestsGroup(testName) {
    return this._fb.group({
      Description: [''],
      RefferDoctorName: [''],
      CollectionCenter: [''],
      parentTest: [testName],
      //toppingsControl: [],
      Paid: [],
      Discount: [],
      DiscountType: [],
      TotalSum: [],
      grpPkgName:[],
      names: this._fb.array([])

    });
  }

  newDailyExpence(): FormGroup {
    return this._fb.group({
      name: '',
      ExpenseDescription: '',
      Amount: '',
      expDate: []
      //expDate:''
    })
  }
  newPharmacyManualEntry(): FormGroup {
    return this._fb.group({
      name: '',
      ExpenseDescription: '',
      Amount: '',
      expDate: []
      //expDate:''
    })
  }
  newNebulization(): FormGroup {
    return this._fb.group({
      name: '',
      ExpenseDescription: '',
      Amount: '',
      expDate: []
      //expDate:''
    })
  }

  newDoctorVisit(): FormGroup {
    return this._fb.group({
      name: '',
      ExpenseDescription: '',
      Amount: '',
      expDate: []
      //expDate:''
    })
  }
  newNurseVisit(): FormGroup {
    return this._fb.group({
      name: '',
      ExpenseDescription: '',
      Amount: '',
      expDate: [],
      task1: '',
      task2: '',
      task3: '',
      task4: '',
      task5: '',
      task6: '',
      task7: '',
      task8: '',
      task9: '',
      task10: '',
      drug: '',
      dose: '',
      frequency: '',
      applytime: '',
      others: '',
      //expDate:''
    })
  }
  newDoctortoPatientCommentMedicineReDevelop(): FormGroup {
    return this._fb.group({
      name: '',
      ExpenseDescription: '',
      Amount: '',
      expDate: '',
      DoctorComments: '',
      DoctorCommentsHL: '',
      MedicineNames: '',
      MedicineNamesHL: '',
      PatientHistory: '',
      PatientFinding: '',
      PatientDiagnosis: '',
      PatientPathoLabTestAdvice: '',
      medicines: this._fb.array([])
    })
  }

  newMedicines(): FormGroup {
    return this._fb.group({
      IndMedicineName: '',
      unit: '1',
      noOfTimes: '',
      noOfDays: 'X',
      whichTime: ''
    })
  }

  newAmbulanceVisit(): FormGroup {
    return this._fb.group({
      name: '',
      ExpenseDescription: '',
      Amount: '',
      expDate: [],
      perkm: [],
      totalkm: [],
      total: [],
      drivername: [],
    })
  }
  newBedDetailsVisit(): FormGroup {
    return this._fb.group({
      BedCategory: '',
      BedName: '',
      StartDate: '',
      EndDate: '',
      BedPrice: '',
      BedDescription: '',
      NofDays: '',
      AdmittedBy: '',
      ShiftingReason: '',
      BedCurrentStatus: '',
      BedForceRelease: '',
      Other: '',
    })
  }
  newVaccineDetailsVisit(): FormGroup {
    return this._fb.group({
      VaccineCategory: '',
      BrandName: '',
      CompanyName: '',
      VaccineName: '',
      Quantity: '',
      Unit: '1',
      BatchNumber: '',
      Expiry: '',
      MRP: '',
      Amount: '',
      StartDate: new Date(),
      NextVaccineDate: '',
      VaccinePrice: '',
      VaccineDescription: '',
      NofDays: '',
      DoctorAssigned: '',
      DoctorPrice: '',
      NurseAssigned: '',
      NursePrice: '',
      CurrentStatus: '',
      TotalPrice: '',
      Other: '',

    })
  }
  newOTDetails(): FormGroup {
    return this._fb.group({
      OperationName: [''],
      Date: [''],
      OperationType: [''],
      ConsultationDoctor: ["No"],
      AsstDoctor1: [''],
      AsstDoctor2: [''],
      Nurse1: [''],
      Nurse2: [''],
      Helper1: [''],
      Helper2: [''],
      AnastheticPerson1: [''],
      AnastheticType1: [''],
      AnastheticPerson2: [''],
      AnastheticType2: [''],
      OTTechnician1: [''],
      OTTechnician2: [''],
      OTTechnicianAsst1: [''],
      OTTechnicianAsst2: [''],
      Result: [''],
      Remarks: [''],
      TotalPrice: ['0'],
      OperationMajorMinor: [''],
      OperationNote: ['']
    })
  }

  clearFormArray() {
    (this.addrFrom.get('CaseDetails').get("TestType") as FormArray).clear();
    (this.addrFrom.get('DailyExpense').get("teachers") as FormArray).clear();
    (this.addrFrom.get('PharmacyManualEntry').get("teachersPharmacyManualEntry") as FormArray).clear();
    (this.addrFrom.get('Nebulization').get("teachersNebulization") as FormArray).clear();
    (this.addrFrom.get('DoctorVisit').get("teachersDoctorVisit") as FormArray).clear();
    (this.addrFrom.get('NurseVisit').get("teachersNurseVisit") as FormArray).clear();
    (this.addrFrom.get('DoctortoPatientCommentMedicineReDevelop').get("teachersDoctortoPatientCommentMedicineReDevelop") as FormArray).clear();
    (this.addrFrom.get('AmbulanceVisit').get("teachersAmbulanceVisit") as FormArray).clear();
    (this.addrFrom.get('OTDetails').get("teachersOTDetails") as FormArray).clear();

    //(this.addrFrom.get('OTDetails') as FormArray).clear();
    //this.addrFrom.get('BedDetails').clear();
    //Angular 8 +
    //this.addrFrom.clear();
    //this.CaseDetails.clear();

    //older Versions of angualar
    //while (this.teachers().length) {
    //  this.teachers().removeAt(0);
    //}
  }
  VaccineCategories: Vaccinations[] = [];
  allVaccinations: Vaccinations[] = [];
  LoadAllVaccinations() {
    this.vaccineCategoriesService.getAll().subscribe((data: Vaccinations[]) => {
      //console.log(data);
      this.VaccineCategories = data;

    })
  }

  CancelMe() {
    this.router.navigate(['/home', 37], { queryParams: { username: "Cancel" } });
  }

  AssignPannelVisibility(passID) {
    if (passID == "4") { //4 means pathoLAB , 3 means All
      this.panelOpenStateOPDSH = false;
      this.panelOpenStateLABSH = true;
      this.panelOpenStateDailyExpenseSH = false;
      this.panelOpenStatePharmacyManualEntrySH = false;
      this.panelOpenStateNebulizationSH = false;
      this.panelOpenStateDoctorVisitSH = false;
      this.panelOpenStateNurseVisitSH = false;
      this.panelOpenStateDoctortoPatientCommentMedicineReDevelopSH = false;
      this.panelOpenStateAmbulanceVisitSH = false;
      this.panelOpenDoctortoPatientCommentSH = false;
      this.panelOpenStateBEDSH = false;
      this.panelOpenStateVaccineSH = false;
      this.panelOpenStateOTSH = false;
      this.panelOpenStateDISSH = false;
      this.panelOpenStateBILLSH = true;
      this.panelOpenStatePHSH = true;
      this.panelOpenStatePatientSH = true;
    }


    else {
      if (this.Role == 'Admin' || this.Role == 'SuperAdmin' || this.Role == 'Account' || this.Role == 'Reception') {
        //this.FarmaRole=false;
        this.panelOpenStateOPDSH = true;
        this.panelOpenStateLABSH = true;
        this.panelOpenStateDailyExpenseSH = true;
        this.panelOpenStatePharmacyManualEntrySH = true;
        this.panelOpenStateNebulizationSH = true;
        this.panelOpenStateDoctorVisitSH = true;
        this.panelOpenStateNurseVisitSH = true;
        this.panelOpenStateDoctortoPatientCommentMedicineReDevelopSH = true;
        this.panelOpenStateAmbulanceVisitSH = true;
        this.panelOpenDoctortoPatientCommentSH = true;
        this.panelOpenStateBEDSH = true;
        this.panelOpenStateVaccineSH = true;
        this.panelOpenStateOTSH = true;
        this.panelOpenStateDISSH = true;
        this.panelOpenStateBILLSH = true;
        this.panelOpenStatePHSH = true;
        this.panelOpenStatePatientSH = true;

        this.showBasedOnRole = true;
      }
      else if (this.Role == 'Doctor') {
        //this.FarmaRole=false;      
        this.panelOpenStatePatientSH = true;
        this.panelOpenStateOPDSH = true;
        this.panelOpenStateLABSH = true;
        this.panelOpenStateDailyExpenseSH = false;
        this.panelOpenStatePharmacyManualEntrySH = false;
        this.panelOpenStateNebulizationSH = false;
        this.panelOpenStateDoctorVisitSH = false;
        this.panelOpenStateNurseVisitSH = false;
        this.panelOpenStateDoctortoPatientCommentMedicineReDevelopSH = true;
        this.panelOpenStateAmbulanceVisitSH = false;
        this.panelOpenDoctortoPatientCommentSH = false;
        this.panelOpenStateBEDSH = false;
        this.panelOpenStateVaccineSH = false;
        this.panelOpenStateOTSH = true;
        this.panelOpenStateDISSH = true;
        this.panelOpenStateBILLSH = false;
        this.panelOpenStatePHSH = false;

        this.showBasedOnRole = false;
      }
      else if (this.Role == 'Nurse') {
        //this.FarmaRole=false;      
        this.panelOpenStatePatientSH = true;
        this.panelOpenStateOPDSH = true;
        this.panelOpenStateLABSH = true;
        this.panelOpenStateDailyExpenseSH = false;
        this.panelOpenStatePharmacyManualEntrySH = false;
        this.panelOpenStateNebulizationSH = false;
        this.panelOpenStateDoctorVisitSH = false;
        this.panelOpenStateNurseVisitSH = false;
        this.panelOpenStateDoctortoPatientCommentMedicineReDevelopSH = false;
        this.panelOpenStateAmbulanceVisitSH = false;
        this.panelOpenDoctortoPatientCommentSH = false;
        this.panelOpenStateBEDSH = false;
        this.panelOpenStateVaccineSH = false;
        this.panelOpenStateOTSH = true;
        this.panelOpenStateDISSH = false;
        this.panelOpenStateBILLSH = false;
        this.panelOpenStatePHSH = false;

        this.showBasedOnRole = false;
      }
      else if (this.Role == 'Patho') {
        //this.FarmaRole=false;      
        this.panelOpenStatePatientSH = true;
        this.panelOpenStateOPDSH = false;
        this.panelOpenStateLABSH = true;
        this.panelOpenStateDailyExpenseSH = false;
        this.panelOpenStatePharmacyManualEntrySH = false;
        this.panelOpenStateNebulizationSH = false;
        this.panelOpenStateDoctorVisitSH = false;
        this.panelOpenStateNurseVisitSH = false;
        this.panelOpenStateDoctortoPatientCommentMedicineReDevelopSH = false;
        this.panelOpenStateAmbulanceVisitSH = false;
        this.panelOpenDoctortoPatientCommentSH = false;
        this.panelOpenStateBEDSH = false;
        this.panelOpenStateVaccineSH = false;
        this.panelOpenStateOTSH = false;
        this.panelOpenStateDISSH = false;
        this.panelOpenStateBILLSH = false;
        this.panelOpenStatePHSH = false;

        this.showBasedOnRole = false;
      }
      else {
      }
    }



  }
  datta: any = [{
    "_id": {
      "$binary": {
        "base64": "Y9E32OozJUGhQBZkT5GSGw==",
        "subType": "03"
      }
    },
    "UnqueID": "5594385",
    "DateStart": "12-03-2021",
    "inventoryID": "12204951486",
    "itemName": "chips uncle",
    "stockQty": "70",
    "reorderQty": "20",
    "DateReorder": "2020-12-29T18:30:00.000Z",
    "priorityStatus": 1,
    "ExpireMonth": "2",
    "ExpireYear": "2022",
    "BarCode": "809654325",
    "ItemCode": "FoodBisUn",
    "UnitPrice": "3",
    "SellPrice": "5",
    "Discount": "1",
    "SGST": "2",
    "CGST": "2",
    "IGST": "0",
    "Extra": "extra",
    "Others": "for biscuits"
  }, {
    "_id": {
      "$binary": {
        "base64": "/TXfgIFdbkOonC/fHKRDdg==",
        "subType": "03"
      }
    },
    "BarCode": "809654315",
    "CGST": "2",
    "DateReorder": "2020-12-29T18:30:00.000Z",
    "DateStart": "12/3/2021",
    "Discount": "1",
    "ExpireMonth": "2",
    "ExpireYear": "2022",
    "Extra": "extra",
    "IGST": "0",
    "ItemCode": "med1",
    "Others": "for biscuits",
    "RackPlaceLocation": "",
    "HSNCode": "",
    "UOM": "",
    "BatchNumber": "",
    "SGST": "2",
    "SellPrice": "5",
    "UnitPrice": "3",
    "UnqueID": "5594385",
    "inventoryID": "12203951486",
    "itemName": "med1",
    "priorityStatus": "1",
    "reorderQty": "20",
    "stockQty": "70"
  }, {
    "_id": {
      "$binary": {
        "base64": "LHbhSJ0TLkiWa7DYHtLyIQ==",
        "subType": "03"
      }
    },
    "UnqueID": "4214266788",
    "DateStart": "03-04-2021",
    "inventoryID": "42142667104",
    "itemName": "Cyclophosphamide"
  }
  ];

  results: any;
  changeJSON() {
    this.http.get('/assets/InventoryMaster.json').subscribe(data => {
      this.datta = data;
      for (var i = 0; i < this.datta.length; i++) {

        //console.log(p);
        //console.log(this.datta[i]._id.$binary.base64);
        if (this.datta[i].stockQty != undefined) {
          //this.datta[i].BarCode="809654315";
          this.datta[i].CGST = "2";
          this.datta[i].DateReorder = "2020-12-29T18:30:00.000Z";
          this.datta[i].DateStart = "12/3/2021";
          this.datta[i].Discount = "0";
          this.datta[i].ExpireMonth = "2";
          this.datta[i].ExpireYear = "2022";
          this.datta[i].Extra = "extra";
          this.datta[i].IGST = "0";
          this.datta[i].ItemCode = this.datta[i].itemName;
          this.datta[i].Others = "for biscuits";
          this.datta[i].RackPlaceLocation = "R1";
          this.datta[i].HSNCode = "3004";
          this.datta[i].UOM = "PC";
          this.datta[i].BatchNumber = "A345345";
          this.datta[i].SGST = "2";
          this.datta[i].SellPrice = "15";
          this.datta[i].UnitPrice = "10";
          //this.datta[i].inventoryID="12203951486";
          this.datta[i].itemName = this.datta[i].itemName;
          this.datta[i].priorityStatus = "1";
          this.datta[i].reorderQty = "100";
          this.datta[i].stockQty = "100"
          var s1 = this.datta[i]._id.$binary.base64;
          var s2 = this.datta[i].UnqueID;
          var s3 = this.datta[i].BarCode;
          var s4 = this.datta[i].inventoryID;
          this.datta[i].UnqueID = s2.substring(0, 2) + (i.toString().length == 1 ? '0' + i.toString() : i.toString()) + s2.substring(2 + 2);
          this.datta[i].BarCode = s3.substring(0, 2) + (i.toString().length == 1 ? '0' + i.toString() : i.toString()) + s3.substring(2 + 2);
          this.datta[i].inventoryID = s4.substring(0, 2) + (i.toString().length == 1 ? '0' + i.toString() : i.toString()) + s4.substring(2 + 2);

          this.datta[i]._id.$binary.base64 = s1.substring(0, 2) + (i.toString().length == 1 ? '0' + i.toString() : i.toString()) + 'K' + s1.substring(2 + 3);
          //break;
        }
        else {

          this.datta[i].CGST = "2";
          this.datta[i].DateReorder = "2020-12-29T18:30:00.000Z";
          this.datta[i].DateStart = "12/3/2021";
          this.datta[i].Discount = "0";
          this.datta[i].ExpireMonth = "02";
          this.datta[i].ExpireYear = "2022";
          this.datta[i].Extra = "extra";
          this.datta[i].IGST = "0";
          this.datta[i].ItemCode = this.datta[i].itemName;
          this.datta[i].Others = "for biscuits";
          this.datta[i].RackPlaceLocation = "R1";
          this.datta[i].HSNCode = "3004";
          this.datta[i].UOM = "Bottle";
          this.datta[i].BatchNumber = "A345344";
          this.datta[i].SGST = "2";
          this.datta[i].SellPrice = "15";
          this.datta[i].UnitPrice = "10";
          //this.datta[i].inventoryID="12203951486";
          this.datta[i].itemName = this.datta[i].itemName;
          this.datta[i].priorityStatus = "1";
          this.datta[i].reorderQty = "100";
          this.datta[i].stockQty = "100"
          var s1 = this.datta[i]._id.$binary.base64;
          var s2 = this.datta[i].UnqueID;
          var s3 = this.datta[i].BarCode;
          var s4 = this.datta[i].inventoryID;
          this.datta[i].UnqueID = s2.substring(0, 2) + (i.toString().length == 1 ? '0' + i.toString() : i.toString()) + s2.substring(2 + 2);
          this.datta[i].BarCode = s2.substring(0, 2) + (i.toString().length == 1 ? '0' + i.toString() : i.toString()) + i.toString() + s2.substring(2 + 2);
          this.datta[i].inventoryID = s4.substring(0, 2) + (i.toString().length == 1 ? '0' + i.toString() : i.toString()) + s4.substring(2 + 2);
          this.datta[i]._id.$binary.base64 = s1.substring(0, 2) + (i.toString().length == 1 ? '0' + i.toString() : i.toString()) + 'K' + s1.substring(2 + 3);

        }
      }
    });

  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `
<p>
test works!
</p>
`,
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
