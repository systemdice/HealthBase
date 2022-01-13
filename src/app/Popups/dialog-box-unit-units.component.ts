

//dialog-box.component.ts
import { Component, Inject, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Adresse, CategoryMaster, UnitsCategory } from '../models/UserData';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { UnitsCategoryService } from '../Services/units-category.service';

export interface UsersData {
  name: string;
  id: number;
}


@Component({
  selector: 'app-dialog-box-unit-units',
  templateUrl: './dialog-box-unit-units.component.html',
  styleUrls: ['./dialog-box-unit-units.component.css']
})
export class DialogBoxUnitUnitsComponent implements OnInit {
  Category: any = ['Florida', 'South Dakota', 'Tennessee', 'Michigan']
  action:string;
  local_data:any;
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

   myVal:any;

  //Category: any = ['Florida', 'South Dakota', 'Tennessee', 'Michigan']

  constructor(private formBuilder: FormBuilder, public unitsCategoryService: UnitsCategoryService,
    public dialogRef: MatDialogRef<DialogBoxUnitUnitsComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UnitsCategory) {
    console.log(data);
    this.local_data = {...data};
    this.action = this.local_data.action;

    //this.filterData();
     this.formGroup = new FormGroup({
    userName: new FormControl('sysdice')
  });
  }

//   public filterData(): void {
//     var arr = this.myVal1.filter(student => student.userName === 'sysdice')
//     this.myVal = arr.reduce(function(acc, cur, i) {
//   acc[i] = cur;
//   return acc;
// }, {});
 
//   }

printPage() {
  window.print();
}

  ngOnInit() {
    //this.filterData();
    this.createForm();
    //this.setChangeValidate()
    if(this.action == "Update")
    {
      this.LoadEditData();
    }

    // if(this.local_data != undefined){
    //   this.formGroup.patchValue(this.local_data);
    // }
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
    
  "Name":  [''],
  "Description":  [null],
  "Status":[true],
  "DateStart":[new Date().toLocaleString()],
  "DateEnd":[new Date().toLocaleString()]
   
    });

    // this.formGroup.patchValue({Name: this.myVal[0].userName});
    // this.formGroup.patchValue({Category: this.myVal[0].cityName});
    //this.parametersForm.setValue({userName: 'Nancy',adresses: this.initFormArray(this.listAddres),adresses1: this.initFormArray(this.listAddres1),orders:this.orders.map(c => new FormControl(false))});
    // this.listAddres = this.myVal[0].parameters
    //this.initFormArray(this.listAddres);
  }

  LoadEditData(){
    //this.removeGroup(0);
    this.myVal ={...this.local_data};
    this.formGroup.patchValue({Name: this.myVal.Name});
    this.formGroup.patchValue({Description: this.local_data.Description});
    this.formGroup.patchValue({Status: this.myVal.Status});
    //this.parametersForm.setValue({userName: 'Nancy',adresses: this.initFormArray(this.listAddres),adresses1: this.initFormArray(this.listAddres1),orders:this.orders.map(c => new FormControl(false))});
    // this.listAddres = this.myVal.Parameters;
    // this.initFormArray(this.listAddres);
  }

  

 



  

  trackByFn(index: any, item: any) {
    return index;
  }

  // setChangeValidate() {
  //   this.formGroup.get('validate').valueChanges.subscribe(
  //     (validate) => {
  //       if (validate == '1') {
  //         this.formGroup.get('name').setValidators([Validators.required, Validators.minLength(3)]);
  //         this.titleAlert = "You need to specify at least 3 characters";
  //       } else {
  //         this.formGroup.get('name').setValidators(Validators.required);
  //       }
  //       this.formGroup.get('name').updateValueAndValidity();
  //     }
  //   )
  // }

  // get name() {
  //   return this.formGroup.get('name') as FormControl
  // }

  // checkPassword(control) {
  //   let enteredPassword = control.value
  //   let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
  //   return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  // }

  // checkInUseEmail(control) {
  //   // mimic http database access
  //   let db = ['jack@torchwood.com'];
  //   return new Observable(observer => {
  //     setTimeout(() => {
  //       let result = (db.indexOf(control.value) !== -1) ? { 'alreadyInUse': true } : null;
  //       observer.next(result);
  //       observer.complete();
  //     }, 4000)
  //   })
  // }

  // getErrorEmail() {
  //   return this.formGroup.get('email').hasError('required') ? 'Field is required' :
  //     this.formGroup.get('email').hasError('pattern') ? 'Not a valid emailaddress' :
  //       this.formGroup.get('email').hasError('alreadyInUse') ? 'This emailaddress is already in use' : '';
  // }

  // getErrorPassword() {
  //   return this.formGroup.get('password').hasError('required') ? 'Field is required (at least eight characters, one uppercase letter and one number)' :
  //     this.formGroup.get('password').hasError('requirements') ? 'Password needs to be at least eight characters, one uppercase letter and one number' : '';
  // }

  onSubmit(post) {
    //alert('submitted');
    this.post = post;
  }
  // tslint:disable-next-line:no-any
  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }

  doAction(doAction:string){
    if(doAction == 'Delete'){
      this.formGroup.value.Name='del';
    }
    if(this.formGroup.value.Name.trim() == '')
    {
      alert('Please provide Unit Name');
    }
    else{
    switch (doAction) {
      case "Add":
        //alert('submitted from do action');
        //console.log(this.formGroup.value);
        this.CreateStudent(this.formGroup.value);
          break;
      case "Update":
        this.employeeIdUpdate = this.local_data.UnqueID;
        this.CreateStudent(this.formGroup.value);
        break;
          break;
      case "Delete":
        //alert('Deleted from do action');
        //console.log(this.formGroup.value);
        this.deleteEmployee(this.local_data.UnqueID);
          break;
  }
}
    //this.dialogRef.close({event:this.action,data:this.local_data});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

  finish() {
    this.list = this.formGroup.value
    console.log(this.list);

   
  }

  employeeIdUpdate = null;
  noTemplate:any;

  CreateStudent(student: UnitsCategory) {
    if (this.employeeIdUpdate == null) {
     
      
      this.unitsCategoryService.createStudent(student).subscribe(
        () => {
          //this.dataSaved = true;
          //this.massage = 'Record saved Successfully';
          alert('Unit data saved Successfully.');
          //this.loadAllEmployees();
          this.employeeIdUpdate = null;
          this.formGroup.reset();
          this.dialogRef.close({event:this.action,data:this.local_data});
        });
    } else {
      //employee.EmpId = this.row.id;
      //student.UnqueID = this.data.row.UnqueID;
      var id= this.employeeIdUpdate;
      var p = student.UnqueID;
      this.unitsCategoryService.update(id,student).subscribe(() => {
        // this.dataSaved = true;
        // this.massage = 'Record Updated Successfully';
        //this.loadAllEmployees();
        alert('Unit data updated Successfully.');
        this.employeeIdUpdate = null;
        this.formGroup.reset();
        this.dialogRef.close({event:this.action,data:this.local_data});
      });
    }
  }

  deleteEmployee(employeeId: string) {
    if (confirm("Are you sure you want to delete this?")) {
      //employeeId = "229";
      this.unitsCategoryService.delete(employeeId).subscribe(() => {
        // this.dataSaved = true;
        // this.massage = 'Record Deleted Succefully';
        //this.loadAllEmployees();
        this.employeeIdUpdate = null;
        this.formGroup.reset();
        this.dialogRef.close({event:this.action,data:this.local_data});

      });
    }

  }

}

