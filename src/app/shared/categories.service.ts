import { Injectable } from '@angular/core';
import {  HttpClientModule } from '@angular/common/http';
import { CategoryModel } from './Category.Model';
import { Category } from './Expense.Model';
import {   HttpParams } from '@angular/common/http';
//import {Response, RequestOptions, Headers } from '@angular/common/http';
import { filter, map, catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import {  Observable, throwError } from 'rxjs';
import { APIDetails } from './AllConstants';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiServer = APIDetails.HelathAPI; //"https://localhost:44380"; //
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

base_url = APIDetails.HelathAPI; //"https://localhost:44380";
expenses : Category[];
  expenseItem : Category = new Category();

  constructor(private http: HttpClient,private httpClient: HttpClient) { }

GetCategories() 
{
  return this.http.get(this.base_url + "/Category");
}
GetCategoriesDailyExpense(mainCategory:string) 
{
  return this.http.get(this.base_url + "/Category/getDetailType/"+mainCategory);
}




  // GetAllCategory() : Observable<Category[]>
  // {
  // return this.http.get<Category[]>(this.base_url + "/Category")
  // }


  // GetAllCategory()
  // {
  //  this.http.get(this.base_url + "/expenses").
  //   subscribe((response) =>
  //   this.expenses = response as Category[])
  //  ;
  // }

  // AddNewExpense(employee: Category){
    
  //   // return this.http.post(this.base_url + "/Expense", form).
  //   // subscribe((response) => {
  //   //  this.getAll();
  //   //   console.log("submit was completed");
  //   // }
  //   // );
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  // return this.httpClient.post<Category>(this.base_url + '/Category/', employee, httpOptions);

  // }

  // UpdateExpense(form: Category)
  // {
  //   return this.http.put(this.base_url + "Category", form)
  //             .subscribe((response)=> {
  //               this.GetAllCategory();
  //             })
  // }

 

  // DeleteExpense(index: number)
  // {
      
  //   this.http.delete(this.base_url  + "deleteExpense?exp=" + this.expenses[index].Id.toString()).
  //   subscribe((response) => {
  //    this.GetAllCategory();
  //     console.log("submit was completed");
  //   }
  //   );
  // }

  errorHandler(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
 }

 create(Category): Observable<Category> {
  return this.httpClient.post<Category>(this.apiServer + '/Category/', JSON.stringify(Category), this.httpOptions)
  .pipe(
    catchError(this.errorHandler)
  )
}  
getById(id): Observable<Category> {
  return this.httpClient.get<Category>(this.apiServer + '/Category/' + id)
  .pipe(
    catchError(this.errorHandler)
  )
}

getAll(): Observable<Category[]> {
  return this.httpClient.get<Category[]>(this.apiServer + '/Category/')
  .pipe(
    catchError(this.errorHandler)
  )
}
getAllLeaves(mainCategory:string): Observable<Category[]> {
  return this.httpClient.get<Category[]>(this.apiServer + '/Category/getDetailType/'+mainCategory)
  .pipe(
    catchError(this.errorHandler)
  )
}


createStudent(employee: Category): Observable<Category> {
 
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  return this.httpClient.post<Category>(this.apiServer + '/Category/', employee, httpOptions);

}

update(id:string, employee:Category): Observable<Category> {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  return this.httpClient.put<Category>(this.apiServer + '/Category/' + id, JSON.stringify(employee), httpOptions)
  .pipe(
    catchError(this.errorHandler)
  )
}

delete(id){
  return this.httpClient.delete<Category>(this.apiServer + '/Category/' + id, this.httpOptions)
  .pipe(
    catchError(this.errorHandler)
  )
}



}

