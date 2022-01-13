import { Injectable } from '@angular/core';
import { Expenses } from './Expense.Model';
import {  HttpClientModule, HttpParams } from '@angular/common/http';
//import {Response, RequestOptions, Headers } from '@angular/common/http';
import { filter, map, catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import {  Observable, throwError } from 'rxjs';
import { APIDetails } from './AllConstants';
import { Followup } from './Followup.Model';


@Injectable({
  providedIn: 'root'
})
export class FollowupService {
  private apiServer = APIDetails.HelathAPI; //"https://localhost:44380"; //
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  base_url = APIDetails.HelathAPI;//"http://localhost:44380";
  followup : Followup[];
  expenseItem : Followup = new Followup();


  constructor(private http: HttpClient,private httpClient: HttpClient) { }
  // GetAllFollowup1(): Observable<Followup[]> {
  //   return this.http.get<Followup[]>(this.base_url + '/Followup/')
  //   .pipe(
  //     catchError(this.errorHandler)
  //   )
  // }
  GetAllFollowup(): Observable<Followup[]> {
    return this.httpClient.get<Followup[]>(this.base_url + '/Followup/')
    .pipe(
      catchError(this.errorHandler)
    )
  }





  // GetAllFollowup() : Observable<Followup[]>
  // {
  // return this.http.get<Followup[]>(this.base_url + "/Followup")
  // }


  // GetAllFollowup()
  // {
  //  this.http.get(this.base_url + "/followup").
  //   subscribe((response) =>
  //   this.followup = response as Followup[])
  //  ;
  // }

  // AddNewExpense(employee: Followup){
    
  //   // return this.http.post(this.base_url + "/Expense", form).
  //   // subscribe((response) => {
  //   //  this.getAll();
  //   //   console.log("submit was completed");
  //   // }
  //   // );
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  // return this.httpClient.post<Followup>(this.base_url + '/Followup/', employee, httpOptions);

  // }

  // UpdateExpense(form: Followup)
  // {
  //   return this.http.put(this.base_url + "Followup", form)
  //             .subscribe((response)=> {
  //               this.GetAllFollowup();
  //             })
  // }

 

  // DeleteExpense(index: number)
  // {
      
  //   this.http.delete(this.base_url  + "deleteExpense?exp=" + this.followup[index].Id.toString()).
  //   subscribe((response) => {
  //    this.GetAllFollowup();
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

 create(Followup): Observable<Followup> {
  return this.httpClient.post<Followup>(this.apiServer + '/Followup/', JSON.stringify(Followup), this.httpOptions)
  .pipe(
    catchError(this.errorHandler)
  )
}  
getById(id): Observable<Followup> {
  return this.httpClient.get<Followup>(this.apiServer + '/Followup/' + id)
  .pipe(
    catchError(this.errorHandler)
  )
}

getAll(): Observable<Followup[]> {
  return this.httpClient.get<Followup[]>(this.apiServer + '/Followup/')
  .pipe(
    catchError(this.errorHandler)
  )
}

createStudent(employee: Followup): Observable<Followup> {
  
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  return this.httpClient.post<Followup>(this.apiServer + '/Followup/', employee, httpOptions);

}

update(id:string, employee:Followup): Observable<Followup> {
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  return this.httpClient.put<Followup>(this.apiServer + '/Followup/' + id, JSON.stringify(employee), httpOptions)
  .pipe(
    catchError(this.errorHandler)
  )
}

delete(id){
  return this.httpClient.delete<Followup>(this.apiServer + '/Followup/' + id, this.httpOptions)
  .pipe(
    catchError(this.errorHandler)
  )
}

// updateStudent(id:string,employee: UserRegistartion): Observable<UserRegistartion> {
//   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
//   return this.http.put<UserRegistartion>(this.apiURL+ '?idt='+id, employee, httpOptions);
// }

// delete(id){
//   return this.httpClient.delete<Followup>(this.apiServer + '/Followup/' + id, this.httpOptions)
//   .pipe(
//     catchError(this.errorHandler)
//   )
// }

}

