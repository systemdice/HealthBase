import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component'
import { ContactComponent } from './contact.component'
import { ProductComponent } from './product.component'

import { AuthGuardService } from './auth-guard.service';
import { LoginComponent } from './login.component';
import { FreshCaseComponent } from './fresh-case.component';
import { ReferrerPopupComponent } from './Popups/referrer-popup.component';
import { TestCategoriesComponent } from './MasterForms/test-categories.component';
import { UnitsCategoriesComponent } from './MasterForms/units-categories.component';
import { CatagoryMasterComponent } from './MasterForms/catagory-master.component';
import { PatientDetailsComponent } from './patient-details.component';
import { DoctorAvailabilityComponent } from './MasterForms/doctor-availability.component';
import { BarCodeGenerationComponent } from './MasterForms/bar-code-generation.component';
import { BillManagementComponent } from './MasterForms/bill-management.component';
import { ReffersDetailsComponent } from './reffers-details.component';
import { PrintPatientAppointmentComponent } from './Print Reports/print-patient-appointment.component';
import { LabTestReportComponent } from './Print Reports/lab-test-report.component';
import { LabReportComponent } from './MasterForms/lab-report.component';
import { AppointmentDetailsComponent } from './MasterForms/appointment-details.component';
import { AppointmentDashboardComponent } from './ChartReports/appointment-dashboard/appointment-dashboard.component';
import { OtherDetailComponent } from './MasterForms/other-detail.component';
import { HealthDashboardComponent } from './ChartReports/health-dashboard.component';
import { AddQuestionComponent } from './ChartReports/appointment-dashboard/add-question.component';
import { MasterBedComponent } from './MasterForms/master-bed.component';
import { FarmacyEntryComponent } from './MasterForms/farmacy-entry.component';
import { InventoryManagementComponent } from './InventoryDetails/inventory-management/inventory-management.component';
import { BillInvManagementComponent } from './InventoryDetails/bill-inv-management/bill-inv-management.component';
import { BlankLayoutComponent } from './layout/blank-layout/blank-layout.component';
import { MasterLayoutComponent } from './layout/master-layout/master-layout.component';
import { CaseDetailsMainComponent } from './MasterForms/case-details-main.component';
import { BarchartComponent } from './ChartReports/barchart/barchart.component';
import { PiechartComponent } from './ChartReports/piechart/piechart.component';
import { OnlineAppointmentComponent } from './MasterForms/online-appointment.component';
import { LabtestParameterComponent } from './MasterForms/labtest-parameter.component';
import { LabTestMainComponent } from './MasterForms/lab-test-main.component';
import { LabReportIndividualComponent } from './MasterForms/lab-report-individual.component';
import { TestDetailsPendingComponent } from './MasterForms/test-details-pending.component';
import { FarmacyDetailsPendingComponent } from './MasterForms/farmacy-details-pending.component';
import { UserRegistrationComponent } from './MasterForms/user-registration.component';
import { ExpensesComponent } from './custom-components/expenses/expenses.component';
import { CategoriesComponent } from './categories/categories.component';
import { FollowupComponent } from './custom-components/followup/followup.component';
import { ComissionReportComponent } from './MasterForms/comission-report.component';
import { InventoryDashboardComponent } from './InventoryDetails/inventory-dashboard/inventory-dashboard.component';
import { LabReportIndividualAllComponent } from './MasterForms/lab-report-individual-all.component';
import { CaseFarmacyDetailsMainComponent } from './MasterForms/case-farmacy-details-main.component';
import { DischargeReportComponent } from './MasterForms/discharge-report.component';
import { ExpenseIncomeReportComponent } from './MasterForms/expense-income-report.component';
import { FitnessCertificateComponent } from './Certificates/fitness-certificate.component';
import { InjuryDisabilityCertificateComponent } from './Certificates/injury-disability-certificate.component';
import { InjuryTemporaryCertificateComponent } from './Certificates/injury-temporary-certificate.component';
import { PharmacySpendReportComponent } from './MasterForms/pharmacy-spend-report.component';
import { BirthCertificateComponent } from './Certificates/birth-certificate.component';
import { CompanyMasterDataComponent } from './MasterForms/company-master-data.component';
import { CompanyMasterDetailsComponent } from './MasterForms/company-master-details.component';
import { AllUserListComponent } from './MasterForms/all-user-list.component';
import { AnesthesiaNoteComponent } from './Reports/anesthesia-note.component';
import { BloodRequisitionFormComponent } from './Reports/blood-requisition-form.component';
import { CauseDeathFormComponent } from './Reports/cause-death-form.component';
import { ClearanceFormComponent } from './Reports/clearance-form.component';
import { ConsentFormComponent } from './Reports/consent-form.component';
import { VisitorPassComponent } from './Reports/visitor-pass.component';
import { ProgressReportComponent } from './Reports/progress-report.component';
import { PatientRegistrationFirstPageComponent } from './Reports/patient-registration-first-page.component';
import { PrintPrescriptionComponent } from './Reports/print-prescription.component';
import { BedAvailabilityManagementComponent } from './MasterForms/bed-availability-management.component';
import { DischargeReportUniqueComponent } from './Reports/discharge-report-unique.component';
import { AllSalesBillComponent } from './MasterForms/all-sales-bill.component';
import { VaccineCategoriesComponent } from './MasterForms/vaccine-categories.component';
import { BedAdmissionReportComponent } from './Reports/bed-admission-report.component';
import { FreshCaseTabComponent } from './fresh-case-tab.component';
import { MainDashboardComponent } from './MasterForms/main-dashboard.component';
import { StaffWorkLeaveManagementComponent } from './MasterForms/staff-work-leave-management.component';
import { ConsultationReportComponent } from './Reports/consultation-report.component';
import { ContinuationReportComponent } from './Reports/continuation-report.component';
import { NursePrintComponent } from './Reports/nurse-print.component';
import { InputOutputChartComponent } from './Reports/input-output-chart.component';
import { DailyProgressChartComponent } from './Reports/daily-progress-chart.component';
import { PharmacyDoctorCommsionComponent } from './MasterForms/pharmacy-doctor-commsion.component';
import { CreateGroupTestComponent } from './MasterForms/create-group-test.component';
import { AllGroupDetailsComponent } from './MasterForms/all-group-details.component';
import { AccountBookCategoryComponent } from './MasterForms/account-book-category.component';
import { AccountBookGrossComponent } from './MasterForms/account-book-gross.component';


