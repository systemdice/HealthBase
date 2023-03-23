import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

//import { UserDetails } from './UserDetails';
import { Patient, UserDetails } from '../models/UserData';
import { APIDetails } from '../models/AllConstansts';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  private apiServer =  APIDetails.HelathAPI; //"https://localhost:44380"; //
  url = 'https://localhost:44362/api/PersonDetails';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  getAllPatient(): Observable<Patient[]> {
    return this.httpClient.get<Patient[]>(this.url + '/GetAllPersons');
  }

  create(UserDetails): Observable<UserDetails> {
    return this.httpClient.post<UserDetails>(this.apiServer + '/UserDetails/', JSON.stringify(UserDetails), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }  
  getById(id): Observable<UserDetails> {
    return this.httpClient.get<UserDetails>(this.apiServer + '/UserDetails/' + id)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAll(): Observable<UserDetails[]> {
    return this.httpClient.get<UserDetails[]>(this.apiServer + '/UserDetails/')
    .pipe(
      catchError(this.errorHandler)
    )
  }
  GetLoginDetails(UName:string, pwd:string): Observable<UserDetails[]> {
    return this.httpClient.get<UserDetails[]>(this.apiServer + '/UserDetails/GetLoginDetails/'+ UName+'/'+pwd)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAllAdmins(): Observable<UserDetails[]> {
    return this.httpClient.get<UserDetails[]>(this.apiServer + '/UserDetails/')
    .pipe(
      catchError(this.errorHandler)
    )
  }

  createStudent(employee: UserDetails): Observable<UserDetails> {
    
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post<UserDetails>(this.apiServer + '/UserDetails/', employee, httpOptions);
  
  }

  update(id, UserDetails): Observable<UserDetails> {
    return this.httpClient.put<UserDetails>(this.apiServer + '/UserDetails/' + id, JSON.stringify(UserDetails), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // updateStudent(id:string,employee: UserRegistartion): Observable<UserRegistartion> {
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this.http.put<UserRegistartion>(this.apiURL+ '?idt='+id, employee, httpOptions);
  // }

  delete(id){
    return this.httpClient.delete<UserDetails>(this.apiServer + '/UserDetails/' + id, this.httpOptions)
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
