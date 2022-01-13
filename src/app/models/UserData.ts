import { gender, Paramters } from './AllConstansts';

export type Appointment = {
  id?: string;
  start?: Date;
  end?: Date;
  title?: string;
  allDay?: boolean;
}

export class Emoployee {


  idf: string = "test";
  name: string;
  age: number;
}
export class TestUser {
  "UnqueID": string;
  "Description": string;
  "Name": string;
  "FirstName": string;
}
export class User {
  id: number;
  Name: string;
  Category: string;
  Price: number;
  Country: string;
  State: string;
  Active: boolean;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  token: string;
  fatherName: string;
  motherName: string;
  gender: string;
  hobbies: string[];
  contactNumber: string;
  joiningYear: string;
  schoolYear: string;
  studentType: string;
  emailAddress: string;
  emgContactNumber: string;
  currAddress: string;
  permAddress: string;
  healthDetails: string;
  langKnown: string;
  totalAmt: string;
  selectedCountryControl: string;
  selectedCountryControlT2: string;
  selectedCountryControlT3: string;
  selectedCountryControlT4: string;
  dateStart: string;
  dateEnd: string;
  className: string;
  file: string;
}

export class ColorPalette {
  name: string;
  value: string;
  foreground: string;
}

export class Expense {

  id: number;
  Name: string;
  Purpose: string;
  Identity: string;
  TransType: string;
  TransDetails: string;
  TransStatus: string;
  Active: boolean;
  username: string;
  Who: string;
  Month: string;
  Year: string;
  TransDate: Date;
  Approval: string;
}

export class GraphData {
  Name: string;
  Who: string;
}

export class UserRegistartion {

  UnqueID: string;
  Username: string;
  Password: string;
  FirstName: string;
  LastName: string;
  Token: string;
  Category: string;
  Country: string;
  State: string;
  Active: boolean;
  Gender: string;
  ContactNumber: string;
  Role: string;
  EmailAddress: string;
  Address: string;
  DateStart: string;
  DateEnd: Date;
  hobbies: string;
  ShouldCommit: boolean;

}

export class UnitsCategory {
  UnqueID: string;
  Name: string;
  Description: string;
}

export class Vaccinations {
  
        UnqueID: string;
        VSID: string;
        SlNO: string;
        Description: string;
        Name: string;
        Status: string;
        DateStart: string;
        UpdateDate: string;
        DateEnd: string;
        AddUpdateBy: string;

        VaccineCategory: string;
        BrandName: string;
        CompanyName: string;
        VaccineName: string;
        Quantity: string;
        Unit: string;
        BatchNumber: string;
        Expiry: string;
        ExpiryMonth : string;
    ExpiryYear: string;
        ExpiryStatus: string;
        ExpiryDayRemaining: string;
        MRP: string;
        Amount: string;
        Other: string;

        hsn:string;
      mfg:string;
      free:string;
      discount:string;
      cgst:string;
      sgst:string;
      gst:string;
}

export class TestsCategory {
  UnqueID: string;
  Name: string;
  ShortName: string;
  Category: string;
  Fee: number;
  Method: string;
  Instrument: string;
  ResultTypeDoc: boolean;

  Notes: string;
  Comments: string;
  Interpretation: string;

  Parameters: Paramters[];
  ReferenceRange: ReferenceRange[];
}

export class Timeslot {
  title:string;
  start:string;
  end:string;
  date:string;
}
export class Availability {
  UnqueID:string;
  Name:string;
  PesronAvailability: Timeslot[];
}
export interface Availability1 {
  UnqueID:string;
  Name:string;
  PesronAvailability: Timeslot[];
}

export class AppointmentDetail {
  UnqueID: string;
  DateStart:string;
  PatientDetails :PatientDetails;
  ReferralMaster :ReferralMaster ;
  AppointmentStatus : string;
  AppointmentCharge : string;
  AppointmentPaymentMode : string;
  AppointmentPaymentStatus : string;
}
export class other{

  username:string; 
  password:string
   
   //constructor 
   constructor(username:string,password:string) { 
      this.username = username; 
      this.password = password; 
   } 
}

export class PatientDetails {
  

