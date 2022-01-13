import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LabTestMainService } from '../Services/lab-test-main.service';
import { CategoryMaster, LabTestMaster, UnitsCategory } from '../models/UserData';
import { CategoriesService } from '../shared/categories.service';
import { CategoryMasterService } from '../Services/category-master.service';
import { Category } from '../shared/Expense.Model';
import { UnitsCategoryService } from '../Services/units-category.service';
import { StorageService } from '../shared/storage.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DialogBoxUnitUnitsComponent } from '../Popups/dialog-box-unit-units.component';
@Component({
  selector: 'labtest-parameter',
  templateUrl: './labtest-parameter.component.html',
  styleUrls: ['./labtest-parameter.component.css']
})
export class LabtestParameterComponent {
  teachersForm: FormGroup;
  title: string = "Add/Update Lab TEST"
  formCategoryMaster: Category[];
  formCategoryMasterFilter: Category[];
  fromDataCategoryFilter: Category[];
  unitsCategory: UnitsCategory[] = [];
  selected: string;
  Username: string;
  Role: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute,
    private router: Router, private labTestMasterService: LabTestMainService, private catService: CategoriesService,
    private categoryMasterService: CategoryMasterService, private unitsCategoryService: UnitsCategoryService,
    private _store: StorageService, public dialogRef: MatDialogRef<LabtestParameterComponent>, 
    public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any) {
    this.Username = this._store.sessionUsername;
    this.Role = this._store.sessionRole;
    this.teachersForm = this.fb.group({
      CategoryType: '',
      CategoryName: '',
      TestName: '',
      TestPrice: '',
      Discount: '',
      CreatedDate: '',
      CreatedBy: '',
      test: this.fb.array([]),
    });
  }

  createForm() {
    this.teachersForm = this.fb.group({
      CategoryName: '',
      CategoryType: '',
      TestName: '',
      TestPrice: '',
      Discount: '',
      CreatedDate: '',
      CreatedBy: this.Username,
      test: this.fb.array([]),
    })
  }

  parValue: string;
  SubmitButtonNameDynamically: string = "Save Lab TEST";
  updateID: string = null;
  //LabTestMaster
  PopupClose:boolean=false;
  ngOnInit() {
  if(this.data.AddEdit == 'Add')
  {
  this.PopupClose =  true;
  }
    //alert(this.data.AddEdit);
    this.GetCategories();

    this.LoadAllMasterUnits();
    this.route.params.subscribe((params) => {
      this.parValue = params['id'];
      if (this.parValue == "Add" || this.PopupClose == true) {
        this.createForm();
        // this.showUpdateGIF = false;
        this.SubmitButtonNameDynamically = "Save Lab TEST";
        this.updateID = null;
        // this.caseValue="";
      }
      else {
        this.createForm();

        this.patchValue2(this.parValue);
        //this.showUpdateGIF = true;
        this.SubmitButtonNameDynamically = "Update Lab TEST";
        this.updateID = this.parValue;
      }
    });

    //console.log('final FormGroup is ', this.addrFrom.value)
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
      ParamterName: '',
      InputValue: '',
      Unit: '',
      // GenderCategory:'',
      // MinRange:'',
      // MaxRange:'',
      // CommonRange:'',
      // GeneralRef: '',
      // GeneralRefM: '',
      // GeneralRefF: '',
      //PreganancyCase:'',
      // Male010:'',
      // Male1030:'',
      // Male3045:'',
      // Male45:'',
      // Female010:'',
      // Female1030:'',
      // Female3045:'',
      // Female45:'',
      batches: this.fb.array([])
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
      GenderCategory: '',
      MinRange: '',
      MaxRange: '',
      CommonRange: '',
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
  data11: LabTestMaster;
  patchValue2(unqueID: string) {
    this.clearFormArray();
    this.labTestMasterService.getById(unqueID).subscribe(val => {
      this.data11 = val;
      var data = this.data11;

      this.data11.test.forEach(t => {

        var teacher: FormGroup = this.newTeacher();
        this.teachers().push(teacher);
        t.batches.forEach(b => {
          var batch = this.newBatch();

          (teacher.get("batches") as FormArray).push(batch)



        });

      });

      this.teachersForm.patchValue(data);

    });





  }


  clearFormArray() {

    //Angular 8 +
    this.teachers().clear();

    //older Versions of angualar
    //while (this.teachers().length) {
    //  this.teachers().removeAt(0);
    //}
  }

  saveLabTest() {
    if (this.teachersForm.value.CategoryName.trim().length < 1) {
      alert('Please provide PathoLAB Category Name.')
    }
    else if (this.teachersForm.value.TestName.trim().length < 1) {
      alert('Please provide PathoLAB Test Name.')
    }
    else if (this.teachersForm.value.TestPrice.toString().trim().length < 1) {
      alert('Please provide PathoLAB Test Price.')
    }
    else if (this.teachersForm.value.test !== null && this.teachersForm.value.test.length < 1) {
      alert('Please provide atleaset one parameter entry for PathoLAB Test.')
    }
    else if(this.teachersForm.value.test[0].ParamterName == '' || this.teachersForm.value.test[0].Unit =='' ){
      alert('Please provide parameter name and Unit for PathoLAB Test.')
      }    
    else {

      if (this.updateID == null) {
        this.teachersForm.value.TestName =  this.teachersForm.value.TestName.trim();
        this.teachersForm.value.TestPrice =  this.teachersForm.value.TestPrice.toString().trim();
        this.labTestMasterService.createStudent(this.teachersForm.value).subscribe(
          (test) => {
            // this.CaseID = test.UnqueID;
            // this.paymentDetailsTemplate.SavePaymentDetails(this.CaseID);
            // this.child.SavePatientDetails(this.CaseID);
            alert('PathoLAB TEST data saved Successfully. ID is ' + test.UnqueID);
            this.updateID = null;
            if(this.PopupClose == false)
            {
              this.router.navigate(['/AllLabtest']);
            }
            else{
              this.closeDialog();
            }
          });
      }
      else {
        this.teachersForm.value.TestName =  this.teachersForm.value.TestName.trim();
        this.teachersForm.value.TestPrice =  this.teachersForm.value.TestPrice.toString().trim();
        this.labTestMasterService.update(this.updateID, this.teachersForm.value).subscribe(() => {

          alert('PathoLAB TEST data updated Successfully.');
          this.updateID = null;
          if(this.PopupClose == false)
          {
          this.router.navigate(['/AllLabtest']);
          }
        });
      }
    }
  }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxUnitUnitsComponent, {
      width: '600px',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => { 
      this.LoadAllMasterUnits(); 
      //this.foo();
      //this.LoadAllTestInvestigations();       
});
  }
  saveLabTestandClose() {
    if (this.updateID == null) {
      this.labTestMasterService.createStudent(this.teachersForm.value).subscribe(
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