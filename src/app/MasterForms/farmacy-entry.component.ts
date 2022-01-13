import { Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms'
import { FarmacyDeliveryToPatient, NewModifyCase, ReferralMaster } from '../models/UserData';
import { FarmacyEntryService } from '../Services/farmacy-entry.service';

import { InventoryMaster } from 'src/app/models/UserData';
import { InventoryService } from 'src/app/Services/inventory.service';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DatePipe, DOCUMENT } from '@angular/common';
import { AddModifyCaseService } from '../Services/add-modify-case.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../shared/storage.service';
import { AllMasterFixedData } from '../shared/AllConstants';
import { PrintPrescriptionComponent } from '../Reports/print-prescription.component';
import { DateAdapter, MatAutocomplete, MatAutocompleteTrigger, MatDialog, MatTableDataSource } from '@angular/material';
import { PrintBillComponent } from '../Reports/print-bill.component';

import { Output, EventEmitter } from '@angular/core';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';
import { CalculatorComponent } from '../custom-components/calculator.component';
import { NgShortcutService, NgShortcut } from 'ng-shortcut';
import { ReffersDetailsComponent } from '../reffers-details.component';
import { RefaralService } from '../Services/referal.service';

export function RequireMatch(control: AbstractControl) {
    const selection: any = control.value;
    if (typeof selection === 'string') {
        return { incorrect: true };
    }
    return null;
}

export interface IBrand {
  BrandId: string;
  BrandName: string;
}
export interface DialogData {
  animal: string;
  name: string;
  hlData: string;
  patientHistory: string;
  patientDiagnosis: string;
  patientAdvice: string;
  patientPathotest: string;
  opdipd: string;
  hlAdvice: string;
  patientInfo: any;
  individualDoctorName: string;
}

export interface Element {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: Element[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];


@Component({
  selector: 'app-farmacy-entry',
  templateUrl: './farmacy-entry.component.html',
  styleUrls: ['./farmacy-entry.component.css']
})
export class FarmacyEntryComponent implements OnInit {

  title = 'FormArray SetValue & PatchValue Example';
  myDate = new Date();
  teachersForm: FormGroup;
  public Inventory: InventoryMaster[] = [];
  options: string[] = [];
  options3: InventoryMaster[] = [];
  filteredOptions: Observable<string[]>;
  myFormattedDateShow: any;
  PatientName: string = '_______________';
  PatientID: string;
  CaseID: string = '______________';
  FarmaUniqueID: string = null;
  newFarmaEntryOrUpdate: string;
  ll;
  Username: string;
  Role: string;
  Location: string;
  storename: string;
  DespatchMode = AllMasterFixedData.DespatchMode;
  PharmacyStore = AllMasterFixedData.PharmacyStore;

  displayWith(obj?: any): string | undefined {
    return obj ? obj.name : undefined;
  }

  constructor(private dateAdapter: DateAdapter<Date>, private datePipe: DatePipe, private fb: FormBuilder, private addModifyCaseService: AddModifyCaseService,
    public farmacyEntryService: FarmacyEntryService, public inventoryService: InventoryService,private ngShortcutService: NgShortcutService,
    private route: ActivatedRoute, private router: Router, private _store: StorageService, public dialog: MatDialog,
    private _router: Router, private http: HttpClient, @Inject(DOCUMENT) private _document: Document,public referralMasterService: RefaralService) {

    this.Username = this._store.sessionUsername;
    this.Role = this._store.sessionRole;
    this.Location = this._store.sessionLocation;
    this.dateAdapter.setLocale('en-GB');
    if (this.Username == 'Sachin') {
      this.storename = 'GET WELL SOON PHARMACEUTICAL';
    }
    else if (this.Username == 'Mihir') {
      this.storename = 'MIHIR PHARMACEUTICAL';
    }

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    const now = new Date();
    this.ll = this.datePipe.transform(this.myDate, 'dd-MM-yyyy hh:mm:ss');
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate(), now.getHours());
    var date = new Date(); // had to remove the colon (:) after the T in order to make it work
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var minutes = date.getMinutes();
    var hours = date.getHours();
    var seconds = date.getSeconds();
    var myFormattedDate = day + "-" + (monthIndex + 1) + "-" + year + " " + hours + ":" + minutes + ":" + seconds;
    this.myFormattedDateShow = myFormattedDate;
    //document.getElementById("dateExample").innerHTML = myFormattedDate

    this.teachersForm = this.fb.group({
      BillingDate: [new Date()],//[{ value: myFormattedDate, disabled: true }],
      Patientid: [''],
      CaseID: [''],
      BilledBy: [this.Username],
      //BilledBy: [{ value: 'Ajay', disabled: true }],
      CustomerName: '',
      Address: '',
      PhoneNumber: '',
      priorityStatus: ['true'],
      bedDetails: [''],
      refferDoctor: ['Dr'],
      DoctorPercentage: ['0'],
      department: [],
      DoctorCommentsHL: [],
      extra: [],
      teachers: this.fb.array([]),
      PharmacyStoreName: [this.Username],
      DeliveredTo: [''],
      DeliveredHospital: [''],
      ModeOfDespach: [''],
      BillNo: [''],
      PaymentMode: [''],
      PaymentAmount: [''],
      CeditStatus: [''],
      IPDOPDId: [''],
      PaymentStatus: [''],
      GrossPurchasePriceOnthisBill: [''],
      GrossProffitPriceOnthisBill: [''],
      GrossGSTPriceOnthisBill: [''],
      GrossCGSTPriceOnthisBill: [''],
      GrossSGSTPriceOnthisBill: [''],
      BillingMonth: [''],
      BillingYear: [''],
    })

    // this.teachersForm.controls['CaseID'].valueChanges.subscribe(value => {
    //   this.onNameChangeSub(value);
    // });

    ngShortcutService.push(new NgShortcut('F3', () => alert("F3 shortcut run"), {
      preventDefault: true,
      altKey: true
    }))
  }

  save() {
    alert("Save button fired: priority 100");
  }
  cancel() {
    this.OpenCalculator();
  }


  /** Teachers */
  teachers(): FormArray {
    return this.teachersForm.get("teachers") as FormArray
  }

