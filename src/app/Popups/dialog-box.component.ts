

//dialog-box.component.ts
import { Component, Inject, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Adresse, ReferenceRange, TestsCategory, UnitsCategory } from '../models/UserData';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { TestsCategoryService } from '../Services/tests-category.service';

export interface UsersData {
  name: string;
  id: number;
}


@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DialogBoxComponent implements OnInit {

  action: string;
  local_data: any;
  public breakpoint: number; // Breakpoint observer code
  formGroup: FormGroup;
  titleAlert: string = 'This field is required';
  post: any = '';

  parametersForm: FormGroup;

  Order: FormControl;
  Name: FormControl;
  Unit: string;
  InputType: FormControl;
  Optional: FormControl;
  Removed: FormControl;


  list: Adresse[] = [];
  adresse: Adresse = new Adresse();
  fa: FormArray;
  panelOpenState:boolean=false;
  loading:false;
  

  listAddres: Adresse[] = [
    {
      "Order": 1,
      "Name": "",
      "Unit": "",
      "InputType": "",
      "Optional": false,
      "Removed": false
    }
  ];

  listReferenceRange: ReferenceRange[] = [
    {
      Gender :"M",
   MinimumAge :"0",
   MaximumAge :"28",
   LowerValue :"4",
   UpperValue :"9",
   Remarks :true
    }
  ];

  myVal1 = [{
    "userName": "OmmMaa", "cityName": "Florida", "orders": [true, true, false, false],
    "parameters": [
      {
        "Order": 1,
        "Name": "param1a",
        "Unit": "string",
        "InputType": "instrument",
        "Optional": true,
        "Removed": true
      },
      {
        "Order": 2,
        "Name": "param2a",
        "Unit": "string",
        "InputType": "manual",
        "Optional": true,
        "Removed": true
      }
    ], "adresses1": [{ "label1": "labs1111", "rue": "2", "nomRue": "allerte11111" }, { "label1": "Olabel", "rue": "3", "nomRue": "allerte" }]
  },
  {
    "userName": "sysdice", "cityName": "Florida", "orders":
      [true, true, false, false], "parameters": [
        {
          "Order": 1,
          "Name": "param1a",
          "Unit": "string",
          "InputType": "instrument",
          "Optional": true,
          "Removed": true
        },
        {
          "Order": 2,
          "Name": "param2a",
          "Unit": "string",
          "InputType": "manual",
          "Optional": true,
          "Removed": true
        }
      ], "adresses1": [{ "label1": "labs1111", "rue": "2", "nomRue": "allerte11111" }, { "label1": "Olabel", "rue": "3", "nomRue": "allerte" }]
  }];
  myVal: any;

  Category: any = ['Florida', 'South Dakota', 'Tennessee', 'Michigan']

  constructor(private formBuilder: FormBuilder, public testsCategoryService: TestsCategoryService,
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UnitsCategory) {
    console.log(data);
    this.local_data = { ...data };
    this.action = this.local_data.action;

    this.filterData();
    this.formGroup = new FormGroup({
      userName: new FormControl('sysdice')
    });

    
  }

  public filterData(): void {
    var arr = this.myVal1.filter(student => student.userName === 'sysdice')
    this.myVal = arr.reduce(function (acc, cur, i) {
      acc[i] = cur;
      return acc;
    }, {});

  }

  ngOnInit() {
    this.filterData();
    this.createForm();
    //this.setChangeValidate()
    if (this.action == "Update") {
      this.LoadEditData();
    }
  }

  createForm() {
    this.formGroup = this.formBuilder.group({

      "Name": [''],
      "ShortName": [null],
      "Category": [null],
      "Fee": [0],
      "Method": [null],
      "Instrument": [null],
      "ResultTypeDoc": [true],
      "Notes": [null],
      "Comments": [null],
      "Interpretation": [null],
      // 'email': [null, [Validators.required, Validators.email], this.checkInUseEmail],
      // 'name': [null],
      // 'password': [null, [Validators.required, this.checkPassword]],
      // 'description': [null, [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      'validate': [''],

      userName: [''],
      cityName: [''],
      //parameters: this.formBuilder.array([]),
      Parameters: this.formBuilder.array([]),
    });

   
  }

  LoadEditData() {
    this.myVal = { ...this.local_data };
    this.formGroup.patchValue({ Name: this.myVal.Name });
    this.formGroup.patchValue({ Category: this.local_data.Category });
    //this.parametersForm.setValue({userName: 'Nancy',adresses: this.initFormArray(this.listAddres),adresses1: this.initFormArray(this.listAddres1),orders:this.orders.map(c => new FormControl(false))});
    this.listAddres = this.myVal.Parameters;
  }

  

  

  

 

  
  trackByFn(index: any, item: any) {
    return index;
  }

 
  onSubmit(post) {
    //alert('submitted');
    this.post = post;
  }
  // tslint:disable-next-line:no-any
  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }

  doAction(doAction: string) {
    switch (doAction) {
      case "Add":
        //alert('submitted from do action');
        console.log(this.formGroup.value);
        this.CreateStudent(this.formGroup.value);
        break;
      case "Update":
        this.employeeIdUpdate = this.local_data.UnqueID;
        this.CreateStudent(this.formGroup.value);
        break;
        break;
      case "Delete":
        //alert('Deleted from do action');
        console.log(this.formGroup.value);
        this.deleteEmployee(this.local_data.UnqueID);
        break;
    }

    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  

  employeeIdUpdate = null;

  CreateStudent(student: TestsCategory) {
    if (this.employeeIdUpdate == null) {

      this.testsCategoryService.createStudent(student).subscribe(
        () => {
          //this.dataSaved = true;
          //this.massage = 'Record saved Successfully';
          alert('Data saved Successfully');
          //this.loadAllEmployees();
          this.employeeIdUpdate = null;
          this.formGroup.reset();
        });
    } else {
      //employee.EmpId = this.row.id;
      //student.UnqueID = this.data.row.UnqueID;
      var id = this.employeeIdUpdate;
      var p = student.UnqueID;
      this.testsCategoryService.update(id, student).subscribe(() => {
        // this.dataSaved = true;
        // this.massage = 'Record Updated Successfully';
        //this.loadAllEmployees();
        alert('Data updated Successfully');
        this.employeeIdUpdate = null;
        this.formGroup.reset();
      });
    }
  }

  deleteEmployee(employeeId: string) {
    if (confirm("Are you sure you want to delete this ?")) {
      //employeeId = "229";
      this.testsCategoryService.delete(employeeId).subscribe(() => {
        // this.dataSaved = true;
        // this.massage = 'Record Deleted Succefully';
        //this.loadAllEmployees();
        this.employeeIdUpdate = null;
        this.formGroup.reset();

      });
    }

  }

  //strted
  /** Parameters */
  Parameters(): FormArray {
    return this.formGroup.get("Parameters") as FormArray
  }
  removeGroup(index){

  }
 
  newParameter(): FormGroup {
    return this.formBuilder.group({
        Order: '',
        Name: '',
        Unit: '',
        InputType: '',
        Optional: '',
        Removed:'',
        ReferenceRange: this.formBuilder.array([])
    })
  }
 
 
  addParameter() {
    this.Parameters().push(this.newParameter());
  }
 
 
  removeParameter(ti) {
    this.Parameters().removeAt(ti);
  }
 
 
  /** ReferenceRangees */
 
  ReferenceRangees(ti): FormArray {
    return this.Parameters().at(ti).get("ReferenceRange") as FormArray
  }
 
 
  newReferenceRange(): FormGroup {
    return this.formBuilder.group({
      Gender: '',
        MinimumAge: '',
        MaximumAge: '',
        LowerValue: '',
        UpperValue: '',
        Remarks: ''
    })
  }
 
  addReferenceRange(ti: number) {
    this.ReferenceRangees(ti).push(this.newReferenceRange());
  }
 
  removeReferenceRange(ti: number, bi: number) {
    this.ReferenceRangees(ti).removeAt(ti);
  }
 
  
  // onSubmit() {
  //   console.log(this.ParametersForm.value);
  // }
 //ended

}