  UnqueID:string;
        Title:string;
        UserName:string;
        FirstName:string;
        LastName:string;
        Year:string;
        Month:string; 
        Days:string;
        DOB:string;
        Gender:string;
        Email:string;
        ContactNumber:string;
        Address:string;
        Status:string;
        AppointmentID:string;
        CaseID:string;
        BedID:string;
        TestID:string;
        NewID:string;
        OtherID:string;
        Relationship:string;
        Pregnancy:string;
        PatientCategory:string;
        RefferDoctorName:string;
        PermananetAddress :string;
        OfficeAddress :string;
        MaritalStatus :string;
        CO :string;
        Religion :string;
        Occupation :string;
        BloodGroup :string;
        AssignedPharma :string;
        AssignedDept :string;
        Allergy :string;
        Height :string;
        Weight :string;
        Temperature:string;
        RespiratoryRate:string;
        RhType:string;
        BPReading:string;
        FatherName: string;
        MotherName: string;
        AdvPayment:string;

}
export class UserDetails {
 UnqueID:string;
       DateStart:string;
       Title:string;
       UserName:string;
       Password:string;
       FirstName:string;
       LastName:string;
       DOB:string;

       Gender:string;
       Email:string;
       ContactNumber:string;
       Address:string;
       Status:string;

       Designation:string;
       Role:string;
        MultiRoles:string[];
        MenuItems:string[];
       CenterName:string;
       SecretCode:string;
       Location:string;
       RefferDoctorName:string;
       ReportingManagerName :string;
            ReportingManagerRole :string;
            ProfilePicName  :string;

}

export class Adresse {
  Order: number;
  Name: string;
  Unit: string;
  InputType: string;
  Optional: boolean;
  Removed: boolean;
}

export class Parameters {
  Order: number;
  Name: string;
  Unit: string;
  InputType: string;
  Optional: boolean;
  Removed: boolean;
}

export class ReferenceRange {
   Gender :string;
   MinimumAge :string;
   MaximumAge :string;
   LowerValue :string;
   UpperValue :string;
   Remarks :boolean;
}

export class CategoryMaster {
  UnqueID: string;
  Order: string;
  Name: string;
  Description: string;
  Status: Boolean;
  DateStart: number;
  DateEnd: string;
}

export class PrintBill {
  UnqueID: string;  
  Notes : string;
  PrintBillName : string;
  PrintBillType : string;
  PrintBillStatus : string;
  Date : string;
  BillNo : string;
  BillID : string;
  PaymentHistorySingle: PaymentHistorySingle;
}


export class ReferralMaster {
  UnqueID: string;
  FirstName: string;
  LastName: string;
  ContactNumber: string;
  Description: string;
  Status: boolean;
  Department: string;
  fees: number;
  Commission:string;
  Discount: number;
  Experience:string;
  Degree: string;
  Email: string;
  Address: string;
  Title: string;
  DateStart: string;
  DateEnd: string;
  time:string;
  doctorname:string;
  DoctorName:string;
  appointment:string;
  StaffType:string;
  
  
}


export class print {
  doctorname: string;
  department: string;
  appointment: string;
  time: string;
  fees: number
  discount: number;
  hospitalname: string;
  counternumber: string;
  paymentmode: string;
  home: [];

}

export class BedManagement{
  UnqueID :string;
  DateStart :string;
  
  teachers :BedCategory[];
  CreatedBy:string;
  
}
export class BedCategory
    {
        name:string
        batches :BedNames[]
    }

    export class BedNames
    {
         name:string;
         price:string;
         OccupySatus:string;
        OccupiedBy :string;
        OPDIPDID :string;
        CaseUniqueID :string;
        AssignedDoctor :string;
    }

//for add question
export interface Student {
  name: string;
}

export interface Batch {
  name: string;
  students: Student[];
}

export interface Teacher {
  name: string;
  batches: Batch[];
}

// export interface AddQuestion {
//   teachers: Teacher[];
// }

export interface Option {
  id: number;
  questionId: number;
  name: string;
  isAnswer: boolean;
}

export interface QuestionType {
  id: number;
  name: string;
  isActive: boolean;
}

