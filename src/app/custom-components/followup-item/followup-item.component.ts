import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from  '@angular/material';
import { CategoryFilterModel, CategoryModel } from './../../shared/Category.Model';
import { CategoriesService } from 'src/app/shared/categories.service';
import { NgForm } from '@angular/forms';
import { from } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { DateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { FollowupService } from 'src/app/shared/followup.service';
import { Category, Followups } from 'src/app/shared/Expense.Model';
import { CategoryMasterService } from 'src/app/Services/category-master.service'; 
import { CategoryMaster } from 'src/app/models/UserData';
import { StorageService } from 'src/app/shared/storage.service';
export interface IUser {
  Id: string;
  Name:string;
}

@Component({
  selector: 'app-followup-item',
  templateUrl: './followup-item.component.html',
  styleUrls: ['./followup-item.component.css']
})
export class FollowupItemComponent implements OnInit {

  formDataFollowup : Followups = new Followups();
  formCategoryMaster:CategoryMaster[];
  fromDataCategory : Category[];
  //fromDataCategory : CategoryModel[];
  fromDataCategoryFilter : Category[];
  panelOpenState = false;
  FollowupType: any[] = [
    { "Id": "1234", "Name": "Followup"},
    { "Id": "1234", "Name": "Income"}
  
  ];
  Username:string;
  Role:string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef : MatDialogRef<FollowupItemComponent>,
    private catService : CategoriesService,
    private categoryMasterService:CategoryMasterService,
    private expenseService : FollowupService,
    private dateAdapter: DateAdapter<Date>,
    private datePipe: DatePipe,
    private _store: StorageService
  ) { 
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    this.formDataFollowup.ExperienceNotes='';
    this.Username = this._store.sessionUsername;
    this.Role = this._store.sessionRole;
  }
  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
}

  ngOnInit() {
    

    this.GetCategories();
    this.formDataFollowup.UserName = this._store.sessionUsername;;
    this.formDataFollowup.CurrentUserRole = this._store.sessionRole;
    this.formDataFollowup.WorkStatus = "Need to Followup";
    this.formDataFollowup.BusinessType = "0";
    //this.formDataFollowup.FollowupCategory = "0";
    //this.formDataFollowup.CategoryName = "0";
    this.formDataFollowup.ClientReply = "0";
    this.formDataFollowup.DemoRequired = "0";
    this.formDataFollowup.DemoStatus = "0";
    this.formDataFollowup.DemoAssignedTo = "0";
    this.formDataFollowup.InstallationRequired = "0";
    this.formDataFollowup.InstallationStatus = "0";
    this.formDataFollowup.InstallationAssignedTo = "0";
    this.formDataFollowup.SupportAssigned = "0";
    this.formDataFollowup.RenewalStatus = "0";
    this.formDataFollowup.AgreementProcess = "0";
    this.formDataFollowup.Signup = "0";
    this.formDataFollowup.FollowupStartDate = new Date();
    this.formDataFollowup.DemoDate = this.addDays(new Date(),3);
    this.formDataFollowup.InstallationRequiredDate = this.addDays(new Date(),5);
    if(!isNullOrUndefined( this.data))
    {
      
      //console.log(this.data);
      this.formDataFollowup = Object.assign({},this.data);
      //this.GetCategories();

      //this.formDataFollowup.WorkStatus='D';
      this.formDataFollowup.FollowupCategory =this.data.FollowupCategory;
      this.CategorySelectedReloaded(this.data.FollowupCategory,this.data.CategoryName);
      // if(!isNullOrUndefined( this.data)){
      //   this.CategorySelectedReloaded(this.data.FollowupCategory,this.data.CategoryName);
      // }
      // else{
      // //this.fromDataCategoryFilter = this.fromDataCategory.filter(x=> x.CategoryType == form.value);
      // }
   
    this.formDataFollowup.ExperienceNotesHL= this.data.ExperienceNotesHL;
    this.formDataFollowup.ExperienceNotes='';
    }
     
  }
  modelChangeFn(value) {
    //alert(value);
  }
  closeModel()
  {
    this.dialogRef.close({event:'Cancel'});
  }

  GetCategories()
  {
  

    this.categoryMasterService.getAll()
    .subscribe((respose) => 
        this.formCategoryMaster = respose as CategoryMaster[]
    );

    this.catService.getAll()
    .subscribe((respose) => {
        this.fromDataCategory = respose as Category[]
       

        if(!isNullOrUndefined( this.data)){
           this.fromDataCategoryFilter = this.fromDataCategory.filter(x=> x.CategoryType == this.formDataFollowup.FollowupCategory);
          // this.CategorySelectedReloaded(this.data.FollowupCategory,this.data.CategoryName);
        }
        else{
        //this.fromDataCategoryFilter = this.fromDataCategory.filter(x=> x.CategoryType == form.value);
        }
        
    }

    );

    
  }
