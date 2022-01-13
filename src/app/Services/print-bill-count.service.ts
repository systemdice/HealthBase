
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

//import { PrintBill } from './PrintBill';
import { PrintBill } from '../models/UserData';
import { APIDetails } from '../models/AllConstansts';


@Injectable({
  providedIn: 'root'
})
export class PrintBillCountService {

  private apiServer = APIDetails.HelathAPI; //"https://localhost:44380"; //
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  create(PrintBill): Observable<PrintBill> {
    return this.httpClient.post<PrintBill>(this.apiServer + '/PrintBill/', JSON.stringify(PrintBill), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }  
  getById(id): Observable<PrintBill> {
    return this.httpClient.get<PrintBill>(this.apiServer + '/PrintBill/' + id)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getUniquePatient(username,contactNumber): Observable<boolean> {
    return this.httpClient.get<boolean>(this.apiServer + '/PrintBill/getUniquePatient/' + username+"/"+contactNumber)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAll(): Observable<PrintBill[]> {
    return this.httpClient.get<PrintBill[]>(this.apiServer + '/PrintBill/')
    .pipe(
      catchError(this.errorHandler)
    )
  }

  createStudent(employee: PrintBill): Observable<PrintBill> {
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post<PrintBill>(this.apiServer + '/PrintBill/', employee, httpOptions);
  
  }

  update(id, PrintBill): Observable<PrintBill> {
    return this.httpClient.put<PrintBill>(this.apiServer + '/PrintBill/' + id, JSON.stringify(PrintBill), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // updateStudent(id:string,employee: UserRegistartion): Observable<UserRegistartion> {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this.http.put<UserRegistartion>(this.apiURL+ '?idt='+id, employee, httpOptions);
  // }

  delete(id){
    return this.httpClient.delete<PrintBill>(this.apiServer + '/PrintBill/' + id, this.httpOptions)
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
     console.log(errorMessage);
     return throwError(errorMessage);
  }
}


