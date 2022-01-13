import { Component, Input, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent, MatDialog } from '@angular/material';

import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { ElementRef, ViewChild } from "@angular/core";

import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

import { gender } from './models/AllConstansts';
import { DeptInvestigationComponent } from './Popups/dept-investigation.component';
import { ReferrerPopupComponent } from './Popups/referrer-popup.component';
import { LabTestMainService } from './Services/lab-test-main.service';
import { GroupTests, LabTestMaster, ReferralMaster } from './models/UserData';
import { RefaralService } from './Services/referal.service';
import { ReffersDetailsComponent } from './reffers-details.component';
import { LabtestParameterComponent } from './MasterForms/labtest-parameter.component';
import { AllMasterFixedData } from './shared/AllConstants';
import { GrouTestService } from './Services/grou-test.service';

export interface Fruit {
  TestName: string;
  TestPrice: number;
}

// export const _filter = (opt: LabTestMaster[], value: string): LabTestMaster[] => {
//   const filterValue = value.toLowerCase();

//   return opt.filter(item => item.TestName.toLowerCase().indexOf(filterValue) === 0);
// };

export interface StateGroup {
  letter: string;
  names: string[];
}



export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

@Component({ 
  selector: 'app-case-details',
  templateUrl: './case-details.component.html',
  styleUrls: ['./case-details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CaseDetailsComponent implements OnInit {

  @Input() CaseDetails: FormGroup;
  @Input() allStaffParm:ReferralMaster[];
  msgFromComponent: string = "Based on Test Selection";
  button = 'Submit';
  isLoading = false;

  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = false;

  separatorKeysCodes = [ENTER, COMMA];

  fruitCtrl = new FormControl();

  filteredFruits: Observable<Fruit[]>;

  fruits = [
    // {name: 'Lemon',price:100},
  ];


  alphabet:string[] = AllMasterFixedData.alphabet;
  objectOptions = [
    { name: "Angular" },
    { name: "React" },
    { name: "Vue" },
    { name: "Angular Material" }
  ];

  options: LabTestMaster[]=[];//[]= ['One', 'Two', 'Three'];
  filteredOptions: Observable<LabTestMaster[]>;


  // allFruits: Fruit[] = [
  //   { name: 'ABG', price: 100 },
  //   { name: 'RootCannal', price: 225 },
  //   { name: 'AEC', price: 100 },
  //   { name: 'A/G Ratio', price: 300 },
  //   { name: 'Blood Sugar PP', price: 200 },
  //   { name: 'Chikunguniya', price: 150 },
  //   { name: 'Fasting Blood Sugar', price: 100 },
  // ];
  //@ViewChild("fruitInput") fruitInput: ElementRef;
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  data: Fruit[] = [
    // {
    //                 "name": "",
    //                 "price": 0
    //               }
  ];

  asyncPipeLabTestMaster:LabTestMaster[];
  optionsView:LabTestMaster[];
  optionsViewFilter:LabTestMaster[];
  asyncPipeLabTestMaster1:Observable<LabTestMaster[]>;
  referralMaster: ReferralMaster[] = [];

 
 


  constructor(public dialog: MatDialog, private _fb: FormBuilder,private labTestMasterService : LabTestMainService,
    public referralMasterService: RefaralService,private grouTestService: GrouTestService) {

    this.labTestMasterService.getAll().subscribe((data:any) => {
      //console.log('jay'+data);
      this.asyncPipeLabTestMaster = data;
      this.asyncPipeLabTestMaster1=data;// as LabTestMaster[];
      this.optionsView = data;
      this.optionsViewFilter = data;
      //this.options = data;
      //this.options1 = data
      //this.filteredOptions = data;
      for(var i = this.asyncPipeLabTestMaster.length - 1; i >= 0; i--) {
        this.options.push(this.asyncPipeLabTestMaster[i]);
      
      }
      // this.labTestMasterService.getAll().subscribe((data: LabTestMaster[]) => {
      //   //this.asyncPipeLabTestMaster = data;
      //   // this.asyncPipeLabTestMaster = this.fruitCtrl.valueChanges
      //   // .pipe(
      //   //   startWith(''),
      //   //   map(val => this._filter1(val))
      //   // );
  
      //   // this.asyncPipeLabTestMaster1 = this.fruitCtrl.valueChanges.pipe(
      //   //   startWith(null),
      //   //   map((fruit: LabTestMaster | null) => fruit ? this._filter1(fruit) : this.asyncPipeLabTestMaster1));

      //   // this.asyncPipeLabTestMaster1 = this.myControl1.valueChanges.pipe(
      //   //   startWith(""),
      //   //   map(value => this._filter1(value))
      //   // );
  
      // });
    });
  }
  applyFilterAlphabet(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if(filterValue == 'all'){
      //alert('ab');
    this.optionsView =  this.optionsViewFilter;//.filter(a=> a.TestName.charAt(0).toLowerCase() === filterValue);
    }
    else{
      this.optionsView =  this.optionsViewFilter.filter(a=> a.TestName.charAt(0).toLowerCase() === filterValue);
    }
   
  }
  RefreshForNewlyAddedTests(){
    this.labTestMasterService.getAll().subscribe((data: any) => {
      //console.log('jay'+data);
      this.asyncPipeLabTestMaster = data;
      // this.labTestMasterService.getAll().subscribe((data: LabTestMaster[]) => {
      //   this.asyncPipeLabTestMaster = data;
        
      // });
    });

  }

  LoadAllDoctor() {
    this.referralMaster = this.allStaffParm.filter(x=> x.StaffType == 'Doctor');
    // this.referralMasterService.getAll().subscribe((data: ReferralMaster[]) => {
    //   //console.log(data);
    //   this.referralMaster = data;

    // })
  }
  LoadAllDoctorAfterPopup() {
   // this.referralMaster = this.allStaffParm.filter(x=> x.StaffType == 'Doctor');
    this.referralMasterService.getAll().subscribe((data: ReferralMaster[]) => {
      //console.log(data);
      this.referralMaster = data;

    })
  }
  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['allStaffParm']) {
      this.referralMaster = this.allStaffParm.filter(x=> x.StaffType == 'Doctor');
    }
}

  filteredBooks: ReferralMaster[];
  objfilteredBooks: ReferralMaster;

  referralChangeAction() {

  
    this.filteredBooks = this.referralMaster.filter(val => val.FirstName == this.CaseDetails.controls['RefferDoctorName'].value);

    this.objfilteredBooks = this.referralMaster.find(val => val.FirstName == this.CaseDetails.get('RefferDoctorName').value);
    //alert(JSON.stringify(this.filteredBooks) );
    this.CaseDetails.controls['RefferDoctorCharge'].setValue(this.filteredBooks[0].fees);
    //this.addrFrom.controls['discount'].setValue(this.filteredBooks[0].Discount);
    this.CaseDetails.controls['RefferDoctorCommission'].setValue(this.objfilteredBooks.Commission);
  }
  lessons: boolean = true;
 

  gender: gender[] = [
    { id: 'm', name: 'Male' },
    { id: 'f', name: 'Female' },
    { id: 'b', name: 'Both' }
  ];

  states: Array<String> = ['AR', 'AL', 'CA', 'DC'];
  parentTestName: string;

  AddTestInNewTab() { 
    window.open( 
      "http://45.34.15.113:9007/health/LabtestParameter/Add?username=outtabcasestudy", "_blank");
}

displayFn(subject) {
  return subject ? subject.name : undefined;
}

myControl = new FormControl();
myControl1 = new FormControl();

  ngOnInit() {
    this.LoadAllDoctor(); 
    this.LoadGroup();
    // // // this.labTestMasterService.getAll().subscribe((data:any) => {
    // // //   //console.log('jay'+data);
    // // //   this.asyncPipeLabTestMaster = data;
    // // //   this.asyncPipeLabTestMaster1=data;// as LabTestMaster[];
    // // // });

    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   startWith(""),
    //   map(value => this._filter(value))
    // );

    // this.asyncPipeLabTestMaster1 = this.myControl1.valueChanges.pipe(
    //   startWith(""),
    //   map(value => this._filter1(value))
    // );

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    

    // this.stateGroupOptions = this.CaseDetails.get('names').get('TestName')!.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this._filterGroup(value))
    //   );

    //console.log('CaseDetails FormGroup is ', this.CaseDetails)
  }

  private _filter(value: string): LabTestMaster[] {
    const filterValue = value.toString().toLowerCase();

    return this.options.filter(option => option?.TestName?.toString().toLowerCase().includes(filterValue));
  }

  // ManageNameControl(index: number) {
  //   var arrayControl = <FormArray>(<FormArray>this.CaseDetails.get('TestType')).at(0).get("names")
  //   this.asyncPipeLabTestMaster1[index] = arrayControl.at(index).get('TestName').valueChanges
  //     .pipe(
  //     startWith<string | LabTestMaster>(''),
  //     map(value => typeof value === 'string' ? value : value.TestName),
  //     map(name => name ? this._filter(name) : this.options.slice())
  //     );

  // }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.options.filter(option =>
  //     this.options.toLowerCase().includes(filterValue)
  //   );
    
  // }




  cities = ['Mr.', 'Mrs.', 'Smt', 'Shree'];
  CollectionCenter = ['Main', 'Outside'];
  addAllTestsGroup(testName) {
    return this._fb.group({
      Description: [''],
      RefferDoctorName: [''],
      RefferDoctorCharge : [''],
      RefferDoctorCommission : [''],
      CollectionCenter:[''],
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

  newStudent(): FormGroup {
    return this._fb.group({
      TestName: '', TestPrice: ''
    })
  }

  // addStudent(ti: number, bi: number) {
  //   this.students(ti, bi).push(this.newStudent());
  // }


  getAddress(form) {
    //console.log(form.controls.AllTests.controls);
    return form.controls.AllTests.controls;
  }

  getAddressNames(form) {
    //console.log(form.controls.names.controls);
    return form.controls.names.controls;
  }

  get TestAddressNamedup() {

    return (<FormArray>(<FormArray>this.CaseDetails.get('TestType')).at(0).get("names")).controls;
  }

  addAddress(testName) {
    var ct: number = 0;
    this.TestTypeArray.controls.forEach(control => {
      if (control?.value?.parentTest == testName) { ct += 1; }
    });

    if (ct < 1)
      this.TestTypeArray.push(this.addAllTestsGroup(testName));
  }
  removeAllTests(index) {
    this.TestTypeArray.removeAt(index);
  }
  get TestTypeArray() {
    return <FormArray>this.CaseDetails.get('TestType');
  }

  getQuestions(form) {
    //console.log(form.controls.questions.controls);
    return form.controls.questions.controls;
  }





  showLabTemplate() {
    this.lessons = true;
  }
  hideLabTemplate() {
    this.lessons = false;
  }

  openDialogNew(AddNew: string): void {
    //alert(JSON.stringify(row));
    //this.id = id;
    const dialogRef = this.dialog.open(ReferrerPopupComponent, {
      width: '580px', height: '500px', disableClose: true, data: { AddEdit: 'Add' }
    });

  }

  openInvestigationDialogNew(AddNew: string): void {
    //alert(JSON.stringify(row));
    //this.id = id;
    const dialogRef = this.dialog.open(ReffersDetailsComponent, {
      width: '850px', height: '600px', disableClose: true, data: { AddEdit: 'Add' }
    }).afterClosed()
    .subscribe(() => this.refreshParent());;

  }

  refreshParent(){
    //alert('closed');
    this.LoadAllDoctorAfterPopup();
  }
  refreshPathLabTest(){
    //alert('closed patholab');
    this.RefreshForNewlyAddedTests();
  }
  openLabTestAdd(): void {
    //alert(JSON.stringify(row));
    //this.id = id;
    const dialogRef = this.dialog.open(LabtestParameterComponent, {
      width: '1050px', height: '580px', disableClose: true, data: { AddEdit: 'Add' }
    }).afterClosed()
    .subscribe(() => this.refreshPathLabTest());;

  }

  clickme(event) {
    this.isLoading = true;
    this.button = 'Processing';

    setTimeout(() => {
      this.isLoading = false;
      this.button = 'Submit';
      //alert('Done loading');
      //this.openInvestigationDialogNew("Add");


    }, 2000)
  }

  patchValue2() {

    var data = { "home": { "UnqueID": null, "Title": "", "UserName": "", "FirstName": "ewe", "LastName": "werwe", "Year": 21, "Month": 0, "Days": 0, "Gender": "1", "Email": "", "ContactNumber": "8904292924", "Address": "sdfsdf", "Status": "true" }, "CaseDetails": { "RefferDoctorName": "Shree", "CollectionCenter": "Main", "TestType": [ { "Description": "", "CollectionCenter": "", "parentTest": "LAB", "Paid": "1002", "Discount": "2", "DiscountType": "Mr.", "TotalSum": 250, "names": [ { "name": "Chikunguniya", "price": 150 }, { "name": "AEC", "price": 100 } ] }, { "Description": "", "CollectionCenter": "", "parentTest": "DENTAL", "Paid": "200", "Discount": "20", "DiscountType": "Smt", "TotalSum": 400, "names": [ { "name": "AEC", "price": 100 }, { "name": "Blood Sugar PP", "price": 200 }, { "name": "ABG", "price": 100 } ] } ] }, "PaymentDetails": { "Amount": 2000, "Discount": 500, "PaidAmount": 1500, "Balance": 500, "CaseID": "12141880", "ReceivedBy": "liku", "Date": "", "Description": "my descstring" }, "BedDetails": { "Description": "", "BedNumber": "DB001", "BedPrice": 350, "Upgrade": false, "StartDate": "2021-01-19T18:30:00.000Z", "EndDate": "2021-01-29T18:30:00.000Z", "NofDays": 10, "TotalPrice": "3500" } };
    this.clearFormArray();



    let i: number = 0;
    data.CaseDetails.TestType.forEach(t => {

      var teacher: FormArray = (this.CaseDetails.get("TestType") as FormArray); //this.addAllTestsGroup();
      var teacher1: FormGroup = this.addAllTestsGroup('LAB');
      teacher.push(teacher1);
      let p: number = 0;
      const toppingsRootAllTests = (<FormArray>(<FormArray>this.CaseDetails.get('TestType')).at(0).get("names"));
      //const toppingsRootAllTests = (<FormArray>this.CaseDetails.get('TestType'))
      let k: number = 0;
      t.names.forEach(m => {
        // const toppingsRootAllTests1 = <FormArray>(<FormArray>this.CaseDetails.get('TestType'));
        // toppingsRootAllTests.push(m);
        var teacherInn: FormArray = ((this.CaseDetails.get("TestType") as FormArray).at(i).get('names')) as FormArray; //this.addAllTestsGroup();
        var teacher1Inn: FormGroup = this.newStudent();
        teacherInn.push(teacher1Inn);

      })
      k += 1;
      toppingsRootAllTests.patchValue(t.names);
      i += 1;
    });
    this.CaseDetails.patchValue(data.CaseDetails);
    let toppingsRootAllTests1 = <FormArray>(<FormArray>this.CaseDetails.get('TestType'));
    //toppingsRootAllTests1.patchValue({names:data.CaseDetails.TestType[0].names});

    //toppingsRootAllTests1.patchValue(names: { name: 'ABG', price: 100 }  );

    // toppingsRootAllTests1.patchValue(data.CaseDetails.TestType[0].names);
    this.getTotalVal();
  }



  clearFormArray() {

    //Angular 8 +
    (this.CaseDetails.get("TestType") as FormArray).clear();
    //this.CaseDetails.clear();

    //older Versions of angualar
    //while (this.teachers().length) {
    //  this.teachers().removeAt(0);
    //}
  }

  pr: number = 0;

  cal: number = 0;


  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  //addded newly
  display() {
    // this.this.CaseDetails.get('TestType')).at(0).setValue({
    //   Paid: "Yes",
    //   names: [{ name: "sysdice1" }, { name: "samal" }]
    // });
  }
  initName(name: Fruit): FormControl {
    return this._fb.control(name);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    let data1: Fruit[] = [
      {
        TestName: "Lime",
        TestPrice: 150
      },
      {
        TestName: "Apple",
        TestPrice: 300
      }
    ];
    // Add our fruit
    if ((value || "").trim()) {
      this.fruits.push({ name: value.trim(), price: 100 });
      //const control = <FormArray>this.myForm.get("names");
      const control = (<FormArray>this.CaseDetails.get('TestType')).at(0).get("names");
      //control.push(data1);
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: Fruit, deleteIndex: number,parentIndex:number): void {

    const control = <FormArray>(<FormArray>this.CaseDetails.get('TestType')).at(parentIndex).get("names");

    control.removeAt(deleteIndex);

    // const index = control.value.indexOf(fruit);

    // if (index >= 0) {
    //   control.value.splice(index, 1);
    // }
    this.getTotalVal();

  }

  // filter(itemname: Fruit) {
  //   return this.allFruits.filter(
  //     fruit => fruit.name.toLowerCase().indexOf(itemname.TestName.toLowerCase()) === 0
  //   );
  // }

  // private _filter(value: string): Fruit[] {
  //   const filterValue = value.toLowerCase();

  //   return this.allFruits.filter(fruit => fruit.name.toLowerCase().indexOf(filterValue) === 0);
  // }

  TotalTestPriceValue: number = 0;
  // getTotalVal():number
  // {
  //   const control = <FormArray>(<FormArray>this.CaseDetails.get('TestType')).at(0).get("names");
  // const pp =  this.CaseDetails.value.TestType[0].names;
  //     var ct: number = 0;
  //     this.TotalTestPriceValue = 0;
  //     pp.forEach(control1 => {
  //      this.TotalTestPriceValue+= Number(control1.price);
  //      ct+= Number(control1.price);
  //     });

  //     return ct;
  // }

  getTotalVal(): number {
    const kk = this.CaseDetails.value.TestType;
    kk.forEach((controlOut, index) => {
      const control = <FormArray>(<FormArray>this.CaseDetails.get('TestType')).at(0).get("names");
      const pp = controlOut.names;
      var ct: number = 0;
      this.TotalTestPriceValue = 0;
      pp.forEach(control1 => {
        this.TotalTestPriceValue += Number(control1.TestPrice);
        ct += Number(control1.TestPrice);

      });
      //controlOut.patchValue({TotalSum: ct});
      (<FormArray>this.CaseDetails.get('TestType')).at(index).patchValue({ TotalSum: ct });
    });
    // const control = <FormArray>(<FormArray>this.CaseDetails.get('TestType')).at(0).get("names");
    // const pp = this.CaseDetails.value.TestType[0].names;
    var ct: number = 0;
    // this.TotalTestPriceValue = 0;
    // pp.forEach(control1 => {
    //   this.TotalTestPriceValue += Number(control1.price);
    //   ct += Number(control1.price);
    //   //(<FormArray>this.CaseDetails.get('TestType')).at(0).patchValue({TotalSum: ct});
    // });

    //(<FormArray>this.CaseDetails.get('TestType')).at(1).patchValue({TotalSum: '200'});

    return ct;
  }
  selected(event: MatAutocompleteSelectedEvent, i: number): void {
    //alert("me" + event.option.value.name);
    //console.log(aa);
    //this.fruits.push({ name: event.option.viewValue,price:100 });
    this.fruitInput.nativeElement.value = "";

    //console.log(event.option);
    //const control = <FormArray>this.CaseDetails.get("names");
    const control = <FormArray>(<FormArray>this.CaseDetails.get('TestType')).at(i).get("names");

    var ct: number = 0;
    control.value.forEach(control1 => {
      //alert(control1.name);
      if (control1.TestName == event.option.value.TestName) {
        ct += 1;
      }
    });
    //alert("count" + ct);
    if (ct < 1) {
      control.push(
        this.initName({
          TestName: event.option.value.TestName,
          TestPrice: event.option.value.TestPrice
        })
      );
      //this.ManageNameControl(control.length - 1);

      //this.fruits.push({ name: event.option.viewValue, price: event.option.value });
    }
    this.getTotalVal();
    this.fruitCtrl.setValue(null);
    //control.patchValue(this.data);
  }
SelectedGroups:string[];
param: Array<string> = [];
  onSupplierValueChange(suplierId,ind){
    var pkgCombine=(<FormArray>this.CaseDetails.get('TestType')).at(ind).get('grpPkgName').value;
    
    //(<FormArray>this.CaseDetails.get('TestType')).at(ind).patchValue({ grpPkgName: pkgCombine });
    if(pkgCombine!== null){
      pkgCombine = (<FormArray>this.CaseDetails.get('TestType')).at(ind).get('grpPkgName').value+','+  suplierId.value.GroupName;
      (<FormArray>this.CaseDetails.get('TestType')).at(ind).patchValue({ grpPkgName: pkgCombine});
    }
    else{
      (<FormArray>this.CaseDetails.get('TestType')).at(ind).patchValue({ grpPkgName: suplierId.value.GroupName });
    }
    //this.SelectedGroups.push(suplierId.value.name);
    console.log(suplierId.value.GroupName);
    this.param.push(suplierId.value.GroupName);
    for(var m=0;m<=suplierId.value.names.length-1;m++){
      var a:Fruit={TestName:suplierId.value.names[m].TestName,TestPrice :suplierId.value.names[m].TestPrice};
      this.selectedGroup(a,ind);
     }
    //I imagine you has some like
    // this.productOption[index]=this.list.find(x=>x.id=supplierId).options
    // //or you call to an API o whatever, but remember you change
    // this.productOption[index]=... 
 
 }

addGroupVal(groupTestNames,ind){
  
 for(var m=0;m<=groupTestNames.names.length-1;m++){
  var a:Fruit={TestName:groupTestNames.names[m].TestName,TestPrice :groupTestNames.names[m].TestPrice};
  this.selectedGroup(a,ind);
 }

}
groupTestNames:any;
grp:GroupTests[];
LoadGroup(){

this.grouTestService.getAll().subscribe((data:any) => {
  //console.log('jay'+data);
  this.grp = data;
});

}
selectedGroup(event: Fruit, i: number): void {
  //alert("me" + event.option.value.name);
  //console.log(aa);
  //this.fruits.push({ name: event.option.viewValue,price:100 });
  this.fruitInput.nativeElement.value = "";

  //console.log(event.option);
  //const control = <FormArray>this.CaseDetails.get("names");
  const control = <FormArray>(<FormArray>this.CaseDetails.get('TestType')).at(i).get("names");

  var ct: number = 0;
  control.value.forEach(control1 => {
    //alert(control1.name);
    if (control1.TestName == event.TestName) {
      ct += 1;
    }
  });
  //alert("count" + ct);
  if (ct < 1) {
    control.push(
      this.initName({
        TestName: event.TestName,
        TestPrice: event.TestPrice
      })
    );
    //this.ManageNameControl(control.length - 1);

    //this.fruits.push({ name: event.option.viewValue, price: event.option.value });
  }
  this.getTotalVal();
  this.fruitCtrl.setValue(null);
  //control.patchValue(this.data);
}

}