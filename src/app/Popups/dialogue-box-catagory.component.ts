

//dialog-box.component.ts
import { Component, Inject, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Adresse, CategoryMaster, UnitsCategory } from '../models/UserData';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { CategoryMasterService } from '../Services/category-master.service';

export interface UsersData {
  name: string;
  id: number;
}

@Component({
  selector: 'app-dialogue-box-catagory',
  templateUrl: './dialogue-box-catagory.component.html',
  styleUrls: ['./dialogue-box-catagory.component.css']
})
export class DialogueBoxCatagoryComponent implements OnInit {

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

  Category: any = ['Florida', 'South Dakota', 'Tennessee', 'Michigan']

  constructor(private formBuilder: FormBuilder, public categoryMasterService: CategoryMasterService,
    public dialogRef: MatDialogRef<DialogueBoxCatagoryComponent>,
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



  ngOnInit() {
    //this.filterData();
    this.createForm();
    //this.setChangeValidate()
    if(this.action == "Update")
    {
      this.LoadEditData();
    }
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
    
  "Name":  [''],
  "Description":  [null],
  "Order":  [1],
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
    this.formGroup.patchValue({Order: this.myVal.Order});
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
    alert('submitted');
    this.post = post;
  }
  // tslint:disable-next-line:no-any
  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }

  doAction(doAction:string){
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

  CreateStudent(student: CategoryMaster) {
    if (this.employeeIdUpdate == null) {
     
      
      this.categoryMasterService.createStudent(student).subscribe(
        () => {
          //this.dataSaved = true;
          //this.massage = 'Record saved Successfully';
          alert('category data saved Successfully');
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
      this.categoryMasterService.update(id,student).subscribe(() => {
        // this.dataSaved = true;
        // this.massage = 'Record Updated Successfully';
        //this.loadAllEmployees();
        alert('Category data updated Successfully');
        this.employeeIdUpdate = null;
        this.formGroup.reset();
        this.dialogRef.close({event:this.action,data:this.local_data});
      });
    }
  }

  deleteEmployee(employeeId: string) {
    if (confirm("Are you sure you want to delete this ?")) {
      //employeeId = "229";
      this.categoryMasterService.delete(employeeId).subscribe(() => {
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