export interface Question {
  id: number;
  name: string;
  questionTypeId: number;
  options: Option[];
  questionType: QuestionType;
}

export interface AddQuestion {
  UnqueID: string;
  DateStart:string;
  id: number;
  name: string;
  description: string;
  questions: Question[];
}


export interface Teacher {
  name: string;
  unit: string;
  price: string;
  Saleprice: string;
   discount : string;
         CGST : string;
         SGST : string;
        IGST:string;
       CGSTVal:string;
       SGSTVal:string;
       IGSTVal:string;
         tax : string;
         total : string;
         inventoryID : string;
         expiryDate : string;
         HSNCode : string;
         UOM : string;
         BatchNumber : string;
         TotalPurchasePrice  : string;
           NetProffit  : string;
           TotalGST  : string;
           BillingMonth  : string;
           BillingYear : string;
}

export interface FarmacyDeliveryToPatient {
  GrossSale(GrossSale: any);
  GrossPurchase(GrossPurchase: any);
  UnqueID: string;
 DateStart: string; 
       Patientid: string;
       CaseID:string;
       name: string;
       description: string;
       BillingDate: string; 
       BilledBy: string;
       CustomerName: string;
       Address: string;
       PhoneNumber: string;
       priorityStatus: string;
       bedDetails: string;
       refferDoctor: string;
       DoctorPercentage: string;
       department: string;
       extra: string;
       PharmacyStoreName : string;
       IPDOPDId : string;
       PaymentStatus : string;
            DeliveredTo : string;
            DeliveredHospital : string;
            ModeOfDespach : string;
            BillNo : string;
            PaymentMode : string;
            PaymentAmount : string;
            CeditStatus : string;
            GrossSalePriceOnthisBill :string;
            GrossPurchasePriceOnthisBill: string;
        GrossProffitPriceOnthisBill: string;
        GrossGSTPriceOnthisBill: string;
        GrossCGSTPriceOnthisBill: string;
        GrossSGSTPriceOnthisBill: string;
        BillingMonth: string;
        BillingYear: string;
  teachers: Teacher[];
}

export interface InventoryMaster {
  UnqueID: string;
  inventoryID  : string;
         itemName  : string;
        stockQty  : string;
        reorderQty  : string;
         DateReorder  : string;
        priorityStatus  : number;

         BarCode  : string;
         ItemCode  : string;
         UnitPrice  : string;
         SellPrice  : string;
         Discount  : string;
         SGST  : string;
         CGST  : string;
         IGST  : string;
         Extra  : string;
         Others  : string;
         //VendorAddress: string;   
         DateStart: string;
        
         ExpireMonth : string;
         ExpireYear : string;
         RackPlaceLocation: string;  
         HSNCode : string;
         UOM : string;
         BatchNumber : string;
         expiryDate: string;
         EntryOwner : string;
         InventoryOwner : string;
         ProfitPrice : string;
         TotalGST : string;
         UpdatedBy : string;
   
         
      
} 


export class BookTicketResponseModel{
  public type: string;
  public seats: BusSeatInfoModel[];
}

export class BusSeatInfoModel {
  public seatNo: number;
  public status: string;
  public category: number;
  public bookedBy: string;
  public gender: string;
  public row: number;
}

export class PaymentHistorySingle {
  public UnqueID:string;
  public Description:string;
  public Amount: number;
  public Discount: number;
  public PaidAmount: number;
  public Balance: number;
  public CaseID: string;
  public ReceivedBy: string;
  public DateStart: string; 
  public Status:string;
  public Type:string;
  public CollectionChargePaid:string;
  public CenterName:string;
  public Name:string;
  public Time:string;
  public DateEnd:string;
  RegdCharge:string;
  EarlierPayment:string;
  OPDCharge:string;
        DoctorCharge :string;
        NurseCharge :string;
        LabTestCharge:string;
    FarmaCharge :string;
        BedCharge :string;
        DailyExpense :string;
        OTCharge :string;
        OtherCharge :string;
}