const appRoutes: Routes = [
  {
    path: "",
    component: BlankLayoutComponent,
    children: [
      {
        path: "",
        component: LoginComponent
      },
      {
        path: "onlineappointment",
        component: OnlineAppointmentComponent
      }
    ]
  },
  {
    path: "",
    component: MasterLayoutComponent,
    children: [

      { path: 'home/:id', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'maindashboard', component: MainDashboardComponent, canActivate: [AuthGuardService]  },
      { path: 'contact', component: ContactComponent },
      { path: 'product', component: ProductComponent, canActivate: [AuthGuardService] },
      { path: 'freshCase/:caseType', component: FreshCaseComponent, canActivate: [AuthGuardService] },
      { path: 'freshCaseTab/:caseType', component: FreshCaseTabComponent , canActivate: [AuthGuardService]},
      { path: 'ReferCase', component: ReferrerPopupComponent , canActivate: [AuthGuardService] },
      { path: 'TestCategory', component: TestCategoriesComponent, canActivate: [AuthGuardService]  },
      { path: "AccountBook", component: ExpensesComponent , canActivate: [AuthGuardService]},
      { path: "AccountBookCategory", component: AccountBookCategoryComponent , canActivate: [AuthGuardService]},
      { path: "AccountBookGross", component: AccountBookGrossComponent , canActivate: [AuthGuardService]},
      { path: "Followup", component: FollowupComponent, canActivate: [AuthGuardService]  },
      { path: "Category", component: CategoriesComponent, canActivate: [AuthGuardService]  },

      { path: 'UnitsCategory', component: UnitsCategoriesComponent, canActivate: [AuthGuardService]  },
      { path: 'CatagoryMaster', component: CatagoryMasterComponent, canActivate: [AuthGuardService]  },
      { path: 'PatientDetails', component: PatientDetailsComponent , canActivate: [AuthGuardService] },
      { path: 'DoctorAvail', component: DoctorAvailabilityComponent , canActivate: [AuthGuardService] },
      { path: 'BarCode', component: BarCodeGenerationComponent , canActivate: [AuthGuardService] },
      { path: 'BillManagement', component: BillManagementComponent , canActivate: [AuthGuardService] },
      { path: 'ReffersDetails', component: ReffersDetailsComponent , canActivate: [AuthGuardService] },
      { path: 'PrintPatientAppointment', component: PrintPatientAppointmentComponent , canActivate: [AuthGuardService] },
      { path: 'LabTestReport', component: LabTestReportComponent, canActivate: [AuthGuardService]  },
      { path: 'DichargeReport/:id', component: DischargeReportComponent , canActivate: [AuthGuardService] },
      { path: 'LabReportandFindings/:id', component: LabReportComponent , canActivate: [AuthGuardService] },
      { path: 'AppointmentDetails', component: AppointmentDetailsComponent , canActivate: [AuthGuardService] },
      { path: 'AppointmentDashboard', component: AppointmentDashboardComponent , canActivate: [AuthGuardService] },
      { path: 'HealthDashboard', component: HealthDashboardComponent },
      { path: 'OtherDetail', component: OtherDetailComponent , canActivate: [AuthGuardService] },
      { path: 'AddQuestion', component: AddQuestionComponent , canActivate: [AuthGuardService] },
      { path: 'MasterBed', component: BedAvailabilityManagementComponent , canActivate: [AuthGuardService] },
      { path: 'Farmaentry/:CaseID', component: FarmacyEntryComponent, canActivate: [AuthGuardService]  },
      { path: 'InventoryManagement', component: InventoryManagementComponent, canActivate: [AuthGuardService]  },
      { path: 'SalesBill', component: BillInvManagementComponent, canActivate: [AuthGuardService]  },
      { path: 'InventoryDashboard', component: InventoryDashboardComponent , canActivate: [AuthGuardService] },
      { path: 'CaseDetails', component: CaseDetailsMainComponent, canActivate: [AuthGuardService]  },
      { path: 'CaseDetails/:id', component: CaseDetailsMainComponent, canActivate: [AuthGuardService]  },
      { path: "barChart", component: BarchartComponent },
      { path: "pieChart", component: PiechartComponent },
      { path: "onlineappointment", component: OnlineAppointmentComponent },
      { path: "LabtestParameter/:id", component: LabtestParameterComponent , canActivate: [AuthGuardService] },
      { path: "AllLabtest", component: LabTestMainComponent , canActivate: [AuthGuardService] },
      { path: "LabTestInd/:id/:testname", component: LabReportIndividualComponent , canActivate: [AuthGuardService] },
      { path: "LabTestIndAll/:id/:testname", component: LabReportIndividualAllComponent , canActivate: [AuthGuardService] },
      { path: "TestDetailsPending", component: TestDetailsPendingComponent , canActivate: [AuthGuardService] },
      { path: "FarmacyDetailsPending", component: FarmacyDetailsPendingComponent , canActivate: [AuthGuardService] },
      { path: "ComissionReport", component: ComissionReportComponent , canActivate: [AuthGuardService] },
      { path: "CaseFarmacyDetails", component: CaseFarmacyDetailsMainComponent , canActivate: [AuthGuardService] },
      { path: "ExpenseIncome", component: ExpenseIncomeReportComponent , canActivate: [AuthGuardService] },
      { path: "PharmacyBillReport", component: PharmacySpendReportComponent , canActivate: [AuthGuardService] },
      { path: "Fitness", component: FitnessCertificateComponent , canActivate: [AuthGuardService] },
      { path: "InjuryDisability", component: InjuryDisabilityCertificateComponent , canActivate: [AuthGuardService] },
      { path: "InjuryTemp", component: InjuryTemporaryCertificateComponent , canActivate: [AuthGuardService] },
      { path: "BirthCertificate", component: BirthCertificateComponent , canActivate: [AuthGuardService] },
      { path: "UserReg/:option", component: UserRegistrationComponent , canActivate: [AuthGuardService] },
      { path: "CompanyMaster/:CaseID", component: CompanyMasterDataComponent , canActivate: [AuthGuardService] },
      { path: "CompanyMasterAllData", component: CompanyMasterDetailsComponent , canActivate: [AuthGuardService] },
      { path: "AnesthesiaNote", component: AnesthesiaNoteComponent , canActivate: [AuthGuardService] },
      { path: "BloodRequisitionForm", component: BloodRequisitionFormComponent , canActivate: [AuthGuardService] },
      { path: "CauseDeathForm", component: CauseDeathFormComponent , canActivate: [AuthGuardService] },
      { path: "ClearanceForm", component: ClearanceFormComponent , canActivate: [AuthGuardService] },
      { path: "ConsentForm", component: ConsentFormComponent , canActivate: [AuthGuardService] },
      { path: "VisitorPass", component: VisitorPassComponent , canActivate: [AuthGuardService] },
      { path: "ProgressReport", component: ProgressReportComponent , canActivate: [AuthGuardService] },
      { path: "PatientReg", component: PatientRegistrationFirstPageComponent , canActivate: [AuthGuardService] },
      { path: "PrintPrescription", component: PrintPrescriptionComponent , canActivate: [AuthGuardService] },
      { path: "BedAvailability", component: BedAvailabilityManagementComponent , canActivate: [AuthGuardService] },
      { path: "Discharge", component: DischargeReportUniqueComponent , canActivate: [AuthGuardService] },
      { path: "CreditCashBill", component: AllSalesBillComponent , canActivate: [AuthGuardService] },
      { path: "Vaccine", component: VaccineCategoriesComponent , canActivate: [AuthGuardService] },
      { path: "BedAdmissionReport", component: BedAdmissionReportComponent , canActivate: [AuthGuardService] },
      { path: "LeaveMangement", component: StaffWorkLeaveManagementComponent , canActivate: [AuthGuardService] },
      { path: "Consultation", component: ConsultationReportComponent , canActivate: [AuthGuardService] },
      { path: "Continuation", component: ContinuationReportComponent , canActivate: [AuthGuardService] },
      { path: "UserList", component: AllUserListComponent , canActivate: [AuthGuardService] },
      { path: "NursesChart", component: NursePrintComponent , canActivate: [AuthGuardService] },
      { path: "InOutChart", component: InputOutputChartComponent, canActivate: [AuthGuardService]  },
      { path: "DailyProgress", component: DailyProgressChartComponent , canActivate: [AuthGuardService] },
      { path: "PharmaDoctorCommission", component: PharmacyDoctorCommsionComponent , canActivate: [AuthGuardService] },
      { path: "GroupTest", component: AllGroupDetailsComponent, canActivate: [AuthGuardService] },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ]
  },


];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