dataSaved:string;
  onSubmit(form:NgForm){
      //console.log(form.value);
      
      form.value.ExperienceNotes = new Date().toLocaleString()+', ['+this._store.sessionUsername+']:'+this.formDataFollowup.ExperienceNotes;
      form.value.ExperienceNotesHL = form.value.ExperienceNotesHL + "\n"+form.value.ExperienceNotes;
      

      if(!isNullOrUndefined( this.data))
      {
        
        form.value.UpdatedBy =this._store.sessionUsername;
        form.value.UpdatedRole=this._store.sessionRole;
        this.expenseService.update(this.data.UnqueID,form.value).subscribe(
          () => {
            this.dataSaved = "true";
            this.dialogRef.close();
          });
          
          
          
      }
      else
      {
        form.value.UserName =this._store.sessionUsername;
        form.value.CurrentUserRole=this._store.sessionRole;

        this.expenseService.createStudent(form.value).subscribe(
          () => {
            this.dataSaved = "true";
            this.dialogRef.close();
          });
        //form.value.Date = this.datePipe.transform(form.value.Date, 'dd-MM-yyyy');
      //this.expenseService.AddNewFollowup(form.value);
      
      } 
      //console.log("After Save");
      //console.log(this.expenseService.expenses);
     
      //this.closeModel();

  }

  CategorySelected(form)
  {
    if(form.selectedIndex == 0)
      this.formDataFollowup.ExpenseCategory = "--Select Expense Category--";
    else{
      this.fromDataCategoryFilter = this.fromDataCategory.filter(x=> x.CategoryType == form.value);
      //this.formDataFollowup.CategoryName =this.fromDataCategory[form.selectedIndex -1].CategoryName;
      // this.formDataFollowup.ExpenseCategory =this.fromDataCategory[form.selectedIndex -1].CategoryName;
      // console.log(this.formDataFollowup.CategoryName);
      // if(!isNullOrUndefined( this.data)){

      // }
      // else{
      // this.fromDataCategoryFilter = this.fromDataCategory.filter(x=> x.CategoryType == form.value);
      // }
    }
  }
  CategorySelectedReloaded(formval:string,categoryName:string)
  {
    //this.GetCategories();
    if(formval.length == 0)
      this.formDataFollowup.ExpenseCategory = "--Select Expense Category--";
    else{
      //this.fromDataCategoryFilter = this.fromDataCategory.filter(x=> x.CategoryType == formval);
      //this.formDataFollowup.CategoryName =this.fromDataCategory[form.selectedIndex -1].CategoryName;
      // this.formDataFollowup.ExpenseCategory =this.fromDataCategory[form.selectedIndex -1].CategoryName;
      // console.log(this.formDataFollowup.CategoryName);
      if(this.fromDataCategory !== undefined){
      //this.fromDataCategoryFilter = this.fromDataCategory.filter(x=> x.CategoryType == formval);

      this.formDataFollowup.CategoryName= categoryName;
      }
    }
  }

  
  
}
