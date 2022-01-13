import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

//import { LeaveMangement } from './LeaveMangement';
import { LeaveMangement } from '../models/UserData';
import { APIDetails } from '../models/AllConstansts';

@Injectable({
  providedIn: 'root'
})
export class LeaveManagementService {

  private apiServer = APIDetails.HelathAPI; //"https://localhost:44380";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  create(LeaveMangement): Observable<LeaveMangement> {
    return this.httpClient.post<LeaveMangement>(this.apiServer + '/LeaveMangement/', JSON.stringify(LeaveMangement), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }  
  getById(id): Observable<LeaveMangement> {
    return this.httpClient.get<LeaveMangement>(this.apiServer + '/LeaveMangement/' + id)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAll(): Observable<LeaveMangement[]> {
    return this.httpClient.get<LeaveMangement[]>(this.apiServer + '/LeaveMangement/')
    .pipe(
      catchError(this.errorHandler)
    )
  }

  createStudent(employee: LeaveMangement): Observable<LeaveMangement> {
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post<LeaveMangement>(this.apiServer + '/LeaveMangement/', employee, httpOptions);
  
  }

  update(id, LeaveMangement): Observable<LeaveMangement> {
    return this.httpClient.put<LeaveMangement>(this.apiServer + '/LeaveMangement/' + id, JSON.stringify(LeaveMangement), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // updateStudent(id:string,employee: UserRegistartion): Observable<UserRegistartion> {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this.http.put<UserRegistartion>(this.apiURL+ '?idt='+id, employee, httpOptions);
  // }

  delete(id){
    return this.httpClient.delete<LeaveMangement>(this.apiServer + '/LeaveMangement/' + id, this.httpOptions)
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

