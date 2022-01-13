
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

//import { LabTestMaster } from './LabTestMaster';
import { LabTestMaster } from '../models/UserData';
import { APIDetails } from '../models/AllConstansts';
@Injectable({
  providedIn: 'root'
})
export class LabTestMainService {

  private apiServer = APIDetails.HelathAPI;//"https://localhost:44380";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  create(LabTestMaster:LabTestMaster): Observable<LabTestMaster> {
    return this.httpClient.post<LabTestMaster>(this.apiServer + '/LabTestMaster/', JSON.stringify(LabTestMaster), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }  
  getById(id:string): Observable<LabTestMaster> {
    return this.httpClient.get<LabTestMaster>(this.apiServer + '/LabTestMaster/' + id)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getTestDetail(TestName:string): Observable<LabTestMaster> {
    return this.httpClient.get<LabTestMaster>(this.apiServer + '/LabTestMaster/getTestDetail/' + TestName)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getByDateStart(DateStart): Observable<LabTestMaster[]> {
    return this.httpClient.get<LabTestMaster[]>(this.apiServer + '/LabTestMaster/GetByDateStart/' + DateStart)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAll(): Observable<LabTestMaster[]> {
    return this.httpClient.get<LabTestMaster[]>(this.apiServer + '/LabTestMaster/')
    .pipe(
      catchError(this.errorHandler)
    )
  }

  createStudent(employee: LabTestMaster): Observable<LabTestMaster> {
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post<LabTestMaster>(this.apiServer + '/LabTestMaster/', employee, httpOptions);
  
  }

  update(id, LabTestMaster): Observable<LabTestMaster> {
    return this.httpClient.put<LabTestMaster>(this.apiServer + '/LabTestMaster/' + id, JSON.stringify(LabTestMaster), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // updateStudent(id:string,employee: UserRegistartion): Observable<UserRegistartion> {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this.http.put<UserRegistartion>(this.apiURL+ '?idt='+id, employee, httpOptions);
  // }

  delete(id){
    return this.httpClient.delete<LabTestMaster>(this.apiServer + '/LabTestMaster/' + id, this.httpOptions)
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

