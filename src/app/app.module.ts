//import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgForm } from '@angular/forms';

import { RouterModule } from '@angular/router';
// import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
// import timeGridWeek from '@fullcalendar/timegrid'; // a plugin
// import interactionPlugin from '@fullcalendar/interaction'; // a plugin
// import { Calendar } from '@fullcalendar/core'; // include this line
import { NgxBarcodeModule } from 'ngx-barcode';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component'
import { ContactComponent } from './contact.component'
import { ProductComponent } from './product.component' 

import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';
import { LoginComponent } from './login.component';
import { ProductService } from './product.service';
import { AppMaterialModule } from './module/app-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidAddressDirective } from './valid-address.directive';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FreshCaseComponent } from './fresh-case.component';
import { PatientDetailsComponent } from './patient-details.component';
import { ErrorComponent } from './error.component';
import { CaseDetailsComponent } from './case-details.component';
import { ReffersDetailsComponent } from './reffers-details.component';
import { RatelistDetailsComponent } from './ratelist-details.component';
import { ReferrerPopupComponent } from './Popups/referrer-popup.component';
import { DeptInvestigationComponent } from './Popups/dept-investigation.component';
import { PaymentDetailsComponent } from './payment-details.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RefaralService } from './Services/referal.service';
import { TestCategoriesComponent } from './MasterForms/test-categories.component';
import { UnitsCategoriesComponent } from './MasterForms/units-categories.component';
import { DialogBoxComponent } from './Popups/dialog-box.component';
import { UnitsCategoryService } from './Services/units-category.service';
import { TestsCategoryService } from './Services/tests-category.service';
import { CatagoryMasterComponent } from './MasterForms/catagory-master.component';
import { DialogueBoxCatagoryComponent } from './Popups/dialogue-box-catagory.component';
import { CategoryMasterService } from './Services/category-master.service';
import { DialogBoxUnitUnitsComponent } from './Popups/dialog-box-unit-units.component';
import { DialogBoxPatientComponent } from './Popups/dialog-box-patient.component';
import { PatientDetailsService } from './Services/patient-details.service';
import { PataientDetailMainComponent } from './pataient-detail-main.component';
import { BillManagementComponent } from './MasterForms/bill-management.component';
import { DoctorAvailabilityComponent } from './MasterForms/doctor-availability.component';
import { EventsService } from './Services/events.service';
import { BarCodeGenerationComponent } from './MasterForms/bar-code-generation.component';
import { ColorPickerComponent } from './components/color-picker.component';
import { QRCodeModule } from 'angularx-qrcode';
import { PatientBillReportComponent } from './components/patient-bill-report.component';
import { LoadingComponent } from './components/loading.component';
import { LoadingService } from './Services/loading.service';
import { LoadingInterceptor } from './Services/loading.interceptor';
import { PrintPatientAppointmentComponent } from './Print Reports/print-patient-appointment.component';
import { MainPrintPatientAppointmentComponent } from './Print Reports/main-print-patient-appointment.component';
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { LabTestReportComponent } from './Print Reports/lab-test-report.component';
import { LabReportComponent } from './MasterForms/lab-report.component';
import { AppointmentDetailsComponent } from './MasterForms/appointment-details.component';
import { AppointmentDetailService } from './Services/appointment-detail.service';
import { AppointmentDashboardComponent } from './ChartReports/appointment-dashboard/appointment-dashboard.component';