export class PaymentHistory {
  public UnqueID:string;
  public Description:string;
  public Amount: number;
  public Discount: number;
  public PaidAmount: number;
  public Balance: number;
  public CaseID: string;
  public ReceivedBy: string;
  public DateStart: string; 
  public Status:string;
  public Type:string;
  public CollectionChargePaid:string;
  public CenterName:string;
  public Name:string;
  public Time:string;
  public DateEnd:string;
  RegdCharge:string;
  EarlierPayment:string;
  OPDCharge:string;
        DoctorCharge :string;
        NurseCharge :string;
        LabTestCharge:string;
    FarmaCharge :string;
        BedCharge :string;
        DailyExpense :string;
        OTCharge :string;
        OtherCharge :string;
}
export class NotifyPendingTestData
{
    CaseID :string;
    TestName :string;
    AssignedTo :string;
    RefferDoctorName :string;
    CollectionCenter :string;
    DateStart :string;
    ProgressStatus :string;
    ParentTest:string;
    Location:string;
    IPDOPDId:string;
    OPDIPDID:string;
}

export class BedReport
    {
        UnqueID :string;
        CaseID :string;
        BedCategory :string;
        BedName :string;
        PatientName :string;
        OPDIPDid :string;
        DateStart :string;
    }
export class ProfitLost
    {
      Price :string;
      Quantity :string;
      ProductName :string;
      DateUse:string;
      CreditStatus:string;
    }

    export class OPDIPDModel
    {
        Month :string;
        Amount :string;
        RecordCount :string;
        BillingMonth :string;
        BillingYear :string;
        dt :string;
        OPDIPDType :string;
        OPDCount  :string;
        IPDCount  :string;
        VSCount  :string;
        }

export class NewModifyCase {
  opdipd: number;
  OPDkimbaIPD:string;
  IPDOPDId:string;
  CaseLife:string;
  IPDOPDConversionStatus:string;
      IPDOPDConversionFrom :string;
  public PatientID: string;
  public UnqueID:string;
  public PaymentHistoryID:string;
  public DateStart:string;
  public CaseStatus:string;
  public UserName:string;
  public UserRole:string;
  public Location:string;
  public ModifiedBy:string;
  public PaymentHistory: PaymentHistory[];
  public TestNameWithCase: TestNameWithCase;
  public home: PatientDetails;
  public Home: PatientDetails;
  public BedandAdmissionHistory:BedandAdmissionHistory[];
  public OPD: OPDDetails;
  public DoctortoPatientCommentMedicine:DoctortoPatientCommentMedicine;
  public DischargeNote:DischargeNote;
  public DailyExpense: DailyExpense;
  public DoctorVisit:DoctorVisit;
  public NurseVisit:NurseVisit;
  public DoctortoPatientCommentMedicineReDevelop:DoctortoPatientCommentMedicineReDevelop;
  public AmbulanceVisit:AmbulanceVisit;
  public BedDetailsVisit:BedDetailsVisit;
  public VaccineDetailsVisit:VaccineDetailsVisit;
  public OTDetails:OTDetails;
}
export class LabTestIndividual {
  public UnqueID:string;
  CaseID: string;
  TestName: string;
  CategoryName: string;
  DateStart: string;
  TestPrice: string;
  CreatedBy: string;
  ReportStatus:string;
  BarCodeKey:string;
  QRCodeKey:string;
  ParentTest:string;
  MoreDetails:string;
  test: GenralRefTest[];
}
export class GenralRefTest {
  ParamterName: string;
  InputValue: string;
  Unit: string;
  GeneralRef: string;
}
export class LabTestMaster {
  public UnqueID:string;
  DateStart:string;
  CategoryName: string;
  TestName: string;
  TestPrice: string;
  Discount: string;
  CreatedDate: string;
  CreatedBy: string;
  test: Test[];
  checked:boolean;
}
export class GroupTests{
  public UnqueID:string;
  GroupName: string;
        Description: string;
        Discount: number;
        ActualPrice: number;
        TotalPrice: number;
        CreatedDate: string;
        CreatedBy: string;
        names: Name[];
}
export class Test {
  ParamterName: string;
  InputValue: string;
  Unit: string;
  batches:ReferenceRangeLabTest[]
  // GenderCategory:string;
  // MinRange:string;
  // MaxRange:string;
  // CommonRange:string;
  // GeneralRef: string;
  // GeneralRefM: string;
  // GeneralRefF: string;
  // PreganancyCase: string;
  // Male010: string;
  // Male1030: string;
  // Male3045: string;
  // Male45: string;
  // Female010: string;
  // Female1030: string;
  // Female3045: string;
  // Female45: string;
}
export class ReferenceRangeLabTest{
  GenderCategory:string;
  MinRange:string;
  MaxRange:string;
  CommonRange:string; 
  PreganancyCase: string;
}
export class DailyExpense {
  
