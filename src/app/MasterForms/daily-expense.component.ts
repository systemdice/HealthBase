import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CategoriesService } from '../shared/categories.service';
import { Category } from '../shared/Expense.Model';
@Component({
  selector: 'app-daily-expense',  
  templateUrl: './daily-expense.component.html',
  styleUrls: ['./daily-expense.component.css']
})
export class DailyExpenseComponent implements OnInit {
@Input() CaseDetails;
@Input() DailyExpense : FormGroup;
@Input() caseid:string; 
myDate = new Date();
@Output() getSearchStatusChange = new EventEmitter<boolean>();
ll:string;

expenses = ['Ambulance','Food.', 'Medicine', 'DoctorVisit','Other'];
     selected = 'Other';
constructor(private fb: FormBuilder,private datePipe: DatePipe,private catagoryService : CategoriesService) {
  this.ll = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
  // this.DailyExpense = this.fb.group({
  //   teachers: this.fb.array([]),
  // })
}
DailyExpensePlaceholder:string="Enter the description";
fromDataCategory:Category[];
onBookChange(ob) {
  console.log('Book changed...');
  let selectedBook = ob.value;
  if(selectedBook == 'Ambulance'){
    this.DailyExpensePlaceholder="Ambulance Number-Driver Name";
  }
  else{
    this.DailyExpensePlaceholder="Enter the Description";
  }
 //alert(selectedBook);
}
oninputChange(per: string) {
  //alert('hi');
  this.getSearchStatusChange.emit(true);
}
 /** Teachers */
 teachers(): FormArray {
  return this.DailyExpense.get("teachers") as FormArray
}

newTeacher(): FormGroup {
  return this.fb.group({
    name: '',
    ExpenseDescription:'',
    Amount:'',
    expDate:[this.datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm:ss')]
    //expDate:''
  })
}


addTeacher() {
  this.teachers().push(this.newTeacher());
}


removeTeacher(ti) {
  this.teachers().removeAt(ti);
}

GetCategories()
  {
    this.catagoryService.GetCategoriesDailyExpense('DailyExpense')
    .subscribe((respose) => {
        this.fromDataCategory = respose as Category[];
        this.fromDataCategory = this.fromDataCategory.filter(e=> e.CategoryType == 'DailyExpense');
    });
  }
  ngOnInit(): void {
    //alert(this.caseid);
    this.ll = this.datePipe.transform(this.myDate, 'dd-MM-yyyy hh:mm:ss');
    if(this.caseid == '' && this.teachers().length < 1)
    {
    this.addTeacher();
    }
    this.GetCategories();
  }

}
