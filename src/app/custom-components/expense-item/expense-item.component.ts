import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from  '@angular/material';
import { Expenses } from 'src/app/shared/Expense.Model';
import { CategoryModel } from './../../shared/Category.Model';
import { CategoriesService } from 'src/app/shared/categories.service';
import { NgForm } from '@angular/forms';
import { ExpensesService } from 'src/app/shared/expenses.service';
import { from } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { DateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';
export interface IUser {
  Id: string;
  Name:string;
}

@Component({
  selector: 'app-expense-item',
  templateUrl: './expense-item.component.html',
  styleUrls: ['./expense-item.component.css']
})
export class ExpenseItemComponent implements OnInit {

  formDataExpense : Expenses = new Expenses();
  fromDataCategory : CategoryModel[];
  ExpenseType: any[] = [
    { "Id": "1234", "Name": "Expense"},
    { "Id": "1234", "Name": "Income"}
  
  ]

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef : MatDialogRef<ExpenseItemComponent>,
    private catService : CategoriesService,
    private expenseService : ExpensesService,
    private dateAdapter: DateAdapter<Date>,
    private datePipe: DatePipe
  ) { 
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
  }

  ngOnInit() {

    this.GetCategories();
    this.formDataExpense.BusinessType = "Expense";
    if(!isNullOrUndefined( this.data))
    {
      //console.log(this.data);
      this.formDataExpense = Object.assign({},this.data);
    }
     
  }
  closeModel()
  {
    this.dialogRef.close({event:'Cancel'});
  }

  GetCategories()
  {
    this.catService.GetCategories()
    .subscribe((respose) => 
        this.fromDataCategory = respose as CategoryModel[]
    )
  }
dataSaved:string;
  onSubmit(form:NgForm){
      //console.log(form.value);
      form.value.Date= this.datePipe.transform(this.formDataExpense.Date, 'MM/dd/yyyy');
      this.formDataExpense.Date = this.datePipe.transform(this.formDataExpense.Date, 'dd-MM-yyyy');
      if(!isNullOrUndefined( this.data))
      {
        this.expenseService.update(this.data.UnqueID,form.value).subscribe(
          () => {
            this.dataSaved = "true";
            this.dialogRef.close();
          });
          
          
          
      }
      else
      {

        this.expenseService.createStudent(form.value).subscribe(
          () => {
            this.dataSaved = "true";
            this.dialogRef.close();
          });
        //form.value.Date = this.datePipe.transform(form.value.Date, 'dd-MM-yyyy');
      //this.expenseService.AddNewExpense(form.value);
      
      } 
      //console.log("After Save");
      //console.log(this.expenseService.expenses);
     
      //this.closeModel();

  }

  CategorySelected(form)
  {
    if(form.selectedIndex == 0)
      this.formDataExpense.CategoryName = "";
    else{
      //this.formDataExpense.CategoryName =this.fromDataCategory[form.selectedIndex -1].ExpenseCategory;
      this.formDataExpense.CategoryName =this.fromDataCategory[form.selectedIndex -1].Name;
      //console.log(this.formDataExpense.CategoryName);
    }
  }
}
