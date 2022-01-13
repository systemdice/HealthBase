

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

//import { PaymentHistory } from './PaymentHistory';
import { PaymentHistory } from '../models/UserData';
import { APIDetails } from '../models/AllConstansts';
@Injectable({
  providedIn: 'root'
})
export class PaymentHistoryService {

  private apiServer = APIDetails.HelathAPI;//"https://localhost:44380";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  create(PaymentHistory:PaymentHistory): Observable<PaymentHistory> {
    return this.httpClient.post<PaymentHistory>(this.apiServer + '/PaymentHistory/', JSON.stringify(PaymentHistory), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }  
  getById(id:string): Observable<PaymentHistory> {
    return this.httpClient.get<PaymentHistory>(this.apiServer + '/PaymentHistory/' + id)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getByDateStart(DateStart): Observable<PaymentHistory[]> {
    return this.httpClient.get<PaymentHistory[]>(this.apiServer + '/PaymentHistory/GetByDateStart/' + DateStart)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAll(): Observable<PaymentHistory[]> {
    return this.httpClient.get<PaymentHistory[]>(this.apiServer + '/PaymentHistory/')
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getPaymentsByCaseID(CaseID:string): Observable<PaymentHistory[]> {
    return this.httpClient.get<PaymentHistory[]>(this.apiServer + '/PaymentHistory/getPaymentHistoryByCaseID/'+CaseID)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  createStudent(employee: PaymentHistory): Observable<PaymentHistory> {
   
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post<PaymentHistory>(this.apiServer + '/PaymentHistory/', employee, httpOptions);
  
  }

  update(id, PaymentHistory): Observable<PaymentHistory> {
    return this.httpClient.put<PaymentHistory>(this.apiServer + '/PaymentHistory/' + id, JSON.stringify(PaymentHistory), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // updateStudent(id:string,employee: UserRegistartion): Observable<UserRegistartion> {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this.http.put<UserRegistartion>(this.apiURL+ '?idt='+id, employee, httpOptions);
  // }

  delete(id){
    return this.httpClient.delete<PaymentHistory>(this.apiServer + '/PaymentHistory/' + id, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  errorHandler(error) {
     let errorMessage = '';
     if(error.error instanceof ErrorEvent) {
       // Get client-side error
       errorMessage = error.error.message;
     } else {
       // Get server-side error
       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
     }
     //console.log(errorMessage);
     return throwError(errorMessage);
  }
}

