import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LabTestMainService } from '../Services/lab-test-main.service';
import { CategoryMaster, GroupTests, LabTestMaster, UnitsCategory } from '../models/UserData';
import { CategoriesService } from '../shared/categories.service';
import { CategoryMasterService } from '../Services/category-master.service';
import { Category } from '../shared/Expense.Model';
import { UnitsCategoryService } from '../Services/units-category.service';
import { StorageService } from '../shared/storage.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DialogBoxUnitUnitsComponent } from '../Popups/dialog-box-unit-units.component';
import { LabtestParameterComponent } from './labtest-parameter.component';
import { GrouTestService } from '../Services/grou-test.service';
export interface Name {
  TestName: string;
  TestPrice: number;
}

@Component({
  selector: 'app-create-group-test',
  templateUrl: './create-group-test.component.html',
  styleUrls: ['./create-group-test.component.css']
})
export class CreateGroupTestComponent implements OnInit {
  teachersForm: FormGroup;
  title: string = "Add/Update Group TEST"
  formCategoryMaster: Category[];
  formCategoryMasterFilter: Category[];
  fromDataCategoryFilter: Category[];
  unitsCategory: UnitsCategory[] = [];
  selected: string;
  Username: string;
  Role: string;
  pizzaIng: any;
  selectAll = false;
  asyncPipeLabTestMaster: LabTestMaster[];
  selectedString = [];
  add() {
    var t = this.asyncPipeLabTestMaster
      .filter(opt => opt.checked)
      .map(opt => opt);
    this.selectedString = t;
    this.control = <FormArray>this.teachersForm.controls['names'];
    this.selectedString.forEach((item) => {
      this.control.push(this.fb.group({
        TestName: [item.TestName],
        TestPrice: [item.TestPrice]
      }));
    })
  }
  constructor(private fb: FormBuilder, private route: ActivatedRoute,
    private router: Router, private grouTestService: GrouTestService, private labTestMasterService: LabTestMainService, private catService: CategoriesService,
    private categoryMasterService: CategoryMasterService, private unitsCategoryService: UnitsCategoryService,
    private _store: StorageService, public dialogRef: MatDialogRef<LabtestParameterComponent>,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.Username = this._store.sessionUsername;
    this.Role = this._store.sessionRole;
    this.labTestMasterService.getAll().subscribe((data: any) => {
      //console.log('jay'+data);
      this.asyncPipeLabTestMaster = data;
      var aaa: string[] = [];
      this.asyncPipeLabTestMaster.forEach((a) => {

        aaa.forEach(function (value) {
          a.TestName == value ? a.checked = true : a.checked = a.checked

        });


      });
    });
    this.teachersForm = this.fb.group({
      GroupName: '',
      Description: '',
      Discount: '',
      ActualPrice: '',
      TotalPrice: '',
      names: this.fb.array([]),
      CreatedDate: '',
      CreatedBy: ''
    });

    this.control = <FormArray>this.teachersForm.controls['emailsArray'];
  }
  private control: FormArray;
  createForm() {
    this.teachersForm = this.fb.group({
      GroupName: '',
      Description: '',
      Discount: '',
      ActualPrice: '',
      TotalPrice: '',
      names: this.fb.array([]),
      CreatedDate: '',
      CreatedBy: ''
    })
  }

  parValue: string;
  SubmitButtonNameDynamically: string = "Save Group TEST";
  updateID: string = null;
  //LabTestMaster
  PopupClose: boolean = false;
  tmp: boolean = true;
  public rows: Array<any> = [];
  public numElement = 4; // No of elements per Row
  ngOnInit() {
    this.labTestMasterService.getAll().subscribe((data: any) => {
      //console.log('jay'+data);
      this.asyncPipeLabTestMaster = data;
      var aaa: string[] = [];
      this.asyncPipeLabTestMaster.forEach((a) => {

        aaa.forEach(function (value) {
          a.TestName == value ? a.checked = true : a.checked = a.checked

        });


      });
    });
    if (this.data.AddEdit == 'Add') {
      this.PopupClose = true;
    }

    //this.rows = Array.from(Array(Math.ceil(this.asyncPipeLabTestMaster.length / this.numElement)).keys()); 
    //alert(this.data.AddEdit);
    //this.GetCategories();

    //this.LoadAllMasterUnits();
    this.route.params.subscribe((params) => {
      this.parValue = params['AddEdit'];
      if (this.data.AddEdit == "Add" ) {
        this.createForm();
        // this.showUpdateGIF = false;
        this.SubmitButtonNameDynamically = "Save Group TEST";
        this.updateID = null;
        // this.caseValue="";
      }
      else if (this.data.AddEdit == "Update"){
        this.createForm();

        this.patchValue2(this.data.UnqueID);
        //this.showUpdateGIF = true;
        this.SubmitButtonNameDynamically = "Update Group TEST";
        this.updateID = this.data.UnqueID;


        // const forLoop = async _ => {
        //   console.log('Start');
          
        //   var aaa:Name[]=this.data11.names;
        //   alert(aaa);
        //   this.asyncPipeLabTestMaster?.forEach((a)=>{ 
    
        //     aaa?.forEach(inn=> {
        //       a.TestName==inn.TestName? a.checked=true:a.checked=a.checked;
              
        //   });
    
        // });
          
        //  console.log('End');
        //  };


        
      }
      else{

      }
    });

    //console.log('final FormGroup is ', this.addrFrom.value)
  }