  newTeacher(): FormGroup {
    return this.fb.group({
      name: '',
      unit: '1',
      price: '0',
      Saleprice: '0',
      discount: '0',
      CGST: '0',
      SGST: '0',
      IGST: '0',
      CGSTVal: '0',
      SGSTVal: '0',
      IGSTVal: '0',
      tax: '0',
      total: '0',//[{value: '0', disabled: true}],
      inventoryID: '',
      expDate: [this.datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm:ss')],
      expiryDate: '',
      HSNCode: '',
      UOM: '',
      BatchNumber: '',
      TotalSalePrice: '',
      TotalPurchasePrice:'',
      purchaseprice :'',
      NetProffit: '',
      TotalGST: '',
      BillingMonth: '',
      BillingYear: ''

    })
  }

  totalValue = 0;
  addTeacher() {
    let index = this.teachersForm.value.teachers.findIndex(x => x.name === "");
    if (index == -1) {
      this.teachers().push(this.newTeacher());

      
      
    }
    else {
      // alert("Emtty row is there");
    }
    // this.totalValue = 0;
    // this.ManageNameControl(0);
  }

  brandDatas: Observable<IBrand[]>[] = [];
  bran: IBrand[] = [
    { "BrandId": "1234", "BrandName": "Apple" },
    { "BrandId": "12344", "BrandName": "Samsung" },
    { "BrandId": "12345", "BrandName": "Oppo" },
    { "BrandId": "12347", "BrandName": "Sony" },
    { "BrandId": "12349", "BrandName": "Panasonic" },

  ];
  cart= [
          {
              "fileLocation": "http://images.clipartpanda.com/sports-equipment-clipart-black-and-white-soccer-ball-hi.png",
              "username": "testuser3",
              "description": "The company required the 28-year-old's help on a matter the directors felt could affect the share price: its Wikipedia page. Short, uninteresting ."
          },
          {
              "fileLocation": "http://images.clipartpanda.com/sports-equipment-clipart-black-and-white-soccer-ball-hi.png",
              "username": "Sumanth",
              "description": "Sample"
          },
          {
              "fileLocation": "http://images.clipartpanda.com/sports-equipment-clipart-black-and-white-soccer-ball-hi.png",
              "username": "as",
              "description": "as"
          }
      ];
   
  ManageNameControl(index: number) {
    var arrayControl = this.teachersForm.get('teachers') as FormArray;
    let item = arrayControl.at(index);

    this.brandDatas[index] = item.get('BrandId').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterBrand(value))
      );
  }

  _filterBrand(name: string): IBrand[] {
    return this.bran.filter(opt =>
      opt.BrandName.toLowerCase().includes(name.toLowerCase()));
  }

  displayBrand(brand?: IBrand): string | undefined {
    return brand ? brand.BrandName : undefined;
  }

  removeTeacher(ti) {
    this.teachers().removeAt(ti);
    this.FinalCalculation();
  }
  myControl = new FormControl();
  myControl1 = new FormControl();
  // Getter to retrieve the FormArray
  get accountsArray(): FormArray {
    return this.teachersForm.get('teachers ') as FormArray;
  }
  newid: string;
  usrName: string;
  CashBilling: boolean = false;
  TestName: string;
  goingTobeID: string;
  private _filter2(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
  private _filter3(value: any): InventoryMaster[] {
    const filterValue = value.itemName == undefined ? value.toLowerCase() : value.itemName.toLowerCase();

    return this.options3.filter(option => option.itemName.toLowerCase().indexOf(filterValue) === 0);
  }
  public displayProperty(index) {
    return index?.itemName; //  'kk';
    //return ((this.teachersForm.get('teachers') as FormArray).at(index) as FormGroup).get('itemName').value;
  }
  ngOnInit(): void {
    

    this.filteredOptions2 = this.myControl2.valueChanges.pipe(
      startWith(''),
      map(value => this._filter2(value))
    );

    this.filteredOptions3 = this.myControl3.valueChanges.pipe(
      map(value => this._filter3(value))
    );


    this.route.queryParams.subscribe(params => {
      this.usrName = params['username'] || "0";
      this.newid = params['newid'] || "0";
      //alert(this.usrName)
    });


    this.route.params.subscribe((params) => {
      // alert(params['id']);
      //   alert(params['testname']);
      this.TestName = params['CaseID'];
      if (this.TestName == 'jj' || this.usrName == 'Cash') {
        this.CaseID = params['CaseID'];
        this.CashBilling = true;

        this.sendit(this.CaseID);
        if (this.TestName == 'jj') {
          this.getLatestGoingtobeID('Cash', this.Username);
        }
      }
      else {
        this.CashBilling = false;
        this.CaseID = params['CaseID'];
        //this.teachersForm.get('BillNo').patchValue("B" + this.CaseID);
        this.teachersForm.get('CaseID').patchValue(this.CaseID);
        this.sendit(this.CaseID);
        this.getLatestGoingtobeID('Credit', this.Username);
      }
    });
    //this.LoadAllTestInvestigations();
    this.LoadInventories();
    this.LoadAllDoctor();
    //this.LoadFarmaData('12117134');
    // this.CaseID = '';this.LoadFarmaData('12117134');
    // this.CaseID = '';
    // this.FarmaUniqueID =null;
    // this.FarmaUniqueID =null;
    this.ll = this.datePipe.transform(this.myDate, 'dd-MM-yyyy hh:mm:ss');
    this.addTeacher();


  }

  refreshPage() {
    this._document.defaultView.location.reload();
  }

  getLatestGoingtobeID(CashOrCredit: string, PharmaName) {
    this.farmacyEntryService.getLatestGoingtobeID(CashOrCredit, PharmaName).subscribe((data: any) => {
      this.goingTobeID = data.NexttoBeIDNameetc;
      this.teachersForm.get('BillNo').patchValue(this.goingTobeID);
      this.teachersForm.get('CeditStatus').patchValue(CashOrCredit);
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  CalculateFinalPriceWithDiscount(price: string, discount: string, unit: string): number {

    var result = (parseFloat(discount) / 100) * parseFloat(price);
    return (parseFloat(price) * parseFloat(unit)) - (result * parseFloat(unit));
  }
  CalculateFinalPurchasePrice(Saleprice: string, unit: string): number {

    //var result = (parseFloat(discount) / 100) * parseFloat(price);
    return (parseFloat(Saleprice) * parseFloat(unit)) ;
  }

  CalculateTotalDiscount(price: string, discount: string, unit: string): number {
    return parseFloat(discount) * parseFloat(unit);
  }

  PopulateCustomerData({ target }) {

  }

  getControlLabel(ti: number) {
    return (((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('inventoryID').value == '' ? 'NA' : ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('inventoryID').value);
  }
  onTotalCalculationUnit(ti: any) {


    let unit = ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('unit').value;
    let price = ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('price').value;
    let discount = ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('discount').value;
    let CGST = ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('CGST').value;
    let SGST = ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('SGST').value;
    let initTotalPurchasePrice = ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('purchaseprice').value;


    ///
    //var TotalPurchasePrice = ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('TotalPurchasePrice').value;
    //((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('BillingMonth ').patchValue(month);
    //((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('BillingYear ').patchValue(year);
    //((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('NetProffit ').patchValue((FC - totalPurchasePrice).toString());
    var TotalGST = CGST+SGST; // ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('TotalGST  ').patchValue((SGSTVal+CGSTVal).toString());
    
    /////
    var totalPurchasePrice = this.CalculateFinalPurchasePrice(initTotalPurchasePrice, unit); // inventory purchase price
    let FC = this.CalculateFinalPriceWithDiscount(price, discount, unit);
    // var CGSTVal = ((FC * parseFloat(this.Inventory[ti]?.CGST)) / 100).toString();
    // var SGSTVal = ((FC * parseFloat(this.Inventory[ti]?.SGST)) / 100).toString();
    var CGSTVal = ((FC * parseFloat(CGST)) / 100).toString();
    var SGSTVal = ((FC * parseFloat(SGST)) / 100).toString();

    ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('SGSTVal').patchValue(SGSTVal);
    ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('CGSTVal').patchValue(CGSTVal);
    /////

    let unitValue = (unit.trim() == "" || unit == "0") ? 0 : parseFloat(price);
    let priceValue = (price.trim() == "" || price == "0") ? 0 : parseFloat(price);
    let PurchasePrice = (initTotalPurchasePrice.trim() == "" || initTotalPurchasePrice == "0") ? 0 : parseFloat(initTotalPurchasePrice);
    let discountValue = (discount.trim() == "" || discount == "0") ? 0 : (priceValue * parseFloat(discount)) / 100;
    let cgstValue = (CGST.trim() == "" || CGST == "0") ? 0 : (priceValue * parseFloat(CGST)) / 100;
    let sgstValue = (SGST.trim() == "" || SGST == "0") ? 0 : (priceValue * parseFloat(SGST)) / 100;

    //if (parseFloat(unitCount) > parseFloat(p.stockQty)) {
    //let unitCount = target.value; // ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('unit').value;
    if (unit !== null || unit == 0) {
      //let total = unit * (priceValue + cgstValue + sgstValue) - discountValue;
      let total = (unit * priceValue) - discountValue;
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('total').patchValue(total. toString());

      let totalPurchase = (unit * initTotalPurchasePrice) ;//- discountValue;
      let netProffit= total - totalPurchase;
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('TotalPurchasePrice').patchValue(totalPurchase. toString());
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('TotalGST').patchValue(cgstValue+sgstValue. toString());
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('NetProffit').patchValue(netProffit. toString());

    }
    else {
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('total').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('TotalPurchasePrice').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('NetProffit').patchValue("0");

      // ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('total').patchValue("0");
      // ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('discount').patchValue("0");

    }
    //alert(ct);
    //this.FinalCalculation();
  }

  //temporararily Update final bill with GST
  tempUpdate(){

    var data = this.farmacyDeliveryToPatientData;

    //this.clearFormArray();


    

    for (let i = 0; i < data[0].teachers.length; i++) {
      this.onTotalCalculationUnit(i);
      this.FinalCalculation();
    }

  }
  onTotalCalculation({ target }, ti: any) {


    let unit = ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('unit').value;
    let price = ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('price').value;
    let discount = ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('discount').value;
    let CGST = ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('CGST').value;
    let SGST = ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('SGST').value;

    /////

    let FC = this.CalculateFinalPriceWithDiscount(price, discount, unit);
    var CGSTVal = ((FC * parseFloat(CGST)) / 100).toString();
    var SGSTVal = ((FC * parseFloat(SGST)) / 100).toString();

    ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('SGSTVal').patchValue(SGSTVal);
    ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('CGSTVal').patchValue(CGSTVal);
    /////

    let unitValue = (unit.trim() == "" || unit == "0") ? 0 : parseFloat(price);
    let priceValue = (price.trim() == "" || price == "0") ? 0 : parseFloat(price);
    let discountValue = (discount.trim() == "" || discount == "0") ? 0 : (priceValue * parseFloat(discount)) / 100;
    let cgstValue = (CGST.trim() == "" || CGST == "0") ? 0 : (priceValue * parseFloat(CGST)) / 100;
    let sgstValue = (SGST.trim() == "" || SGST == "0") ? 0 : (priceValue * parseFloat(SGST)) / 100;

    //if (parseFloat(unitCount) > parseFloat(p.stockQty)) {
    //let unitCount = target.value; // ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('unit').value;
    if (unit !== null || unit == 0) {
      //let total = unit * (priceValue + cgstValue + sgstValue) - discountValue;
      let total = (unit * priceValue) - discountValue;
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('total').patchValue(total);

    }
    else {
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('total').patchValue("0");

      // ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('total').patchValue("0");
      // ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('discount').patchValue("0");

    }
    //alert(ct);
    //this.FinalCalculation();
  }
  onUnitChange({ target }, ti: any) {
    let name = ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('name').value;
    let p: any = this.Inventory.find(x => x.itemName == name || x.BarCode == name);

    let discount = p.Discount;// ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('discount').value;
    //let p: any = this.Inventory.find(x => x.itemName == target.value.toString() || x.BarCode == target.value.toString());
    let price = p.SellPrice;
    let objIndex = this.Inventory.findIndex(x => x.itemName == ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('name').value);

    let unitCount = target.value; // ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('unit').value;
    if (unitCount !== "") {
      if (parseFloat(unitCount) > parseFloat(p.stockQty)) {
        alert('No stock. Avaialble stock number is ' + p.stockQty);
        ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('unit').patchValue("1");
        unitCount = "1"
        // return;
      }
      let ct = this.CalculateFinalPriceWithDiscount(price, discount, unitCount);
      let discountTotal = this.CalculateanyPercent(price, discount, unitCount);
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('total').patchValue(ct);
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('discount').patchValue(discount);
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('discount').patchValue(this.Inventory[objIndex]?.Discount);
      //((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('discount').patchValue(discountTotal);       
    }
    else {
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('total').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('discount').patchValue("0");

    }
    //alert(ct);
    this.FinalCalculation();
  }

  onForm2NameChange({ target }, ti: any) {

    let p: any = this.Inventory.find(x => x.itemName == target.value.toString() || x.BarCode == target.value.toString());
    let objIndex = this.Inventory.findIndex(x => x.itemName == target.value.toString() || x.BarCode == target.value.toString());



    if (objIndex !== -1) {
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('name').patchValue(this.Inventory[objIndex]?.itemName);

      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('price').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('discount').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('SGST').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('CGST').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('SGSTVal').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('CGSTVal').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('unit').patchValue("1");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('inventoryID').patchValue("NA");


      console.log(target.value);
    }
    else {
      //((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('price').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('price').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('discount').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('SGST').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('CGST').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('SGSTVal').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('CGSTVal').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('total').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('inventoryID').patchValue("NA");


    }
    //this.FinalCalculation();
  }

  onForm2NameChangeDirect(val: string, ti: any) {

    // let p: any = this.Inventory.find(x => x.itemName == val || x.BarCode == val);
    // let objIndex = this.Inventory.findIndex(x => x.itemName == val || x.BarCode == val);
    let p: any = this.Inventory.find(x => x.itemName == val || x.BatchNumber == val);
    let objIndex = this.Inventory.findIndex(x => x.itemName == val || x.BatchNumber == val);
    var dateObj = new Date(this.teachersForm.get('BillingDate').value);
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();


    if (objIndex !== -1) {
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('name').patchValue(this.Inventory[objIndex]?.itemName);
      if (true) {//if (this.CashBilling == true) {
        ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('unit').patchValue("1");
        let price = ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('price').value;
        let purchaseprice = ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('purchaseprice').value;
        let discount = ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('discount').value;
        let unit = ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('unit').value;
        
        var CGSTValCalc = ((FC * parseFloat(this.Inventory[objIndex]?.CGST)) / 100);
        var SGSTValCalc = ((FC * parseFloat(this.Inventory[objIndex]?.SGST)) / 100);
        var FC = this.CalculateFinalPriceWithDiscount(price, discount, unit);//+CGSTValCalc+SGSTValCalc;
        var totalPurchasePrice = this.CalculateFinalPurchasePrice(purchaseprice, unit);//var FC = this.CalculateFinalPriceWithDiscount(price, discount, unit)+CGSTValCalc+SGSTValCalc; // inventory purchase price
        var CGSTVal = ((FC * parseFloat(this.Inventory[objIndex]?.CGST)) / 100).toString();
        var SGSTVal = ((FC * parseFloat(this.Inventory[objIndex]?.SGST)) / 100).toString();
        ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('price').patchValue(this.Inventory[objIndex]?.SellPrice);
        ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('purchaseprice').patchValue(this.Inventory[objIndex]?.UnitPrice);
        
        ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('discount').patchValue(this.Inventory[objIndex]?.Discount);
        ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('SGST').patchValue(this.Inventory[objIndex]?.SGST);
        ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('CGST').patchValue(this.Inventory[objIndex]?.CGST);
        ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('unit').patchValue("1");
        ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('SGSTVal').patchValue(SGSTVal);
        ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('CGSTVal').patchValue(CGSTVal);

        ///////////
        ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('TotalPurchasePrice').patchValue(this.Inventory[objIndex]?.UnitPrice);
        ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('BillingMonth').patchValue(month.toString());
        ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('BillingYear').patchValue(year.toString());
        ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('NetProffit').patchValue((FC - totalPurchasePrice).toString());
        ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('TotalGST').patchValue((SGSTVal+CGSTVal).toString());
        
/////////////////

        ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('inventoryID').patchValue(this.Inventory[objIndex]?.UnqueID);

        ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('expiryDate').patchValue(this.Inventory[objIndex]?.ExpireMonth + '/' + this.Inventory[objIndex]?.ExpireYear);
        ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('HSNCode').patchValue(this.Inventory[objIndex]?.HSNCode);
        ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('UOM').patchValue(this.Inventory[objIndex]?.UOM);
        ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('BatchNumber').patchValue(this.Inventory[objIndex]?.BatchNumber);


        ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('TotalPurchasePrice').patchValue(totalPurchasePrice);
        ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('total').patchValue(FC);

        //console.log(target.value);
        this.FinalCalculation();
        this.update();
      }
      //bellow line commented to restrict force zero value to billing boxes
      // else {
      //   ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('price').patchValue("0");
      //   ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('discount').patchValue("0");
      //   ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('SGST').patchValue("0");
      //   ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('CGST').patchValue("0");
      //   ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('unit').patchValue("1");
      //   ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('inventoryID').patchValue("NA");
      // }


      console.log(val);
    }
    else {
      //((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('price').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('price').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('UnitPrice').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('discount').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('SGST').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('CGST').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('SGSTVal').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('CGSTVal').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('total').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('inventoryID').patchValue("NA");

      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('expiryDate').patchValue('NA');
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('HSNCode').patchValue('NA');
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('UOM').patchValue('NA');
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('BatchNumber').patchValue('NA');



    }
    //this.FinalCalculation();
  }


  @ViewChild(MatAutocomplete) matAutocomplete: MatAutocomplete;
  @ViewChildren('typehead') rows: QueryList<any>;
  private sub1:Subscription = new Subscription();
  ngAfterViewInit() {
    this.sub1 = this.rows.changes.subscribe(resp => {
      if (this.rows.length > 1){
        this.rows.last.nativeElement.focus();
      }
    });
   }

   chooseFirstOption(): void {
    //this.matAutocomplete.options.first.select();
  }

   //memory leak avoidance
  ngOnDestroy(){
    this.sub1.unsubscribe();
  }
  update() {
    let index = this.teachersForm.value.teachers.findIndex(x => x.name === "");
    if (index == -1) {
      this.addTeacher();
      this.myControl2.patchValue('');
      this.myControl3.patchValue('');
      //this.rows.first().nativeElement.focus();
      
    }
    else {
      // alert("Emtty row is there");
    }
    //let p:any = (this.teachersForm.get('teachers') as FormArray).find(x=> x.itemName==target.value.toString());
    this.FinalCalculation();
  }

  myControl2 = new FormControl();
  myControl3 = new FormControl();
  options2: string[] = [];
  //options3: InventoryMaster[] = [];
  filteredOptions2: Observable<string[]>;
  filteredOptions3: Observable<InventoryMaster[]>;


  searchTerm: FormControl = new FormControl();
  filteredOptions1: Observable<string[]>;
  filter(val: string): any[] {
    return this.Inventory.filter(option =>
      option?.itemName?.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  clearField(ele) {
    //alert(ele.value);
    ele.value = '';
  }

  LoadInventories() {
    this.inventoryService.GetCategoryWise('All',this.Username).subscribe((data: InventoryMaster[]) => {
      this.Inventory = data;//.filter(a => a.EntryOwner == this.Username || a.EntryOwner == undefined || a.EntryOwner == '');

      this.Inventory.forEach((element, index, array) => {
        this.options.push(element.itemName)

      });

      this.Inventory.forEach((element, index, array) => {
        this.options3.push(element);

      });



    })
  }

 
  getPosts(abc: string, index: number) {
    ((this.teachersForm.get('teachers') as FormArray).at(index) as FormGroup).get('name').patchValue(abc);
    //alert(abc);

    this.onForm2NameChangeDirect(abc, index)
    this.onTotalCalculationUnit(index);

  }

  getPosts3(abc: any, def: any, index: number) {
    //alert(abc);
    //alert(def.itemName);
    ((this.teachersForm.get('teachers') as FormArray).at(index) as FormGroup).get('name').patchValue(abc);
    //alert(abc);

    this.onForm2NameChangeDirect(abc, index)
    this.onTotalCalculationUnit(index);

  }
  displayProperty1: string;
  getPosts4(abc: any, index: number) {
    //alert(abc.option.value.itemName +'--'+ abc.option.value.BatchNumber);
    //alert(def.itemName);
    ((this.teachersForm.get('teachers') as FormArray).at(index) as FormGroup).get('name').patchValue(abc.option.value.itemName);
    //alert(abc);

    this.onForm2NameChangeDirect(abc.option.value.itemName, index)

    this.onTotalCalculationUnit(index);
    //this.displayProperty1 = abc.option.value.itemName;
    this.FinalCalculation();

  }

  public progress: number;
  public message: string;
 

  CaseStatusFromMain: string;
  sendit(valParam) {
    //alert("Value"+ valParam);
    //this.addTeacher();
    if (this.CashBilling == true) {
      this.LoadFarmaData(valParam);
    }
    else {
      this.addModifyCaseService.getById(valParam).subscribe(val => {
        this.data11 = val;
        if (this.data11 != undefined) {
          this.finalMedicineList(this.data11.DoctortoPatientCommentMedicineReDevelop);
          //this.FarmaUniqueID = null;
          let p: NewModifyCase = this.data11;//.find(x=>x.UnqueID == target.value.toString());

          //this.newFarmaEntryOrUpdate = "Update";
          this.teachersForm.get('CustomerName').patchValue(p.Home.FirstName);
          this.teachersForm.get('refferDoctor').patchValue(p.Home.RefferDoctorName);
          this.teachersForm.get('PhoneNumber').patchValue(p.Home.ContactNumber);
          this.teachersForm.get('Address').patchValue(p.Home.Address);
          this.teachersForm.get('bedDetails').patchValue(p.BedandAdmissionHistory[0].BedNumber);
          //this.teachersForm.get('DoctorCommentsHL').patchValue(this.finalMedicinehistory p.DoctortoPatientCommentMedicine.MedicineNamesHL);
          this.teachersForm.get('DoctorCommentsHL').patchValue(this.finalMedicinehistory);
          this.teachersForm.get('PharmacyStoreName').patchValue(p.Home.AssignedPharma);
          this.teachersForm.get('extra').patchValue(p.CaseStatus);
          //Make the first letter of the name(any string) with capital
          this.PatientName = p.Home.FirstName.charAt(0).toUpperCase() + p.Home.FirstName.slice(1);//p.Home.FirstName;
          this.CaseID = valParam;
          this.CaseStatusFromMain = p.CaseStatus;

          //this.FarmaUniqueID = p.UnqueID;
          this.LoadFarmaData(this.CaseID);
          // this.CaseID = '';
          // this.FarmaUniqueID =null;
        }
        else {
          //this.newFarmaEntryOrUpdate="New"
          this.teachersForm.get('CustomerName').patchValue('');
          this.teachersForm.get('refferDoctor').patchValue('');
          this.teachersForm.get('PhoneNumber').patchValue('');
          this.teachersForm.get('Address').patchValue('');
          this.teachersForm.get('bedDetails').patchValue('');
          this.teachersForm.get('DoctorCommentsHL').patchValue('');
          this.teachersForm.get('extra').patchValue('');
          this.teachersForm.get('PharmacyStoreName').patchValue('Sachin');
          this.PatientName = '';
          // this.CaseID = '';
          this.FarmaUniqueID = null;
        }

      });
    }

  } //ended
  farmacyDeliveryToPatientData: FarmacyDeliveryToPatient;
  LoadFarmaData(CaseID: string) { 

    if (this.TestName == 'jj'){

    }
    else{
      this.farmacyEntryService.getByCaseId(CaseID,this.Username).subscribe((data: FarmacyDeliveryToPatient) => {
        this.farmacyDeliveryToPatientData = data;
        //this.CaseID = data.;
        if (data[0] !== undefined) {
          this.FarmaUniqueID = data[0].UnqueID;
          this.patchValue2();
          if (this.teachersForm?.value?.CaseID !== '') {
            this.showPrintAfterSave = true;
          }
        }
        else {
          if (this.CashBilling == true) {
            this.router.navigate(['/Farmaentry', 'jj'], { queryParams: { username: "Cancel" } });
          }
          else {
            this.FarmaUniqueID = "";
            //this.patchValue2();
            this.addTeacher();
            //this.teachersForm.get('BillNo').patchValue("B" + CaseID);
            //data[0].BillNo = "B"+data[0].UnqueID;
          }
        }
  
      });
    }
  }
  onSubmit() {
    console.log(this.teachersForm.value);
  }

  showBasedOnPaymentStatusFinalBill: boolean = true;
  patchValue2() {



    var data = this.farmacyDeliveryToPatientData;

    this.clearFormArray();


    data[0].teachers.forEach(t => {

      var teacher: FormGroup = this.newTeacher();
      this.teachers().push(teacher);
      

    });


  

    //this.teachersForm.get('teachers').get('unit').patchValue('0');
    this.teachersForm.get('teachers').patchValue(data[0].teachers);
    //data[0].BillNo = "B" + this.CaseID;
    this.teachersForm.patchValue(data[0]);
    this.teachersForm.get('extra').patchValue(this.CaseStatusFromMain);


    this.FinalCalculation();
    if (this.teachersForm.value.PaymentStatus == 'Closed') {
      this.showBasedOnPaymentStatusFinalBill = false;
    }
  }
  data11: NewModifyCase;
  onNameChange({ target }) {
    this.LoadFarmaData(target.value.toString());
    this.addModifyCaseService.getById(target.value.toString()).subscribe(val => {
      this.data11 = val;
      if (this.data11 != undefined) {
        this.FarmaUniqueID = null;
        let p: NewModifyCase = this.data11;//.find(x=>x.UnqueID == target.value.toString());

        //this.newFarmaEntryOrUpdate = "Update";
        this.teachersForm.get('CustomerName').patchValue(p.Home.FirstName);
        this.teachersForm.get('refferDoctor').patchValue(p.Home.RefferDoctorName);
        this.teachersForm.get('PhoneNumber').patchValue(p.Home.ContactNumber);
        this.teachersForm.get('Address').patchValue(p.Home.Address);
        this.teachersForm.get('bedDetails').patchValue(p.BedandAdmissionHistory[0].BedNumber);
        //this.teachersForm.get('DoctorCommentsHL').patchValue(p.DoctortoPatientCommentMedicine.MedicineNamesHL);
        this.teachersForm.get('DoctorCommentsHL').patchValue(this.finalMedicinehistory);
        this.teachersForm.get('PharmacyStoreName').patchValue(p.Home.AssignedPharma);
        this.teachersForm.get('extra').patchValue(p.CaseStatus);
        //Make the first letter of the name(any string) with capital
        this.PatientName = p.Home.FirstName.charAt(0).toUpperCase() + p.Home.FirstName.slice(1);//p.Home.FirstName;
        this.CaseID = target.value.toString();
        //this.FarmaUniqueID = p.UnqueID;
        this.LoadFarmaData(this.CaseID);
        // this.CaseID = '';
        // this.FarmaUniqueID =null;
      }
      else {
        //this.newFarmaEntryOrUpdate="New"
        this.teachersForm.get('CustomerName').patchValue('');
        this.teachersForm.get('refferDoctor').patchValue('');
        this.teachersForm.get('PhoneNumber').patchValue('');
        this.teachersForm.get('Address').patchValue('');
        this.teachersForm.get('bedDetails').patchValue('');
        this.teachersForm.get('DoctorCommentsHL').patchValue('');
        this.teachersForm.get('extra').patchValue('');
        this.teachersForm.get('PharmacyStoreName').patchValue('Sachin');
        this.PatientName = '';
        // this.CaseID = '';
        this.FarmaUniqueID = null;
      } ''

    });

    // let p: any = this.Inventory.find(x => x.itemName == target.value.toString() || x.BarCode == target.value.toString());
    // let objIndex = this.Inventory.findIndex(x => x.itemName == target.value.toString() || x.BarCode == target.value.toString());
  }

  onNameChangeSub(valParam: string) {
    this.addModifyCaseService.getById(valParam).subscribe(val => {
      this.data11 = val;
      //this.finalMedicineList(this.data11.DoctortoPatientCommentMedicineReDevelop);
      if (this.data11 != undefined) {
        this.FarmaUniqueID = null;
        let p: NewModifyCase = this.data11;//.find(x=>x.UnqueID == target.value.toString());

        //this.newFarmaEntryOrUpdate = "Update";
        this.teachersForm.get('CustomerName').patchValue(p.Home.FirstName);
        this.teachersForm.get('refferDoctor').patchValue(p.Home.RefferDoctorName);
        this.teachersForm.get('PhoneNumber').patchValue(p.Home.ContactNumber);
        this.teachersForm.get('Address').patchValue(p.Home.Address);
        this.teachersForm.get('bedDetails').patchValue(p.BedandAdmissionHistory[0].BedNumber);
        //this.teachersForm.get('DoctorCommentsHL').patchValue(p.DoctortoPatientCommentMedicine.MedicineNamesHL);
        this.teachersForm.get('DoctorCommentsHL').patchValue(this.finalMedicinehistory);
        this.teachersForm.get('PharmacyStoreName').patchValue(p.Home.AssignedPharma);
        this.teachersForm.get('extra').patchValue(p.CaseStatus);
        //Make the first letter of the name(any string) with capital
        this.PatientName = p.Home.FirstName.charAt(0).toUpperCase() + p.Home.FirstName.slice(1);//p.Home.FirstName;
        this.CaseID = valParam;
        //this.FarmaUniqueID = p.UnqueID;
        this.LoadFarmaData(this.CaseID);
        // this.CaseID = '';
        // this.FarmaUniqueID =null;
      }
      else {
        //this.newFarmaEntryOrUpdate="New"
        this.teachersForm.get('CustomerName').patchValue('');
        this.teachersForm.get('refferDoctor').patchValue('');
        this.teachersForm.get('PhoneNumber').patchValue('');
        this.teachersForm.get('Address').patchValue('');
        this.teachersForm.get('bedDetails').patchValue('');
        this.teachersForm.get('DoctorCommentsHL').patchValue('');
        this.teachersForm.get('PharmacyStoreName').patchValue('Sachin');
        this.PatientName = '';
        // this.CaseID = '';
        this.FarmaUniqueID = null;
      }

    });

    // let p: any = this.Inventory.find(x => x.itemName == target.value.toString() || x.BarCode == target.value.toString());
    // let objIndex = this.Inventory.findIndex(x => x.itemName == target.value.toString() || x.BarCode == target.value.toString());
  }


  clearFormArray() {

    //Angular 8 +
    this.teachers().clear();

    //older Versions of angualar
    //while (this.teachers().length) {
    //  this.teachers().removeAt(0);
    //}
  }

  farmacyToPatient: FarmacyDeliveryToPatient[] = [];
  LoadAllTestInvestigations() {
    this.farmacyEntryService.getAll().subscribe((data: FarmacyDeliveryToPatient[]) => {
      //console.log(data);
      this.farmacyToPatient.push(data[1]);// = data;


    })
  }

  BillDetails: any = {};
  resultGroupby: any[] = [];
  printBillArray: any[] = [];
  ShowBill: boolean = false;
  FinalCalculation() {

    this.ShowBill = true;
    //this.teachersForm.value.teachers = this.teachersForm.value.teachers.filter(a => a.name !== '');
    let arr1 = this.teachersForm.value.teachers.filter(a => a.name !== '');
    this.printBillArray = arr1;
    var arr = arr1.filter(function (val) { return val.name != ""; });

    let p = arr.reduce((accumulator, current) => accumulator + parseFloat(current.total), 0);
    //alert("total" + p);
    this.BillDetails.total = p;

    let itm = arr.reduce((accumulator, current) => accumulator + parseFloat(current.unit), 0);
    //alert("total no of item" + itm);
    this.BillDetails.itmCount = itm;

    let discount = arr.reduce((accumulator, current) => accumulator + parseFloat(this.CalculateanyPercent(current.price, current.discount, current.unit).toString()), 0);
    //alert("total rs in discount" + discount);
    this.BillDetails.discount = discount;


    // let cgst = arr.reduce((accumulator, current) => accumulator + parseFloat(this.CalculateanyPercent(current.price, current.CGST, current.unit).toString()), 0);
    // //alert("total cgst" + cgst);
    // this.BillDetails.cgst = cgst;

    // let sgst = arr.reduce((accumulator, current) => accumulator + this.CalculateanyPercent(current.price, current.SGST, current.unit), 0);
    // //alert("total sgst" + sgst);
    // this.BillDetails.sgst = sgst;

    let cgst = arr.reduce((accumulator, current) => accumulator + parseFloat(current.CGSTVal), 0);
    //alert("total cgst" + cgst);
    this.BillDetails.cgst = cgst;

    let sgst = arr.reduce((accumulator, current) => accumulator + parseFloat(current.SGSTVal), 0);
    //alert("total sgst" + sgst);
    this.BillDetails.sgst = sgst;



    //final sale price
    let totalPurchaseValue = arr.reduce((accumulator, current) => accumulator + parseFloat(current.TotalPurchasePrice), 0);
    //alert("total sgst" + sgst);
    this.BillDetails.TotalPurchasePrice = totalPurchaseValue;
    this.BillDetails.TotalSalePrice = p;
    //alert(totalPurchaseValue);


    //alert("total tax" + (cgst + sgst));
    //this.BillDetails.push();
    this.BillDetails.totalTax = cgst + sgst;
    this.BillDetails.NetProffit  = p- totalPurchaseValue;
    this.BillDetails.TotalGST  = cgst + sgst;

    let resultGroupbyInn = [];

    this.teachersForm.value.teachers.forEach(function (a) {
      if (a.name !== '' && a.price !== "0") {
        if (!this[a.name]) {

          this[a.name] = { ItemName: a.name, unit: 0, invId: a.inventoryID };
          resultGroupbyInn.push(this[a.name]);

        }
        this[a.name].unit += Number(a.unit);
      }
      //this[a.color].instances += a.instances;
    }, Object.create(null));
    this.resultGroupby = resultGroupbyInn;
    //this.UpdateStock();

  }

  CalculateanyPercent(total: string, discount: string, unit: string): number {

    var result = ((parseFloat(discount) / 100) * parseFloat(total)) * parseFloat(unit);
    return result;
  }
  showPrintAfterSave: boolean = false;
  UpdateStock(finalStatus: string) {
    if (this.teachersForm.value.CaseID.trim() == "" && this.CashBilling != true) {
      alert('Please provide the CASEID.');
      return;
    }
    else {
      this.showPrintAfterSave = true;
      this.FinalCalculation();
      if (this.CashBilling == true) {
        this.teachersForm.value.CeditStatus = "Cash";
        this.teachersForm.value.IPDOPDId = 'Direct';
        //this.teachersForm.value.PharmacyStoreName = this.newid;
      }
      else {
        this.teachersForm.value.CeditStatus = "Credit";
        this.teachersForm.value.IPDOPDId = this.newid;
        this.teachersForm.value.CaseID = this.teachersForm.value.CaseID;
      }
      if (this.resultGroupby.length > 0) {

        this.teachersForm.value.teachers = this.teachersForm.value.teachers.filter((item) => item.name !== '')
        if (finalStatus == 'Closed') {
          this.teachersForm.value.PaymentStatus = 'Closed';
        }
//alert('No1'+this.teachersForm.value.BillingDate);
        //net proffit sale and purchase
        var dateObj = new Date(this.teachersForm.get('BillingDate').value);
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        this.teachersForm.value.GrossSalePriceOnthisBill  = this.BillDetails.TotalSalePrice. toString();
        this.teachersForm.value.GrossPurchasePriceOnthisBill  = this.BillDetails.TotalPurchasePrice. toString();
        this.teachersForm.value.GrossProffitPriceOnthisBill   = this.BillDetails.NetProffit. toString();
        this.teachersForm.value.GrossGSTPriceOnthisBill   = this.BillDetails.TotalGST. toString();
        this.teachersForm.value.BillingMonth   = month.toString();
        this.teachersForm.value.BillingYear    = year.toString();
        this.teachersForm.value.DoctorPercentage    = (this.referralMaster.find(a=>a.FirstName == this.teachersForm.value.refferDoctor))?.Commission;
        //alert('No2'+ this.teachersForm.value.BillingDate);
        //
        if (this.FarmaUniqueID != null && this.FarmaUniqueID !== '') {
          this.farmacyEntryService.update(this.FarmaUniqueID, this.teachersForm.value).subscribe((data) => {
            alert('Data updated successfully.' + data.BillNo);
            //this.router.navigate(['/home', 37], { queryParams: { username: "Cancel" } });
          });
        }
        else {
          // alert(this.teachersForm.value);
          // alert (JSON.stringify(this.teachersForm.value) );
          //console.log(this.teachersForm.value);
          //console.log(JSON.stringify(this.teachersForm.value));
          this.farmacyEntryService.createStudent(this.teachersForm.value).subscribe((data) => {
            alert('Data created successfully.' + data.BillNo);
            this.FarmaUniqueID = data.UnqueID;
            if (this.CashBilling == true) {
              //this.teachersForm.value.CaseID = data.UnqueID;
              this.teachersForm.value.CaseID = data.CaseID;
              this.teachersForm.value.BillNo = data.BillNo;
              this.goingTobeID = data.BillNo;
              this.FarmaUniqueID = data.UnqueID;
              //this.teachersForm.get('BillNo').patchValue(data.BillNo);
              //this.router.navigate(['/home', 37], { queryParams: { username: "Cancel" } });
            }
            
          });
        }
      }
      else {
        alert('Please enter price for item and do Final Calculation then save it.');
      }
    }
  }
 

  PR: string = 'false';
  eventCheck(event) {

    //alert(event.target.checked);
    this.PR = event.target.checked.toString();
  }
  UpdateStockMethod() {
    if (this.teachersForm.value.PaymentStatus !== 'Closed') {
      //--------

      //---------
      if (this.PR == 'true') {
        this.UpdateStock('Closed');
        this.teachersForm.value.teachers.filter(x => x.inventoryID != '').forEach((element) => {
          //alert(element.name +'-'+ element.inventoryID);
          var invIDUnique = element.inventoryID;
          var Updateqty = element.unit;
          let p: InventoryMaster = this.Inventory.find(x => x.UnqueID == invIDUnique)
          //employee.EmpId = this.row.id;
          //student.UnqueID = this.data.row.UnqueID;
          var id = invIDUnique;
          //var p = student.UnqueID;
          p.stockQty = (Number(p.stockQty) - Number(Updateqty)).toString();
          this.inventoryService.update(id, p).subscribe(() => {
            // this.dataSaved = true;
          });
          //element.product_desc = element.product_desc.substring(0,10);

        });

        //alert('Stock Updated');
        this.refreshPage();
      }
      else {
        alert('Select the Recived the payment option term&Condition and it will allow to create the final Bill');
      }
    }
    else {
      alert('It is a VIEW and this is a final bill, You can not modify anything to Save or Update the Bill.');
    }

  }

  CloseMe() {
    this._router.navigate(['/home', 37], { queryParams: { username: "ax3r5!mmmt!4rtresjjgnth" } });
  }
  finalMedicinehistory: string;
  finalMedicineList(passdata: any) {
    if (passdata != undefined) {
      for (let i = 0; i < passdata.length; i++) {

        this.finalMedicinehistory += passdata[i].MedicineNamesHL;// = (passdata.teachersDoctortoPatientCommentMedicineReDevelop[i].MedicineNamesHL == null ? '' : passdata.teachersDoctortoPatientCommentMedicineReDevelop[i].MedicineNamesHL) + "\n" + new Date().toLocaleString() + "\n" + passdata.teachersDoctortoPatientCommentMedicineReDevelop[i].MedicineNames;

      }
    }
  }

  animal: string;
  name: string = 'liku';
  hlData: string;
  patientHistory: string;
  patientDiagnosis: string;
  patientAdvice: string;
  patientPathotest: string;
  BD: any;
  OpenPrescription(): void {

    //var printdata = document.getElementById('idMedicineNames').innerText;
    //var newwin = window.open("");
    //newwin.document.write(printdata.outerHTML);

    const dialogRef = this.dialog.open(PrintBillComponent, {
      width: '750px',
      height: '600px',
      data: { name: this.name, animal: this.animal, dt: this.printBillArray, BD: this.BillDetails, patientInfo: this.teachersForm.value }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
      this.hlData = result;
    });
  }

  //name = 'Angular 6';
  // counts = [1];
  // private inputToFocus: any;
  // @ViewChildren('inputToFocus') set inputF(inputF: any) {
  //   this.inputToFocus = inputF
  //   this.inputToFocus.last.nativeElement.focus();
  // }
  asyncPipeCategoryDetails= ['All','Medicine','Cposmetic','Vegetable','Grocerry','Liquid','Others'];
  onStatusChange(ob) {
    //console.log('Book changed...');
    let selectedBook = ob.value;
    //console.log(selectedBook);
    this.LoadInventoriesCategoryWise(selectedBook);
  }
  InventoryInd:InventoryMaster[];
  displayedColumns = ['itemName', 'ItemCode', 'Others', 'inventoryID'];
  dataSource = new MatTableDataSource<InventoryMaster>(null);
  bogusDataSource = new MatTableDataSource<InventoryMaster>(null);
  LoadInventoriesCategoryWise(passItem:string) {
    this.inventoryService.GetCategoryWiseQuickLook(passItem,this.Username).subscribe((data: InventoryMaster[]) => {
      this.InventoryInd = data;//.filter(a => a.EntryOwner == this.Username || a.EntryOwner == undefined || a.EntryOwner == '');

      
      this.dataSource = new MatTableDataSource<InventoryMaster>(this.InventoryInd);
      //this.bogusDataSource = new MatTableDataSource<InventoryMaster>(null);

    })
  }
  filterVal:string;
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  OpenCalculator(): void {
  
    const dialogRef = this.dialog.open(CalculatorComponent, {
      width: '500px',
      //height: '650px',
      position : { right: '20px', top: '20px' },
      data: {name: 'Yes'}
    });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.animal = result;
      });
  }
  reloadComponent() {
    let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
    }
    openInvestigationDialogNew(AddNew: string): void {
      //alert(JSON.stringify(row));
      //this.id = id;
      const dialogRef = this.dialog.open(ReffersDetailsComponent, {
        width: '900px', height: '600px', disableClose: true, data: { AddEdit: 'Pharmacy' }
      }).afterClosed()
      .subscribe(() => this.refreshParent());;
  
    }
    refreshParent(){
      //alert('closed');
      this.LoadAllDoctor();
    }
    referralMaster: ReferralMaster[];
    LoadAllDoctor() {
      //this.referralMaster = this.allStaffParm.filter(x=> x.StaffType == 'Doctor');
      this.referralMasterService.getStaffType('Doctor').subscribe((data: ReferralMaster[]) => {
        //console.log(data);
        this.referralMaster = data;
  
      })
    }
}