  teachers: DailyExpenseChoice[];
}
export class DoctorVisit {
  
  teachers: DoctorVisitChoice[];
}
export class NurseVisit {
  
  teachers: NurseVisitChoice[];
}
export class DoctortoPatientCommentMedicineReDevelop {
  
  teachers: DoctortoPatientCommentMedicineReDevelopChoice[];
}
export class AmbulanceVisit {
  
  teachers: AmbulanceVisitChoice[];
}
export class BedDetailsVisit {
  
  teachers: BedDetailsVisitChoice[];
}
export class VaccineDetailsVisit {
  
  teachers: VaccineDetailsVisitChoice[];
}
export class OTDetails {
  
  teachers: OTDetailsChoice[];
}
export class DailyExpenseChoice {
  name: string;
    ExpenseDescription: string;
    Amount: string;
    expDate: string;
}
export class DoctorVisitChoice {
  name: string;
    ExpenseDescription: string;
    Amount: string;
    expDate: string;
}
export class NurseVisitChoice {
  name: string;
    ExpenseDescription: string;
    Amount: string;
    expDate: string;
     task1: string;
          task2: string;
          task3: string;
          task4: string;
          task5: string;
          task6: string;
          task7: string;
          task8: string;    
          task9: string;
         task10: string;
         drug : string;
         dose : string;
         frequency : string;
         applytime : string;
         others : string;
       //expDate:''
}
export class DoctortoPatientCommentMedicineReDevelopChoice {
  name: string;
      ExpenseDescription: string;
      Amount: string;
      expDate: string;
        DoctorComments: string;
        DoctorCommentsHL: string;
        MedicineNames: string;
        MedicineNamesHL: string;
        PatientHistory: string;
        PatientFinding: string;
        PatientDiagnosis: string;
        PatientPathoLabTestAdvice: string;
        medicines:Medicines[]
}
export class AmbulanceVisitChoice {
  name: string;
    ExpenseDescription: string;
    Amount: string;
    expDate: string;
    perkm:string;
      totalkm:string;
      total:string;
      drivername:string;
     
}
export class BedDetailsVisitChoice {
   BedCategory:string;
   BedName: string;
   StartDate:string;
   EndDate:string;
   BedPrice:string;
   BedDescription: string;
   NofDays:string;
   AdmittedBy:string;
   ShiftingReason:string;
   BedCurrentStatus:string;
   BedForceRelease:string;
   Other:string;
}
export class VaccineDetailsVisitChoice {
  VaccineCategory :string;
       BrandName :string;
       CompanyName :string;
       VaccineName :string;
       Quantity :string;
       Unit :string;
       BatchNumber :string;
       Expiry :string;
       MRP :string;
       Amount :string;
       StartDate :string;
       NextVaccineDate :string;
       VaccinePrice :string;
       VaccineDescription :string;
       NofDays :string;
       DoctorAssigned :string;
       DoctorPrice :string;
       NurseAssigned :string;
       NursePrice :string;
       CurrentStatus :string;
       TotalPrice :string;
       Other :string;
}
export class OTDetailsChoice {
  UnqueID: string;
        OperationName: string;
        Date: string;
        OperationType: string;
        ConsultationDoctor: string
        AsstDoctor1: string;
        AsstDoctor2: string;
        Nurse1: string;
        Nurse2: string;
        Helper1:string;
        Helper2:string;
        AnastheticPerson1: string;
        AnastheticType1: string;
        AnastheticPerson2: string;
        AnastheticType2: string;
        OTTechnician1: string;
        OTTechnician2: string;
        OTTechnicianAsst1: string;
        OTTechnicianAsst2: string;
        Result: string;
        Remarks: string;
        TotalPrice: string;
        OperationMajorMinor: string;
        OperationNote: string;
}

