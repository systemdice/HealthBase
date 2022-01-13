  

 import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

//import { UnitsCategory } from './UnitsCategory';
import { UnitsCategory } from '../models/UserData';
import { APIDetails } from '../models/AllConstansts';

@Injectable({
  providedIn: 'root'
})
export class UnitsCategoryService {

  private apiServer = APIDetails.HelathAPI; //"https://localhost:44380";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  create(UnitsCategory): Observable<UnitsCategory> {
    return this.httpClient.post<UnitsCategory>(this.apiServer + '/UnitsCategory/', JSON.stringify(UnitsCategory), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }  
  getById(id): Observable<UnitsCategory> {
    return this.httpClient.get<UnitsCategory>(this.apiServer + '/UnitsCategory/' + id)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAll(): Observable<UnitsCategory[]> {
    return this.httpClient.get<UnitsCategory[]>(this.apiServer + '/UnitsCategory/')
    .pipe(
      catchError(this.errorHandler)
    )
  }

  createStudent(employee: UnitsCategory): Observable<UnitsCategory> {
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post<UnitsCategory>(this.apiServer + '/UnitsCategory/', employee, httpOptions);
  
  }

  update(id, UnitsCategory): Observable<UnitsCategory> {
    return this.httpClient.put<UnitsCategory>(this.apiServer + '/UnitsCategory/' + id, JSON.stringify(UnitsCategory), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // updateStudent(id:string,employee: UserRegistartion): Observable<UserRegistartion> {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this.http.put<UserRegistartion>(this.apiURL+ '?idt='+id, employee, httpOptions);
  // }

  delete(id){
    return this.httpClient.delete<UnitsCategory>(this.apiServer + '/UnitsCategory/' + id, this.httpOptions)
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