// export const appRoutes: Routes = [
//   { path: 'home/:id', component: HomeComponent },
//   { path: 'login', component:LoginComponent },
//   { path: 'contact', component: ContactComponent },
//   { path: 'product', component: ProductComponent, canActivate : [AuthGuardService] },
//   { path: 'freshCase/:caseType', component: FreshCaseComponent },
//   { path: 'ReferCase', component: ReferrerPopupComponent },
//   { path: 'TestCategory', component: TestCategoriesComponent },
//   { path: 'UnitsCategory', component: UnitsCategoriesComponent },
//   { path: 'CatagoryMaster', component: CatagoryMasterComponent },
//   { path: 'PatientDetails', component: PatientDetailsComponent },
//   { path: 'DoctorAvail', component: DoctorAvailabilityComponent },
//   { path: 'BarCode', component: BarCodeGenerationComponent },
//   { path: 'BillManagement', component: BillManagementComponent },
//   { path: 'ReffersDetails', component: ReffersDetailsComponent },
//   { path: 'PrintPatientAppointment', component: PrintPatientAppointmentComponent },
//   { path: 'LabTestReport', component: LabTestReportComponent },
//   { path: 'LabReportandFindings', component: LabReportComponent },
//   { path: 'AppointmentDetails', component: AppointmentDetailsComponent },
//   { path: 'AppointmentDashboard', component: AppointmentDashboardComponent },
//   { path: 'HealthDashboard', component: HealthDashboardComponent },
//   { path: 'OtherDetail', component: OtherDetailComponent },
//   { path: 'AddQuestion', component: AddQuestionComponent },
//   { path: 'MasterBed', component: MasterBedComponent },
//   { path: 'Farmaentry', component: FarmacyEntryComponent },
//   { path: 'InventoryManagement', component: InventoryManagementComponent },
//   { path: 'SalesBill', component: BillInvManagementComponent },
//   { path: '', redirectTo: 'login', pathMatch: 'full' },
// ];