  updateCheck() {
    console.log(this.selectAll);
    if (this.selectAll === true) {
      this.pizzaIng.map((pizza) => {
        pizza.checked = true;
      });

    } else {
      this.pizzaIng.map((pizza) => {
        pizza.checked = false;
      });
    }
  }

  LoadAllMasterUnits() {
    this.unitsCategoryService.getAll().subscribe((data: UnitsCategory[]) => {
      //console.log(data);
      this.unitsCategory = data;

    })
  }

  GetCategories() {


    // this.catService.getAll()
    // .subscribe((respose) => 
    //     this.catService = respose as Category[]
    // );

    this.catService.getAll()
      .subscribe((response) => {
        this.formCategoryMaster = response as Category[];
        const distinctThings = response.filter((thing, i, arr) => {
          return arr.indexOf(arr.find(t => t.CategoryType === thing.CategoryType)) === i;
        });
        //const unique = Array.from(new Set(response.map((item: any) => item.CategoryType)))
        //const unique = [...new Set(response.map(item => item.CategoryType))]; // [ 'A', 'B']
        this.formCategoryMasterFilter = distinctThings as Category[];
        this.CategorySelected('');
      });
  }
  CategorySelected(form) {
    //var passValue = this.teachersForm.get('CategoryType').value;
    this.fromDataCategoryFilter = this.formCategoryMaster.filter(x => x.CategoryType == 'HealthPKG');

    if (this.fromDataCategoryFilter === null) {
      this.teachersForm.get('CategoryName').setValue("0");
    }

    // if(form.selectedIndex == 0){
    // this.teachersForm.get('CategoryName').setValue( "--Select Category Name--");
    // }

    // else{
    //   this.fromDataCategoryFilter = this.formCategoryMaster.filter(x=> x.CategoryType == form.value);
    // }
  }


  /** Teachers */
  teachers(): FormArray {
    return this.teachersForm.get("test") as FormArray
  }

  newTeacher(): FormGroup {
    return this.fb.group({
      GroupName: '',
      Description: '',
      Discount: '',
      ActualPrice: '',
      TotalPrice: '',
      names: this.fb.array([]),
      CreatedDate: '',
      CreatedBy: ''
    })
  }




  addTeacher() {
    this.teachers().push(this.newTeacher());
  }


  removeTeacher(ti) {
    this.teachers().removeAt(ti);
  }

  /** references */

  batches(ti): FormArray {
    return this.teachers().at(ti).get("batches") as FormArray
  }


  newBatch(): FormGroup {
    return this.fb.group({
      TestName: '',
      TestPrice: ''
    })
  }

  addBatch(ti: number) {
    this.batches(ti).push(this.newBatch());
  }

  removeBatch(ti: number, bi: number) {
    this.batches(ti).removeAt(ti);
  }







  onSubmit() {
    console.log(this.teachersForm.value);
  }
  data11: GroupTests;
  patchValue2(unqueID: string) {
    //unqueID = '62145127';
    this.clearFormArray();
    this.grouTestService.getById(unqueID).subscribe({
      next: event => { 
        {
          this.data11 = event;
          var data = this.data11;
    
          var teacher: FormGroup = this.newTeacher();
          // this.teachers().push(teacher);
          this.data11.names.forEach(b => {
            var batch = this.newBatch();
            (teacher.get("names") as FormArray).push(batch)
          });
    
    
          this.teachersForm.patchValue(data);
    
    
        }
      }, 
        error: error => { console.log(error) }, 
         complete: () => { this.UpdateCheckBox() }
    });
    // this.grouTestService.getById(unqueID).subscribe(val => {
    //   this.data11 = val;
    //   var data = this.data11;

    //   var teacher: FormGroup = this.newTeacher();
    //   // this.teachers().push(teacher);
    //   this.data11.names.forEach(b => {
    //     var batch = this.newBatch();
    //     (teacher.get("names") as FormArray).push(batch)
    //   });


    //   this.teachersForm.patchValue(data);


    // });
   
  }

