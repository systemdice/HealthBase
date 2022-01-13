import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

//import { TestsCategory } from './TestsCategory';
import { TestsCategory } from '../models/UserData';
import { APIDetails } from '../models/AllConstansts';

@Injectable({
  providedIn: 'root'
})
export class TestsCategoryService {

  private apiServer =APIDetails.HelathAPI;// "https://localhost:44380";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  create(TestsCategory): Observable<TestsCategory> {
    return this.httpClient.post<TestsCategory>(this.apiServer + '/TestsCategory/', JSON.stringify(TestsCategory), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }  
  getById(id): Observable<TestsCategory> {
    return this.httpClient.get<TestsCategory>(this.apiServer + '/TestsCategory/' + id)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAll(): Observable<TestsCategory[]> {
    return this.httpClient.get<TestsCategory[]>(this.apiServer + '/TestsCategory/')
    .pipe(
      catchError(this.errorHandler)
    )
  }

  createStudent(employee: TestsCategory): Observable<TestsCategory> {
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post<TestsCategory>(this.apiServer + '/TestsCategory/', employee, httpOptions);
  
  }

  update(id, TestsCategory): Observable<TestsCategory> {
    return this.httpClient.put<TestsCategory>(this.apiServer + '/TestsCategory/' + id, JSON.stringify(TestsCategory), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // updateStudent(id:string,employee: UserRegistartion): Observable<UserRegistartion> {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this.http.put<UserRegistartion>(this.apiURL+ '?idt='+id, employee, httpOptions);
  // }

  delete(id){
    return this.httpClient.delete<TestsCategory>(this.apiServer + '/TestsCategory/' + id, this.httpOptions)
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