export class OPDChoice {
  name: string;
  val: boolean;
}

export class OPDDetails {
  title: string;
  firstName: string;
  lastName: string;
  DoctorFeedback: string;
  converttoIPD: boolean;
  OPDChoice: OPDChoice[];
}
export class DoctortoPatientCommentMedicine{
  DoctorComments:string;
  DoctorCommentsHL:string;
  MedicineNames:string;
  MedicineNamesHL:string;
  PatientHistory : string;
  PatientFinding :string;
  PatientDiagnosis :string;
  PatientPathoLabTestAdvice:string;
}
export class DischargeNote{
  AdviceNote :string;
  FinalDiagnosis :string;
  Referal :string;
  DischargeType :string;
  Other :string;
}
export class BedandAdmissionHistory{
  public UnqueID  :string;
  public Description  :string;
  public BedNumber  :string;
  public BedPrice  :string;
  public Upgrade  :string = "No";
  public StartDate  :string;
  public EndDate  :string;
  public Nofdays  :string;
  public TotalPrice  :string;
  public OperationRequired :string;
  public OperationDescription :string;
  public DoctorComments :string;
  public DoctorName :string;
  public SupportStaff :string;
}


export class TestNameWithCase{
  RefferDoctorName: string;
  RefferDoctorCharge : string;
  RefferDoctorCommission : string;
        CollectionCenter: string;

        TestType: TestType[];
}
export interface TestType {
  Description: string;
  CollectionCenter: string;
  parentTest: string;
  Paid?: any;
  Discount?: any;
  DiscountType?: any;
  TotalSum: number;
  grpPkgName:string;
  names: Name[];
}

export interface Name {
  TestName: string;
  TestPrice: number;
}
export interface Medicines {
  IndMedicineName: string,
  unit:string,
  noOfTimes:string,
  noOfDays:string,
  whichTime:string
}


export class PaymentParams {
  constructor(public OPD: number, public Doctor: number,public LabTest: number, public Bed: number) {}
}

export class LoginAndPasswordResetModel
    {
        UserName :string;
        Password :string;
        NewPassword :string;
        OldPassword :string;
        SecretCode :string;
    }
    export class ReturnUserModel
    {
        UserName :string;
        Role:string;
        MultiRoles :string[];
        CenterName :string;
    }

    export class CompanyMaster{
        UnqueID :string;
        DateStart :string;
        CompanyName :string;
        CompanyID :string;
        Version :string;
        CompanyCompletAddress :string;
        CompanyHeaderName1 :string;
        CompanyHeaderName2 :string;
        CompanyHeaderName3 :string;
        CompanyHeaderName4 :string;
        CompanyHeaderName5 :string;
        CompanyPhoneNumber1 :string;
        CompanyPhoneNumber2 :string;
        CompanyEmail1 :string;
        CompanyEmail2 :string;
        SignOffbyWhom :string;
        VDName :string;
        DBName :string;
        VDURL :string;
        DBURL :string;

        Technology :string;
        SupportProvided :string;
        ConcernPersonEmailIDSysDICE :string;
        Price :string;
        Purchasedate :string;
        Renewaldate :string;
        ExpireDate :string;
        OfferApplied :string;
        LicenceKey :string;
        LicenceType :string;
        CurrentStatus :string;
        DataBackup :string;
        //conguration
        PathoLAB :string;
        Dental :string;
        Sacnning :string;
        Other :string;
        CreatedBy :string;
    }

    export class LeaveMangement {
      UnqueID :string;
      DateStart :string;   
        name :string;
        description :string;
        BillingDate :string;      
        StaffType :string;
        FirstName :string;

        leaveId :string;
        leaveReason :string;
        dateFrom :string;
        dateTo :string;
        approved :string;
        deniedReason :string;
        status :string;
        createdAt :string;
        NofDays :string;
        SingleDayLeave :string;
      ReportingManager :string;
      ReportingManagerEmail :string;
  }







