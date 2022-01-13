import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

//import { AppointmentDetail } from './AppointmentDetail';
import { AppointmentDetail } from '../models/UserData';
import { APIDetails } from '../models/AllConstansts';
@Injectable({
  providedIn: 'root'
})
export class AppointmentDetailService {

  private apiServer = APIDetails.HelathAPI;//"https://localhost:44380";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  create(AppointmentDetail): Observable<AppointmentDetail> {
    return this.httpClient.post<AppointmentDetail>(this.apiServer + '/AppointmentDetail/', JSON.stringify(AppointmentDetail), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }  
  getById(id): Observable<AppointmentDetail> {
    return this.httpClient.get<AppointmentDetail>(this.apiServer + '/AppointmentDetail/' + id)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getByDateStart(DateStart): Observable<AppointmentDetail[]> {
    return this.httpClient.get<AppointmentDetail[]>(this.apiServer + '/AppointmentDetail/GetByDateStart/' + DateStart)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAll(): Observable<AppointmentDetail[]> {
    return this.httpClient.get<AppointmentDetail[]>(this.apiServer + '/AppointmentDetail/')
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getWaitingAppointmnet(): Observable<AppointmentDetail[]> {
    return this.httpClient.get<AppointmentDetail[]>(this.apiServer + '/AppointmentDetail/getWaitingAppointmnet/')
    .pipe(
      catchError(this.errorHandler)
    )
  }

  createStudent(employee: AppointmentDetail): Observable<AppointmentDetail> {
   
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post<AppointmentDetail>(this.apiServer + '/AppointmentDetail/', employee, httpOptions);
  
  }

  update(id, AppointmentDetail): Observable<AppointmentDetail> {
    return this.httpClient.put<AppointmentDetail>(this.apiServer + '/AppointmentDetail/' + id, JSON.stringify(AppointmentDetail), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // updateStudent(id:string,employee: UserRegistartion): Observable<UserRegistartion> {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this.http.put<UserRegistartion>(this.apiURL+ '?idt='+id, employee, httpOptions);
  // }

  delete(id){
    return this.httpClient.delete<AppointmentDetail>(this.apiServer + '/AppointmentDetail/' + id, this.httpOptions)
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
