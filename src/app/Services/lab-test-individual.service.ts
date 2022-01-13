
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

//import { LabTestIndividual } from './LabTestIndividual';
import { LabTestIndividual } from '../models/UserData';
import { APIDetails } from '../models/AllConstansts';
@Injectable({
  providedIn: 'root'
})
export class LabTestIndividualService {

  private apiServer = APIDetails.HelathAPI;//"https://localhost:44380";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  create(LabTestIndividual:LabTestIndividual): Observable<LabTestIndividual> {
    return this.httpClient.post<LabTestIndividual>(this.apiServer + '/LabTestIndividual/', JSON.stringify(LabTestIndividual), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }  
  getById(id:string): Observable<LabTestIndividual> {
    return this.httpClient.get<LabTestIndividual>(this.apiServer + '/LabTestIndividual/' + id)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getLabIndividualByCaseID(caseID:string,testName:string,parentTest:string): Observable<LabTestIndividual[]> {
    return this.httpClient.get<LabTestIndividual[]>(this.apiServer + '/LabTestIndividual/getLabIndividualByCaseID/' + caseID+'/'+testName+'/'+parentTest)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getAllLabIndividualByCaseID(caseID:string,reportStatus:string,parentTest:string): Observable<LabTestIndividual[]> {
    return this.httpClient.get<LabTestIndividual[]>(this.apiServer + '/LabTestIndividual/getAllLabIndividualByCaseID/' + caseID+'/'+reportStatus+'/'+parentTest)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getLabIndividualByCaseIDF(caseID:string,testName:string,parentTest:string): Observable<LabTestIndividual[]> {
    return this.httpClient.get<LabTestIndividual[]>(this.apiServer + '/LabTestIndividual/getLabIndividualByCaseID/' + caseID+'/'+testName+'/'+parentTest)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getLabIndividualByStatus(): Observable<LabTestIndividual[]> {
    return this.httpClient.get<LabTestIndividual[]>(this.apiServer + '/LabTestIndividual/getLabIndividualByStatus/' )
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getByDateStart(DateStart): Observable<LabTestIndividual[]> {
    return this.httpClient.get<LabTestIndividual[]>(this.apiServer + '/LabTestIndividual/GetByDateStart/' + DateStart)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAll(): Observable<LabTestIndividual[]> {
    return this.httpClient.get<LabTestIndividual[]>(this.apiServer + '/LabTestIndividual/')
    .pipe(
      catchError(this.errorHandler)
    )
  }

  createStudent(employee: LabTestIndividual): Observable<LabTestIndividual> {
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post<LabTestIndividual>(this.apiServer + '/LabTestIndividual/', employee, httpOptions);
  
  }

  update(id, LabTestIndividual): Observable<LabTestIndividual> {
    return this.httpClient.put<LabTestIndividual>(this.apiServer + '/LabTestIndividual/' + id, JSON.stringify(LabTestIndividual), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // updateStudent(id:string,employee: UserRegistartion): Observable<UserRegistartion> {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this.http.put<UserRegistartion>(this.apiURL+ '?idt='+id, employee, httpOptions);
  // }

  delete(id){
    return this.httpClient.delete<LabTestIndividual>(this.apiServer + '/LabTestIndividual/' + id, this.httpOptions)
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