  UpdateCheckBox(){

    this.labTestMasterService.getAll().subscribe((data: any) => {
      //console.log('jay'+data);
      this.asyncPipeLabTestMaster = data;
      var aaa: Name[] = this.data11.names;
      this.asyncPipeLabTestMaster.forEach((a) => {

        aaa?.forEach(inn=> {
          a.TestName==inn.TestName? a.checked=true:a.checked=a.checked;
          
      });

      });
    });
  //   var aaa:Name[]=this.data11.names;
  //   //alert(aaa);
  //   this.asyncPipeLabTestMaster?.forEach((a)=>{ 

  //     aaa?.forEach(inn=> {
  //       a.TestName==inn.TestName? a.checked=true:a.checked=a.checked;
        
  //   });

  // });

  }
totalvalue:number=0;
  checkValue( p, b){
// alert(p);
// alert(b);
this.totalvalue = 0;
this.asyncPipeLabTestMaster?.forEach((a)=>{ 
if(a.checked != undefined && a.checked == true){
  this.totalvalue += parseFloat(a.TestPrice);
 
}
});
this.teachersForm.get('ActualPrice')?.patchValue(this.totalvalue.toString());
this.teachersForm.get('Discount')?.patchValue('0');
this.teachersForm.get('TotalPrice')?.patchValue(this.totalvalue.toString());
  }
  clearFormArray() {

    //Angular 8 +
    this.teachers()?.clear();

    //older Versions of angualar
    //while (this.teachers().length) {
    //  this.teachers().removeAt(0);
    //}
  }

  saveLabTest() {

    if (this.teachersForm.value.GroupName.trim().length < 1) {
      alert('Please provide Group Name Name.')
    }
    else if (this.teachersForm.value.TotalPrice.toString().trim().length < 1) {
      alert('Please provide PathoLAB Test Price.')
    }

    else {
      this.add();
      if (this.updateID == null) {
        
        this.teachersForm.value.GroupName = this.teachersForm.value.GroupName.trim();
        this.teachersForm.value.TotalPrice = this.teachersForm.value.TotalPrice.toString().trim();
        //this.teachersForm.value.Status =  this.teachersForm.value.Status.toString().trim();
        this.grouTestService.createStudent(this.teachersForm.value).subscribe(
          (test) => {
            // this.CaseID = test.UnqueID;
            // this.paymentDetailsTemplate.SavePaymentDetails(this.CaseID);
            // this.child.SavePatientDetails(this.CaseID);
            alert('Group TEST data saved Successfully. ID is ' + test.UnqueID);
            this.updateID = null;
            if (this.PopupClose == false) {
              //this.router.navigate(['/AllLabtest']);
            }
            else {
              this.closeDialog();
            }
          });
      }
      else {
        this.teachersForm.value.GroupName = this.teachersForm.value.GroupName.trim();
        this.teachersForm.value.TotalPrice = this.teachersForm.value.TotalPrice.toString().trim();
        //this.teachersForm.value.Status =  this.teachersForm.value.Status.toString().trim();
        this.grouTestService.update(this.updateID, this.teachersForm.value).subscribe(() => {

          alert('Group TEST data updated Successfully.');
          this.updateID = null;
          if (this.PopupClose == false) {
            //this.router.navigate(['/AllLabtest']);
          }
        });
      }
    }
  }

  openDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxUnitUnitsComponent, {
      width: '600px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      this.LoadAllMasterUnits();
      //this.foo();
      //this.LoadAllTestInvestigations();       
    });
  }
  saveLabTestandClose() {
    if (this.updateID == null) {
      this.grouTestService.createStudent(this.teachersForm.value).subscribe(
        (test) => {
          // this.CaseID = test.UnqueID;
          // this.paymentDetailsTemplate.SavePaymentDetails(this.CaseID);
          // this.child.SavePatientDetails(this.CaseID);
          alert('New PathoLAB TEST created Successfully. ID is ' + test.UnqueID);
          this.updateID = null;
          //this.router.navigate(['/AllLabtest']);
          this.closeDialog();
        });
    }

  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
