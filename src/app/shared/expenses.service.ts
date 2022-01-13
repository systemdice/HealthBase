import { Injectable } from '@angular/core';
import { Expenses } from './Expense.Model';
import {  HttpClientModule, HttpParams } from '@angular/common/http';
//import {Response, RequestOptions, Headers } from '@angular/common/http';
import { filter, map, catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import {  Observable, throwError } from 'rxjs';
import { APIDetails } from './AllConstants';


@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  private apiServer = APIDetails.HelathAPI; //"https://localhost:44380"; //
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  base_url = APIDetails.HelathAPI;//"http://localhost:44380";
  expenses : Expenses[];
  expenseItem : Expenses = new Expenses();


  constructor(private http: HttpClient,private httpClient: HttpClient) { }
  // GetAllExpenses1(): Observable<Expenses[]> {
  //   return this.http.get<Expenses[]>(this.base_url + '/Expenses/')
  //   .pipe(
  //     catchError(this.errorHandler)
  //   )
  // }
  GetAllExpenses(): Observable<Expenses[]> {
    return this.httpClient.get<Expenses[]>(this.base_url + '/Expenses/')
    .pipe(
      catchError(this.errorHandler)
    )
  }





  // GetAllExpenses() : Observable<Expenses[]>
  // {
  // return this.http.get<Expenses[]>(this.base_url + "/Expenses")
  // }


  // GetAllExpenses()
  // {
  //  this.http.get(this.base_url + "/expenses").
  //   subscribe((response) =>
  //   this.expenses = response as Expenses[])
  //  ;
  // }

  // AddNewExpense(employee: Expenses){
    
  //   // return this.http.post(this.base_url + "/Expense", form).
  //   // subscribe((response) => {
  //   //  this.getAll();
  //   //   console.log("submit was completed");
  //   // }
  //   // );
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  // return this.httpClient.post<Expenses>(this.base_url + '/Expenses/', employee, httpOptions);

  // }

  // UpdateExpense(form: Expenses)
  // {
  //   return this.http.put(this.base_url + "Expenses", form)
  //             .subscribe((response)=> {
  //               this.GetAllExpenses();
  //             })
  // }

 

  // DeleteExpense(index: number)
  // {
      
  //   this.http.delete(this.base_url  + "deleteExpense?exp=" + this.expenses[index].Id.toString()).
  //   subscribe((response) => {
  //    this.GetAllExpenses();
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

 create(Expenses): Observable<Expenses> {
  return this.httpClient.post<Expenses>(this.apiServer + '/Expenses/', JSON.stringify(Expenses), this.httpOptions)
  .pipe(
    catchError(this.errorHandler)
  )
}  
getById(id): Observable<Expenses> {
  return this.httpClient.get<Expenses>(this.apiServer + '/Expenses/' + id)
  .pipe(
    catchError(this.errorHandler)
  )
}

getAll(): Observable<Expenses[]> {
  return this.httpClient.get<Expenses[]>(this.apiServer + '/Expenses/')
  .pipe(
    catchError(this.errorHandler)
  )
}

createStudent(employee: Expenses): Observable<Expenses> {
  
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  return this.httpClient.post<Expenses>(this.apiServer + '/Expenses/', employee, httpOptions);

}

update(id:string, employee:Expenses): Observable<Expenses> {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  return this.httpClient.put<Expenses>(this.apiServer + '/Expenses/' + id, JSON.stringify(employee), httpOptions)
  .pipe(
    catchError(this.errorHandler)
  )
}

delete(id){
  return this.httpClient.delete<Expenses>(this.apiServer + '/Expenses/' + id, this.httpOptions)
  .pipe(
    catchError(this.errorHandler)
  )
}

// updateStudent(id:string,employee: UserRegistartion): Observable<UserRegistartion> {
//   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
//   return this.http.put<UserRegistartion>(this.apiURL+ '?idt='+id, employee, httpOptions);
// }

// delete(id){
//   return this.httpClient.delete<Expenses>(this.apiServer + '/Expenses/' + id, this.httpOptions)
//   .pipe(
//     catchError(this.errorHandler)
//   )
// }

}

