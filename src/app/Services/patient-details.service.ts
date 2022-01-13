import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

//import { PatientDetails } from './PatientDetails';
import { PatientDetails } from '../models/UserData';
import { APIDetails } from '../models/AllConstansts';


@Injectable({
  providedIn: 'root'
})
export class PatientDetailsService {

  private apiServer = APIDetails.HelathAPI; //"https://localhost:44380"; //
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  create(PatientDetails): Observable<PatientDetails> {
    return this.httpClient.post<PatientDetails>(this.apiServer + '/PatientDetails/', JSON.stringify(PatientDetails), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }  
  getById(id): Observable<PatientDetails> {
    return this.httpClient.get<PatientDetails>(this.apiServer + '/PatientDetails/' + id)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getUniquePatient(username,contactNumber): Observable<boolean> {
    return this.httpClient.get<boolean>(this.apiServer + '/PatientDetails/getUniquePatient/' + username+"/"+contactNumber)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAll(): Observable<PatientDetails[]> {
    return this.httpClient.get<PatientDetails[]>(this.apiServer + '/PatientDetails/')
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getAllPatientUniqueCheck(): Observable<PatientDetails[]> {
    return this.httpClient.get<PatientDetails[]>(this.apiServer + '/PatientDetails/getAllPatientUniqueCheck')
    .pipe(
      catchError(this.errorHandler)
    )
  }

  createStudent(employee: PatientDetails): Observable<PatientDetails> {
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post<PatientDetails>(this.apiServer + '/PatientDetails/', employee, httpOptions);
  
  }

  update(id, PatientDetails): Observable<PatientDetails> {
    return this.httpClient.put<PatientDetails>(this.apiServer + '/PatientDetails/' + id, JSON.stringify(PatientDetails), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // updateStudent(id:string,employee: UserRegistartion): Observable<UserRegistartion> {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this.http.put<UserRegistartion>(this.apiURL+ '?idt='+id, employee, httpOptions);
  // }

  delete(id){
    return this.httpClient.delete<PatientDetails>(this.apiServer + '/PatientDetails/' + id, this.httpOptions)
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
