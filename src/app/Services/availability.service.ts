import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

//import { Availability } from './Availability';
import { Availability } from '../models/UserData';
import { APIDetails } from '../models/AllConstansts';
@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {

  private apiServer = APIDetails.HelathAPI;//"https://localhost:44380";//
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  create(Availability): Observable<Availability> {
    return this.httpClient.post<Availability>(this.apiServer + '/Availability/', JSON.stringify(Availability), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }  
  getById(id): Observable<Availability> {
    return this.httpClient.get<Availability>(this.apiServer + '/Availability/' + id)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getByDateStart(DateStart): Observable<Availability[]> {
    return this.httpClient.get<Availability[]>(this.apiServer + '/Availability/GetByDateStart/' + DateStart)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getByAvlName(paramVal): Observable<Availability> {
    return this.httpClient.get<Availability>(this.apiServer + '/Availability/Getanything/' + paramVal)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAll(): Observable<Availability[]> {
    return this.httpClient.get<Availability[]>(this.apiServer + '/Availability/')
    .pipe(
      catchError(this.errorHandler)
    )
  }

  createStudent(employee: Availability): Observable<Availability> {
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post<Availability>(this.apiServer + '/Availability/', employee, httpOptions);
  
  }

  update(id, Availability): Observable<Availability> {
    return this.httpClient.put<Availability>(this.apiServer + '/Availability/' + id, JSON.stringify(Availability), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // updateStudent(id:string,employee: UserRegistartion): Observable<UserRegistartion> {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this.http.put<UserRegistartion>(this.apiURL+ '?idt='+id, employee, httpOptions);
  // }

  delete(id){
    return this.httpClient.delete<Availability>(this.apiServer + '/Availability/' + id, this.httpOptions)
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