import { ChartsModule, ThemeService } from 'ng2-charts';
import { OtherServicesService } from './Services/other-services.service';
import { OtherDetailComponent } from './MasterForms/other-detail.component';
import { AvailabilityService } from './Services/availability.service';
import { HealthDashboardComponent } from './ChartReports/health-dashboard.component';
import { AddQuestionComponent } from './ChartReports/appointment-dashboard/add-question.component';
import { AddQuestionService } from './Services/add-question.service';
import { MasterBedComponent } from './MasterForms/master-bed.component';
import { FarmacyEntryComponent } from './MasterForms/farmacy-entry.component';
import { FarmacyEntryService } from './Services/farmacy-entry.service';
import { InventoryManagementComponent } from './InventoryDetails/inventory-management/inventory-management.component';
import { SalesManagementComponent } from './InventoryDetails/sales-management/sales-management.component';
import { BillInvManagementComponent } from './InventoryDetails/bill-inv-management/bill-inv-management.component';
import { InventoryDashboardComponent } from './InventoryDetails/inventory-dashboard/inventory-dashboard.component';
import { InventoryService } from './Services/inventory.service';
import { StorageService } from './shared/storage.service';
import { BlankLayoutComponent } from './layout/blank-layout/blank-layout.component';
import { MasterLayoutComponent } from './layout/master-layout/master-layout.component';
import { AppRoutingModule } from './app.routes';
import { AddModifyCaseService } from './Services/add-modify-case.service';
import { PaymentHistoryService } from './Services/payment-history.service';
import { CaseDetailsMainComponent } from './MasterForms/case-details-main.component';
import { OutdoorMasterComponent } from './MasterForms/outdoor-master.component';
import { PaymentHistoryComponent } from './MasterForms/payment-history.component';
import { DailyExpenseComponent } from './MasterForms/daily-expense.component';
import { BarchartComponent } from './ChartReports/barchart/barchart.component';
import { PiechartComponent } from './ChartReports/piechart/piechart.component';
import { OnlineAppointmentComponent } from './MasterForms/online-appointment.component';
import { LabtestParameterComponent } from './MasterForms/labtest-parameter.component';
import { LabTestMainComponent } from './MasterForms/lab-test-main.component';
import { LabTestMainService } from './Services/lab-test-main.service';
import { LabReportIndividualComponent } from './MasterForms/lab-report-individual.component';
import { LabTestIndividualService } from './Services/lab-test-individual.service';
import { TestDetailsPendingComponent } from './MasterForms/test-details-pending.component';
import { FarmacyDetailsPendingComponent } from './MasterForms/farmacy-details-pending.component';
import { UserRegistrationComponent } from './MasterForms/user-registration.component';
import { DisableDirectiveDirective } from './MasterForms/disable-directive.directive';
import { UserDetailsService } from './Services/user-details.service';
import { CategoriesComponent } from './categories/categories.component';
import { ExpensesComponent } from './custom-components/expenses/expenses.component';
import { ExpenseItemComponent } from './custom-components/expense-item/expense-item.component';
import { ExpensesCategoryComponent } from './expenses-category/expenses-category.component';
import { FollowupComponent } from './custom-components/followup/followup.component';
import { FollowupItemComponent } from './custom-components/followup-item/followup-item.component';
import { FollowupCategoryComponent } from './expenses-category/followup-category.component';
import { FollowupService } from './shared/followup.service';
import { TestDetailsMainComponent } from './MasterForms/test-details-main.component';
import { ComissionReportComponent } from './MasterForms/comission-report.component';
import { DoctorRegularFollowupComponent } from './MasterForms/doctor-regular-followup.component';
import { LabReportIndividualAllComponent } from './MasterForms/lab-report-individual-all.component';
import { PathoAssignmentComponent } from './MasterForms/DoctorNursePatho/patho-assignment.component';
import { NurseAssignmentComponent } from './MasterForms/DoctorNursePatho/nurse-assignment.component';
import { DoctotPatientAssignmentComponent } from './MasterForms/DoctorNursePatho/doctot-patient-assignment.component';
import { FarmacyPatientDetailsComponent } from './MasterForms/DoctorNursePatho/farmacy-patient-details.component';
import { CaseFarmacyDetailsMainComponent } from './MasterForms/case-farmacy-details-main.component';
import { OtAssignmentComponent } from './MasterForms/ot-assignment.component';
import { DischargeReportComponent } from './MasterForms/discharge-report.component';
import { ExpenseIncomeReportComponent } from './MasterForms/expense-income-report.component';
import { FitnessCertificateComponent } from './Certificates/fitness-certificate.component';
import { InjuryDisabilityCertificateComponent } from './Certificates/injury-disability-certificate.component';
import { InjuryTemporaryCertificateComponent } from './Certificates/injury-temporary-certificate.component';
import { PharmacySpendReportComponent } from './MasterForms/pharmacy-spend-report.component';
import { BirthCertificateComponent } from './Certificates/birth-certificate.component';
import { CompanyMasterDataComponent } from './MasterForms/company-master-data.component';
import { CompanyMasterDetailsService } from './Services/comapny-master-details.service';
import { CompanyMasterDetailsComponent } from './MasterForms/company-master-details.component';
import { AllUserListComponent } from './MasterForms/all-user-list.component';
import { PatientRegistrationFirstPageComponent } from './Reports/patient-registration-first-page.component';
import { VisitorPassComponent } from './Reports/visitor-pass.component';
import { ProgressReportComponent } from './Reports/progress-report.component';
import { PPedriaticNoteComponent } from './Reports/p-pedriatic-note.component';
import { OTNoteComponent } from './Reports/ot-note.component';
import { OTListComponent } from './Reports/ot-list.component';
import { OperationRecordComponent } from './Reports/operation-record.component';
import { NNurseChartComponent } from './Reports/n-nurse-chart.component';
import { InputOutputChartComponent } from './Reports/input-output-chart.component';
import { FinalBillComponent } from './Reports/final-bill.component';
import { DailyProgressChartComponent } from './Reports/daily-progress-chart.component';
import { ContinuationReportComponent } from './Reports/continuation-report.component';
import { ConsentFormComponent } from './Reports/consent-form.component';
import { ClearanceFormComponent } from './Reports/clearance-form.component';
import { CauseDeathFormComponent } from './Reports/cause-death-form.component';
import { BloodRequisitionFormComponent } from './Reports/blood-requisition-form.component';
import { AnesthesiaNoteComponent } from './Reports/anesthesia-note.component';
import { PrintPrescriptionComponent } from './Reports/print-prescription.component';
import { PatientDischargeNoteComponent } from './MasterForms/patient-discharge-note.component';
import { BedAvailabilityManagementComponent } from './MasterForms/bed-availability-management.component';
import { BedPatientManagementComponent } from './MasterForms/bed-patient-management.component';
import { AmbulanceManagementComponent } from './MasterForms/ambulance-management.component';
import { LabReportIndividualPopupComponent } from './MasterForms/lab-report-individual-popup.component';
import { PatientHeaderComponent } from './components/patient-header.component';
import { NursePrintComponent } from './Reports/nurse-print.component';
import { OtPrintComponent } from './Reports/ot-print.component';
import { DoctorReportPrintComponent } from './Reports/doctor-report-print.component';
import { PatientPrintComponent } from './Reports/patient-print.component';
import { PharmacyReportPrintComponent } from './Reports/pharmacy-report-print.component';
import { DoctorPatientAssignmentRedevComponent } from './MasterForms/doctor-patient-assignment-redev.component';
import { DischargeReportUniqueComponent } from './Reports/discharge-report-unique.component';
import { AllSalesBillComponent } from './MasterForms/all-sales-bill.component';
import { PrintBillComponent } from './Reports/print-bill.component';
import { VaccinePatientManagementComponent } from './MasterForms/vaccine-patient-management.component';
import { VaccineCategoriesComponent } from './MasterForms/vaccine-categories.component';
import { DialogBoxVaccinesComponent } from './Popups/dialog-box-vaccines.component';
import { VaccinationsCategoryService } from './Services/vaccines-category.service';
import { BedAdmissionReportComponent } from './Reports/bed-admission-report.component';
import { OpdTicketReportComponent } from './Reports/opd-ticket-report.component';
import { PrintBillCountService } from './Services/print-bill-count.service';
import { FreshCaseTabComponent } from './fresh-case-tab.component';
import { MainDashboardComponent } from './MasterForms/main-dashboard.component';
import { StaffWorkLeaveManagementComponent } from './MasterForms/staff-work-leave-management.component';
import { LeaveMasterComponent } from './MasterForms/leave-master.component';
import { LeaveRequestMainComponent } from './MasterForms/leave-request-main.component';
import { LeaveManagementService } from './Services/leave-management.service';
import { CasePaymentFilterComponent } from './MasterForms/case-payment-filter.component';
import { HelpPageComponent } from './MasterForms/help-page.component';
import { CalculatorComponent } from './custom-components/calculator.component';
import { ScreenResolutionService } from './shared/screen-resolution.service';
import { NgShortcutModule, NgShortcutConfig } from 'ng-shortcut';
import { ConsultationReportComponent } from './Reports/consultation-report.component';
import { PharmacyDoctorCommsionComponent } from './MasterForms/pharmacy-doctor-commsion.component';
import { CreateGroupTestComponent } from './MasterForms/create-group-test.component';
import { GrouTestService } from './Services/grou-test.service';
import { AllGroupDetailsComponent } from './MasterForms/all-group-details.component';
import { AccountBookCategoryComponent } from './MasterForms/account-book-category.component';
import { AccountBookGrossComponent } from './MasterForms/account-book-gross.component';
// import { MomentDateModule } from '@angular/material-moment-adapter';
// import { MAT_DATE_FORMATS } from '@angular/material/core';
// import { MY_DATE_FORMATS } from './models/AllConstansts';
//import { appRoutes } from './app.routes';
//import { MAT_DATE_FORMATS } from '@angular/material/core';

