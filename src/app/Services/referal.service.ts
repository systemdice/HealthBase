
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


import { ReferralMaster } from '../models/UserData';
import { APIDetails } from '../models/AllConstansts';

@Injectable({
  providedIn: 'root'
})
export class RefaralService {

  private apiServer = APIDetails.HelathAPI;//"https://localhost:44380";//
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  create(ReferralMaster): Observable<ReferralMaster> {
    return this.httpClient.post<ReferralMaster>(this.apiServer + '/ReferralMaster/', JSON.stringify(ReferralMaster), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }  
  getById(id): Observable<ReferralMaster> {
    return this.httpClient.get<ReferralMaster>(this.apiServer + '/ReferralMaster/' + id)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAll(): Observable<ReferralMaster[]> {
    return this.httpClient.get<ReferralMaster[]>(this.apiServer + '/ReferralMaster/')
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getAllStaffType(): Observable<ReferralMaster[]> {
    return this.httpClient.get<ReferralMaster[]>(this.apiServer + '/ReferralMaster/getAllStaffType/')
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getStaffType(staff:string): Observable<ReferralMaster[]> {
    return this.httpClient.get<ReferralMaster[]>(this.apiServer + '/ReferralMaster/getStaffType/'+staff)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  createStudent(employee: ReferralMaster): Observable<ReferralMaster> {
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post<ReferralMaster>(this.apiServer + '/ReferralMaster/', employee, httpOptions);
  
  }

  update(id, ReferralMaster): Observable<ReferralMaster> {
    return this.httpClient.put<ReferralMaster>(this.apiServer + '/ReferralMaster/' + id, JSON.stringify(ReferralMaster), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // updateStudent(id:string,employee: UserRegistartion): Observable<UserRegistartion> {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this.http.put<UserRegistartion>(this.apiURL+ '?idt='+id, employee, httpOptions);
  // }

  delete(id){
    return this.httpClient.delete<ReferralMaster>(this.apiServer + '/ReferralMaster/' + id, this.httpOptions)
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
