import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatPaginator } from '@angular/material';

import { Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { InventoryMaster } from 'src/app/models/UserData';
import { InventoryService } from 'src/app/Services/inventory.service';
import { StorageService } from 'src/app/shared/storage.service';
import { CalculatorComponent } from 'src/app/custom-components/calculator.component';
import { NgShortcut, NgShortcutService } from 'ng-shortcut';

@Component({
  selector: 'app-inventory-management',
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.css']
})
export class InventoryManagementComponent implements OnInit {
  displayedColumns: string[] = ['slno', 'inventoryID', 'itemName', 'ItemCode', 'BarCode', 'stockQty', 'UnitPrice', 'SellPrice','CGST','SGST','BatchNumber', 'Discount', 'Expiry', 'priorityStatus', 'EntryOwner','action'];
  //dataSource: MatTableDataSource<UsersData>;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  //@ViewChild(MatPaginator, {static:true})// paginator: MatPaginator;  
  actualPaginator: MatPaginator;
  @ViewChild(MatPaginator)
  set paginator(value: MatPaginator) {
    this.actualPaginator = value;
  }

  //actualSort: MatSort;
  // @ViewChild(MatSort)
  // set sort(value: MatSort) {
  //   //this.actualSort = value;
  // }

  // @ViewChild(MatSort,{static:true}) sort: MatSort;
  filterVal: string = '';

  inventoryForm: FormGroup;
  // to get the Student Details
  public Inventory: InventoryMaster[] = [];
  // to hide and Show Insert/Edit 
  AddTable: Boolean = false;
  // To stored Student Informations for insert/Update and Delete
  public sInventoryID: number = 0;
  public sItemName = "";
  public sStockQty: number = 0;
  public sReorderQty: number = 0;
  public sPriorityStatus: boolean = false;
  todayDate: Date = new Date();

  //For display Edit and Delete Images
  public imgchk = "/assets/images/chk.png";
  public imgunChk = "/assets/images/unchk.png";
  public bseUrl: string = "";
  ExpireYear:string='2023';
  ExpireMonth:string='3';
  public schkName: string = "";
  myName: string;
  cities = ['January', 'Mrs.', 'Smt', 'Shree'];
  Username: string;
  Role: string;
  Location: string;
  asyncPipeCategoryDetails= ['Medicine','Cosmetic','Vegetable','Grocery','Liquid','Others'];
  constructor(public inventoryService: InventoryService, private fb: FormBuilder, private _store: StorageService,
    public dialog: MatDialog,private ngShortcutService: NgShortcutService) {
    // this.myName = "Shanu";
    // this.AddTable = false;
    // this.bseUrl = baseUrl; 
    //this.LoadInventories();
    this.Username = this._store.sessionUsername;
    this.Role = this._store.sessionRole;
    this.Location = this._store.sessionLocation;

    ngShortcutService.push(new NgShortcut('F3', () => alert("F3 shortcut run"), {
      preventDefault: true,
      altKey: true
    }))
  }
  indexAttention:number=-1;
  ChangeExpiryColor(ExpireMonth,ExpireYear)
  {
    var currDateYear= (new Date().getMonth() + 1+1).toString() + '/' + new Date().getFullYear().toString();
     //better than use a "typical for just use findIndex
     //this.indexAttention=this.values.findIndex(x=>x==variable)
     let clr:string ='';
     if(ExpireYear == new Date().getFullYear()){
      if(ExpireMonth < new Date().getMonth() + 1){
        clr="red";
      }
     }
     if(ExpireYear < new Date().getFullYear()){
      clr="red";
     }

     if(clr!='') return clr;

    //  if(currDateYear == ExpireMonth.toString()+"/" +ExpireYear.toString())
    //  return "red";
     
  }

  ngOnInit(): void {

    this.inventoryForm = this.fb.group({
      inventoryID: [''],
      itemName: ['', [Validators.required]],
      stockQty: ['', [Validators.required]],
      reorderQty: ['0'],
      DateReorder: ['', [Validators.required]],
      priorityStatus: [false],

      BarCode: [''],
      ItemCode: [''],
      UnitPrice: ['0', [Validators.required]],
      SellPrice: ['0', [Validators.required]],
      Discount: ['0', [Validators.required]],
      SGST: ['0', [Validators.required]],
      CGST: ['0', [Validators.required]],
      IGST: ['0'],
      Extra: [''],
      Others: ['Medicine'],
      ExpireMonth: [(new Date().getMonth()+1).toString()],
      ExpireYear: [(new Date().getFullYear()+2).toString()],
      HSNCode: [''],
      UOM: [''],
      BatchNumber: [''],
      RackPlaceLocation: [],
      VendorAddress: [{ value: 'Vendor 1234', disabled: true }],// ['Hindustan Unilever Limited, Parent organization: Unilever , 1800 102 2221']
      EntryOwner : [''],
      InventoryOwner : [''],
      ProfitPrice : [''],
      TotalGST : [''],
      UpdatedBy : [''],

    });

    this.LoadInventories();

    // this.inventoryForm.controls['itemName'].valueChanges.subscribe(change => {
    //   console.log(change);
    // });
  }

  onForm2NameChange({ target }) {
    console.log(target.value);
  }

  LoadInventories() {
    this.inventoryService.getAll().subscribe((data: InventoryMaster[]) => {
      if(this.Username== 'admin'){
        this.Inventory = data;//.filter(a=> a.EntryOwner == undefined || a.EntryOwner == this.Username);
        var data = data;//.filter(a=>a.EntryOwner == this.Username);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      //this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';
      }
      else{
        this.Inventory = data.filter(a=> a.EntryOwner == undefined || a.EntryOwner == this.Username);
        var data = data.filter(a=>a.EntryOwner == this.Username);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.actualPaginator; //this.paginator;
      //this.dataSource.sort = this.actualSort; //this.sort;
      this.filterVal = '';
      }
      
      

    })
  }

  ngAfterViewInit() {
    //this.dataSource.sort = this.sort;
    //this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  submit() {
    this.CreateStudent(this.inventoryForm.value);
    // if (this.inventoryForm.valid) {
    //   console.log(JSON.stringify(this.inventoryForm.value));
    //   this.CreateStudent(this.inventoryForm.value);
    // }
    // else {
    //   alert('Please provide the required data.');
    // }
    //alert(this.inventoryForm.value);

  }
  employeeIdUpdate: string;
  btnText: string = "SAVE";
  HeaderText: string = "ADD ";
  CreateStudent(student: InventoryMaster) {
    if(this.inventoryForm.value.itemName == null || this.inventoryForm.value.UnitPrice == null || this.inventoryForm.value.SellPrice == null || this.inventoryForm.value.BatchNumber == null|| this.inventoryForm.value.ExpireYear == null|| this.inventoryForm.value.ExpireMonth == null){
      alert('Please fillup the Item Name, Unit price, Sale Price, CGST, SGST, ExpireMonth, ExpireYear and Batch Number');
    }
      else{
    var nm = this.inventoryForm.get('itemName').value;
    var isItemExist =  this.Inventory.find(a=>a.itemName.trim().toUpperCase() == nm.trim().toUpperCase());
    if(isItemExist != undefined && this.employeeIdUpdate == null)
    {
      alert('This Item already exists. Please modify this or create with some other simillar name.');
      this.filterVal = nm;
      this.applyFilter(this.filterVal);
      //means item is already there. Just update and modify accordingly. 
      this.inventoryForm.reset();
    }
    else{
      //add the item
      student.priorityStatus = 0;
    if (this.inventoryForm.get('priorityStatus').value == true) {
      student.priorityStatus = 1;
    }
    var totalGST = ((parseFloat(this.inventoryForm.value.SellPrice) * parseFloat(this.inventoryForm.value.CGST))/100) + ((parseFloat(this.inventoryForm.value.SellPrice) * parseFloat(this.inventoryForm.value.SGST))/100);
    this.inventoryForm.get('UpdatedBy').patchValue(this.Username);
    this.inventoryForm.get('ProfitPrice').patchValue(parseFloat(this.inventoryForm.value.SellPrice) - parseFloat(this.inventoryForm.value.UnitPrice));
    this.inventoryForm.get('TotalGST').patchValue(totalGST) ;
if(student.Discount == null || student.Discount == ''){
  student.Discount = "0";
}
    student.UpdatedBy = this.Username;
    student.EntryOwner =  this.Username; //'Sachin'; //
    student.ProfitPrice = (parseFloat(this.inventoryForm.value.SellPrice) - parseFloat(this.inventoryForm.value.UnitPrice)).toString();
    student.TotalGST = totalGST.toString();
    //this.employeeIdUpdate =null;// "456";
    if (this.employeeIdUpdate == null) {
      this.inventoryForm.get('EntryOwner').patchValue(this.Username);
      student.EntryOwner = this.Username;
      this.btnText = "SAVE";
      this.inventoryService.createStudent(student).subscribe(
        (data) => {
          let k: any = data;
          //this.dataSaved = true;
          //this.massage = 'Record saved Successfully';
          alert('Inventory created Successfully. Inventory ID is: ' + data.inventoryID);
          //this.loadAllEmployees();
          this.LoadInventories();
          this.employeeIdUpdate = null;
          this.inventoryForm.reset();
          // this.dialogRef.close({event:this.action,data:this.local_data});
        });
    } else {
      //employee.EmpId = this.row.id;
      //student.UnqueID = this.data.row.UnqueID;
      var id = this.employeeIdUpdate;
      this.btnText = "SAVE";
      this.HeaderText = "ADD";
      //var p = student.UnqueID;
      this.inventoryService.update(id, student).subscribe(() => {
        // this.dataSaved = true;
        // this.massage = 'Record Updated Successfully';
        //this.loadAllEmployees();
        this.LoadInventories();
        alert('Inventory data updated Successfully.');
        this.employeeIdUpdate = null;
        this.inventoryForm.reset();
        this.inventoryForm.get('Discount').patchValue("0");
        this.inventoryForm.get('UnitPrice').patchValue("0");
        this.inventoryForm.get('SellPrice').patchValue("0");
        this.inventoryForm.get('CGST').patchValue("0");
        this.inventoryForm.get('SGST').patchValue("0");
        //this.dialogRef.close({event:this.action,data:this.local_data});
      });
    }
     
    }
  }
    
  }


  // //to get all the Inventory data from Web API
  // getData() {

  //     this.http.get(this.bseUrl + 'api/InventoryMasterAPI/Inventory').subscribe(result => {
  //         this.Inventory = result.json();
  //     }, error => console.error(error)); 

  // }

  // to show form for add new Student Information
  AddInventory() {
    this.AddTable = true;
    // To stored Student Informations for insert/Update and Delete
    this.sInventoryID = 0;
    this.sItemName = "";
    this.sStockQty = 50;
    this.sReorderQty = 50;
    this.sPriorityStatus = false;
  }

  // to show form for edit Inventory Information
  editInventoryDetails(UnqueID: string, inventoryIDs: number, itemNames: string, stockQtys: number, reorderQtys: number, priorityStatus: number) {
    this.showTheAddInventory = true;
    this.employeeIdUpdate = UnqueID.toString();
    this.btnText = "UPDATE";
    this.HeaderText = "UPDATE ";
    this.AddTable = true;
    this.sInventoryID = inventoryIDs;
    this.sItemName = itemNames;
    this.sStockQty = stockQtys;
    this.sReorderQty = reorderQtys;
    if (priorityStatus == 0) {
      this.sPriorityStatus = false;
    }
    else {
      this.sPriorityStatus = true;
    }

    let p: any = this.Inventory.find(x => x.inventoryID == inventoryIDs.toString())
    this.inventoryForm.patchValue(this.Inventory.find(x => x.inventoryID == inventoryIDs.toString()));
    if (p.priorityStatus == 0) {
      this.inventoryForm.patchValue({ priorityStatus: false });
    }
    else {
      this.inventoryForm.patchValue({ priorityStatus: true });
    }


  }

  editInventoryDetailsMat(data: any) {
    this.showTheAddInventory = true;
    this.employeeIdUpdate = data.UnqueID.toString();
    this.btnText = "UPDATE";
    this.HeaderText = "UPDATE ";


    let p: any = this.Inventory.find(x => x.inventoryID == data.inventoryID.toString())
    this.inventoryForm.patchValue(this.Inventory.find(x => x.inventoryID == data.inventoryID.toString()));
    if (p.priorityStatus == 0) {
      this.inventoryForm.patchValue({ priorityStatus: false });
    }
    else {
      this.inventoryForm.patchValue({ priorityStatus: true });
    }


  }
  showTheAddInventory: boolean = true;
  ShowInventoryTemplate() {
    this.showTheAddInventory = true;
  }
  HideInventoryTemplate() {
    this.showTheAddInventory = false;
  }
  CreateBlankInventoryTemplate() {
    this.btnText = "SAVE";
    this.showTheAddInventory = true;
    this.LoadInventories();
    this.employeeIdUpdate = null;
    this.inventoryForm.reset();
  }

  addInventoryDetails() {

  }

  // If the InventoryId is 0 then insert the Inventory infromation using post and if the Inventory id is greater than 0 then edit using put mehod
  // addInventoryDetails(inventoryIDs: number, itemNames: string, stockQtys: number, reorderQtys: number, priorityStatus: boolean) {
  //     var pStatus: number = 0;

  //     this.schkName = priorityStatus.toString();
  //     if (this.schkName == "true") {
  //         pStatus = 1;
  //     }
  //     var headers = new Headers();
  //     headers.append('Content-Type', 'application/json; charset=utf-8');
  //     if (inventoryIDs == 0) {
  //         this.http.post(this.bseUrl + 'api/InventoryMasterAPI/', JSON.stringify({ InventoryID: inventoryIDs, ItemName: itemNames, StockQty: stockQtys, ReorderQty: reorderQtys, PriorityStatus: pStatus }),
  //             { headers: headers }).subscribe(
  //             response => {
  //                 this.getData();

  //             }, error => {
  //             }
  //             ); 

  //     }
  //     else {
  //         this.http.put(this.bseUrl + 'api/InventoryMasterAPI/' + inventoryIDs, JSON.stringify({ InventoryID: inventoryIDs, ItemName: itemNames, StockQty: stockQtys, ReorderQty: reorderQtys, PriorityStatus: pStatus }), { headers: headers })
  //             .subscribe(response => {
  //                 this.getData();

  //             }, error => {
  //             }
  //             ); 

  //     }
  //     this.AddTable = false;
  //     //
  //     //
  //     //this.http.get(this.bseUrl + 'api/InventoryMasterAPI/Inventory').subscribe(result => {
  //     //    this.Inventory = result.json();
  //     //}, error => console.error(error)); 
  // }

  // //to Delete the selected Inventory detail from database.
  deleteinventoryDetails(inventoryIDs: number) {
  }
  deleteinventoryDetailsMat(UnqueID: number) {
    if(confirm("Are you sure to delete ")) {
    this.inventoryService.delete(UnqueID).subscribe(() => {
      // this.dataSaved = true;
      // this.massage = 'Record Updated Successfully';
      //this.loadAllEmployees();
      this.LoadInventories();
      alert('Inventory data deleted Successfully.');
      this.employeeIdUpdate = null;
      this.inventoryForm.reset();
      //this.dialogRef.close({event:this.action,data:this.local_data});
    });
  }
  }
  // deleteinventoryDetails(inventoryIDs: number) {
  //     var headers = new Headers();
  //     headers.append('Content-Type', 'application/json; charset=utf-8');
  //     this.http.delete(this.bseUrl + 'api/InventoryMasterAPI/' + inventoryIDs, { headers: headers }).subscribe(response => {
  //         this.getData();

  //     }, error => {
  //     }
  //     ); 

  //     //this.http.get(this.bseUrl + 'api/InventoryMasterAPI/Inventory').subscribe(result => {
  //     //    this.Inventory = result.json();
  //     //}, error => console.error(error)); 
  // }

  closeEdits() {
    this.AddTable = false;
    // To stored Student Informations for insert/Update and Delete
    this.sInventoryID = 0;
    this.sItemName = "";
    this.sStockQty = 50;
    this.sReorderQty = 50;
    this.sPriorityStatus = false;
  }

  OpenCalculator(): void {
  
    const dialogRef = this.dialog.open(CalculatorComponent, {
      width: '500px',
      //height: '650px',
      position : { right: '20px', top: '20px' },
      data: {name: 'Yes'}
    });
  
      // dialogRef.afterClosed().subscribe(result => {
      //   // console.log('The dialog was closed');
      //   // this.animal = result;
      // });
  }

  save() {
    alert("Save button fired: priority 100");
  }
  cancel() {
    this.OpenCalculator();
  }

}