// FullCalendarModule.registerPlugins([ // register FullCalendar plugins
//   dayGridPlugin,
//   interactionPlugin,
//   timeGridWeek
// ]);

const shortcutConfig: NgShortcutConfig[] = [
  {
    id: '@save',
    key: 'F2',
    preventDefault: true
  },
    {
    id: '@cancel',
    key: 'F3',
    preventDefault: true
  }
]

@NgModule({
  declarations: [
    AppComponent, HomeComponent, ContactComponent, ProductComponent, 
    LoginComponent,
    BlankLayoutComponent,
    MasterLayoutComponent,
    ValidAddressDirective, FreshCaseComponent,
    PatientDetailsComponent, ErrorComponent, CaseDetailsComponent, ReffersDetailsComponent, RatelistDetailsComponent,
    ReferrerPopupComponent, DeptInvestigationComponent, PaymentDetailsComponent, TestCategoriesComponent, UnitsCategoriesComponent,
    DialogBoxComponent, CatagoryMasterComponent, DialogueBoxCatagoryComponent, DialogBoxUnitUnitsComponent,
    DialogBoxPatientComponent, PataientDetailMainComponent, BillManagementComponent,
    DoctorAvailabilityComponent,
    BarCodeGenerationComponent,
    ColorPickerComponent,
    PatientBillReportComponent,
    LoadingComponent,
    PrintPatientAppointmentComponent,
    MainPrintPatientAppointmentComponent,
    LabTestReportComponent,
    LabReportComponent,
    AppointmentDetailsComponent,
    AppointmentDashboardComponent,
    OtherDetailComponent,
    HealthDashboardComponent,
    AddQuestionComponent,
    MasterBedComponent,
    FarmacyEntryComponent,
    InventoryManagementComponent,
    SalesManagementComponent,
    InventoryDashboardComponent,
    BillInvManagementComponent,
    InventoryDashboardComponent,
    CaseDetailsMainComponent,
    OutdoorMasterComponent,
    PaymentHistoryComponent,
    DailyExpenseComponent,
    BarchartComponent,
    PiechartComponent,
    OnlineAppointmentComponent,
    LabtestParameterComponent,
    LabTestMainComponent,
    LabReportIndividualComponent,
    LabReportIndividualAllComponent,
    TestDetailsPendingComponent,
    FarmacyDetailsPendingComponent,
    UserRegistrationComponent,
    DisableDirectiveDirective,
    CategoriesComponent,
    ExpensesComponent,
    ExpenseItemComponent,ExpensesCategoryComponent,
    FollowupComponent,LabReportIndividualPopupComponent,
    FollowupItemComponent,FollowupCategoryComponent, TestDetailsMainComponent, ComissionReportComponent, 
    DoctorRegularFollowupComponent, PathoAssignmentComponent, NurseAssignmentComponent, 
    DoctotPatientAssignmentComponent, FarmacyPatientDetailsComponent,CaseFarmacyDetailsMainComponent,
     OtAssignmentComponent,DischargeReportComponent,ExpenseIncomeReportComponent, FitnessCertificateComponent, 
     InjuryDisabilityCertificateComponent, InjuryTemporaryCertificateComponent, PharmacySpendReportComponent, BirthCertificateComponent, 
     CompanyMasterDataComponent, CompanyMasterDetailsComponent, AllUserListComponent, PatientRegistrationFirstPageComponent, 
     VisitorPassComponent, ProgressReportComponent, PPedriaticNoteComponent, OTNoteComponent, OTListComponent, OperationRecordComponent, 
     NNurseChartComponent, InputOutputChartComponent, FinalBillComponent, DailyProgressChartComponent, ContinuationReportComponent,
      ConsentFormComponent, ClearanceFormComponent, CauseDeathFormComponent, BloodRequisitionFormComponent, AnesthesiaNoteComponent, 
      PrintPrescriptionComponent, PatientDischargeNoteComponent, BedAvailabilityManagementComponent, BedPatientManagementComponent, 
      AmbulanceManagementComponent, PatientHeaderComponent, NursePrintComponent, OtPrintComponent, DoctorReportPrintComponent, 
      PatientPrintComponent,  PharmacyReportPrintComponent,  
      DoctorPatientAssignmentRedevComponent, DischargeReportUniqueComponent, AllSalesBillComponent, PrintBillComponent, 
      VaccinePatientManagementComponent, VaccineCategoriesComponent, DialogBoxVaccinesComponent, BedAdmissionReportComponent,
       OpdTicketReportComponent, FreshCaseTabComponent, MainDashboardComponent, StaffWorkLeaveManagementComponent,
        LeaveMasterComponent, LeaveRequestMainComponent, CasePaymentFilterComponent, HelpPageComponent, CalculatorComponent,
         ConsultationReportComponent, PharmacyDoctorCommsionComponent, CreateGroupTestComponent, AllGroupDetailsComponent, 
         AccountBookCategoryComponent, AccountBookGrossComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,    
    AppMaterialModule,
    AppRoutingModule,
    ChartsModule,
    FlexLayoutModule,
    HttpClientModule,
    //FullCalendarModule,
    NgxBarcodeModule,
    QRCodeModule,
    MatDialogModule,
    //MomentDateModule
    //RouterModule.forRoot(appRoutes)
    NgShortcutModule.forRoot(shortcutConfig) 
  ],
  providers: [ThemeService,StorageService,AuthGuardService, AuthService,PaymentHistoryService,AddModifyCaseService,
     ProductService,AddQuestionService,InventoryService, FarmacyEntryService,RefaralService, UnitsCategoryService,
     AvailabilityService, TestsCategoryService,LabTestIndividualService, LabTestMainService,CategoryMasterService,
      PatientDetailsService, EventsService,AppointmentDetailService,OtherServicesService,LoadingService,DatePipe,
      UserDetailsService,FollowupService,CompanyMasterDetailsService,VaccinationsCategoryService,PrintBillCountService,
      LeaveManagementService,ScreenResolutionService,GrouTestService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    {
       provide: MatDialogRef, useValue: {}
     }
    //  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
    
  ],
  bootstrap: [AppComponent],
  entryComponents: [DeptInvestigationComponent,  DialogBoxComponent, DialogueBoxCatagoryComponent, BedAvailabilityManagementComponent,
    DialogBoxUnitUnitsComponent,ReffersDetailsComponent,LabtestParameterComponent,LabReportIndividualPopupComponent,LabReportComponent,
    , DialogBoxPatientComponent,PrintPatientAppointmentComponent,PrintPrescriptionComponent,DischargeReportComponent,LeaveRequestMainComponent,
    ExpenseItemComponent,ExpensesCategoryComponent,FollowupItemComponent,FollowupCategoryComponent,PrintBillComponent,DialogBoxVaccinesComponent,
    CasePaymentFilterComponent,HelpPageComponent,CalculatorComponent,CreateGroupTestComponent]

})

export class AppModule { }