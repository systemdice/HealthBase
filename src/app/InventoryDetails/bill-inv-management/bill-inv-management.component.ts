import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms'
import { FarmacyDeliveryToPatient } from '../../models/UserData';
import { FarmacyEntryService } from '../../Services/farmacy-entry.service';
import { InventoryMaster } from 'src/app/models/UserData';
import { InventoryService } from 'src/app/Services/inventory.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
export interface IBrand {
  BrandId: string;
  BrandName: string;
}


@Component({
  selector: 'app-bill-inv-management',
  templateUrl: './bill-inv-management.component.html',
  styleUrls: ['./bill-inv-management.component.css']
})
export class BillInvManagementComponent implements OnInit {

  title = 'FormArray SetValue & PatchValue Example';

  teachersForm: FormGroup;
  public Inventory: InventoryMaster[] = [];
  options: string[] = ['One', 'Two', 'Three', 'four'];
  filteredOptions: Observable<string[]>;
  myFormattedDateShow: any;
  
  constructor(private fb: FormBuilder, public farmacyEntryService: FarmacyEntryService, public inventoryService: InventoryService) {
    const now = new Date();
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
      BillingDate: [{ value: myFormattedDate, disabled: true }],
      BilledBy: [{ value: 'Ajay', disabled: true }],
      CustomerName: 'Sanjay',
      Address: 'Big Bazar',
      PhoneNumber: '',
      priorityStatus: [true],
      teachers: this.fb.array([]),
    })
  }

  filteredOptions1: Observable<string[]>;
  filter(val: string): any[] {
    return  this.Inventory.filter(option =>
      option.itemName.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  getPosts(abc:string,index:number){
    ((this.teachersForm.get('teachers') as FormArray).at(index) as FormGroup).get('name').patchValue(abc);
    //alert(abc);
    this.targettt.value = abc;
    this.onForm2NameChangenew(abc,index);

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
      discount: '0',
      CGST: '0',
      SGST: '0',
      tax: '0',
      total: '0',//[{value: '0', disabled: true}],
      inventoryID: ''

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

  ]
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
  }
  myControl = new FormControl();
  // Getter to retrieve the FormArray
  get accountsArray(): FormArray {
    return this.teachersForm.get('teachers ') as FormArray;
  }
  ngOnInit(): void {
    this.LoadAllTestInvestigations();
    this.LoadInventories();

    this.addTeacher();


  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  CalculateFinalPriceWithDiscount(price: string, discount: string, unit: string): number {

    var result = (parseFloat(discount) / 100) * parseFloat(price);
    return (parseFloat(price) * parseFloat(unit)) - (result * parseFloat(unit));
  }

  CalculateTotalDiscount(price: string, discount: string, unit: string): number {
    return parseFloat(discount) * parseFloat(unit);
  }

  PopulateCustomerData({ target }) {

  }

  getControlLabel(ti: number) {
    return (((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('inventoryID').value == '' ? 'NA' : ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('inventoryID').value);
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
    //this.FinalCalculation();
  }

  onForm2NameChange({ target }, ti: any) {

    let p: any = this.Inventory.find(x => x.itemName == target.value.toString() || x.BarCode == target.value.toString());
    let objIndex = this.Inventory.findIndex(x => x.itemName == target.value.toString() || x.BarCode == target.value.toString());



    if (objIndex !== -1) {
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('name').patchValue(this.Inventory[objIndex]?.itemName);

      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('price').patchValue(this.Inventory[objIndex]?.SellPrice);
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('discount').patchValue(this.Inventory[objIndex]?.Discount);
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('SGST').patchValue(this.Inventory[objIndex]?.SGST);
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('CGST').patchValue(this.Inventory[objIndex]?.CGST);
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('unit').patchValue("1");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('inventoryID').patchValue(this.Inventory[objIndex]?.UnqueID);


      let price = ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('price').value;
      let discount = ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('discount').value;
      let FC = this.CalculateFinalPriceWithDiscount(price, discount, "1");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('total').patchValue(FC);
      // let index = this.teachersForm.value.teachers.findIndex(x => x.itemName === "");
      // if(index == -1){
      //   this.addTeacher();
      // }
      // else{
      // // alert("Emtty row is there");
      // }
      console.log(target.value);
      this.FinalCalculation();
      this.update();
    }
    else {
      //((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('price').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('price').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('discount').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('SGST').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('CGST').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('total').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('inventoryID').patchValue("");


    }
    //this.FinalCalculation();
  }
  onForm2NameChangenew(targetvalue, ti: any) {

    let p: any = this.Inventory.find(x => x.itemName == targetvalue.toString() || x.BarCode == targetvalue.toString());
    let objIndex = this.Inventory.findIndex(x => x.itemName == targetvalue.toString() || x.BarCode == targetvalue.toString());



    if (objIndex !== -1) {
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('name').patchValue(this.Inventory[objIndex]?.itemName);

      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('price').patchValue(this.Inventory[objIndex]?.SellPrice);
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('discount').patchValue(this.Inventory[objIndex]?.Discount);
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('SGST').patchValue(this.Inventory[objIndex]?.SGST);
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('CGST').patchValue(this.Inventory[objIndex]?.CGST);
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('unit').patchValue("1");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('inventoryID').patchValue(this.Inventory[objIndex]?.UnqueID);


      let price = ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('price').value;
      let discount = ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('discount').value;
      let FC = this.CalculateFinalPriceWithDiscount(price, discount, "1");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('total').patchValue(FC);
      // let index = this.teachersForm.value.teachers.findIndex(x => x.itemName === "");
      // if(index == -1){
      //   this.addTeacher();
      // }
      // else{
      // // alert("Emtty row is there");
      // }
      //console.log(target.value);
      this.FinalCalculation();
      this.update();
    }
    else {
      //((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('price').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('price').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('discount').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('SGST').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('CGST').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('total').patchValue("0");
      ((this.teachersForm.get('teachers') as FormArray).at(ti) as FormGroup).get('inventoryID').patchValue("");


    }
    //this.FinalCalculation();
  }


targettt={value:''};

  update() {
    let index = this.teachersForm.value.teachers.findIndex(x => x.name === "");
    if (index == -1) {
      this.addTeacher();
    }
    else {
      // alert("Emtty row is there");
    }
    //let p:any = (this.teachersForm.get('teachers') as FormArray).find(x=> x.itemName==target.value.toString());
    this.FinalCalculation();
  }

  

  searchTerm: FormControl = new FormControl();

  LoadInventories() {
    this.inventoryService.getAll().subscribe((data: InventoryMaster[]) => {
      this.Inventory = data;

      this.Inventory.forEach((element, index, array) => {
        this.options.push(element.itemName)
        // console.log(element.x); // 100, 200, 300
        // console.log(index); // 0, 1, 2
        // console.log(array); // same myArray object 3 times
        this.filteredOptions1 = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(val => this.filter(val))
        );
      });

      



    })
  }

  
  onSubmit() {
    console.log(this.teachersForm.value);
  }

  patchValue2() {

    var data = {
      teachers: [
        {
          name: 'Teacher 1', unit: '1', batches: [
            { name: 'Batch No 1', students: [{ name: 'Ramesh' }, { name: 'Suresh' }, { name: 'Naresh' }] },
            { name: 'Batch No 2', students: [{ name: 'Vikas' }, { name: 'Harish' }, { name: 'Lokesh' }] },
          ]
        },
        {
          name: 'Teacher 1', unit: '2', price: '100', batches: [
            { name: 'Batch No 1', students: [{ name: 'Ramesh' }, { name: 'Suresh' }, { name: 'Naresh' }] },
            { name: 'Batch No 2', students: [{ name: 'Vikas' }, { name: 'Harish' }, { name: 'Lokesh' }] },
          ]
        }
      ]
    }
    this.clearFormArray();


    data.teachers.forEach(t => {

      var teacher: FormGroup = this.newTeacher();
      this.teachers().push(teacher);


    });

    this.teachersForm.patchValue(data);
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


    let cgst = arr.reduce((accumulator, current) => accumulator + parseFloat(this.CalculateanyPercent(current.price, current.CGST, current.unit).toString()), 0);
    //alert("total cgst" + cgst);
    this.BillDetails.cgst = cgst;

    let sgst = arr.reduce((accumulator, current) => accumulator + this.CalculateanyPercent(current.price, current.SGST, current.unit), 0);
    //alert("total sgst" + sgst);
    this.BillDetails.sgst = sgst;


    //alert("total tax" + (cgst + sgst));
    //this.BillDetails.push();
    this.BillDetails.totalTax = cgst + sgst;



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

  UpdateStock() {
    if (this.resultGroupby.length > 0) {

      this.resultGroupby.forEach(function (obj, index) {
        console.log('before transform, this : ' + this);
        let p: InventoryMaster = this.Inventory.find(x => x.UnqueID == obj.invId)
        var id = obj.invId;
        //var p = student.UnqueID;
        p.stockQty = (Number(p.stockQty) - Number(obj.unit)).toString();
        this.inventoryService.update(id, p).subscribe(() => {
          //alert('success');
        });
        
      }, this);
alert('Stock updated successfully.');
    }
    else {
      alert('Please do Final Calculation first then print and Updadate stock.');
    }
  }

  UpdateStockMethod(invIDUnique: string, Updateqty: string) {
    let p: InventoryMaster = this.Inventory.find(x => x.UnqueID == invIDUnique)
    //employee.EmpId = this.row.id;
    //student.UnqueID = this.data.row.UnqueID;
    var id = invIDUnique;
    //var p = student.UnqueID;
    p.stockQty = (Number(p.stockQty) - Number(Updateqty)).toString();
    this.inventoryService.update(id, p).subscribe(() => {
      // this.dataSaved = true;
    });
  }



}
